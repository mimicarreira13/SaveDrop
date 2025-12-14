'use client';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Droplet, ShowerHead, CheckCircle2, Clock, Plus, RefreshCw, Tooth, Droplets, Shirt, Sprout } from 'lucide-react';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

// Import custom hook e funções
import { useMetas } from './useMetas';
import { calculateGoalProgress } from './metasLogic';
import { getIcon } from '../../../utils/iconUtils';
import { ACTIVITY_LABELS, ACTIVITY_TYPES } from './metasData';

export function Metas() {
    const {
        goals,
        history,
        expandedGoalId,
        showAddGoalDialog,
        subtitleIndex,
        isLoading,
        toggleGoalExpansion,
        handleUpdateGoal,
        handleAddGoal,
        handleDeleteGoal,
        getCurrentSubtitle,
        getFormattedProgress,
        refreshGoals,
        setShowAddGoalDialog
    } = useMetas();

    // Estado para o formulário de nova meta
    const [newGoalData, setNewGoalData] = useState({
        title: '',
        target: '',
        type: 'water_saving' as 'water_saving' | 'shower_time' | 'activity_streak',
        activityType: ''
    });

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Função para resetar o formulário
    const resetForm = () => {
        setNewGoalData({
            title: '',
            target: '',
            type: 'water_saving',
            activityType: ''
        });
    };

    // Função para criar a meta
    const handleCreateGoal = () => {
        if (!newGoalData.title.trim()) {
            alert('Por favor, insira um título para a meta!');
            return;
        }

        if (!newGoalData.target || parseInt(newGoalData.target) <= 0) {
            alert('Por favor, insira um valor válido para a meta!');
            return;
        }

        // Se for tipo atividade e não selecionou atividade
        if (newGoalData.type === 'activity_streak' && !newGoalData.activityType) {
            alert('Por favor, selecione uma atividade!');
            return;
        }

        handleAddGoal(
            newGoalData.title,
            parseInt(newGoalData.target),
            newGoalData.type,
            newGoalData.activityType || undefined
        );

        resetForm();
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-blue-600 mb-2">As Suas Metas</h1>
                    <p className="text-gray-600 font-bold">Acompanhe o seu progresso</p>
                </div>
                <Button
                    onClick={refreshGoals}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-600"
                    title="Atualizar com dados mais recentes"
                >
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </motion.div>

            {/* Active Goals */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-gray-700">Objetivos Ativos</h3>
                    <span className="text-sm text-gray-500">{goals.filter(g => g.status === 'active').length} ativas</span>
                </div>

                {goals.map((goal, index) => {
                    const Icon = getIcon(goal.icon);
                    const progress = calculateGoalProgress(goal.current, goal.target);
                    const isCompleted = goal.status === "completed";

                    return (
                        <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                className={`p-4 cursor-pointer ${isCompleted ? 'bg-green-50 border-green-300' : 'bg-white hover:shadow-md transition-shadow'}`}
                                onClick={() => toggleGoalExpansion(goal.id)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-gray-800 mb-1">{goal.title}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">
                                                    {getFormattedProgress(goal)}
                                                </span>
                                                {goal.type === 'water_saving' && goal.current > goal.target && (
                                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                                        Concluído!
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {isCompleted ? (
                                        <Badge className="bg-green-500">Concluída</Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-blue-500 text-blue-600">
                                            {Math.round(progress)}%
                                        </Badge>
                                    )}
                                </div>

                                <Progress
                                    value={isCompleted ? 100 : progress}
                                    color={isCompleted ? "green" : "blue"}
                                    animate={!isCompleted}
                                    className={`h-2 ${isCompleted ? "bg-green-200 opacity-40" : ""}`}
                                />

                                {/* Detalhes da meta */}
                                {expandedGoalId === goal.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 pt-4 border-t border-gray-200"
                                    >
                                        <div className="text-sm text-gray-600 space-y-2">
                                            <p>
                                                <span className="font-medium">Tipo:</span> {
                                                goal.type === 'water_saving' ? 'Poupança de Água' :
                                                    goal.type === 'shower_time' ? 'Tempo de Duche' :
                                                        'Sequência de Atividades'
                                            }
                                            </p>
                                            {goal.activityType && (
                                                <p>
                                                    <span className="font-medium">Atividade:</span> {
                                                    ACTIVITY_LABELS[goal.activityType as keyof typeof ACTIVITY_LABELS] ||
                                                    goal.activityType
                                                }
                                                </p>
                                            )}
                                            <p>
                                                <span className="font-medium">Fonte de dados:</span> Dashboard atual
                                            </p>
                                            <p>
                                                <span className="font-medium">Atualizado:</span> Automaticamente
                                            </p>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const increment = goal.type === 'water_saving' ? 100 : 1;
                                                    handleUpdateGoal(goal.id, goal.current + increment);
                                                }}
                                            >
                                                +{goal.type === 'water_saving' ? '100L' : '1 dia'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteGoal(goal.id);
                                                }}
                                            >
                                                Remover Meta
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* History */}
            <div className="space-y-4">
                <h3 className="text-gray-700">Histórico</h3>
                <div className="space-y-3">
                    {history.map((item, index) => (
                        <motion.div
                            key={item.month}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className={`p-4 ${item.status === 'current' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {item.status === 'current' ? (
                                            <Clock className="w-5 h-5 text-blue-500" />
                                        ) : (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        )}
                                        <div>
                                            <p className="text-gray-800">{item.month}</p>
                                            <motion.p
                                                key={subtitleIndex}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.4 }}
                                                className="text-sm text-gray-600"
                                            >
                                                {getCurrentSubtitle(item)}
                                            </motion.p>
                                        </div>
                                    </div>
                                    {item.status === 'current' ? (
                                        <Badge variant="outline" className="border-blue-500 text-blue-600">
                                            Atual
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-green-500">✓</Badge>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Add New Goal Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Button
                    onClick={() => setShowAddGoalDialog(true)}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Nova Meta
                </Button>
            </motion.div>

            {/* Dialog para adicionar nova meta (FORMULÁRIO COMPLETO) */}
            {showAddGoalDialog && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => {
                        setShowAddGoalDialog(false);
                        resetForm();
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-4">Criar Nova Meta</h3>

                        <div className="space-y-4">
                            {/* Tipo de Meta */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Meta
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center ${
                                            newGoalData.type === 'water_saving'
                                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setNewGoalData({...newGoalData, type: 'water_saving', activityType: ''})}
                                    >
                                        <Droplet className="w-5 h-5 mb-1" />
                                        <span className="text-xs">Litros</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center ${
                                            newGoalData.type === 'shower_time'
                                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setNewGoalData({...newGoalData, type: 'shower_time', activityType: ''})}
                                    >
                                        <ShowerHead className="w-5 h-5 mb-1" />
                                        <span className="text-xs">Dias Duche</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center ${
                                            newGoalData.type === 'activity_streak'
                                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setNewGoalData({...newGoalData, type: 'activity_streak'})}
                                    >
                                        <CheckCircle2 className="w-5 h-5 mb-1" />
                                        <span className="text-xs">Atividade</span>
                                    </button>
                                </div>
                            </div>

                            {/* Título da Meta */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título da Meta
                                </label>
                                <input
                                    type="text"
                                    value={newGoalData.title}
                                    onChange={(e) => setNewGoalData({...newGoalData, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={
                                        newGoalData.type === 'water_saving' ? "Ex: Poupar 1500L este mês" :
                                            newGoalData.type === 'shower_time' ? "Ex: Duches rápidos por 10 dias" :
                                                "Ex: Escovar os dentes por 7 dias seguidos"
                                    }
                                />
                            </div>

                            {/* Seletor de Atividade (aparece apenas para activity_streak) */}
                            {newGoalData.type === 'activity_streak' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Escolher Atividade
                                    </label>
                                    <select
                                        value={newGoalData.activityType}
                                        onChange={(e) => setNewGoalData({...newGoalData, activityType: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Selecionar atividade...</option>
                                        <option value={ACTIVITY_TYPES.SHOWER}>🚿 Duche</option>
                                        <option value={ACTIVITY_TYPES.TEETH_BRUSHING}>🦷 Escovar os Dentes</option>
                                        <option value={ACTIVITY_TYPES.DISH_WASHING}>🍽️ Lavar a Louça</option>
                                        <option value={ACTIVITY_TYPES.LAUNDRY}>👕 Lavar Roupa</option>
                                        <option value={ACTIVITY_TYPES.GARDEN_WATERING}>🌱 Regar Jardim</option>
                                    </select>
                                </div>
                            )}

                            {/* Valor da Meta */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {newGoalData.type === 'water_saving' ? 'Meta (Litros)' :
                                        newGoalData.type === 'shower_time' ? 'Meta (Dias)' :
                                            'Meta (Dias de sequência)'}
                                </label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        value={newGoalData.target}
                                        onChange={(e) => setNewGoalData({...newGoalData, target: e.target.value})}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={
                                            newGoalData.type === 'water_saving' ? "1500" :
                                                newGoalData.type === 'shower_time' ? "10" :
                                                    "7"
                                        }
                                        min="1"
                                    />
                                    <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-700 min-w-[80px]">
                                        {newGoalData.type === 'water_saving' ? 'Litros' :
                                            newGoalData.type === 'shower_time' ? 'Dias' :
                                                'Dias seguidos'}
                                    </span>
                                </div>
                            </div>

                            {/* Pré-visualização */}
                            {newGoalData.title || newGoalData.target ? (
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-600 mb-1">Pré-visualização:</p>
                                    <p className="font-medium text-gray-800">
                                        {newGoalData.title || "(Sem título)"} - {newGoalData.target || "0"}
                                        {newGoalData.type === 'water_saving' ? 'L' : ' dias'}
                                        {newGoalData.activityType && ` (${ACTIVITY_LABELS[newGoalData.activityType as keyof typeof ACTIVITY_LABELS] || newGoalData.activityType})`}
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        <div className="flex gap-2 mt-6">
                            <Button
                                onClick={() => {
                                    setShowAddGoalDialog(false);
                                    resetForm();
                                }}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleCreateGoal}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white"
                                disabled={!newGoalData.title || !newGoalData.target ||
                                    (newGoalData.type === 'activity_streak' && !newGoalData.activityType)}
                            >
                                Criar Meta
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}