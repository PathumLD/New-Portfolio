import { getTimeZones } from '@vvo/tzdb';
import type { Booking } from '../types/database.types';

export const adminTimeZone = 'Asia/Colombo';

type BookingTimeZoneOption = {
    value: string;
    label: string;
    group: string[];
    offsetInMinutes: number;
    searchTerms: string[];
    searchText: string;
};

type TzdbTimeZone = ReturnType<typeof getTimeZones>[number];

const preferredTimeZoneNames = [
    'Asia/Colombo',
    'Asia/Kolkata',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Dubai',
    'Asia/Karachi',
    'Asia/Dhaka',
    'Asia/Kathmandu',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
];

const helpfulSearchAliases: Record<string, string[]> = {
    'Asia/Colombo': ['srilanka', 'kandy', 'galle'],
    'Asia/Kolkata': ['new delhi', 'bombay', 'bangalore', 'chennai', 'pune'],
    'America/Los_Angeles': ['la'],
};

function getResolvedBrowserTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function formatOffset(offsetInMinutes: number) {
    const sign = offsetInMinutes >= 0 ? '+' : '-';
    const absoluteOffset = Math.abs(offsetInMinutes);
    const hours = Math.floor(absoluteOffset / 60);
    const minutes = absoluteOffset % 60;
    return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getOffsetSearchTerms(offsetInMinutes: number) {
    const formattedOffset = formatOffset(offsetInMinutes);
    const withoutPrefix = formattedOffset.replace('UTC', '');
    const looseOffset = withoutPrefix.replace(/^([+-])0/, '$1');
    const dottedOffset = withoutPrefix.replace(':', '.');
    const looseDottedOffset = looseOffset.replace(':', '.');
    const decimalOffset = String(offsetInMinutes / 60);

    return [
        formattedOffset,
        formattedOffset.replace('UTC', 'GMT'),
        withoutPrefix,
        looseOffset,
        dottedOffset,
        looseDottedOffset,
        `utc${looseOffset}`,
        `utc${looseDottedOffset}`,
        `gmt${looseOffset}`,
        `gmt${looseDottedOffset}`,
        decimalOffset,
    ];
}

function formatTimeZoneLabel(timeZone: TzdbTimeZone) {
    const city = timeZone.mainCities[0];
    const place = city ? `${timeZone.countryName} - ${city}` : timeZone.countryName;
    return `(${formatOffset(timeZone.currentTimeOffsetInMinutes)}) ${place}`;
}

function getSearchTerms(timeZone: TzdbTimeZone, label: string) {
    return [
        label,
        timeZone.name,
        ...timeZone.group,
        timeZone.alternativeName,
        timeZone.continentName,
        timeZone.countryName,
        timeZone.countryCode,
        timeZone.abbreviation,
        timeZone.rawFormat,
        timeZone.currentTimeFormat,
        ...timeZone.mainCities,
        ...getOffsetSearchTerms(timeZone.currentTimeOffsetInMinutes),
        ...(helpfulSearchAliases[timeZone.name] || []),
    ].map((term) => term.toLowerCase());
}

function getBookingTimeZones() {
    return getTimeZones()
        .map((timeZone) => {
            const label = formatTimeZoneLabel(timeZone);
            const searchTerms = getSearchTerms(timeZone, label);

            return {
                value: timeZone.name,
                label,
                group: timeZone.group,
                offsetInMinutes: timeZone.currentTimeOffsetInMinutes,
                searchTerms,
                searchText: searchTerms.join(' '),
            };
        })
        .sort((first, second) => {
            const firstPreferredIndex = preferredTimeZoneNames.indexOf(first.value);
            const secondPreferredIndex = preferredTimeZoneNames.indexOf(second.value);
            const firstIsPreferred = firstPreferredIndex !== -1;
            const secondIsPreferred = secondPreferredIndex !== -1;

            if (firstIsPreferred && secondIsPreferred) return firstPreferredIndex - secondPreferredIndex;
            if (firstIsPreferred) return -1;
            if (secondIsPreferred) return 1;
            if (first.offsetInMinutes !== second.offsetInMinutes) return first.offsetInMinutes - second.offsetInMinutes;
            return first.label.localeCompare(second.label);
        });
}

export const bookingTimeZones = getBookingTimeZones();

const fallbackTimeZones = bookingTimeZones.reduce<Record<string, string>>((fallbacks, timeZone) => {
    timeZone.group.forEach((groupName) => {
        fallbacks[groupName] = timeZone.value;
    });
    return fallbacks;
}, {});

function getUsableTimeZone(timeZone: string) {
    try {
        new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
        return timeZone;
    } catch {
        return fallbackTimeZones[timeZone] || adminTimeZone;
    }
}

export function getBrowserTimeZone() {
    const browserTimeZone = getResolvedBrowserTimeZone();
    const matchedTimeZone = bookingTimeZones.find((timeZone) => timeZone.value === browserTimeZone || timeZone.group.includes(browserTimeZone));
    return matchedTimeZone?.value || adminTimeZone;
}

function getTimeZoneParts(date: Date, timeZone: string) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: getUsableTimeZone(timeZone),
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const hour = values.hour === '24' ? '00' : values.hour;

    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),
        hour: Number(hour),
        minute: Number(values.minute),
        second: Number(values.second),
    };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
    const parts = getTimeZoneParts(date, timeZone);
    const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    return localAsUtc - date.getTime();
}

export function zonedDateTimeToUtc(dateKey: string, time: string, timeZone: string) {
    const [year, month, day] = dateKey.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const localAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
    let utcTime = localAsUtc;

    for (let index = 0; index < 3; index += 1) {
        const offset = getTimeZoneOffsetMs(new Date(utcTime), timeZone);
        utcTime = localAsUtc - offset;
    }

    return new Date(utcTime);
}

export function formatBookingInTimeZone(booking: Booking, targetTimeZone = adminTimeZone) {
    const utcDate = zonedDateTimeToUtc(booking.meeting_date, booking.start_time, booking.timezone || adminTimeZone);
    const usableTargetTimeZone = getUsableTimeZone(targetTimeZone);
    const date = new Intl.DateTimeFormat('en-US', {
        timeZone: usableTargetTimeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(utcDate);
    const time = new Intl.DateTimeFormat('en-US', {
        timeZone: usableTargetTimeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(utcDate);

    return { date, time };
}

export function getTimeZoneLabel(value: string) {
    return bookingTimeZones.find((timeZone) => timeZone.value === value || timeZone.group.includes(value))?.label || value;
}

/**
 * Returns the calendar date key (YYYY-MM-DD) of a booking as seen in the target
 * time zone. Bookings store their date/time in the client's zone, so this
 * normalises them onto the admin's calendar.
 */
export function getBookingDateKey(booking: Booking, targetTimeZone = adminTimeZone) {
    const utcDate = zonedDateTimeToUtc(booking.meeting_date, booking.start_time, booking.timezone || adminTimeZone);
    // en-CA formats as YYYY-MM-DD.
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: getUsableTimeZone(targetTimeZone),
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(utcDate);
}

/** Returns today's calendar date key (YYYY-MM-DD) in the given time zone. */
export function getTodayDateKey(targetTimeZone = adminTimeZone) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: getUsableTimeZone(targetTimeZone),
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
}
