'use client';
import { useState, useEffect, useCallback } from 'react';
import {
    Activity,
    ActivityLog,
    UserBaselines,
    ACTIVITIES,
    INITIAL_ACTIVITY_LOG,
    getUniqueCategories
} from './atividadesData';
import {
    calculateSavings,
    getUnitLabel,
    formatTimeAgo,
    loadActivityLogFromStorage,
    saveActivityLogToStorage,
    updateDashboardFromLogs,
    hasBaseline
} from './consumoLogic';
import { getBaselineForActivity as getPredictedBaseline } from './baselinePrediction';

interface AdicionarConsumoState {
    selectedActivity: Activity | null;
    amount: number;
    activityLog: ActivityLog[];
    expandedCategories: string[];
    showSuccess: boolean;
    successMessage: string;
    showConfirmDialog: boolean;
    pendingSave: boolean;
}

export const useAdicionarConsumo = (userBaselines?: {
    duche: number;
    dentes: number;
    loica: number
} | null | undefined, onSave?: () => void) => {
    const [state, setState] = useState<AdicionarConsumoState>({
        selectedActivity: null,
        amount: 1,
        activityLog: INITIAL_ACTIVITY_LOG,
        expandedCategories: ['Higiene pessoal'],
        showSuccess: false,
        successMessage: '',
        showConfirmDialog: false,
        pendingSave: false
    });

    // Carregar logs do localStorage
    useEffect(() => {
        const savedLogs = loadActivityLogFromStorage();
        if (savedLogs.length > 0) {
            setState(prev => ({ ...prev, activityLog: savedLogs }));
        }
    }, []);

    // Funções para manipular o estado
    const handleActivityClick = useCallback((activity: Activity) => {
        setState(prev => ({
            ...prev,
            selectedActivity: activity,
            amount: 1
        }));
    }, []);

    const handleSaveActivity = useCallback(() => {
        if (!state.selectedActivity) return;

        const now = new Date().toISOString();
        const liters = state.amount * state.selectedActivity.avgLitersPerUnit;
        const savedLiters = hasBaseline(state.selectedActivity.id)
            ? calculateSavings(state.selectedActivity.id, state.amount, state.selectedActivity.avgLitersPerUnit, userBaselines)
            : 0;

        const newLog: ActivityLog = {
            id: Date.now().toString(),
            activityId: state.selectedActivity.id,
            activityName: state.selectedActivity.name,
            icon: state.selectedActivity.icon,
            amount: state.amount,
            liters,
            savedLiters, // Pode ser positivo ou negativo
            timestamp: now
        };

        // Atualizar logs
        const updatedLogs = [newLog, ...state.activityLog];
        setState(prev => ({ ...prev, activityLog: updatedLogs }));
        saveActivityLogToStorage(updatedLogs);
        updateDashboardFromLogs(updatedLogs);

        // Mensagem personalizada baseada na poupança
        let message = `✅ ${state.selectedActivity.name} registado com sucesso!`;
        if (savedLiters > 0) {
            message += ` Poupaste ${savedLiters}L de água!`;
        } else if (savedLiters < 0) {
            const absoluteValue = Math.abs(savedLiters);
            message += ` Atenção! Consumiste ${absoluteValue}L a mais que o habitual.`;
        } else {
            message += ` Consumo registado.`;
        }

        setState(prev => ({
            ...prev,
            showSuccess: true,
            successMessage: message,
            selectedActivity: null,
            amount: 1,
            pendingSave: true
        }));

        // Esconder mensagem após 3 segundos
        setTimeout(() => {
            setState(prev => ({
                ...prev,
                showSuccess: false,
                pendingSave: false
            }));
            if (onSave && state.pendingSave) {
                onSave();
            }
        }, 3000);

    }, [state.selectedActivity, state.amount, state.activityLog, userBaselines, onSave]);

    const toggleCategory = useCallback((category: string) => {
        setState(prev => ({
            ...prev,
            expandedCategories: prev.expandedCategories.includes(category)
                ? prev.expandedCategories.filter(c => c !== category)
                : [...prev.expandedCategories, category]
        }));
    }, []);

    const handleCancel = useCallback((onCancel?: () => void) => {
        if (state.selectedActivity || state.amount > 1) {
            setState(prev => ({ ...prev, showConfirmDialog: true }));
        } else if (onCancel) {
            onCancel();
        }
    }, [state.selectedActivity, state.amount]);

    const confirmCancel = useCallback((onCancel?: () => void) => {
        setState(prev => ({ ...prev, showConfirmDialog: false }));
        if (onCancel) onCancel();
    }, []);

    const setAmount = useCallback((newAmount: number) => {
        setState(prev => ({ ...prev, amount: Math.max(1, newAmount) }));
    }, []);

    const setIsDialogOpen = useCallback((isOpen: boolean) => {
        if (!isOpen) {
            setState(prev => ({ ...prev, selectedActivity: null, amount: 1 }));
        }
    }, []);

    // Dados derivados
    const categories = getUniqueCategories();

    // Encontrar atividade por ID
    const getActivityById = useCallback((id: string) => {
        return ACTIVITIES.find(a => a.id === id);
    }, []);

    // Obter baseline para atividade (agora com baselines preditas)
    const getBaselineForActivity = useCallback((activityId: string): number | null => {
        return getPredictedBaseline(activityId, userBaselines);
    }, [userBaselines]);

    return {
        // Estado
        state,

        // Dados
        ACTIVITIES,
        categories,

        // Funções para manipular estado
        handleActivityClick,
        handleSaveActivity,
        toggleCategory,
        handleCancel,
        confirmCancel,
        setAmount,
        setIsDialogOpen,

        // Funções utilitárias
        getUnitLabel,
        formatTimeAgo,
        getActivityById,
        getBaselineForActivity,
        hasBaseline,
        calculateSavings: (activityId: string, amount: number, litersPerUnit: number) =>
            calculateSavings(activityId, amount, litersPerUnit, userBaselines)
    };
};
