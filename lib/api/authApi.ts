import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export interface SigninRequest {
  identifier: string;
  type: "email" | "phone";
}

export interface SigninResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    phone: string;
    isVerified: boolean;
    verifiedAt?: string;
  };
}

export interface ValidateOtpRequest {
  identifier: string;
  code: string;
  type: "email" | "phone";
}

export interface ValidateOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      phone: string;
      isVerified: boolean;
      verifiedAt?: string;
    };
    token: string;
    refreshToken?: string;
  };
}

export interface ResendOtpRequest {
  identifier: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  verificationCode: string; // Remove in production
  expiresAt: string;
  identifier: string;
  type: "email" | "phone";
}

export interface MeResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    phone: string;
    isVerified: boolean;
    verifiedAt?: string;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    signin: builder.mutation<SigninResponse, SigninRequest>({
      query: (body) => ({
        url: "/signin",
        method: "POST",
        body,
      }),
    }),
    validateOtp: builder.mutation<ValidateOtpResponse, ValidateOtpRequest>({
      query: (body) => ({
        url: "/validate-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (body) => ({
        url: "/resend",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query<MeResponse, void>({
      query: () => "/me",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useSigninMutation,
  useValidateOtpMutation,
  useResendOtpMutation,
  useGetMeQuery,
} = authApi;
