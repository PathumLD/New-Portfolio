import { supabase } from '../lib/supabase';
import type { Skill, SkillInsert, SkillUpdate, SkillCategory } from '../types/database.types';

export const skillsService = {
    async getAll(): Promise<Skill[]> {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('category', { ascending: true })
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<Skill | null> {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async getByCategory(category: SkillCategory): Promise<Skill[]> {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .eq('category', category)
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async create(skill: SkillInsert): Promise<Skill> {
        const { data, error } = await supabase
            .from('skills')
            .insert(skill)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, skill: SkillUpdate): Promise<Skill> {
        const { data, error } = await supabase
            .from('skills')
            .update({ ...skill, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
