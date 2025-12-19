export interface Activity {
    id: string;
    name: string;
    icon: string;
    category: string;
    unit: 'minutes' | 'times' | 'liters';
    avgLitersPerUnit: number;
    hasBaseline: boolean;
}

export interface ActivityLog {
    id: string;
    activityId: string;
    activityName: string;
    icon: string;
    amount: number;
    liters: number;
    savedLiters: number;
    timestamp: string;
}

export interface UserBaselines {
    duche: number;        // minutos
    dentes: number;       // minutos
    loica: number;        // minutos
}

// ATIVIDADES
export const ACTIVITIES: Activity[] = [
    // Higiene pessoal
    { id: 'duche', name: 'Duche', icon: 'Droplet', category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 12, hasBaseline: true },
    { id: 'banho', name: 'Banho de imersão', icon: 'Bath', category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 20, hasBaseline: false },
    { id: 'lavar-maos', name: 'Lavar mãos', icon: 'Hand', category: 'Higiene pessoal', unit: 'times', avgLitersPerUnit: 2, hasBaseline: false },
    { id: 'lavar-dentes', name: 'Lavar dentes', icon: 'Sparkles', category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 3, hasBaseline: true },
    { id: 'fazer-barba', name: 'Fazer barba', icon: 'Scissors', category: 'Higiene pessoal', unit: 'minutes', avgLitersPerUnit: 4, hasBaseline: false },
    { id: 'lavar-rosto', name: 'Lavar rosto', icon: 'Sparkles', category: 'Higiene pessoal', unit: 'times', avgLitersPerUnit: 3, hasBaseline: false },

    // Cozinha / Torneiras
    { id: 'lavar-loica-mao', name: 'Lavar loiça à mão', icon: 'Utensils', category: 'Cozinha / Torneiras', unit: 'minutes', avgLitersPerUnit: 8, hasBaseline: true },
    { id: 'torneira-aberta', name: 'Torneira aberta', icon: 'Coffee', category: 'Cozinha / Torneiras', unit: 'minutes', avgLitersPerUnit: 10, hasBaseline: false },

    // Lavagem
    { id: 'maq-roupa', name: 'Máquina de lavar roupa', icon: 'Shirt', category: 'Lavagem', unit: 'times', avgLitersPerUnit: 60, hasBaseline: false },
    { id: 'maq-loica', name: 'Máquina de lavar loiça', icon: 'RotateCw', category: 'Lavagem', unit: 'times', avgLitersPerUnit: 15, hasBaseline: false },

/*    // Casa de banho
    { id: 'autoclismo', name: 'Autoclismo', icon: 'Circle', category: 'Casa de banho', unit: 'times', avgLitersPerUnit: 6 },
    { id: 'encher-banheira', name: 'Encher banheira', icon: 'Bath', category: 'Casa de banho', unit: 'times', avgLitersPerUnit: 150 },*/

    // Exterior / Outros
    { id: 'regar-plantas', name: 'Regar plantas', icon: 'Leaf', category: 'Exterior / Outros', unit: 'minutes', avgLitersPerUnit: 15, hasBaseline: false },
    { id: 'lavar-carro', name: 'Lavar carro', icon: 'Car', category: 'Exterior / Outros', unit: 'minutes', avgLitersPerUnit: 25, hasBaseline: false }
];

// HISTÓRICO INICIAL
export const INITIAL_ACTIVITY_LOG: ActivityLog[] = [
    {
        id: '1',
        activityId: 'banho',
        activityName: 'Banho de imersão',
        icon: 'Bath',
        amount: 5,
        liters: 100,
        savedLiters: 0,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
        id: '2',
        activityId: 'lavar-loica-mao',
        activityName: 'Lavar loiça à mão',
        icon: 'Utensils',
        amount: 10,
        liters: 80,
        savedLiters: 20,
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
        id: '3',
        activityId: 'maq-roupa',
        activityName: 'Máquina de lavar roupa',
        icon: 'Shirt',
        amount: 1,
        liters: 60,
        savedLiters: 0,
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString()
    }
];

// ATIVIDADES COM BASELINE
export const ACTIVITIES_WITH_BASELINE = ['duche', 'lavar-dentes', 'lavar-loica-mao'];

// ATIVIDADES COM BASELINE PREVISTO
export const ACTIVITY_TYPES_WITH_PREDICTED_BASELINE = [
    'banho',           // Higiene pessoal
    'fazer-barba',     // Higiene pessoal
    'lavar-rosto',     // Higiene pessoal
    'lavar-maos',      // Higiene pessoal
    'torneira-aberta', // Cozinha / Torneiras
    'maq-roupa',       // Lavagem (fixo)
    'maq-loica',       // Lavagem (fixo)
    'regar-plantas',   // Exterior / Outros (fixo)
    'lavar-carro'      // Exterior / Outros (fixo)
] as const;

// Chaves para localStorage
export const STORAGE_KEYS = {
    ACTIVITY_LOG: 'savedrop_activity_log',
    DASHBOARD: 'savedrop_dashboard'
};

// Categorias únicas
export const getUniqueCategories = () => Array.from(new Set(ACTIVITIES.map(a => a.category)));