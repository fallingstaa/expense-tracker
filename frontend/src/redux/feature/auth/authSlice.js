import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authAPI';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
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
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        state.token = token;
        state.user = JSON.parse(userData);
        state.isAuthenticated = true;
      }
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
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false;
        state.error = getAuthErrorMessage(action, 'Login failed');
      })
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.loading = false;
        // Registration successful, but user needs to verify email
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.loading = false;
        state.error = getAuthErrorMessage(action, 'Registration failed');
      });
  },
});

export const { logout, clearError, setCredentials, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
