import React from 'react';
import { FiHeart } from 'react-icons/fi';
import ContentAdminPage from '../../components/admin/ContentAdminPage';
import { volunteersService } from '../../src/services';
import type { Volunteer, VolunteerInsert, VolunteerUpdate } from '../../src/types/database.types';
import { formatPeriod, numericOrder } from './contentAdminUtils';

type VolunteerFormState = {
    role: string;
    community: string;
    start_date: string;
    end_date: string;
    description: string;
    display_order: string;
};

const emptyForm: VolunteerFormState = {
    role: '',
    community: '',
    start_date: '',
    end_date: '',
    description: '',
    display_order: '1',
};

const VolunteersPage: React.FC = () => (
    <ContentAdminPage<Volunteer, VolunteerFormState>
        title="Volunteers"
        singularLabel="Volunteer Entry"
        badgeLabel="Credentials section"
        description="Manage volunteering and community timeline entries shown on the public Credentials page."
        icon={FiHeart}
        service={volunteersService}
        emptyForm={emptyForm}
        fields={[
            { name: 'role', label: 'Role / Title', required: true, placeholder: 'Treasurer' },
            { name: 'community', label: 'Organization', required: true, placeholder: 'UCSC ISACA Student Group' },
            { name: 'start_date', label: 'Start Date', type: 'date', required: true },
            { name: 'end_date', label: 'End Date', type: 'date', helper: 'Leave empty for Present.' },
            { name: 'display_order', label: 'Display Order', type: 'number', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true, colSpan: 2 },
        ]}
        mapItemToForm={(item) => ({
            role: item.role,
            community: item.community,
            start_date: item.start_date,
            end_date: item.end_date || '',
            description: item.description,
            display_order: String(item.display_order || 0),
        })}
        buildPayload={(form): VolunteerInsert | VolunteerUpdate => ({
            role: form.role.trim(),
            community: form.community.trim(),
            start_date: form.start_date,
            end_date: form.end_date || null,
            description: form.description.trim(),
            display_order: numericOrder(form.display_order),
        })}
        getTitle={(item) => item.role}
        getSubtitle={(item) => item.community}
        getDescription={(item) => item.description}
        getMeta={(item) => formatPeriod(item.start_date, item.end_date)}
        sortItems={(items) => [...items].sort((a, b) => a.display_order - b.display_order || b.start_date.localeCompare(a.start_date))}
    />
);

export default VolunteersPage;
