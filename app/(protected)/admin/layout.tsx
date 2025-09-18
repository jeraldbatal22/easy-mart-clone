import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminSidebar from "./_components/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-16 lg:px-6">
          <Link href="/" className="text-xl font-semibold text-primary-500">
            <Image
              src="/assets/icons/logo-with-text.png"
              width={117}
              height={28}
              alt="logo"
            />
          </Link>
          <div className="text-sm text-gray-500">
            Admin 
          </div>
        </div>
      </header>

    <div className="flex">

      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="w-full">
        <div className="p-4 lg:p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
    </div>
  );
}
