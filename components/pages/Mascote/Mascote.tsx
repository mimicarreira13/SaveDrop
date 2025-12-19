// Ficheiro: pages/Mascote/Mascote.tsx
'use client';

import { motion } from 'motion/react';
import { Droplet, RefreshCw } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { useMascote } from './useMascote';

export function Mascote() {
    const {
        currentMood,
        mascotState,
        mascotImage,
        waterSaved,
        stats,
        motivationalMessage,
        nextMoodProgress,
        interactionTips,
        refreshMascote
    } = useMascote();

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header com botão de atualizar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-blue-600 mb-2">Eco-Companion</h1>
                    <p className="text-gray-600">O teu companheiro de poupança</p>
                </div>
                <Button
                    onClick={refreshMascote}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-600"
                    title="Atualizar estado"
                >
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </motion.div>

            {/* Mascot Display */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Card className={`p-8 bg-gradient-to-br from-blue-50 to-green-50 ${mascotState.borderColor} border-2 shadow-lg`}>
                    <div className="flex flex-col items-center space-y-6">
                        {/* Animated Mascot */}
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            <img
                                src={mascotImage}
                                alt={`Splashy ${currentMood}`}
                                className="w-40 h-40 object-contain"
                            />
                        </motion.div>

                        {/* Mascot Name and Mood */}
                        <div className="text-center">
                            <h2 className={`text-2xl font-bold ${mascotState.color}`}>Splashy</h2>
                            <p className="text-lg text-gray-600 mt-1">
                                {mascotState.emoji} {
                                currentMood === 'happy' ? 'Feliz' :
                                    currentMood === 'worried' ? 'Preocupado' :
                                        'Triste'
                            }
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Progresso para próximo humor */}
            {nextMoodProgress.remaining > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                    Faltam <span className="font-medium">{nextMoodProgress.remaining}L</span> para
                                    <span className={`font-medium ml-1 ${
                                        nextMoodProgress.nextMood === 'happy' ? 'text-green-600' :
                                            nextMoodProgress.nextMood === 'worried' ? 'text-amber-600' :
                                                'text-red-600'
                                    }`}>
                                        {nextMoodProgress.nextMood === 'happy' ? 'feliz' : 'preocupado'}
                                    </span>
                                </span>
                                <span className="text-gray-700 font-medium">
                                    {Math.round(nextMoodProgress.progress)}%
                                </span>
                            </div>
                            <Progress
                                value={nextMoodProgress.progress}
                                color={
                                    nextMoodProgress.nextMood === 'happy' ? "green" :
                                        nextMoodProgress.nextMood === 'worried' ? "amber" :
                                            "red"
                                }
                                className="h-2"
                            />
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Mascot Message */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card className="p-6 bg-white border-gray-200 shadow-md">
                    <div className="flex items-start gap-3">
                        <Droplet className={`w-8 h-8 ${mascotState.color} fill-current flex-shrink-0 mt-1`} />
                        <div className="flex-1">
                            <p className="text-gray-800 mb-3 text-lg">
                                {mascotState.message}
                            </p>
                            <p className="text-gray-600">
                                {mascotState.tip}
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Mensagem motivacional */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <p className="text-center text-purple-800">
                        {motivationalMessage}
                    </p>
                </Card>
            </motion.div>

            {/* Stats Overview - COM DADOS REAIS */}
            <motion.div
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Card className="p-4 bg-blue-50 border-blue-200 text-center">
                    <p className="text-sm text-gray-600 mb-1">Dias Ativos</p>
                    <p className="text-2xl text-blue-600 font-bold">{stats.daysActive}</p>
                </Card>
                <Card className="p-4 bg-green-50 border-green-200 text-center">
                    <p className="text-sm text-gray-600 mb-1">Água Poupada</p>
                    <p className="text-2xl text-green-600 font-bold">{waterSaved}L</p>
                </Card>
                <Card className="p-4 bg-purple-50 border-purple-200 text-center">
                    <p className="text-sm text-gray-600 mb-1">Badges</p>
                    <p className="text-2xl text-purple-600 font-bold">{stats.badgesCount}</p>
                </Card>
            </motion.div>

            {/* Thresholds Information */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
            >
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-gray-200">
                    <p className="text-sm text-gray-700 mb-3 text-center font-medium">
                        Como manter o Splashy feliz?
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="flex items-center gap-2">
                                <span className="text-red-500">😢</span>
                                <span className="text-sm">Triste:</span>
                            </span>
                            <span className="text-sm text-gray-600">Menos de 1000L</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="flex items-center gap-2">
                                <span className="text-amber-500">😐</span>
                                <span className="text-sm">Preocupado:</span>
                            </span>
                            <span className="text-sm text-gray-600">1000L - 2000L</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="flex items-center gap-2">
                                <span className="text-green-500">😊</span>
                                <span className="text-sm">Feliz:</span>
                            </span>
                            <span className="text-sm text-gray-600">Mais de 2000L</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Interaction Tips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <h3 className="mb-3 text-gray-700">Como ajudar o Splashy</h3>
                <div className="space-y-2">
                    {interactionTips.map((tip, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                            <Card className="p-3 bg-white border-gray-200 hover:border-blue-200 transition-colors">
                                <p className="text-sm text-gray-700">{tip}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}