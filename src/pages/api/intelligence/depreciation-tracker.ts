import type { NextApiRequest, NextApiResponse } from 'next';
import {
    DeprecationTracker,
    DepreciationTrackerRequest,
    AssetType,
} from '@/types/intelligence';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DeprecationTracker | { error: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            assetName,
            purchaseDate,
            cost,
            assetType,
        } = req.body as DepreciationTrackerRequest;

        // Validate inputs
        if (!assetName || !purchaseDate || !cost || !assetType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Standard depreciation rates based on Indian tax law
        const depreciationRates: Record<AssetType, { year1: number; subsequent: number }> = {
            ELECTRONICS: { year1: 0.40, subsequent: 0.20 }, // 40% year 1, 20% subsequent
            EQUIPMENT: { year1: 0.50, subsequent: 0.25 },   // 50% year 1, 25% subsequent
            FURNITURE: { year1: 0.10, subsequent: 0.10 },   // 10% per year
            VEHICLE: { year1: 0.20, subsequent: 0.20 },     // 20% per year
            OTHER: { year1: 0.15, subsequent: 0.15 },       // 15% per year
        };

        const rates = depreciationRates[assetType];
        if (!rates) {
            return res.status(400).json({ error: 'Invalid asset type' });
        }

        // Calculate depreciation schedule (5 years)
        const yearlyWriteOff: { year: number; deduction: number; remainingValue: number }[] = [];
        let remainingValue = cost;
        const TAX_SLAB = 0.30; // 30% tax slab for calculation

        for (let year = 1; year <= 5; year++) {
            const rate = year === 1 ? rates.year1 : rates.subsequent;
            const deduction = remainingValue * rate;
            remainingValue -= deduction;

            yearlyWriteOff.push({
                year,
                deduction: Math.round(deduction),
                remainingValue: Math.round(remainingValue),
            });

            // Stop if remaining value is negligible
            if (remainingValue < 100) {
                break;
            }
        }

        // Calculate total tax benefit
        const totalDeductions = yearlyWriteOff.reduce((sum, item) => sum + item.deduction, 0);
        const taxBenefit = Math.round(totalDeductions * TAX_SLAB);

        // Calculate depreciation rate (weighted average)
        const depreciationRate = ((rates.year1 + rates.subsequent) / 2) * 100;

        const tracker: DeprecationTracker = {
            assetName,
            purchaseDate,
            cost,
            depreciationRate,
            yearlyWriteOff,
            taxBenefit,
        };

        return res.status(200).json(tracker);
    } catch (error) {
        console.error('Error calculating depreciation:', error);
        return res.status(500).json({ error: 'Failed to calculate depreciation' });
    }
}
