'use client';
import { motion } from 'framer-motion';
import { Droplet, Plus, TrendingDown, Calendar } from 'lucide-react';
import { Progress } from '../../ui/progress';
import { Card } from '../../ui/card';
import { WaterDropAnimation } from '../WaterDropAnimation';
import { Button } from '../../ui/button';

// Importamos o nosso custom hook
import { useDashboard } from './useDashboard';
import { calculateStatsValues } from './dashboardLogic';

interface DashboardProps {
    onAdd?: () => void;
}

export function Dashboard({ onAdd }: DashboardProps) {
    // Usamos o hook para toda a lógica
    const {
        dashboardData,
        randomMessage,
        randomEquivalence,
        QUICK_TIPS
    } = useDashboard();

    // Cálculos locais (apresentação)
    const progressPercentage = (dashboardData.waterSaved / dashboardData.goalWater) * 100;

    // Stats calculadas aqui (apresentação específica)
    const statsValues = calculateStatsValues(
        dashboardData.waterSaved,
        dashboardData.goalWater,
        dashboardData.daysStreak
    );

    // Definir as stats completas com JSX aqui mesmo
    const stats = [
        {
            label: statsValues[0].label,
            value: statsValues[0].value,
            icon: <TrendingDown className="w-5 h-5 text-white" />,
            bgColor: "bg-blue-50",
            iconBg: "bg-blue-500"
        },
        {
            label: statsValues[1].label,
            value: statsValues[1].value,
            icon: <Calendar className="w-5 h-5 text-white" />,
            bgColor: "bg-green-50",
            iconBg: "bg-green-500"
        }
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-blue-600 mb-2">SaveDrop</h1>
                <p className="text-gray-600">O seu consumo de água</p>
            </motion.div>

            {/* Water Drop Animation */}
            <WaterDropAnimation />

            {/* Main Progress Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-green-500 text-white border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="opacity-90 mb-1">Água Poupada</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl">{dashboardData.waterSaved}</span>
                                <span className="opacity-90">/ {dashboardData.goalWater}L</span>
                            </div>
                        </div>
                        <Droplet className="w-16 h-16 opacity-80" />
                    </div>

                    <div className="space-y-2">
                        <Progress value={progressPercentage} color="white" className="h-3 bg-white/30" />
                        <p className="text-sm opacity-90">{randomEquivalence}</p>
                    </div>
                </Card>
            </motion.div>

            {/* Add Consumption Button */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
            >
                <div className="px-6">
                    <Button
                        onClick={() => onAdd && onAdd()}
                        className="w-full h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-xl text-white shadow-lg flex items-center justify-center"
                    >
                        <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
                        Registar atividade
                    </Button>
                </div>
            </motion.div>

            {/* Motivational Message */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card className="p-4 bg-green-50 border-green-200">
                    <p className="text-green-800 text-center">{randomMessage}</p>
                </Card>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className={`p-4 ${stat.bgColor} border-gray-200`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 ${stat.iconBg} rounded-full`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className={`text-${
                                    stat.iconBg.includes('blue') ? 'blue' :
                                        stat.iconBg.includes('green') ? 'green' : 'gray'
                                }-600`}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </motion.div>

            {/* Quick Tips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <h3 className="mb-3 text-gray-700">Dicas Rápidas</h3>
                <div className="space-y-2">
                    {QUICK_TIPS.map((tip, index) => (
                        <Card key={index} className="p-3 bg-white border-gray-200">
                            <p className="text-sm text-gray-700">{tip}</p>
                        </Card>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}