export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type SkillCategory =
    | 'PROGRAMMING_LANGUAGES'
    | 'FRONTEND'
    | 'BACKEND'
    | 'DATABASE'
    | 'TOOLS'
    | 'CLOUD'
    | 'OTHER';

export type ResourceType = 'TEXTBOOK' | 'MODEL_PAPER' | 'NOTE';

export interface Database {
    public: {
        Tables: {
            skills: {
                Row: {
                    id: string;
                    name: string;
                    category: SkillCategory;
                    icon: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    category: SkillCategory;
                    icon: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    category?: SkillCategory;
                    icon?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            projects: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    category: string;
                    tags: string[];
                    github_link: string | null;
                    demo_link: string | null;
                    images: string[];
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description: string;
                    category: string;
                    tags?: string[];
                    github_link?: string | null;
                    demo_link?: string | null;
                    images?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string;
                    category?: string;
                    tags?: string[];
                    github_link?: string | null;
                    demo_link?: string | null;
                    images?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            experiences: {
                Row: {
                    id: string;
                    job_title: string;
                    company: string;
                    start_date: string;
                    end_date: string | null;
                    description: string;
                    tags: string[];
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    job_title: string;
                    company: string;
                    start_date: string;
                    end_date?: string | null;
                    description: string;
                    tags?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    job_title?: string;
                    company?: string;
                    start_date?: string;
                    end_date?: string | null;
                    description?: string;
                    tags?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            education: {
                Row: {
                    id: string;
                    degree: string;
                    university: string;
                    start_date: string;
                    end_date: string | null;
                    description: string;
                    skills: string[];
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    degree: string;
                    university: string;
                    start_date: string;
                    end_date?: string | null;
                    description: string;
                    skills?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    degree?: string;
                    university?: string;
                    start_date?: string;
                    end_date?: string | null;
                    description?: string;
                    skills?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            volunteers: {
                Row: {
                    id: string;
                    role: string;
                    community: string;
                    start_date: string;
                    end_date: string | null;
                    description: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    role: string;
                    community: string;
                    start_date: string;
                    end_date?: string | null;
                    description: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    role?: string;
                    community?: string;
                    start_date?: string;
                    end_date?: string | null;
                    description?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            certificates: {
                Row: {
                    id: string;
                    name: string;
                    organization: string;
                    issued_date: string;
                    credential_link: string | null;
                    document_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    organization: string;
                    issued_date: string;
                    credential_link?: string | null;
                    document_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    organization?: string;
                    issued_date?: string;
                    credential_link?: string | null;
                    document_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            awards: {
                Row: {
                    id: string;
                    name: string;
                    organization: string;
                    issued_date: string;
                    description: string | null;
                    document_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    organization: string;
                    issued_date: string;
                    description?: string | null;
                    document_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    organization?: string;
                    issued_date?: string;
                    description?: string | null;
                    document_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            tutoring_grades: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            tutoring_lessons: {
                Row: {
                    id: string;
                    title: string;
                    cover_image: string | null;
                    grade_id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    cover_image?: string | null;
                    grade_id: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    cover_image?: string | null;
                    grade_id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "tutoring_lessons_grade_id_fkey";
                        columns: ["grade_id"];
                        isOneToOne: false;
                        referencedRelation: "tutoring_grades";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tutoring_video_links: {
                Row: {
                    id: string;
                    title: string;
                    youtube_url: string;
                    lesson_id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    youtube_url: string;
                    lesson_id: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    youtube_url?: string;
                    lesson_id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "tutoring_video_links_lesson_id_fkey";
                        columns: ["lesson_id"];
                        isOneToOne: false;
                        referencedRelation: "tutoring_lessons";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tutoring_resources: {
                Row: {
                    id: string;
                    title: string;
                    type: ResourceType;
                    file_url: string;
                    grade_id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    type: ResourceType;
                    file_url: string;
                    grade_id: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    type?: ResourceType;
                    file_url?: string;
                    grade_id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "tutoring_resources_grade_id_fkey";
                        columns: ["grade_id"];
                        isOneToOne: false;
                        referencedRelation: "tutoring_grades";
                        referencedColumns: ["id"];
                    }
                ];
            };
            blogs: {
                Row: {
                    id: string;
                    title: string;
                    link: string;
                    cover_image: string | null;
                    tags: string[];
                    short_description: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    link: string;
                    cover_image?: string | null;
                    tags?: string[];
                    short_description: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    link?: string;
                    cover_image?: string | null;
                    tags?: string[];
                    short_description?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
        };
        Views: {};
        Functions: {};
        Enums: {
            skill_category: SkillCategory;
            resource_type: ResourceType;
        };
    };
}

// Helper types for easier use
export type Skill = Database['public']['Tables']['skills']['Row'];
export type SkillInsert = Database['public']['Tables']['skills']['Insert'];
export type SkillUpdate = Database['public']['Tables']['skills']['Update'];

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type Experience = Database['public']['Tables']['experiences']['Row'];
export type ExperienceInsert = Database['public']['Tables']['experiences']['Insert'];
export type ExperienceUpdate = Database['public']['Tables']['experiences']['Update'];

export type Education = Database['public']['Tables']['education']['Row'];
export type EducationInsert = Database['public']['Tables']['education']['Insert'];
export type EducationUpdate = Database['public']['Tables']['education']['Update'];

export type Volunteer = Database['public']['Tables']['volunteers']['Row'];
export type VolunteerInsert = Database['public']['Tables']['volunteers']['Insert'];
export type VolunteerUpdate = Database['public']['Tables']['volunteers']['Update'];

export type Certificate = Database['public']['Tables']['certificates']['Row'];
export type CertificateInsert = Database['public']['Tables']['certificates']['Insert'];
export type CertificateUpdate = Database['public']['Tables']['certificates']['Update'];

export type Award = Database['public']['Tables']['awards']['Row'];
export type AwardInsert = Database['public']['Tables']['awards']['Insert'];
export type AwardUpdate = Database['public']['Tables']['awards']['Update'];

export type TutoringGrade = Database['public']['Tables']['tutoring_grades']['Row'];
export type TutoringGradeInsert = Database['public']['Tables']['tutoring_grades']['Insert'];
export type TutoringGradeUpdate = Database['public']['Tables']['tutoring_grades']['Update'];

export type TutoringLesson = Database['public']['Tables']['tutoring_lessons']['Row'];
export type TutoringLessonInsert = Database['public']['Tables']['tutoring_lessons']['Insert'];
export type TutoringLessonUpdate = Database['public']['Tables']['tutoring_lessons']['Update'];

export type TutoringVideoLink = Database['public']['Tables']['tutoring_video_links']['Row'];
export type TutoringVideoLinkInsert = Database['public']['Tables']['tutoring_video_links']['Insert'];
export type TutoringVideoLinkUpdate = Database['public']['Tables']['tutoring_video_links']['Update'];

export type TutoringResource = Database['public']['Tables']['tutoring_resources']['Row'];
export type TutoringResourceInsert = Database['public']['Tables']['tutoring_resources']['Insert'];
export type TutoringResourceUpdate = Database['public']['Tables']['tutoring_resources']['Update'];

export type Blog = Database['public']['Tables']['blogs']['Row'];
export type BlogInsert = Database['public']['Tables']['blogs']['Insert'];
export type BlogUpdate = Database['public']['Tables']['blogs']['Update'];
