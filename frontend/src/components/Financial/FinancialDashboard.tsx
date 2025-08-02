import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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
  
  // Transactions pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'expense' | 'deposit'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const transactionsPerPage = 10;

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
    if (!summary) return [];
    
    return [
      {
        name: 'Total Balance',
        value: summary.totalBalance,
        color: '#10B981', // Green
      },
      {
        name: 'Income',
        value: summary.totalIncome,
        color: '#3B82F6', // Blue
      },
      {
        name: 'Expenses',
        value: summary.totalExpenses,
        color: '#EF4444', // Red
      },
    ];
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
          {onToggle && (
            <button
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Financial Overview Pie Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-800 mb-3 text-center">Financial Summary</h4>
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
                    outerRadius={80}
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
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-700">Net Income</span>
                    <span className={`text-sm font-bold ${summary && summary.netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {summary ? formatCurrency(summary.netIncome) : '--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Expenses by Category */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">Expenses by Category</h4>
            <div className="space-y-2">
              {summary?.expensesByCategory.map((category) => (
                <div key={category.category} className="flex justify-between items-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.category, 'expense')}`}>
                    {category.category}
                  </span>
                  <span className="font-medium text-gray-900">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Income by Category */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">Income by Category</h4>
            <div className="space-y-2">
              {summary?.incomeByCategory.map((category) => (
                <div key={category.category} className="flex justify-between items-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.category, 'deposit')}`}>
                    {category.category}
                  </span>
                  <span className="font-medium text-gray-900">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
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
    </div>
  );
};

export default FinancialDashboard;
