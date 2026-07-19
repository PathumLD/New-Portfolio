import { supabase } from '../lib/supabase';

export type ReplyType = 'booking' | 'message';

export interface SendReplyInput {
    type: ReplyType;
    to: string;
    name?: string;
    message: string;
    link?: string;
}

export const emailService = {
    /**
     * Sends a confirmation reply email to a client via the `send-reply`
     * Supabase Edge Function. The admin's session token is attached
     * automatically by supabase-js, and the function enforces admin access.
     */
    async sendReply(input: SendReplyInput): Promise<{ id?: string }> {
        const { data, error } = await supabase.functions.invoke('send-reply', {
            body: {
                type: input.type,
                to: input.to,
                name: input.name,
                message: input.message,
                link: input.link?.trim() || undefined,
            },
        });

        if (error) {
            // Edge function returns a JSON error body; surface it when available.
            let message = error.message || 'Unable to send email.';
            const context = (error as { context?: Response }).context;
            if (context && typeof context.json === 'function') {
                try {
                    const body = await context.json();
                    if (body?.error) message = body.error;
                } catch {
                    // Ignore parse errors and fall back to the default message.
                }
            }
            throw new Error(message);
        }

        return data ?? {};
    },
};
