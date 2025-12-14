// Ficheiro: pages/Recompensas/recompensasLogic.ts

import { UserStats } from './recompensasData';
import { getCurrentDashboardData } from '../../../utils/dataSync';

// Chaves para localStorage
const BONUS_POINTS_KEY = 'recompensas_bonus_points';
const LAST_CLAIM_KEY = 'recompensas_last_claim';

// Buscar litros poupados do dashboard
export function getLitrosPoupados(): number {
    try {
        const dashboardData = getCurrentDashboardData();
        return dashboardData.waterSaved;
    } catch (error) {
        console.error('Erro ao obter litros poupados:', error);
        return 1250; // valor base
    }
}

// Buscar pontos bónus do localStorage
export function getBonusPoints(): number {
    try {
        const points = localStorage.getItem(BONUS_POINTS_KEY);
        return points ? parseInt(points, 10) : 0;
    } catch (error) {
        console.error('Erro ao obter pontos bónus:', error);
        return 0;
    }
}

// Salvar pontos bónus
export function saveBonusPoints(points: number): void {
    try {
        localStorage.setItem(BONUS_POINTS_KEY, points.toString());
    } catch (error) {
        console.error('Erro ao salvar pontos bónus:', error);
    }
}

// Calcular pontos totais = Litros poupados + Pontos bónus
export function calculateTotalPoints(litrosPoupados: number, bonusPoints: number): number {
    // 1 litro = 1 ponto
    return litrosPoupados + bonusPoints;
}

// Verificar se bónus já foi resgatado hoje
export function hasClaimedBonusToday(): boolean {
    try {
        const today = new Date().toDateString();
        const lastClaim = localStorage.getItem(LAST_CLAIM_KEY);
        return lastClaim === today;
    } catch (error) {
        console.error('Erro ao verificar bónus:', error);
        return false;
    }
}

// Resgatar bónus diário
export function claimDailyBonus(currentBonusPoints: number): { newBonusPoints: number; success: boolean } {
    if (hasClaimedBonusToday()) {
        return { newBonusPoints: currentBonusPoints, success: false };
    }

    const newBonusPoints = currentBonusPoints + 50;

    // Marcar como resgatado hoje
    const today = new Date().toDateString();
    localStorage.setItem(LAST_CLAIM_KEY, today);

    return { newBonusPoints, success: true };
}

// Calcular stats completos com dados reais
export function calculateUserStats(
    baseStats: Omit<UserStats, 'points' | 'litrosPoupados' | 'bonusPoints'>
): UserStats {
    const litrosPoupados = getLitrosPoupados();
    const bonusPoints = getBonusPoints();
    const totalPoints = calculateTotalPoints(litrosPoupados, bonusPoints);

    return {
        ...baseStats,
        points: totalPoints,
        litrosPoupados,
        bonusPoints
    };
}

export function calculateLevelProgress(stats: UserStats): number {
    return (stats.points / stats.nextLevelPoints) * 100;
}

export function getUnlockedBadgesCount(badges: Array<{ unlocked: boolean }>): number {
    return badges.filter(badge => badge.unlocked).length;
}

export function calculatePointsToNextLevel(stats: UserStats): number {
    return stats.nextLevelPoints - stats.points;
}