import type { IncomingMessage, ServerResponse } from 'node:http';
import { Resend } from 'resend';

type RequestWithBody = IncomingMessage & {
  body?: unknown;
};

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  hiringReason?: unknown;
  projectDetails?: unknown;
  attachment?: {
    name?: unknown;
    size?: unknown;
    type?: unknown;
    content?: unknown;
  } | null;
};

type NormalizedContactPayload = {
  name: string;
  email: string;
  phone: string;
  hiringReason: string;
  projectDetails: string;
  attachment: ContactPayload['attachment'];
};

const resend = new Resend(process.env.RESEND_API_KEY);

const contactEmailTo = process.env.CONTACT_EMAIL_TO || 'pathumlk.diz@gmail.com';
const contactEmailFrom = process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
const maxAttachmentSize = 2 * 1024 * 1024;

function sendJson(res: ServerResponse, statusCode: number, payload: Record<string, unknown>) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatFileSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) {
    return 'unknown size';
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

async function readJsonBody(req: RequestWithBody) {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  const chunks: Buffer[] = [];
  let totalSize = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalSize += buffer.length;

    if (totalSize > 4 * 1024 * 1024) {
      throw new Error('Request body is too large.');
    }

    chunks.push(buffer);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
}

function getEmailAttachment(attachment: NormalizedContactPayload['attachment']) {
  const filename = asString(attachment?.name);
  const content = asString(attachment?.content);
  const contentType = asString(attachment?.type);
  const size = typeof attachment?.size === 'number' ? attachment.size : 0;

  if (!filename || !content) {
    return null;
  }

  if (size > maxAttachmentSize) {
    throw new Error('Attachment is too large.');
  }

  return {
    filename,
    content,
    contentType: contentType || undefined,
  };
}

function buildEmailContent(payload: NormalizedContactPayload) {
  const attachment = payload.attachment;
  const attachmentName = asString(attachment?.name);
  const attachmentSize = typeof attachment?.size === 'number' ? attachment.size : 0;
  const attachmentType = asString(attachment?.type) || 'unknown type';
  const attachmentLine = attachmentName
    ? `${attachmentName} (${formatFileSize(attachmentSize)}, ${attachmentType})`
    : 'No attachment provided';

  const text = [
    'New portfolio contact form submission',
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Reason: ${payload.hiringReason}`,
    `Attachment: ${attachmentLine}`,
    '',
    'Project details:',
    payload.projectDetails,
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #18181b; line-height: 1.55;">
      <h2 style="margin: 0 0 16px;">New portfolio contact form submission</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tr>
          <td style="border: 1px solid #e4e4e7; padding: 10px; font-weight: 700;">Name</td>
          <td style="border: 1px solid #e4e4e7; padding: 10px;">${escapeHtml(payload.name)}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #e4e4e7; padding: 10px; font-weight: 700;">Email</td>
          <td style="border: 1px solid #e4e4e7; padding: 10px;">${escapeHtml(payload.email)}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #e4e4e7; padding: 10px; font-weight: 700;">Phone</td>
          <td style="border: 1px solid #e4e4e7; padding: 10px;">${escapeHtml(payload.phone)}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #e4e4e7; padding: 10px; font-weight: 700;">Reason</td>
          <td style="border: 1px solid #e4e4e7; padding: 10px;">${escapeHtml(payload.hiringReason)}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #e4e4e7; padding: 10px; font-weight: 700;">Attachment</td>
          <td style="border: 1px solid #e4e4e7; padding: 10px;">${escapeHtml(attachmentLine)}</td>
        </tr>
      </table>
      <h3 style="margin: 24px 0 8px;">Project details</h3>
      <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(payload.projectDetails)}</p>
    </div>
  `;

  return { html, text };
}

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    sendJson(res, 500, { message: 'Email service is not configured.' });
    return;
  }

  try {
    const body = await readJsonBody(req);

    if (!isRecord(body)) {
      sendJson(res, 400, { message: 'Invalid contact form payload.' });
      return;
    }

    const payload: ContactPayload = body;
    const name = asString(payload.name);
    const email = asString(payload.email);
    const phone = asString(payload.phone);
    const hiringReason = asString(payload.hiringReason);
    const projectDetails = asString(payload.projectDetails);

    if (!name || !email || !phone || !hiringReason || !projectDetails) {
      sendJson(res, 400, { message: 'Please complete every required field.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      sendJson(res, 400, { message: 'Please enter a valid email address.' });
      return;
    }

    const normalizedPayload = {
      name,
      email,
      phone,
      hiringReason,
      projectDetails,
      attachment: payload.attachment,
    };
    const { html, text } = buildEmailContent(normalizedPayload);
    const emailAttachment = getEmailAttachment(normalizedPayload.attachment);

    const { error } = await resend.emails.send({
      from: contactEmailFrom,
      to: [contactEmailTo],
      replyTo: email,
      subject: `Portfolio contact: ${name}`,
      html,
      text,
      attachments: emailAttachment ? [emailAttachment] : undefined,
    });

    if (error) {
      console.error('Resend contact email error:', error);
      sendJson(res, 502, { message: 'Unable to send your message right now.' });
      return;
    }

    sendJson(res, 200, { message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact form error:', error);
    sendJson(res, 500, { message: 'Something went wrong while sending your message.' });
  }
}
