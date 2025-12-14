// src/app/metas/metasData.ts
import { getCurrentDashboardData, getUpdatedHistory } from '../../../utils/dataSync';

export interface Goal {
    id: number;
    title: string;
    current: number;
    target: number;
    status: 'active' | 'completed';
    icon: string;
    type: 'water_saving' | 'shower_time' | 'activity_streak';
    activityType?: string;
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

// Configuração para atividades disponíveis
export const ACTIVITY_TYPES = {
    SHOWER: 'shower',
    TEETH_BRUSHING: 'teeth_brushing',
    DISH_WASHING: 'dish_washing',
    LAUNDRY: 'laundry',
    GARDEN_WATERING: 'garden_watering'
} as const;

export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];

// Mapeamento de atividades para labels
export const ACTIVITY_LABELS: Record<ActivityType, string> = {
    [ACTIVITY_TYPES.SHOWER]: 'Duche',
    [ACTIVITY_TYPES.TEETH_BRUSHING]: 'Escovar os Dentes',
    [ACTIVITY_TYPES.DISH_WASHING]: 'Lavar a Louça',
    [ACTIVITY_TYPES.LAUNDRY]: 'Lavar Roupa',
    [ACTIVITY_TYPES.GARDEN_WATERING]: 'Regar Jardim'
};

// Mapeamento de atividades para ícones
export const ACTIVITY_ICONS: Record<ActivityType, string> = {
    [ACTIVITY_TYPES.SHOWER]: 'ShowerHead',
    [ACTIVITY_TYPES.TEETH_BRUSHING]: 'Tooth',
    [ACTIVITY_TYPES.DISH_WASHING]: 'Droplets',
    [ACTIVITY_TYPES.LAUNDRY]: 'Shirt',
    [ACTIVITY_TYPES.GARDEN_WATERING]: 'Sprout'
};

// Função para criar metas INICIAIS com valores DINÂMICOS do dashboard
export const createInitialGoals = (): Goal[] => {
    const dashboardData = getCurrentDashboardData();
    const { waterSaved, daysStreak } = dashboardData;

    return [
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
            current: Math.min(daysStreak, 10),
            target: 10,
            status: daysStreak >= 10 ? 'completed' : 'active',
            icon: "CheckCircle2",
            type: 'activity_streak'
        }
    ];
};

// Função para obter histórico ATUALIZADO
export const getInitialHistory = (): HistoryItem[] => {
    return getUpdatedHistory();
};

// Dados iniciais do histórico (mantido para compatibilidade)
export const INITIAL_HISTORY: HistoryItem[] = [
    { month: "Dezembro", saved: 1250, status: "current" },
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
    DASHBOARD: 'savedrop_dashboard'
};