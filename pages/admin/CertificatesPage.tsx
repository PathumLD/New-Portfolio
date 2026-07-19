import React from 'react';
import { FiAward } from 'react-icons/fi';
import ContentAdminPage from '../../components/admin/ContentAdminPage';
import { certificatesService } from '../../src/services';
import type { Certificate, CertificateInsert, CertificateUpdate } from '../../src/types/database.types';
import { formatDate, nullableText, numericOrder } from './contentAdminUtils';

type CertificateFormState = {
    name: string;
    organization: string;
    issued_date: string;
    credential_link: string;
    document_url: string;
    display_order: string;
};

const emptyForm: CertificateFormState = {
    name: '',
    organization: '',
    issued_date: '',
    credential_link: '',
    document_url: '',
    display_order: '1',
};

const CertificatesPage: React.FC = () => (
    <ContentAdminPage<Certificate, CertificateFormState>
        title="Certificates"
        singularLabel="Certificate"
        badgeLabel="Credentials section"
        description="Manage certifications shown on the public Certifications & Awards page."
        icon={FiAward}
        service={certificatesService}
        emptyForm={emptyForm}
        fields={[
            { name: 'name', label: 'Certificate Name', required: true, placeholder: 'Introduction to Cybersecurity' },
            { name: 'organization', label: 'Issuer', required: true, placeholder: 'Cisco Networking Academy' },
            { name: 'issued_date', label: 'Issued Date', type: 'date', required: true },
            { name: 'display_order', label: 'Display Order', type: 'number', required: true },
            { name: 'credential_link', label: 'Credential URL', type: 'url', colSpan: 2, placeholder: 'https://www.credly.com/...' },
            { name: 'document_url', label: 'Document URL', type: 'url', colSpan: 2, placeholder: 'https://...' },
        ]}
        mapItemToForm={(item) => ({
            name: item.name,
            organization: item.organization,
            issued_date: item.issued_date,
            credential_link: item.credential_link || '',
            document_url: item.document_url || '',
            display_order: String(item.display_order || 0),
        })}
        buildPayload={(form): CertificateInsert | CertificateUpdate => ({
            name: form.name.trim(),
            organization: form.organization.trim(),
            issued_date: form.issued_date,
            credential_link: nullableText(form.credential_link),
            document_url: nullableText(form.document_url),
            display_order: numericOrder(form.display_order),
        })}
        getTitle={(item) => item.name}
        getSubtitle={(item) => item.organization}
        getMeta={(item) => formatDate(item.issued_date)}
        sortItems={(items) => [...items].sort((a, b) => a.display_order - b.display_order || b.issued_date.localeCompare(a.issued_date))}
    />
);

export default CertificatesPage;
