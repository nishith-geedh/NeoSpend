'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { apiCall } from '../../lib/api';
import { 
  FiPieChart, 
  FiBarChart, 
  FiTrendingUp, 
  FiDollarSign, 
  FiCalendar,
  FiStar,
  FiTarget,
  FiActivity,
  FiDownload
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication check
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
              <FiPieChart className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        
        <div className="text-center max-w-md mx-auto px-6 relative z-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <FiPieChart className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-20 blur-xl animate-pulse mx-auto"></div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
            View Your Analytics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Please sign in to access your financial analytics dashboard and gain insights into your spending patterns.
          </p>
          <button 
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              signIn("cognito", { 
                callbackUrl: "/analytics",
                redirect: true 
              });
            }}
            className="group relative px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-110 flex items-center space-x-4 mx-auto overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/20 to-purple-500/0 group-hover:from-purple-600/20 group-hover:via-pink-600/40 group-hover:to-purple-600/20 transition-all duration-500"></div>
            <FiStar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
            <span className="relative z-10">Sign In to View Analytics</span>
          </button>
        </div>
      </div>
    );
  }

  // Load analytics
  useEffect(() => {
    if (session) {
      loadAnalytics();
    }
  }, [session]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/analytics', { method: 'GET' }, session);
      setAnalytics(data || {
        totalExpenses: 0,
        monthlyExpenses: 0,
        categoryBreakdown: [],
        monthlyTrend: [],
        topCategories: []
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FiPieChart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate trend vs last month
  let trendValue = 0;
  let trendDirection = 'flat';
  if (analytics?.monthlyTrend?.length >= 2) {
    const last = analytics.monthlyTrend[analytics.monthlyTrend.length - 2].amount;
    const current = analytics.monthlyTrend[analytics.monthlyTrend.length - 1].amount;
    if (last > 0) {
      trendValue = Math.round(((current - last) / last) * 100);
      trendDirection = trendValue > 0 ? 'up' : trendValue < 0 ? 'down' : 'flat';
    } else if (current > 0) {
      trendValue = 100;
      trendDirection = 'up';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <FiPieChart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Analytics</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Insights into your spending patterns</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              // Get Indian time
              const indianTime = new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });
              
              const analyticsData = {
                summary: {
                  totalExpenses: analytics?.totalExpenses || 0,
                  monthlyExpenses: analytics?.monthlyExpenses || 0,
                  topCategories: analytics?.topCategories || []
                },
                trends: {
                  daily: analytics?.dailyTrend || [],
                  weekly: analytics?.weeklyTrend || [],
                  monthly: analytics?.monthlyTrend || [],
                  annual: analytics?.annualTrend || []
                },
                categoryBreakdown: analytics?.categoryBreakdown || [],
                downloadedAt: indianTime,
                period: 'All Time'
              };
              
              const dataStr = JSON.stringify(analyticsData, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              toast.success('Analytics downloaded successfully!');
            }}
            className="group relative px-4 py-3 rounded-2xl text-white font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300"></div>
            <span className="relative flex items-center gap-2">
              <FiDownload className="w-5 h-5" />
              Download
            </span>
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Expenses</h3>
              <FiDollarSign className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{analytics?.totalExpenses?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">All time</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">This Month</h3>
              <FiCalendar className="w-6 h-6 text-pink-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{analytics?.monthlyExpenses?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current month</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
              <FiTarget className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.categoryBreakdown?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active categories</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trend</h3>
              <FiTrendingUp className={`w-6 h-6 ${trendDirection === 'up' ? 'text-green-500' : trendDirection === 'down' ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <p className={`text-3xl font-bold ${trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-900'} dark:text-white`}>
              {trendDirection === 'down' ? '' : '+'}{trendValue}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">vs last month</p>
          </div>
        </div>

        {/* Category Breakdown - Top Section */}
        {analytics && analytics.categoryBreakdown?.length > 0 && (
          <div className="mb-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Category Breakdown</h3>
              <div className="h-96">
                <Pie
                  data={{
                    labels: analytics.categoryBreakdown?.map(c => c.name) || [],
                    datasets: [{
                      data: analytics.categoryBreakdown?.map(c => c.amount) || [],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                      ],
                      borderWidth: 2,
                      borderColor: '#fff'
                    }]
                  }}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { display: true, position: 'bottom' },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ₹${context.parsed.toFixed(2)} (${percentage}%)`;
                          }
                        }
                      }
                    } 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Daily Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Daily Analytics</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Daily Expenses - Bar Chart</h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: analytics.dailyTrend?.map(d => d.label) || ['Today'],
                    datasets: [{
                      label: 'Daily Expenses',
                      data: analytics.dailyTrend?.map(d => d.amount) || [analytics.monthlyExpenses || 0],
                      backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    }]
                  }}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value.toFixed(0);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Daily Expenses - Line Chart</h3>
              <div className="h-80">
                <Line
                  data={{
                    labels: analytics.dailyTrend?.map(d => d.label) || ['Today'],
                    datasets: [{
                      label: 'Daily Expenses',
                      data: analytics.dailyTrend?.map(d => d.amount) || [analytics.monthlyExpenses || 0],
                      borderColor: 'rgba(54, 162, 235, 1)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      fill: true,
                      tension: 0.4
                    }]
                  }}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value.toFixed(0);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Weekly Analytics</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weekly Expenses - Bar Chart</h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: analytics.weeklyTrend?.map(w => w.label) || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                      label: 'Weekly Expenses',
                      data: analytics.weeklyTrend?.map(w => w.amount) || [0, 0, 0, 0],
                      backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    }]
                  }}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value.toFixed(0);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weekly Expenses - Line Chart</h3>
              <div className="h-80">
                <Line
                  data={{
                    labels: analytics.weeklyTrend?.map(w => w.label) || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                      label: 'Weekly Expenses',
                      data: analytics.weeklyTrend?.map(w => w.amount) || [0, 0, 0, 0],
                      borderColor: 'rgba(153, 102, 255, 1)',
                      backgroundColor: 'rgba(153, 102, 255, 0.2)',
                      fill: true,
                      tension: 0.4
                    }]
                  }}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value.toFixed(0);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Monthly Analytics</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Monthly Expenses - Bar Chart</h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: analytics.monthlyTrend?.map(m => m.label) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                      label: 'Monthly Expenses',
                      data: analytics.monthlyTrend?.map(m => m.amount) || [0, 0, 0, 0, 0, 0],
                      backgroundColor: 'rgba(255, 159, 64, 0.8)',
                    }]
                  }}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value.toFixed(0);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Monthly Expenses - Line Chart</h3>
              <div className="h-80">
                <Line
                  data={{
                    labels: analytics.monthlyTrend?.map(m => m.label) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                      label: 'Monthly Expenses',
                      data: analytics.monthlyTrend?.map(m => m.amount) || [0, 0, 0, 0, 0, 0],
                      borderColor: 'rgba(255, 99, 132, 0.8)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                      pointBorderColor: '#fff',
                      pointBorderWidth: 2,
                      pointRadius: 6,
                      pointHoverRadius: 8
                    }]
                  }}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `₹${context.parsed.y.toFixed(2)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value.toFixed(0);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Annual Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Annual Analytics</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Annual Expenses - Bar Chart</h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: analytics.annualTrend?.map(a => a.label) || ['2022', '2023', '2024', '2025'],
                    datasets: [{
                      label: 'Annual Expenses',
                      data: analytics.annualTrend?.map(a => a.amount) || [0, 0, 0, 0],
                      backgroundColor: 'rgba(255, 205, 86, 0.8)',
                    }]
                  }}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value.toFixed(0);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Annual Expenses - Line Chart</h3>
              <div className="h-80">
                <Line
                  data={{
                    labels: analytics.annualTrend?.map(a => a.label) || ['2022', '2023', '2024', '2025'],
                    datasets: [{
                      label: 'Annual Expenses',
                      data: analytics.annualTrend?.map(a => a.amount) || [0, 0, 0, 0],
                      borderColor: 'rgba(255, 99, 132, 1)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      fill: true,
                      tension: 0.4
                    }]
                  }}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '₹' + value.toFixed(0);
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>


        {/* Top Categories */}
        <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FiActivity className="w-6 h-6 text-red-500" />
            Top Spending Categories
          </h3>
          
          {analytics?.topCategories?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.topCategories.map((category, index) => (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/20 dark:border-purple-700/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{category.amount?.toFixed(2) || '0.00'}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category.count || 0} transactions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiActivity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">No category data available</p>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/20 dark:border-purple-700/20">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiStar className="w-6 h-6 text-yellow-500" />
            Financial Insights
          </h3>
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300">
              💡 <strong>Tip:</strong> Start tracking your expenses regularly to get more detailed insights into your spending patterns.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              📊 <strong>Analytics:</strong> The more data you add, the better we can help you understand your financial habits.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              🎯 <strong>Goals:</strong> Set up budgets to track your progress and stay on top of your financial goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
