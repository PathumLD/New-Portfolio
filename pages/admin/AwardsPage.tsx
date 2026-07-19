import React from 'react';
import { FiStar } from 'react-icons/fi';
import ContentAdminPage from '../../components/admin/ContentAdminPage';
import { awardsService } from '../../src/services';
import type { Award, AwardInsert, AwardUpdate } from '../../src/types/database.types';
import { formatDate, nullableText, numericOrder } from './contentAdminUtils';

type AwardFormState = {
    name: string;
    organization: string;
    issued_date: string;
    description: string;
    document_url: string;
    display_order: string;
};

const emptyForm: AwardFormState = {
    name: '',
    organization: '',
    issued_date: '',
    description: '',
    document_url: '',
    display_order: '1',
};

const AwardsPage: React.FC = () => (
    <ContentAdminPage<Award, AwardFormState>
        title="Awards"
        singularLabel="Award"
        badgeLabel="Credentials section"
        description="Manage awards and recognitions shown on the public Certifications & Awards page."
        icon={FiStar}
        service={awardsService}
        emptyForm={emptyForm}
        fields={[
            { name: 'name', label: 'Award Name', required: true, placeholder: 'Best Graphic Designer' },
            { name: 'organization', label: 'Issuer', required: true, placeholder: 'PAHASARA Media Club' },
            { name: 'issued_date', label: 'Issued Date', type: 'date', required: true },
            { name: 'display_order', label: 'Display Order', type: 'number', required: true },
            { name: 'document_url', label: 'Document URL', type: 'url', colSpan: 2, placeholder: 'https://...' },
            { name: 'description', label: 'Description', type: 'textarea', colSpan: 2 },
        ]}
        mapItemToForm={(item) => ({
            name: item.name,
            organization: item.organization,
            issued_date: item.issued_date,
            description: item.description || '',
            document_url: item.document_url || '',
            display_order: String(item.display_order || 0),
        })}
        buildPayload={(form): AwardInsert | AwardUpdate => ({
            name: form.name.trim(),
            organization: form.organization.trim(),
            issued_date: form.issued_date,
            description: nullableText(form.description),
            document_url: nullableText(form.document_url),
            display_order: numericOrder(form.display_order),
        })}
        getTitle={(item) => item.name}
        getSubtitle={(item) => item.organization}
        getDescription={(item) => item.description}
        getMeta={(item) => formatDate(item.issued_date)}
        sortItems={(items) => [...items].sort((a, b) => a.display_order - b.display_order || b.issued_date.localeCompare(a.issued_date))}
    />
);

export default AwardsPage;
