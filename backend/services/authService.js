import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import supabase from "../utils/supabaseClient.js";

const resetCodes = new Map();
const resetCodeTtlMs = 10 * 60 * 1000;
const authProviderTimeoutMs = Number(process.env.AUTH_PROVIDER_TIMEOUT_MS || 12000);

function withTimeout(promise, timeoutMs, operationName) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${operationName} timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    }),
  ]);
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function createSixDigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 0);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
    user,
    pass,
    fromEmail: process.env.SMTP_FROM_EMAIL || user,
    fromName: process.env.SMTP_FROM_NAME || "MyTrancy",
  };
}

function isProductionEnvironment() {
  return String(process.env.NODE_ENV || "").toLowerCase() === "production";
}

function isDevResetFallbackEnabled() {
  const flag = String(
    process.env.ALLOW_DEV_RESET_CODE_FALLBACK || "",
  ).toLowerCase();
  if (flag === "false") {
    return false;
  }

  return true;
}

function getResetCodeEdgeFunctionConfig() {
  const explicitUrl = String(process.env.RESET_CODE_FUNCTION_URL || "").trim();
  const supabaseUrl = String(process.env.SUPABASE_URL || "")
    .trim()
    .replace(/\/$/, "");
  const key =
    String(process.env.RESET_CODE_FUNCTION_KEY || "").trim() ||
    String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim() ||
    String(process.env.SUPABASE_KEY || "").trim();

  const url =
    explicitUrl ||
    (supabaseUrl ? `${supabaseUrl}/functions/v1/send-reset-code` : "");
  if (!url || !key) {
    return null;
  }

  return { url, key };
}

async function sendResetCodeViaEdgeFunction({ email, code }) {
  const config = getResetCodeEdgeFunctionConfig();
  if (!config) {
    throw new Error(
      "Reset code edge function is not configured. Set RESET_CODE_FUNCTION_URL and RESET_CODE_FUNCTION_KEY (or SUPABASE_URL with SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
    },
    body: JSON.stringify({ email, code }),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const details =
      payload?.error || payload?.message || `status ${response.status}`;
    throw new Error(`Edge function delivery failed: ${details}`);
  }

  if (payload?.error) {
    throw new Error(`Edge function delivery failed: ${payload.error}`);
  }
}

async function sendResetCodeEmail({ email, code }) {
  try {
    await sendResetCodeViaEdgeFunction({ email, code });
    return;
  } catch (edgeError) {
    const smtpConfig = getSmtpConfig();
    if (!smtpConfig) {
      throw edgeError;
    }

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    await transporter.sendMail({
      from: `MyTrancy <${smtpConfig.fromEmail}>`,
      to: email,
      subject: "Password Reset Code - MyTrancy",
      text: `Your reset code is ${code}. This code expires in 10 minutes.`,
      html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Password Reset Request</h2>
					<p>You requested a password reset for your MyTrancy account.</p>
					<p>Your reset code is: <strong style="font-size: 24px; color: #007bff;">${code}</strong></p>
					<p>This code will expire in 10 minutes.</p>
					<p>If you didn't request this, please ignore this email.</p>
					<p>Best regards,<br>MyTrancy Team</p>
				</div>
			`,
    });
  }
}

function extractMissingColumnName(error) {
  const message = String(error?.message || "");
  const match = message.match(/'([^']+)'\s+column/i);
  if (!match) {
    return null;
  }

  return match[1];
}

function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return null;
  }

  return createClient(process.env.SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getServiceRoleClient() {
  const adminClient = getAdminClient();
  if (adminClient) {
    return adminClient;
  }

  return supabase;
}

async function syncPublicUserProfile(user, name) {
  const adminClient = getAdminClient();
  if (!adminClient || !user?.id) {
    return;
  }

  let payload = {
    id: user.id,
    email: user.email,
    name: name ?? user.user_metadata?.name ?? null,
    password: "supabase_auth_managed",
    updated_at: new Date().toISOString(),
  };

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { error } = await adminClient
      .from("users")
      .upsert(payload, { onConflict: "id" });
    if (!error) {
      return;
    }

    const message = String(error.message || "").toLowerCase();
    if (
      message.includes("relation") ||
      message.includes("does not exist") ||
      error.code === "42P01"
    ) {
      return;
    }

    const missingColumn = extractMissingColumnName(error);
    if (
      missingColumn &&
      Object.prototype.hasOwnProperty.call(payload, missingColumn)
    ) {
      const { [missingColumn]: removedColumn, ...nextPayload } = payload;
      void removedColumn;
      payload = nextPayload;
      continue;
    }

    return;
  }
}

async function findUserIdByEmail(email) {
  const adminClient = getAdminClient();
  if (!adminClient) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for code-based password reset",
    );
  }

  const normalized = normalizeEmail(email);
  let page = 1;
  while (page <= 10) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) {
      throw new Error(error.message);
    }

    const users = data?.users ?? [];
    const matched = users.find(
      (user) => normalizeEmail(user.email) === normalized,
    );
    if (matched) {
      return matched.id;
    }

    if (users.length < 1000) {
      break;
    }

    page += 1;
  }

  throw new Error("No account found for this email");
}

function buildAuthToken(user, rememberMe = false) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: rememberMe ? "7d" : "1d" },
  );
}

export async function signup({ email, password, name }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedName = String(name).trim();
  const normalizedPassword = String(password);

  const serviceClient = getServiceRoleClient();
  const isAdminClient = Boolean(getAdminClient());

  const { data, error } = isAdminClient
    ? await serviceClient.auth.admin.createUser({
        email: normalizedEmail,
        password: normalizedPassword,
        email_confirm: true,
        user_metadata: {
          name: normalizedName,
        },
      })
    : await supabase.auth.signUp({
        email: normalizedEmail,
        password: normalizedPassword,
        options: {
          data: {
            name: normalizedName,
          },
        },
      });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("User creation failed");
  }

  await syncPublicUserProfile(data.user, name);

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      name: normalizedName,
    },
    token: buildAuthToken(data.user),
  };
}

export async function login({ email, password, rememberMe = false }) {
  const endpoint = `${String(process.env.SUPABASE_URL || "")
    .trim()
    .replace(/\/$/, "")}/auth/v1/token?grant_type=password`;

  const anonKey = String(process.env.SUPABASE_KEY || "").trim();
  if (!endpoint || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_KEY configuration");
  }

  let response;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, authProviderTimeoutMs);

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        email: normalizeEmail(email),
        password,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw new Error(`Supabase login timed out after ${authProviderTimeoutMs}ms`);
    }
    throw new Error(error.message || "Login request failed");
  } finally {
    clearTimeout(timeoutId);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.error_description || payload?.msg || payload?.error || "Invalid login credentials";
    throw new Error(message);
  }

  const user = payload?.user;
  if (!user) {
    throw new Error("Invalid login response");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name ?? null,
    },
    token: buildAuthToken(user, rememberMe === true),
  };
}

export async function forgotPassword({ email }) {
  const redirectTo =
    process.env.AUTH_REDIRECT_URL || "http://localhost:5000/tester";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: "Password reset email sent",
    redirectTo,
  };
}

export async function requestResetCode({ email }) {
  const normalizedEmail = normalizeEmail(email);
  const code = createSixDigitCode();
  const expiresAt = Date.now() + resetCodeTtlMs;

  resetCodes.set(normalizedEmail, {
    code,
    expiresAt,
    verified: false,
    attempts: 0,
  });

  try {
    await sendResetCodeEmail({ email: normalizedEmail, code });
  } catch (emailError) {
    const reason = String(
      emailError.message || "Failed to send reset code email",
    );

    if (!isProductionEnvironment() && isDevResetFallbackEnabled()) {
      return {
        message:
          "Email delivery is unavailable in development. Use the returned reset code to continue.",
        expiresInSeconds: Math.floor(resetCodeTtlMs / 1000),
        devResetCode: code,
        deliveryError: reason,
      };
    }

    resetCodes.delete(normalizedEmail);
    throw new Error(reason);
  }

  return {
    message: "Reset code sent to your email",
    expiresInSeconds: Math.floor(resetCodeTtlMs / 1000),
  };
}

export async function verifyResetCode({ email, code }) {
  const normalizedEmail = normalizeEmail(email);
  const state = resetCodes.get(normalizedEmail);

  if (!state) {
    throw new Error("No reset code request found for this email");
  }

  if (Date.now() > state.expiresAt) {
    resetCodes.delete(normalizedEmail);
    throw new Error("Reset code has expired");
  }

  state.attempts += 1;
  if (state.attempts > 5) {
    resetCodes.delete(normalizedEmail);
    throw new Error("Too many attempts. Request a new code");
  }

  if (String(state.code) !== String(code)) {
    throw new Error("Invalid reset code");
  }

  state.verified = true;
  resetCodes.set(normalizedEmail, state);

  return { message: "Reset code verified" };
}

export async function resetPasswordWithCode({ email, code, newPassword }) {
  const normalizedEmail = normalizeEmail(email);
  const state = resetCodes.get(normalizedEmail);

  if (!state) {
    throw new Error("No reset code request found for this email");
  }

  if (Date.now() > state.expiresAt) {
    resetCodes.delete(normalizedEmail);
    throw new Error("Reset code has expired");
  }

  state.attempts += 1;
  if (state.attempts > 5) {
    resetCodes.delete(normalizedEmail);
    throw new Error("Too many attempts. Request a new code");
  }

  if (String(state.code) !== String(code)) {
    resetCodes.set(normalizedEmail, state);
    throw new Error("Invalid reset code");
  }

  // Verification endpoint is optional; a valid code is enough to reset.
  state.verified = true;
  resetCodes.set(normalizedEmail, state);

  const adminClient = getAdminClient();
  if (!adminClient) {
    throw new Error(
      "Set SUPABASE_SERVICE_ROLE_KEY in .env to reset password with code",
    );
  }

  const userId = await findUserIdByEmail(email);
  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  resetCodes.delete(normalizedEmail);

  return {
    message: "Password reset successful",
  };
}
