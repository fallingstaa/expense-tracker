import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000"
).replace(/\/+$/, "");

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: "/forgot-password",
        method: "POST",
        body: emailData,
      }),
    }),
    requestResetCode: builder.mutation({
      query: (emailData) => ({
        url: "/forgot-password/code/request",
        method: "POST",
        body: emailData,
      }),
    }),
    verifyResetCode: builder.mutation({
      query: (codeData) => ({
        url: "/forgot-password/code/verify",
        method: "POST",
        body: codeData,
      }),
    }),
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: "/forgot-password/code/reset",
        method: "POST",
        body: resetData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useRequestResetCodeMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} = authApi;
