// Ficheiro: pages/Mascote/mascoteData.ts

import happyImg from '../../../assets/images/Happy.png';
import worriedImg from '../../../assets/images/worried.png';
import sadImg from '../../../assets/images/sad.png';

export type MascotMood = 'happy' | 'worried' | 'sad';

export interface MascotState {
    mood: MascotMood;
    message: string;
    tip: string;
    color: string;
    bgColor: string;
    borderColor: string;
    emoji: string;
}

export interface MascotConfig {
    moodThresholds: {
        happy: number;     // Acima deste valor = happy
        worried: number;   // Entre worried e happy = worried
        sad: number;       // Abaixo deste valor = sad
    };
    messages: Record<MascotMood, MascotState>;
    stats: {
        daysActive: number;
        badgesCount: number;
    };
    interactionTips: string[];
}

// Limiares para determinar humor baseado na poupança (em litros)
export const MOOD_THRESHOLDS = {
    happy: 2000,    // Acima de 2000L = feliz
    worried: 1000,  // Entre 1000-2000L = preocupado
    sad: 0          // Abaixo de 1000L = triste
};

// Estados da mascote
export const MASCOT_STATES: Record<MascotMood, MascotState> = {
    happy: {
        mood: 'happy',
        message: 'Ótimo trabalho! Estás a poupar muita água!',
        tip: 'A tua dedicação está a fazer uma grande diferença para o planeta! 🌍 Continua assim!',
        color: 'text-green-500',
        bgColor: 'bg-green-500',
        borderColor: 'border-green-300',
        emoji: '😊'
    },
    worried: {
        mood: 'worried',
        message: 'Continua atento ao teu consumo.',
        tip: 'Cada pequena ação conta. Vamos juntos poupar mais água! 💧',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500',
        borderColor: 'border-amber-300',
        emoji: '😐'
    },
    sad: {
        mood: 'sad',
        message: 'Há algum tempo que não poupas água...',
        tip: 'Não desanimes! Pequenas mudanças fazem grande diferença. Vamos recomeçar? 🌱',
        color: 'text-red-400',
        bgColor: 'bg-red-400',
        borderColor: 'border-red-300',
        emoji: '😢'
    }
};

// Dados das imagens
export const MASCOT_IMAGES = {
    happy: typeof happyImg === 'string' ? happyImg : (happyImg as { src: string }).src,
    worried: typeof worriedImg === 'string' ? worriedImg : (worriedImg as { src: string }).src,
    sad: typeof sadImg === 'string' ? sadImg : (sadImg as { src: string }).src
};

// Dicas de interação
export const INTERACTION_TIPS = [
    '💧 Regista o teu consumo diariamente',
    '🎯 Alcança as tuas metas semanais',
    '🌟 Desbloqueia badges para mantê-lo feliz',
    '📊 Monitoriza o teu progresso no dashboard',
    '🏆 Participa nos desafios do ranking'
];

// Estatísticas iniciais (serão atualizadas com dados reais)
export const INITIAL_STATS = {
    daysActive: 12,
    badgesCount: 8
};