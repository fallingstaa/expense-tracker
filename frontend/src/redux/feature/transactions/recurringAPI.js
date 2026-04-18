import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000"
).replace(/\/+$/, "");

export const recurringApi = createApi({
  reducerPath: "recurringApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/recurring`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Recurring"],
  endpoints: (builder) => ({
    getRecurringTransactions: builder.query({
      query: () => ({
        url: "/",
      }),
      providesTags: ["Recurring"],
    }),
    createRecurringTransaction: builder.mutation({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Recurring"],
    }),
    runDueRecurringTransactions: builder.mutation({
      query: () => ({
        url: "/run-due",
        method: "POST",
      }),
      invalidatesTags: ["Recurring"],
    }),
    updateRecurringTransaction: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Recurring"],
    }),
    deleteRecurringTransaction: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Recurring"],
    }),
  }),
});

export const {
  useGetRecurringTransactionsQuery,
  useCreateRecurringTransactionMutation,
  useRunDueRecurringTransactionsMutation,
  useUpdateRecurringTransactionMutation,
  useDeleteRecurringTransactionMutation,
} = recurringApi;
