import { supabase } from '../lib/supabase';
import type { Award, AwardInsert, AwardUpdate } from '../types/database.types';

export const awardsService = {
    async getAll(): Promise<Award[]> {
        const { data, error } = await supabase
            .from('awards')
            .select('*')
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
            .insert(award)
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
