// Ficheiro: pages/Recompensas/storageHelper.ts

// Helper para gerenciar integração com dados existentes
export class RecompensasStorage {
    static readonly SAVINGS_KEY = 'waterSavings';
    static readonly BONUS_KEY = 'bonusPoints';
    static readonly LAST_CLAIM_KEY = 'lastBonusClaim';

    static getLitrosPoupados(): number {
        try {
            const data = localStorage.getItem(this.SAVINGS_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                return parsed.totalLitros || parsed.totalLitrosPoupados || 0;
            }
        } catch (error) {
            console.error('Erro ao obter litros poupados:', error);
        }
        return 0;
    }

    static getBonusPoints(): number {
        try {
            const points = localStorage.getItem(this.BONUS_KEY);
            return points ? parseInt(points, 10) : 0;
        } catch (error) {
            console.error('Erro ao obter pontos bónus:', error);
            return 0;
        }
    }

    static saveBonusPoints(points: number): void {
        try {
            localStorage.setItem(this.BONUS_KEY, points.toString());

            // Marcar como resgatado hoje
            const today = new Date().toDateString();
            localStorage.setItem(this.LAST_CLAIM_KEY, today);
        } catch (error) {
            console.error('Erro ao salvar pontos bónus:', error);
        }
    }

    static hasClaimedBonusToday(): boolean {
        try {
            const today = new Date().toDateString();
            const lastClaim = localStorage.getItem(this.LAST_CLAIM_KEY);
            return lastClaim === today;
        } catch (error) {
            console.error('Erro ao verificar bónus:', error);
            return false;
        }
    }
}