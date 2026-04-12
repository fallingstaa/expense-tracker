import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import supabase from '../utils/supabaseClient.js';

const resetCodes = new Map();
const resetCodeTtlMs = 10 * 60 * 1000;

function normalizeEmail(email) {
	return String(email).trim().toLowerCase();
}

function createSixDigitCode() {
	return String(Math.floor(100000 + Math.random() * 900000));
}

function extractMissingColumnName(error) {
	const message = String(error?.message || '');
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
			persistSession: false
		}
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
		password: 'supabase_auth_managed',
		updated_at: new Date().toISOString()
	};

	for (let attempt = 0; attempt < 5; attempt += 1) {
		const { error } = await adminClient.from('users').upsert(payload, { onConflict: 'id' });
		if (!error) {
			return;
		}

		const message = String(error.message || '').toLowerCase();
		if (message.includes('relation') || message.includes('does not exist') || error.code === '42P01') {
			return;
		}

		const missingColumn = extractMissingColumnName(error);
		if (missingColumn && Object.prototype.hasOwnProperty.call(payload, missingColumn)) {
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
		throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for code-based password reset');
	}

	const normalized = normalizeEmail(email);
	let page = 1;
	while (page <= 10) {
		const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 });
		if (error) {
			throw new Error(error.message);
		}

		const users = data?.users ?? [];
		const matched = users.find(user => normalizeEmail(user.email) === normalized);
		if (matched) {
			return matched.id;
		}

		if (users.length < 1000) {
			break;
		}

		page += 1;
	}

	throw new Error('No account found for this email');
}

function buildAuthToken(user) {
	return jwt.sign(
		{
			sub: user.id,
			email: user.email
		},
		process.env.JWT_SECRET,
		{ expiresIn: '7d' }
	);
}

export async function signup({ email, password, name }) {
	const serviceClient = getServiceRoleClient();
	const isAdminClient = Boolean(getAdminClient());

	const { data, error } = isAdminClient
		? await serviceClient.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			user_metadata: {
				name
			}
		})
		: await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name
				}
			}
		});

	if (error) {
		throw new Error(error.message);
	}

	if (!data.user) {
		throw new Error('User creation failed');
	}

	await syncPublicUserProfile(data.user, name);

	return {
		user: {
			id: data.user.id,
			email: data.user.email,
			name
		},
		token: buildAuthToken(data.user)
	};
}

export async function login({ email, password }) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) {
		throw new Error(error.message);
	}

	if (!data.user) {
		throw new Error('Invalid login response');
	}

	return {
		user: {
			id: data.user.id,
			email: data.user.email,
			name: data.user.user_metadata?.name ?? null
		},
		token: buildAuthToken(data.user)
	};
}

export async function forgotPassword({ email }) {
	const redirectTo = process.env.AUTH_REDIRECT_URL || 'http://localhost:5000/tester';
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo
	});

	if (error) {
		throw new Error(error.message);
	}

	return {
		message: 'Password reset email sent',
		redirectTo
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
		attempts: 0
	});

	const response = {
		message: 'Reset code generated',
		expiresInSeconds: Math.floor(resetCodeTtlMs / 1000)
	};

	if (process.env.NODE_ENV !== 'production') {
		response.devCode = code;
	}

	return response;
}

export async function verifyResetCode({ email, code }) {
	const normalizedEmail = normalizeEmail(email);
	const state = resetCodes.get(normalizedEmail);

	if (!state) {
		throw new Error('No reset code request found for this email');
	}

	if (Date.now() > state.expiresAt) {
		resetCodes.delete(normalizedEmail);
		throw new Error('Reset code has expired');
	}

	state.attempts += 1;
	if (state.attempts > 5) {
		resetCodes.delete(normalizedEmail);
		throw new Error('Too many attempts. Request a new code');
	}

	if (String(state.code) !== String(code)) {
		throw new Error('Invalid reset code');
	}

	state.verified = true;
	resetCodes.set(normalizedEmail, state);

	return { message: 'Reset code verified' };
}

export async function resetPasswordWithCode({ email, code, newPassword }) {
	const normalizedEmail = normalizeEmail(email);
	const state = resetCodes.get(normalizedEmail);

	if (!state) {
		throw new Error('No reset code request found for this email');
	}

	if (Date.now() > state.expiresAt) {
		resetCodes.delete(normalizedEmail);
		throw new Error('Reset code has expired');
	}

	state.attempts += 1;
	if (state.attempts > 5) {
		resetCodes.delete(normalizedEmail);
		throw new Error('Too many attempts. Request a new code');
	}

	if (String(state.code) !== String(code)) {
		resetCodes.set(normalizedEmail, state);
		throw new Error('Invalid reset code');
	}

	// Verification endpoint is optional; a valid code is enough to reset.
	state.verified = true;
	resetCodes.set(normalizedEmail, state);

	const adminClient = getAdminClient();
	if (!adminClient) {
		throw new Error('Set SUPABASE_SERVICE_ROLE_KEY in .env to reset password with code');
	}

	const userId = await findUserIdByEmail(email);
	const { error } = await adminClient.auth.admin.updateUserById(userId, {
		password: newPassword
	});

	if (error) {
		throw new Error(error.message);
	}

	resetCodes.delete(normalizedEmail);

	return {
		message: 'Password reset successful'
	};
}
