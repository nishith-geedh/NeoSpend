'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { apiCall } from '../../lib/api';
import { 
  FiDollarSign, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFilter, 
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiCalendar,
  FiTag,
  FiDownload
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ExpensesPage() {
  const { data: session, status } = useSession();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  // Authentication check
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
              <FiDollarSign className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-float delay-500"></div>
        </div>
        
        <div className="text-center max-w-md mx-auto px-6 relative z-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <FiDollarSign className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl opacity-20 blur-xl animate-pulse mx-auto"></div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
            Track Your Expenses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Please sign in to access your expense tracking dashboard and start managing your finances.
          </p>
          <button 
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              signIn("cognito", { 
                callbackUrl: "/expenses",
                redirect: true 
              });
            }}
            className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-110 flex items-center space-x-4 mx-auto overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-red-500/20 to-orange-500/0 group-hover:from-orange-600/20 group-hover:via-red-600/40 group-hover:to-orange-600/20 transition-all duration-500"></div>
            <FiStar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
            <span className="relative z-10">Sign In to Track Expenses</span>
          </button>
        </div>
      </div>
    );
  }

  // Load expenses and categories
  useEffect(() => {
    if (session) {
      loadExpenses();
      loadCategories();
    }
  }, [session]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/expenses', { method: 'GET' }, session);
      setExpenses(data || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await apiCall(`/expenses/${editingExpense.expenseId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        }, session);
        toast.success('Expense updated successfully');
      } else {
        await apiCall('/expenses', {
          method: 'POST',
          body: JSON.stringify(formData)
        }, session);
        toast.success('Expense added successfully');
      }
      
      setShowModal(false);
      setEditingExpense(null);
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      loadExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      date: expense.date
    });
    setShowModal(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await apiCall(`/expenses/${expenseId}`, { method: 'DELETE' }, session);
        toast.success('Expense deleted successfully');
        loadExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryForm)
      }, session);
      toast.success('Category added successfully');
      setShowCategoryModal(false);
      setCategoryForm({ name: '' });
      loadCategories();
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !filters.category || expense.category === filters.category;
    const matchesSearch = !filters.search || 
      expense.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      expense.category.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDateFrom = !filters.dateFrom || expense.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || expense.date <= filters.dateTo;
    
    return matchesCategory && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Floating Finance Icons */}
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-60 animate-bounce"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-r from-red-500 to-amber-500 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-4 -right-4 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            
            {/* Central Spinning Star */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 rounded-full flex items-center justify-center animate-spin">
              <FiStar className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Track Your Expenses
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Log your daily expenses, categorize spending, and gain insights into where your money goes.
          </p>

          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              signIn("cognito", { 
                callbackUrl: "/expenses",
                redirect: true 
              });
            }}
            className="group relative px-8 py-4 rounded-2xl text-lg font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 group-hover:from-orange-500 group-hover:via-red-500 group-hover:to-amber-500 transition-all duration-300"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 rounded-full flex items-center justify-center animate-pulse">
            <FiStar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading your expenses...</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we fetch your financial data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
              <FiDollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Expenses</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Track and manage your spending</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="group relative px-6 py-3 rounded-2xl text-white font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 group-hover:from-orange-500 group-hover:via-red-500 group-hover:to-amber-500 transition-all duration-300"></div>
              <span className="relative flex items-center gap-2">
                <FiPlus className="w-5 h-5" />
                Add Expense
              </span>
            </button>
            
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
                
                // Format expenses with Indian dates and remove userId
                const formattedExpenses = expenses.map(expense => {
                  const { userId, ...expenseWithoutUserId } = expense;
                  
                  // Convert dates to Indian format
                  const formatToIndianDate = (dateString) => {
                    if (!dateString) return dateString;
                    const date = new Date(dateString);
                    return date.toLocaleDateString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    });
                  };
                  
                  const formatToIndianDateTime = (dateString) => {
                    if (!dateString) return dateString;
                    const date = new Date(dateString);
                    return date.toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    });
                  };
                  
                  return {
                    ...expenseWithoutUserId,
                    date: formatToIndianDate(expense.date),
                    createdAt: formatToIndianDateTime(expense.createdAt),
                    updatedAt: formatToIndianDateTime(expense.updatedAt)
                  };
                });
                
                const dataStr = JSON.stringify({
                  expenses: formattedExpenses,
                  downloadedAt: indianTime,
                  totalExpenses: formattedExpenses.length,
                  totalAmount: formattedExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
                }, null, 2);
                
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `expenses_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                toast.success('Expenses downloaded successfully!');
              }}
              className="group relative px-4 py-3 rounded-2xl text-white font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 group-hover:from-orange-400 group-hover:to-red-400 transition-all duration-300"></div>
              <span className="relative flex items-center gap-2">
                <FiDownload className="w-5 h-5" />
                Download
              </span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Search Expenses</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.categoryId} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {filters.category && (
                <button onClick={() => setFilters({...filters, category: ''})} className="mt-1 text-xs text-blue-600 hover:underline">Clear filter</button>
              )}
              <button 
                onClick={() => setShowCategoryModal(true)} 
                className="mt-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <FiPlus className="w-4 h-4" />
                Add Category
              </button>
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
              <input
                type="date"
                placeholder="From Date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
              <input
                type="date"
                placeholder="To Date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 grid md:grid-cols-3 gap-6">
          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl"
               style={{ animationDelay: '0ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text transition-all duration-300">Total Expenses</h3>
              <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FiDollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text transition-all duration-300">₹{totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Filtered results</p>
          </div>
          
          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl"
               style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-300">Total Count</h3>
              <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-300">{filteredExpenses.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Transactions</p>
          </div>
          
          <div className="group p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl"
               style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all duration-300">Average</h3>
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all duration-300">
              ₹{filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Per transaction</p>
          </div>
        </div>

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full mx-auto flex items-center justify-center">
                <FiDollarSign className="w-12 h-12 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No expenses found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Start tracking your expenses to see them here.</p>
            <button
              onClick={() => setShowModal(true)}
              className="group relative px-8 py-4 rounded-2xl text-white font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 group-hover:from-orange-500 group-hover:via-red-500 group-hover:to-amber-500 transition-all duration-300"></div>
              <span className="relative flex items-center gap-2">
                <FiPlus className="w-5 h-5" />
                Add Your First Expense
              </span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredExpenses.map((expense) => (
              <div key={expense.expenseId} className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <FiTag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{expense.description}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{expense.category} • {expense.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{expense.amount.toFixed(2)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-300"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.expenseId)}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-300"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <div className="flex gap-2">
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.categoryId} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(true)}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center gap-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="What did you spend on?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingExpense(null);
                      setFormData({
                        amount: '',
                        category: '',
                        description: '',
                        date: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium hover:from-orange-700 hover:to-red-700 transition-all duration-300"
                  >
                    {editingExpense ? 'Update' : 'Add'} Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Category</h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                  <input 
                    type="text" 
                    required 
                    value={categoryForm.name} 
                    onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    placeholder="e.g. Food, Transport, Entertainment"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowCategoryModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300">Add Category</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
