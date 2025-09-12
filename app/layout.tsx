import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/lib/providers/ReduxProvider";
import { SWRProvider } from "@/lib/providers/SWRProvider";
import { Toaster } from "@/components/ui/sonner";
import CartInitializer from "./CartInitializer";

export const metadata: Metadata = {
  title: "Easy Mart Clone",
  description: "Easy Mart Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ReduxProvider>
          <SWRProvider>
            <Toaster />
            <CartInitializer />
            {children}
          </SWRProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
