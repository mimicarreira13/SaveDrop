'use client';
import { motion } from 'motion/react';
import { Droplet, ShowerHead, CheckCircle2, Clock, Plus, RefreshCw } from 'lucide-react';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

// Import custom hook e funções
import { useMetas } from './useMetas';
import { calculateGoalProgress } from './metasLogic';
import { getIcon } from '../../../utils/iconUtils';

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

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

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
                                                    // Para metas de poupança, aumenta em 100L
                                                    // Para metas de dias, aumenta em 1 dia
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

            {/* Dialog para adicionar nova meta (simplificado) */}
            {showAddGoalDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg p-6 max-w-sm w-full"
                    >
                        <h3 className="text-lg font-semibold mb-4">Nova Meta</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            As novas metas serão automaticamente atualizadas com os dados do seu dashboard.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setShowAddGoalDialog(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => handleAddGoal("Poupar 1500L este mês", 1500, "water_saving")}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white"
                            >
                                Criar Meta de Água
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}