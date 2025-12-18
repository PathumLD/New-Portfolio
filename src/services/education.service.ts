import { supabase } from '../lib/supabase';
import type { Education, EducationInsert, EducationUpdate } from '../types/database.types';

export const educationService = {
    async getAll(): Promise<Education[]> {
        const { data, error } = await supabase
            .from('education')
            .select('*')
            .order('start_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<Education | null> {
        const { data, error } = await supabase
            .from('education')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(education: EducationInsert): Promise<Education> {
        const { data, error } = await supabase
            .from('education')
            .insert(education)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, education: EducationUpdate): Promise<Education> {
        const { data, error } = await supabase
            .from('education')
            .update({ ...education, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('education')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
