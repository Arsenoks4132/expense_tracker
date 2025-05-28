"use client"

import type React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Clock, PlusCircle, Tag, User, LogOut } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import styles from "./layout.module.css"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { auth, logout } = useAppContext()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Учёт финансов</h1>
        {auth.isAuthenticated && auth.user && (
          <div className={styles.userInfo}>
            <img
              src={auth.user.profile.photoUrl || "/placeholder.svg"}
              alt="Фото профиля"
              className={styles.userPhoto}
            />
            <span>
              {auth.user.profile.lastName} {auth.user.profile.firstName}{" "}
              {auth.user.profile.middleName ? auth.user.profile.middleName.charAt(0) + "." : ""}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton} title="Выйти">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </header>

      <main className={styles.main}>{children}</main>

      <nav className={styles.navbar}>
        <Link to="/" className={isActive("/") ? styles.activeLink : styles.link}>
          <Home size={20} />
          <span>Главная</span>
        </Link>

        <Link to="/history" className={isActive("/history") ? styles.activeLink : styles.link}>
          <Clock size={20} />
          <span>История</span>
        </Link>

        <Link to="/add" className={isActive("/add") ? styles.activeLink : styles.link}>
          <PlusCircle size={20} />
          <span>Добавить</span>
        </Link>

        <Link to="/categories" className={isActive("/categories") ? styles.activeLink : styles.link}>
          <Tag size={20} />
          <span>Категории</span>
        </Link>

        <Link to="/profile" className={isActive("/profile") ? styles.activeLink : styles.link}>
          <User size={20} />
          <span>Профиль</span>
        </Link>
      </nav>
    </div>
  )
}
