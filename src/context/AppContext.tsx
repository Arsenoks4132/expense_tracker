"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Transaction, Category, UserProfile, User, AuthState } from "../types"

interface AppContextType {
  transactions: Transaction[]
  categories: Category[]
  auth: AuthState
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  editTransaction: (id: string, transaction: Omit<Transaction, "id">) => void
  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: string, updates: Partial<Omit<Category, "id">>) => void
  deleteCategory: (id: string) => void
  deleteTransaction: (id: string) => void
  updateUserProfile: (profile: Partial<UserProfile>) => void
  clearAllData: () => void
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, profile: UserProfile) => Promise<boolean>
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Default categories with colors
const defaultCategories: Category[] = [
  { id: "1", name: "Продукты", type: "expense", color: "#FF5252" },
  { id: "2", name: "Транспорт", type: "expense", color: "#FF7043" },
  { id: "3", name: "Развлечения", type: "expense", color: "#FFCA28" },
  { id: "4", name: "Коммунальные услуги", type: "expense", color: "#66BB6A" },
  { id: "5", name: "Зарплата", type: "income", color: "#42A5F5" },
  { id: "6", name: "Фриланс", type: "income", color: "#5C6BC0" },
  { id: "7", name: "Подарки", type: "income", color: "#AB47BC" },
  { id: "8", name: "Инвестиции", type: "income", color: "#26A69A" },
]

// Default user profile
const defaultUserProfile: UserProfile = {
  firstName: "Иван",
  lastName: "Иванов",
  profession: "Программист",
  birthDate: "1990-01-01",
  photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
}

// Default users for demo
const defaultUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    password: "password123",
    profile: defaultUserProfile,
  },
]

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [users, setUsers] = useState<User[]>(defaultUsers)
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    error: null,
  })
  const [isInitialized, setIsInitialized] = useState(false)

  // Load data from localStorage on client-side only
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions")
    const savedCategories = localStorage.getItem("categories")
    const savedUsers = localStorage.getItem("users")
    const savedAuth = localStorage.getItem("auth")

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }

    if (savedAuth) {
      setAuth(JSON.parse(savedAuth))
    }

    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("transactions", JSON.stringify(transactions))
      localStorage.setItem("categories", JSON.stringify(categories))
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("auth", JSON.stringify(auth))
    }
  }, [transactions, categories, users, auth, isInitialized])

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions([...transactions, newTransaction])
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    }
    setCategories([...categories, newCategory])
  }

  const updateCategory = (id: string, updates: Partial<Omit<Category, "id">>) => {
    setCategories(categories.map((category) => (category.id === id ? { ...category, ...updates } : category)))
  }

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  const clearAllData = () => {
    setTransactions([])
    setCategories(defaultCategories)
  }

  const editTransaction = (id: string, transaction: Omit<Transaction, "id">) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...transaction, id } : t)))
  }

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (auth.user) {
      const updatedUser = {
        ...auth.user,
        profile: { ...auth.user.profile, ...profile },
      }

      setAuth({
        ...auth,
        user: updatedUser,
      })

      // Also update in users array
      setUsers(users.map((user) => (user.id === auth.user?.id ? updatedUser : user)))
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      setAuth({
        isAuthenticated: true,
        user,
        error: null,
      })
      return true
    } else {
      setAuth({
        ...auth,
        error: "Неверный email или пароль",
      })
      return false
    }
  }

  const register = async (email: string, password: string, profile: UserProfile): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    const userExists = users.some((u) => u.email === email)

    if (userExists) {
      setAuth({
        ...auth,
        error: "Пользователь с таким email уже существует",
      })
      return false
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      profile,
    }

    setUsers([...users, newUser])

    setAuth({
      isAuthenticated: true,
      user: newUser,
      error: null,
    })

    return true
  }

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      error: null,
    })
  }

  return (
    <AppContext.Provider
      value={{
        transactions,
        categories,
        auth,
        addTransaction,
        editTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        deleteTransaction,
        updateUserProfile,
        clearAllData,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
