import React, { useEffect, useMemo, useRef, useState } from 'react';
// @ts-ignore: react-dom has no declaration file in this project
import { createPortal } from 'react-dom';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiMail,
  FiMessageSquare,
  FiPaperclip,
  FiPhone,
  FiSend,
  FiUser,
  FiVideo,
  FiX,
} from 'react-icons/fi';
import { Pill, SectionIntro, Surface } from '../components/PublicUI';
import { bookingsService, contactMessagesService } from '../src/services';
import { bookingTimeZones, getBrowserTimeZone, getTimeZoneLabel } from '../src/lib/booking-time';

const inputClass =
  'block box-border min-h-12 w-full min-w-0 max-w-full border border-zinc-200 bg-white px-3 py-3 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-white/[0.07]';

const fieldIconClass = 'pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500';
const textareaIconClass = 'pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-zinc-400 dark:text-zinc-500';
const fieldWrapClass = 'relative min-w-0 max-w-full';
const inputWithIconClass = `${inputClass} pl-10`;
const textareaWithIconClass = `${inputClass} min-h-32 resize-none pl-10 leading-6`;
type ToastMessage = {
  id: number;
  type: 'success' | 'error';
  message: string;
} | null;

type MeetingDuration = 15 | 30;

const bookingWindowStart = '12:00';
const bookingWindowEnd = '22:00';
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const modalWeekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
const modalMonthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const durationOptions: MeetingDuration[] = [15, 30];

function getOrdinalDay(day: number) {
  if (day > 3 && day < 21) return `${day}th`;

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

function formatModalDate(date: Date) {
  return `${modalWeekdayFormatter.format(date)}, ${getOrdinalDay(date.getDate())} ${modalMonthFormatter.format(date)}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isBookableDate(date: Date) {
  const today = startOfDay(new Date());
  return date >= today;
}

function getNextBookableDate(fromDate: Date) {
  const date = startOfDay(fromDate);
  for (let offset = 0; offset < 14; offset += 1) {
    const candidate = new Date(date);
    candidate.setDate(date.getDate() + offset);
    if (isBookableDate(candidate)) {
      return candidate;
    }
  }
  return date;
}

function getCalendarDays(month: Date) {
  const firstDay = startOfMonth(month);
  const days: Array<Date | null> = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    days.push(null);
  }

  const cursor = new Date(firstDay);
  while (cursor.getMonth() === firstDay.getMonth()) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

function getTimeSlots(duration: MeetingDuration) {
  const slots: string[] = [];
  const [startHour, startMinute] = bookingWindowStart.split(':').map(Number);
  const [endHour, endMinute] = bookingWindowEnd.split(':').map(Number);
  const cursor = new Date(2026, 0, 1, startHour, startMinute);
  const latestEnd = new Date(2026, 0, 1, endHour, endMinute);

  while (cursor.getTime() + duration * 60_000 <= latestEnd.getTime()) {
    slots.push(`${String(cursor.getHours()).padStart(2, '0')}:${String(cursor.getMinutes()).padStart(2, '0')}`);
    cursor.setMinutes(cursor.getMinutes() + duration);
  }

  return slots;
}

const ContactPage: React.FC = () => {
  const initialDate = getNextBookableDate(new Date());
  const [toast, setToast] = useState<ToastMessage>(null);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [isLoadingUnavailableSlots, setIsLoadingUnavailableSlots] = useState(false);
  const [availabilityRefreshKey, setAvailabilityRefreshKey] = useState(0);
  const [attachmentName, setAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [duration, setDuration] = useState<MeetingDuration>(30);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [calendarMonth, setCalendarMonth] = useState<Date>(startOfMonth(initialDate));
  const [selectedTime, setSelectedTime] = useState(bookingWindowStart);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTimeSlotPickerOpen, setIsTimeSlotPickerOpen] = useState(false);
  const detectedTimeZone = useMemo(() => getBrowserTimeZone(), []);
  const [selectedTimeZone, setSelectedTimeZone] = useState(detectedTimeZone);
  const [timeZoneSearch, setTimeZoneSearch] = useState(() => getTimeZoneLabel(detectedTimeZone));
  const [isTimeZonePickerOpen, setIsTimeZonePickerOpen] = useState(false);
  const timeSlotComboboxRef = useRef<HTMLDivElement>(null);
  const timeZoneComboboxRef = useRef<HTMLDivElement>(null);

  const calendarDays = getCalendarDays(calendarMonth);
  const timeSlots = useMemo(() => getTimeSlots(duration), [duration]);
  const unavailableSlotSet = useMemo(() => new Set(unavailableSlots), [unavailableSlots]);
  const hasAvailableTimeSlots = timeSlots.some((slot) => !unavailableSlotSet.has(slot));
  const filteredTimeZones = useMemo(() => {
    const query = timeZoneSearch.trim().toLowerCase().replace(',', '.');
    if (!query) return bookingTimeZones;

    return bookingTimeZones
      .map((timeZone, index) => {
        const exactMatch = timeZone.searchTerms.some((term) => term === query);
        const startsWithMatch = timeZone.searchTerms.some((term) => term.startsWith(query));
        const termIncludesMatch = timeZone.searchTerms.some((term) => term.includes(query));
        const fullTextMatch = timeZone.searchText.includes(query);
        const rank = exactMatch ? 0 : startsWithMatch ? 1 : termIncludesMatch ? 2 : fullTextMatch ? 3 : -1;
        return { timeZone, index, rank };
      })
      .filter((result) => result.rank !== -1)
      .sort((first, second) => first.rank - second.rank || first.index - second.index)
      .map((result) => result.timeZone);
  }, [timeZoneSearch]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ id: Date.now(), type, message });
  };

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(() => {
      setToast((currentToast) => (currentToast?.id === toast.id ? null : currentToast));
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!timeSlotComboboxRef.current?.contains(event.target as Node)) {
        setIsTimeSlotPickerOpen(false);
      }

      if (!timeZoneComboboxRef.current?.contains(event.target as Node)) {
        setIsTimeZonePickerOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isBookingModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isBookingModalOpen]);

  useEffect(() => {
    let isCurrentRequest = true;

    const fetchUnavailableSlots = async () => {
      setIsLoadingUnavailableSlots(true);

      try {
        const slots = await bookingsService.getUnavailableSlots(toDateKey(selectedDate), selectedTimeZone, duration);
        if (isCurrentRequest) {
          setUnavailableSlots(slots);
        }
      } catch (error) {
        console.error('Unable to load booked slots:', error);
        if (isCurrentRequest) {
          setUnavailableSlots([]);
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoadingUnavailableSlots(false);
        }
      }
    };

    fetchUnavailableSlots();

    return () => {
      isCurrentRequest = false;
    };
  }, [availabilityRefreshKey, duration, selectedDate, selectedTimeZone]);

  useEffect(() => {
    if (!unavailableSlotSet.has(selectedTime)) return;

    const nextAvailableSlot = timeSlots.find((slot) => !unavailableSlotSet.has(slot));
    if (nextAvailableSlot) {
      setSelectedTime(nextAvailableSlot);
    }
  }, [selectedTime, timeSlots, unavailableSlotSet]);

  const selectTimeZone = (timeZone: { value: string; label: string }) => {
    setSelectedTimeZone(timeZone.value);
    setTimeZoneSearch(timeZone.label);
    setIsTimeZonePickerOpen(false);
  };

  const selectTimeSlot = (slot: string) => {
    if (unavailableSlotSet.has(slot)) return;

    setSelectedTime(slot);
    setIsTimeSlotPickerOpen(false);
  };

  const openBookingModal = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(bookingWindowStart);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    if (isBookingSubmitting) return;

    setIsBookingModalOpen(false);
    setIsTimeSlotPickerOpen(false);
    setIsTimeZonePickerOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const attachment = formData.get('attachment');

    setIsSubmitting(true);

    try {
      await contactMessagesService.create({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        hiring_reason: String(formData.get('hiringReason') || ''),
        project_details: String(formData.get('projectDetails') || ''),
        attachment: attachment instanceof File ? attachment : null,
      });

      showToast('success', 'Message saved successfully. I will get back to you shortly.');
      form.reset();
      setAttachmentName('');
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Unable to save your message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!selectedTime) {
      showToast('error', 'Please choose a time slot.');
      return;
    }

    if (unavailableSlotSet.has(selectedTime)) {
      showToast('error', 'That time slot is already booked. Please choose another slot.');
      return;
    }

    const formData = new FormData(form);
    const searchedTimeZone = timeZoneSearch.trim();
    const matchedTimeZone = bookingTimeZones.find((timeZone) => {
      const label = timeZone.label.toLowerCase();
      const value = timeZone.value.toLowerCase();
      const query = searchedTimeZone.toLowerCase();
      return label === query || value === query;
    }) || (searchedTimeZone ? filteredTimeZones[0] : undefined);
    const bookingTimeZone = matchedTimeZone?.value || selectedTimeZone;

    if (matchedTimeZone) {
      selectTimeZone(matchedTimeZone);
    }

    setIsBookingSubmitting(true);

    try {
      const country = String(formData.get('bookingCountry') || '').trim();
      const description = String(formData.get('bookingDescription') || '').trim();
      const bookingNotes = [
        country ? `Country: ${country}` : '',
        description ? `Description: ${description}` : '',
      ].filter(Boolean).join('\n\n') || null;

      await bookingsService.create({
        meeting_type: 'discovery_call',
        duration_minutes: duration,
        meeting_date: toDateKey(selectedDate),
        start_time: selectedTime,
        timezone: bookingTimeZone,
        client_name: String(formData.get('bookingName') || ''),
        client_email: String(formData.get('bookingEmail') || ''),
        client_phone: String(formData.get('bookingPhone') || '') || null,
        notes: bookingNotes,
        status: 'pending',
        source: 'contact_page',
      });

      showToast('success', 'Booking request created successfully. I will confirm it shortly.');
      setAvailabilityRefreshKey((key) => key + 1);
      form.reset();
      setIsBookingModalOpen(false);
      setIsTimeSlotPickerOpen(false);
      setIsTimeZonePickerOpen(false);
    } catch (error) {
      const message = error instanceof Error && error.message.toLowerCase().includes('conflict')
        ? 'That time slot is already booked. Please choose another slot.'
        : error instanceof Error
          ? error.message
          : 'Unable to save your booking right now.';

      showToast('error', message);
      setAvailabilityRefreshKey((key) => key + 1);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 lg:space-y-14">
      <SectionIntro
        eyebrow="Contact"
        title="Let&apos;s talk about the next useful thing to build."
        description="Reach out for roles, collaborations, teaching work, or product ideas that need a clean implementation."
        align="center"
      />

      <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1.08fr)_auto_minmax(0,0.92fr)] 2xl:items-start">
        <Surface className="relative z-10 min-w-0 overflow-visible">
          <div className="border-b border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Step 1</p>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">Book a Discovery Call</h2>
                <div className="mt-3 grid gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 sm:flex sm:flex-wrap">
                  <span className="inline-flex min-w-0 items-center gap-1 border border-zinc-200 bg-white/70 px-2.5 py-1.5 dark:border-white/10 dark:bg-white/5">
                    <FiVideo className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="truncate">Google Meet or Zoom</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="min-w-0 truncate text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">{monthFormatter.format(calendarMonth)}</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                  className="inline-flex h-10 w-10 items-center justify-center border border-zinc-200 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-950 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/30 dark:hover:text-white"
                  aria-label="Previous month"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                  className="inline-flex h-10 w-10 items-center justify-center border border-zinc-200 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-950 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/30 dark:hover:text-white"
                  aria-label="Next month"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-y border-zinc-200 py-3 text-center text-[10px] font-semibold uppercase text-zinc-700 dark:border-white/10 dark:text-zinc-300 sm:text-xs sm:tracking-[0.12em]">
              {dayNames.map((dayName) => (
                <span key={dayName}>{dayName}</span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <span key={`blank-${index}`} className="aspect-square" />;
                }

                const isSelected = toDateKey(date) === toDateKey(selectedDate);
                const isBookable = isBookableDate(date);

                return (
                  <button
                    key={toDateKey(date)}
                    type="button"
                    disabled={!isBookable}
                    onClick={() => openBookingModal(date)}
                    className={`aspect-square min-h-12 text-sm font-semibold transition sm:min-h-16 sm:text-base ${
                      isSelected
                        ? 'bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950'
                        : isBookable
                          ? 'bg-zinc-100 text-zinc-950 hover:bg-emerald-100 dark:bg-white/10 dark:text-white dark:hover:bg-emerald-500/20'
                          : 'text-zinc-400 dark:text-zinc-600'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
      </Surface>

        {isBookingModalOpen && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-zinc-950/60 p-4 sm:p-6" role="dialog" aria-modal="true">
            <div className="flex max-h-[min(88vh,760px)] w-full max-w-2xl flex-col border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950">
              <div className="shrink-0 flex items-start justify-between gap-4 border-b border-zinc-200 p-4 dark:border-white/10 sm:p-5">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">Booking</p>
                  <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {formatModalDate(selectedDate)}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-zinc-200 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-950 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/30 dark:hover:text-white"
                  aria-label="Close booking form"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="grid min-w-0 max-w-full gap-4 overflow-y-auto overflow-x-visible p-4 sm:p-5">
                <div className="grid min-w-0 gap-3 border border-zinc-200 bg-zinc-50 p-3 dark:border-white/10 dark:bg-white/5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">Meeting duration</p>
                  </div>
                  <div className="grid min-w-0 grid-cols-2 border border-zinc-200 bg-white p-1 dark:border-white/10 dark:bg-zinc-950 sm:w-48">
                    {durationOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setDuration(option);
                          setSelectedTime(bookingWindowStart);
                        }}
                        className={`inline-flex min-h-9 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap px-2 py-1.5 text-xs font-semibold leading-none transition ${
                          duration === option
                            ? 'bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950'
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white'
                        }`}
                        aria-pressed={duration === option}
                      >
                        <FiClock className="h-3.5 w-3.5" />
                        {option} min
                      </button>
                    ))}
                  </div>
                </div>

                <div ref={timeZoneComboboxRef} className="relative grid min-w-0 gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  Your location / time zone
                  <input
                    type="text"
                    value={timeZoneSearch}
                    onChange={(event) => {
                      setTimeZoneSearch(event.target.value);
                      setIsTimeZonePickerOpen(true);
                    }}
                    onFocus={() => setIsTimeZonePickerOpen(true)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && filteredTimeZones[0]) {
                        event.preventDefault();
                        selectTimeZone(filteredTimeZones[0]);
                      }

                      if (event.key === 'Escape') {
                        setIsTimeZonePickerOpen(false);
                      }
                    }}
                    className={inputClass}
                    role="combobox"
                    aria-expanded={isTimeZonePickerOpen}
                    aria-controls="booking-timezone-options"
                    aria-autocomplete="list"
                    placeholder="Search city or timezone"
                  />
                  {isTimeZonePickerOpen && (
                    <div
                      id="booking-timezone-options"
                      role="listbox"
                      className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 min-w-0 overflow-y-auto border border-zinc-200 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-950"
                    >
                      {filteredTimeZones.length > 0 ? (
                        filteredTimeZones.map((timeZone) => (
                          <button
                            key={timeZone.value}
                            type="button"
                            onClick={() => selectTimeZone(timeZone)}
                            className={`block w-full min-w-0 px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300 ${
                              selectedTimeZone === timeZone.value
                                ? 'bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-white'
                                : 'text-zinc-600 dark:text-zinc-300'
                            }`}
                            role="option"
                            aria-selected={selectedTimeZone === timeZone.value}
                          >
                            <span className="block truncate">{timeZone.label}</span>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">No time zones found</p>
                      )}
                    </div>
                  )}
                </div>

                <div ref={timeSlotComboboxRef} className="relative grid min-w-0 gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  <div className="flex items-center justify-between gap-3">
                    <span>Time slot</span>
                    <Pill tone="neutral">24h</Pill>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTimeSlotPickerOpen((isOpen) => !isOpen)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setIsTimeSlotPickerOpen(true);
                      }

                      if (event.key === 'Escape') {
                        setIsTimeSlotPickerOpen(false);
                      }
                    }}
                    className={`${inputClass} flex items-center justify-between text-left`}
                    role="combobox"
                    aria-expanded={isTimeSlotPickerOpen}
                    aria-controls="booking-time-slot-options"
                    aria-label="Time slot"
                  >
                    <span>{hasAvailableTimeSlots ? selectedTime : 'No slots available'}</span>
                    <FiChevronRight className={`h-4 w-4 text-zinc-400 transition ${isTimeSlotPickerOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isTimeSlotPickerOpen && (
                    <div
                      id="booking-time-slot-options"
                      role="listbox"
                      className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 min-w-0 overflow-y-auto border border-zinc-200 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-950"
                    >
                      {isLoadingUnavailableSlots && (
                        <p className="px-3 py-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">Checking booked slots...</p>
                      )}
                      {timeSlots.map((slot) => {
                        const isUnavailable = unavailableSlotSet.has(slot);

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isUnavailable}
                            onClick={() => selectTimeSlot(slot)}
                            className={`flex w-full min-w-0 items-center justify-between gap-3 px-3 py-3 text-left text-sm font-bold transition ${
                              selectedTime === slot
                                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                                : isUnavailable
                                  ? 'cursor-not-allowed bg-zinc-50 text-zinc-400 line-through dark:bg-white/[0.03] dark:text-zinc-600'
                                  : 'text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-zinc-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300'
                            }`}
                            role="option"
                            aria-selected={selectedTime === slot}
                            aria-disabled={isUnavailable}
                          >
                            <span>{slot}</span>
                            {isUnavailable && <span className="text-xs font-semibold no-underline">Booked</span>}
                          </button>
                        );
                      })}
                      {!hasAvailableTimeSlots && !isLoadingUnavailableSlots && (
                        <p className="border-t border-zinc-200 px-3 py-3 text-sm font-semibold text-red-600 dark:border-white/10 dark:text-red-300">
                          No slots available for this date.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  <input name="bookingName" required className={inputClass} placeholder="Name" aria-label="Name" />
                  <input name="bookingEmail" type="email" required className={inputClass} placeholder="Email" aria-label="Email" />
                  <input name="bookingPhone" type="tel" required className={inputClass} placeholder="Phone" aria-label="Phone" />
                  <input name="bookingCountry" required className={inputClass} placeholder="Country" aria-label="Country" />
                  <textarea
                    name="bookingDescription"
                    rows={3}
                    required
                    className={`${inputClass} min-h-28 resize-none sm:col-span-2`}
                    placeholder="Description"
                    aria-label="Description"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isBookingSubmitting || !hasAvailableTimeSlots}
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBookingSubmitting ? 'Saving...' : 'Request Booking'}
                  <FiCheckCircle className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}

        <div className="flex items-center justify-center 2xl:min-h-[32rem]">
          <div className="flex w-full items-center gap-3 2xl:h-full 2xl:w-auto 2xl:flex-col">
            <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10 2xl:h-auto 2xl:w-px" />
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-zinc-200 bg-white text-xs font-bold uppercase tracking-[0.16em] text-zinc-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              OR
            </span>
            <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10 2xl:h-auto 2xl:w-px" />
          </div>
        </div>

        <Surface className="min-w-0 overflow-hidden">
          <div className="border-b border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                <FiSend className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Step 2</p>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">Send a Message</h2>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid min-w-0 max-w-full gap-4 overflow-hidden p-4 sm:p-5 lg:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-300">
                  Your Name
                </label>
                <div className={fieldWrapClass}>
                  <FiUser className={fieldIconClass} />
                  <input type="text" name="name" id="name" required className={inputWithIconClass} placeholder="Pathum Dissanayake" />
                </div>
              </div>
              <div className="min-w-0">
                <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-300">
                  Email Address
                </label>
                <div className={fieldWrapClass}>
                  <FiMail className={fieldIconClass} />
                  <input type="email" name="email" id="email" required className={inputWithIconClass} placeholder="pathumlk.diz@gmail.com" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="phone" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-300">
                  Phone Number
                </label>
                <div className={fieldWrapClass}>
                  <FiPhone className={fieldIconClass} />
                  <input type="tel" name="phone" id="phone" required className={inputWithIconClass} placeholder="+94767342605" />
                </div>
              </div>
              <div className="min-w-0">
                <label htmlFor="hiringReason" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-300">
                  Why are you hiring me?
                </label>
                <div className={fieldWrapClass}>
                  <FiMessageSquare className={fieldIconClass} />
                  <input type="text" name="hiringReason" id="hiringReason" required className={inputWithIconClass} placeholder="To create a portfolio website" />
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <label htmlFor="projectDetails" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-300">
                Project Details
              </label>
              <div className={fieldWrapClass}>
                <FiMessageSquare className={textareaIconClass} />
                <textarea name="projectDetails" id="projectDetails" rows={5} required className={textareaWithIconClass} placeholder="Briefly explain what you need..." />
              </div>
            </div>
            <div className="min-w-0">
              <label htmlFor="attachment" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-300">
                Attachment <span className="font-medium text-zinc-500 dark:text-zinc-400">(optional, PDF only)</span>
              </label>
              <label
                htmlFor="attachment"
                className="flex min-w-0 max-w-full cursor-pointer flex-col gap-2 border border-dashed border-zinc-300 bg-white px-3 py-4 text-sm font-medium text-zinc-600 transition hover:border-emerald-500 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-white sm:flex-row sm:items-center sm:justify-between sm:px-4"
              >
                <span className="inline-flex min-w-0 items-center gap-3">
                  <FiPaperclip className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="truncate">{attachmentName || 'Upload a PDF brief or project document'}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  <FiFileText className="h-4 w-4" />
                  Choose file
                </span>
              </label>
              <input
                type="file"
                name="attachment"
                id="attachment"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                    showToast('error', 'Only PDF files can be attached.');
                    event.currentTarget.value = '';
                    setAttachmentName('');
                    return;
                  }
                  setAttachmentName(file?.name || '');
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <FiSend className="h-4 w-4" />
            </button>
            <p className="border border-zinc-200 bg-white/70 px-4 py-3 text-sm font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              Your information is protected and will never be shared with third parties.
            </p>
          </form>
        </Surface>
      </section>
      {toast && createPortal(
        <div className="fixed bottom-4 left-4 right-4 z-[60] sm:left-auto sm:right-6 sm:w-full sm:max-w-md">
          <div
            className={`flex min-w-0 items-start gap-3 border bg-white p-4 shadow-2xl dark:bg-[#151518] ${
              toast.type === 'success'
                ? 'border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                : 'border-red-500/40 text-red-800 dark:text-red-200'
            }`}
            role={toast.type === 'error' ? 'alert' : 'status'}
            aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
          >
            <span className={`mt-0.5 shrink-0 ${toast.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
              {toast.type === 'success' ? <FiCheckCircle className="h-5 w-5" /> : <FiAlertCircle className="h-5 w-5" />}
            </span>
            <p className="min-w-0 flex-1 text-sm font-semibold leading-6">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-zinc-200 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-950 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/30 dark:hover:text-white"
              aria-label="Close notification"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ContactPage;
