// File: `App.tsx`
'use client';
import { useState } from 'react';
import { Dashboard } from './components/pages/Dashboard';
import { Metas } from './components/pages/Metas';
import { Recompensas } from './components/pages/Recompensas';
import { Ranking } from './components/pages/Ranking';
import { Mascote } from './components/pages/Mascote';
import { AdicionarConsumo } from './components/pages/AdicionarConsumo';
import { Droplet, Target, Trophy, Users, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        {/* Mobile Container */}
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl flex flex-col">
          {/* Content Area */}
          <div className="flex-1 overflow-auto" style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
            {activeTab === 'dashboard' && <Dashboard onAdd={() => setActiveTab('adicionar')} />}
            {activeTab === 'metas' && <Metas />}
            {activeTab === 'recompensas' && <Recompensas />}
            {activeTab === 'ranking' && <Ranking />}
            {activeTab === 'mascote' && <Mascote />}
            {activeTab === 'adicionar' && (
                <AdicionarConsumo
                    onSave={() => setActiveTab('dashboard')}
                    onCancel={() => setActiveTab('dashboard')}
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