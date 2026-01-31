export interface TaxTransaction {
    id: string;
    date: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    category: string;
    description?: string;
}

export interface TaxSummary {
    totalIncome: number;
    taxableIncome: number;
    taxPayable: number;
    regime: 'OLD' | 'NEW';
}

export interface HarvestOpportunity {
    assetName: string;
    purchaseDate: string;
    purchasePrice: number;
    currentPrice: number;
    unrealizedLoss: number;
}
