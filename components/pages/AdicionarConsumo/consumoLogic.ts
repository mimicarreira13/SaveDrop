// src/app/consumo/consumoLogic.ts
import { ActivityLog, UserBaselines, STORAGE_KEYS } from './atividadesData';
import { getBaselineForActivity, hasAnyBaseline } from './baselinePrediction';

// Constante com o valor base
const BASE_WATER_SAVED = 1250;

// Funções de cálculo atualizadas
export const calculateSavings = (
    activityId: string,
    amount: number,
    litersPerUnit: number,
    userBaselines?: UserBaselines
): number => {
    const baselineAmount = getBaselineForActivity(activityId, userBaselines);
    if (baselineAmount === null) return 0;

    const expectedLiters = baselineAmount * litersPerUnit;
    const realLiters = amount * litersPerUnit;
    const savedLiters = expectedLiters - realLiters;

    return savedLiters;
};

export const getUnitLabel = (unit: string): string => {
    switch (unit) {
        case 'minutes': return 'minutos';
        case 'times': return 'vezes';
        case 'liters': return 'litros';
        default: return '';
    }
};

export const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `há ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    return `há ${Math.floor(hours / 24)}d`;
};

// Funções de localStorage
export const loadActivityLogFromStorage = (): ActivityLog[] => {
    try {
        const savedLogs = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
        if (savedLogs) {
            const logs = JSON.parse(savedLogs);
            if (Array.isArray(logs) && logs.length > 0) {
                return logs;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar logs:', error);
    }
    return [];
};

export const saveActivityLogToStorage = (logs: ActivityLog[]) => {
    try {
        localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(logs));
    } catch (error) {
        console.error('Erro ao guardar logs:', error);
    }
};

export const updateDashboardFromLogs = (logs: ActivityLog[]) => {
    try {
        // Soma todas as poupanças
        const totalSavedFromActivities = logs.reduce((total, log) => total + (log.savedLiters || 0), 0);

        // Valor total = Base + Poupanças acumuladas
        const totalWaterSaved = BASE_WATER_SAVED + totalSavedFromActivities;

        const today = new Date().toDateString();

        // Calcular streak
        let daysStreak = 0;
        const dashboardData = localStorage.getItem(STORAGE_KEYS.DASHBOARD);
        let dashboard = dashboardData ? JSON.parse(dashboardData) : { daysStreak: 0, waterSaved: BASE_WATER_SAVED };

        const hasActivityToday = logs.some(log =>
            new Date(log.timestamp).toDateString() === today
        );

        if (hasActivityToday) {
            const todaySaved = logs
                .filter(log => new Date(log.timestamp).toDateString() === today)
                .reduce((total, log) => total + (log.savedLiters || 0), 0);

            if (todaySaved > 0) {
                daysStreak = (dashboard.daysStreak || 0) > 0 ? dashboard.daysStreak + 1 : 1;
            } else {
                daysStreak = dashboard.daysStreak || 0;
            }
        } else {
            daysStreak = dashboard.daysStreak || 0;
        }

        // Atualizar dashboard
        const updatedDashboard = {
            waterSaved: totalWaterSaved,
            daysStreak: daysStreak,
            goalWater: 2000,
            lastUpdate: new Date().toISOString(),
            baseWaterSaved: BASE_WATER_SAVED,
            accumulatedSavings: totalSavedFromActivities
        };

        localStorage.setItem(STORAGE_KEYS.DASHBOARD, JSON.stringify(updatedDashboard));

        // SINCRONIZA AS METAS IMEDIATAMENTE
        setTimeout(() => {
            try {
                const goalsData = localStorage.getItem('savedrop_user_goals');
                if (goalsData) {
                    const goals = JSON.parse(goalsData);
                    const updatedGoals = goals.map((goal: any) => {
                        if (goal.type === 'water_saving') {
                            return {
                                ...goal,
                                current: totalWaterSaved,
                                status: totalWaterSaved >= goal.target ? 'completed' : 'active'
                            };
                        } else if (goal.type === 'shower_time' || goal.type === 'activity_streak') {
                            return {
                                ...goal,
                                current: Math.min(daysStreak, goal.target),
                                status: daysStreak >= goal.target ? 'completed' : 'active'
                            };
                        }
                        return goal;
                    });
                    localStorage.setItem('savedrop_user_goals', JSON.stringify(updatedGoals));
                }
            } catch (e) {
                console.error('Erro ao sincronizar metas:', e);
            }
        }, 100);

    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
    }
};

// Verificar se atividade tem baseline
export const hasBaseline = (activityId: string): boolean => {
    return hasAnyBaseline(activityId);
};

// Função para obter o valor base
export const getBaseWaterSaved = (): number => {
    return BASE_WATER_SAVED;
};

// Função para formatar o valor de água poupada
export const formatWaterSavedDisplay = (waterSaved: number): string => {
    const base = 1250;
    const accumulated = waterSaved - base;

    if (accumulated === 0) {
        return `${waterSaved}L`;
    } else if (accumulated > 0) {
        return `${waterSaved}L (+${accumulated})`;
    } else {
        return `${waterSaved}L (${accumulated})`;
    }
};