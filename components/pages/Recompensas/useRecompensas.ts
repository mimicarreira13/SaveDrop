// Ficheiro: pages/Recompensas/useRecompensas.ts

import { useState, useEffect, useCallback } from 'react';
import { badges, getBaseUserStats, dailyBonus } from './recompensasData';
import {
    calculateLevelProgress,
    getUnlockedBadgesCount,
    calculateUserStats,
    claimDailyBonus,
    saveBonusPoints,
    hasClaimedBonusToday
} from './recompensasLogic';

export function useRecompensas() {
    const [badgesData] = useState(badges); // Estático
    const [stats, setStats] = useState(() => calculateUserStats(getBaseUserStats()));
    const [levelProgress, setLevelProgress] = useState(0);
    const [isDailyBonusClaimed, setIsDailyBonusClaimed] = useState(false);

    // Atualizar stats sempre que os dados mudarem
    const refreshStats = useCallback(() => {
        const newStats = calculateUserStats(getBaseUserStats());
        setStats(newStats);

        const progress = calculateLevelProgress(newStats);
        setLevelProgress(progress);
    }, []);

    // Inicializar e verificar bónus
    useEffect(() => {
        refreshStats();
        setIsDailyBonusClaimed(hasClaimedBonusToday());

        // Atualizar a cada 5 segundos (para sincronizar com dashboard)
        const interval = setInterval(refreshStats, 5000);
        return () => clearInterval(interval);
    }, [refreshStats]);

    // Função para resgatar bónus diário
    const handleClaimBonus = useCallback(() => {
        if (!isDailyBonusClaimed) {
            const result = claimDailyBonus(stats.bonusPoints);

            if (result.success) {
                // Atualizar bónus no localStorage
                saveBonusPoints(result.newBonusPoints);

                // Atualizar stats
                const newStats = calculateUserStats(getBaseUserStats());
                setStats(newStats);

                // Recalcular progresso
                const progress = calculateLevelProgress(newStats);
                setLevelProgress(progress);

                setIsDailyBonusClaimed(true);
            }
        }
    }, [stats.bonusPoints, isDailyBonusClaimed]);

    // Função para atualizar manualmente (opcional)
    const refreshData = useCallback(() => {
        refreshStats();
        setIsDailyBonusClaimed(hasClaimedBonusToday());
    }, [refreshStats]);

    return {
        badges: badgesData,
        stats,
        dailyBonus,
        levelProgress,
        isDailyBonusClaimed,
        handleClaimBonus,
        refreshData
    };
}