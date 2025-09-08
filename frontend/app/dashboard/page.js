'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { apiCall } from '../../lib/api';
import { 
  FiDollarSign, 
  FiTarget, 
  FiPieChart, 
  FiTrendingUp,
  FiArrowRight,
  FiStar,
  FiZap,
  FiShield,
  FiBarChart,
  FiPocket,
  FiCreditCard,
  FiSave
} from 'react-icons/fi';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    savingsGoal: 0,
    budgetUsed: 0,
    loading: true
  });

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Load dashboard data when session is available
  useEffect(() => {
    if (session) {
      loadDashboardData();
    }
  }, [session]);

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      
      // Load expenses data
      const expensesData = await apiCall('/expenses', { method: 'GET' }, session);
      const budgetsData = await apiCall('/budgets', { method: 'GET' }, session);
      
      // Calculate total expenses
      const totalExpenses = expensesData?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
      
      // Calculate monthly expenses (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyExpenses = expensesData?.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      }).reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
      
      // Calculate total budget
      const totalBudget = budgetsData?.reduce((sum, budget) => sum + (budget.amount || 0), 0) || 0;
      
      // Calculate budget used percentage
      const budgetUsed = totalBudget > 0 ? Math.round((monthlyExpenses / totalBudget) * 100) : 0;
      
      // Set savings goal (you can make this configurable later)
      const savingsGoal = 50000; // ₹50,000 default savings goal
      
      setDashboardData({
        totalExpenses,
        monthlyExpenses,
        savingsGoal,
        budgetUsed,
        loading: false
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FiDollarSign className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        
        <div className="text-center max-w-md mx-auto px-6 relative z-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse"
                 style={{ 
                   boxShadow: '0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2)'
                 }}>
              <FiShield className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-20 blur-xl animate-pulse mx-auto"></div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6"
              style={{ 
                textShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
              }}>
            Access Your Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Please sign in to access your personal finance dashboard and start tracking your expenses.
          </p>
          <button 
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              signIn("cognito", { 
                callbackUrl: "/dashboard",
                redirect: true 
              });
            }}
            className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-110 flex items-center space-x-4 mx-auto overflow-hidden"
            style={{ 
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/20 to-blue-600/0 group-hover:from-blue-700/20 group-hover:via-purple-700/40 group-hover:to-blue-700/20 transition-all duration-500"></div>
            <FiStar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
            <span className="relative z-10">Sign In to Dashboard</span>
            <FiArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
          </button>
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Track Expenses",
      description: "Log and categorize your daily expenses with smart insights and spending patterns.",
      icon: <FiDollarSign className="w-12 h-12" />,
      href: "/expenses",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      hoverGradient: "from-orange-600 via-red-600 to-pink-600",
      bgPattern: "bg-gradient-to-br from-orange-100/20 to-red-100/20 dark:from-orange-900/20 dark:to-red-900/20",
      animation: "hover:scale-105 hover:rotate-1"
    },
    {
      title: "Manage Budgets",
      description: "Set spending limits, track progress, and get alerts when approaching your budget goals.",
      icon: <FiTarget className="w-12 h-12" />,
      href: "/budgets",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      hoverGradient: "from-green-600 via-emerald-600 to-teal-600",
      bgPattern: "bg-gradient-to-br from-green-100/20 to-emerald-100/20 dark:from-green-900/20 dark:to-emerald-900/20",
      animation: "hover:scale-105 hover:-rotate-1"
    },
    {
      title: "View Analytics",
      description: "Analyze your spending habits with beautiful charts and detailed financial insights.",
      icon: <FiPieChart className="w-12 h-12" />,
      href: "/analytics",
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      hoverGradient: "from-purple-600 via-violet-600 to-indigo-600",
      bgPattern: "bg-gradient-to-br from-purple-100/20 to-violet-100/20 dark:from-purple-900/20 dark:to-violet-900/20",
      animation: "hover:scale-105 hover:rotate-1"
    }
  ];

  const quickStats = [
    { 
      label: "Total Expenses", 
      value: dashboardData.loading ? "Loading..." : `₹${dashboardData.totalExpenses.toLocaleString('en-IN')}`, 
      icon: <FiPocket className="w-6 h-6" />, 
      color: "text-orange-500" 
    },
    { 
      label: "This Month", 
      value: dashboardData.loading ? "Loading..." : `₹${dashboardData.monthlyExpenses.toLocaleString('en-IN')}`, 
      icon: <FiCreditCard className="w-6 h-6" />, 
      color: "text-blue-500" 
    },
    { 
      label: "Budget Used", 
      value: dashboardData.loading ? "Loading..." : `${dashboardData.budgetUsed}%`, 
      icon: <FiBarChart className="w-6 h-6" />, 
      color: "text-purple-500" 
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative px-6 py-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <FiZap className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Welcome back, {session.user?.name || session.user?.email?.split('@')[0]}!</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Your Financial
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x-reverse">
                Command Center
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Take control of your finances with our intelligent expense tracking, budget management, and analytics dashboard.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
            {quickStats.map((stat, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-3xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)'
                }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color.replace('text-', 'from-').replace('-500', '-500/20')} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg group-hover:scale-125 transition-transform duration-700 delay-100"></div>
                
                <div className="relative z-10">
                  {/* Icon with Enhanced Glow */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.color.replace('text-', 'from-').replace('-500', '-500')} ${stat.color.replace('text-', 'to-').replace('-500', '-600')} text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}
                       style={{ 
                         boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)'
                       }}>
                    {stat.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-700 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-500">
                    {stat.value}
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>

                {/* Enhanced Hover Effect Border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color.replace('text-', 'from-').replace('-500', '-500')} ${stat.color.replace('text-', 'to-').replace('-500', '-600')} opacity-0 group-hover:opacity-25 transition-opacity duration-500`}></div>
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color.replace('text-', 'from-').replace('-500', '-500')} ${stat.color.replace('text-', 'to-').replace('-500', '-600')} opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dashboard Cards */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Action
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Select what you'd like to do with your finances today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {dashboardCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className={`group relative overflow-hidden rounded-3xl p-8 ${card.bgPattern} border border-white/20 dark:border-gray-700/20 hover:border-white/40 dark:hover:border-gray-700/40 transition-all duration-500 ${card.animation} hover:shadow-2xl`}
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)'
                }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 animate-pulse`}></div>
                
                {/* Floating Elements with Glow */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg group-hover:scale-125 transition-transform duration-700 delay-100"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:scale-200 transition-transform duration-1000 delay-200"></div>

                <div className="relative z-10">
                  {/* Icon with Enhanced Glow */}
                  <div className={`inline-flex p-5 rounded-3xl bg-gradient-to-r ${card.gradient} text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}
                       style={{ 
                         boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)'
                       }}>
                    {card.icon}
                  </div>
                  <div className={`absolute top-8 left-8 w-16 h-16 rounded-3xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-700 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-500"
                      style={{ 
                        textShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
                      }}>
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {card.description}
                  </p>

                  {/* Enhanced Action Button */}
                  <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-all duration-300">
                    <span>Get Started</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-2 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                {/* Enhanced Hover Effect Border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-25 transition-opacity duration-500`}></div>
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-500`}></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
        {/* Quick Add Expense */}
        <Link
          href="/expenses?action=add"
          className="group relative w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-110 hover:rotate-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
          <FiDollarSign className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
            +
          </div>
        </Link>

        {/* Quick Add Budget */}
        <Link
          href="/budgets?action=add"
          className="group relative w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 hover:rotate-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
          <FiTarget className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </Link>

        {/* Quick Analytics */}
        <Link
          href="/analytics"
          className="group relative w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 hover:rotate-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
          <FiPieChart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </Link>
      </div>

      {/* Footer CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20 border border-white/20 dark:border-gray-700/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Financial Life?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start tracking your expenses, managing budgets, and gaining insights today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/expenses"
                className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <FiDollarSign className="w-5 h-5" />
                <span>Start Tracking</span>
              </Link>
              <Link
                href="/analytics"
                className="group px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <FiPieChart className="w-5 h-5" />
                <span>View Analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}