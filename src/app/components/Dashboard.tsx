'use client';

import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import styles from './Dashboard.module.css';

// 定义颜色
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', 
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

interface DashboardProps {
  userData: any;
  scoreData: any;
  mealData: any;
  currentDate: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  userData, 
  scoreData, 
  mealData, 
  currentDate 
}) => {
  // 获取最近一周的评分数据
  const recentScores = scoreData.scores
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);

  // 获取当天的评分数据
  const todayScore = scoreData.scores.find((s: any) => s.date === currentDate);

  // 获取当天的餐食记录
  const todayMeals = mealData.records.find((r: any) => r.date === currentDate);

  // 准备类别评分数据用于柱状图
  const categoryScoreData = todayScore ? Object.entries(todayScore.categoryScores).map(([name, value]) => ({
    name: name,
    value: value,
  })) : [];

  return (
    <div className={styles.dashboard}>
      <div className={styles.userInfo}>
        <div className={styles.userCard}>
          <h2>{userData.name}的营养仪表板</h2>
          <p>年龄: {userData.age}岁 | 身高: {userData.height}cm | 体重: {userData.weight}kg</p>
          <p>目标: {userData.goal} | 活动水平: {userData.activityLevel}</p>
          <p>过敏源: {userData.allergies.length > 0 ? userData.allergies.join(', ') : '无'}</p>
        </div>
        
        <div className={styles.scoreCard}>
          <h2>今日营养评分</h2>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreValue}>{todayScore ? todayScore.overallScore : 'N/A'}</span>
          </div>
          <div className={styles.scoreFeedback}>
            {todayScore && todayScore.feedback.map((item: string, index: number) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h3>每日营养评分趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[60, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="overallScore" 
                stroke="#8884d8" 
                name="总体评分" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>营养类别评分</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="评分">
                {categoryScoreData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.mealSection}>
        <h3>今日餐食记录</h3>
        {todayMeals ? (
          <div className={styles.mealCards}>
            {todayMeals.meals.map((meal: any, index: number) => (
              <div key={index} className={styles.mealCard}>
                <h4>{meal.type} ({meal.time})</h4>
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