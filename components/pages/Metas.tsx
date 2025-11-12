import { motion } from 'motion/react';
import { Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

export function Metas() {
  const goals = [
    {
      id: 1,
      title: "Poupar 2000L este mês",
      current: 1250,
      target: 2000,
      status: "active",
      icon: Target
    },
    {
      id: 2,
      title: "Reduzir 40% do consumo",
      current: 35,
      target: 40,
      status: "active",
      icon: TrendingUp
    },
    {
      id: 3,
      title: "10 dias seguidos",
      current: 10,
      target: 10,
      status: "completed",
      icon: CheckCircle2
    },
  ];

  const history = [
    { month: "Novembro", saved: 1250, status: "current" },
    { month: "Outubro", saved: 2150, status: "completed" },
    { month: "Setembro", saved: 1890, status: "completed" },
    { month: "Agosto", saved: 1670, status: "completed" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-blue-600 mb-2">As Suas Metas</h1>
        <p className="text-gray-600 font-bold bold">Acompanhe o seu progresso</p>
      </motion.div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h3 className="text-gray-700">Objetivos Ativos</h3>
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          const progress = (goal.current / goal.target) * 100;
          const isCompleted = goal.status === "completed";

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`p-4 ${isCompleted ? 'bg-green-50 border-green-300' : 'bg-white'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{goal.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {goal.current} / {goal.target}{goal.id === 1 ? 'L' : goal.id === 3 ? '%' : ' dias'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isCompleted && (
                    <Badge className="bg-green-500">Concluída</Badge>
                  )}
                  {!isCompleted && (
                    <Badge variant="outline" className="border-blue-500 text-blue-600">Ativa</Badge>
                  )}
                </div>
                <Progress
                    value={isCompleted ? 100 : progress}
                    color={isCompleted ? "green" : "blue"}
                    animate={!isCompleted}
                    className={`h-2 ${isCompleted ? "bg-green-200 opacity-40" : ""}`}
                />
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* History */}
      <div className="space-y-4">
        <h3 className="text-gray-700">Histórico</h3>
        <div className="space-y-3">
          {history.map((item, index) => (
            <motion.div
              key={item.month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`p-4 ${item.status === 'current' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.status === 'current' ? (
                      <Clock className="w-5 h-5 text-blue-500" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <p className="text-gray-800">{item.month}</p>
                      <p className="text-sm text-gray-600">{item.saved}L poupados</p>
                    </div>
                  </div>
                  {item.status === 'current' && (
                    <Badge variant="outline" className="border-blue-500 text-blue-600">Atual</Badge>
                  )}
                  {item.status === 'completed' && (
                    <Badge className="bg-green-500">✓</Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add New Goal Button */}
      <motion.button
        className="w-full p-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-md"
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        + Adicionar Nova Meta
      </motion.button>
    </div>
  );
}
