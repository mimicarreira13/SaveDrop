import { ActivityLog, UserBaselines, STORAGE_KEYS } from './atividadesData';
import { getBaselineForActivity, hasAnyBaseline } from './baselinePrediction';

// Constante com o valor base
const BASE_WATER_SAVED = 1250;

// Funções de cálculo atualizadas para usar baselines preditas e permitir valores negativos
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

    // Permite valores negativos (quando excede o baseline)
    return savedLiters; // Retorna positivo ou negativo
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
        // Soma todas as poupanças (positivas e negativas)
        const totalSavedFromActivities = logs.reduce((total, log) => total + (log.savedLiters || 0), 0);

        // Valor total = Base + Poupanças acumuladas
        const totalWaterSaved = BASE_WATER_SAVED + totalSavedFromActivities;

        const today = new Date().toDateString();

        // Calcular streak (só incrementa se houver poupança positiva HOJE)
        let daysStreak = 0;
        const dashboardData = localStorage.getItem(STORAGE_KEYS.DASHBOARD);
        let dashboard = dashboardData ? JSON.parse(dashboardData) : { daysStreak: 0, waterSaved: BASE_WATER_SAVED };

        const hasActivityToday = logs.some(log =>
            new Date(log.timestamp).toDateString() === today
        );

        if (hasActivityToday) {
            // Verifica se hoje teve poupança positiva líquida
            const todaySaved = logs
                .filter(log => new Date(log.timestamp).toDateString() === today)
                .reduce((total, log) => total + (log.savedLiters || 0), 0);

            if (todaySaved > 0) {
                daysStreak = (dashboard.daysStreak || 0) > 0 ? dashboard.daysStreak + 1 : 1;
            } else {
                // Se teve poupança negativa ou zero, mantém a streak atual
                daysStreak = dashboard.daysStreak || 0;
            }
        } else {
            daysStreak = dashboard.daysStreak || 0;
        }

        // Atualizar dashboard
        const updatedDashboard = {
            waterSaved: totalWaterSaved, // Base + poupanças acumuladas
            daysStreak: daysStreak,
            goalWater: 2000,
            lastUpdate: new Date().toISOString(),
            baseWaterSaved: BASE_WATER_SAVED, // Guardar o valor base para referência
            accumulatedSavings: totalSavedFromActivities // Poupanças acumuladas
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

// Função para obter o valor base (útil para outros módulos)
export const getBaseWaterSaved = (): number => {
    return BASE_WATER_SAVED;
};

// Adicionar esta função no final do ficheiro
// Função para formatar o valor de água poupada para display
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