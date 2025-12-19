// src/app/metas/useMetas.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { Goal, HistoryItem, createInitialGoals } from './metasData';
import {
    loadGoalsFromStorage,
    saveGoalsToStorage,
    loadHistoryFromStorage,
    saveHistoryToStorage,
    updateGoalProgress,
    createNewGoal,
    getHistorySubtitle,
    refreshGoalsWithDashboardData,
    formatProgressValue
} from './metasLogic';
import { initializeAppData } from '../../../utils/dataSync';

export const useMetas = () => {
    // Estado
    const [goals, setGoals] = useState<Goal[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [expandedGoalId, setExpandedGoalId] = useState<number | null>(null);
    const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
    const [subtitleIndex, setSubtitleIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Carregar dados iniciais
    useEffect(() => {
        const loadInitialData = () => {
            setIsLoading(true);

            // INICIALIZA OS DADOS DA APP (garante que dashboard existe)
            initializeAppData();

            const savedGoals = loadGoalsFromStorage();
            const savedHistory = loadHistoryFromStorage();

            if (savedGoals.length > 0) {
                setGoals(savedGoals);
            } else {
                // Cria metas iniciais com dados atuais DO DASHBOARD
                const initialGoals = createInitialGoals();
                setGoals(initialGoals);
                saveGoalsToStorage(initialGoals);
            }

            if (savedHistory.length > 0) {
                setHistory(savedHistory);
            } else {
                // Se não há histórico, carrega o padrão atualizado
                const initialHistory = loadHistoryFromStorage();
                setHistory(initialHistory);
            }

            setIsLoading(false);
        };

        loadInitialData();
    }, []);

    // Atualizar metas quando os dados do dashboard mudam
    useEffect(() => {
        const updateGoalsInterval = setInterval(() => {
            setGoals(prev => {
                const updated = refreshGoalsWithDashboardData(prev);
                // Só guarda se houve mudanças
                if (JSON.stringify(updated) !== JSON.stringify(prev)) {
                    saveGoalsToStorage(updated);
                }
                return updated;
            });

            // Também atualiza o histórico
            setHistory(loadHistoryFromStorage());
        }, 10000); // Atualiza a cada 10 segundos

        return () => clearInterval(updateGoalsInterval);
    }, []);

    // Efeito para alternar subtítulos
    useEffect(() => {
        const interval = setInterval(() => {
            setSubtitleIndex(prev => (prev === 0 ? 1 : 0));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Funções para manipular metas
    const toggleGoalExpansion = useCallback((goalId: number) => {
        setExpandedGoalId(prev => prev === goalId ? null : goalId);
    }, []);

    const handleUpdateGoal = useCallback((goalId: number, newCurrent: number) => {
        setGoals(prev => {
            const updatedGoals = updateGoalProgress(prev, goalId, newCurrent);
            saveGoalsToStorage(updatedGoals);
            return updatedGoals;
        });
    }, []);

    const handleAddGoal = useCallback((title: string, target: number, type: string, activityType?: string) => {
        const newGoal = createNewGoal(title, target, type, activityType);
        setGoals(prev => {
            const updatedGoals = [...prev, newGoal];
            saveGoalsToStorage(updatedGoals);
            return updatedGoals;
        });
        setShowAddGoalDialog(false);
    }, []);

    const handleDeleteGoal = useCallback((goalId: number) => {
        setGoals(prev => {
            const updatedGoals = prev.filter(goal => goal.id !== goalId);
            saveGoalsToStorage(updatedGoals);
            return updatedGoals;
        });
    }, []);

    const getCurrentSubtitle = useCallback((item: HistoryItem) => {
        return getHistorySubtitle(item, subtitleIndex);
    }, [subtitleIndex]);

    // Função para formatar valor de progresso
    const getFormattedProgress = useCallback((goal: Goal): string => {
        return formatProgressValue(goal);
    }, []);

    // Atualizar metas com dados mais recentes
    const refreshGoals = useCallback(() => {
        setGoals(prev => {
            const updated = refreshGoalsWithDashboardData(prev);
            saveGoalsToStorage(updated);
            return updated;
        });
        // Atualiza o histórico também
        setHistory(loadHistoryFromStorage());
    }, []);

    return {
        // Estado
        goals,
        history,
        expandedGoalId,
        showAddGoalDialog,
        subtitleIndex,
        isLoading,

        // Funções
        toggleGoalExpansion,
        handleUpdateGoal,
        handleAddGoal,
        handleDeleteGoal,
        getCurrentSubtitle,
        getFormattedProgress,
        refreshGoals,
        setShowAddGoalDialog
    };
};