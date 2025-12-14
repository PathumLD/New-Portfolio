
import React, { useState } from 'react';
import { profileData } from '../data/profile';

const ContactPage: React.FC = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Thank you for your message! I will get back to you shortly.');
        const form = e.target as HTMLFormElement;
        form.reset();
        setTimeout(() => setStatus(''), 5000);
    };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Contact Me</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">I'd love to hear from you. Let's get in touch.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-black/5 dark:border-white/10 animated-element animate-fade-in-up" style={{ '--stagger': 1 } as React.CSSProperties}>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input type="text" name="name" id="name" required className="block w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 border border-black/10 dark:border-white/20 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input type="email" name="email" id="email" required className="block w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 border border-black/10 dark:border-white/20 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"/>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea name="message" id="message" rows={4} required className="block w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 border border-black/10 dark:border-white/20 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
            </div>
            <div>
                <button type="submit" className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-105">
                    Send Message
                </button>
            </div>
            {status && <p className="text-center text-green-600 dark:text-green-400 mt-4">{status}</p>}
          </form>
        </div>
        <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Contact Information</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                    <strong>Email:</strong> <a href={`mailto:${profileData.email}`} className="text-primary-600 hover:underline">{profileData.email}</a>
                </p>
                <p>
                    <strong>Location:</strong> Earth
                </p>
                <div className="flex space-x-4 mt-4">
                    {profileData.socials.map(social => (
                        <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">
                            <social.icon className="h-8 w-8" />
                            <span className="sr-only">{social.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-16 animated-element animate-fade-in-up" style={{ '--stagger': 2 } as React.CSSProperties}>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">My Location</h2>
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg border border-black/5 dark:border-white/10 overflow-hidden group">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555024464!2d-122.50764019364633!3d37.75776271101234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1678886483342!5m2!1sen!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[450px] grayscale group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
