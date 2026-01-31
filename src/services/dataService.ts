import { TaxTransaction } from '@/types/tax';

// Agent A to implement
export const dataService = {
    fetchTransactions: async (): Promise<TaxTransaction[]> => {
        // TODO: Implement API fetch or CSV parsing
        return [];
    },

    syncBankData: async (bankId: string): Promise<void> => {
        // TODO: Implement bank sync
        console.log('Syncing bank:', bankId);
    },
};
