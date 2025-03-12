'use client';

import React from 'react';
import styles from './DailyNutritionAnalysis.module.css';

// 导入数据
import nutritionRecommendations from '../../../data/nutrition_recommendations.json';

interface DailyNutritionAnalysisProps {
    userData: any;
    mealData: any;
    currentDate: string;
}

const DailyNutritionAnalysis: React.FC<DailyNutritionAnalysisProps> = ({ 
    userData, 
    mealData, 
    currentDate 
}) => {
    // 获取当天的餐食记录
    const todayMeals = mealData.records.find((r: any) => r.date === currentDate);

    // 获取用户年龄段的营养建议
    const getUserAgeGroup = (age: number) => {
        if (age >= 1 && age <= 3) return '1-3';
        if (age >= 4 && age <= 8) return '4-8';
        if (age >= 9 && age <= 13) return '9-13';
        if (age >= 14 && age <= 16) return '14-16';
        return '4-8'; // 默认
    };

    const ageGroup = getUserAgeGroup(userData.age);
    const recommendations = nutritionRecommendations.find((r: any) => r.ageGroup === ageGroup);

    // 获取推荐的热量和蛋白质范围
    const getRecommendedCalories = () => {
        if (!recommendations) return '无数据';
        return recommendations.recommendations?.calories
            ? `${recommendations.recommendations.calories.min}-${recommendations.recommendations.calories.max} ${recommendations.recommendations.calories.unit}`
            : '无数据';
    };

    const getRecommendedProtein = () => {
        if (!recommendations) return '无数据';
        return recommendations.recommendations?.protein
            ? `${recommendations.recommendations.protein.min}-${recommendations.recommendations.protein.max} ${recommendations.recommendations.protein.unit}`
            : '无数据';
    };

    // 辅助函数：获取比较状态的CSS类
    function getComparisonClass(actual: number, recommended: string): string {
        if (!recommended || recommended === '无数据') return styles.neutral;

        // 解析推荐值范围 (例如 "800-1200 kcal/day")
        const match = recommended.match(/(\d+)-(\d+)/);
        if (!match) return styles.neutral;

        const min = parseInt(match[1], 10);
        const max = parseInt(match[2], 10);

        if (actual < min) return styles.low;
        if (actual > max) return styles.high;
        return styles.good;
    }

    // 辅助函数：获取比较状态的文本
    function getComparisonText(actual: number, recommended: string): string {
        if (!recommended || recommended === '无数据') return '无数据';

        const match = recommended.match(/(\d+)-(\d+)/);
        if (!match) return '无法比较';

        const min = parseInt(match[1], 10);
        const max = parseInt(match[2], 10);

        if (actual < min) return '偏低';
        if (actual > max) return '偏高';
        return '适宜';
    }

    // 辅助函数：获取糖分限制
    function getSugarLimit(ageGroup: string): string {
        const limits: { [key: string]: string } = {
            '1-3': '15g',
            '4-8': '20g',
            '9-13': '25g',
            '14-16': '30g',
        };
        return limits[ageGroup] || '无数据';
    }

    // 辅助函数：获取糖分比较状态的CSS类
    function getSugarComparisonClass(actual: number, ageGroup: string): string {
        const limits: { [key: string]: number } = {
            '1-3': 15,
            '4-8': 20,
            '9-13': 25,
            '14-16': 30,
        };

        const limit = limits[ageGroup];
        if (!limit) return styles.neutral;

        if (actual > limit * 1.5) return styles.high;
        if (actual > limit) return styles.slightlyHigh;
        return styles.good;
    }

    // 辅助函数：获取糖分比较状态的文本
    function getSugarComparisonText(actual: number, ageGroup: string): string {
        const limits: { [key: string]: number } = {
            '1-3': 15,
            '4-8': 20,
            '9-13': 25,
            '14-16': 30,
        };

        const limit = limits[ageGroup];
        if (!limit) return '无数据';

        if (actual > limit * 1.5) return '过高';
        if (actual > limit) return '略高';
        return '适宜';
    }

    // 辅助函数：获取钠限制
    function getSodiumLimit(ageGroup: string): string {
        const limits: { [key: string]: string } = {
            '1-3': '1500mg',
            '4-8': '1900mg',
            '9-13': '2200mg',
            '14-16': '2300mg',
        };
        return limits[ageGroup] || '无数据';
    }

    // 辅助函数：获取钠比较状态的CSS类
    function getSodiumComparisonClass(actual: number, ageGroup: string): string {
        const limits: { [key: string]: number } = {
            '1-3': 1500,
            '4-8': 1900,
            '9-13': 2200,
            '14-16': 2300,
        };

        const limit = limits[ageGroup];
        if (!limit) return styles.neutral;

        if (actual > limit * 1.3) return styles.high;
        if (actual > limit) return styles.slightlyHigh;
        return styles.good;
    }

    // 辅助函数：获取钠比较状态的文本
    function getSodiumComparisonText(actual: number, ageGroup: string): string {
        const limits: { [key: string]: number } = {
            '1-3': 1500,
            '4-8': 1900,
            '9-13': 2200,
            '14-16': 2300,
        };

        const limit = limits[ageGroup];
        if (!limit) return '无数据';

        if (actual > limit * 1.3) return '过高';
        if (actual > limit) return '略高';
        return '适宜';
    }

    return (
        <div className={styles.dailyNutritionAnalysis}>
            <div className={styles.topSectionsContainer}>
                <div className={styles.nutritionSummary}>
                    <h3>今日营养摄入总结</h3>
                    {todayMeals && (
                        <div className={styles.nutritionGrid}>
                            <div className={styles.nutritionItem}>
                                <span>热量</span>
                                <strong>{todayMeals.totalNutrition.calories} 卡路里</strong>
                            </div>
                            <div className={styles.nutritionItem}>
                                <span>蛋白质</span>
                                <strong>{todayMeals.totalNutrition.protein}g</strong>
                            </div>
                            <div className={styles.nutritionItem}>
                                <span>脂肪</span>
                                <strong>{todayMeals.totalNutrition.fat}g</strong>
                            </div>
                            <div className={styles.nutritionItem}>
                                <span>碳水化合物</span>
                                <strong>{todayMeals.totalNutrition.carbs}g</strong>
                            </div>
                            <div className={styles.nutritionItem}>
                                <span>纤维</span>
                                <strong>{todayMeals.totalNutrition.fiber}g</strong>
                            </div>
                            <div className={styles.nutritionItem}>
                                <span>糖</span>
                                <strong>{todayMeals.totalNutrition.sugar}g</strong>
                            </div>
                            <div className={styles.nutritionItem}>
                                <span>钠</span>
                                <strong>{todayMeals.totalNutrition.sodium}mg</strong>
                            </div>
                        </div>
                    )}
                </div>
                
                {todayMeals && (
                    <div className={styles.nutritionComparisonSection}>
                        <h3>今日营养摄入与建议对比</h3>
                        <div className={styles.comparisonTable}>
                            <div className={styles.comparisonHeader}>
                                <div>营养素</div>
                                <div>今日摄入</div>
                                <div>建议摄入</div>
                                <div>状态</div>
                            </div>

                            <div className={styles.comparisonRow}>
                                <div>热量</div>
                                <div>{todayMeals.totalNutrition.calories} 卡路里</div>
                                <div>{getRecommendedCalories()}</div>
                                <div
                                    className={getComparisonClass(
                                        todayMeals.totalNutrition.calories,
                                        getRecommendedCalories()
                                    )}
                                >
                                    {getComparisonText(
                                        todayMeals.totalNutrition.calories,
                                        getRecommendedCalories()
                                    )}
                                </div>
                            </div>

                            <div className={styles.comparisonRow}>
                                <div>蛋白质</div>
                                <div>{todayMeals.totalNutrition.protein}g</div>
                                <div>{getRecommendedProtein()}</div>
                                <div
                                    className={getComparisonClass(
                                        todayMeals.totalNutrition.protein,
                                        getRecommendedProtein()
                                    )}
                                >
                                    {getComparisonText(
                                        todayMeals.totalNutrition.protein,
                                        getRecommendedProtein()
                                    )}
                                </div>
                            </div>

                            <div className={styles.comparisonRow}>
                                <div>糖</div>
                                <div>{todayMeals.totalNutrition.sugar}g</div>
                                <div>{getSugarLimit(ageGroup)}</div>
                                <div
                                    className={getSugarComparisonClass(
                                        todayMeals.totalNutrition.sugar,
                                        ageGroup
                                    )}
                                >
                                    {getSugarComparisonText(todayMeals.totalNutrition.sugar, ageGroup)}
                                </div>
                            </div>

                            <div className={styles.comparisonRow}>
                                <div>钠</div>
                                <div>{todayMeals.totalNutrition.sodium}mg</div>
                                <div>{getSodiumLimit(ageGroup)}</div>
                                <div
                                    className={getSodiumComparisonClass(
                                        todayMeals.totalNutrition.sodium,
                                        ageGroup
                                    )}
                                >
                                    {getSodiumComparisonText(
                                        todayMeals.totalNutrition.sodium,
                                        ageGroup
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.mealSection}>
                <h3>今日餐食记录</h3>
                {todayMeals ? (
                    <div className={styles.mealCards}>
                        {todayMeals.meals.map((meal: any, index: number) => (
                            <div key={index} className={styles.mealCard}>
                                <h4>
                                    {meal.type} ({meal.time})
                                </h4>
                                <ul>
                                    {meal.foods.map((food: any, idx: number) => (
                                        <li key={idx}>
                                            {food.name}: {food.quantity} {food.unit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <div className={styles.hydrationCard}>
                            <h4>水分摄入</h4>
                            <p>水: {todayMeals.hydration.water}ml</p>
                            <p>其他饮料: {todayMeals.hydration.otherDrinks}ml</p>
                        </div>
                    </div>
                ) : (
                    <p>今日无餐食记录</p>
                )}
            </div>
        </div>
    );
};

export default DailyNutritionAnalysis; 