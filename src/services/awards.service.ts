import { supabase } from '../lib/supabase';
import type { Award, AwardInsert, AwardUpdate } from '../types/database.types';
import { withCreateMetadata } from './service-utils';

export const awardsService = {
    async getAll(): Promise<Award[]> {
        const { data, error } = await supabase
            .from('awards')
            .select('*')
            .order('display_order', { ascending: true })
            .order('issued_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<Award | null> {
        const { data, error } = await supabase
            .from('awards')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(award: AwardInsert): Promise<Award> {
        const { data, error } = await supabase
            .from('awards')
            .insert(withCreateMetadata(award))
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, award: AwardUpdate): Promise<Award> {
        const { data, error } = await supabase
            .from('awards')
            .update({ ...award, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('awards')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
