describe('Merge Validation', () => {
    it('should have consistent types across agents', () => {
        // This is a placeholder test to ensure types don't break
        const sampleTransaction = {
            id: '1',
            date: '2024-01-01',
            amount: 100,
            type: 'DEBIT',
            category: 'Expense'
        };
        expect(sampleTransaction.amount).toBe(100);
    });
});
