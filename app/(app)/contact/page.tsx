'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Send, MapPin, Mail, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      toast.success('Your message has been received. We will respond shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-cinzel text-bone mb-4">Contact Us</h1>
        <p className="text-aged-silver font-crimson text-lg italic max-w-2xl mx-auto">
          &quot;Speak, and let your voice echo in the void. We are listening.&quot;
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
            <h2 className="font-cinzel text-xl text-bone mb-6 flex items-center gap-3">
              <MapPin className="text-blood-red" />
              Sanctuary Location
            </h2>
            <address className="not-italic text-aged-silver font-crimson space-y-2">
              <p>Memento Mori Atelier</p>
              <p>123 Shadow Lane, Dark District</p>
              <p>Istanbul, Turkey</p>
            </address>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
            <h2 className="font-cinzel text-xl text-bone mb-6 flex items-center gap-3">
              <Mail className="text-blood-red" />
              Digital Correspondence
            </h2>
            <p className="text-aged-silver font-crimson">
              For inquiries regarding orders, sizing, or artifacts:
              <br />
              <a href="mailto:support@mementomori.com" className="text-bone hover:text-blood-red transition-colors mt-2 inline-block">
                support@mementomori.com
              </a>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-black/40 border border-white/5 p-8 rounded-sm backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-xs font-cinzel text-aged-silver uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 text-bone p-3 focus:outline-none focus:border-blood-red/50 transition-colors font-crimson"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-cinzel text-aged-silver uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 text-bone p-3 focus:outline-none focus:border-blood-red/50 transition-colors font-crimson"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-cinzel text-aged-silver uppercase tracking-wider mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 text-bone p-3 focus:outline-none focus:border-blood-red/50 transition-colors font-crimson"
                placeholder="What is this regarding?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-cinzel text-aged-silver uppercase tracking-wider mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-white/5 border border-white/10 text-bone p-3 focus:outline-none focus:border-blood-red/50 transition-colors font-crimson resize-none"
                placeholder="Write your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blood-red text-bone font-cinzel hover:bg-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
