import type { NextApiRequest, NextApiResponse } from 'next';
import { streamNudges } from '@/services/geminiService';
import { Nudge } from '@/types/intelligence';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for Nginx

    // Get user data from query params or body
    const { transactions, grossIncome } = req.query;

    let parsedTransactions: any[] = [];
    let parsedGrossIncome = 0;

    try {
        if (typeof transactions === 'string') {
            parsedTransactions = JSON.parse(transactions);
        }
        if (typeof grossIncome === 'string') {
            parsedGrossIncome = parseFloat(grossIncome);
        }
    } catch (error) {
        res.write(`data: ${JSON.stringify({ error: 'Invalid query parameters' })}\n\n`);
        res.end();
        return;
    }

    // Send initial connection message
    res.write(`data: ${JSON.stringify({
        type: 'connected',
        message: 'Real-time intelligence stream started'
    })}\n\n`);

    // Heartbeat interval to keep connection alive
    const heartbeatInterval = setInterval(() => {
        res.write(`: heartbeat\n\n`);
    }, 30000); // Every 30 seconds

    // Handle client disconnect
    req.on('close', () => {
        clearInterval(heartbeatInterval);
        console.log('Client disconnected from proactive nudges stream');
    });

    try {
        // Stream nudges using Gemini AI
        const nudgeStream = streamNudges({
            transactions: parsedTransactions,
            grossIncome: parsedGrossIncome,
        });

        for await (const nudge of nudgeStream) {
            // Send nudge to client
            res.write(`data: ${JSON.stringify(nudge)}\n\n`);

            // Check if client is still connected
            if (req.socket.destroyed) {
                break;
            }
        }

        // Stream completed
        res.write(`data: ${JSON.stringify({
            type: 'completed',
            message: 'All nudges processed'
        })}\n\n`);

    } catch (error) {
        console.error('Error in proactive nudges stream:', error);
        res.write(`data: ${JSON.stringify({
            type: 'error',
            message: 'Failed to generate nudges',
            error: (error as Error).message
        })}\n\n`);
    } finally {
        clearInterval(heartbeatInterval);
        res.end();
    }
}

// Disable Next.js body parsing for SSE
export const config = {
    api: {
        bodyParser: false,
    },
};
