import { UserBaselines, ACTIVITY_TYPES_WITH_PREDICTED_BASELINE, ACTIVITIES} from './atividadesData';

export interface PredictedBaselines {
    [activityId: string]: number;
}

export const calculatePredictedBaselines = (
    userBaselines: UserBaselines,
    activityId: string,
    activityUnit: 'minutes' | 'times' | 'liters'
): number | null => {
    const { duche, dentes, loica } = userBaselines;

    // Mapeamento de previsões baseadas nas respostas do questionário
    const predictions: Record<string, (() => number) | number> = {
        // Higiene pessoal
        'banho': () => Math.round(duche * 1.2), // Banho de imersão demora mais que duche
        'fazer-barba': () => Math.round(dentes * 1.5), // Barba demora mais que lavar dentes
        'lavar-rosto': () => Math.max(1, Math.round(dentes / 2)), // 1-2x/dia, proporcional a dentes
        'lavar-maos': () => Math.max(2, Math.round(dentes * 0.7)), // Mais frequente, mas menor tempo

        // Cozinha / Torneiras
        'torneira-aberta': () => Math.round(loica * 1.1), // Ligeiramente mais que lavar loiça

        // Lavagem (fixo - baseado em padrões semanais)
        'maq-roupa': 2, // 2 vezes por semana
        'maq-loica': 3, // 3 vezes por semana

        // Exterior / Outros (fixo)
        'regar-plantas': 8, // 8 minutos em média
        'lavar-carro': 20, // 20 minutos em média
    };

    const prediction = predictions[activityId];

    if (prediction === undefined) {
        return null; // Não há previsão para esta atividade
    }

    // Se é uma função, calcula o valor
    if (typeof prediction === 'function') {
        return prediction();
    }

    // Se é um valor fixo, retorna-o
    return prediction;
};

// Função para obter baseline (real ou predita) para qualquer atividade
export const getBaselineForActivity = (
    activityId: string,
    userBaselines?: UserBaselines
): number | null => {
    if (!userBaselines) return null;

    // Baselines fornecidas pelo usuário
    const baselineMap: Record<string, keyof UserBaselines> = {
        'duche': 'duche',
        'lavar-dentes': 'dentes',
        'lavar-loica-mao': 'loica'
    };

    // Se for uma atividade com baseline direta do questionário
    const directBaselineKey = baselineMap[activityId];
    if (directBaselineKey) {
        return userBaselines[directBaselineKey];
    }

    // Se for uma atividade com baseline predita
    const activity = ACTIVITIES.find(a => a.id === activityId);
    if (activity && activity.hasBaseline === false) {
        // Temos baseline predita para esta atividade?
        if (ACTIVITY_TYPES_WITH_PREDICTED_BASELINE.includes(activityId as any)) {
            return calculatePredictedBaselines(userBaselines, activityId, activity.unit);
        }
    }

    return null; // Sem baseline (nem direta nem predita)
};

// Função para verificar se atividade pode ter baseline (direta ou predita)
export const hasAnyBaseline = (activityId: string): boolean => {
    const baselineActivities = ['duche', 'lavar-dentes', 'lavar-loica-mao'];
    const predictedBaselineActivities = ACTIVITY_TYPES_WITH_PREDICTED_BASELINE;

    return baselineActivities.includes(activityId) ||
        predictedBaselineActivities.includes(activityId as any);
};