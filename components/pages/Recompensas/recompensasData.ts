// Ficheiro: pages/Recompensas/recompensasData.ts

export interface Badge {
    id: number;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    date?: string;
    progress?: string;
}

export interface UserStats {
    level: number;
    points: number;
    nextLevelPoints: number;
    title: string;
    badgesCount: number;
    ranking: number;
}

export const badges: Badge[] = [
    {
        id: 1,
        name: "Primeira Gota",
        description: "Registaste a tua primeira atividade",
        icon: "💧",
        unlocked: true,
        date: "01/12/2025"
    },
    {
        id: 2,
        name: "Semana Completa",
        description: "7 dias seguidos de poupança",
        icon: "🌊",
        unlocked: true,
        date: "07/12/2025"
    },
    {
        id: 3,
        name: "Economizador",
        description: "1000L poupados",
        icon: "⭐",
        unlocked: true,
        date: "19/12/2025"
    },
    {
        id: 4,
        name: "Mestre da Água",
        description: "30 dias seguidos de poupança",
        icon: "🏆",
        unlocked: false,
        progress: "19/30 dias"
    },
    {
        id: 5,
        name: "Guardião do Planeta",
        description: "5000L poupados",
        icon: "🌍",
        unlocked: false,
        progress: "1250/5000L"
    },
    {
        id: 6,
        name: "Inspiração",
        description: "Convide 5 amigos",
        icon: "🎯",
        unlocked: false,
        progress: "0/5 amigos"
    }
];

export const userStats: UserStats = {
    level: 8,
    points: 1250,
    nextLevelPoints: 1500,
    title: "Eco Guerreiro",
    badgesCount: 3,
    ranking: 4
};

export const dailyBonus = {
    title: "Bônus Diário",
    description: "+50 pontos disponíveis hoje!",
    points: 50
};