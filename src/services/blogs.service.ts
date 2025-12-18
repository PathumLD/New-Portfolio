import { supabase } from '../lib/supabase';
import type { Blog, BlogInsert, BlogUpdate } from '../types/database.types';

export const blogsService = {
    async getAll(): Promise<Blog[]> {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<Blog | null> {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async getByTag(tag: string): Promise<Blog[]> {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .contains('tags', [tag])
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async create(blog: BlogInsert): Promise<Blog> {
        const { data, error } = await supabase
            .from('blogs')
            .insert(blog)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, blog: BlogUpdate): Promise<Blog> {
        const { data, error } = await supabase
            .from('blogs')
            .update({ ...blog, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
