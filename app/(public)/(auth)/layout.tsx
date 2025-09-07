import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header className="h-21 flex items-center justify-center py-8">
        <Link href="/" className="text-xl font-semibold text-primary-500">
          <Image
            src="/assets/icons/logo-with-text.png"
            width={117}
            height={28}
            alt="logo"
          />
        </Link>
      </header>
      {children}
    </div>
  );
}
