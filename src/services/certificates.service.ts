import { supabase } from '../lib/supabase';
import type { Certificate, CertificateInsert, CertificateUpdate } from '../types/database.types';

export const certificatesService = {
    async getAll(): Promise<Certificate[]> {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('issued_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<Certificate | null> {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(certificate: CertificateInsert): Promise<Certificate> {
        const { data, error } = await supabase
            .from('certificates')
            .insert(certificate)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, certificate: CertificateUpdate): Promise<Certificate> {
        const { data, error } = await supabase
            .from('certificates')
            .update({ ...certificate, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('certificates')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
