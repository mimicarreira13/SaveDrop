// Ficheiro: pages/Ranking/useRanking.ts

import { useState, useEffect, useMemo } from 'react';
import { generateRandomName } from '../../../utils/generateRandomName';
import { faceEmojis, userStats, weeklyChallenge } from './rankingData';
import { getRandomEmojis, generateRanking, getUserStats } from './rankingLogic';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

export function useRanking() {
    const [rankingData, setRankingData] = useState<any[]>([]);
    const [currentUserPoints, setCurrentUserPoints] = useState(1250);
    const [isLoading, setIsLoading] = useState(true);

    // Mapeamento de ícones
    const iconMap = {
        Trophy,
        Medal,
        Award,
        TrendingUp
    };

    // Gerar dados iniciais
    useEffect(() => {
        setIsLoading(true);

        // Buscar pontos reais do usuário (do localStorage ou API)
        const savedPoints = localStorage.getItem('userPoints');
        if (savedPoints) {
            setCurrentUserPoints(parseInt(savedPoints, 10));
        }

        setIsLoading(false);
    }, []);

    // Memoizar o ranking para evitar recálculos desnecessários
    const ranking = useMemo(() => {
        const randomEmojis = getRandomEmojis(faceEmojis, 4);
        const randomNames = Array(4).fill(null).map(() => generateRandomName());

        return generateRanking(randomNames, randomEmojis, currentUserPoints);
    }, [currentUserPoints]);

    // Processar estatísticas do usuário
    const processedUserStats = useMemo(() => {
        const stats = getUserStats(ranking);

        return userStats.map((stat, index) => {
            const values = [stats.position, stats.points, stats.variation];
            return {
                ...stat,
                value: values[index],
                Icon: iconMap[stat.icon as keyof typeof iconMap] || Trophy
            };
        });
    }, [ranking]);

    // Função para participar no desafio
    const handleJoinChallenge = () => {
        // Lógica para participar no desafio
        console.log('Participar no desafio');
        // Pode atualizar pontos, etc.
    };

    return {
        ranking,
        userStats: processedUserStats,
        weeklyChallenge,
        isLoading,
        handleJoinChallenge
    };
}