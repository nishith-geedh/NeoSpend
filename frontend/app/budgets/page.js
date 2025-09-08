'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { apiCall } from '../../lib/api';
import { 
  FiTarget, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiDollarSign, 
  FiAlertCircle,
  FiStar,
  FiTrendingUp,
  FiCalendar,
  FiPieChart,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function BudgetsPage() {
  const { data: session, status } = useSession();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAlertNotification, setShowAlertNotification] = useState(false);
  const [alertCategories, setAlertCategories] = useState([]);

  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    alertThreshold: 80,
    period: 'monthly'
  });

  // Authentication check
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
              <FiTarget className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading budgets...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        
        <div className="text-center max-w-md mx-auto px-6 relative z-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <FiTarget className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl opacity-20 blur-xl animate-pulse mx-auto"></div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
            Manage Your Budgets
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Please sign in to access your budget management dashboard and start setting financial goals.
          </p>
          <button 
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              signIn("cognito", { 
                callbackUrl: "/budgets",
                redirect: true 
              });
            }}
            className="group relative px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-110 flex items-center space-x-4 mx-auto overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-emerald-500/20 to-green-500/0 group-hover:from-green-600/20 group-hover:via-emerald-600/40 group-hover:to-green-600/20 transition-all duration-500"></div>
            <FiStar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
            <span className="relative z-10">Sign In to Manage Budgets</span>
          </button>
        </div>
      </div>
    );
  }

  // Load budgets, expenses, and categories
  useEffect(() => {
    if (session) {
      loadBudgets();
      loadExpenses();
      loadCategories();
    }
  }, [session]);

  // Refresh data when page becomes visible (user navigates back to this page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session) {
        loadExpenses(); // Refresh expenses to update budget calculations
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [session]);

  // Check for alerts when budgets or expenses change
  useEffect(() => {
    if (budgets.length > 0 && expenses.length >= 0) {
      checkBudgetAlerts();
    }
  }, [budgets, expenses]);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/budgets', { method: 'GET' }, session);
      setBudgets(data || []);
    } catch (error) {
      console.error('Error loading budgets:', error);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = async () => {
    try {
      const data = await apiCall('/expenses', { method: 'GET' }, session);
      console.log('Loaded expenses for budget calculation:', data);
      setExpenses(data || []);
      
      // Debug: Log all expenses with their categories and dates
      if (data && data.length > 0) {
        console.log('All expenses:', data.map(e => ({ 
          category: e.category, 
          amount: e.amount, 
          date: e.date,
          description: e.description 
        })));
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiCall('/categories', { method: 'GET' }, session);
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Check for budget alerts and show notification
  const checkBudgetAlerts = () => {
    const alertingBudgets = budgets.filter(budget => {
      const { alert } = getBudgetProgress(budget);
      return alert;
    });

    if (alertingBudgets.length > 0) {
      setAlertCategories(alertingBudgets.map(b => b.category));
      setShowAlertNotification(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await apiCall(`/budgets/${editingBudget.budgetId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        }, session);
        toast.success('Budget updated successfully');
      } else {
        await apiCall('/budgets', {
          method: 'POST',
          body: JSON.stringify(formData)
        }, session);
        toast.success('Budget created successfully');
      }
      
      setShowModal(false);
      setEditingBudget(null);
      setFormData({
        category: '',
        amount: '',
        alertThreshold: 80,
        period: 'monthly'
      });
      loadBudgets();
      loadExpenses(); // Refresh expenses to update budget calculations
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      alertThreshold: budget.alertThreshold,
      period: budget.period
    });
    setShowModal(true);
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await apiCall(`/budgets/${budgetId}`, { method: 'DELETE' }, session);
        toast.success('Budget deleted successfully');
        loadBudgets();
      } catch (error) {
        console.error('Error deleting budget:', error);
        toast.error('Failed to delete budget');
      }
    }
  };

  const totalBudgetAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0);

  // Helper to calculate progress and alert for a budget
  const getBudgetProgress = (budget) => {
    // Filter expenses for this budget's category and period
    const now = new Date();
    let periodStart;
    if (budget.period === 'weekly') {
      // Start of this week (Monday)
      periodStart = new Date(now);
      periodStart.setDate(now.getDate() - now.getDay() + 1);
      periodStart.setHours(0, 0, 0, 0); // Reset time to start of day
    } else if (budget.period === 'monthly') {
      // Start of this month
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (budget.period === 'yearly') {
      // Start of this year
      periodStart = new Date(now.getFullYear(), 0, 1);
    } else {
      periodStart = new Date(0);
    }
    
    // Convert periodStart to ISO date string for comparison
    const periodStartStr = periodStart.toISOString().split('T')[0];
    
    const relevantExpenses = expenses.filter(e => {
      // Compare date strings directly
      return e.category === budget.category && e.date >= periodStartStr;
    });
    
    const spent = relevantExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const percent = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
    const alert = percent >= budget.alertThreshold;
    
    console.log(`Budget ${budget.category}: spent=${spent}, percent=${percent}%, alert=${alert}, expenses=${relevantExpenses.length}, periodStart=${periodStartStr}`);
    console.log('Relevant expenses:', relevantExpenses);
    
    return { spent, percent, alert };
  };

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Floating Finance Icons */}
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-60 animate-bounce"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-teal-500 to-green-500 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-4 -right-4 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            
            {/* Central Spinning Star */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center animate-spin">
              <FiStar className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Manage Your Budgets
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Set spending limits, create financial goals, and get alerts when you're approaching your budget.
          </p>

          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              signIn("cognito", { 
                callbackUrl: "/budgets",
                redirect: true 
              });
            }}
            className="group relative px-8 py-4 rounded-2xl text-lg font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 group-hover:from-green-500 group-hover:via-emerald-500 group-hover:to-teal-500 transition-all duration-300"></div>
            <span className="relative flex items-center justify-center gap-3">
              Sign In to Continue
              <FiStar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse">
            <FiStar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading your budgets...</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we fetch your budget data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
              <FiTarget className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Budgets</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Set and track your spending limits</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="group relative px-6 py-3 rounded-2xl text-white font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 group-hover:from-green-500 group-hover:via-emerald-500 group-hover:to-teal-500 transition-all duration-300"></div>
            <span className="relative flex items-center gap-2">
              <FiPlus className="w-5 h-5" />
              Create Budget
            </span>
          </button>
        </div>

        {/* Summary */}
        <div className="mb-8 grid md:grid-cols-3 gap-6">
          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Budget</h3>
              <FiDollarSign className="w-6 h-6 text-green-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">₹{totalBudgetAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Across all categories</p>
          </div>
          
          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Budgets</h3>
              <FiTarget className="w-6 h-6 text-emerald-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">{budgets.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
          </div>
          
          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alerts</h3>
              <FiAlertCircle className="w-6 h-6 text-yellow-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
              {budgets.filter(budget => {
                const { alert } = getBudgetProgress(budget);
                return alert;
              }).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Threshold warnings</p>
          </div>
        </div>

        {/* Budgets List */}
        {budgets.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mx-auto flex items-center justify-center">
                <FiTarget className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No budgets created</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Create your first budget to start managing your spending.</p>
            <button
              onClick={() => setShowModal(true)}
              className="group relative px-8 py-4 rounded-2xl text-white font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 group-hover:from-green-500 group-hover:via-emerald-500 group-hover:to-teal-500 transition-all duration-300"></div>
              <span className="relative flex items-center gap-2">
                <FiPlus className="w-5 h-5" />
                Create Your First Budget
              </span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {budgets.map((budget) => {
              const { spent, percent, alert } = getBudgetProgress(budget);
              return (
                <div key={budget.budgetId} className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <FiPieChart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {budget.period} • Alert at {budget.alertThreshold}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ₹{budget.amount.toFixed(2)}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Budget limit</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-300"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(budget.budgetId)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-300"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Progress</span>
                      <span className="font-medium">{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all duration-500 ${alert ? 'bg-gradient-to-r from-yellow-400 to-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span className="font-medium">₹{spent.toFixed(2)} spent</span>
                      <span>of ₹{budget.amount.toFixed(2)}</span>
                    </div>
                    {alert && (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 animate-pulse">
                        <FiAlertCircle className="inline-block" /> Alert: {percent}% used (Threshold: {budget.alertThreshold}%)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {editingBudget ? 'Edit Budget' : 'Create New Budget'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alert Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.alertThreshold}
                    onChange={(e) => setFormData({...formData, alertThreshold: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBudget(null);
                      setFormData({
                        category: '',
                        amount: '',
                        alertThreshold: 80,
                        period: 'monthly'
                      });
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                  >
                    {editingBudget ? 'Update' : 'Create'} Budget
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Budget Alert Notification */}
        {showAlertNotification && (
          <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 shadow-2xl border border-red-500/30 backdrop-blur-sm max-w-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-xl">!</span>
                  </div>
                </div>
                <div className="text-white flex-1">
                  <h3 className="font-bold text-xl mb-1">Budget Alert!</h3>
                  <p className="text-base font-medium">
                    You've exceeded the threshold for: <span className="font-bold text-yellow-300">{alertCategories.join(', ')}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowAlertNotification(false)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
