'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import VisitorCounter from '@/components/layout/VisitorCounter';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import EventList from '@/components/events/EventList';
import EventForm from '@/components/events/EventForm';
import { ToastContainer } from '@/components/ui';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/useToast';

export default function Home() {
  const [activeTab, setActiveTab] = useState('calendar');
  const { events, isLoaded, addEvent, deleteEvent } = useEvents();
  const { toasts, showToast, dismissToast } = useToast();

  const handleAddEvent = (data: Parameters<typeof addEvent>[0]) => {
    addEvent(data);
    showToast('success', 'Event added!');
    setActiveTab('calendar');
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    showToast('success', 'Event deleted');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-zinc-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-6 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <CalendarGrid events={events} onDelete={handleDeleteEvent} />
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <EventList events={events} onDelete={handleDeleteEvent} />
            </motion.div>
          )}

          {activeTab === 'add' && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-zinc-900 rounded-xl border border-white/5 shadow-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Add Event</h2>
                <EventForm onSubmit={handleAddEvent} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <VisitorCounter />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
