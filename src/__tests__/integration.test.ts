import { taxCalculator } from '@/lib/taxCalculator';
import { dataService } from '@/services/dataService';

describe('Integration Flow', () => {
    it('should calculate tax from fetched transactions', async () => {
        const transactions = await dataService.fetchTransactions();
        const result = taxCalculator.calculateTaxLiability(transactions, 'NEW');
        expect(result).toBeDefined();
        expect(result.regime).toBe('NEW');
    });
});
