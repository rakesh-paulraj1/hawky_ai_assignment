import React, { useState } from 'react';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Invalid phone'),
});

type ContactForm = z.infer<typeof ContactSchema>;

interface LandingPagePreviewProps {
  images: string[]; // base64 or URLs
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
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-8">
      {/* Images */}
      <div className="w-full flex gap-2 overflow-x-auto p-4 bg-gray-100">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Campaign visual ${i + 1}`}
            className="h-48 w-auto rounded shadow object-cover flex-shrink-0"
            loading="lazy"
          />
        ))}
      </div>
      {/* Headline & Subheadline */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">{headline}</h1>
        <p className="text-lg text-gray-600 mb-6">{subheadline}</p>
        <a
          href={`#contact-form?${utmString}`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition mb-6"
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
            className="w-full max-w-sm border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full max-w-sm border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full max-w-sm border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
          {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
            disabled={submitted}
          >
            {submitted ? 'Submitted!' : 'Contact Me'}
          </button>
        </form>
      </div>
    </div>
  );
} 