"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useAppContext } from "@/context/AppContext"
import { formatCurrency, formatDate } from "@/utils/calculations"
import type { Transaction } from "types"
import styles from "./History.module.css"

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "category-asc" | "category-desc"

export default function History() {
  const { transactions, categories, deleteTransaction, editTransaction } = useAppContext()
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "all",
    category: "all",
  })
  const [sortOption, setSortOption] = useState<SortOption>("date-desc")
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingTransaction) return

    const { name, value } = e.target
    setEditingTransaction((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [name]: name === "amount" ? Number.parseFloat(value) || 0 : value,
      }
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTransaction) return

    editTransaction(editingTransaction.id, {
      type: editingTransaction.type,
      amount: editingTransaction.amount,
      date: editingTransaction.date,
      category: editingTransaction.category,
      description: editingTransaction.description || "",
    })

    setEditingTransaction(null)
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)

    if (filters.startDate && new Date(filters.startDate) > transactionDate) {
      return false
    }

    if (filters.endDate && new Date(filters.endDate) < transactionDate) {
      return false
    }

    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false
    }

    if (filters.category !== "all" && transaction.category !== filters.category) {
      return false
    }

    return true
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortOption) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "amount-desc":
        return b.amount - a.amount
      case "amount-asc":
        return a.amount - b.amount
      case "category-asc":
        return a.category.localeCompare(b.category)
      case "category-desc":
        return b.category.localeCompare(a.category)
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  const filteredCategories = categories.filter((category) => filters.type === "all" || category.type === filters.type)

  return (
    <>
      <Helmet>
        <title>История операций - Учёт финансов</title>
      </Helmet>
      <div className={styles.history}>
        <h2>История операций</h2>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="startDate">С даты:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className={styles.input}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="endDate">По дату:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className={styles.input}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="type">Тип:</label>
            <select id="type" name="type" value={filters.type} onChange={handleFilterChange} className={styles.select}>
              <option value="all">Все</option>
              <option value="income">Доходы</option>
              <option value="expense">Расходы</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="category">Категория:</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className={styles.select}
            >
              <option value="all">Все</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="sort">Сортировка:</label>
            <select id="sort" name="sort" value={sortOption} onChange={handleSortChange} className={styles.select}>
              <option value="date-desc">По дате (сначала новые)</option>
              <option value="date-asc">По дате (сначала старые)</option>
              <option value="amount-desc">По сумме (по убыванию)</option>
              <option value="amount-asc">По сумме (по возрастанию)</option>
              {filters.category === "all" && (
                <>
                  <option value="category-asc">По категории (А-Я)</option>
                  <option value="category-desc">По категории (Я-А)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {editingTransaction && (
          <div className={styles.editFormContainer}>
            <h3>Редактировать операцию</h3>
            <form onSubmit={handleEditSubmit} className={styles.editForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="edit-type">Тип:</label>
                  <select
                    id="edit-type"
                    name="type"
                    value={editingTransaction.type}
                    onChange={handleEditChange}
                    className={styles.select}
                  >
                    <option value="income">Доход</option>
                    <option value="expense">Расход</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="edit-amount">Сумма:</label>
                  <input
                    type="number"
                    id="edit-amount"
                    name="amount"
                    value={editingTransaction.amount}
                    onChange={handleEditChange}
                    className={styles.input}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="edit-date">Дата:</label>
                  <input
                    type="date"
                    id="edit-date"
                    name="date"
                    value={editingTransaction.date}
                    onChange={handleEditChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="edit-category">Категория:</label>
                  <select
                    id="edit-category"
                    name="category"
                    value={editingTransaction.category}
                    onChange={handleEditChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories
                      .filter((category) => category.type === editingTransaction.type)
                      .map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="edit-description">Описание:</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editingTransaction.description || ""}
                  onChange={handleEditChange}
                  className={styles.textarea}
                  rows={2}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Сохранить
                </button>
                <button type="button" onClick={() => setEditingTransaction(null)} className={styles.cancelButton}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {sortedTransactions.length === 0 ? (
          <p className={styles.emptyState}>Нет операций, соответствующих фильтрам</p>
        ) : (
          <ul className={styles.transactionList}>
            {sortedTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className={`${styles.transactionItem} ${transaction.type === "income" ? styles.incomeItem : styles.expenseItem}`}
              >
                <div className={styles.transactionDetails}>
                  <div>
                    <strong>{transaction.category}</strong>
                    <p>{transaction.description || "Без описания"}</p>
                    <small>{formatDate(transaction.date)}</small>
                  </div>
                  <div className={styles.transactionAmount}>
                    <p className={transaction.type === "income" ? styles.income : styles.expense}>
                      {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </p>
                    <div className={styles.transactionActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => setEditingTransaction(transaction)}
                        aria-label="Редактировать"
                      >
                        ✎
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => deleteTransaction(transaction.id)}
                        aria-label="Удалить"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
