// Ficheiro: pages/Mascote/mascoteLogic.ts

import { MascotMood, MOOD_THRESHOLDS } from './mascoteData';
import { getCurrentDashboardData } from '../../../utils/dataSync';

// Determinar humor baseado na poupança de água
export function determineMood(waterSaved: number): MascotMood {
    if (waterSaved >= MOOD_THRESHOLDS.happy) {
        return 'happy';
    } else if (waterSaved >= MOOD_THRESHOLDS.worried) {
        return 'worried';
    } else {
        return 'sad';
    }
}

// Obter dados reais de poupança
export function getWaterSaved(): number {
    try {
        const dashboardData = getCurrentDashboardData();
        return dashboardData.waterSaved;
    } catch (error) {
        console.error('Erro ao obter água poupada:', error);
        return 1250; // valor base
    }
}

// Calcular dias ativos baseado no streak
export function getDaysActive(): number {
    try {
        const dashboardData = getCurrentDashboardData();
        return dashboardData.daysStreak || 12;
    } catch (error) {
        console.error('Erro ao obter dias ativos:', error);
        return 12;
    }
}

// Calcular badges desbloqueados (pode ser integrado com recompensas depois)
export function getBadgesCount(): number {
    try {
        // Pode integrar com sistema de recompensas mais tarde
        const badgesData = localStorage.getItem('recompensas_badges');
        if (badgesData) {
            const badges = JSON.parse(badgesData);
            return badges.filter((badge: any) => badge.unlocked).length;
        }
        return 8; // valor inicial
    } catch (error) {
        console.error('Erro ao obter badges:', error);
        return 8;
    }
}

// Gerar mensagem motivacional baseada no progresso
export function getMotivationalMessage(currentMood: MascotMood, waterSaved: number): string {
    const baseMessages = {
        happy: [
            'Incrível! Estás a ser um verdadeiro herói da água! 💪',
            'O planeta agradece o teu esforço! 🌍',
            'Com este ritmo, vais inspirar muitos outros! ✨'
        ],
        worried: [
            'Estás no bom caminho! Continua a melhorar! 📈',
            'Cada gota conta! Pequenos passos levam a grandes resultados! 💧',
            'Falta pouco para alcançares o próximo nível! 🎯'
        ],
        sad: [
            'Não desistas! Cada dia é uma nova oportunidade! 🌱',
            'Vamos começar com pequenas mudanças hoje? 💙',
            'Juntos podemos fazer melhor! O Splashy acredita em ti! 🤝'
        ]
    };

    const messages = baseMessages[currentMood];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Calcular progresso até próximo humor
export function calculateNextMoodProgress(waterSaved: number): {
    nextMood: MascotMood;
    progress: number;
    remaining: number;
} {
    let nextMood: MascotMood = 'happy';
    let target = MOOD_THRESHOLDS.happy;

    if (waterSaved < MOOD_THRESHOLDS.worried) {
        nextMood = 'worried';
        target = MOOD_THRESHOLDS.worried;
    } else if (waterSaved < MOOD_THRESHOLDS.happy) {
        nextMood = 'happy';
        target = MOOD_THRESHOLDS.happy;
    } else {
        // Já está no máximo, mostrar manutenção
        return {
            nextMood: 'happy',
            progress: 100,
            remaining: 0
        };
    }

    const progress = Math.min((waterSaved / target) * 100, 100);
    const remaining = Math.max(target - waterSaved, 0);

    return { nextMood, progress, remaining };
}