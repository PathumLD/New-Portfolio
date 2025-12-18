import { supabase } from '../lib/supabase';
import type {
    TutoringGrade,
    TutoringGradeInsert,
    TutoringGradeUpdate,
    TutoringLesson,
    TutoringLessonInsert,
    TutoringLessonUpdate,
    TutoringVideoLink,
    TutoringVideoLinkInsert,
    TutoringVideoLinkUpdate,
    TutoringResource,
    TutoringResourceInsert,
    TutoringResourceUpdate,
    ResourceType,
} from '../types/database.types';

// Extended types with relations
export interface TutoringGradeWithRelations extends TutoringGrade {
    lessons?: TutoringLessonWithVideos[];
    resources?: TutoringResource[];
}

export interface TutoringLessonWithVideos extends TutoringLesson {
    videos?: TutoringVideoLink[];
}

export const tutoringService = {
    // Grades
    grades: {
        async getAll(): Promise<TutoringGrade[]> {
            const { data, error } = await supabase
                .from('tutoring_grades')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            return data || [];
        },

        async getAllWithRelations(): Promise<TutoringGradeWithRelations[]> {
            const { data, error } = await supabase
                .from('tutoring_grades')
                .select(`
          *,
          lessons:tutoring_lessons(
            *,
            videos:tutoring_video_links(*)
          ),
          resources:tutoring_resources(*)
        `)
                .order('name', { ascending: true });

            if (error) throw error;
            return data || [];
        },

        async getById(id: string): Promise<TutoringGrade | null> {
            const { data, error } = await supabase
                .from('tutoring_grades')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },

        async getByIdWithRelations(id: string): Promise<TutoringGradeWithRelations | null> {
            const { data, error } = await supabase
                .from('tutoring_grades')
                .select(`
          *,
          lessons:tutoring_lessons(
            *,
            videos:tutoring_video_links(*)
          ),
          resources:tutoring_resources(*)
        `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },

        async create(grade: TutoringGradeInsert): Promise<TutoringGrade> {
            const { data, error } = await supabase
                .from('tutoring_grades')
                .insert(grade)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async update(id: string, grade: TutoringGradeUpdate): Promise<TutoringGrade> {
            const { data, error } = await supabase
                .from('tutoring_grades')
                .update({ ...grade, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async delete(id: string): Promise<void> {
            const { error } = await supabase
                .from('tutoring_grades')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
    },

    // Lessons
    lessons: {
        async getAll(): Promise<TutoringLesson[]> {
            const { data, error } = await supabase
                .from('tutoring_lessons')
                .select('*')
                .order('title', { ascending: true });

            if (error) throw error;
            return data || [];
        },

        async getByGradeId(gradeId: string): Promise<TutoringLessonWithVideos[]> {
            const { data, error } = await supabase
                .from('tutoring_lessons')
                .select(`
          *,
          videos:tutoring_video_links(*)
        `)
                .eq('grade_id', gradeId)
                .order('title', { ascending: true });

            if (error) throw error;
            return data || [];
        },

        async getById(id: string): Promise<TutoringLesson | null> {
            const { data, error } = await supabase
                .from('tutoring_lessons')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },

        async create(lesson: TutoringLessonInsert): Promise<TutoringLesson> {
            const { data, error } = await supabase
                .from('tutoring_lessons')
                .insert(lesson)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async update(id: string, lesson: TutoringLessonUpdate): Promise<TutoringLesson> {
            const { data, error } = await supabase
                .from('tutoring_lessons')
                .update({ ...lesson, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async delete(id: string): Promise<void> {
            const { error } = await supabase
                .from('tutoring_lessons')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
    },

    // Video Links
    videos: {
        async getAll(): Promise<TutoringVideoLink[]> {
            const { data, error } = await supabase
                .from('tutoring_video_links')
                .select('*')
                .order('title', { ascending: true });

            if (error) throw error;
            return data || [];
        },

        async getByLessonId(lessonId: string): Promise<TutoringVideoLink[]> {
            const { data, error } = await supabase
                .from('tutoring_video_links')
                .select('*')
                .eq('lesson_id', lessonId)
                .order('title', { ascending: true });

            if (error) throw error;
            return data || [];
        },

        async getById(id: string): Promise<TutoringVideoLink | null> {
            const { data, error } = await supabase
                .from('tutoring_video_links')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },

        async create(video: TutoringVideoLinkInsert): Promise<TutoringVideoLink> {
            const { data, error } = await supabase
                .from('tutoring_video_links')
                .insert(video)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async update(id: string, video: TutoringVideoLinkUpdate): Promise<TutoringVideoLink> {
            const { data, error } = await supabase
                .from('tutoring_video_links')
                .update({ ...video, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async delete(id: string): Promise<void> {
            const { error } = await supabase
                .from('tutoring_video_links')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
    },

    // Resources
    resources: {
        async getAll(): Promise<TutoringResource[]> {
            const { data, error } = await supabase
                .from('tutoring_resources')
                .select('*')
                .order('title', { ascending: true });

            if (error) throw error;
            return data || [];
        },

        async getByGradeId(gradeId: string): Promise<TutoringResource[]> {
            const { data, error } = await supabase
                .from('tutoring_resources')
                .select('*')
                .eq('grade_id', gradeId)
                .order('title', { ascending: true });

            if (error) throw error;
            return data || [];
        },

        async getByType(type: ResourceType): Promise<TutoringResource[]> {
            const { data, error } = await supabase
                .from('tutoring_resources')
                .select('*')
                .eq('type', type)
                .order('title', { ascending: true });

            if (error) throw error;
            return data || [];
        },

        async getById(id: string): Promise<TutoringResource | null> {
            const { data, error } = await supabase
                .from('tutoring_resources')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },

        async create(resource: TutoringResourceInsert): Promise<TutoringResource> {
            const { data, error } = await supabase
                .from('tutoring_resources')
                .insert(resource)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async update(id: string, resource: TutoringResourceUpdate): Promise<TutoringResource> {
            const { data, error } = await supabase
                .from('tutoring_resources')
                .update({ ...resource, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async delete(id: string): Promise<void> {
            const { error } = await supabase
                .from('tutoring_resources')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
    },
};
