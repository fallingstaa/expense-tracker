export function validateSignupInput(body) {
  const { email, password, name } = body;

  if (!email || !password || !name) {
    return "email, password, and name are required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "email must be valid";
  }

  if (String(password).length < 6) {
    return "password must be at least 6 characters";
  }

  if (String(name).trim().length < 2) {
    return "name must be at least 2 characters";
  }

  return null;
}

export function validateLoginInput(body) {
  const { email, password, rememberMe } = body;

  if (!email || !password) {
    return "email and password are required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "email must be valid";
  }

  if (rememberMe !== undefined && typeof rememberMe !== "boolean") {
    return "rememberMe must be a boolean";
  }

  return null;
}

export function validateForgotPasswordInput(body) {
  const { email } = body;

  if (!email) {
    return "email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "email must be valid";
  }

  return null;
}

export function validateResetCodeRequestInput(body) {
  return validateForgotPasswordInput(body);
}

export function validateResetCodeVerifyInput(body) {
  const { email, code } = body;

  const emailError = validateForgotPasswordInput({ email });
  if (emailError) {
    return emailError;
  }

  if (!code) {
    return "code is required";
  }

  if (!/^\d{6}$/.test(String(code))) {
    return "code must be exactly 6 digits";
  }

  return null;
}

export function validateResetPasswordWithCodeInput(body) {
  const { email, code, newPassword } = body;

  const verifyError = validateResetCodeVerifyInput({ email, code });
  if (verifyError) {
    return verifyError;
  }

  if (!newPassword) {
    return "newPassword is required";
  }

  if (String(newPassword).length < 6) {
    return "newPassword must be at least 6 characters";
  }

  return null;
}
