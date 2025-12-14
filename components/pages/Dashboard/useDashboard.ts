// src/app/dashboard/useDashboard.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import {
    MOTIVATIONAL_MESSAGES,
    QUICK_TIPS,
    INITIAL_DASHBOARD_DATA,
    type DashboardData
} from './dashboardData';
import {
    loadDashboardFromStorage,
    saveDashboardToStorage,
    getRandomEquivalence,
    calculateStatsValues,
    updateStreak
} from './dashboardLogic';
import { initializeAppData } from '../../../utils/dataSync';

export const useDashboard = () => {
    // Estado do dashboard
    const [dashboardData, setDashboardData] = useState<DashboardData>(INITIAL_DASHBOARD_DATA);
    const [randomMessage, setRandomMessage] = useState('');
    const [randomEquivalence, setRandomEquivalence] = useState('');

    // Inicializar dashboard
    useEffect(() => {
        // INICIALIZA OS DADOS DA APP
        initializeAppData();

        const storedData = loadDashboardFromStorage();
        const updatedData: DashboardData = {
            ...INITIAL_DASHBOARD_DATA,
            ...storedData
        };
        setDashboardData(updatedData);

        // Mensagens aleatórias
        const msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
        const eq = getRandomEquivalence(updatedData.waterSaved);

        setRandomMessage(msg);
        setRandomEquivalence(eq);

        // Atualizar a cada 30 segundos
        const interval = setInterval(() => {
            const newMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
            const newEq = getRandomEquivalence(dashboardData.waterSaved);
            setRandomMessage(newMsg);
            setRandomEquivalence(newEq);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Atualizar água poupada
    const updateWaterSaved = useCallback((newWaterSaved: number) => {
        setDashboardData(prev => {
            const updated = { ...prev, waterSaved: newWaterSaved };
            saveDashboardToStorage(updated.waterSaved, updated.daysStreak);
            return updated;
        });
    }, []);

    // Atualizar streak
    const updateDashboardStreak = useCallback(() => {
        setDashboardData(prev => {
            const newStreak = updateStreak(prev.daysStreak);
            const updated = { ...prev, daysStreak: newStreak };
            saveDashboardToStorage(updated.waterSaved, updated.daysStreak);
            return updated;
        });
    }, []);

    return {
        // Dados
        dashboardData,
        randomMessage,
        randomEquivalence,

        // Funções utilitárias
        updateWaterSaved,
        updateDashboardStreak,

        // Constantes
        QUICK_TIPS
    };
};