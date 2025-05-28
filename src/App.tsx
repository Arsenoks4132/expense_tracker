import { Routes, Route, Navigate } from "react-router-dom"
import { AppProvider } from "./context/AppContext"
import { useAppContext } from "./context/AppContext"
import Layout from "./components/layout"
import Dashboard from "./pages/Dashboard"
import History from "./pages/History"
import AddTransaction from "./pages/AddTransaction"
import Categories from "./pages/Categories"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"

function AppRoutes() {
  const { auth } = useAppContext()

  if (!auth.isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/add" element={<AddTransaction />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}

export default App
