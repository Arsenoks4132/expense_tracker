"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useAppContext } from "../context/AppContext"
import type { TransactionType } from "../types"
import styles from "./Categories.module.css"

const getRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const colorOptions = [
  "#FF5252",
  "#FF7043",
  "#FFCA28",
  "#66BB6A",
  "#42A5F5",
  "#5C6BC0",
  "#AB47BC",
  "#26A69A",
  "#EC407A",
  "#7E57C2",
  "#29B6F6",
  "#26C6DA",
  "#9CCC65",
  "#FFA726",
  "#8D6E63",
  "#78909C",
]

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAppContext()

  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "income" as TransactionType,
    color: getRandomColor(),
  })

  const [editingCategory, setEditingCategory] = useState<{
    id: string
    name: string
    color: string
  } | null>(null)

  const [showColorPicker, setShowColorPicker] = useState(false)
  const [editShowColorPicker, setEditShowColorPicker] = useState(false)

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCategory.name.trim()) return

    addCategory({
      name: newCategory.name.trim(),
      type: newCategory.type,
      color: newCategory.color,
    })

    setNewCategory({
      name: "",
      type: "income",
      color: getRandomColor(),
    })
    setShowColorPicker(false)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingCategory || !editingCategory.name.trim()) return

    updateCategory(editingCategory.id, {
      name: editingCategory.name.trim(),
      color: editingCategory.color,
    })
    setEditingCategory(null)
    setEditShowColorPicker(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      deleteCategory(id)
    }
  }

  const incomeCategories = categories.filter((category) => category.type === "income")
  const expenseCategories = categories.filter((category) => category.type === "expense")

  return (
    <>
      <Helmet>
        <title>Категории - Учёт финансов</title>
      </Helmet>
      <div className={styles.categories}>
        <h2>Категории</h2>

        <form onSubmit={handleAddSubmit} className={styles.addForm}>
          <h3>Добавить категорию</h3>

          <div className={styles.formGroup}>
            <label htmlFor="categoryName">Название</label>
            <input
              type="text"
              id="categoryName"
              value={newCategory.name}
              onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
              className={styles.input}
              placeholder="Название категории"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="categoryType">Тип</label>
              <select
                id="categoryType"
                value={newCategory.type}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, type: e.target.value as TransactionType }))}
                className={styles.select}
              >
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoryColor">Цвет</label>
              <div className={styles.colorPickerContainer}>
                <button
                  type="button"
                  className={styles.colorPreview}
                  style={{ backgroundColor: newCategory.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <input
                  type="text"
                  id="categoryColor"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory((prev) => ({ ...prev, color: e.target.value }))}
                  className={styles.colorInput}
                />
              </div>
              {showColorPicker && (
                <div className={styles.colorOptions}>
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={styles.colorOption}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setNewCategory((prev) => ({ ...prev, color }))
                        setShowColorPicker(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className={styles.addButton}>
            Добавить
          </button>
        </form>

        <div className={styles.categoryLists}>
          <div className={styles.categorySection}>
            <h3>Категории доходов</h3>
            {incomeCategories.length === 0 ? (
              <p className={styles.emptyState}>Нет категорий доходов</p>
            ) : (
              <ul className={styles.categoryList}>
                {incomeCategories.map((category) => (
                  <li key={category.id} className={styles.categoryItem}>
                    {editingCategory && editingCategory.id === category.id ? (
                      <form onSubmit={handleEditSubmit} className={styles.editForm}>
                        <div className={styles.editFormRow}>
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
                            }
                            className={styles.editInput}
                            autoFocus
                          />
                          <div className={styles.colorPickerContainer}>
                            <button
                              type="button"
                              className={styles.colorPreview}
                              style={{ backgroundColor: editingCategory.color }}
                              onClick={() => setEditShowColorPicker(!editShowColorPicker)}
                            />
                            <input
                              type="text"
                              value={editingCategory.color}
                              onChange={(e) =>
                                setEditingCategory((prev) => (prev ? { ...prev, color: e.target.value } : null))
                              }
                              className={styles.colorInput}
                            />
                          </div>
                        </div>
                        {editShowColorPicker && (
                          <div className={styles.colorOptions}>
                            {colorOptions.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={styles.colorOption}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setEditingCategory((prev) => (prev ? { ...prev, color } : null))
                                  setEditShowColorPicker(false)
                                }}
                              />
                            ))}
                          </div>
                        )}
                        <div className={styles.editActions}>
                          <button type="submit" className={styles.saveButton}>
                            Сохранить
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className={styles.cancelButton}
                          >
                            Отмена
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className={styles.categoryName}>
                          <div className={styles.categoryColor} style={{ backgroundColor: category.color }}></div>
                          <span>{category.name}</span>
                        </div>
                        <div className={styles.categoryActions}>
                          <button
                            onClick={() =>
                              setEditingCategory({ id: category.id, name: category.name, color: category.color })
                            }
                            className={styles.editButton}
                          >
                            Изменить
                          </button>
                          <button onClick={() => handleDelete(category.id)} className={styles.deleteButton}>
                            Удалить
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.categorySection}>
            <h3>Категории расходов</h3>
            {expenseCategories.length === 0 ? (
              <p className={styles.emptyState}>Нет категорий расходов</p>
            ) : (
              <ul className={styles.categoryList}>
                {expenseCategories.map((category) => (
                  <li key={category.id} className={styles.categoryItem}>
                    {editingCategory && editingCategory.id === category.id ? (
                      <form onSubmit={handleEditSubmit} className={styles.editForm}>
                        <div className={styles.editFormRow}>
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
                            }
                            className={styles.editInput}
                            autoFocus
                          />
                          <div className={styles.colorPickerContainer}>
                            <button
                              type="button"
                              className={styles.colorPreview}
                              style={{ backgroundColor: editingCategory.color }}
                              onClick={() => setEditShowColorPicker(!editShowColorPicker)}
                            />
                            <input
                              type="text"
                              value={editingCategory.color}
                              onChange={(e) =>
                                setEditingCategory((prev) => (prev ? { ...prev, color: e.target.value } : null))
                              }
                              className={styles.colorInput}
                            />
                          </div>
                        </div>
                        {editShowColorPicker && (
                          <div className={styles.colorOptions}>
                            {colorOptions.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={styles.colorOption}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setEditingCategory((prev) => (prev ? { ...prev, color } : null))
                                  setEditShowColorPicker(false)
                                }}
                              />
                            ))}
                          </div>
                        )}
                        <div className={styles.editActions}>
                          <button type="submit" className={styles.saveButton}>
                            Сохранить
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className={styles.cancelButton}
                          >
                            Отмена
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className={styles.categoryName}>
                          <div className={styles.categoryColor} style={{ backgroundColor: category.color }}></div>
                          <span>{category.name}</span>
                        </div>
                        <div className={styles.categoryActions}>
                          <button
                            onClick={() =>
                              setEditingCategory({ id: category.id, name: category.name, color: category.color })
                            }
                            className={styles.editButton}
                          >
                            Изменить
                          </button>
                          <button onClick={() => handleDelete(category.id)} className={styles.deleteButton}>
                            Удалить
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
