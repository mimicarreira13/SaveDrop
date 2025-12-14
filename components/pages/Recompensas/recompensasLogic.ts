// Ficheiro: pages/Recompensas/recompensasLogic.ts

import { UserStats } from './recompensasData';

export function calculateLevelProgress(stats: UserStats): number {
    return (stats.points / stats.nextLevelPoints) * 100;
}

export function getUnlockedBadgesCount(badges: Array<{ unlocked: boolean }>): number {
    return badges.filter(badge => badge.unlocked).length;
}

export function getNextBadge(badges: Array<{ unlocked: boolean; name: string }>): string | null {
    const nextBadge = badges.find(badge => !badge.unlocked);
    return nextBadge ? nextBadge.name : null;
}

export function calculatePointsToNextLevel(stats: UserStats): number {
    return stats.nextLevelPoints - stats.points;
}

export function claimDailyBonus(currentPoints: number, bonusPoints: number): number {
    // Aqui normalmente terias lógica para validar se o bônus já foi resgatado hoje
    return currentPoints + bonusPoints;
}