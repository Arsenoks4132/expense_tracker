import { describe, it, vi, beforeEach, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Layout from "./layout"
import { useAppContext } from "../context/AppContext"

// Мокаем AppContext
vi.mock("../context/AppContext", () => ({
  useAppContext: vi.fn(),
}))

// Мокаем useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe("Layout", () => {
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppContext as any).mockReturnValue({
      auth: {
        isAuthenticated: true,
        user: {
          profile: {
            firstName: "Иван",
            lastName: "Петров",
            middleName: "Сергеевич",
            photoUrl: "",
          },
        },
      },
      logout: mockLogout,
    })
  })

  it("renders header and user info", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Контент</div>
        </Layout>
      </MemoryRouter>
    )

    expect(screen.getByText("Учёт финансов")).toBeInTheDocument()
    expect(screen.getByText("Петров Иван С.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /выйти/i })).toBeInTheDocument()
    expect(screen.getByText("Контент")).toBeInTheDocument()
  })

  it("calls logout when logout button is clicked", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div />
        </Layout>
      </MemoryRouter>
    )

    const button = screen.getByRole("button", { name: /выйти/i })
    fireEvent.click(button)

    expect(mockLogout).toHaveBeenCalled()
  })
})
