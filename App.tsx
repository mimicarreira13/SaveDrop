// src/App.tsx
'use client';
import { useState, useEffect } from 'react';
import { Dashboard } from './components/pages/Dashboard/Dashboard';
import { Metas } from './components/pages/Metas/Metas';
import { Recompensas } from './components/pages/Recompensas/Recompensas';
import { Ranking } from './components/pages/Ranking';
import { Mascote } from './components/pages/Mascote';
import { AdicionarConsumo } from './components/pages/AdicionarConsumo/AdicionarConsumo';
import { QuestionarioInicial } from './components/pages/QuestionarioInicial';
import { Droplet, Target, Trophy, Users, Heart } from 'lucide-react';
import { AppInitializer, initializeAppData } from './components/AppInitializer';

// Tipo para as baselines do utilizador
type UserBaselines = {
  duche: number;
  dentes: number;
  loica: number;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const [userBaselines, setUserBaselines] = useState<UserBaselines | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar no localStorage ao carregar
  useEffect(() => {
    // INICIALIZA OS DADOS DA APP PRIMEIRO
    initializeAppData();

    const completed = localStorage.getItem('waterApp_questionnaire') === 'completed';
    const savedBaselines = localStorage.getItem('waterApp_baselines');

    if (completed && savedBaselines) {
      try {
        const parsedBaselines = JSON.parse(savedBaselines);
        setUserBaselines(parsedBaselines);

        // Garante que os dados do dashboard existem para as metas
        if (!localStorage.getItem('savedrop_dashboard')) {
          localStorage.setItem('savedrop_dashboard', JSON.stringify({
            waterSaved: 1250,
            daysStreak: 6,
            goalWater: 2000,
            baseWaterSaved: 1250,
            accumulatedSavings: 0,
            lastUpdate: new Date().toISOString()
          }));
        }
      } catch (e) {
        console.error('Erro ao ler baselines:', e);
      }
    }

    setHasCompletedQuestionnaire(completed);
    setIsLoading(false);
  }, []);

  // Handler para completar o questionário
  const handleQuestionnaireComplete = (answers: UserBaselines) => {
    setUserBaselines(answers);
    setHasCompletedQuestionnaire(true);
    localStorage.setItem('waterApp_questionnaire', 'completed');
    localStorage.setItem('waterApp_baselines', JSON.stringify(answers));

    // Inicializa os dados da app após o questionário
    initializeAppData();
  };

  // Mostrar loading enquanto verifica
  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <Droplet className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">A carregar...</p>
          </div>
        </div>
    );
  }

  // Mostrar questionário se ainda não foi completado
  if (!hasCompletedQuestionnaire) {
    return <QuestionarioInicial onComplete={handleQuestionnaireComplete} />;
  }

  // App normal após questionário
  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        {/* Componente que inicializa dados */}
        <AppInitializer />

        {/* Mobile Container */}
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl flex flex-col">
          {/* Content Area */}
          <div className="flex-1 overflow-auto" style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
            {activeTab === 'dashboard' && (
                <Dashboard
                    onAdd={() => setActiveTab('adicionar')}
                    userBaselines={userBaselines}
                />
            )}
            {activeTab === 'metas' && <Metas />}
            {activeTab === 'recompensas' && <Recompensas />}
            {activeTab === 'ranking' && <Ranking />}
            {activeTab === 'mascote' && <Mascote />}
            {activeTab === 'adicionar' && (
                <AdicionarConsumo
                    onSave={() => setActiveTab('dashboard')}
                    onCancel={() => setActiveTab('dashboard')}
                    userBaselines={userBaselines}
                />
            )}
          </div>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg">
            <div className="flex justify-around items-center h-16">
              <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                      activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-400'
                  }`}
              >
                <Droplet className="w-6 h-6 mb-1" />
                <span className="text-xs">Início</span>
              </button>

              <button
                  onClick={() => setActiveTab('metas')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                      activeTab === 'metas' ? 'text-blue-600' : 'text-gray-400'
                  }`}
              >
                <Target className="w-6 h-6 mb-1" />
                <span className="text-xs">Metas</span>
              </button>

              <button
                  onClick={() => setActiveTab('mascote')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                      activeTab === 'mascote' ? 'text-blue-600' : 'text-gray-400'
                  }`}
              >
                <Heart className="w-6 h-6 mb-1" />
                <span className="text-xs">Mascote</span>
              </button>

              <button
                  onClick={() => setActiveTab('recompensas')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                      activeTab === 'recompensas' ? 'text-blue-600' : 'text-gray-400'
                  }`}
              >
                <Trophy className="w-6 h-6 mb-1" />
                <span className="text-xs">Recompensas</span>
              </button>

              <button
                  onClick={() => setActiveTab('ranking')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                      activeTab === 'ranking' ? 'text-blue-600' : 'text-gray-400'
                  }`}
              >
                <Users className="w-6 h-6 mb-1" />
                <span className="text-xs">Ranking</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
  );
}