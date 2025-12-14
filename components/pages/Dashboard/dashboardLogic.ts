import { LITERS_PER_BOTTLE, LITERS_PER_SHORT_SHOWER, LITERS_PER_HANDWASH } from './dashboardData';

// Funções de cálculo PURAS (sem JSX, sem React)
export const calculateEquivalents = (waterSaved: number) => ({
    bottles: Math.floor(waterSaved / LITERS_PER_BOTTLE),
    showers: Math.floor(waterSaved / LITERS_PER_SHORT_SHOWER),
    handwashes: Math.floor(waterSaved / LITERS_PER_HANDWASH)
});

export const getRandomEquivalence = (waterSaved: number) => {
    const equivalents = calculateEquivalents(waterSaved);

    // Se for menor que o base (1250), mostra mensagem de alerta
    if (waterSaved < 1250) {
        const messages = [
            `⚠️ Atenção! Consumo acima do normal`,
            `📈 Estás a gastar mais água que o habitual`,
            `💡 Tem espaço para melhorar o consumo`,
            `🌍 Cada gota conta para o planeta`,
            `🚰 Podes reduzir o consumo de água`
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    const messages = [
        `Equivalente a ${equivalents.showers} duches mais curtos 🚿`,
        `Equivalente a ${equivalents.bottles} garrafas de água 💧`,
        `Água suficiente para lavar as mãos ${equivalents.handwashes} vezes 🧼`,
        "Baseado nos teus registos diários 💙",
        "Estimativa calculada a partir das tuas atividades"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
};

// Função para calcular dados das estatísticas (apenas valores)
export const calculateStatsValues = (
    waterSaved: number,
    goalWater: number,
    daysStreak: number
) => {
    const progressPercentage = Math.round((waterSaved / goalWater) * 100);

    return [
        {
            label: "Progresso",
            value: `${Math.min(Math.max(progressPercentage, 0), 100)}%` // Limita entre 0% e 100%
        },
        {
            label: "Sequência",
            value: `${daysStreak} dias`
        }
    ];
};

// Funções de localStorage
export const loadDashboardFromStorage = (): { waterSaved: number; daysStreak: number } => {
    try {
        // Tenta carregar do dashboard normal
        const dashboardData = localStorage.getItem('savedrop_dashboard');
        if (dashboardData) {
            const parsed = JSON.parse(dashboardData);

            // Se já tem dados, retorna-os
            if (parsed.waterSaved !== undefined && parsed.daysStreak !== undefined) {
                return {
                    waterSaved: parsed.waterSaved,
                    daysStreak: parsed.daysStreak
                };
            }
        }

        // Fallback: verifica se há logs para calcular o valor
        const savedLogs = localStorage.getItem('savedrop_activity_log');
        if (savedLogs) {
            try {
                const logs = JSON.parse(savedLogs);
                if (Array.isArray(logs) && logs.length > 0) {
                    // Calcula o total baseado nos logs
                    const totalSavedFromActivities = logs.reduce((total, log) => total + (log.savedLiters || 0), 0);
                    const totalWaterSaved = 1250 + totalSavedFromActivities; // Base + poupanças

                    return {
                        waterSaved: totalWaterSaved,
                        daysStreak: 10
                    };
                }
            } catch (e) {
                console.error('Erro ao calcular a partir dos logs:', e);
            }
        }

        // Fallback para valores antigos
        const savedWater = localStorage.getItem('dashboard_waterSaved');
        const savedStreak = localStorage.getItem('dashboard_daysStreak');

        return {
            waterSaved: savedWater ? Number(savedWater) : 1250,
            daysStreak: savedStreak ? Number(savedStreak) : 10
        };
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        return { waterSaved: 1250, daysStreak: 10 };
    }
};

export const saveDashboardToStorage = (waterSaved: number, daysStreak: number) => {
    try {
        // Calcula as poupanças acumuladas (removendo o base)
        const accumulatedSavings = waterSaved - 1250;

        // Salva no formato novo
        localStorage.setItem('savedrop_dashboard', JSON.stringify({
            waterSaved,
            daysStreak,
            goalWater: 2000,
            lastUpdate: new Date().toISOString(),
            baseWaterSaved: 1250,
            accumulatedSavings
        }));

        // Mantém compatibilidade com o formato antigo
        localStorage.setItem('dashboard_waterSaved', waterSaved.toString());
        localStorage.setItem('dashboard_daysStreak', daysStreak.toString());

    } catch (error) {
        console.error('Erro ao guardar dashboard:', error);
    }
};

// Função para atualizar streak
export const updateStreak = (currentStreak: number): number => {
    const lastActivity = localStorage.getItem('last_activity_date');
    const today = new Date().toDateString();

    if (lastActivity === today) {
        return currentStreak; // Já atualizou hoje
    }

    if (lastActivity) {
        const lastDate = new Date(lastActivity);
        const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutivo
            return currentStreak + 1;
        } else if (diffDays > 1) {
            // Quebrou a sequência
            return 1;
        }
    }

    localStorage.setItem('last_activity_date', today);
    return currentStreak;
};

// Função para obter apenas as poupanças acumuladas (sem o base)
export const getAccumulatedSavings = (): number => {
    try {
        const dashboardData = localStorage.getItem('savedrop_dashboard');
        if (dashboardData) {
            const parsed = JSON.parse(dashboardData);
            return parsed.accumulatedSavings || 0;
        }
        return 0;
    } catch (error) {
        return 0;
    }
};