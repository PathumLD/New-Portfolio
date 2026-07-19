import { supabase } from '../lib/supabase';
import type { ProjectCategoryRecord, ProjectCategoryRecordInsert, ProjectCategoryRecordUpdate } from '../types/database.types';
import { withCreateMetadata } from './service-utils';

export const projectCategoriesService = {
    async getAll(): Promise<ProjectCategoryRecord[]> {
        const { data, error } = await supabase
            .from('project_categories')
            .select('*')
            .order('display_order', { ascending: true })
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async create(category: ProjectCategoryRecordInsert): Promise<ProjectCategoryRecord> {
        const { data, error } = await supabase
            .from('project_categories')
            .insert(withCreateMetadata(category))
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, category: ProjectCategoryRecordUpdate): Promise<ProjectCategoryRecord> {
        const { data, error } = await supabase
            .from('project_categories')
            .update({ ...category, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('project_categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
