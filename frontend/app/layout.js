import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import { Toaster } from 'react-hot-toast'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NeoSpend: Daily Expense Tracker',
  description: 'Track your daily expenses, manage budgets, and gain financial insights with NeoSpend.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50 transition-colors duration-300`}>
        <Providers>
          <Header />
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  )
}
