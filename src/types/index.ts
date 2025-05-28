export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  date: string
  category: string
  description?: string
}

export interface Category {
  id: string
  name: string
  type: TransactionType
  color: string
}

export type ChartView = "all" | "comparison" | "income" | "expense"

export interface UserProfile {
  firstName: string
  lastName: string
  middleName?: string
  profession: string
  birthDate: string
  photoUrl: string
}

export interface User {
  id: string
  email: string
  password: string
  profile: UserProfile
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  error: string | null
}
