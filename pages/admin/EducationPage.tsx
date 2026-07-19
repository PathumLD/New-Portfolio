import React from 'react';
import { FiBookOpen } from 'react-icons/fi';
import ContentAdminPage from '../../components/admin/ContentAdminPage';
import { educationService } from '../../src/services';
import type { Education, EducationInsert, EducationUpdate } from '../../src/types/database.types';
import { formatPeriod, numericOrder, parseList, stringifyList } from './contentAdminUtils';

type EducationFormState = {
    degree: string;
    university: string;
    start_date: string;
    end_date: string;
    description: string;
    skills: string;
    display_order: string;
};

const emptyForm: EducationFormState = {
    degree: '',
    university: '',
    start_date: '',
    end_date: '',
    description: '',
    skills: '',
    display_order: '1',
};

const EducationPage: React.FC = () => (
    <ContentAdminPage<Education, EducationFormState>
        title="Education"
        singularLabel="Education"
        badgeLabel="Credentials section"
        description="Manage academic timeline entries shown on the public Credentials page."
        icon={FiBookOpen}
        service={educationService}
        emptyForm={emptyForm}
        fields={[
            { name: 'degree', label: 'Degree / Program', required: true, placeholder: 'Bachelor of Science in Information Systems' },
            { name: 'university', label: 'Institution', required: true, placeholder: 'University of Colombo School of Computing' },
            { name: 'start_date', label: 'Start Date', type: 'date', required: true },
            { name: 'end_date', label: 'End Date', type: 'date', helper: 'Leave empty for Present.' },
            { name: 'display_order', label: 'Display Order', type: 'number', required: true },
            { name: 'skills', label: 'Skills / Coursework', placeholder: 'JavaScript, Software Engineering', helper: 'Separate with commas or new lines.' },
            { name: 'description', label: 'Description', type: 'textarea', required: true, colSpan: 2 },
        ]}
        mapItemToForm={(item) => ({
            degree: item.degree,
            university: item.university,
            start_date: item.start_date,
            end_date: item.end_date || '',
            description: item.description,
            skills: stringifyList(item.skills),
            display_order: String(item.display_order || 0),
        })}
        buildPayload={(form): EducationInsert | EducationUpdate => ({
            degree: form.degree.trim(),
            university: form.university.trim(),
            start_date: form.start_date,
            end_date: form.end_date || null,
            description: form.description.trim(),
            skills: parseList(form.skills),
            display_order: numericOrder(form.display_order),
        })}
        getTitle={(item) => item.degree}
        getSubtitle={(item) => item.university}
        getDescription={(item) => item.description}
        getMeta={(item) => formatPeriod(item.start_date, item.end_date)}
        getTags={(item) => item.skills}
        sortItems={(items) => [...items].sort((a, b) => a.display_order - b.display_order || b.start_date.localeCompare(a.start_date))}
    />
);

export default EducationPage;
