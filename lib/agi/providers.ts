import logger from '@/lib/logger'

export type LLMProvider = 'groq';

export interface ProviderConfig {
    provider: LLMProvider;
    apiKey?: string;
    model: string;
    temperature: number;
    maxTokens: number;
}

export interface LLMResponse {
    content: string;
    tokensUsed: number;
    provider: LLMProvider;
    model: string;
}

async function callGroq(
    messages: Array<{ role: string; content: string }>,
    config: ProviderConfig
): Promise<LLMResponse> {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
                model: config.model,
                messages,
                temperature: config.temperature,
                max_tokens: config.maxTokens,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Groq] API Error:', errorText);
            throw new Error(`Groq API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        if (!content) {
            console.error('[Groq] Empty response:', data);
            throw new Error('Groq returned empty response');
        }

        logger.info({ model: config.model }, '[Groq] Success')

        return {
            content,
            tokensUsed: data.usage?.total_tokens || Math.ceil(content.length / 3),
            provider: 'groq',
            model: config.model,
        };
    } catch (error) {
        console.error('[Groq] Error:', error);
        throw error;
    }
}

/**
 * Estetia IA — LLM call via Groq
 */
export async function callLLM(
    messages: Array<{ role: string; content: string }>,
    userPlan: 'FREE' | 'PRO'
): Promise<LLMResponse> {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('Estetia IA indisponível: GROQ_API_KEY não configurada.')
    }

    const config: ProviderConfig = {
        provider: 'groq',
        apiKey: process.env.GROQ_API_KEY,
        model: userPlan === 'PRO' ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant',
        temperature: parseFloat(process.env.AGI_TEMPERATURE || '0.7'),
        maxTokens: userPlan === 'PRO' ? 2048 : 1024,
    }

    logger.info({ model: config.model, plan: userPlan }, '[Estetia IA] Calling Groq')
    return await callGroq(messages, config)
}
