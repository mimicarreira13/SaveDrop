'use client';
import { motion } from 'motion/react';
import {
    Droplet, Bath, Hand, Sparkles, Scissors, Utensils, Coffee,
    Shirt, RotateCw, Circle, Leaf, Car, Clock, Hash,
    Save, X, ChevronDown, ChevronUp, Check, AlertCircle
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

import { useAdicionarConsumo } from './useAdicionarConsumo';
import { getIcon } from '../../../utils/iconUtils'; // Vamos criar este helper

interface AdicionarConsumoProps {
    onSave: () => void;
    onCancel: () => void;
    userBaselines?: {
        duche: number;
        dentes: number;
        loica: number;
    };
}

export function AdicionarConsumo({ onSave, onCancel, userBaselines }: AdicionarConsumoProps) {
    const {
        state,
        ACTIVITIES,
        categories,
        handleActivityClick,
        handleSaveActivity,
        toggleCategory,
        handleCancel,
        confirmCancel,
        setAmount,
        setIsDialogOpen,
        getUnitLabel,
        formatTimeAgo,
        getActivityById,
        getBaselineForActivity,
        hasBaseline,
        calculateSavings
    } = useAdicionarConsumo(userBaselines, onSave);

    return (
        <div className="p-6 space-y-6 min-h-screen pb-24">
            {/* Header com botão de voltar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-blue-600 mb-2">Adicionar Atividade</h1>
                    <p className="text-gray-600">Registe as suas ações diárias para poupar água</p>
                </div>
                <Button
                    onClick={() => handleCancel(onCancel)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </Button>
            </motion.div>

            {/* Mensagem de Sucesso */}
            {state.showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-4 mb-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500 rounded-full">
                            <Check className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-green-800 font-medium">{state.successMessage}</p>
                            <p className="text-green-700 text-sm mt-1">
                                A redirecionar para o dashboard...
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Activity Categories */}
            <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {categories.map((category) => {
                    const isExpanded = state.expandedCategories.includes(category);
                    const categoryActivities = ACTIVITIES.filter(a => a.category === category);

                    return (
                        <div key={category}>
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 mb-3 hover:from-blue-100 hover:to-green-100 transition-colors"
                            >
                                <h3 className="text-gray-700">{category}</h3>
                                {isExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-600" />
                                )}
                            </button>

                            {isExpanded && (
                                <motion.div
                                    className="grid grid-cols-2 gap-3"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {categoryActivities.map((activity, index) => {
                                        const Icon = getIcon(activity.icon);

                                        return (
                                            <motion.div
                                                key={activity.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Card
                                                    onClick={() => handleActivityClick(activity)}
                                                    className="p-4 cursor-pointer hover:shadow-lg transition-all border border-gray-200 hover:border-gray-300 bg-white"
                                                >
                                                    <div className="flex flex-col items-center space-y-2 text-center">
                                                        <div className="p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-full">
                                                            <Icon className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                        <p className="text-sm text-gray-700 leading-tight">{activity.name}</p>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </motion.div>

            {/* Recent Activity Log */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-700">Atividades Recentes</h3>
                    <span className="text-sm text-gray-500">{state.activityLog.length} registos</span>
                </div>
                <div className="space-y-2">
                    {state.activityLog.map((log, index) => {
                        const Icon = getIcon(log.icon);
                        const activity = getActivityById(log.activityId);
                        const unitLabel = activity ? getUnitLabel(activity.unit) : '';

                        return (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-3 bg-white border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-full">
                                                <Icon className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-800">{log.activityName}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatTimeAgo(log.timestamp)} • {log.amount} {unitLabel}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-blue-600 font-medium">{log.liters}L</p>
                                            {log.savedLiters > 0 && (
                                                <p className="text-xs text-green-600 font-medium">
                                                    +{log.savedLiters}L poupados
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Modal de Inserção */}
            <Dialog open={!!state.selectedActivity} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6">
                    {state.selectedActivity && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-100 to-green-100 rounded-full">
                                        {(() => {
                                            const Icon = getIcon(state.selectedActivity.icon);
                                            return <Icon className="w-6 h-6 text-blue-600" />;
                                        })()}
                                    </div>
                                    <span>{state.selectedActivity.name}</span>
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="flex items-center gap-2">
                                        {state.selectedActivity.unit === 'minutes' && <Clock className="w-4 h-4" />}
                                        {state.selectedActivity.unit === 'times' && <Hash className="w-4 h-4" />}
                                        Quantidade ({getUnitLabel(state.selectedActivity.unit)})
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={state.amount}
                                        onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                                        className="h-12"
                                        min={1}
                                    />
                                </div>

                                <Card className="p-3 bg-blue-50 border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">Consumo estimado:</span>
                                        <span className="text-blue-600 font-medium">
                                            {state.amount * state.selectedActivity.avgLitersPerUnit}L
                                        </span>
                                    </div>
                                </Card>

                                {hasBaseline(state.selectedActivity.id) && userBaselines && (
                                    <Card className="p-3 bg-green-50 border-green-200">
                                        <div className="text-sm">
                                            <p className="font-medium text-green-800 mb-1">💧 Poupança de Água</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Seu normal:</span>
                                                    <span className="text-green-700">
                                                        {getBaselineForActivity(state.selectedActivity.id)} {getUnitLabel(state.selectedActivity.unit)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Registado:</span>
                                                    <span className="text-blue-700">
                                                        {state.amount} {getUnitLabel(state.selectedActivity.unit)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-gray-700">Poupança:</span>
                                                    <span className="text-green-700">
                                                        {calculateSavings(state.selectedActivity.id, state.amount, state.selectedActivity.avgLitersPerUnit)}L
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        onClick={() => setIsDialogOpen(false)}
                                        variant="outline"
                                        className="flex-1 h-11"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleSaveActivity}
                                        className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Guardar
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de Confirmação de Saída */}
            <Dialog open={state.showConfirmDialog} onOpenChange={() => state.showConfirmDialog && confirmCancel()}>
                <DialogContent className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-500" />
                            <span>Descartar alterações?</span>
                        </DialogTitle>
                        <DialogDescription>
                            Tem alterações não guardadas. Tem a certeza que quer sair?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={() => confirmCancel()}
                            variant="outline"
                            className="flex-1 h-11"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Continuar a editar
                        </Button>
                        <Button
                            onClick={() => confirmCancel(onCancel)}
                            className="flex-1 h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                        >
                            Sair sem guardar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}