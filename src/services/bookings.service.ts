import { supabase } from '../lib/supabase';
import { adminTimeZone, zonedDateTimeToUtc } from '../lib/booking-time';
import type { Booking, BookingInsert, BookingStatus, BookingUpdate } from '../types/database.types';
import { withCreateMetadata } from './service-utils';

function isMissingAvailabilitySchemaError(error: { code?: string; message?: string } | null) {
    const message = error?.message?.toLowerCase() || '';
    return (
        error?.code === 'PGRST202'
        || error?.code === 'PGRST204'
        || message.includes('booking_start_at')
        || message.includes('booking_end_at')
        || message.includes('get_unavailable_booking_slots')
        || message.includes('schema cache')
    );
}

let availabilitySchemaAvailable: boolean | null = null;

export const bookingsService = {
    async getAll(): Promise<Booking[]> {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('meeting_date', { ascending: false })
            .order('start_time', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getUpcoming(limit = 6): Promise<Booking[]> {
        const today = new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .gte('meeting_date', today)
            .order('meeting_date', { ascending: true })
            .order('start_time', { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async create(booking: BookingInsert): Promise<Booking> {
        const timeZone = booking.timezone || adminTimeZone;
        const bookingStartAt = zonedDateTimeToUtc(booking.meeting_date, booking.start_time, timeZone);
        const bookingEndAt = new Date(bookingStartAt.getTime() + booking.duration_minutes * 60_000);
        const basePayload = withCreateMetadata({
            meeting_type: 'discovery_call',
            timezone: timeZone,
            status: 'pending',
            source: 'contact_page',
            ...booking,
        });

        if (availabilitySchemaAvailable === false) {
            const { error } = await supabase
                .from('bookings')
                .insert(basePayload);

            if (error) throw error;
            return basePayload as Booking;
        }

        const payload = {
            ...basePayload,
            booking_start_at: bookingStartAt.toISOString(),
            booking_end_at: bookingEndAt.toISOString(),
        };

        const { error } = await supabase
            .from('bookings')
            .insert(payload);

        if (error) {
            if (!isMissingAvailabilitySchemaError(error)) {
                throw error;
            }

            availabilitySchemaAvailable = false;
            const { error: fallbackError } = await supabase
                .from('bookings')
                .insert(basePayload);

            if (fallbackError) throw fallbackError;
            return basePayload as Booking;
        }

        availabilitySchemaAvailable = true;
        return payload as Booking;
    },

    async getUnavailableSlots(meetingDate: string, timeZone: string, durationMinutes: number): Promise<string[]> {
        const { data, error } = await supabase.rpc('get_unavailable_booking_slots', {
            slot_date: meetingDate,
            slot_timezone: timeZone,
            slot_duration_minutes: durationMinutes,
        });

        if (error) {
            if (isMissingAvailabilitySchemaError(error)) {
                availabilitySchemaAvailable = false;
                return [];
            }
            throw error;
        }

        availabilitySchemaAvailable = true;
        return (data || []).map((slot: { start_time: string }) => slot.start_time);
    },

    async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, booking: BookingUpdate): Promise<Booking> {
        const { data, error } = await supabase
            .from('bookings')
            .update({ ...booking, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
