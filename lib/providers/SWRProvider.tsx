"use client";

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

interface SWRProviderProps {
  children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global fetcher function
        fetcher: async (url: string) => {
          const res = await fetch(url);
          
          if (!res.ok) {
            const error = new Error('An error occurred while fetching the data.');
            // Attach extra info to the error object.
            (error as any).info = await res.json();
            (error as any).status = res.status;
            throw error;
          }
          
          return res.json();
        },
        // Revalidation options
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        revalidateIfStale: true,
        // Error retry options
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        // Dedupe requests within this time window
        dedupingInterval: 2000,
        // Cache settings
        focusThrottleInterval: 5000,
        // Loading timeout
        loadingTimeout: 3000,
        // Refresh interval (disabled by default, can be enabled per hook)
        refreshInterval: 0,
        // Refresh when hidden (disabled by default)
        refreshWhenHidden: false,
        // Refresh when offline (disabled by default)
        refreshWhenOffline: false,
        // Should retry on error
        shouldRetryOnError: (error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return true;
        },
        // Global error handler
        onError: (error: any, key: string) => {
          if (error?.status !== 403 && error?.status !== 404) {
            console.error('SWR Error:', error, key);
          }
        },
        // Success handler
        onSuccess: (data: any, key: string) => {
          console.log('SWR Success:', key, data);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
