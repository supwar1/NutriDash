'use client';

import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    Area,
} from 'recharts';
import styles from './Dashboard.module.css';

// 导入饮食行为分析数据
import eatingBehaviorsData from '../../../data/eating_behaviors_analysis.json';

// 颜色配置
const COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
    '#0088fe',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
];

// 卡通角色配置
const CARTOON_CHARACTERS = {
    boy: {
        young: '/images/cartoon-boy-young.png', // 1-6岁男孩
        middle: '/images/cartoon-boy-middle.png', // 7-12岁男孩
        teen: '/images/cartoon-boy-teen.png', // 13-16岁男孩
    },
    girl: {
        young: '/images/cartoon-girl-young.png', // 1-6岁女孩
        middle: '/images/cartoon-girl-middle.png', // 7-12岁女孩
        teen: '/images/cartoon-girl-teen.png', // 13-16岁女孩
    },
};

// 获取用户对应的卡通角色
const getUserCartoonCharacter = (age: number, gender: string) => {
    const ageGroup = age <= 6 ? 'young' : age <= 12 ? 'middle' : 'teen';
    const genderKey = gender === '男' ? 'boy' : 'girl';

    // 如果没有对应的图片，使用默认图片
    // return CARTOON_CHARACTERS[genderKey]?.[ageGroup] || "/images/cartoon-default.png";

    // 现在只使用默认图片
    return '/images/cartoon-default.png';
};

interface DashboardProps {
    userData: any;
    scoreData: any;
    mealData: any;
    currentDate: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, scoreData, mealData, currentDate }) => {
    // 查找用户的饮食行为分析数据
    const [behaviorAnalysis, setBehaviorAnalysis] = useState<any>(null);

    useEffect(() => {
        // 查找当前用户的饮食行为分析
        const userBehaviorAnalysis = eatingBehaviorsData.find(h => h.userId === userData.id);
        setBehaviorAnalysis(userBehaviorAnalysis);
    }, [userData.id]);

    // 获取最近一周的评分数据
    const recentScores = scoreData.scores
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7)
        .map((score: any) => ({
            date: score.date.substring(5), // 只显示月-日部分，如"09-08"
            overallScore: score.overallScore,
            fill: score.date === currentDate ? 'var(--primary-color)' : 'var(--primary-light)'
        }));

    // 获取当天的评分数据
    const todayScore = scoreData.scores.find((s: any) => s.date === currentDate);

    // 获取当天的餐食记录
    const todayMeals = mealData.records.find((r: any) => r.date === currentDate);

    // 获取用户的卡通角色
    const cartoonCharacter = getUserCartoonCharacter(userData.age, userData.gender || '男');

    // 准备类别评分数据用于柱状图
    const categoryScoreData = todayScore
        ? Object.entries(todayScore.categoryScores).map(([name, value]) => ({
              name: name,
              value: value,
          }))
        : [];

    return (
        <div className={styles.dashboard}>
            <div className={styles.userInfoContainer}>
                <div className={styles.userCard}>
                    <div className={styles.userCardHeader}>
                        <h2>{userData.name}的营养仪表板</h2>
                        <div className={styles.userAgeTag}>
                            {userData.age}岁
                        </div>
                    </div>
                    
                    <div className={styles.userCardContent}>
                        <div className={styles.userCartoonContainer}>
                            <img 
                                src={cartoonCharacter} 
                                alt={`${userData.name}的卡通形象`} 
                                className={styles.cartoonImage}
                                onError={(e) => {
                                    // 如果图片加载失败，显示默认图片
                                    e.currentTarget.src = "/images/cartoon-default.jpg";
                                }}
                            />
                        </div>
                        
                        <div className={styles.userDetails}>
                            <div className={styles.userDetailItem}>
                                <span className={styles.detailIcon}>📏</span>
                                <span className={styles.detailLabel}>身高:</span>
                                <span className={styles.detailValue}>{userData.height} cm</span>
                            </div>
                            
                            <div className={styles.userDetailItem}>
                                <span className={styles.detailIcon}>⚖️</span>
                                <span className={styles.detailLabel}>体重:</span>
                                <span className={styles.detailValue}>{userData.weight} kg</span>
                            </div>
                            
                            <div className={styles.userDetailItem}>
                                <span className={styles.detailIcon}>🎯</span>
                                <span className={styles.detailLabel}>目标:</span>
                                <span className={styles.detailValue}>{userData.goal}</span>
                            </div>
                            
                            <div className={styles.userDetailItem}>
                                <span className={styles.detailIcon}>🏃</span>
                                <span className={styles.detailLabel}>活动水平:</span>
                                <span className={styles.detailValue}>{userData.activityLevel}</span>
                            </div>
                            
                            <div className={styles.userDetailItem}>
                                <span className={styles.detailIcon}>⚠️</span>
                                <span className={styles.detailLabel}>过敏源:</span>
                                <span className={styles.detailValue}>
                                    {userData.allergies.length > 0 ? (
                                        <div className={styles.allergyTags}>
                                            {userData.allergies.map((allergy: string, index: number) => (
                                                <span key={index} className={styles.allergyTag}>{allergy}</span>
                                            ))}
                                        </div>
                                    ) : '无'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.scoreCard}>
                    <h2>今日营养评分</h2>
                    <div className={styles.scoreCircleContainer}>
                        <div className={styles.scoreCircle}>
                            <span className={styles.scoreValue}>
                                {todayScore ? todayScore.overallScore : 'N/A'}
                            </span>
                        </div>
                        {todayScore && todayScore.overallScore >= 85 && (
                            <div className={styles.scoreEmoji}>🌟</div>
                        )}
                        {todayScore &&
                            todayScore.overallScore >= 70 &&
                            todayScore.overallScore < 85 && (
                                <div className={styles.scoreEmoji}>😊</div>
                            )}
                        {todayScore && todayScore.overallScore < 70 && (
                            <div className={styles.scoreEmoji}>🔍</div>
                        )}
                    </div>
                    <div className={styles.scoreFeedback}>
                        {todayScore &&
                            todayScore.feedback.map((item: string, index: number) => (
                                <p key={index}>
                                    <span className={styles.feedbackBullet}>•</span>
                                    {item}
                                </p>
                            ))}
                    </div>
                </div>
            </div>

            <div className={styles.chartsContainer}>
                <div className={styles.chartCard}>
                    <h3>每日营养评分趋势</h3>
                    <div className={styles.chartDescription}>
                        过去7天的营养评分变化趋势，帮助您了解饮食习惯的改善情况
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={recentScores} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                            <defs>
                                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--primary-light)" stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fill: 'var(--text-secondary)' }}
                                axisLine={{ stroke: 'var(--border-color)' }}
                            />
                            <YAxis 
                                domain={[60, 100]} 
                                tick={{ fill: 'var(--text-secondary)' }}
                                axisLine={{ stroke: 'var(--border-color)' }}
                                tickCount={5}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--card-background)', 
                                    borderColor: 'var(--border-color)',
                                    borderRadius: 'var(--border-radius)',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                                labelStyle={{ color: 'var(--primary-color)', fontWeight: 'bold' }}
                                formatter={(value: any) => [`${value} 分`, '营养评分']}
                            />
                            <Bar 
                                dataKey="overallScore" 
                                name="营养评分" 
                                radius={[4, 4, 0, 0]}
                            >
                                {recentScores.map((entry: any, index: number) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.date === currentDate.substring(5) ? 'var(--primary-color)' : 'var(--primary-light)'} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className={styles.chartLegend}>
                        <div className={styles.legendItem}>
                            <div className={styles.legendColor} style={{ backgroundColor: 'var(--primary-color)' }}></div>
                            <span>当前日期</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendColor} style={{ backgroundColor: 'var(--primary-light)' }}></div>
                            <span>历史数据</span>
                        </div>
                    </div>
                </div>

                {behaviorAnalysis && (
                    <div className={styles.behaviorCard}>
                        <h3>饮食行为分析</h3>
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

            <div className={styles.nutritionSummary}>
                <h3>营养摄入总结</h3>
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
        </div>
    );
};

export default Dashboard;
