// Constantes para cálculos
export const LITERS_PER_BOTTLE = 1.5;
export const LITERS_PER_SHORT_SHOWER = 50;
export const LITERS_PER_HANDWASH = 2;

// Dados estáticos
export const MOTIVATIONAL_MESSAGES = [
    "Excelente trabalho! Continua assim! 💧",
    "Estás a fazer a diferença! 🌍",
    "Cada gota conta para o planeta! 🌱",
    "Parabéns pela poupança! 🎉"
];

export const QUICK_TIPS = [
    "💡 Desligue a torneira ao escovar os dentes",
    "🚿 Reduza o tempo do banho em 2 minutos",
    "🌱 Reutilize água da máquina de lavar"
];

// Interface para estatísticas
export interface DashboardStat {
    label: string;
    value: string;
    icon: React.ReactNode;
    bgColor: string;
    iconBg: string;
}

// Interface para dados do dashboard
export interface DashboardData {
    waterSaved: number;
    goalWater: number;
    daysStreak: number;
}

// Dados iniciais do dashboard
export const INITIAL_DASHBOARD_DATA: DashboardData = {
    waterSaved: 1250,
    goalWater: 2000,
    daysStreak: 12
};