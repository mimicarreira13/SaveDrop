'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {Droplet, Bath, Hand, Sparkles, Scissors, Utensils, Coffee, Shirt, RotateCw, Circle, Leaf, Car, Clock, Hash, Save, X, ChevronDown, ChevronUp, Check, AlertCircle} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Activity {
    id: string;
    name: string;
    icon: string;
    category: string;
    unit: 'minutes' | 'times' | 'liters';
    avgLitersPerUnit: number;
}

interface ActivityLog {
    id: string;
    activityId: string;
    activityName: string;
    icon: string;
    amount: number;
    liters: number;
    savedLiters: number;
    timestamp: string;
}

interface UserBaselines {
    duche: number;        // minutos
    dentes: number;       // minutos
    loica: number;        // minutos
}

// Mapeamento de ícones
const iconMap: { [key: string]: React.ElementType } = {
    Droplet,
    Bath,
    Hand,
    Sparkles,
    Scissors,
    Utensils,
    Coffee,
    Shirt,
    RotateCw,
    Circle,
    Leaf,
    Car,
    Clock,
    Hash,
    Save,
    X,
    ChevronDown,
    ChevronUp,
    Check,
    AlertCircle
};

const getIcon = (iconName: string): React.ElementType => {
    return iconMap[iconName] || Droplet;
};

// ATIVIDADES (apenas as da versão atual)
const ACTIVITIES: Activity[] = [
    // Higiene pessoal
    { id: 'duche', name: 'Duche', icon: 'Droplet', category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 12 },
    { id: 'banho', name: 'Banho de imersão', icon: 'Bath', category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 20 },
    { id: 'lavar-maos', name: 'Lavar mãos', icon: 'Hand', category: 'Higiene pessoal', unit: 'times', avgLitersPerUnit: 2 },
    { id: 'lavar-dentes', name: 'Lavar dentes', icon: 'Sparkles', category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 3 },
    { id: 'fazer-barba', name: 'Fazer barba', icon: 'Scissors', category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 4 },
    { id: 'lavar-rosto', name: 'Lavar rosto', icon: 'Sparkles', category: 'Higiene pessoal', unit: 'times', avgLitersPerUnit: 3 },

    // Cozinha / Torneiras
    { id: 'lavar-loica-mao', name: 'Lavar loiça à mão', icon: 'Utensils', category: 'Cozinha / Torneiras', unit: 'minutes', avgLitersPerUnit: 8 },
    { id: 'torneira-aberta', name: 'Torneira aberta', icon: 'Coffee', category: 'Cozinha / Torneiras', unit: 'minutes', avgLitersPerUnit: 10 },

    // Lavagem
    { id: 'maq-roupa', name: 'Máquina de lavar roupa', icon: 'Shirt', category: 'Lavagem', unit: 'times', avgLitersPerUnit: 60 },
    { id: 'maq-loica', name: 'Máquina de lavar loiça', icon: 'RotateCw', category: 'Lavagem', unit: 'times', avgLitersPerUnit: 15 },

    // Casa de banho
    { id: 'autoclismo', name: 'Autoclismo', icon: 'Circle', category: 'Casa de banho', unit: 'times', avgLitersPerUnit: 6 },
    { id: 'encher-banheira', name: 'Encher banheira', icon: 'Bath', category: 'Casa de banho', unit: 'times', avgLitersPerUnit: 150 },

    // Exterior / Outros
    { id: 'regar-plantas', name: 'Regar plantas', icon: 'Leaf', category: 'Exterior / Outros', unit: 'minutes', avgLitersPerUnit: 15 },
    { id: 'lavar-carro', name: 'Lavar carro', icon: 'Car', category: 'Exterior / Outros', unit: 'minutes', avgLitersPerUnit: 25 }
];

// HISTÓRICO INICIAL DE ATIVIDADES (MANTIDO!)
const INITIAL_ACTIVITY_LOG: ActivityLog[] = [
    {
        id: '1',
        activityId: 'banho',
        activityName: 'Banho de imersão',
        icon: 'Bath',
        amount: 5,
        liters: 100,
        savedLiters: 0,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
        id: '2',
        activityId: 'lavar-loica-mao',
        activityName: 'Lavar loiça à mão',
        icon: 'Utensils',
        amount: 10,
        liters: 80,
        savedLiters: 20,
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
        id: '3',
        activityId: 'maq-roupa',
        activityName: 'Máquina de lavar roupa',
        icon: 'Shirt',
        amount: 1,
        liters: 60,
        savedLiters: 0,
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString()
    }
];

// Chaves para localStorage
const STORAGE_KEYS = {
    ACTIVITY_LOG: 'savedrop_activity_log',
    DASHBOARD: 'savedrop_dashboard'
};

// ATIVIDADES COM BASELINE
const ACTIVITIES_WITH_BASELINE = ['duche', 'lavar-dentes', 'lavar-loica-mao'];

interface AdicionarConsumoProps {
    onSave: () => void;
    onCancel: () => void;
    userBaselines?: UserBaselines;
}

export function AdicionarConsumo({ onSave, onCancel, userBaselines }: AdicionarConsumoProps) {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [amount, setAmount] = useState<number>(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activityLog, setActivityLog] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOG); // MANTIDO!
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['Higiene pessoal']);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingSave, setPendingSave] = useState(false);

    // Carregar logs do localStorage
    useEffect(() => {
        const savedLogs = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
        if (savedLogs) {
            try {
                const logs = JSON.parse(savedLogs);
                if (Array.isArray(logs) && logs.length > 0) {
                    setActivityLog(logs);
                }
            } catch (error) {
                console.error('Erro ao carregar logs:', error);
            }
        }
    }, []);

    // Verificar se atividade tem baseline
    const hasBaseline = (activityId: string): boolean => {
        return ACTIVITIES_WITH_BASELINE.includes(activityId);
    };

    // Obter baseline para atividade
    const getBaselineForActivity = (activityId: string): number | null => {
        if (!userBaselines || !hasBaseline(activityId)) return null;

        const baselineMap: Record<string, keyof UserBaselines> = {
            'duche': 'duche',
            'lavar-dentes': 'dentes',
            'lavar-loica-mao': 'loica'
        };

        const baselineKey = baselineMap[activityId];
        return baselineKey ? userBaselines[baselineKey] : null;
    };

    // Calcular poupança
    const calculateSavings = (activityId: string, amount: number, litersPerUnit: number) => {
        const baselineAmount = getBaselineForActivity(activityId);
        if (!baselineAmount) return 0;

        const expectedLiters = baselineAmount * litersPerUnit;
        const realLiters = amount * litersPerUnit;
        const savedLiters = expectedLiters - realLiters;

        return savedLiters > 0 ? savedLiters : 0;
    };

    const handleActivityClick = (activity: Activity) => {
        setSelectedActivity(activity);
        setAmount(1);
        setIsDialogOpen(true);
    };

    const handleSaveActivity = () => {
        if (!selectedActivity) return;

        const now = new Date().toISOString();
        const liters = amount * selectedActivity.avgLitersPerUnit;
        const savedLiters = hasBaseline(selectedActivity.id)
            ? calculateSavings(selectedActivity.id, amount, selectedActivity.avgLitersPerUnit)
            : 0;

        const newLog: ActivityLog = {
            id: Date.now().toString(),
            activityId: selectedActivity.id,
            activityName: selectedActivity.name,
            icon: selectedActivity.icon,
            amount,
            liters,
            savedLiters,
            timestamp: now
        };

        // Atualizar logs
        const updatedLogs = [newLog, ...activityLog];
        setActivityLog(updatedLogs);
        localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(updatedLogs));

        // Atualizar dashboard
        updateDashboard(updatedLogs);

        // Mostrar mensagem de sucesso com poupança
        let message = `✅ ${selectedActivity.name} registado com sucesso!`;
        if (savedLiters > 0) {
            message += ` Poupaste ${savedLiters}L de água!`;
        }
        setSuccessMessage(message);
        setShowSuccess(true);

        // Fechar dialog
        setIsDialogOpen(false);
        setSelectedActivity(null);
        setAmount(1);
        setPendingSave(true);

        // Esconder mensagem após 3 segundos
        setTimeout(() => {
            setShowSuccess(false);
            // Auto-save após mostrar mensagem
            if (pendingSave) {
                onSave();
                setPendingSave(false);
            }
        }, 3000);
    };

    const updateDashboard = (logs: ActivityLog[]) => {
        try {
            const totalSavedLiters = logs.reduce((total, log) => total + (log.savedLiters || 0), 0);
            const today = new Date().toDateString();

            // Calcular streak
            let daysStreak = 0;
            const dashboardData = localStorage.getItem(STORAGE_KEYS.DASHBOARD);
            let dashboard = dashboardData ? JSON.parse(dashboardData) : { daysStreak: 0 };

            const hasActivityToday = logs.some(log =>
                new Date(log.timestamp).toDateString() === today
            );

            if (hasActivityToday) {
                daysStreak = dashboard.daysStreak > 0 ? dashboard.daysStreak + 1 : 1;
            }

            // Atualizar dashboard
            const updatedDashboard = {
                waterSaved: totalSavedLiters,
                daysStreak: daysStreak,
                goalWater: 2000,
                lastUpdate: new Date().toISOString()
            };

            localStorage.setItem(STORAGE_KEYS.DASHBOARD, JSON.stringify(updatedDashboard));

        } catch (error) {
            console.error('Erro ao atualizar dashboard:', error);
        }
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const getUnitLabel = (unit: string) => {
        switch (unit) {
            case 'minutes': return 'minutos';
            case 'times': return 'vezes';
            case 'liters': return 'litros';
            default: return '';
        }
    };

    const formatTimeAgo = (timestamp: string) => {
        const date = new Date(timestamp);
        const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
        if (minutes < 60) return `há ${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `há ${hours}h`;
        return `há ${Math.floor(hours / 24)}d`;
    };

    // Handler para tentar sair
    const handleCancel = () => {
        if (selectedActivity || amount > 1) {
            setShowConfirmDialog(true);
        } else {
            onCancel();
        }
    };

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
                    onClick={handleCancel}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </Button>
            </motion.div>

            {/* Mensagem de Sucesso */}
            {showSuccess && (
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
                            <p className="text-green-800 font-medium">{successMessage}</p>
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
                {Array.from(new Set(ACTIVITIES.map(a => a.category))).map((category, categoryIndex) => {
                    const isExpanded = expandedCategories.includes(category);
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

            {/* Recent Activity Log - MANTIDO COM HISTÓRICO COMPLETO! */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-700">Atividades Recentes</h3>
                    <span className="text-sm text-gray-500">{activityLog.length} registos</span>
                </div>
                <div className="space-y-2">
                    {activityLog.map((log, index) => {
                        const Icon = getIcon(log.icon);
                        const activity = ACTIVITIES.find(a => a.id === log.activityId);
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
                                            {/* MANTIDO - Mostra litros poupados se houver! */}
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            {selectedActivity && (
                                <>
                                    <div className="p-2 bg-gradient-to-br from-blue-100 to-green-100 rounded-full">
                                        {(() => {
                                            const Icon = getIcon(selectedActivity.icon);
                                            return <Icon className="w-6 h-6 text-blue-600" />;
                                        })()}
                                    </div>
                                    <span>{selectedActivity.name}</span>
                                </>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="flex items-center gap-2">
                                {selectedActivity?.unit === 'minutes' && <Clock className="w-4 h-4" />}
                                {selectedActivity?.unit === 'times' && <Hash className="w-4 h-4" />}
                                Quantidade ({selectedActivity && getUnitLabel(selectedActivity.unit)})
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                className="h-12"
                                min={1}
                            />
                        </div>

                        {selectedActivity && (
                            <>
                                <Card className="p-3 bg-blue-50 border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">Consumo estimado:</span>
                                        <span className="text-blue-600 font-medium">
                                            {amount * selectedActivity.avgLitersPerUnit}L
                                        </span>
                                    </div>
                                </Card>

                                {/* MANTIDO - Cálculo de poupança no modal */}
                                {hasBaseline(selectedActivity.id) && userBaselines && (
                                    <Card className="p-3 bg-green-50 border-green-200">
                                        <div className="text-sm">
                                            <p className="font-medium text-green-800 mb-1">💧 Poupança de Água</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Seu normal:</span>
                                                    <span className="text-green-700">
                                                        {getBaselineForActivity(selectedActivity.id)} {getUnitLabel(selectedActivity.unit)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">Registado:</span>
                                                    <span className="text-blue-700">
                                                        {amount} {getUnitLabel(selectedActivity.unit)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-gray-700">Poupança:</span>
                                                    <span className="text-green-700">
                                                        {calculateSavings(selectedActivity.id, amount, selectedActivity.avgLitersPerUnit)}L
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </>
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
                </DialogContent>
            </Dialog>

            {/* Dialog de Confirmação de Saída */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
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
                            onClick={() => setShowConfirmDialog(false)}
                            variant="outline"
                            className="flex-1 h-11"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Continuar a editar
                        </Button>
                        <Button
                            onClick={() => {
                                setShowConfirmDialog(false);
                                onCancel();
                            }}
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