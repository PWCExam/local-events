'use client';

import { useState } from 'react';
import { LocalEvent, EventCategory, EventLocation, CATEGORIES, LOCATIONS, INSTAGRAM_ACCOUNTS } from '@/types/event';
import { Button, Input, Select } from '@/components/ui';
import { toDateString } from '@/lib/dateUtils';

interface EventFormProps {
  onSubmit: (data: Omit<LocalEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function EventForm({ onSubmit }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(toDateString(new Date()));
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<EventCategory>('beer');
  const [location, setLocation] = useState<EventLocation>('Ventura');
  const [venue, setVenue] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      date,
      time: time || undefined,
      category,
      location,
      venue: venue.trim() || undefined,
      instagramHandle: instagramHandle || undefined,
      instagramUrl: instagramUrl.trim() || undefined,
      externalUrl: externalUrl.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDate(toDateString(new Date()));
    setTime('');
    setCategory('beer');
    setLocation('Ventura');
    setVenue('');
    setInstagramHandle('');
    setInstagramUrl('');
    setExternalUrl('');
    setErrors({});
  };

  const categoryOptions = CATEGORIES.map((c) => ({ value: c.value, label: c.label }));
  const locationOptions = LOCATIONS.map((l) => ({ value: l, label: l }));
  const igOptions = [
    { value: '', label: 'Select account...' },
    ...INSTAGRAM_ACCOUNTS.map((a) => ({ value: a.handle, label: `${a.handle} (${a.category})` })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        placeholder="Beach cleanup, tap takeover, gallery opening..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
        <textarea
          placeholder="Event details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
        <Input
          label="Time"
          placeholder="7:00 PM"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value as EventCategory)}
        />
        <Select
          label="Location"
          options={locationOptions}
          value={location}
          onChange={(e) => setLocation(e.target.value as EventLocation)}
        />
      </div>

      <Input
        label="Venue"
        placeholder="Topa Topa Brewing, Rincon Point..."
        value={venue}
        onChange={(e) => setVenue(e.target.value)}
      />

      <Select
        label="Instagram Account"
        options={igOptions}
        value={instagramHandle}
        onChange={(e) => setInstagramHandle(e.target.value)}
      />

      <Input
        label="Instagram Post URL"
        placeholder="https://www.instagram.com/p/..."
        value={instagramUrl}
        onChange={(e) => setInstagramUrl(e.target.value)}
      />

      <Input
        label="External URL"
        placeholder="https://tickets.example.com"
        value={externalUrl}
        onChange={(e) => setExternalUrl(e.target.value)}
      />

      <Button type="submit" size="lg" className="w-full">
        Add Event
      </Button>
    </form>
  );
}
