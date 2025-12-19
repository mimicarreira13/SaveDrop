// Ficheiro: pages/Ranking/useRanking.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Trophy, Award, TrendingUp } from 'lucide-react';
import { weeklyChallenge } from './rankingData';
import { generateRanking, getUserStats } from './rankingLogic';
import { getUserTotalPoints } from '../../../utils/dataSync';

export function useRanking() {
    const [userPoints, setUserPoints] = useState(1250);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Mapeamento de ícones
    const iconMap = {
        Trophy,
        Award,
        TrendingUp
    };

    // Buscar pontos reais do usuário
    const refreshUserPoints = useCallback(() => {
        const points = getUserTotalPoints();
        setUserPoints(points);
        setLastUpdate(new Date());
    }, []);

    // Inicializar e atualizar periodicamente
    useEffect(() => {
        setIsLoading(true);
        refreshUserPoints();
        setIsLoading(false);

        // Atualizar a cada 3 segundos (sincronizado com recompensas)
        const interval = setInterval(() => {
            refreshUserPoints();
        }, 3000);

        return () => clearInterval(interval);
    }, [refreshUserPoints]);

    // Memoizar o ranking para evitar recálculos desnecessários
    const ranking = useMemo(() => {
        return generateRanking(userPoints);
    }, [userPoints]);

    // Processar estatísticas do usuário
    const userStatsData = useMemo(() => {
        const stats = getUserStats(userPoints);

        return [
            { label: "A Sua Posição", value: stats.position, icon: "Trophy", color: "text-blue-600" },
            { label: "Pontos", value: stats.points, icon: "Award", color: "text-green-600" },
            { label: "Variação", value: stats.variation, icon: "TrendingUp", color: "text-orange-600" }
        ].map((stat, index) => ({
            ...stat,
            Icon: iconMap[stat.icon as keyof typeof iconMap] || Trophy
        }));
    }, [userPoints]);

    // Função para participar no desafio
    const handleJoinChallenge = useCallback(() => {
        // Lógica para participar no desafio
        console.log('Participar no desafio');

        // Pode adicionar pontos extras ou outros incentivos
        alert('Desafio aceito! Complete as tarefas para ganhar pontos extras!');
    }, []);

    // Função para forçar atualização
    const refreshRanking = useCallback(() => {
        refreshUserPoints();
    }, [refreshUserPoints]);

    return {
        ranking,
        userStats: userStatsData,
        weeklyChallenge,
        isLoading,
        userPoints,
        lastUpdate,
        handleJoinChallenge,
        refreshRanking
    };
}