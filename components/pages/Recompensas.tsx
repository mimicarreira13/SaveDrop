import { motion } from 'motion/react';
import { Trophy, Award, Star, Lock } from 'lucide-react';
import { Card } from '../ui/card';
import {cn} from '../ui/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

export function Recompensas() {
  const badges = [
    {
      id: 1,
      name: "Primeira Gota",
      description: "Registaste a tua primeira atividade",
      icon: "💧",
      unlocked: true,
      date: "01/12/2025"
    },
    {
      id: 2,
      name: "Semana Completa",
      description: "7 dias seguidos de poupança",
      icon: "🌊",
      unlocked: true,
      date: "07/12/2025"
    },
    {
      id: 3,
      name: "Economizador",
      description: "1000L poupados",
      icon: "⭐",
      unlocked: true,
      date: "19/12/2025"
    },
    {
      id: 4,
      name: "Mestre da Água",
      description: "30 dias seguidos de poupança",
      icon: "🏆",
      unlocked: false,
      progress: "19/30 dias"
    },
    {
      id: 5,
      name: "Guardião do Planeta",
      description: "5000L poupados",
      icon: "🌍",
      unlocked: false,
      progress: "1250/5000L"
    },
    {
      id: 6,
      name: "Inspiração",
      description: "Convide 5 amigos",
      icon: "🎯",
      unlocked: false,
      progress: "0/5 amigos"
    }
  ];

  const userLevel = 8;
  const userPoints = 1250;
  const nextLevelPoints = 1500;
  const levelProgress = (userPoints / nextLevelPoints) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-blue-600 mb-2">Recompensas</h1>
        <p className="text-gray-600">Conquistas e progresso</p>
      </motion.div>

      {/* Avatar and Level */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-green-500 text-white border-0">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-blue-300 text-blue-800">
                  <span className="text-3xl">💧</span>
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1">
              <h2 className="mb-1">Nível {userLevel}</h2>
              <p className="text-sm opacity-90 mb-2">Eco Guerreiro</p>
              <Progress
                  value={levelProgress}
                  color="white"
                  className="bg-white/30 h-2 mb-1"
              />
              <p className="text-xs opacity-90">{userPoints} / {nextLevelPoints} pontos</p>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div className="flex-1">
              <p className="text-2xl">3</p>
              <p className="text-xs opacity-90">Badges</p>
            </div>
            <div className="flex-1">
              <p className="text-2xl">{userPoints}</p>
              <p className="text-xs opacity-90">Pontos</p>
            </div>
            <div className="flex-1">
              <p className="text-2xl">4º</p>
              <p className="text-xs opacity-90">Ranking</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-gray-700">Conquistas</h3>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
            >
              <Card
                  className={cn(
                      "flex flex-col justify-between items-center text-center p-4 h-60",
                      badge.unlocked
                          ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300"
                          : "bg-gray-50 border-gray-300"
                  )}
              >
                <div className="relative mb-2">
                  <motion.div
                    className={`text-4xl mb-2 ${!badge.unlocked ? 'opacity-30' : ''}`}
                    animate={badge.unlocked ? {
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    {badge.icon}
                  </motion.div>
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <h4 className={`text-sm mb-1 ${!badge.unlocked ? 'text-gray-500' : 'text-gray-800'}`}>
                  {badge.name}
                </h4>
                <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                {badge.unlocked ? (
                    <Badge variant="outline" className="border-green-500 text-green-600 text-xs mx-auto block text-center">
                      {badge.date}
                    </Badge>
                ) : (
                  <p className="text-xs text-gray-500">{badge.progress}</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Bonus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500 rounded-full">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-800 mb-1">Bônus Diário</h4>
              <p className="text-sm text-gray-600">+50 pontos disponíveis hoje!</p>
            </div>
            <motion.button
              className="px-4 py-2 bg-purple-500 text-white rounded-lg"
              whileTap={{ scale: 0.9 }}
            >
              Resgatar
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
