import { useState } from 'react';
import { motion } from 'motion/react';
import { Droplet, Smile, Meh, Frown } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

type MascotMood = 'happy' | 'neutral' | 'sad';

interface MascotState {
    mood: MascotMood;
    message: string;
    tip: string;
    color: string;
    bgColor: string;
    borderColor: string;
}

const mascotStates: Record<MascotMood, MascotState> = {
    happy: {
        mood: 'happy',
        message: 'Ótimo trabalho! Estás a poupar água!',
        tip: 'A tua dedicação está a fazer a diferença para o planeta! 🌍',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500',
        borderColor: 'border-blue-300'
    },
    neutral: {
        mood: 'neutral',
        message: 'Continua atento ao teu consumo.',
        tip: 'Cada pequena ação conta. Vamos juntos poupar mais água! 💧',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400',
        borderColor: 'border-blue-200'
    },
    sad: {
        mood: 'sad',
        message: 'Há algum tempo que não poupas água...',
        tip: 'Não desanimes! Pequenas mudanças fazem grande diferença. Vamos recomeçar? 🌱',
        color: 'text-gray-400',
        bgColor: 'bg-gray-400',
        borderColor: 'border-gray-300'
    }
};

export function Mascote() {
    const [currentMood, setCurrentMood] = useState<MascotMood>('neutral');
    const mascot = mascotStates[currentMood];

    const getMascotIcon = () => {
        switch (currentMood) {
            case 'happy':
                return <Smile className="w-12 h-12 text-white" />;
            case 'neutral':
                return <Meh className="w-12 h-12 text-white" />;
            case 'sad':
                return <Frown className="w-12 h-12 text-white" />;
        }
    };

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-blue-600 mb-2">Eco-Companion</h1>
                <p className="text-gray-600">O teu companheiro de poupança</p>
            </motion.div>

            {/* Mascot Display */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Card className={`p-8 bg-gradient-to-br from-blue-50 to-green-50 ${mascot.borderColor} border-2 shadow-lg`}>
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
                            {/* Main Drop */}
                            <div className={`relative w-40 h-40 ${mascot.bgColor} rounded-full rounded-tl-none rotate-45 shadow-2xl flex items-center justify-center`}>
                                <div className="rotate-[-45deg]">
                                    {getMascotIcon()}
                                </div>
                            </div>

                            {/* Shine Effect */}
                            <motion.div
                                className="absolute top-8 left-8 w-8 h-8 bg-white/40 rounded-full"
                                animate={{
                                    opacity: [0.4, 0.7, 0.4]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>

                        {/* Mascot Name */}
                        <div className="text-center">
                            <h2 className={mascot.color}>AquaBuddy</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {currentMood === 'happy' && '😊 Feliz'}
                                {currentMood === 'neutral' && '😐 Neutro'}
                                {currentMood === 'sad' && '😢 Triste'}
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Mascot Message */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card className="p-6 bg-white border-gray-200 shadow-md">
                    <div className="flex items-start gap-3">
                        <Droplet className={`w-8 h-8 ${mascot.color} fill-current flex-shrink-0 mt-1`} />
                        <div className="flex-1">
                            <p className="text-gray-800 mb-3">
                                {mascot.message}
                            </p>
                            <p className="text-sm text-gray-600">
                                {mascot.tip}
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Card className="p-4 bg-blue-50 border-blue-200 text-center">
                    <p className="text-sm text-gray-600 mb-1">Dias Ativos</p>
                    <p className="text-blue-600">12</p>
                </Card>
                <Card className="p-4 bg-green-50 border-green-200 text-center">
                    <p className="text-sm text-gray-600 mb-1">Água Poupada</p>
                    <p className="text-green-600">1250L</p>
                </Card>
                <Card className="p-4 bg-purple-50 border-purple-200 text-center">
                    <p className="text-sm text-gray-600 mb-1">Badges</p>
                    <p className="text-purple-600">8</p>
                </Card>
            </motion.div>

            {/* Mood Selector (for testing different states) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-gray-200">
                    <p className="text-sm text-gray-700 mb-4 text-center">
                        Como está o AquaBuddy hoje?
                    </p>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setCurrentMood('happy')}
                            className={`flex-1 h-12 ${
                                currentMood === 'happy'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                        >
                            😊 Feliz
                        </Button>
                        <Button
                            onClick={() => setCurrentMood('neutral')}
                            className={`flex-1 h-12 ${
                                currentMood === 'neutral'
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                        >
                            😐 Neutro
                        </Button>
                        <Button
                            onClick={() => setCurrentMood('sad')}
                            className={`flex-1 h-12 ${
                                currentMood === 'sad'
                                    ? 'bg-gray-400 text-white'
                                    : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                        >
                            😢 Triste
                        </Button>
                    </div>
                </Card>
            </motion.div>

            {/* Interaction Tips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <h3 className="mb-3 text-gray-700">Como ajudar o AquaBuddy</h3>
                <div className="space-y-2">
                    <Card className="p-3 bg-white border-gray-200">
                        <p className="text-sm text-gray-700">💧 Regista o teu consumo diariamente</p>
                    </Card>
                    <Card className="p-3 bg-white border-gray-200">
                        <p className="text-sm text-gray-700">🎯 Alcança as tuas metas semanais</p>
                    </Card>
                    <Card className="p-3 bg-white border-gray-200">
                        <p className="text-sm text-gray-700">🌟 Desbloqueia badges para mantê-lo feliz</p>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
