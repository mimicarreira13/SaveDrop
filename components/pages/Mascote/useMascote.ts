// Ficheiro: pages/Mascote/useMascote.ts

import { useState, useEffect, useCallback } from 'react';
import { MascotMood, MASCOT_STATES, MASCOT_IMAGES, INTERACTION_TIPS, INITIAL_STATS } from './mascoteData';
import {
    determineMood,
    getWaterSaved,
    getDaysActive,
    getBadgesCount,
    getMotivationalMessage,
    calculateNextMoodProgress
} from './mascoteLogic';

export function useMascote() {
    const [currentMood, setCurrentMood] = useState<MascotMood>('worried');
    const [waterSaved, setWaterSaved] = useState(1250);
    const [stats, setStats] = useState(INITIAL_STATS);
    const [motivationalMessage, setMotivationalMessage] = useState('');
    const [nextMoodProgress, setNextMoodProgress] = useState({
        nextMood: 'happy' as MascotMood,
        progress: 0,
        remaining: 0
    });

    // Obter estado atual da mascote
    const mascotState = MASCOT_STATES[currentMood];
    const mascotImage = MASCOT_IMAGES[currentMood];

    // Atualizar dados da mascote
    const updateMascoteData = useCallback(() => {
        const savedWater = getWaterSaved();
        const mood = determineMood(savedWater);
        const daysActive = getDaysActive();
        const badgesCount = getBadgesCount();

        setWaterSaved(savedWater);
        setCurrentMood(mood);
        setStats({
            daysActive,
            badgesCount
        });

        setMotivationalMessage(getMotivationalMessage(mood, savedWater));

        const progress = calculateNextMoodProgress(savedWater);
        setNextMoodProgress(progress);
    }, []);

    // Inicializar e atualizar periodicamente
    useEffect(() => {
        updateMascoteData();

        // Atualizar a cada 5 segundos (sincronizado com dashboard)
        const interval = setInterval(updateMascoteData, 5000);

        return () => clearInterval(interval);
    }, [updateMascoteData]);

    // Função para forçar atualização
    const refreshMascote = useCallback(() => {
        updateMascoteData();
    }, [updateMascoteData]);

    return {
        // Estado
        currentMood,
        mascotState,
        mascotImage,
        waterSaved,
        stats,
        motivationalMessage,
        nextMoodProgress,

        // Dados estáticos
        interactionTips: INTERACTION_TIPS,

        // Funções
        refreshMascote,
        updateMascoteData
    };
}