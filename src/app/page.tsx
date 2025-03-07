'use client';

import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import NutritionAnalysis from './components/NutritionAnalysis';
import styles from './page.module.css';

// 导入数据
import nutritionScores from '../../data/nutrition_scores.json';
import users from '../../data/users.json';
import mealRecords from '../../data/meal_records.json';

export default function Home() {
    const [selectedUser, setSelectedUser] = useState(1); // 默认选择小明
    const [currentDate, setCurrentDate] = useState('2023-09-08'); // 假设当前日期是9月8日
    const [activeTab, setActiveTab] = useState('dashboard'); // 默认显示仪表板

    // 查找用户数据
    const userData = users.find(u => u.id === selectedUser);

    // 查找用户的营养评分数据
    const userScores = nutritionScores.find(s => s.userId === selectedUser);

    // 查找用户的餐食记录
    const userMeals = mealRecords.find(m => m.userId === selectedUser);

    // 格式化日期为YYYY-MM-DD
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // 处理用户选择变化
    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(Number(e.target.value));
    };

    // 处理日期选择变化
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentDate(e.target.value);
    };

    // 处理标签切换
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    if (!userData || !userScores || !userMeals) {
        return (
            <div className={styles.main}>
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                    <span>加载数据中...</span>
                </div>
            </div>
        );
    }

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1 className={styles.title}>儿童营养分析仪表板</h1>
                <div className={styles.controls}>
                    <div className={styles.userSelector}>
                        <label htmlFor="user-select">选择用户</label>
                        <select
                            id="user-select"
                            className={styles.select}
                            value={selectedUser}
                            onChange={handleUserChange}
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.age}岁)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.dateSelector}>
                        <label className={styles.dateLabel}>选择日期</label>
                        <input
                            type="date"
                            className={styles.dateInput}
                            value={currentDate}
                            onChange={handleDateChange}
                            min="2023-09-01"
                            max="2023-09-08"
                        />
                    </div>
                </div>
            </header>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'dashboard' ? styles.activeTab : ''}`}
                    onClick={() => handleTabChange('dashboard')}
                >
                    仪表板概览
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'analysis' ? styles.activeTab : ''}`}
                    onClick={() => handleTabChange('analysis')}
                >
                    详细营养分析
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'dashboard' ? (
                    <Dashboard
                        userData={userData}
                        scoreData={userScores}
                        mealData={userMeals}
                        currentDate={currentDate}
                    />
                ) : (
                    <NutritionAnalysis
                        userData={userData}
                        scoreData={userScores}
                        mealData={userMeals}
                        currentDate={currentDate}
                    />
                )}
            </div>
        </main>
    );
}
