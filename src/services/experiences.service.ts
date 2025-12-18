import { supabase } from '../lib/supabase';
import type { Experience, ExperienceInsert, ExperienceUpdate } from '../types/database.types';

export const experiencesService = {
    async getAll(): Promise<Experience[]> {
        const { data, error } = await supabase
            .from('experiences')
            .select('*')
            .order('start_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<Experience | null> {
        const { data, error } = await supabase
            .from('experiences')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(experience: ExperienceInsert): Promise<Experience> {
        const { data, error } = await supabase
            .from('experiences')
            .insert(experience)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, experience: ExperienceUpdate): Promise<Experience> {
        const { data, error } = await supabase
            .from('experiences')
            .update({ ...experience, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('experiences')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
