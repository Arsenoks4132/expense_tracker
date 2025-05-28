"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useAppContext } from "@/context/AppContext"
import { calculateBalance, calculateTotalIncome, calculateTotalExpense, formatCurrency } from "@/utils/calculations"
import type { ChartView } from "types"
import styles from "./Dashboard.module.css"

export default function Dashboard() {
  const { transactions, categories } = useAppContext()
  const [chartView, setChartView] = useState<ChartView>("all")

  const balance = calculateBalance(transactions)
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpense = calculateTotalExpense(transactions)

  // Calculate percentages for the comparison chart
  const incomePercentage =
    totalIncome + totalExpense > 0 ? Math.round((totalIncome / (totalIncome + totalExpense)) * 100) : 0
  const expensePercentage =
    totalIncome + totalExpense > 0 ? Math.round((totalExpense / (totalIncome + totalExpense)) * 100) : 0

  // Group transactions by category for bar charts
  const incomeByCategory = transactions
    .filter((t) => t.type === "income")
    .reduce(
      (acc, transaction) => {
        const { category, amount } = transaction
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += amount
        return acc
      },
      {} as Record<string, number>,
    )

  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        const { category, amount } = transaction
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += amount
        return acc
      },
      {} as Record<string, number>,
    )

  // Get category colors
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName)
    return category?.color || "#CBD5E0"
  }

  return (
    <div className={styles.dashboard}>
      <Helmet>
        <title>Панель управления - Учёт финансов</title>
      </Helmet>

      <h2>Панель управления</h2>

      <div className={styles.balanceCard}>
        <h3>Текущий баланс</h3>
        <p className={balance >= 0 ? styles.positive : styles.negative}>{formatCurrency(balance)}</p>
      </div>

      <div className={styles.summaryContainer}>
        <div className={styles.summaryCard}>
          <h3>Доходы</h3>
          <p className={styles.income}>{formatCurrency(totalIncome)}</p>
        </div>

        <div className={styles.summaryCard}>
          <h3>Расходы</h3>
          <p className={styles.expense}>{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h3>Статистика</h3>
          <div className={styles.chartControls}>
            <button
              className={`${styles.chartButton} ${chartView === "all" ? styles.activeChart : ""}`}
              onClick={() => setChartView("all")}
            >
              Все
            </button>
            <button
              className={`${styles.chartButton} ${chartView === "comparison" ? styles.activeChart : ""}`}
              onClick={() => setChartView("comparison")}
            >
              Сравнение
            </button>
            <button
              className={`${styles.chartButton} ${chartView === "income" ? styles.activeChart : ""}`}
              onClick={() => setChartView("income")}
            >
              Доходы
            </button>
            <button
              className={`${styles.chartButton} ${chartView === "expense" ? styles.activeChart : ""}`}
              onClick={() => setChartView("expense")}
            >
              Расходы
            </button>
          </div>
        </div>

        {/* Comparison Chart - Bar Chart */}
        {(chartView === "all" || chartView === "comparison") && (
          <div className={`${styles.chartSection} ${styles.centeredChart}`}>
            <h4>Сравнение доходов и расходов</h4>
            {totalIncome === 0 && totalExpense === 0 ? (
              <div className={styles.emptyChart}>
                <p>Нет данных для отображения</p>
              </div>
            ) : (
              <div className={styles.barChartContainer}>
                <div className={styles.chart}>
                  {totalIncome > 0 && (
                    <div className={styles.incomeBar} style={{ width: `${incomePercentage}%` }}>
                      {incomePercentage >= 15 && formatCurrency(totalIncome)}
                    </div>
                  )}
                  {totalExpense > 0 && (
                    <div className={styles.expenseBar} style={{ width: `${expensePercentage}%` }}>
                      {expensePercentage >= 15 && formatCurrency(totalExpense)}
                    </div>
                  )}
                </div>
                <div className={styles.chartLabels}>
                  {totalIncome > 0 && <span className={styles.incomeLabel}>Доходы: {formatCurrency(totalIncome)}</span>}
                  {totalExpense > 0 && (
                    <span className={styles.expenseLabel}>Расходы: {formatCurrency(totalExpense)}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.categoryChartsContainer}>
          {/* Income Bar Chart */}
          {(chartView === "all" || chartView === "income") && (
            <div
              className={`${styles.chartSection} ${styles.barChartSection} ${chartView !== "all" ? styles.centeredChart : ""}`}
            >
              <h4>Доходы по категориям</h4>
              {Object.keys(incomeByCategory).length === 0 ? (
                <div className={styles.emptyChart}>
                  <p>Нет данных для отображения</p>
                </div>
              ) : (
                <div className={styles.categoryBarChartContainer}>
                  <div className={styles.categoryBarGraph}>
                    <div className={styles.categoryBarStack}>
                      {Object.entries(incomeByCategory)
                        .sort((a, b) => b[1] - a[1]) // Sort by amount descending
                        .map(([category, amount]) => {
                          const percentage = Math.round((amount / totalIncome) * 100)
                          const color = getCategoryColor(category)

                          return (
                            <div
                              key={category}
                              className={styles.categoryBarSegment}
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: color,
                                minWidth: "1%", // Ensure very small segments are still visible
                              }}
                              title={`${category}: ${formatCurrency(amount)} (${percentage}%)`}
                            />
                          )
                        })}
                    </div>
                  </div>
                  <div className={styles.categoryLegend}>
                    {Object.entries(incomeByCategory)
                      .sort((a, b) => b[1] - a[1]) // Sort by amount descending
                      .map(([category, amount]) => {
                        const percentage = Math.round((amount / totalIncome) * 100)
                        const color = getCategoryColor(category)

                        return (
                          <div key={category} className={styles.legendItem}>
                            <div className={styles.legendColor} style={{ backgroundColor: color }}></div>
                            <span className={styles.legendText}>
                              {category}: {formatCurrency(amount)} ({percentage}%)
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Expense Bar Chart */}
          {(chartView === "all" || chartView === "expense") && (
            <div
              className={`${styles.chartSection} ${styles.barChartSection} ${chartView !== "all" ? styles.centeredChart : ""}`}
            >
              <h4>Расходы по категориям</h4>
              {Object.keys(expenseByCategory).length === 0 ? (
                <div className={styles.emptyChart}>
                  <p>Нет данных для отображения</p>
                </div>
              ) : (
                <div className={styles.categoryBarChartContainer}>
                  <div className={styles.categoryBarGraph}>
                    <div className={styles.categoryBarStack}>
                      {Object.entries(expenseByCategory)
                        .sort((a, b) => b[1] - a[1]) // Sort by amount descending
                        .map(([category, amount]) => {
                          const percentage = Math.round((amount / totalExpense) * 100)
                          const color = getCategoryColor(category)

                          return (
                            <div
                              key={category}
                              className={styles.categoryBarSegment}
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: color,
                                minWidth: "1%", // Ensure very small segments are still visible
                              }}
                              title={`${category}: ${formatCurrency(amount)} (${percentage}%)`}
                            />
                          )
                        })}
                    </div>
                  </div>
                  <div className={styles.categoryLegend}>
                    {Object.entries(expenseByCategory)
                      .sort((a, b) => b[1] - a[1]) // Sort by amount descending
                      .map(([category, amount]) => {
                        const percentage = Math.round((amount / totalExpense) * 100)
                        const color = getCategoryColor(category)

                        return (
                          <div key={category} className={styles.legendItem}>
                            <div className={styles.legendColor} style={{ backgroundColor: color }}></div>
                            <span className={styles.legendText}>
                              {category}: {formatCurrency(amount)} ({percentage}%)
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.recentTransactions}>
        <h3>Последние операции</h3>
        {transactions.length === 0 ? (
          <p className={styles.emptyState}>Нет операций. Добавьте первую операцию!</p>
        ) : (
          <ul className={styles.transactionList}>
            {transactions
              .slice(-5)
              .reverse()
              .map((transaction) => (
                <li
                  key={transaction.id}
                  className={`${styles.transactionItem} ${transaction.type === "income" ? styles.incomeItem : styles.expenseItem}`}
                >
                  <div>
                    <strong>{transaction.category}</strong>
                    <p>{transaction.description || "Без описания"}</p>
                  </div>
                  <div>
                    <p className={transaction.type === "income" ? styles.income : styles.expense}>
                      {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </p>
                    <small>{new Date(transaction.date).toLocaleDateString()}</small>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
