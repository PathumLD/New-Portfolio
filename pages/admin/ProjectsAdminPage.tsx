import React, { useEffect, useMemo, useState } from 'react';
import { FiFolder } from 'react-icons/fi';
import ContentAdminPage from '../../components/admin/ContentAdminPage';
import { projectCategoriesService, projectsService } from '../../src/services';
import type { Project, ProjectCategoryRecord, ProjectInsert, ProjectUpdate } from '../../src/types/database.types';
import { nullableText, numericOrder, parseList, stringifyList } from './contentAdminUtils';

type ProjectFormState = {
    title: string;
    category: string;
    description: string;
    tags: string;
    github_link: string;
    demo_link: string;
    images: string;
    display_order: string;
};

const emptyForm: ProjectFormState = {
    title: '',
    category: '',
    description: '',
    tags: '',
    github_link: '',
    demo_link: '',
    images: '',
    display_order: '1',
};

const fallbackCategories: ProjectCategoryRecord[] = [
    {
        id: 'fallback-website',
        name: 'Website',
        slug: 'website',
        display_order: 1,
        created_at: '',
        updated_at: '',
    },
    {
        id: 'fallback-web-applications',
        name: 'Web Applications',
        slug: 'web-applications',
        display_order: 2,
        created_at: '',
        updated_at: '',
    },
    {
        id: 'fallback-mobile-applications',
        name: 'Mobile Applications',
        slug: 'mobile-applications',
        display_order: 3,
        created_at: '',
        updated_at: '',
    },
];

const ProjectsAdminPage: React.FC = () => {
    const [categories, setCategories] = useState<ProjectCategoryRecord[]>(fallbackCategories);

    useEffect(() => {
        let isMounted = true;

        const loadCategories = async () => {
            try {
                const data = await projectCategoriesService.getAll();
                if (isMounted && data.length > 0) {
                    setCategories(data);
                }
            } catch (error) {
                console.error('Unable to load project categories:', error);
            }
        };

        loadCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    const categoryOptions = useMemo(
        () => categories.map((category) => ({ label: category.name, value: category.name })),
        [categories]
    );

    return (
        <ContentAdminPage<Project, ProjectFormState>
            title="Projects"
            singularLabel="Project"
            badgeLabel="Portfolio section"
            description="Manage project cards and links shown on the public Projects page."
            icon={FiFolder}
            service={projectsService}
            emptyForm={{ ...emptyForm, category: categoryOptions[0]?.value || '' }}
            fields={[
                { name: 'title', label: 'Title', required: true, placeholder: 'AI-Powered Job Portal' },
                { name: 'category', label: 'Category', type: 'select', required: true, placeholder: 'Select project category', options: categoryOptions },
                { name: 'demo_link', label: 'Live / Demo URL', type: 'url', placeholder: 'https://example.com' },
                { name: 'github_link', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...' },
                { name: 'display_order', label: 'Display Order', type: 'number', required: true },
                { name: 'tags', label: 'Tags', placeholder: 'React, Supabase, Vercel', helper: 'Separate with commas or new lines.' },
                { name: 'images', label: 'Image URLs', type: 'textarea', colSpan: 2, placeholder: 'https://images.unsplash.com/...', helper: 'First image is used as the project cover.' },
                { name: 'description', label: 'Description', type: 'textarea', required: true, colSpan: 2 },
            ]}
            mapItemToForm={(project) => ({
                title: project.title,
                category: project.category,
                description: project.description,
                tags: stringifyList(project.tags),
                github_link: project.github_link || '',
                demo_link: project.demo_link || '',
                images: stringifyList(project.images),
                display_order: String(project.display_order || 0),
            })}
            buildPayload={(form): ProjectInsert | ProjectUpdate => ({
                title: form.title.trim(),
                category: form.category.trim(),
                description: form.description.trim(),
                tags: parseList(form.tags),
                github_link: nullableText(form.github_link),
                demo_link: nullableText(form.demo_link),
                images: parseList(form.images),
                display_order: numericOrder(form.display_order),
            })}
            getTitle={(project) => project.title}
            getSubtitle={(project) => project.category}
            getDescription={(project) => project.description}
            getMeta={(project) => project.demo_link || project.github_link || 'No link'}
            getTags={(project) => project.tags}
            sortItems={(items) => [...items].sort((a, b) => a.display_order - b.display_order || a.title.localeCompare(b.title))}
        />
    );
};

export default ProjectsAdminPage;
