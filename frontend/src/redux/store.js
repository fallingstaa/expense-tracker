import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./feature/auth/authAPI";
import { transactionsApi } from "./feature/transactions/transactionsAPI";
import { recurringApi } from "./feature/transactions/recurringAPI";
import { categoriesApi } from "./feature/transactions/categoriesApi";
import { tagApi } from "./feature/transactions/tagApi";
import authReducer from "./feature/auth/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [recurringApi.reducerPath]: recurringApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [tagApi.reducerPath]: tagApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      transactionsApi.middleware,
      recurringApi.middleware,
      categoriesApi.middleware,
      tagApi.middleware,
    ),
});

export default store;
