'use client';

import React, { useEffect, useState } from 'react';
import styles from './EatingBehaviorAnalysis.module.css';

// 导入饮食行为分析数据
import eatingBehaviorsData from '../../../data/eating_behaviors_analysis.json';

interface EatingBehaviorAnalysisProps {
    userData: any;
}

const EatingBehaviorAnalysis: React.FC<EatingBehaviorAnalysisProps> = ({ userData }) => {
    // 查找用户的饮食行为分析数据
    const [behaviorAnalysis, setBehaviorAnalysis] = useState<any>(null);

    useEffect(() => {
        // 查找当前用户的饮食行为分析
        const userBehaviorAnalysis = eatingBehaviorsData.find(h => h.userId === userData.id);
        setBehaviorAnalysis(userBehaviorAnalysis);
    }, [userData.id]);

    if (!behaviorAnalysis) {
        return (
            <div className={styles.loading}>
                <span>加载饮食行为分析数据中...</span>
            </div>
        );
    }

    return (
        <div className={styles.behaviorAnalysis}>
            <div className={styles.behaviorHeader}>
                <h2>{userData.name}的饮食行为分析</h2>
            </div>
            
            <div className={styles.behaviorCard}>
                <div className={styles.behaviorContent}>
                    <p className={styles.behaviorPeriod}>
                        {behaviorAnalysis.behaviorAnalysis.period}
                    </p>
                    <p className={styles.behaviorSummary}>
                        {behaviorAnalysis.behaviorAnalysis.summary}
                    </p>

                    <div className={styles.behaviorSection}>
                        <h4>用餐时间规律性</h4>
                        <div className={styles.mealTimingGrid}>
                            {Object.entries(
                                behaviorAnalysis.behaviorAnalysis.mealTimings
                            ).map(([meal, data]: [string, any]) => (
                                <div key={meal} className={styles.mealTimingItem}>
                                    <div className={styles.mealTimingHeader}>
                                        <span className={styles.mealName}>
                                            {meal === 'breakfast'
                                                ? '早餐'
                                                : meal === 'lunch'
                                                ? '午餐'
                                                : meal === 'snacks'
                                                ? '点心'
                                                : '晚餐'}
                                        </span>
                                        <span
                                            className={`${styles.consistencyBadge} ${
                                                data.consistency === '高'
                                                    ? styles.highConsistency
                                                    : data.consistency === '中'
                                                    ? styles.mediumConsistency
                                                    : styles.lowConsistency
                                            }`}
                                        >
                                            {data.consistency}
                                        </span>
                                    </div>
                                    <p className={styles.mealTime}>
                                        平均时间: {data.averageTime}
                                    </p>
                                    <p className={styles.mealComment}>{data.comments}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.behaviorSection}>
                        <h4>饮食习惯</h4>
                        <div className={styles.habitsList}>
                            <div className={styles.habitItem}>
                                <span className={styles.habitLabel}>用餐时长:</span>
                                <span className={styles.habitValue}>
                                    {
                                        behaviorAnalysis.behaviorAnalysis.eatingHabits
                                            .mealDuration.average
                                    }
                                </span>
                            </div>
                            <div className={styles.habitItem}>
                                <span className={styles.habitLabel}>咀嚼模式:</span>
                                <span className={styles.habitValue}>
                                    {
                                        behaviorAnalysis.behaviorAnalysis.eatingHabits
                                            .chewingPattern.rating
                                    }
                                </span>
                            </div>
                            <div className={styles.habitItem}>
                                <span className={styles.habitLabel}>常见干扰:</span>
                                <span className={styles.habitValue}>
                                    {behaviorAnalysis.behaviorAnalysis.eatingHabits.distractions.common.join(
                                        ', '
                                    )}
                                </span>
                            </div>
                            <div className={styles.habitItem}>
                                <span className={styles.habitLabel}>喜爱食物:</span>
                                <div className={styles.foodTags}>
                                    {behaviorAnalysis.behaviorAnalysis.eatingHabits.foodPreferences.favorites.map(
                                        (food: string, index: number) => (
                                            <span key={index} className={styles.foodTag}>
                                                {food}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className={styles.habitItem}>
                                <span className={styles.habitLabel}>不喜欢的食物:</span>
                                <div className={styles.foodTags}>
                                    {behaviorAnalysis.behaviorAnalysis.eatingHabits.foodPreferences.dislikes.map(
                                        (food: string, index: number) => (
                                            <span
                                                key={index}
                                                className={`${styles.foodTag} ${styles.dislikeTag}`}
                                            >
                                                {food}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.behaviorSection}>
                        <h4>本周变化</h4>
                        <div className={styles.changesContainer}>
                            <div className={styles.improvementsSection}>
                                <h5>进步</h5>
                                <ul className={styles.changesList}>
                                    {behaviorAnalysis.behaviorAnalysis.weeklyChanges.improvements.map(
                                        (item: string, index: number) => (
                                            <li
                                                key={index}
                                                className={styles.improvementItem}
                                            >
                                                {item}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                            <div className={styles.concernsSection}>
                                <h5>需关注</h5>
                                <ul className={styles.changesList}>
                                    {behaviorAnalysis.behaviorAnalysis.weeklyChanges.concerns.map(
                                        (item: string, index: number) => (
                                            <li key={index} className={styles.concernItem}>
                                                {item}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EatingBehaviorAnalysis; 