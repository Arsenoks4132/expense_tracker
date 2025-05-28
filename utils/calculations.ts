import type { Transaction } from "../types"

export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((acc, transaction) => {
    if (transaction.type === "income") {
      return acc + transaction.amount
    } else {
      return acc - transaction.amount
    }
  }, 0)
}

export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0)
}

export const calculateTotalExpense = (transactions: Transaction[]): number => {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0)
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ru-RU")
}
