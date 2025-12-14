// src/utils/dataSync.ts
'use client';

export const DATA_KEYS = {
    DASHBOARD: 'savedrop_dashboard',
    USER_GOALS: 'savedrop_user_goals',
    ACTIVITY_LOG: 'savedrop_activity_log',
    GOALS_HISTORY: 'savedrop_goals_history'
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

// Função para atualizar o dashboard
export const updateDashboardData = (updates: Partial<any>) => {
    try {
        const currentData = getCurrentDashboardData();
        const updatedData = {
            ...currentData,
            ...updates,
            lastUpdate: new Date().toISOString()
        };

        localStorage.setItem(DATA_KEYS.DASHBOARD, JSON.stringify(updatedData));
        return updatedData;
    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
        return null;
    }
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

// Função para obter histórico atualizado
export const getUpdatedHistory = () => {
    try {
        const dashboardData = getCurrentDashboardData();
        const historyData = localStorage.getItem(DATA_KEYS.GOALS_HISTORY);

        if (historyData) {
            const history = JSON.parse(historyData);
            // Atualiza o mês atual com o valor real
            if (history.length > 0 && history[0].status === 'current') {
                history[0].saved = dashboardData.waterSaved;
                localStorage.setItem(DATA_KEYS.GOALS_HISTORY, JSON.stringify(history));
            }
            return history;
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }

    // Fallback
    const dashboardData = getCurrentDashboardData();
    return [
        { month: "Dezembro", saved: dashboardData.waterSaved, status: "current" },
        { month: "Novembro", saved: 1250, status: "completed" },
        { month: "Outubro", saved: 2150, status: "completed" },
        { month: "Setembro", saved: 1890, status: "completed" },
    ];
};