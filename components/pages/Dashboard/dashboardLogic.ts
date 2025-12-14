import { LITERS_PER_BOTTLE, LITERS_PER_SHORT_SHOWER, LITERS_PER_HANDWASH } from './dashboardData';

// Funções de cálculo PURAS (sem JSX, sem React)
export const calculateEquivalents = (waterSaved: number) => ({
    bottles: Math.floor(waterSaved / LITERS_PER_BOTTLE),
    showers: Math.floor(waterSaved / LITERS_PER_SHORT_SHOWER),
    handwashes: Math.floor(waterSaved / LITERS_PER_HANDWASH)
});

export const getRandomEquivalence = (waterSaved: number) => {
    const equivalents = calculateEquivalents(waterSaved);
    const messages = [
        `Equivalente a ${equivalents.showers} duches mais curtos 🚿`,
        `Equivalente a ${equivalents.bottles} garrafas de água 💧`,
        `Água suficiente para lavar as mãos ${equivalents.handwashes} vezes 🧼`,
        "Baseado nos teus registos diários 💙",
        "Estimativa calculada a partir das tuas atividades"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
};

// Função para calcular dados das estatísticas (apenas valores)
export const calculateStatsValues = (
    waterSaved: number,
    goalWater: number,
    daysStreak: number
) => {
    const progressPercentage = Math.round((waterSaved / goalWater) * 100);

    return [
        {
            label: "Progresso",
            value: `${progressPercentage}%`
        },
        {
            label: "Sequência",
            value: `${daysStreak} dias`
        }
    ];
};

// Funções de localStorage
export const loadDashboardFromStorage = (): { waterSaved: number; daysStreak: number } => {
    try {
        const savedWater = localStorage.getItem('dashboard_waterSaved');
        const savedStreak = localStorage.getItem('dashboard_daysStreak');

        return {
            waterSaved: savedWater ? Number(savedWater) : 1250,
            daysStreak: savedStreak ? Number(savedStreak) : 12
        };
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        return { waterSaved: 1250, daysStreak: 12 };
    }
};

export const saveDashboardToStorage = (waterSaved: number, daysStreak: number) => {
    try {
        localStorage.setItem('dashboard_waterSaved', waterSaved.toString());
        localStorage.setItem('dashboard_daysStreak', daysStreak.toString());
    } catch (error) {
        console.error('Erro ao guardar dashboard:', error);
    }
};

// Função para atualizar streak
export const updateStreak = (currentStreak: number): number => {
    const lastActivity = localStorage.getItem('last_activity_date');
    const today = new Date().toDateString();

    if (lastActivity === today) {
        return currentStreak; // Já atualizou hoje
    }

    if (lastActivity) {
        const lastDate = new Date(lastActivity);
        const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutivo
            return currentStreak + 1;
        } else if (diffDays > 1) {
            // Quebrou a sequência
            return 1;
        }
    }

    localStorage.setItem('last_activity_date', today);
    return currentStreak;
};