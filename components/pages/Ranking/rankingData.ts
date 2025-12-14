// Ficheiro: pages/Ranking/rankingData.ts

export interface RankingUser {
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

export interface StatCard {
    label: string;
    value: string;
    icon: any; // Componente de ícone
    color: string;
}

export interface Challenge {
    title: string;
    description: string;
    buttonText: string;
}

export const faceEmojis = ["😀", "😇", "😎", "😊", "🥰", "🤓", "🤠", "😋", "🤗", "🙃"];

// Dados para os cards de estatísticas
export const userStats: StatCard[] = [
    { label: "A Sua Posição", value: "4º", icon: "Trophy", color: "text-blue-600" },
    { label: "Pontos", value: "1250", icon: "Award", color: "text-green-600" },
    { label: "Variação", value: "-1", icon: "TrendingUp", color: "text-orange-600" }
];

// Desafio semanal
export const weeklyChallenge: Challenge = {
    title: "Desafio da Semana",
    description: "Reduzir tempo de duche em 2 minutos durante 5 dias",
    buttonText: "Participar"
};