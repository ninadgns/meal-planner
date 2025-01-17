import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { Button } from "@/components/ui/button"

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
      <body className={inter.className}>
        {children}
        {/* <div className="flex flex-col min-h-screen">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">MealPlanner</Link>
              <nav>
                <ul className="flex space-x-4">
                  <li><Link href="/" className="hover:underline">Home</Link></li>
                  <li><Link href="/features" className="hover:underline">Features</Link></li>
                  <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
                  <li><Button variant="outline" asChild><Link href="/signin">Sign In</Link></Button></li>
                  <li><Button asChild><Link href="/signup">Sign Up</Link></Button></li>
                </ul>
              </nav>
            </div>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="border-t mt-8">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-between items-center">
                <p>&copy; 2023 MealPlanner. All rights reserved.</p>
                <nav>
                  <ul className="flex space-x-4">
                    <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
                    <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
                  </ul>
                </nav>
              </div>
            </div>
          </footer>
        </div> */}
      </body>
    </html>
  )
}

