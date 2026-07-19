import { supabase } from '../lib/supabase';
import type { ContactMessage, ContactMessageInsert, ContactMessageStatus, ContactMessageUpdate } from '../types/database.types';
import { createUuid, withCreateMetadata } from './service-utils';

const attachmentBucket = 'contact-attachments';
const attachmentRoot = 'contact-submissions';
const maxAttachmentSize = 10 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
    const extension = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const safeBaseName = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || 'attachment';

    return `${safeBaseName}${extension.toLowerCase()}`;
}

function buildAttachmentPath(messageId: string, file: File) {
    return `${attachmentRoot}/${messageId}/${Date.now()}-${sanitizeFileName(file.name)}`;
}

function getStorageUri(path: string) {
    return `supabase://${attachmentBucket}/${path}`;
}

export type ContactMessageSubmission = {
    name: string;
    email: string;
    phone: string;
    hiring_reason: string;
    project_details: string;
    attachment?: File | null;
};

export const contactMessagesService = {
    async getAll(): Promise<ContactMessage[]> {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async create(submission: ContactMessageSubmission): Promise<ContactMessage> {
        const messageId = createUuid();
        const attachment = submission.attachment instanceof File && submission.attachment.size > 0
            ? submission.attachment
            : null;
        let attachmentPayload: Pick<
            ContactMessageInsert,
            'attachment_bucket' | 'attachment_path' | 'attachment_url' | 'attachment_name' | 'attachment_size' | 'attachment_type'
        > = {};

        if (attachment) {
            const isPdf = attachment.type === 'application/pdf'
                || attachment.name.toLowerCase().endsWith('.pdf');
            if (!isPdf) {
                throw new Error('Only PDF files can be attached.');
            }
            if (attachment.size > maxAttachmentSize) {
                throw new Error('Attachment must be 10 MB or smaller.');
            }

            const attachmentPath = buildAttachmentPath(messageId, attachment);
            const { error: uploadError } = await supabase.storage
                .from(attachmentBucket)
                .upload(attachmentPath, attachment, {
                    cacheControl: '3600',
                    contentType: attachment.type || 'application/octet-stream',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            attachmentPayload = {
                attachment_bucket: attachmentBucket,
                attachment_path: attachmentPath,
                attachment_url: getStorageUri(attachmentPath),
                attachment_name: attachment.name,
                attachment_size: attachment.size,
                attachment_type: attachment.type || null,
            };
        }

        const payload = withCreateMetadata<ContactMessageInsert>({
            id: messageId,
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            hiring_reason: submission.hiring_reason,
            project_details: submission.project_details,
            status: 'new',
            source: 'contact_page',
            ...attachmentPayload,
        });

        const { error } = await supabase
            .from('contact_messages')
            .insert(payload);

        if (error) {
            if (attachmentPayload.attachment_path) {
                await supabase.storage.from(attachmentBucket).remove([attachmentPayload.attachment_path]).catch(() => undefined);
            }
            throw error;
        }

        return payload as ContactMessage;
    },

    async updateStatus(id: string, status: ContactMessageStatus): Promise<ContactMessage> {
        const { data, error } = await supabase
            .from('contact_messages')
            .update({ status, updated_at: new Date().toISOString() } satisfies ContactMessageUpdate)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(message: ContactMessage): Promise<void> {
        if (message.attachment_bucket && message.attachment_path) {
            const { error: storageError } = await supabase.storage
                .from(message.attachment_bucket)
                .remove([message.attachment_path]);

            if (storageError) throw storageError;
        }

        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', message.id);

        if (error) throw error;
    },

    async createAttachmentDownloadUrl(message: ContactMessage): Promise<string | null> {
        if (!message.attachment_bucket || !message.attachment_path) {
            return null;
        }

        const { data, error } = await supabase.storage
            .from(message.attachment_bucket)
            .createSignedUrl(message.attachment_path, 60 * 5, {
                download: message.attachment_name || true,
            });

        if (error) throw error;
        return data.signedUrl;
    },

    /**
     * Signed URL for viewing the attachment inline (e.g. in an <iframe>),
     * without forcing a download. Used by the admin preview panel.
     */
    async createAttachmentPreviewUrl(message: ContactMessage): Promise<string | null> {
        if (!message.attachment_bucket || !message.attachment_path) {
            return null;
        }

        const { data, error } = await supabase.storage
            .from(message.attachment_bucket)
            .createSignedUrl(message.attachment_path, 60 * 10);

        if (error) throw error;
        return data.signedUrl;
    },
};
