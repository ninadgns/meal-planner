import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { Button } from "@/components/ui/button"
import SupabaseLogo from '@/components/supabase-logo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MealPlanner - Your Personal Meal Planning Assistant',
  description: 'Plan your meals, generate shopping lists, and discover new recipes with MealPlanner.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Main Content Area */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Footer Always at the Bottom */}
        <footer className="w-full flex items-center justify-between border-t px-10 mx-auto text-center text-xs gap-8 py-4">
          <p>
            Made by{" "}
            <a href="https://github.com/ninadgns/" target="_blank" className="font-bold hover:underline" rel="noreferrer">
              Ninad
            </a>{" "}
            and{" "}
            <a href="https://github.com/TanzilaKhan1" target="_blank" className="font-bold hover:underline" rel="noreferrer">
              Tanzila
            </a>
          </p>
          <p className="flex gap-2">
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              <SupabaseLogo />
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
