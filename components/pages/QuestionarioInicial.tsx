// File: `components/pages/QuestionarioInicial.tsx`
import React, { useState } from 'react';
import { Droplet, ArrowRight, Check } from 'lucide-react';

interface QuestionarioInicialProps {
    onComplete: (answers: {
        duche: number;
        dentes: number;
        loica: number;
    }) => void;
}

export const QuestionarioInicial: React.FC<QuestionarioInicialProps> = ({ onComplete }) => {
    const [answers, setAnswers] = useState({
        duche: 8, // valor padrão
        dentes: 2, // valor padrão
        loica: 15, // valor padrão
    });

    const handleSubmit = () => {
        onComplete(answers);
    };

    const updateAnswer = (activity: keyof typeof answers, value: string) => {
        const numValue = parseInt(value) || 0;
        setAnswers(prev => ({
            ...prev,
            [activity]: numValue
        }));
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-6 flex flex-col">
            {/* Header */}
            <div className="text-center mb-8 pt-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplet className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    Para uma melhor experiência
                </h1>
                <p className="text-gray-600">
                    Quanto tempo demora a fazer estas tarefas?
                </p>
            </div>

            {/* Formulário */}
            <div className="flex-1 space-y-8">
                {/* Duche */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">🚿</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Tomar duche</h3>
                                <p className="text-sm text-gray-500">Em minutos</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{answers.duche}</div>
                            <div className="text-sm text-gray-500">minutos</div>
                        </div>
                    </div>

                    <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={answers.duche}
                        onChange={(e) => updateAnswer('duche', e.target.value)}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>2 min</span>
                        <span>15 min</span>
                        <span>30 min</span>
                    </div>
                </div>

                {/* Lavar dentes */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600 font-bold">😁</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Lavar os dentes</h3>
                                <p className="text-sm text-gray-500">Em minutos (torneira aberta)</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{answers.dentes}</div>
                            <div className="text-sm text-gray-500">minutos</div>
                        </div>
                    </div>

                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={answers.dentes}
                        onChange={(e) => updateAnswer('dentes', e.target.value)}
                        className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>1 min</span>
                        <span>5 min</span>
                        <span>10 min</span>
                    </div>
                </div>

                {/* Lavar loiça */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span className="text-yellow-600 font-bold">🍽️</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Lavar a loiça</h3>
                                <p className="text-sm text-gray-500">Em minutos por sessão</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-yellow-600">{answers.loica}</div>
                            <div className="text-sm text-gray-500">minutos</div>
                        </div>
                    </div>

                    <input
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        value={answers.loica}
                        onChange={(e) => updateAnswer('loica', e.target.value)}
                        className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>5 min</span>
                        <span>30 min</span>
                        <span>60 min</span>
                    </div>
                </div>
            </div>

            {/* Botão de continuar */}
            <div className="pt-8 pb-6">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg"
                >
                    <span>Começar a poupar água</span>
                    <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                    Estes valores serão usados como referência para calcular as suas poupanças
                </p>
            </div>
        </div>
    );
};