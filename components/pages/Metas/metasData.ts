export interface Goal {
    id: number;
    title: string;
    current: number;
    target: number;
    status: 'active' | 'completed';
    icon: string;
    type: 'water_saving' | 'shower_time' | 'activity_streak';
}

export interface HistoryItem {
    month: string;
    saved: number;
    status: 'current' | 'completed';
}

export interface MetasState {
    goals: Goal[];
    history: HistoryItem[];
    expandedGoalId: number | null;
    showAddGoalDialog: boolean;
}

// Função para criar metas INICIAIS com valores dinâmicos
export const createInitialGoals = (
    waterSaved: number = 1250,
    daysStreak: number = 6
): Goal[] => [
    {
        id: 1,
        title: "Poupar 2000L este mês",
        current: waterSaved,
        target: 2000,
        status: waterSaved >= 2000 ? 'completed' : 'active',
        icon: "Droplet",
        type: 'water_saving'
    },
    {
        id: 2,
        title: "Duches até 5 minutos (10 dias)",
        current: daysStreak,
        target: 10,
        status: daysStreak >= 10 ? 'completed' : 'active',
        icon: "ShowerHead",
        type: 'shower_time'
    },
    {
        id: 3,
        title: "Registar atividades 10 dias seguidos",
        current: 10,
        target: 10,
        status: daysStreak >= 10 ? 'completed' : 'active',
        icon: "CheckCircle2",
        type: 'activity_streak'
    }
];

// Dados iniciais do histórico
export const INITIAL_HISTORY: HistoryItem[] = [
    { month: "Dezembro", saved: 1300, status: "current" },
    { month: "Novembro", saved: 1250, status: "completed" },
    { month: "Outubro", saved: 2150, status: "completed" },
    { month: "Setembro", saved: 1890, status: "completed" },
];

// Constantes
export const GOAL_TYPES = {
    WATER_SAVING: 'water_saving',
    SHOWER_TIME: 'shower_time',
    ACTIVITY_STREAK: 'activity_streak'
} as const;

// Chaves para localStorage
export const STORAGE_KEYS = {
    USER_GOALS: 'savedrop_user_goals',
    GOALS_HISTORY: 'savedrop_goals_history',
    DASHBOARD: 'savedrop_dashboard' // Para aceder aos dados do dashboard
};