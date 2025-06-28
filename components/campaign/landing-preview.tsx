import React, { useState } from 'react';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Invalid phone'),
});

type ContactForm = z.infer<typeof ContactSchema>;

interface LandingPagePreviewProps {
  images: string[]; 
  headline: string;
  subheadline: string;
  ctaText: string;
  utmParams: Record<string, string>;
  onSubmit?: (data: ContactForm) => void;
}

export function LandingPagePreview({
  images,
  headline,
  subheadline,
  ctaText,
  utmParams,
  onSubmit,
}: LandingPagePreviewProps) {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [submitted, setSubmitted] = useState(false);

  const utmString = Object.entries(utmParams)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = ContactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<ContactForm> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof ContactForm] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSubmitted(true);
    onSubmit?.(form);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-8 border border-gray-700">
      {/* Images */}
      <div className="w-full flex gap-2 overflow-x-auto p-4 bg-gray-700">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Campaign visual ${i + 1}`}
            className="h-48 w-auto rounded shadow-lg object-cover flex-shrink-0 border border-gray-600"
            loading="lazy"
          />
        ))}
      </div>
      {/* Headline & Subheadline */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-white">{headline}</h1>
        <p className="text-lg text-gray-300 mb-6">{subheadline}</p>
        <a
          href={`#contact-form?${utmString}`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 mb-6"
        >
          {ctaText}
        </a>
        {/* Contact Form */}
        <form
          id="contact-form"
          className="mt-6 flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
          action={`/?${utmString}`}
          method="POST"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full max-w-sm bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors duration-200"
            required
          />
          {errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full max-w-sm bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors duration-200"
            required
          />
          {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full max-w-sm bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors duration-200"
            required
          />
          {errors.phone && <span className="text-red-400 text-xs">{errors.phone}</span>}
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitted}
          >
            {submitted ? 'Submitted!' : 'Contact Me'}
          </button>
        </form>
      </div>
    </div>
  );
} 