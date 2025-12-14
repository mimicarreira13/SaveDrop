import { Goal, HistoryItem, STORAGE_KEYS, createInitialGoals } from './metasData';

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

// Função para obter dados atuais do dashboard
export const getCurrentDashboardData = (): { waterSaved: number; daysStreak: number } => {
    try {
        const dashboardData = localStorage.getItem(STORAGE_KEYS.DASHBOARD);
        if (dashboardData) {
            const parsed = JSON.parse(dashboardData);
            return {
                waterSaved: parsed.waterSaved,
                daysStreak: parsed.daysStreak,
            };
        }
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }
    return { waterSaved: 1250, daysStreak: 12 };
};

// Funções de localStorage
export const loadGoalsFromStorage = (): Goal[] => {
    try {
        // 1. Tenta carregar metas personalizadas
        const savedGoals = localStorage.getItem(STORAGE_KEYS.USER_GOALS);
        if (savedGoals) {
            const goals = JSON.parse(savedGoals);
            if (Array.isArray(goals) && goals.length > 0) {
                // Atualiza metas padrão com dados atuais
                return updateGoalsWithCurrentData(goals);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar metas:', error);
    }

    // 2. Se não tem metas salvas, cria com dados atuais
    const currentData = getCurrentDashboardData();
    return createInitialGoals(currentData.waterSaved, currentData.daysStreak);
};

// Atualizar metas com dados atuais
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
        const savedHistory = localStorage.getItem(STORAGE_KEYS.GOALS_HISTORY);
        if (savedHistory) {
            const history = JSON.parse(savedHistory);
            if (Array.isArray(history) && history.length > 0) {
                return history;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
    return []; // Retorna array vazio se não houver histórico
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
    type: string
): Goal => {
    const iconMap: Record<string, string> = {
        'water_saving': 'Droplet',
        'shower_time': 'ShowerHead',
        'activity_streak': 'CheckCircle2'
    };

    // Obtém dados atuais para definir current inicial
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
        type: type as Goal['type']
    };
};

// Função para atualizar automaticamente metas com dados do dashboard
export const refreshGoalsWithDashboardData = (goals: Goal[]): Goal[] => {
    return updateGoalsWithCurrentData(goals);
};