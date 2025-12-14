// Ficheiro: pages/Ranking/Ranking.tsx
'use client';

import { motion } from 'motion/react';
import { Trophy, Medal } from 'lucide-react';
import { Card } from '../../ui/card';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { useRanking } from './useRanking';

export function Ranking() {
    const {
        ranking,
        userStats,
        weeklyChallenge,
        isLoading,
        handleJoinChallenge
    } = useRanking();

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <p>Carregando ranking...</p>
            </div>
        );
    }

    // Top 3 para o pódio
    const podiumUsers = ranking.slice(0, 3);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-blue-600 mb-2">Ranking Social</h1>
                <p className="text-gray-600">Compare o seu progresso</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {userStats.map((stat, index) => {
                    const Icon = stat.Icon;
                    return (
                        <Card key={index} className="p-3 text-center bg-white">
                            <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                            <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                            <p className={`${stat.color}`}>{stat.value}</p>
                        </Card>
                    );
                })}
            </motion.div>

            {/* Top 3 Podium */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="p-6 bg-gradient-to-br from-yellow-50 via-gray-50 to-orange-50 border-yellow-200">
                    <div className="flex items-end justify-center gap-4 mb-4">
                        {/* 2nd Place */}
                        <motion.div
                            className="flex flex-col items-center"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Avatar className="w-12 h-12 mb-2 border-2 border-gray-400">
                                <AvatarFallback className="bg-gray-200 text-gray-700">
                                    {podiumUsers[1]?.avatar || "🥈"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="w-16 h-16 bg-gray-400 rounded-t-lg flex items-center justify-center">
                                <span className="text-white">2</span>
                            </div>
                        </motion.div>

                        {/* 1st Place */}
                        <motion.div
                            className="flex flex-col items-center"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Trophy className="w-6 h-6 text-yellow-500 mb-1" />
                            <Avatar className="w-16 h-16 mb-2 border-4 border-yellow-500 shadow-lg">
                                <AvatarFallback className="bg-yellow-200 text-yellow-700">
                                    {podiumUsers[0]?.avatar || "🥇"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="w-16 h-24 bg-yellow-500 rounded-t-lg flex items-center justify-center">
                                <span className="text-white">1</span>
                            </div>
                        </motion.div>

                        {/* 3rd Place */}
                        <motion.div
                            className="flex flex-col items-center"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Avatar className="w-12 h-12 mb-2 border-2 border-orange-600">
                                <AvatarFallback className="bg-orange-200 text-orange-700">
                                    {podiumUsers[2]?.avatar || "🥉"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="w-16 h-12 bg-orange-600 rounded-t-lg flex items-center justify-center">
                                <span className="text-white">3</span>
                            </div>
                        </motion.div>
                    </div>
                </Card>
            </motion.div>

            {/* Full Ranking List */}
            <div className="space-y-3">
                <h3 className="text-gray-700">Classificação Completa</h3>
                {ranking.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    >
                        <Card className={`p-4 ${user.isUser ? 'bg-blue-50 border-blue-300 border-2' : 'bg-white'}`}>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="relative">
                    <span className="text-gray-500 min-w-[24px] inline-block text-center">
                      {user.rank}º
                    </span>
                                        {user.rank <= 3 && (
                                            <Medal className={`w-4 h-4 absolute -top-1 -right-1 ${
                                                user.rank === 1 ? 'text-yellow-500' :
                                                    user.rank === 2 ? 'text-gray-400' :
                                                        'text-orange-600'
                                            }`} />
                                        )}
                                    </div>
                                    <Avatar className="w-10 h-10">
                                        <AvatarFallback className={`${user.isUser ? 'bg-blue-300' : 'bg-gray-200'}`}>
                                            {user.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className={`${user.isUser ? 'text-blue-800' : 'text-gray-800'}`}>
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-600">{user.points} pts</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    {user.change === "up" && (
                                        <Badge className="bg-green-500">↑</Badge>
                                    )}
                                    {user.change === "down" && (
                                        <Badge className="bg-red-500">↓</Badge>
                                    )}
                                    {user.change === "same" && (
                                        <Badge variant="outline" className="text-gray-600">-</Badge>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Challenge Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
            >
                <Card className="p-4 bg-gradient-to-r from-green-100 to-blue-100 border-green-300">
                    <div className="text-center">
                        <h4 className="text-gray-800 mb-2">{weeklyChallenge.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">
                            {weeklyChallenge.description}
                        </p>
                        <motion.button
                            className="px-6 py-2 bg-green-500 text-white rounded-lg"
                            whileTap={{ scale: 0.95 }}
                            onClick={handleJoinChallenge}
                        >
                            {weeklyChallenge.buttonText}
                        </motion.button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}