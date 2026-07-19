export function parseList(value: string) {
    return value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);
}

export function stringifyList(value: string[] | null | undefined) {
    return (value || []).join(', ');
}

export function nullableText(value: string) {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

export function numericOrder(value: string) {
    return Number(value || 0);
}

export function formatDate(date: string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(`${date}T00:00:00`));
}

export function formatPeriod(startDate: string, endDate: string | null) {
    return `${formatDate(startDate)} - ${endDate ? formatDate(endDate) : 'Present'}`;
}

export function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
