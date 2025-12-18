import { supabase } from '../lib/supabase';
import type { Volunteer, VolunteerInsert, VolunteerUpdate } from '../types/database.types';

export const volunteersService = {
    async getAll(): Promise<Volunteer[]> {
        const { data, error } = await supabase
            .from('volunteers')
            .select('*')
            .order('start_date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getById(id: string): Promise<Volunteer | null> {
        const { data, error } = await supabase
            .from('volunteers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(volunteer: VolunteerInsert): Promise<Volunteer> {
        const { data, error } = await supabase
            .from('volunteers')
            .insert(volunteer)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, volunteer: VolunteerUpdate): Promise<Volunteer> {
        const { data, error } = await supabase
            .from('volunteers')
            .update({ ...volunteer, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('volunteers')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
