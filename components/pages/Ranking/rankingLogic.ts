// Ficheiro: pages/Ranking/rankingLogic.ts

import { RankingUser, faceEmojis } from './rankingData';
import { getFullRanking, calculateUserRankingStats } from '../../../utils/dataSync';

// Gerar ranking com emojis aleatórios
export function generateRanking(userPoints: number): RankingUser[] {
    return getFullRanking(userPoints);
}

// Calcular estatísticas do usuário
export function getUserStats(userPoints: number) {
    const ranking = getFullRanking(userPoints);
    return calculateUserRankingStats(ranking);
}

// Atualizar ranking com novos pontos
export function updateRankingPoints(
    ranking: RankingUser[],
    userPoints: number
): RankingUser[] {
    // Atualizar pontos do usuário
    const updated = ranking.map(user => {
        if (user.isUser) {
            return { ...user, points: userPoints, saved: userPoints };
        }
        return user;
    });

    // Reordenar
    const sorted = [...updated].sort((a, b) => b.points - a.points);

    // Recalcular posições e mudanças
    return sorted.map((user, index) => {
        const oldRank = user.rank;
        const newRank = index + 1;

        let change = user.change;
        if (user.isUser) {
            if (oldRank < newRank) change = "down";
            else if (oldRank > newRank) change = "up";
            else change = "same";
        }

        return {
            ...user,
            rank: newRank,
            change
        };
    });
}

// Função para obter emojis aleatórios (para outros usuários)
export function getRandomEmojis(arr: string[], n: number): string[] {
    const copy = [...arr];
    const result: string[] = [];
    for (let i = 0; i < n; i++) {
        const index = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(index, 1)[0]);
    }
    return result;
}