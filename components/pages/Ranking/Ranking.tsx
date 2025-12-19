// Ficheiro: pages/Ranking/Ranking.tsx
'use client';

import { motion } from 'motion/react';
import { Trophy, Medal, RefreshCw } from 'lucide-react';
import { Card } from '../../ui/card';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { useRanking } from './useRanking';

export function Ranking() {
    const {
        ranking,
        userStats,
        weeklyChallenge,
        isLoading,
        userPoints,
        lastUpdate,
        handleJoinChallenge,
        refreshRanking
    } = useRanking();

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Top 3 para o pódio
    const podiumUsers = ranking.slice(0, 3);
    const userRank = ranking.find(u => u.isUser);
    const userPosition = userRank?.rank || 4;

    return (
        <div className="p-6 space-y-6">
            {/* Header com botão de atualizar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-blue-600 mb-2">Ranking Social</h1>
                    <p className="text-gray-600">Compare o seu progresso</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Atualizado: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <Button
                    onClick={refreshRanking}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-600"
                    title="Atualizar ranking"
                >
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </motion.div>

            {/* Stats Cards - AGORA DINÂMICAS */}
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
                            <p className={`font-medium ${stat.color}`}>{stat.value}</p>
                        </Card>
                    );
                })}
            </motion.div>

            {/* Info do usuário */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-700">A sua pontuação atual</p>
                        <p className="text-2xl text-blue-600 font-bold">{userPoints} pontos</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {userPoints - 1250 >= 0}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-blue-800">{userPosition}º</div>
                        <p className="text-xs text-gray-600">Posição atual</p>
                    </div>
                </div>
            </Card>

            {/* Top 3 Podium - AGORA DINÂMICO */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="p-6 bg-gradient-to-br from-yellow-50 via-gray-50 to-orange-50 border-yellow-200">
                    <div className="flex items-end justify-center gap-4 mb-4">
                        {/* 2nd Place */}
                        {podiumUsers[1] && (
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <Avatar className="w-12 h-12 mb-2 border-2 border-gray-400">
                                    <AvatarFallback className="bg-gray-200 text-gray-700">
                                        {podiumUsers[1].avatar}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="w-16 h-16 bg-gray-400 rounded-t-lg flex items-center justify-center">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{podiumUsers[1].points} pts</p>
                            </motion.div>
                        )}

                        {/* 1st Place */}
                        {podiumUsers[0] && (
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Trophy className="w-6 h-6 text-yellow-500 mb-1" />
                                <Avatar className="w-16 h-16 mb-2 border-4 border-yellow-500 shadow-lg">
                                    <AvatarFallback className="bg-yellow-200 text-yellow-700">
                                        {podiumUsers[0].avatar}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="w-16 h-24 bg-yellow-500 rounded-t-lg flex items-center justify-center">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{podiumUsers[0].points} pts</p>
                            </motion.div>
                        )}

                        {/* 3rd Place */}
                        {podiumUsers[2] && (
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <Avatar className="w-12 h-12 mb-2 border-2 border-orange-600">
                                    <AvatarFallback className="bg-orange-200 text-orange-700">
                                        {podiumUsers[2].avatar}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="w-16 h-12 bg-orange-600 rounded-t-lg flex items-center justify-center">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{podiumUsers[2].points} pts</p>
                            </motion.div>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Full Ranking List - AGORA COM POSIÇÕES DINÂMICAS */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-gray-700">Classificação Completa</h3>
                    <span className="text-sm text-gray-500">{ranking.length} participantes</span>
                </div>

                {ranking.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    >
                        <Card className={`p-4 ${user.isUser ? 'bg-blue-50 border-blue-300 border-2' : 'bg-white'} transition-all duration-300`}>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                    {/* Posição com medalha para top 3 */}
                                    <div className="relative">
                                        <span className={`text-gray-700 min-w-[24px] inline-block text-center font-medium ${
                                            user.rank <= 3 ? 'text-lg' : 'text-base'
                                        }`}>
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

                                    {/* Avatar */}
                                    <Avatar className="w-10 h-10">
                                        <AvatarFallback className={`${user.isUser ? 'bg-blue-300' : 'bg-gray-200'}`}>
                                            {user.avatar}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Nome e pontos */}
                                    <div className="flex-1">
                                        <p className={`font-medium ${user.isUser ? 'text-blue-800' : 'text-gray-800'}`}>
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {user.points} pontos
                                            {user.isUser && userPoints > 1250 }
                                        </p>
                                    </div>
                                </div>

                                {/* Indicador de mudança */}
                                <div className="flex flex-col items-end gap-1">
                                    {user.change === "up" && (
                                        <Badge className="bg-green-100 text-green-800 border-green-300">
                                            ↑ Subiu
                                        </Badge>
                                    )}
                                    {user.change === "down" && (
                                        <Badge className="bg-red-100 text-red-800 border-red-300">
                                            ↓ Desceu
                                        </Badge>
                                    )}
                                    {user.change === "same" && (
                                        <Badge variant="outline" className="text-gray-600 border-gray-300">
                                            ➡ Estável
                                        </Badge>
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
                        <p className="text-xs text-gray-500 mb-3">
                            Complete e ganhe +100 pontos de bónus!
                        </p>
                        <motion.button
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
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