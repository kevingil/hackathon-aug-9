export interface Expense {
  id: number;
  amount: number;
  category: string;
}

export interface Deposit {
  id: number;
  amount: number;
  category: string;
}

export interface Account {
  id: number;
  name: string;
  expenses: Expense[];
  deposits: Deposit[];
  balance: number;
}

export interface FinancialUser {
  id: number;
  accounts: Account[];
}

export interface CategorySummary {
  category: string;
  amount: number;
  type: 'expense' | 'deposit';
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  expensesByCategory: CategorySummary[];
  incomeByCategory: CategorySummary[];
}
