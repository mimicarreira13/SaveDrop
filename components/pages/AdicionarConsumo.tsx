import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Droplet,
    Bath,
    Hand,
    Sparkles,
    Scissors,
    Utensils,
    Waves,
    Apple,
    Coffee,
    Shirt,
    RotateCw,
    Circle,
    Home,
    Leaf,
    Wind,
    Car,
    Droplets,
    Clock,
    Hash,
    Save,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Activity {
    id: string;
    name: string;
    icon: React.ElementType;
    category: string;
    unit: 'minutes' | 'times' | 'liters';
    avgLitersPerUnit: number;
}

interface ActivityLog {
    id: string;
    activityId: string;
    activityName: string;
    icon: React.ElementType;
    amount: number;
    liters: number;
    timestamp: Date;
}

const activities: Activity[] = [
    // Higiene pessoal
    { id: 'duche', name: 'Duche', icon: Droplet, category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 12 },
    { id: 'banho', name: 'Banho de imersão', icon: Bath, category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 20 },
    { id: 'lavar-maos', name: 'Lavar mãos', icon: Hand, category: 'Higiene pessoal', unit: 'times', avgLitersPerUnit: 2 },
    { id: 'lavar-dentes', name: 'Lavar dentes', icon: Sparkles, category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 3 },
    { id: 'fazer-barba', name: 'Fazer barba', icon: Scissors, category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 4 },
    { id: 'lavar-rosto', name: 'Lavar rosto', icon: Sparkles, category: 'Higiene pessoal', unit: 'times', avgLitersPerUnit: 3 },

    // Cozinha / Torneiras
    { id: 'lavar-loica-mao', name: 'Lavar loiça à mão', icon: Utensils, category: 'Cozinha / Torneiras', unit: 'minutes', avgLitersPerUnit: 8 },
    { id: 'enxaguar-loica', name: 'Enxaguar loiça', icon: Waves, category: 'Cozinha / Torneiras', unit: 'minutes', avgLitersPerUnit: 6 },
    { id: 'lavar-alimentos', name: 'Lavar alimentos', icon: Apple, category: 'Cozinha / Torneiras', unit: 'minutes', avgLitersPerUnit: 5 },
    { id: 'torneira-aberta', name: 'Torneira aberta', icon: Coffee, category: 'Cozinha / Torneiras', unit: 'minutes', avgLitersPerUnit: 10 },

    // Lavagem
    { id: 'maq-roupa', name: 'Máquina de lavar roupa', icon: Shirt, category: 'Lavagem', unit: 'times', avgLitersPerUnit: 60 },
    { id: 'maq-loica', name: 'Máquina de lavar loiça', icon: RotateCw, category: 'Lavagem', unit: 'times', avgLitersPerUnit: 15 },

    // Casa de banho
    { id: 'autoclismo', name: 'Autoclismo', icon: Circle, category: 'Casa de banho', unit: 'times', avgLitersPerUnit: 6 },
    { id: 'encher-banheira', name: 'Encher banheira', icon: Bath, category: 'Casa de banho', unit: 'times', avgLitersPerUnit: 150 },
    { id: 'limpeza-casa', name: 'Limpeza da casa', icon: Home, category: 'Casa de banho', unit: 'minutes', avgLitersPerUnit: 7 },

    // Exterior / Outros
    { id: 'regar-plantas', name: 'Regar plantas', icon: Leaf, category: 'Exterior / Outros', unit: 'minutes', avgLitersPerUnit: 15 },
    { id: 'lavar-varanda', name: 'Lavar varanda/quintal', icon: Wind, category: 'Exterior / Outros', unit: 'minutes', avgLitersPerUnit: 20 },
    { id: 'lavar-carro', name: 'Lavar carro', icon: Car, category: 'Exterior / Outros', unit: 'minutes', avgLitersPerUnit: 25 },
    { id: 'piscina', name: 'Piscina', icon: Droplets, category: 'Exterior / Outros', unit: 'liters', avgLitersPerUnit: 1 },
];

const categories = Array.from(new Set(activities.map(a => a.category)));

interface AdicionarConsumoProps {
    onSave: () => void;
    onCancel: () => void;
}

export function AdicionarConsumo({ onSave, onCancel }: AdicionarConsumoProps) {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [amount, setAmount] = useState<number>(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activityLog, setActivityLog] = useState<ActivityLog[]>([
        {
            id: '1',
            activityId: 'banho',
            activityName: 'Banho de imersão',
            icon: Bath,
            amount: 5,
            liters: 100,
            timestamp: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
            id: '2',
            activityId: 'lavar-loica-mao',
            activityName: 'Lavar loiça à mão',
            icon: Utensils,
            amount: 10,
            liters: 80,
            timestamp: new Date(Date.now() - 1000 * 60 * 120)
        },
        {
            id: '3',
            activityId: 'maq-roupa',
            activityName: 'Máquina de lavar roupa',
            icon: Shirt,
            amount: 1,
            liters: 60,
            timestamp: new Date(Date.now() - 1000 * 60 * 240)
        }
    ]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['Higiene pessoal']);

    const handleActivityClick = (activity: Activity) => {
        setSelectedActivity(activity);
        setAmount(1);
        setIsDialogOpen(true);
    };

    const handleSaveActivity = () => {
        if (selectedActivity) {
            const liters = amount * selectedActivity.avgLitersPerUnit;
            const newLog: ActivityLog = {
                id: Date.now().toString(),
                activityId: selectedActivity.id,
                activityName: selectedActivity.name,
                icon: selectedActivity.icon,
                amount,
                liters,
                timestamp: new Date()
            };
            setActivityLog([newLog, ...activityLog.slice(0, 4)]);
            setIsDialogOpen(false);
            setSelectedActivity(null);
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

    const formatTimeAgo = (date: Date) => {
        const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
        if (minutes < 60) return `há ${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `há ${hours}h`;
        return `há ${Math.floor(hours / 24)}d`;
    };

    return (
        <div className="p-6 space-y-6 min-h-screen pb-24">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-blue-600 mb-2">Adicionar Atividade</h1>
                <p className="text-gray-600">Registe as suas ações diárias para poupar água</p>
            </motion.div>

            {/* Activity Categories */}
            <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {categories.map((category, categoryIndex) => {
                    const isExpanded = expandedCategories.includes(category);
                    const categoryActivities = activities.filter(a => a.category === category);

                    return (
                        <div key={category}>
                            {/* Category Header */}
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

                            {/* Activity Cards */}
                            {isExpanded && (
                                <motion.div
                                    className="grid grid-cols-2 gap-3"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {categoryActivities.map((activity, index) => {
                                        const Icon = activity.icon;
                                        return (
                                            <motion.div
                                                key={activity.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Card
                                                    onClick={() => handleActivityClick(activity)}
                                                    className="p-4 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all bg-white border-gray-200"
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
            {activityLog.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h3 className="mb-3 text-gray-700">Atividades Recentes</h3>
                    <div className="space-y-2">
                        {activityLog.map((log, index) => {
                            const Icon = log.icon;
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
                                                    <p className="text-xs text-gray-500">{formatTimeAgo(log.timestamp)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-blue-600">{log.liters}L</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Modal Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6">
                <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            {selectedActivity && (
                                <>
                                    <div className="p-2 bg-gradient-to-br from-blue-100 to-green-100 rounded-full">
                                        <selectedActivity.icon className="w-6 h-6 text-blue-600" />
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
                                {selectedActivity?.unit === 'liters' && <Droplet className="w-4 h-4" />}
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
                            <Card className="p-3 bg-blue-50 border-blue-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Consumo estimado:</span>
                                    <span className="text-blue-600">
                    ~{amount * selectedActivity.avgLitersPerUnit}L
                  </span>
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
                </DialogContent>
            </Dialog>
        </div>
    );
}