import { ActivityLog, UserBaselines, STORAGE_KEYS } from './atividadesData';
import { getBaselineForActivity, hasAnyBaseline } from './baselinePrediction';

// Funções de cálculo atualizadas para usar baselines preditas
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

    return savedLiters > 0 ? savedLiters : 0;
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
        const totalSavedLiters = logs.reduce((total, log) => total + (log.savedLiters || 0), 0);
        const today = new Date().toDateString();

        // Calcular streak
        let daysStreak = 0;
        const dashboardData = localStorage.getItem(STORAGE_KEYS.DASHBOARD);
        let dashboard = dashboardData ? JSON.parse(dashboardData) : { daysStreak: 0 };

        const hasActivityToday = logs.some(log =>
            new Date(log.timestamp).toDateString() === today
        );

        if (hasActivityToday) {
            daysStreak = dashboard.daysStreak > 0 ? dashboard.daysStreak + 1 : 1;
        }

        // Atualizar dashboard
        const updatedDashboard = {
            waterSaved: totalSavedLiters,
            daysStreak: daysStreak,
            goalWater: 2000,
            lastUpdate: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.DASHBOARD, JSON.stringify(updatedDashboard));

    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
    }
};

// Verificar se atividade tem baseline (agora inclui preditas)
export const hasBaseline = (activityId: string): boolean => {
    return hasAnyBaseline(activityId);
};