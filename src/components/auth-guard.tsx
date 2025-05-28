"use client"

import type React from "react"
import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAppContext } from "../context/AppContext"

const publicRoutes = ["/login", "/register"]

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { auth } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!auth.isAuthenticated && !publicRoutes.includes(location.pathname)) {
      navigate("/login")
    }

    if (auth.isAuthenticated && publicRoutes.includes(location.pathname)) {
      navigate("/")
    }
  }, [auth.isAuthenticated, location.pathname, navigate])

  if (!auth.isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return null
  }

  return <>{children}</>
}
