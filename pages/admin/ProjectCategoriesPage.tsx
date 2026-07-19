import React from 'react';
import { FiGrid } from 'react-icons/fi';
import ContentAdminPage from '../../components/admin/ContentAdminPage';
import { projectCategoriesService } from '../../src/services';
import type {
    ProjectCategoryRecord,
    ProjectCategoryRecordInsert,
    ProjectCategoryRecordUpdate,
} from '../../src/types/database.types';
import { numericOrder, slugify } from './contentAdminUtils';

type ProjectCategoryFormState = {
    name: string;
    slug: string;
    display_order: string;
};

const emptyForm: ProjectCategoryFormState = {
    name: '',
    slug: '',
    display_order: '1',
};

const ProjectCategoriesPage: React.FC = () => (
    <ContentAdminPage<ProjectCategoryRecord, ProjectCategoryFormState>
        title="Project Categories"
        singularLabel="Project Category"
        badgeLabel="Projects subsection"
        description="Manage the categories available in the project form dropdown."
        icon={FiGrid}
        service={projectCategoriesService}
        emptyForm={emptyForm}
        fields={[
            { name: 'name', label: 'Category Name', required: true, placeholder: 'Web Applications' },
            { name: 'slug', label: 'Slug', placeholder: 'web-applications', helper: 'Leave blank to generate from the category name.' },
            { name: 'display_order', label: 'Display Order', type: 'number', required: true },
        ]}
        mapItemToForm={(category) => ({
            name: category.name,
            slug: category.slug,
            display_order: String(category.display_order || 0),
        })}
        buildPayload={(form): ProjectCategoryRecordInsert | ProjectCategoryRecordUpdate => {
            const name = form.name.trim();
            return {
                name,
                slug: form.slug.trim() || slugify(name),
                display_order: numericOrder(form.display_order),
            };
        }}
        getTitle={(category) => category.name}
        getSubtitle={(category) => category.slug}
        getMeta={(category) => `Order ${category.display_order}`}
        sortItems={(items) => [...items].sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name))}
    />
);

export default ProjectCategoriesPage;
