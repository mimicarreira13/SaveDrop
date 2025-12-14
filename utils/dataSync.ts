// src/utils/dataSync.ts
'use client';

export const DATA_KEYS = {
    DASHBOARD: 'savedrop_dashboard',
    USER_GOALS: 'savedrop_user_goals',
    ACTIVITY_LOG: 'savedrop_activity_log',
    GOALS_HISTORY: 'savedrop_goals_history'
} as const;

const BONUS_POINTS_KEY = 'recompensas_bonus_points';

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

// Obter pontos totais do usuário
export function getUserTotalPoints(): number {
    try {
        // 1. Litros poupados do dashboard
        const dashboardData = getCurrentDashboardData();
        const litrosPoupados = dashboardData.waterSaved;

        // 2. Pontos bónus
        const bonusPoints = localStorage.getItem(BONUS_POINTS_KEY);
        const bonus = bonusPoints ? parseInt(bonusPoints, 10) : 0;

        // 3. Total = Litros + Bónus
        return litrosPoupados + bonus;
    } catch (error) {
        console.error('Erro ao obter pontos totais:', error);
        return 1250; // valor base
    }
}

// Obter ranking de todos os usuários (simulado + usuário real)
export interface RankingEntry {
    id: number;
    name: string;
    avatar: string;
    points: number;
    saved: number;
    rank: number;
    change: "up" | "down" | "same";
    color: string;
    isUser?: boolean;
}

export function getFullRanking(userPoints: number): RankingEntry[] {
    const baseRanking = [
        { id: 1, name: "AquaMaster", avatar: "😎", points: 3450, saved: 3450, rank: 1, change: "up" as const, color: "bg-yellow-500" },
        { id: 2, name: "EcoWarrior", avatar: "🌍", points: 2890, saved: 2890, rank: 2, change: "same" as const, color: "bg-gray-400" },
        { id: 3, name: "DropSaver", avatar: "💧", points: 2340, saved: 2340, rank: 3, change: "up" as const, color: "bg-orange-600" },
        { id: 4, name: "Você", avatar: "💧", points: userPoints, saved: userPoints, rank: 4, change: "down" as const, color: "bg-blue-500", isUser: true },
        { id: 5, name: "WaterGuard", avatar: "🛡️", points: 980, saved: 980, rank: 5, change: "up" as const, color: "bg-green-500" },
        { id: 6, name: "SplashHero", avatar: "🌊", points: 850, saved: 850, rank: 6, change: "down" as const, color: "bg-purple-400" },
        { id: 7, name: "FlowFriend", avatar: "😊", points: 720, saved: 720, rank: 7, change: "same" as const, color: "bg-pink-400" },
        { id: 8, name: "HydroHelper", avatar: "🤝", points: 610, saved: 610, rank: 8, change: "up" as const, color: "bg-indigo-400" },
    ];

    // Adicionar usuário real com seus pontos
    const userEntry = baseRanking.find(u => u.isUser);
    if (userEntry) {
        userEntry.points = userPoints;
        userEntry.saved = userPoints;
    }

    // Ordenar por pontos (descendente)
    const sortedRanking = [...baseRanking].sort((a, b) => b.points - a.points);

    // Atualizar posições e determinar mudanças
    return sortedRanking.map((user, index) => {
        const oldRank = user.rank;
        const newRank = index + 1;

        let change: "up" | "down" | "same" = "same";
        if (oldRank < newRank) {
            change = "down"; // Caiu no ranking
        } else if (oldRank > newRank) {
            change = "up"; // Subiu no ranking
        }

        return {
            ...user,
            rank: newRank,
            change: user.isUser ? change : user.change // Mantém mudança fake para outros
        };
    });
}

// Calcular estatísticas do usuário para o ranking
export function calculateUserRankingStats(ranking: RankingEntry[]) {
    const user = ranking.find(u => u.isUser);

    if (!user) {
        return {
            position: "4º",
            points: "1250",
            variation: "-1"
        };
    }

    // Calcular variação baseada na mudança de posição
    let variation = "0";
    if (user.change === "up") {
        const oldRank = user.rank + 1; // Subiu 1 posição
        variation = `+${oldRank - user.rank}`;
    } else if (user.change === "down") {
        const oldRank = user.rank - 1; // Desceu 1 posição
        variation = `-${user.rank - oldRank}`;
    }

    return {
        position: `${user.rank}º`,
        points: user.points.toString(),
        variation
    };
}