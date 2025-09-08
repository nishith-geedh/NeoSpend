'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  FiDollarSign, 
  FiStar, 
  FiShield, 
  FiTrendingUp,
  FiArrowRight
} from 'react-icons/fi';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <FiStar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading...</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we prepare your login.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <FiDollarSign className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to NeoSpend
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sign in to access your personal finance dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Sign In
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Access your account securely
            </p>
          </div>

          {/* Cognito Login Button */}
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              signIn("cognito", { 
                callbackUrl: "/dashboard",
                redirect: true 
              });
            }}
            className="group w-full relative px-8 py-4 rounded-2xl text-white font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:from-blue-500 group-hover:via-indigo-500 group-hover:to-purple-500 transition-all duration-300"></div>
            <span className="relative flex items-center justify-center gap-3">
              <FiShield className="w-6 h-6" />
              Continue with Cognito
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FiShield className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">Bank-level security with AWS Cognito</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">Track expenses and manage budgets</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FiStar className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">Beautiful analytics and insights</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
