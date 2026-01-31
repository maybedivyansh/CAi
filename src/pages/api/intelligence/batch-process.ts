import type { NextApiRequest, NextApiResponse } from 'next';
import {
    BatchProcessRequest,
    BatchProcessResponse,
    TransactionClassification,
} from '@/types/intelligence';
import { classifyTransaction } from '@/services/geminiService';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BatchProcessResponse | { error: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { transactions, updateDatabase = false } = req.body as BatchProcessRequest;

        if (!transactions || !Array.isArray(transactions)) {
            return res.status(400).json({ error: 'Invalid transactions array' });
        }

        const BATCH_SIZE = 10;
        const classifications: TransactionClassification[] = [];
        const errors: string[] = [];
        let processed = 0;
        let failed = 0;

        // Split transactions into batches
        const batches: any[][] = [];
        for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
            batches.push(transactions.slice(i, i + BATCH_SIZE));
        }

        // Process each batch in parallel
        for (const batch of batches) {
            const batchPromises = batch.map(async (transaction) => {
                try {
                    const classification = await classifyTransaction(transaction);
                    classifications.push(classification);
                    processed++;
                    return classification;
                } catch (error) {
                    failed++;
                    const errorMsg = `Failed to classify transaction ${transaction.id}: ${(error as Error).message}`;
                    errors.push(errorMsg);
                    console.error(errorMsg);
                    return null;
                }
            });

            // Wait for batch to complete before moving to next
            await Promise.all(batchPromises);

            // Small delay between batches to avoid rate limiting
            if (batches.indexOf(batch) < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Optional: Update database with classifications
        if (updateDatabase) {
            // TODO: Implement database update logic
            // This would integrate with Part 1 (Data Services)
            console.log('Database update requested but not implemented yet');
        }

        const response: BatchProcessResponse = {
            classifications,
            processed,
            failed,
            ...(errors.length > 0 && { errors }),
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in batch processing:', error);
        return res.status(500).json({ error: 'Failed to process transactions' });
    }
}
