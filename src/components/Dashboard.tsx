import React, { useEffect, useState } from 'react';
import { TaxSummary } from '@/types/tax';

// Agent C to implement
export default function Dashboard() {
    const [summary, setSummary] = useState<TaxSummary | null>(null);

    useEffect(() => {
        // TODO: Fetch data and calculate tax
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Tax-Loss Shadow Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded shadow">
                    <h2 className="text-xl">Tax Summary</h2>
                    {/* TODO: Add TaxTemperatureGauge */}
                    <p>Loading...</p>
                </div>
                <div className="p-4 border rounded shadow">
                    <h2 className="text-xl">Opportunities</h2>
                    {/* TODO: Add ShadowAlertCard */}
                    <p>No alerts</p>
                </div>
            </div>
        </div>
    );
}
