import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './feature/auth/authAPI';
import { transactionsApi } from './feature/transactions/transactionsAPI';
import authReducer from './feature/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, transactionsApi.middleware),
});

export default store;
