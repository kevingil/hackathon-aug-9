import { useState, useEffect } from "react";
import type { FinancialUser, FinancialSummary, CategorySummary } from "../../types/Financial";

interface FinancialDashboardProps {
  onToggle?: () => void;
  isCollapsed?: boolean;
}

const FinancialDashboard = ({ onToggle, isCollapsed = false }: FinancialDashboardProps) => {
  const [financialData, setFinancialData] = useState<FinancialUser | null>(null);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

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

  const getCategoryColor = (category: string, type: 'expense' | 'deposit') => {
    const expenseColors = {
      food: 'bg-red-100 text-red-800',
      rent: 'bg-orange-100 text-orange-800',
      entertainment: 'bg-purple-100 text-purple-800',
      savings: 'bg-blue-100 text-blue-800',
      default: 'bg-gray-100 text-gray-800',
    };

    const incomeColors = {
      work: 'bg-green-100 text-green-800',
      gift: 'bg-pink-100 text-pink-800',
      default: 'bg-emerald-100 text-emerald-800',
    };

    const colors = type === 'expense' ? expenseColors : incomeColors;
    return colors[category as keyof typeof colors] || colors.default;
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
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Total Balance</p>
            <p className="text-lg font-bold text-green-800">
              {summary ? formatCurrency(summary.totalBalance) : '--'}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Income</p>
            <p className="text-lg font-bold text-blue-800">
              {summary ? formatCurrency(summary.totalIncome) : '--'}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Expenses</p>
            <p className="text-lg font-bold text-red-800">
              {summary ? formatCurrency(summary.totalExpenses) : '--'}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Net Income</p>
            <p className={`text-lg font-bold ${summary && summary.netIncome >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              {summary ? formatCurrency(summary.netIncome) : '--'}
            </p>
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
      </div>
    </div>
  );
};

export default FinancialDashboard;
