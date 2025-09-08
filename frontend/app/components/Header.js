'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import { 
  FiMenu, 
  FiX, 
  FiSun, 
  FiMoon, 
  FiDollarSign, 
  FiTarget, 
  FiPieChart, 
  FiHome,
  FiUser,
  FiLogOut,
  FiStar
} from 'react-icons/fi';

export default function Header() {
  const { data: session, status } = useSession();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: 'http://localhost:3000/', redirect: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { href: "/dashboard", label: "Dashboard", icon: <FiHome className="w-4 h-4" />, color: "from-blue-500 to-cyan-500" },
    { href: "/expenses", label: "Expenses", icon: <FiDollarSign className="w-4 h-4" />, color: "from-orange-500 to-red-500" },
    { href: "/budgets", label: "Budgets", icon: <FiTarget className="w-4 h-4" />, color: "from-green-500 to-emerald-500" },
    { href: "/analytics", label: "Analytics", icon: <FiPieChart className="w-4 h-4" />, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              NeoSpend
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              >
                <div className="flex items-center space-x-2 relative">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/25`}>
                    {item.icon}
                  </div>
                  <span className="group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {item.label}
                  </span>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300`}></div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Right side - Theme toggle and Auth */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group relative p-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300"></div>
              {isDark ? (
                <FiSun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-500 transition-colors duration-300 group-hover:rotate-180 group-hover:scale-110" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-600 group-hover:text-gray-700 transition-colors duration-300 group-hover:rotate-12 group-hover:scale-110" />
              )}
            </button>

            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <div className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-green-500/25">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
                  <FiUser className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-red-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
                  <FiLogOut className="w-4 h-4 group-hover:translate-x-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  signIn("cognito", { 
                    callbackUrl: "/dashboard",
                    redirect: true 
                  });
                }}
                className="group relative flex items-center space-x-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
                <FiStar className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Sign In</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/20 dark:border-gray-700/20">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
