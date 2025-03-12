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
                {/* 每日营养评分趋势 - 全宽显示 */}
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
            </div>
        </div>
    );
};

export default Dashboard;
