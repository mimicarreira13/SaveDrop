// src/app/metas/metasLogic.ts
import { Goal, HistoryItem, STORAGE_KEYS, createInitialGoals, ACTIVITY_ICONS } from './metasData';
import { getCurrentDashboardData, getUpdatedHistory } from '../../../utils/dataSync';

// Funções de cálculo PURAS
export const calculateGoalProgress = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
};

export const formatProgressValue = (goal: Goal): string => {
    switch (goal.type) {
        case 'water_saving':
            return `${goal.current} / ${goal.target}L`;
        case 'shower_time':
        case 'activity_streak':
            return `${goal.current} / ${goal.target} dias`;
        default:
            return `${goal.current} / ${goal.target}`;
    }
};

export const getHistorySubtitle = (item: HistoryItem, index: number): string => {
    const subtitles = [
        `${item.saved}L poupados`,
        `${Math.round(item.saved / 40)} atividades registadas`
    ];
    return subtitles[index % subtitles.length];
};

// Funções de localStorage (sincronizadas com dashboard)
export const loadGoalsFromStorage = (): Goal[] => {
    try {
        // 1. Tenta carregar metas personalizadas
        const savedGoals = localStorage.getItem(STORAGE_KEYS.USER_GOALS);
        if (savedGoals) {
            const goals = JSON.parse(savedGoals);
            if (Array.isArray(goals) && goals.length > 0) {
                // Atualiza metas com dados atuais DO DASHBOARD
                return updateGoalsWithCurrentData(goals);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar metas:', error);
    }

    // 2. Se não tem metas salvas, cria com dados atuais DO DASHBOARD
    return createInitialGoals();
};

// Atualizar metas com dados atuais DO DASHBOARD
export const updateGoalsWithCurrentData = (goals: Goal[]): Goal[] => {
    const currentData = getCurrentDashboardData();

    return goals.map(goal => {
        let newCurrent = goal.current;
        let newStatus = goal.status;

        switch (goal.type) {
            case 'water_saving':
                newCurrent = currentData.waterSaved;
                newStatus = currentData.waterSaved >= goal.target ? 'completed' : 'active';
                break;
            case 'shower_time':
            case 'activity_streak':
                newCurrent = Math.min(currentData.daysStreak, goal.target);
                newStatus = currentData.daysStreak >= goal.target ? 'completed' : 'active';
                break;
        }

        return {
            ...goal,
            current: newCurrent,
            status: newStatus
        };
    });
};

export const saveGoalsToStorage = (goals: Goal[]) => {
    try {
        localStorage.setItem(STORAGE_KEYS.USER_GOALS, JSON.stringify(goals));
    } catch (error) {
        console.error('Erro ao guardar metas:', error);
    }
};

export const loadHistoryFromStorage = (): HistoryItem[] => {
    try {
        // Usa a função do dataSync para pegar histórico ATUALIZADO
        return getUpdatedHistory();
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }

    // Fallback com dados do dashboard
    const dashboardData = getCurrentDashboardData();
    return [
        { month: "Dezembro", saved: dashboardData.waterSaved, status: "current" },
        { month: "Novembro", saved: 1250, status: "completed" },
        { month: "Outubro", saved: 2150, status: "completed" },
        { month: "Setembro", saved: 1890, status: "completed" },
    ];
};

export const saveHistoryToStorage = (history: HistoryItem[]) => {
    try {
        localStorage.setItem(STORAGE_KEYS.GOALS_HISTORY, JSON.stringify(history));
    } catch (error) {
        console.error('Erro ao guardar histórico:', error);
    }
};

// Função para atualizar uma meta
export const updateGoalProgress = (
    goals: Goal[],
    goalId: number,
    newCurrent: number
): Goal[] => {
    return goals.map(goal =>
        goal.id === goalId
            ? { ...goal, current: newCurrent, status: newCurrent >= goal.target ? 'completed' : 'active' }
            : goal
    );
};

// Função para adicionar nova meta
export const createNewGoal = (
    title: string,
    target: number,
    type: string,
    activityType?: string
): Goal => {
    const iconMap: Record<string, string> = {
        'water_saving': 'Droplet',
        'shower_time': 'ShowerHead',
        'activity_streak': 'CheckCircle2'
    };

    // Se for uma atividade específica, usar ícone da atividade
    if (activityType && ACTIVITY_ICONS[activityType as keyof typeof ACTIVITY_ICONS]) {
        iconMap[type] = ACTIVITY_ICONS[activityType as keyof typeof ACTIVITY_ICONS];
    }

    // Obtém dados atuais DO DASHBOARD
    const currentData = getCurrentDashboardData();
    let initialCurrent = 0;

    if (type === 'water_saving') {
        initialCurrent = currentData.waterSaved;
    } else if (type === 'activity_streak') {
        initialCurrent = Math.min(currentData.daysStreak, target);
    }

    return {
        id: Date.now(),
        title,
        current: initialCurrent,
        target,
        status: initialCurrent >= target ? 'completed' : 'active',
        icon: iconMap[type] || 'Target',
        type: type as Goal['type'],
        activityType: activityType || undefined
    };
};

// Função para atualizar automaticamente metas com dados do dashboard
export const refreshGoalsWithDashboardData = (goals: Goal[]): Goal[] => {
    return updateGoalsWithCurrentData(goals);
};