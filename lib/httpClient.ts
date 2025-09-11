import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { getAuthCookies, clearAuthCookies } from "./utils/cookies";

export interface HttpSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface HttpFailure {
  success: false;
  error: string;
  code?: string;
  details?: any;
  status?: number;
}

export type HttpResult<T> = HttpSuccess<T> | HttpFailure;

function toFailure(error: unknown): HttpFailure {
  const axiosError = error as AxiosError<any>;
  const response = axiosError?.response;
  return {
    success: false,
    error: (response?.data?.error as string) || axiosError?.message || "Request failed",
    code: (response?.data?.code as string) || undefined,
    details: response?.data?.details,
    status: response?.status,
  };
}

export class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || "", config?: AxiosRequestConfig) {
    this.instance = axios.create({ baseURL, timeout: 10000, ...(config || {}) });

    this.instance.interceptors.request.use((cfg) => {
      let token: string | undefined;
      try {
        if (typeof window !== "undefined") {
          const cookies = getAuthCookies();
          token = cookies.token || undefined;
        }
      } catch {}
      if (token) {
        cfg.headers = cfg.headers || {};
        (cfg.headers as any).Authorization = `Bearer ${token}`;
      }
      return cfg;
    });

    this.instance.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = (err as AxiosError)?.response?.status;
        if (typeof window !== "undefined" && status === 401) {
          clearAuthCookies();
          try { window.location.href = "/signin"; } catch {}
        }
        return Promise.reject(err);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<HttpResult<T>> {
    try {
      const res = await this.instance.get(url, config);
      return (res.data?.success === false)
        ? toFailure({ response: { ...res, data: res.data } } as any)
        : { success: true, data: (res.data?.data ?? res.data) as T, message: res.data?.message };
    } catch (error) {
      return toFailure(error);
    }
  }

  async post<T>(url: string, body?: any, config?: AxiosRequestConfig): Promise<HttpResult<T>> {
    try {
      const res = await this.instance.post(url, body, config);
      return (res.data?.success === false)
        ? toFailure({ response: { ...res, data: res.data } } as any)
        : { success: true, data: (res.data?.data ?? res.data) as T, message: res.data?.message };
    } catch (error) {
      return toFailure(error);
    }
  }

  async put<T>(url: string, body?: any, config?: AxiosRequestConfig): Promise<HttpResult<T>> {
    try {
      const res = await this.instance.put(url, body, config);
      return (res.data?.success === false)
        ? toFailure({ response: { ...res, data: res.data } } as any)
        : { success: true, data: (res.data?.data ?? res.data) as T, message: res.data?.message };
    } catch (error) {
      return toFailure(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<HttpResult<T>> {
    try {
      const res = await this.instance.delete(url, config);
      return (res.data?.success === false)
        ? toFailure({ response: { ...res, data: res.data } } as any)
        : { success: true, data: (res.data?.data ?? res.data) as T, message: res.data?.message };
    } catch (error) {
      return toFailure(error);
    }
  }
}

export const httpClient = new HttpClient("");


