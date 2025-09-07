import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4">
      <section className="flex flex-col items-center text-center max-w-xl">
        <div className="relative w-[220px] h-[220px] mb-6 select-none">
          <Image
            src="/assets/images/not-found.png"
            alt="Page not found illustration"
            fill
            priority
            sizes="220px"
            className="object-contain"
          />
        </div>

        <h1 className="text-display-sm font-semibold text-primary-500 mb-3">
          Page not found
        </h1>
        <p className="text-black-600 text-body max-w-md mb-6">
          The page you&apos;re looking for isn&apos;t available. Try to search again or use the go back button below.
        </p>

        <Link href="/">
          <Button className="px-8 py-6 text-white text-body font-medium">
            Start for free
          </Button>
        </Link>
      </section>
    </main>
  )
}

export default NotFoundPage