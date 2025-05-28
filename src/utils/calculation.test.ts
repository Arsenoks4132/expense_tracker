import {
  calculateBalance,
  calculateTotalIncome,
  calculateTotalExpense,
  formatCurrency,
  formatDate,
} from "./calculations"
import { describe, it, expect } from "vitest"

describe("utils/calculations", () => {
  const mockTransactions = [
    { id: 1, type: "income", amount: 1000, category: "Salary", date: "2025-01-01" },
    { id: 2, type: "expense", amount: 200, category: "Food", date: "2025-01-02" },
    { id: 3, type: "income", amount: 500, category: "Bonus", date: "2025-01-03" },
    { id: 4, type: "expense", amount: 100, category: "Transport", date: "2025-01-04" },
  ]

  it("calculateBalance should return correct net balance", () => {
    expect(calculateBalance(mockTransactions)).toBe(1200)
  })

  it("calculateTotalIncome should return correct sum of incomes", () => {
    expect(calculateTotalIncome(mockTransactions)).toBe(1500)
  })

  it("calculateTotalExpense should return correct sum of expenses", () => {
    expect(calculateTotalExpense(mockTransactions)).toBe(300)
  })

  it("formatCurrency should return correct formatted ruble string", () => {
    expect(formatCurrency(1234)).toMatch(/₽/)
  })

  it("formatDate should return correct Russian date string", () => {
    expect(formatDate("2025-03-01")).toBe("01.03.2025")
  })
})
