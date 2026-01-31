// AI-SPECIFIC TYPES FOR REAL-TIME INTELLIGENCE LAYER

export type InsightType =
    | 'DEDUCTION_OPPORTUNITY'
    | 'TAX_SAVING'
    | 'REGIME_SWITCH'
    | 'DEADLINE_REMINDER'
    | 'ANOMALY_DETECTED'
    | 'DEPRECIATION_ALERT';

export type AlertUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AssetType =
    | 'ELECTRONICS'
    | 'EQUIPMENT'
    | 'FURNITURE'
    | 'VEHICLE'
    | 'OTHER';

export interface AIInsight {
    type: InsightType;
    message: string;
    suggestedAction: string;
    confidence: number; // 0-100
    timestamp: string; // ISO format
}

export interface SmartAlert {
    id: string;
    title: string;
    description: string;
    urgency: AlertUrgency;
    actionable: boolean;
    metadata: {
        category?: string;
        potentialSavings?: number;
        deadline?: string;
        transactionId?: string;
        [key: string]: any;
    };
}

export interface DeprecationTracker {
    assetName: string;
    purchaseDate: string; // ISO format
    cost: number;
    depreciationRate: number; // Percentage
    yearlyWriteOff: {
        year: number;
        deduction: number;
        remainingValue: number;
    }[];
    taxBenefit: number; // Total tax benefit over asset lifetime
}

export interface ContextualOpportunity {
    opportunity: string;
    context: string;
    immediateAction: string;
    deadline: string; // ISO format
    potentialSavings: number;
}

// Supporting types for Gemini service
export interface TransactionClassification {
    category: string;
    taxSection?: string; // e.g., "80C", "80D", "Section 37"
    deductible: boolean;
    confidence: number;
    reasoning: string;
}

export interface DeprecationAdvice {
    assetType: AssetType;
    depreciationRate: number;
    yearlySchedule: {
        year: number;
        deduction: number;
        bookValue: number;
    }[];
    taxSavings: number;
    recommendations: string[];
}

export interface Nudge {
    nudge: string;
    action: string;
    savings: number;
    timestamp: string;
}

// Request/Response types for API routes
export interface SmartAlertsRequest {
    transactions: any[]; // TaxTransaction[] from tax.ts
    grossIncome: number;
    employmentType: 'SALARIED' | 'FREELANCER' | 'BUSINESS';
    currentDate: string; // ISO format
}

export interface DepreciationTrackerRequest {
    assetName: string;
    purchaseDate: string;
    cost: number;
    assetType: AssetType;
}

export interface ContextualOpportunitiesRequest {
    currentDate: string;
    grossIncome: number;
    employmentType: 'SALARIED' | 'FREELANCER' | 'BUSINESS';
    spendingPattern: {
        category: string;
        monthlyAverage: number;
        claimed: boolean;
    }[];
}

export interface BatchProcessRequest {
    transactions: any[];
    updateDatabase?: boolean;
}

export interface BatchProcessResponse {
    classifications: TransactionClassification[];
    processed: number;
    failed: number;
    errors?: string[];
}
