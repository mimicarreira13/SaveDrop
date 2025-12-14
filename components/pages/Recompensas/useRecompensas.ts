// Ficheiro: pages/Recompensas/useRecompensas.ts

import { useState, useEffect } from 'react';
import { badges, userStats, dailyBonus } from './recompensasData';
import { calculateLevelProgress, claimDailyBonus } from './recompensasLogic';

export function useRecompensas() {
    const [badgesData, setBadgesData] = useState(badges);
    const [stats, setStats] = useState(userStats);
    const [isDailyBonusClaimed, setIsDailyBonusClaimed] = useState(false);
    const [levelProgress, setLevelProgress] = useState(0);

    // Calcular progresso do nível
    useEffect(() => {
        const progress = calculateLevelProgress(stats);
        setLevelProgress(progress);
    }, [stats]);

    // Função para resgatar bônus diário
    const handleClaimBonus = () => {
        if (!isDailyBonusClaimed) {
            const newPoints = claimDailyBonus(stats.points, dailyBonus.points);
            setStats(prev => ({
                ...prev,
                points: newPoints
            }));
            setIsDailyBonusClaimed(true);
            // Aqui normalmente faria uma chamada API para atualizar no backend
        }
    };

    // Função para desbloquear um badge (exemplo)
    const unlockBadge = (badgeId: number) => {
        setBadgesData(prev =>
            prev.map(badge =>
                badge.id === badgeId ? { ...badge, unlocked: true } : badge
            )
        );
    };

    return {
        badges: badgesData,
        stats,
        dailyBonus,
        levelProgress,
        isDailyBonusClaimed,
        handleClaimBonus,
        unlockBadge
    };
}