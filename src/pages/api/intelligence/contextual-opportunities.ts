import type { NextApiRequest, NextApiResponse } from 'next';
import {
    ContextualOpportunity,
    ContextualOpportunitiesRequest,
} from '@/types/intelligence';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ContextualOpportunity[] | { error: string }>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            currentDate,
            grossIncome,
            employmentType,
            spendingPattern,
        } = req.body as ContextualOpportunitiesRequest;

        const opportunities: ContextualOpportunity[] = [];
        const now = new Date(currentDate);
        const month = now.getMonth() + 1; // 1-12
        const day = now.getDate();
        const year = now.getFullYear();

        // Calculate effective tax rate
        const effectiveTaxRate = calculateEffectiveTaxRate(grossIncome);

        // 1. TIME-SENSITIVE OPPORTUNITIES

        // March 1-31: Tax season investment opportunities
        if (month === 3) {
            // Calculate 80C utilization
            const section80CSpending = spendingPattern.find(p => p.category === '80C');
            const current80C = section80CSpending?.monthlyAverage ? section80CSpending.monthlyAverage * 12 : 0;
            const remaining80C = 150000 - current80C;

            if (remaining80C > 0 && effectiveTaxRate > 18) {
                const potentialSavings = Math.round(remaining80C * 0.3);
                opportunities.push({
                    opportunity: 'Max out 80C limit before year-end',
                    context: `It's March. You've invested ₹${Math.round(current80C).toLocaleString()} of ₹1.5L allowed in 80C.`,
                    immediateAction: `Invest ₹${Math.round(remaining80C).toLocaleString()} in mutual funds (ELSS) or PPF before March 31 to drop to lower tax bracket.`,
                    deadline: `${year}-03-31`,
                    potentialSavings,
                });
            }

            // General tax season reminder
            if (day >= 15) {
                opportunities.push({
                    opportunity: 'Final tax-saving window',
                    context: 'Only 2 weeks left in financial year.',
                    immediateAction: 'Review all pending deductions: 80C, 80D, HRA, Section 37. File claims immediately.',
                    deadline: `${year}-03-31`,
                    potentialSavings: 50000, // Estimated
                });
            }
        }

        // February 28 - March 15: ITR filing deadline warning
        if ((month === 2 && day >= 28) || (month === 3 && day <= 15)) {
            opportunities.push({
                opportunity: 'ITR filing deadline approaching',
                context: 'Filing deadline is March 31.',
                immediateAction: 'Gather all receipts, Form 16, investment proofs. Claim all pending expenses now.',
                deadline: `${year}-03-31`,
                potentialSavings: 0,
            });
        }

        // April 1-15: New financial year planning
        if (month === 4 && day <= 15) {
            opportunities.push({
                opportunity: 'Plan tax strategy for new financial year',
                context: 'New FY started. Set up systematic tax-saving investments.',
                immediateAction: 'Start SIP in ELSS mutual funds, review insurance coverage (80D), plan professional expenses.',
                deadline: `${year + 1}-03-31`,
                potentialSavings: Math.round(grossIncome * 0.15), // Estimated 15% savings
            });
        }

        // 2. SPENDING PATTERN OPPORTUNITIES

        // Unclaimed rent (HRA opportunity)
        const rentSpending = spendingPattern.find(p =>
            p.category.toLowerCase().includes('rent') && !p.claimed
        );
        if (rentSpending && rentSpending.monthlyAverage > 10000) {
            const annualRent = rentSpending.monthlyAverage * 12;
            const hraBenefit = Math.min(annualRent * 0.5, grossIncome * 0.4); // Simplified HRA calculation
            const potentialSavings = Math.round(hraBenefit * 0.3);

            opportunities.push({
                opportunity: 'Claim HRA deduction for rent',
                context: `You spend ₹${Math.round(rentSpending.monthlyAverage).toLocaleString()}/month on rent but haven't claimed HRA.`,
                immediateAction: `Get rent agreement and landlord's PAN. Claim HRA deduction of ₹${Math.round(hraBenefit).toLocaleString()}/year.`,
                deadline: `${year}-03-31`,
                potentialSavings,
            });
        }

        // Professional expenses for freelancers
        if (employmentType === 'FREELANCER') {
            const professionalSpending = spendingPattern.find(p =>
                p.category === 'Section 37' || p.category === 'Professional'
            );
            const currentProfessional = professionalSpending?.monthlyAverage || 0;

            // If spending less than 20% of income on professional expenses
            if (currentProfessional * 12 < grossIncome * 0.2) {
                const potentialDeduction = grossIncome * 0.2 - (currentProfessional * 12);
                const potentialSavings = Math.round(potentialDeduction * 0.3);

                opportunities.push({
                    opportunity: 'Maximize Section 37 professional deductions',
                    context: `As a freelancer, you can claim up to 20-30% of income as professional expenses. Currently claiming only ${((currentProfessional * 12 / grossIncome) * 100).toFixed(1)}%.`,
                    immediateAction: 'Track and claim: internet, phone, coworking space, software subscriptions, equipment, client meetings.',
                    deadline: `${year}-03-31`,
                    potentialSavings,
                });
            }
        }

        // 3. REGIME-SWITCHING OPPORTUNITIES

        // Calculate potential savings from regime switch
        const oldRegimeTax = calculateOldRegimeTax(grossIncome, spendingPattern);
        const newRegimeTax = calculateNewRegimeTax(grossIncome);
        const regimeDifference = Math.abs(oldRegimeTax - newRegimeTax);

        if (regimeDifference > 25000) {
            const betterRegime = oldRegimeTax < newRegimeTax ? 'Old Regime' : 'New Regime';
            const currentRegime = oldRegimeTax < newRegimeTax ? 'New Regime' : 'Old Regime';

            opportunities.push({
                opportunity: `Switch to ${betterRegime}`,
                context: `You're currently in ${currentRegime}. ${betterRegime} saves you ₹${Math.round(regimeDifference).toLocaleString()} this year.`,
                immediateAction: `Review deductions and switch to ${betterRegime}. Deadline to switch: March 31.`,
                deadline: `${year}-03-31`,
                potentialSavings: Math.round(regimeDifference),
            });
        }

        // 4. INVESTMENT OPPORTUNITIES BASED ON TAX SLAB

        // High tax slab (>30%) - aggressive tax saving
        if (effectiveTaxRate >= 30) {
            opportunities.push({
                opportunity: 'High tax bracket - Aggressive tax planning needed',
                context: `Your effective tax rate is ${effectiveTaxRate}%. You're in the highest tax bracket.`,
                immediateAction: 'Max out all deductions: 80C (₹1.5L), 80D (₹25K), NPS (₹50K), HRA. Consider tax-free bonds.',
                deadline: `${year}-03-31`,
                potentialSavings: Math.round((150000 + 25000 + 50000) * 0.3), // ₹67,500
            });
        }

        // Sort by potential savings (highest first)
        opportunities.sort((a, b) => b.potentialSavings - a.potentialSavings);

        return res.status(200).json(opportunities);
    } catch (error) {
        console.error('Error generating contextual opportunities:', error);
        return res.status(500).json({ error: 'Failed to generate opportunities' });
    }
}

// Helper functions
function calculateEffectiveTaxRate(grossIncome: number): number {
    // Simplified New Regime calculation
    if (grossIncome <= 300000) return 0;
    if (grossIncome <= 600000) return 5;
    if (grossIncome <= 900000) return 10;
    if (grossIncome <= 1200000) return 15;
    if (grossIncome <= 1500000) return 20;
    return 30;
}

function calculateOldRegimeTax(
    grossIncome: number,
    spendingPattern: { category: string; monthlyAverage: number; claimed: boolean }[]
): number {
    // Calculate total deductions
    let deductions = 0;

    const section80C = spendingPattern.find(p => p.category === '80C');
    if (section80C) deductions += Math.min(section80C.monthlyAverage * 12, 150000);

    const section80D = spendingPattern.find(p => p.category === '80D');
    if (section80D) deductions += Math.min(section80D.monthlyAverage * 12, 25000);

    const standardDeduction = 50000;
    deductions += standardDeduction;

    const taxableIncome = Math.max(0, grossIncome - deductions);

    // Old regime slabs
    let tax = 0;
    if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
    if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.20;
    if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;

    return tax;
}

function calculateNewRegimeTax(grossIncome: number): number {
    let tax = 0;
    if (grossIncome > 300000) tax += Math.min(grossIncome - 300000, 300000) * 0.05;
    if (grossIncome > 600000) tax += Math.min(grossIncome - 600000, 300000) * 0.10;
    if (grossIncome > 900000) tax += Math.min(grossIncome - 900000, 300000) * 0.15;
    if (grossIncome > 1200000) tax += Math.min(grossIncome - 1200000, 300000) * 0.20;
    if (grossIncome > 1500000) tax += (grossIncome - 1500000) * 0.30;

    return tax;
}
