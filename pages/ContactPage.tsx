import React, { useState } from 'react';
import { FiFileText, FiMail, FiMapPin, FiMessageSquare, FiPaperclip, FiPhone, FiSend, FiUser } from 'react-icons/fi';
import { profileData } from '../data/profile';
import { Pill, SectionIntro, Surface } from '../components/PublicUI';

const inputClass =
  'block w-full border border-zinc-300 bg-white/80 px-3 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500';

const fieldIconClass = 'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500';
const textareaIconClass = 'pointer-events-none absolute left-3 top-4 h-4 w-4 text-zinc-400 dark:text-zinc-500';
const inputWithIconClass = `${inputClass} pl-10`;
const textareaWithIconClass = `${inputClass} pl-10`;
type SubmitStatus = {
  type: 'success' | 'error';
  message: string;
} | null;

function getAttachmentPayload(attachment: FormDataEntryValue | null) {
  if (!(attachment instanceof File) || attachment.size === 0) {
    return null;
  }

  return {
    name: attachment.name,
    size: attachment.size,
    type: attachment.type,
  };
}

const ContactPage: React.FC = () => {
  const [status, setStatus] = useState<SubmitStatus>(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const attachment = formData.get('attachment');

    setIsSubmitting(true);
    setStatus(null);

    try {
      const submission = {
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        hiringReason: String(formData.get('hiringReason') || ''),
        projectDetails: String(formData.get('projectDetails') || ''),
        attachment: getAttachmentPayload(attachment),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });
      const result = await response.json().catch(() => ({ message: '' }));

      if (!response.ok) {
        throw new Error(result.message || 'Unable to send your message right now.');
      }

      setStatus({ type: 'success', message: 'Thank you for your message. I will get back to you shortly.' });
      form.reset();
      setAttachmentName('');
      window.setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to send your message right now.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-14">
      <SectionIntro
        eyebrow="Contact"
        title="Let&apos;s talk about the next useful thing to build."
        description="Reach out for roles, collaborations, teaching work, or product ideas that need a clean implementation."
        align="center"
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Surface className="p-6 md:p-8">
          <div className="mb-7 flex items-center gap-3">
            <FiSend className="h-6 w-6 text-emerald-500" />
            <Pill tone="emerald">Message</Pill>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  Your Name
                </label>
                <div className="relative">
                  <FiUser className={fieldIconClass} />
                  <input type="text" name="name" id="name" required className={inputWithIconClass} placeholder="Pathum Dissanayake" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className={fieldIconClass} />
                  <input type="email" name="email" id="email" required className={inputWithIconClass} placeholder="pathumlk.diz@gmail.com" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className={fieldIconClass} />
                  <input type="tel" name="phone" id="phone" required className={inputWithIconClass} placeholder="+94767342605" />
                </div>
              </div>
              <div>
                <label htmlFor="hiringReason" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  Why are you hiring me?
                </label>
                <div className="relative">
                  <FiMessageSquare className={fieldIconClass} />
                  <input type="text" name="hiringReason" id="hiringReason" required className={inputWithIconClass} placeholder="To create a portfolio website" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="projectDetails" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                Project Details
              </label>
              <div className="relative">
                <FiMessageSquare className={textareaIconClass} />
                <textarea name="projectDetails" id="projectDetails" rows={7} required className={textareaWithIconClass} placeholder="Briefly explain what you need..." />
              </div>
            </div>
            <div>
              <label htmlFor="attachment" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                Attachment <span className="font-medium text-zinc-500 dark:text-zinc-400">(optional)</span>
              </label>
              <label
                htmlFor="attachment"
                className="flex cursor-pointer flex-col gap-2 border border-dashed border-zinc-300 bg-white/80 px-4 py-4 text-sm text-zinc-600 transition hover:border-emerald-500 hover:text-zinc-950 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-white sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="inline-flex min-w-0 items-center gap-3">
                  <FiPaperclip className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="truncate">{attachmentName || 'Upload brief, reference file, or project document'}</span>
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
                className="sr-only"
                onChange={(event) => setAttachmentName(event.currentTarget.files?.[0]?.name || '')}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <FiSend className="h-4 w-4" />
            </button>
            <p className="border border-zinc-300 bg-white/70 px-4 py-3 text-sm font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              Your information is protected and will never be shared with third parties.
            </p>
            {status && (
              <p
                className={`border px-4 py-3 text-sm font-semibold ${
                  status.type === 'success'
                    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300'
                }`}
                role="status"
                aria-live="polite"
              >
                {status.message}
              </p>
            )}
          </form>
        </Surface>

        <div className="space-y-5">
          <Surface className="p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Direct details</h2>
            <div className="mt-6 grid gap-4">
              <a href={`mailto:${profileData.email}`} className="flex items-start gap-3 border border-zinc-200 bg-white/60 p-4 transition hover:border-emerald-500 dark:border-white/10 dark:bg-white/5">
                <FiMail className="mt-1 h-5 w-5 text-emerald-500" />
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Email</span>
                  <span className="mt-1 block break-all text-sm font-semibold text-zinc-950 dark:text-white">{profileData.email}</span>
                </span>
              </a>
              {profileData.phone && (
                <a href={`tel:${profileData.phone}`} className="flex items-start gap-3 border border-zinc-200 bg-white/60 p-4 transition hover:border-emerald-500 dark:border-white/10 dark:bg-white/5">
                  <FiPhone className="mt-1 h-5 w-5 text-cyan-500" />
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Phone</span>
                    <span className="mt-1 block text-sm font-semibold text-zinc-950 dark:text-white">{profileData.phone}</span>
                  </span>
                </a>
              )}
              <div className="flex items-start gap-3 border border-zinc-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                <FiMapPin className="mt-1 h-5 w-5 text-amber-500" />
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Location</span>
                  <span className="mt-1 block text-sm font-semibold text-zinc-950 dark:text-white">{profileData.location}</span>
                </span>
              </div>
            </div>
          </Surface>

          <Surface className="overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15828.841002411154!2d80.2565217!3d7.330267849999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3180aee201c1b%3A0xbd1fabb7e545857d!2sPoramadala!5e0!3m2!1sen!2slk!4v1783584334903!5m2!1sen!2slk"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-80 w-full grayscale transition duration-500 hover:grayscale-0"
              title="Poramadala, Sri Lanka map"
            />
          </Surface>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
