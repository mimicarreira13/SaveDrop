// src/components/AppInitializer.tsx
'use client';
import { useEffect } from 'react';

export const DATA_KEYS = {
    DASHBOARD: 'savedrop_dashboard',
    USER_GOALS: 'savedrop_user_goals',
    ACTIVITY_LOG: 'savedrop_activity_log',
    GOALS_HISTORY: 'savedrop_goals_history',
    QUESTIONNAIRE: 'waterApp_questionnaire',
    BASELINES: 'waterApp_baselines'
} as const;

// Função para obter os dados atuais do dashboard
export const getCurrentDashboardData = () => {
    try {
        const dashboardData = localStorage.getItem(DATA_KEYS.DASHBOARD);
        if (dashboardData) {
            const parsed = JSON.parse(dashboardData);
            return {
                waterSaved: parsed.waterSaved || 1250,
                daysStreak: parsed.daysStreak || 6,
                goalWater: 2000,
                baseWaterSaved: 1250,
                accumulatedSavings: parsed.accumulatedSavings || 0,
                lastUpdate: parsed.lastUpdate || new Date().toISOString()
            };
        }
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }

    // Dados padrão SE não existir no localStorage
    return {
        waterSaved: 1250,
        daysStreak: 6,
        goalWater: 2000,
        baseWaterSaved: 1250,
        accumulatedSavings: 0,
        lastUpdate: new Date().toISOString()
    };
};

// Função para inicializar dados se não existirem
export const initializeAppData = () => {
    try {
        // Dashboard
        if (!localStorage.getItem(DATA_KEYS.DASHBOARD)) {
            localStorage.setItem(DATA_KEYS.DASHBOARD, JSON.stringify({
                waterSaved: 1250,
                daysStreak: 6,
                goalWater: 2000,
                baseWaterSaved: 1250,
                accumulatedSavings: 0,
                lastUpdate: new Date().toISOString()
            }));
        }

        // Histórico de metas
        if (!localStorage.getItem(DATA_KEYS.GOALS_HISTORY)) {
            const dashboardData = getCurrentDashboardData();
            localStorage.setItem(DATA_KEYS.GOALS_HISTORY, JSON.stringify([
                { month: "Dezembro", saved: dashboardData.waterSaved, status: "current" },
                { month: "Novembro", saved: 1250, status: "completed" },
                { month: "Outubro", saved: 2150, status: "completed" },
                { month: "Setembro", saved: 1890, status: "completed" },
            ]));
        }

        // Logs de atividade
        if (!localStorage.getItem(DATA_KEYS.ACTIVITY_LOG)) {
            localStorage.setItem(DATA_KEYS.ACTIVITY_LOG, JSON.stringify([]));
        }

        return getCurrentDashboardData();
    } catch (error) {
        console.error('Erro ao inicializar dados da app:', error);
        return getCurrentDashboardData();
    }
};

// Componente que inicializa os dados
export function AppInitializer() {
    useEffect(() => {
        // Inicializa dados da app quando o componente monta
        initializeAppData();

        // Também roda quando a página/tab ganha foco
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                initializeAppData();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return null;
}