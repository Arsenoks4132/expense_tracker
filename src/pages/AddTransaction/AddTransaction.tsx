"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "@/context/AppContext"
import type { TransactionType } from "@/types"
import styles from "./AddTransaction.module.css"

export default function AddTransaction() {
  const navigate = useNavigate()
  const { addTransaction, categories } = useAppContext()

  const [formData, setFormData] = useState({
    type: "income" as TransactionType,
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
  })

  const [errors, setErrors] = useState({
    amount: "",
    category: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "amount" || name === "category") {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let isValid = true
    const newErrors = { amount: "", category: "" }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Введите корректную сумму"
      isValid = false
    }

    if (!formData.category) {
      newErrors.category = "Выберите категорию"
      isValid = false
    }

    if (!isValid) {
      setErrors(newErrors)
      return
    }

    addTransaction({
      type: formData.type,
      amount: Number.parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      description: formData.description,
    })

    navigate("/")
  }

  const filteredCategories = categories.filter((category) => category.type === formData.type)

  return (
    <>
      <Helmet>
        <title>Добавить операцию - Учёт финансов</title>
      </Helmet>
      <div className={styles.addTransaction}>
        <h2>Добавить операцию</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.typeSelector}>
            <button
              type="button"
              className={`${styles.typeButton} ${formData.type === "income" ? styles.incomeActive : ""}`}
              onClick={() => setFormData((prev) => ({ ...prev, type: "income" }))}
            >
              Доход
            </button>
            <button
              type="button"
              className={`${styles.typeButton} ${formData.type === "expense" ? styles.expenseActive : ""}`}
              onClick={() => setFormData((prev) => ({ ...prev, type: "expense" }))}
            >
              Расход
            </button>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="amount">Сумма*</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              className={`${styles.input} ${errors.amount ? styles.inputError : ""}`}
              min="0"
              step="0.01"
              required
            />
            {errors.amount && <p className={styles.errorText}>{errors.amount}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Дата*</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Категория*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${styles.select} ${errors.category ? styles.inputError : ""}`}
              required
            >
              <option value="">Выберите категорию</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className={styles.errorText}>{errors.category}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Необязательно"
              rows={3}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Добавить
          </button>
        </form>
      </div>
    </>
  )
}
