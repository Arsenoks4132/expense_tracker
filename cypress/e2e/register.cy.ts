/// <reference types="cypress" />

describe("Страница регистрации", () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit("/register")
  })

  it("успешная регистрация нового пользователя", () => {
    const timestamp = Date.now()
    const email = `user${timestamp}@example.com`

    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type("securepass")
    cy.get('input[name="confirmPassword"]').type("securepass")
    cy.get('input[name="firstName"]').type("Алексей")
    cy.get('input[name="lastName"]').type("Петров")
    cy.get('input[name="middleName"]').type("Викторович")
    cy.get('input[name="profession"]').type("Дизайнер")
    cy.get('input[name="birthDate"]').type("1992-06-15")
    cy.get('input[name="photoUrl"]').clear().type("https://randomuser.me/api/portraits/men/2.jpg")

    cy.get('button[type="submit"]').click()

    // Проверка перенаправления на главную
    cy.url().should("eq", `${Cypress.config().baseUrl}/`)
  })

  it("ошибка при регистрации с уже существующим email", () => {
    // Зарегистрирован заранее в AppContext
    cy.get('input[name="email"]').type("demo@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password123")
    cy.get('input[name="firstName"]').type("Тест")
    cy.get('input[name="lastName"]').type("Пользователь")

    cy.get('button[type="submit"]').click()

    cy.contains("Пользователь с таким email уже существует").should("exist")
  })

  it("валидация: пароли не совпадают", () => {
    cy.get('input[name="email"]').type("newuser@example.com")
    cy.get('input[name="password"]').type("123456")
    cy.get('input[name="confirmPassword"]').type("different")
    cy.get('input[name="firstName"]').type("Тест")
    cy.get('input[name="lastName"]').type("Пользователь")

    cy.get('button[type="submit"]').click()

    cy.contains("Пароли не совпадают").should("exist")
  })
})
