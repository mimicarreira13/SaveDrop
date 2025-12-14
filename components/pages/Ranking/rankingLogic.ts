// Ficheiro: pages/Ranking/rankingLogic.ts

import { RankingUser, faceEmojis } from './rankingData';

// Função para obter emojis aleatórios
export function getRandomEmojis(arr: string[], n: number): string[] {
    const copy = [...arr];
    const result: string[] = [];
    for (let i = 0; i < n; i++) {
        const index = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(index, 1)[0]);
    }
    return result;
}

// Função para gerar ranking de usuários
export function generateRanking(
    randomNames: string[],
    randomEmojis: string[],
    userPoints: number = 1250
): RankingUser[] {
    return [
        { id: 1, name: randomNames[0], avatar: randomEmojis[0], points: 3450, saved: 3450, rank: 1, change: "up", color: "bg-yellow-500" },
        { id: 2, name: randomNames[1], avatar: randomEmojis[1], points: 2890, saved: 2890, rank: 2, change: "same", color: "bg-gray-400" },
        { id: 3, name: randomNames[2], avatar: randomEmojis[2], points: 2340, saved: 2340, rank: 3, change: "up", color: "bg-orange-600" },
        { id: 4, name: "Você", avatar: "💧", points: userPoints, saved: userPoints, rank: 4, change: "down", color: "bg-blue-500", isUser: true },
        { id: 5, name: randomNames[3], avatar: randomEmojis[3], points: 980, saved: 980, rank: 5, change: "up", color: "bg-green-500" },
    ];
}

// Função para calcular a posição do usuário
export function calculateUserPosition(users: RankingUser[]): number {
    const user = users.find(u => u.isUser);
    return user?.rank || 4;
}

// Função para obter estatísticas do usuário atual
export function getUserStats(
    users: RankingUser[],
    userPosition?: number
): { position: string; points: string; variation: string } {
    const user = users.find(u => u.isUser);
    const position = userPosition || calculateUserPosition(users);

    return {
        position: `${position}º`,
        points: user?.points.toString() || "1250",
        variation: user?.change === "down" ? "-1" : user?.change === "up" ? "+1" : "0"
    };
}

// Função para ordenar usuários por pontos
export function sortUsersByPoints(users: RankingUser[]): RankingUser[] {
    return [...users].sort((a, b) => b.points - a.points);
}

// Função para atualizar ranking com dados reais
export function updateRankingWithUserData(
    baseRanking: RankingUser[],
    userPoints: number,
    userSaved: number
): RankingUser[] {
    return baseRanking.map(user => {
        if (user.isUser) {
            return {
                ...user,
                points: userPoints,
                saved: userSaved,
                // Pode atualizar a posição aqui baseado nos pontos
            };
        }
        return user;
    });
}