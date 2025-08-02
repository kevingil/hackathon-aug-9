import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import type { FinancialUser, FinancialSummary, CategorySummary } from "../../types/Financial";

interface Transaction {
  id: number;
  amount: number;
  category: string;
  date?: string;
  description?: string;
  type: 'expense' | 'deposit';
  accountName: string;
}

interface FinancialDashboardProps {
  onToggle?: () => void;
  isCollapsed?: boolean;
}

const FinancialDashboard = ({ onToggle, isCollapsed = false }: FinancialDashboardProps) => {
  const [financialData, setFinancialData] = useState<FinancialUser | null>(null);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Chart tab state
  const [activeTab, setActiveTab] = useState<'expenses-vs-income' | 'expenses-by-category'>('expenses-vs-income');
  
  // Transactions pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'expense' | 'deposit'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const transactionsPerPage = 10;

  // AI Advisor drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mock AI notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'warning',
      title: 'High Spending Alert',
      message: "You've spent $1,247 this week, which is 23% above your usual pattern. Consider reviewing your dining expenses.",
      timestamp: '2 hours ago',
      severity: 'medium',
      category: 'spending',
      actionable: true,
      insights: {
        spentAmount: 1247,
        expectedAmount: 1012,
        difference: 235,
        category: 'dining',
        trend: 'increasing'
      }
    },
    {
      id: 2,
      type: 'success',
      title: 'Savings Goal Progress',
      message: "Great job! You're 78% towards your $2,000 monthly savings goal. You've saved $1,560 so far.",
      timestamp: '6 hours ago',
      severity: 'low',
      category: 'savings',
      actionable: false,
      insights: {
        savedAmount: 1560,
        goalAmount: 2000,
        progressPercent: 78,
        remainingDays: 12
      }
    },
    {
      id: 3,
      type: 'info',
      title: 'Monthly Budget Analysis',
      message: "Your entertainment spending is trending 15% lower than last month. You have extra budget available for other categories.",
      timestamp: '1 day ago',
      severity: 'low',
      category: 'budget',
      actionable: true,
      insights: {
        category: 'entertainment',
        currentSpent: 245,
        lastMonthSpent: 289,
        budgetRemaining: 155,
        trend: 'decreasing'
      }
    },
    {
      id: 4,
      type: 'urgent',
      title: 'Unusual Transaction Pattern',
      message: "I noticed 3 large transactions over $500 in the past week. This is unusual for your spending pattern. Review if needed.",
      timestamp: '2 days ago',
      severity: 'high',
      category: 'security',
      actionable: true,
      insights: {
        transactionCount: 3,
        averageAmount: 567,
        timeframe: '7 days',
        flaggedTransactions: [
          { amount: 542, merchant: 'Electronics Store', date: '2024-01-15' },
          { amount: 678, merchant: 'Home Improvement', date: '2024-01-16' },
          { amount: 489, merchant: 'Department Store', date: '2024-01-17' }
        ]
      }
    },
    {
      id: 5,
      type: 'tip',
      title: 'Smart Saving Opportunity',
      message: "Based on your income pattern, you could save an additional $320/month by optimizing your subscription services.",
      timestamp: '3 days ago',
      severity: 'low',
      category: 'optimization',
      actionable: true,
      insights: {
        potentialSavings: 320,
        subscriptionCount: 12,
        unusedServices: 3,
        recommendations: [
          'Cancel unused streaming services: $45/month',
          'Switch to annual billing: $85/month saved',
          'Bundle services for discount: $190/month saved'
        ]
      }
    }
  ];

  useEffect(() => {
    const calculateSummary = (data: FinancialUser): FinancialSummary => {
      const totalBalance = data.accounts.reduce((sum, account) => sum + account.balance, 0);
      
      const allExpenses = data.accounts.flatMap(account => account.expenses);
      const allDeposits = data.accounts.flatMap(account => account.deposits);
      
      const totalExpenses = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalIncome = allDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
      
      const expensesByCategory = groupByCategory(allExpenses, 'expense');
      const incomeByCategory = groupByCategory(allDeposits, 'deposit');
      
      return {
        totalBalance,
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        expensesByCategory,
        incomeByCategory,
      };
    };

    const fetchFinancialData = async () => {
    try {
      const response = await fetch("/api/chat/financial-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success && result.data) {
        setFinancialData(result.data);
        setSummary(calculateSummary(result.data));
      } else {
        console.error("Failed to fetch financial data:", result.error);
        // Fallback to mock data if API fails
        const mockData: FinancialUser = {
          id: 1,
          accounts: [
            {
              id: 1,
              name: "Checking Account",
              expenses: [
                { id: 1, amount: 100.0, category: "food" },
                { id: 2, amount: 200.0, category: "rent" },
                { id: 3, amount: 50.0, category: "entertainment" },
              ],
              deposits: [
                { id: 1, amount: 500.0, category: "work" },
                { id: 2, amount: 200.0, category: "gift" },
              ],
              balance: 450.0,
            },
            {
              id: 2,
              name: "Savings Account",
              expenses: [
                { id: 1, amount: 20.0, category: "savings" },
              ],
              deposits: [
                { id: 1, amount: 1000.0, category: "work" },
                { id: 2, amount: 500.0, category: "gift" },
              ],
              balance: 1480.0,
            },
          ],
        };
        setFinancialData(mockData);
        setSummary(calculateSummary(mockData));
      }
    } catch (error) {
      console.error("Error fetching financial data:", error);
      // Fallback to mock data on network error
      const mockData: FinancialUser = {
        id: 1,
        accounts: [
          {
            id: 1,
            name: "Checking Account",
            expenses: [
              { id: 1, amount: 100.0, category: "food" },
              { id: 2, amount: 200.0, category: "rent" },
              { id: 3, amount: 50.0, category: "entertainment" },
            ],
            deposits: [
              { id: 1, amount: 500.0, category: "work" },
              { id: 2, amount: 200.0, category: "gift" },
            ],
            balance: 450.0,
          },
          {
            id: 2,
            name: "Savings Account",
            expenses: [
              { id: 1, amount: 20.0, category: "savings" },
            ],
            deposits: [
              { id: 1, amount: 1000.0, category: "work" },
              { id: 2, amount: 500.0, category: "gift" },
            ],
            balance: 1480.0,
          },
        ],
      };
      setFinancialData(mockData);
      setSummary(calculateSummary(mockData));
    } finally {
      setLoading(false);
    }
    };

    fetchFinancialData();
  }, []);

  const groupByCategory = (items: any[], type: 'expense' | 'deposit'): CategorySummary[] => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, amount]) => ({
      category,
      amount: amount as number,
      type,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const preparePieChartData = () => {
    if (!summary || !summary.expensesByCategory.length) return [];
    
    // Define colors for different expense categories
    const categoryColors: { [key: string]: string } = {
      food: '#EF4444', // Red
      rent: '#F97316', // Orange
      entertainment: '#8B5CF6', // Purple
      utilities: '#EAB308', // Yellow
      transportation: '#6366F1', // Indigo
      healthcare: '#EC4899', // Pink
      shopping: '#06B6D4', // Cyan
      personal_care: '#8B5CF6', // Violet
      education: '#F59E0B', // Amber
      savings: '#3B82F6', // Blue
      investment: '#64748B', // Slate
      transfer: '#737373', // Neutral
    };
    
    // Generate colors for categories, cycling through a palette if needed
    const defaultColors = [
      '#EF4444', '#F97316', '#8B5CF6', '#EAB308', '#6366F1', 
      '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#64748B'
    ];
    
    return summary.expensesByCategory.map((category, index) => ({
      name: category.category.charAt(0).toUpperCase() + category.category.slice(1).replace('_', ' '),
      value: category.amount,
      color: categoryColors[category.category] || defaultColors[index % defaultColors.length],
    }));
  };

  const prepareMonthlyData = () => {
    if (!financialData) return [];

    const allTransactions = getAllTransactions();
    const monthlyData: { [key: string]: { expenses: number; income: number } } = {};

    allTransactions.forEach(transaction => {
      // If no date, use current month as fallback
      const date = transaction.date ? new Date(transaction.date) : new Date();
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { expenses: 0, income: 0 };
      }

      if (transaction.type === 'expense') {
        monthlyData[monthKey].expenses += transaction.amount;
      } else {
        monthlyData[monthKey].income += transaction.amount;
      }
    });

    // Convert to array and sort by month
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        expenses: data.expenses,
        income: data.income,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month + ' 01');
        const dateB = new Date(b.month + ' 01');
        return dateA.getTime() - dateB.getTime();
      });
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="10"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getCategoryColor = (category: string, type: 'expense' | 'deposit') => {
    const expenseColors = {
      food: 'bg-red-100 text-red-800',
      rent: 'bg-orange-100 text-orange-800',
      entertainment: 'bg-purple-100 text-purple-800',
      savings: 'bg-blue-100 text-blue-800',
      utilities: 'bg-yellow-100 text-yellow-800',
      transportation: 'bg-indigo-100 text-indigo-800',
      healthcare: 'bg-pink-100 text-pink-800',
      shopping: 'bg-cyan-100 text-cyan-800',
      personal_care: 'bg-violet-100 text-violet-800',
      education: 'bg-amber-100 text-amber-800',
      investment: 'bg-slate-100 text-slate-800',
      transfer: 'bg-neutral-100 text-neutral-800',
      default: 'bg-gray-100 text-gray-800',
    };

    const incomeColors = {
      work: 'bg-green-100 text-green-800',
      salary: 'bg-green-100 text-green-800',
      gift: 'bg-pink-100 text-pink-800',
      freelance: 'bg-blue-100 text-blue-800',
      bonus: 'bg-emerald-100 text-emerald-800',
      side_hustle: 'bg-teal-100 text-teal-800',
      financial_aid: 'bg-orange-100 text-orange-800',
      family: 'bg-rose-100 text-rose-800',
      tutoring: 'bg-purple-100 text-purple-800',
      refund: 'bg-lime-100 text-lime-800',
      cashback: 'bg-sky-100 text-sky-800',
      investment: 'bg-slate-100 text-slate-800',
      transfer: 'bg-neutral-100 text-neutral-800',
      default: 'bg-emerald-100 text-emerald-800',
    };

    const colors = type === 'expense' ? expenseColors : incomeColors;
    return colors[category as keyof typeof colors] || colors.default;
  };

  // Process and combine all transactions
  const getAllTransactions = (): Transaction[] => {
    if (!financialData) return [];

    const transactions: Transaction[] = [];

    financialData.accounts.forEach(account => {
      // Add expenses
      account.expenses.forEach(expense => {
        transactions.push({
          ...expense,
          type: 'expense',
          accountName: account.name,
        });
      });

      // Add deposits
      account.deposits.forEach(deposit => {
        transactions.push({
          ...deposit,
          type: 'deposit',
          accountName: account.name,
        });
      });
    });

    return transactions;
  };

  // Filter and sort transactions
  const getFilteredAndSortedTransactions = () => {
    let transactions = getAllTransactions();

    // Apply filter
    if (transactionFilter !== 'all') {
      transactions = transactions.filter(t => t.type === transactionFilter);
    }

    // Apply sorting
    transactions.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'date') {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        comparison = dateA - dateB;
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return transactions;
  };

  // Paginate transactions
  const getPaginatedTransactions = () => {
    const filteredTransactions = getFilteredAndSortedTransactions();
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    
    return {
      transactions: filteredTransactions.slice(startIndex, endIndex),
      totalTransactions: filteredTransactions.length,
      totalPages: Math.ceil(filteredTransactions.length / transactionsPerPage),
    };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                {summary ? formatCurrency(summary.totalBalance) : '--'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {summary ? formatCurrency(summary.totalExpenses) : '--'}
              </span>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Expand
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            🚀 Notifications
            {mockNotifications.some(n => n.severity === 'high') && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Charts Section with Tabs */}
        <div className="bg-gray-50 p-4 rounded-lg">
          {/* Tabs Navigation */}
          <div className="flex space-x-1 mb-4 bg-white rounded-lg p-1">
            <button
              onClick={() => setActiveTab('expenses-vs-income')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'expenses-vs-income'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Expenses vs Income
            </button>
            <button
              onClick={() => setActiveTab('expenses-by-category')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'expenses-by-category'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Expenses by Category
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'expenses-vs-income' && (
            <div className="w-full h-80">
              <h4 className="text-md font-semibold text-gray-800 mb-4">Monthly Expenses vs Income</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareMonthlyData()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  maxBarSize={60}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="income" stackId="a" fill="#6455e9" name="Income" />
                  <Bar dataKey="expenses" stackId="a" fill="#cc62f6" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'expenses-by-category' && (
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preparePieChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {preparePieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-1/2 lg:pl-6 mt-4 lg:mt-0">
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 text-left">Expenses by Category</h4>
                  {preparePieChartData().map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                  {preparePieChartData().length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-700">Total Expenses</span>
                        <span className="text-sm font-bold text-red-700">
                          {summary ? formatCurrency(summary.totalExpenses) : '--'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accounts */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-3">Accounts</h4>
          <div className="space-y-2">
            {financialData?.accounts.map((account) => (
              <div key={account.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">{account.name}</span>
                <span className="font-bold text-gray-900">{formatCurrency(account.balance)}</span>
              </div>
            ))}
          </div>
        </div>


        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-800">Recent Transactions</h4>
            <div className="flex items-center space-x-2">
              {/* Filter buttons */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => {
                    setTransactionFilter('all');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    transactionFilter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setTransactionFilter('deposit');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-xs font-medium transition-colors border-l border-gray-200 ${
                    transactionFilter === 'deposit'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => {
                    setTransactionFilter('expense');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-xs font-medium transition-colors border-l border-gray-200 ${
                    transactionFilter === 'expense'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Expenses
                </button>
              </div>

              {/* Sort controls */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                  setCurrentPage(1);
                }}
                className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700"
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Transactions list */}
          <div className="bg-gray-50 rounded-lg">
            {(() => {
              const { transactions, totalTransactions, totalPages } = getPaginatedTransactions();
              
              if (transactions.length === 0) {
                return (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-lg mb-2">📊</div>
                    <p>No transactions found</p>
                    {transactionFilter !== 'all' && (
                      <button
                        onClick={() => {
                          setTransactionFilter('all');
                          setCurrentPage(1);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                      >
                        Show all transactions
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <>
                  <div className="divide-y divide-gray-200">
                    {transactions.map((transaction, index) => (
                      <div key={`${transaction.type}-${transaction.id}-${index}`} className="p-4 hover:bg-white transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                transaction.type === 'expense' 
                                  ? 'bg-red-100 text-red-600' 
                                  : 'bg-green-100 text-green-600'
                              }`}>
                                {transaction.type === 'expense' ? '↗' : '↙'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h5 className="text-sm font-medium text-gray-900 truncate">
                                    {transaction.description || `${transaction.type === 'expense' ? 'Expense' : 'Income'} #${transaction.id}`}
                                  </h5>
                                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category, transaction.type)}`}>
                                    {transaction.category}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                  <span>{transaction.accountName}</span>
                                  <span>•</span>
                                  <span>{formatDate(transaction.date)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${
                              transaction.type === 'expense' 
                                ? 'text-red-600' 
                                : 'text-green-600'
                            }`}>
                              {transaction.type === 'expense' ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Showing {((currentPage - 1) * transactionsPerPage) + 1} to {Math.min(currentPage * transactionsPerPage, totalTransactions)} of {totalTransactions} transactions
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                              let pageNumber;
                              if (totalPages <= 5) {
                                pageNumber = index + 1;
                              } else if (currentPage <= 3) {
                                pageNumber = index + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNumber = totalPages - 4 + index;
                              } else {
                                pageNumber = currentPage - 2 + index;
                              }

                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => setCurrentPage(pageNumber)}
                                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                                    currentPage === pageNumber
                                      ? 'bg-blue-500 text-white'
                                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* AI Advisor Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-[700px] bg-white shadow-xl transform transition-transform">

            <div className="p-4 h-full overflow-y-auto">
              <div className="space-y-4">
              <div className="">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <p className="text-black text-sm">Real-time insights & recommendations</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-500 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 ${
                      notification.type === 'urgent' ? 'border-red-200 bg-red-50' :
                      notification.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      notification.type === 'success' ? 'border-green-200 bg-green-50' :
                      notification.type === 'info' ? 'border-blue-200 bg-blue-50' :
                      'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {/* Notification Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          notification.type === 'urgent' ? 'bg-red-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'info' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="font-medium text-gray-900">{notification.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{notification.timestamp}</span>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-700 mb-3">{notification.message}</p>

                    {/* Insights Data */}
                    {notification.insights && (
                      <div className="bg-white rounded-md p-3 border border-gray-100">
                        <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                          Insights & Data
                        </h4>
                        
                        {notification.category === 'spending' && (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Spent:</span>
                              <span className="font-medium ml-1">${notification.insights.spentAmount}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Expected:</span>
                              <span className="font-medium ml-1">${notification.insights.expectedAmount}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Difference:</span>
                              <span className="font-medium ml-1 text-red-600">+${notification.insights.difference}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Category:</span>
                              <span className="font-medium ml-1 capitalize">{notification.insights.category}</span>
                            </div>
                          </div>
                        )}

                        {notification.category === 'savings' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Progress:</span>
                              <span className="font-medium">{notification.insights.progressPercent}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${notification.insights.progressPercent}%` }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Saved:</span>
                                <span className="font-medium ml-1">${notification.insights.savedAmount}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Goal:</span>
                                <span className="font-medium ml-1">${notification.insights.goalAmount}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {notification.category === 'security' && notification.insights.flaggedTransactions && (
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-gray-500">Flagged Transactions:</span>
                            </div>
                            <div className="space-y-1">
                              {notification.insights.flaggedTransactions.map((tx, idx) => (
                                <div key={idx} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                                  <span className="font-medium">{tx.merchant}</span>
                                  <div className="text-right">
                                    <div className="font-medium">${tx.amount}</div>
                                    <div className="text-gray-500">{tx.date}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {notification.category === 'optimization' && notification.insights.recommendations && (
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-gray-500">Potential Savings:</span>
                              <span className="font-medium ml-1 text-green-600">${notification.insights.potentialSavings}/month</span>
                            </div>
                            <div className="space-y-1">
                              {notification.insights.recommendations.map((rec, idx) => (
                                <div key={idx} className="text-xs bg-green-50 p-2 rounded border border-green-100">
                                  {rec}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {notification.category === 'budget' && (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Current:</span>
                              <span className="font-medium ml-1">${notification.insights.currentSpent}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Last Month:</span>
                              <span className="font-medium ml-1">${notification.insights.lastMonthSpent}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Remaining:</span>
                              <span className="font-medium ml-1 text-green-600">${notification.insights.budgetRemaining}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Trend:</span>
                              <span className={`font-medium ml-1 ${
                                notification.insights.trend === 'decreasing' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {notification.insights.trend === 'decreasing' ? '↓' : '↑'} {notification.insights.trend}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    {notification.actionable && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                          notification.type === 'urgent' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                          notification.type === 'success' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                          notification.type === 'info' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                          'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                          Take Action
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">AI Summary</h3>
                <p className="text-sm text-blue-800">
                  Based on your spending patterns, I recommend focusing on optimizing subscription services and 
                  monitoring dining expenses. Your overall financial health is strong with good savings progress.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white bg-opacity-60 p-2 rounded">
                    <span className="text-blue-600 font-medium">Risk Level:</span>
                    <span className="ml-1 text-blue-800">Low-Medium</span>
                  </div>
                  <div className="bg-white bg-opacity-60 p-2 rounded">
                    <span className="text-blue-600 font-medium">Score:</span>
                    <span className="ml-1 text-blue-800">8.2/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;
