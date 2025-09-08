'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { 
  FiArrowRight, 
  FiShield, 
  FiTrendingUp, 
  FiDollarSign, 
  FiPieChart, 
  FiTarget, 
  FiSmartphone, 
  FiGlobe, 
  FiStar,
  FiCheck,
  FiUsers,
  FiZap,
  FiLock,
  FiEye,
  FiHeart,
  FiPlay
} from 'react-icons/fi';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [isDark, setIsDark] = useState(false);

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

  const features = [
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: "Smart Expense Tracking",
      description: "Log expenses with categories, dates, and detailed descriptions. Get insights into your spending patterns.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: "Budget Management",
      description: "Set spending limits and receive alerts when approaching your budget thresholds.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FiPieChart className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Visualize your financial data with beautiful charts and comprehensive reports.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiSmartphone className="w-8 h-8" />,
      title: "Mobile Responsive",
      description: "Access your financial data anywhere with our fully responsive design.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Get instant updates and notifications about your spending and budget status.",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: "Cloud Sync",
      description: "Your data is safely stored in the cloud and synced across all your devices.",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const benefits = [
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Save More Money",
      description: "Track every expense and identify areas where you can cut costs."
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: "Achieve Goals",
      description: "Set and track financial goals with our smart budgeting tools."
    },
    {
      icon: <FiPieChart className="w-6 h-6" />,
      title: "Better Decisions",
      description: "Make informed financial decisions with detailed analytics and insights."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      content: "NeoSpend helped me understand my spending habits and save 30% more each month. The analytics are incredible!",
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Software Engineer",
      content: "Finally, a finance app that's both powerful and beautiful. The dark mode is perfect for late-night budgeting sessions.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      content: "The budget alerts have been a game-changer. I never overspend anymore thanks to NeoSpend's smart notifications.",
      avatar: "ER"
    }
  ];

const faqs = [
  {
      question: "Is my financial data secure?",
      answer: "Yes! We use bank-level encryption and AWS security services to protect your data. Your information is never shared with third parties."
    },
    {
      question: "Can I use NeoSpend on my phone?",
      answer: "Absolutely! NeoSpend is fully responsive and works perfectly on all devices - desktop, tablet, and mobile."
    },
    {
      question: "How much does NeoSpend cost?",
      answer: "NeoSpend is completely free to use! We believe everyone deserves access to powerful financial tools."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export your expense and budget data in various formats for your records or use with other tools."
    },
    {
      question: "Do you offer customer support?",
      answer: "We provide comprehensive support through our help center, email support, and community forums."
    },
    {
      question: "How often is my data backed up?",
      answer: "Your data is automatically backed up in real-time using AWS's secure cloud infrastructure."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden min-h-screen flex items-center">
        {/* Background matching dashboard theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20"></div>
        
        {/* Floating Glowing Orbs - adjusted for light/dark theme */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-3xl animate-pulse animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 dark:from-indigo-500/30 dark:to-cyan-500/30 rounded-full blur-3xl animate-pulse animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 dark:from-blue-500/25 dark:to-indigo-500/25 rounded-full blur-3xl animate-pulse animate-float delay-500"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/15 to-pink-500/15 dark:from-purple-500/25 dark:to-pink-500/25 rounded-full blur-2xl animate-pulse animate-float delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 dark:from-cyan-500/25 dark:to-blue-500/25 rounded-full blur-2xl animate-pulse animate-float delay-300"></div>
        </div>

        {/* Animated Grid Pattern - theme aware */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent dark:via-white/5 animate-shimmer"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-500/20 dark:border-purple-500/30 mb-8 animate-glow-pulse">
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-pulse">
                ✨ Smart Financial Management
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent animate-gradient-x">
                Take Control of
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient-x-reverse">
                Your Finances
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Track expenses, manage budgets, and gain financial insights with our beautiful, 
              intelligent personal finance tracker powered by AWS and modern technology.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 mb-12">
              <div className="text-center group">
                <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  10K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Users</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  ₹2 Crore+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tracked Expenses</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  99.9%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Uptime</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {session ? (
              <Link 
                href="/dashboard" 
                className="group relative px-12 py-6 rounded-2xl text-xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-indigo-500 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/20 to-indigo-600/0 group-hover:from-blue-500/20 group-hover:via-purple-500/40 group-hover:to-indigo-500/20 transition-all duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  Go to Dashboard
                  <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
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
                className="group relative px-12 py-6 rounded-2xl text-xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-indigo-500 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/20 to-indigo-600/0 group-hover:from-blue-500/20 group-hover:via-purple-500/40 group-hover:to-indigo-500/20 transition-all duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  Get Started Free
                  <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
          </button>
            )}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="relative px-6 py-24 bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-900/50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              Everything you need to manage your finances effectively, all in one beautiful interface.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative mb-8">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                       style={{ 
                         boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)'
                       }}>
                    {feature.icon}
                  </div>
                  <div className={`absolute inset-0 w-20 h-20 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
        </div>
      ))}
    </div>
        </div>
      </section>

      {/* Why Choose NeoSpend */}
      <section className="relative px-6 py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-800/50 dark:to-gray-900/50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Why Choose NeoSpend?
              </span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              Experience the difference with our modern, intelligent approach to personal finance management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                       style={{ 
                         boxShadow: '0 0 30px rgba(34, 197, 94, 0.3), 0 0 60px rgba(34, 197, 94, 0.1)'
                       }}>
                    {benefit.icon}
                  </div>
                  <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 mx-auto"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-500">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="relative px-6 py-24 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-900/50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-rose-500/5 to-pink-500/5 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              Real stories from real users who have transformed their financial lives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                         style={{ 
                           boxShadow: '0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1)'
                         }}>
                      {testimonial.avatar}
                    </div>
                    <div className="absolute inset-0 w-16 h-16 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-500">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="relative px-6 py-24 bg-gradient-to-br from-purple-50 via-slate-50 to-blue-50 dark:from-gray-800/50 dark:to-gray-900/50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800 dark:from-gray-200 dark:via-slate-300 dark:to-gray-200 bg-clip-text text-transparent">
                Security & Privacy
          </span>
          </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              Your financial data is protected with enterprise-grade security measures.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center" style={{ animationDelay: '0ms' }}>
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                     style={{ 
                       boxShadow: '0 0 30px rgba(34, 197, 94, 0.3), 0 0 60px rgba(34, 197, 94, 0.1)'
                     }}>
                  <FiLock className="w-10 h-10" />
                </div>
                <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 mx-auto"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-500">
                End-to-End Encryption
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                All data is encrypted in transit and at rest
              </p>
            </div>
            
            <div className="group text-center" style={{ animationDelay: '100ms' }}>
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                     style={{ 
                       boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)'
                     }}>
                  <FiShield className="w-10 h-10" />
                </div>
                <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 mx-auto"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all duration-500">
                AWS Security
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                Built on AWS with enterprise-grade security
              </p>
            </div>
            
            <div className="group text-center" style={{ animationDelay: '200ms' }}>
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                     style={{ 
                       boxShadow: '0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1)'
                     }}>
                  <FiEye className="w-10 h-10" />
                </div>
                <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 mx-auto"></div>
        </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-500">
                Privacy First
        </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                We never sell or share your personal data
              </p>
            </div>
            
            <div className="group text-center" style={{ animationDelay: '300ms' }}>
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                     style={{ 
                       boxShadow: '0 0 30px rgba(249, 115, 22, 0.3), 0 0 60px rgba(249, 115, 22, 0.1)'
                     }}>
                  <FiCheck className="w-10 h-10" />
                </div>
                <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 mx-auto"></div>
          </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text transition-all duration-500">
                SOC 2 Compliant
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                Certified security and compliance standards
              </p>
          </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative px-6 py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 dark:from-gray-800/50 dark:to-gray-900/50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
              Everything you need to know about NeoSpend
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="group p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {faq.answer}
                </p>
          </div>
        ))}
      </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-800 dark:via-blue-900/80 dark:to-purple-900/80 border-t border-gray-300/20 dark:border-gray-700/20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 dark:from-indigo-500/5 dark:to-blue-500/5 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
                     style={{ 
                       boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)'
                     }}>
                  <FiDollarSign className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                  NeoSpend
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
                Take control of your finances with our intelligent expense tracker and budgeting platform. 
                Built for modern users who demand both functionality and beauty.
              </p>
              <div className="flex space-x-4">
                <div className="group w-12 h-12 rounded-2xl bg-gray-200/50 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-gray-300/50 dark:hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <FiHeart className="w-6 h-6 text-gray-700 dark:text-white group-hover:text-red-400 transition-colors duration-300" />
                </div>
                <div className="group w-12 h-12 rounded-2xl bg-gray-200/50 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-gray-300/50 dark:hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <FiUsers className="w-6 h-6 text-gray-700 dark:text-white group-hover:text-blue-400 transition-colors duration-300" />
                </div>
                <div className="group w-12 h-12 rounded-2xl bg-gray-200/50 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-gray-300/50 dark:hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <FiZap className="w-6 h-6 text-gray-700 dark:text-white group-hover:text-yellow-400 transition-colors duration-300" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 group">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Product
                </span>
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/expenses" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 text-lg hover:translate-x-2 inline-block">
                    Expenses
                  </Link>
                </li>
                <li>
                  <Link href="/budgets" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 text-lg hover:translate-x-2 inline-block">
                    Budgets
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 text-lg hover:translate-x-2 inline-block">
                    Analytics
            </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 group">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  About NeoSpend
                </span>
              </h3>
              <ul className="space-y-4">
                <li>
                  <span className="text-gray-600 dark:text-gray-300 text-lg">Built with Next.js & AWS</span>
                </li>
                <li>
                  <span className="text-gray-600 dark:text-gray-300 text-lg">Open Source & Free</span>
                </li>
                <li>
                  <span className="text-gray-600 dark:text-gray-300 text-lg">Privacy First Design</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-300/30 dark:border-gray-700/30">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 dark:text-gray-400 text-base mb-4 md:mb-0">
                © 2024 NeoSpend. All rights reserved. Built with ❤️ for better financial management.
              </p>
              <div className="flex space-x-8">
                <span className="text-gray-500 dark:text-gray-400 text-base hover:text-gray-900 dark:hover:text-white transition-colors duration-300 cursor-pointer">Privacy Policy</span>
                <span className="text-gray-500 dark:text-gray-400 text-base hover:text-gray-900 dark:hover:text-white transition-colors duration-300 cursor-pointer">Terms of Service</span>
                <span className="text-gray-500 dark:text-gray-400 text-base hover:text-gray-900 dark:hover:text-white transition-colors duration-300 cursor-pointer">Contact</span>
              </div>
          </div>
        </div>
        </div>
      </footer>
    </div>
  );
}
