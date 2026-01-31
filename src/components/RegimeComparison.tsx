import React from 'react';

// Agent C to implement
export const RegimeComparison = () => {
    return (
        <div className="flex justify-between">
            <div className="w-1/2 p-2 bg-gray-100">
                <h3>Old Regime</h3>
                <p>₹ 1,20,000</p>
            </div>
            <div className="w-1/2 p-2 bg-green-100">
                <h3>New Regime</h3>
                <p>₹ 1,15,000</p>
            </div>
        </div>
    );
};
