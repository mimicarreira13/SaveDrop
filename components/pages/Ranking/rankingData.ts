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
    icon: any;
    color: string;
}

export interface Challenge {
    title: string;
    description: string;
    buttonText: string;
}

export const faceEmojis = ["😀", "😇", "😎", "😊", "🥰", "🤓", "🤠", "😋", "🤗", "🙃"];

// Desafio semanal
export const weeklyChallenge: Challenge = {
    title: "Desafio da Semana",
    description: "Reduzir tempo de duche em 2 minutos durante 5 dias",
    buttonText: "Participar"
};