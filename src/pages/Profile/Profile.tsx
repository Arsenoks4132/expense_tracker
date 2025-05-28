"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import styles from "./Profile.module.css"

export default function Profile() {
  const { transactions, categories, auth, updateUserProfile, clearAllData, logout } = useAppContext()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(
    auth.user?.profile || {
      firstName: "",
      lastName: "",
      middleName: "",
      profession: "",
      birthDate: "",
      photoUrl: "",
    },
  )

  const handleExportData = () => {
    const data = {
      transactions,
      categories,
      userProfile: auth.user?.profile,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `finance-tracker-export-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleClearData = () => {
    if (window.confirm("Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.")) {
      clearAllData()
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserProfile(editedProfile)
    setIsEditing(false)
  }

  if (!auth.user) {
    return null
  }

  return (
    <>
      <Helmet>
        <title>Профиль - Учёт финансов</title>
      </Helmet>
      <div className={styles.profile}>
        <h2>Профиль</h2>

        <div className={styles.userProfileCard}>
          {isEditing ? (
            <form onSubmit={handleProfileSubmit} className={styles.profileForm}>
              <div className={styles.profileHeader}>
                <div className={styles.profilePhotoContainer}>
                  <img
                    src={editedProfile.photoUrl || "/placeholder.svg?height=100&width=100"}
                    alt="Фото профиля"
                    className={styles.profilePhoto}
                  />
                  <div className={styles.photoInput}>
                    <label htmlFor="photoUrl">URL фото:</label>
                    <input
                      type="text"
                      id="photoUrl"
                      name="photoUrl"
                      value={editedProfile.photoUrl}
                      onChange={handleProfileChange}
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.profileInfo}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName">Имя:</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={editedProfile.firstName}
                        onChange={handleProfileChange}
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="lastName">Фамилия:</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={editedProfile.lastName}
                        onChange={handleProfileChange}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="middleName">Отчество:</label>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      value={editedProfile.middleName || ""}
                      onChange={handleProfileChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="profession">Профессия:</label>
                      <input
                        type="text"
                        id="profession"
                        name="profession"
                        value={editedProfile.profession}
                        onChange={handleProfileChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="birthDate">Дата рождения:</label>
                      <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={editedProfile.birthDate}
                        onChange={handleProfileChange}
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Сохранить
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelButton}>
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className={styles.profileHeader}>
                <img
                  src={auth.user.profile.photoUrl || "/placeholder.svg?height=100&width=100"}
                  alt="Фото профиля"
                  className={styles.profilePhoto}
                />
                <div className={styles.profileInfo}>
                  <h3>
                    {auth.user.profile.lastName} {auth.user.profile.firstName} {auth.user.profile.middleName || ""}
                  </h3>
                  <p className={styles.profession}>{auth.user.profile.profession}</p>
                  <p className={styles.birthDate}>
                    Дата рождения: {new Date(auth.user.profile.birthDate).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={() => setIsEditing(true)} className={styles.editProfileButton}>
                  Редактировать
                </button>
              </div>
            </>
          )}
        </div>

        <div className={styles.statsCard}>
          <h3>Статистика</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Всего операций</span>
              <span className={styles.statValue}>{transactions.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Категорий</span>
              <span className={styles.statValue}>{categories.length}</span>
            </div>
          </div>
        </div>

        <div className={styles.actionsCard}>
          <h3>Действия</h3>
          <div className={styles.actionButtons}>
            <button onClick={handleExportData} className={styles.exportButton}>
              Экспортировать данные
            </button>
            <button onClick={handleClearData} className={styles.clearButton}>
              Очистить все данные
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Выйти
            </button>
          </div>
        </div>

        <div className={styles.aboutCard}>
          <h3>О приложении</h3>
          <p>
            Это приложение для учёта доходов и расходов разработано как MVP (минимально жизнеспособный продукт). В
            будущих версиях планируется добавить синхронизацию данных и расширенную аналитику.
          </p>
          <p className={styles.version}>Версия 1.0.0</p>
        </div>
      </div>
    </>
  )
}
