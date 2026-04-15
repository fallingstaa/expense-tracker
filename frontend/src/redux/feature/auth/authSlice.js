import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authAPI";

const AUTH_STORAGE_KEY = "authState";
const LEGACY_TOKEN_KEY = "authToken";
const LEGACY_USER_KEY = "userData";
const REMEMBER_ME_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function isBrowser() {
  return typeof window !== "undefined";
}

function clearLegacyStorage() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_USER_KEY);
}

function clearAuthStorage() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  clearLegacyStorage();
}

function persistAuth({ user, token, rememberMe }) {
  if (!isBrowser()) {
    return;
  }

  const storage = rememberMe ? localStorage : sessionStorage;
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  const payload = {
    user,
    token,
    rememberMe,
    expiresAt: rememberMe ? Date.now() + REMEMBER_ME_TTL_MS : null,
  };

  otherStorage.removeItem(AUTH_STORAGE_KEY);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  clearLegacyStorage();
}

function parseStoredAuth(raw, storage) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user) {
      storage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    if (
      parsed.rememberMe &&
      parsed.expiresAt &&
      Date.now() > parsed.expiresAt
    ) {
      storage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    storage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function readStoredAuth() {
  if (!isBrowser()) {
    return null;
  }

  const localAuth = parseStoredAuth(
    localStorage.getItem(AUTH_STORAGE_KEY),
    localStorage,
  );
  if (localAuth) {
    return localAuth;
  }

  const sessionAuth = parseStoredAuth(
    sessionStorage.getItem(AUTH_STORAGE_KEY),
    sessionStorage,
  );
  if (sessionAuth) {
    return sessionAuth;
  }

  const legacyToken = localStorage.getItem(LEGACY_TOKEN_KEY);
  const legacyUser = localStorage.getItem(LEGACY_USER_KEY);
  if (legacyToken && legacyUser) {
    try {
      return {
        token: legacyToken,
        user: JSON.parse(legacyUser),
        rememberMe: true,
        expiresAt: Date.now() + REMEMBER_ME_TTL_MS,
      };
    } catch {
      clearLegacyStorage();
      return null;
    }
  }

  return null;
}

const hydratedAuth = readStoredAuth();

const initialState = {
  user: hydratedAuth?.user ?? null,
  token: hydratedAuth?.token ?? null,
  isAuthenticated: Boolean(hydratedAuth?.token),
  loading: false,
  error: null,
};

function getAuthErrorMessage(action, fallbackMessage) {
  return (
    action?.payload?.data?.message ||
    action?.payload?.message ||
    action?.error?.data?.message ||
    action?.error?.message ||
    fallbackMessage
  );
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { user, token, rememberMe = false } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      persistAuth({ user, token, rememberMe });
    },
    initializeAuth: (state) => {
      const storedAuth = readStoredAuth();

      if (storedAuth?.token && storedAuth?.user) {
        state.token = storedAuth.token;
        state.user = storedAuth.user;
        state.isAuthenticated = true;
        return;
      }

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.loading = false;
        const { user, token } = action.payload;
        const rememberMe = action?.meta?.arg?.originalArgs?.rememberMe === true;
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        persistAuth({ user, token, rememberMe });
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false;
        state.error = getAuthErrorMessage(action, "Login failed");
      })
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          state.loading = false;
          // Registration successful, but user needs to verify email
          state.error = null;
        },
      )
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.loading = false;
        state.error = getAuthErrorMessage(action, "Registration failed");
      });
  },
});

export const { logout, clearError, setCredentials, initializeAuth } =
  authSlice.actions;
export default authSlice.reducer;
