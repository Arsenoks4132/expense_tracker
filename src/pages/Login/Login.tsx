"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "@/context/AppContext"
import styles from "./Login.module.css"

export default function Login() {
  const { login, auth } = useAppContext()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        navigate("/")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Вход - Учёт финансов</title>
      </Helmet>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Вход в систему</h1>

          {auth.error && <div className={styles.errorMessage}>{auth.error}</div>}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>

          <p className={styles.authLink}>
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>

          <div className={styles.demoCredentials}>
            <p>Демо-доступ:</p>
            <p>Email: demo@example.com</p>
            <p>Пароль: password123</p>
          </div>
        </div>
      </div>
    </>
  )
}
