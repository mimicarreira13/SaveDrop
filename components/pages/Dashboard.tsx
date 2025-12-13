'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, TrendingDown, Calendar, Plus } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Card } from '../ui/card';
import { WaterDropAnimation } from './WaterDropAnimation';
import { Button } from '../ui/button';

interface DashboardProps {
  onAdd?: () => void;
}

export function Dashboard({ onAdd }: DashboardProps) {
  const waterSaved = 1250; // litros economizados
  const goalWater = 2000; // meta mensal
  const progressPercentage = (waterSaved / goalWater) * 100;
  const daysStreak = 12;

  const LITERS_PER_BOTTLE = 1.5;
  const LITERS_PER_SHORT_SHOWER = 50;
  const LITERS_PER_HANDWASH = 2;
  const equivalentBottles = Math.floor(waterSaved / LITERS_PER_BOTTLE);
  const equivalentShowers = Math.floor(waterSaved / LITERS_PER_SHORT_SHOWER);
  const equivalentHandwashes = Math.floor(waterSaved / LITERS_PER_HANDWASH);

  const motivationalMessages = [
    "Excelente trabalho! Continua assim! 💧",
    "Estás a fazer a diferença! 🌍",
    "Cada gota conta para o planeta! 🌱",
    "Parabéns pela poupança! 🎉"
  ];

  const equivalenceMessages = [
    () => `Equivalente a ${equivalentShowers} duches mais curtos 🚿`,
    () => `Equivalente a ${equivalentBottles} garrafas de água 💧`,
    () => `Água suficiente para lavar as mãos ${equivalentHandwashes} vezes 🧼`,
    () => "Baseado nos teus registos diários 💙",
    () => "Estimativa calculada a partir das tuas atividades"
  ];


  const [randomMessage, setRandomMessage] = useState('');
  const [randomEquivalence, setRandomEquivalence] = useState('');

  useEffect(() => {
    const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    const eq = equivalenceMessages[Math.floor(Math.random() * equivalenceMessages.length)]();
    setRandomMessage(msg);
    setRandomEquivalence(eq);
  }, []);

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
                <span className="text-4xl">{waterSaved}</span>
                <span className="opacity-90">/ {goalWater}L</span>
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
              className="w-full h-12 bg-blue-600 text-xl text-white shadow-lg flex items-center justify-center"
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
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-full">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Redução</p>
              <p className="text-blue-600">35%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-full">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sequência</p>
              <p className="text-green-600">{daysStreak} dias</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="mb-3 text-gray-700">Dicas Rápidas</h3>
        <div className="space-y-2">
          <Card className="p-3 bg-white border-gray-200">
            <p className="text-sm text-gray-700">💡 Desligue a torneira ao escovar os dentes</p>
          </Card>
          <Card className="p-3 bg-white border-gray-200">
            <p className="text-sm text-gray-700">🚿 Reduza o tempo do banho em 2 minutos</p>
          </Card>
          <Card className="p-3 bg-white border-gray-200">
            <p className="text-sm text-gray-700">🌱 Reutilize água da máquina de lavar</p>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
