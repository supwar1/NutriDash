'use client';

import React from 'react';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip 
} from 'recharts';
import styles from './NutritionAnalysis.module.css';

// 导入数据
import nutritionRecommendations from '../../../data/nutrition_recommendations.json';
import foodRestrictions from '../../../data/food_restrictions.json';

interface NutritionAnalysisProps {
  userData: any;
  scoreData: any;
  mealData: any;
  currentDate: string;
}

const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({ 
  userData, 
  scoreData, 
  mealData, 
  currentDate 
}) => {
  // 获取当天的评分数据
  const todayScore = scoreData.scores.find((s: any) => s.date === currentDate);
  
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
  
  // 准备雷达图数据
  const radarData = todayScore ? Object.entries(todayScore.categoryScores).map(([key, value]) => {
    // 转换键名为更友好的显示名称
    const nameMap: {[key: string]: string} = {
      calorieBalance: '热量平衡',
      proteinIntake: '蛋白质',
      fatIntake: '脂肪',
      carbsIntake: '碳水',
      fiberIntake: '纤维',
      sugarControl: '糖控制',
      sodiumControl: '钠控制',
      hydration: '水分',
      mealDiversity: '多样性',
      nutritionalBalance: '营养平衡',
      allergenAvoidance: '过敏源控制'
    };
    
    return {
      subject: nameMap[key] || key,
      A: value,
      fullMark: 100,
    };
  }) : [];
  
  // 检查用户是否有过敏源
  const hasAllergies = userData.allergies && userData.allergies.length > 0;
  
  // 获取过敏源信息
  const allergenInfo = hasAllergies ? userData.allergies.map((allergen: string) => {
    const allergenData = foodRestrictions.find((fr: any) => 
      fr.type === 'allergen' && fr.name.toLowerCase() === allergen.toLowerCase()
    );
    return allergenData || { name: allergen, description: '无详细信息' };
  }) : [];
  
  // 获取适用于用户年龄的饮食限制
  const dietaryRestrictions = foodRestrictions.filter((fr: any) => fr.type === 'restriction').map((restriction: any) => {
    const ageLimit = restriction.limits?.find((l: any) => l.ageGroup === ageGroup);
    return {
      ...restriction,
      currentLimit: ageLimit ? ageLimit.limit : '无数据'
    };
  });

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

  const getRecommendedFat = () => {
    if (!recommendations) return '无数据';
    return recommendations.recommendations?.fat 
      ? `${recommendations.recommendations.fat.min}-${recommendations.recommendations.fat.max}% ${recommendations.recommendations.fat.unit}`
      : '30-40% 总热量';
  };

  const getRecommendedCarbs = () => {
    if (!recommendations) return '无数据';
    return recommendations.recommendations?.carbs 
      ? `${recommendations.recommendations.carbs.min}-${recommendations.recommendations.carbs.max}% ${recommendations.recommendations.carbs.unit}`
      : '45-65% 总热量';
  };

  const getNutritionTips = () => {
    if (!recommendations) return [];
    return recommendations.recommendations?.generalAdvice || [];
  };

  return (
    <div className={styles.analysisContainer}>
      <h2 className={styles.sectionTitle}>营养详细分析</h2>
      
      <div className={styles.analysisGrid}>
        <div className={styles.radarChartSection}>
          <h3>营养平衡雷达图</h3>
          <div className={styles.radarChartContainer}>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="营养评分"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className={styles.recommendationsSection}>
          <h3>年龄段营养建议 ({ageGroup}岁)</h3>
          {recommendations ? (
            <div className={styles.recommendationsList}>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationLabel}>热量需求:</span>
                <span className={styles.recommendationValue}>{getRecommendedCalories()}</span>
              </div>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationLabel}>蛋白质需求:</span>
                <span className={styles.recommendationValue}>{getRecommendedProtein()}</span>
              </div>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationLabel}>脂肪需求:</span>
                <span className={styles.recommendationValue}>{getRecommendedFat()}</span>
              </div>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationLabel}>碳水需求:</span>
                <span className={styles.recommendationValue}>{getRecommendedCarbs()}</span>
              </div>
              <h4 className={styles.tipsTitle}>饮食建议:</h4>
              <ul className={styles.tipsList}>
                {getNutritionTips().map((tip: string, index: number) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>无适用于该年龄段的建议</p>
          )}
        </div>
      </div>
      
      <div className={styles.restrictionsSection}>
        <h3>饮食限制与注意事项</h3>
        
        {hasAllergies && (
          <div className={styles.allergensInfo}>
            <h4>过敏源信息:</h4>
            {allergenInfo.map((allergen: any, index: number) => (
              <div key={index} className={styles.allergenItem}>
                <h5>{allergen.name}</h5>
                <p>{allergen.description}</p>
                {allergen.commonFoods && (
                  <div>
                    <span className={styles.allergenLabel}>常见食物:</span>
                    <span>{allergen.commonFoods.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className={styles.dietaryRestrictionsInfo}>
          <h4>年龄段饮食限制:</h4>
          {dietaryRestrictions.map((restriction: any, index: number) => (
            <div key={index} className={styles.restrictionItem}>
              <h5>{restriction.name}</h5>
              <p>{restriction.description}</p>
              <div>
                <span className={styles.restrictionLabel}>建议限制:</span>
                <span className={styles.restrictionValue}>{restriction.currentLimit}</span>
              </div>
              {restriction.highFoods && (
                <div>
                  <span className={styles.restrictionLabel}>高含量食物:</span>
                  <span>{restriction.highFoods.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
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
              <div className={getComparisonClass(todayMeals.totalNutrition.calories, getRecommendedCalories())}>
                {getComparisonText(todayMeals.totalNutrition.calories, getRecommendedCalories())}
              </div>
            </div>
            
            <div className={styles.comparisonRow}>
              <div>蛋白质</div>
              <div>{todayMeals.totalNutrition.protein}g</div>
              <div>{getRecommendedProtein()}</div>
              <div className={getComparisonClass(todayMeals.totalNutrition.protein, getRecommendedProtein())}>
                {getComparisonText(todayMeals.totalNutrition.protein, getRecommendedProtein())}
              </div>
            </div>
            
            <div className={styles.comparisonRow}>
              <div>糖</div>
              <div>{todayMeals.totalNutrition.sugar}g</div>
              <div>{getSugarLimit(ageGroup)}</div>
              <div className={getSugarComparisonClass(todayMeals.totalNutrition.sugar, ageGroup)}>
                {getSugarComparisonText(todayMeals.totalNutrition.sugar, ageGroup)}
              </div>
            </div>
            
            <div className={styles.comparisonRow}>
              <div>钠</div>
              <div>{todayMeals.totalNutrition.sodium}mg</div>
              <div>{getSodiumLimit(ageGroup)}</div>
              <div className={getSodiumComparisonClass(todayMeals.totalNutrition.sodium, ageGroup)}>
                {getSodiumComparisonText(todayMeals.totalNutrition.sodium, ageGroup)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
  const limits: {[key: string]: string} = {
    '1-3': '15g',
    '4-8': '20g',
    '9-13': '25g',
    '14-16': '30g'
  };
  return limits[ageGroup] || '无数据';
}

// 辅助函数：获取糖分比较状态的CSS类
function getSugarComparisonClass(actual: number, ageGroup: string): string {
  const limits: {[key: string]: number} = {
    '1-3': 15,
    '4-8': 20,
    '9-13': 25,
    '14-16': 30
  };
  
  const limit = limits[ageGroup];
  if (!limit) return styles.neutral;
  
  if (actual > limit * 1.5) return styles.high;
  if (actual > limit) return styles.slightlyHigh;
  return styles.good;
}

// 辅助函数：获取糖分比较状态的文本
function getSugarComparisonText(actual: number, ageGroup: string): string {
  const limits: {[key: string]: number} = {
    '1-3': 15,
    '4-8': 20,
    '9-13': 25,
    '14-16': 30
  };
  
  const limit = limits[ageGroup];
  if (!limit) return '无数据';
  
  if (actual > limit * 1.5) return '过高';
  if (actual > limit) return '略高';
  return '适宜';
}

// 辅助函数：获取钠限制
function getSodiumLimit(ageGroup: string): string {
  const limits: {[key: string]: string} = {
    '1-3': '1500mg',
    '4-8': '1900mg',
    '9-13': '2200mg',
    '14-16': '2300mg'
  };
  return limits[ageGroup] || '无数据';
}

// 辅助函数：获取钠比较状态的CSS类
function getSodiumComparisonClass(actual: number, ageGroup: string): string {
  const limits: {[key: string]: number} = {
    '1-3': 1500,
    '4-8': 1900,
    '9-13': 2200,
    '14-16': 2300
  };
  
  const limit = limits[ageGroup];
  if (!limit) return styles.neutral;
  
  if (actual > limit * 1.3) return styles.high;
  if (actual > limit) return styles.slightlyHigh;
  return styles.good;
}

// 辅助函数：获取钠比较状态的文本
function getSodiumComparisonText(actual: number, ageGroup: string): string {
  const limits: {[key: string]: number} = {
    '1-3': 1500,
    '4-8': 1900,
    '9-13': 2200,
    '14-16': 2300
  };
  
  const limit = limits[ageGroup];
  if (!limit) return '无数据';
  
  if (actual > limit * 1.3) return '过高';
  if (actual > limit) return '略高';
  return '适宜';
}

export default NutritionAnalysis; 