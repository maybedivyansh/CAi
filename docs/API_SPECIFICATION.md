# API Specification & Types

## Shared Types (`src/types/tax.ts`)

### `TaxTransaction`
Represents a single financial transaction.
```typescript
interface TaxTransaction {
  id: string;
  date: Date;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  category: string;
}
```

### `TaxSummary`
Output of the tax calculator.
```typescript
interface TaxSummary {
  totalIncome: number;
  taxableIncome: number;
  taxPayable: number;
  regime: 'OLD' | 'NEW';
}
```

### `HarvestOpportunity`
Recommendation for tax saving.
```typescript
interface HarvestOpportunity {
  assetName: string;
  currentLoss: number;
  action: 'SELL';
}
```
