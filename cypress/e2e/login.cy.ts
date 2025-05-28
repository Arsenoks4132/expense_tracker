/// <reference types="cypress" />

describe("Страница логина", () => {
  beforeEach(() => {
    cy.visit("/login")
  })

  it("логин с демо-данными", () => {
    cy.get('input[name="email"]').type("demo@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('button[type="submit"]').click()

    // Проверка редиректа
    cy.url().should("eq", `${Cypress.config().baseUrl}/`)
  })

  it("показывает ошибку при неверном пароле", () => {
    cy.get('input[name="email"]').type("demo@example.com")
    cy.get('input[name="password"]').type("wrongpassword")
    cy.get('button[type="submit"]').click()

    cy.contains("Неверный email или пароль").should("be.visible")
  })
})
