import { supabase } from '../lib/supabase';
import type { Project, ProjectInsert, ProjectUpdate } from '../types/database.types';

export const projectsService = {
    async getAll(): Promise<Project[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<Project | null> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async getByCategory(category: string): Promise<Project[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async create(project: ProjectInsert): Promise<Project> {
        const { data, error } = await supabase
            .from('projects')
            .insert(project)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, project: ProjectUpdate): Promise<Project> {
        const { data, error } = await supabase
            .from('projects')
            .update({ ...project, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
