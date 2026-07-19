// Supabase Edge Function: send-reply
//
// Sends a reply email (booking or order confirmation) to a client via Resend.
// The Resend API key never leaves the server. Only the authenticated admin
// may call this function.
//
// Required secrets (set with `supabase secrets set ...`):
//   RESEND_API_KEY    - Resend API key
//   RESEND_FROM_EMAIL - Verified sender, e.g. "Pathum <contact@pathumld.com>"
//   ADMIN_EMAIL       - Email of the admin allowed to send replies
// Optional:
//   RESEND_REPLY_TO   - Reply-To address (defaults to ADMIN_EMAIL)

import { createClient } from 'jsr:@supabase/supabase-js@2';

type ReplyType = 'booking' | 'message';

interface ReplyPayload {
    type: ReplyType;
    to: string;
    name?: string;
    message: string;
    link?: string;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const subjectByType: Record<ReplyType, string> = {
    booking: 'Booking Confirmed',
    message: 'Order Confirmed',
};

function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildHtml(payload: ReplyPayload) {
    const heading = payload.type === 'booking' ? 'Your booking is confirmed' : 'Your order is confirmed';
    const greeting = payload.name ? `Hi ${escapeHtml(payload.name)},` : 'Hi,';
    const bodyHtml = escapeHtml(payload.message).replace(/\n/g, '<br />');
    const linkLabel = payload.type === 'booking' ? 'Join the meeting' : 'Open link';

    const linkBlock = payload.link
        ? `<div style="margin:24px 0;">
             <a href="${escapeHtml(payload.link)}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;font-size:15px;">${linkLabel}</a>
           </div>
           <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Or copy this link: <a href="${escapeHtml(payload.link)}" style="color:#059669;">${escapeHtml(payload.link)}</a></p>`
        : '';

    return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:32px 40px 8px;">
                <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">${heading}</h1>
                <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">${greeting}</p>
                <div style="margin:0 0 8px;color:#374151;font-size:15px;line-height:1.7;">${bodyHtml}</div>
                ${linkBlock}
                <p style="margin:24px 0 0;color:#374151;font-size:15px;line-height:1.6;">Best regards,<br />Pathum Lakshan Dissanayake</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 32px;border-top:1px solid #f3f4f6;">
                <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.5;">You are receiving this email because you contacted Pathum through the portfolio website. If this wasn't you, simply ignore this message.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildText(payload: ReplyPayload) {
    const greeting = payload.name ? `Hi ${payload.name},` : 'Hi,';
    const linkLine = payload.link ? `\n\nLink: ${payload.link}` : '';
    return `${greeting}\n\n${payload.message}${linkLine}\n\nBest regards,\nPathum Lakshan Dissanayake`;
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const resendFrom = Deno.env.get('RESEND_FROM_EMAIL') || Deno.env.get('RESEND_FROM');
    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    const replyTo = Deno.env.get('RESEND_REPLY_TO') || adminEmail;
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!resendApiKey || !resendFrom || !supabaseUrl || !supabaseAnonKey) {
        return jsonResponse({ error: 'Email service is not configured.' }, 500);
    }

    // Authenticate the caller and ensure they are the admin.
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return jsonResponse({ error: 'Missing authorization.' }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
        return jsonResponse({ error: 'Invalid session.' }, 401);
    }
    if (adminEmail && userData.user.email !== adminEmail) {
        return jsonResponse({ error: 'Not authorized.' }, 403);
    }

    let payload: ReplyPayload;
    try {
        payload = await req.json();
    } catch {
        return jsonResponse({ error: 'Invalid request body.' }, 400);
    }

    if (payload.type !== 'booking' && payload.type !== 'message') {
        return jsonResponse({ error: 'Invalid reply type.' }, 400);
    }
    if (!payload.to || !payload.message?.trim()) {
        return jsonResponse({ error: 'Recipient and message are required.' }, 400);
    }

    const emailBody = {
        from: resendFrom,
        to: [payload.to],
        subject: subjectByType[payload.type],
        html: buildHtml(payload),
        text: buildText(payload),
        reply_to: replyTo,
        // A List-Unsubscribe header is a positive trust signal for Gmail/Outlook
        // and helps keep authenticated mail out of the spam folder.
        headers: replyTo
            ? {
                'List-Unsubscribe': `<mailto:${replyTo}?subject=Unsubscribe>`,
            }
            : undefined,
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailBody),
    });

    if (!resendResponse.ok) {
        const detail = await resendResponse.text();
        return jsonResponse({ error: 'Failed to send email.', detail }, 502);
    }

    const result = await resendResponse.json();
    return jsonResponse({ success: true, id: result.id });
});
