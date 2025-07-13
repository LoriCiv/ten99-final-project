"use client";
import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
// --- FIX: Using useAuth for better loading state management ---
import { useAuth } from '@clerk/nextjs';
import { getAppointments, getClients, getPersonalNetwork, getJobFiles } from '@/utils/firestoreService';
import type { Appointment, Client, PersonalNetworkContact, JobFile } from '@/types/app-interfaces';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
// --- FIX: Using the correct relative path for the modal, assuming it's in the same folder ---
import AppointmentDetailModal from './AppointmentDetailModal';

export default function AppointmentsPage() {
  // --- FIX: Using useAuth to get isLoaded and userId ---
  const { isLoaded, userId } = useAuth();
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<PersonalNetworkContact[]>([]);
  const [jobFiles, setJobFiles] = useState<JobFile[]>([]);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // --- FIX: Restoring your working modal state logic ---
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // --- FIX: Wait for Clerk to be loaded and have a userId before fetching data ---
    if (isLoaded && userId) {
      const unsubAppointments = getAppointments(userId, setAllAppointments);
      const unsubClients = getClients(userId, setClients);
      const unsubContacts = getPersonalNetwork(userId, setContacts);
      const unsubJobFiles = getJobFiles(userId, setJobFiles);
      
      return () => {
        unsubAppointments();
        unsubClients();
        unsubContacts();
        unsubJobFiles();
      };
    }
  }, [isLoaded, userId]); // Dependency array is now correct

  // --- FIX: Restoring your working modal handlers ---
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const appointmentsForSelectedDay = allAppointments.filter(
    (appt) => new Date(appt.date + 'T00:00:00').toDateString() === selectedDate.toDateString()
  );

  const tileContent = ({ date }: { date: Date }): JSX.Element | null => {
    const hasAppointment = allAppointments.some(
      (appt) => new Date(appt.date + 'T00:00:00').toDateString() === date.toDateString()
    );
    if (hasAppointment) {
      return <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-amber-400 rounded-full"></div>;
    }
    return null;
  };

  const getTileClassName = ({ date }: { date: Date }) => {
    const classes = ['h-16', 'w-full', 'flex', 'flex-col', 'items-center', 'justify-center', 'rounded-lg', 'transition-colors', 'relative', 'hover:bg-gray-700'];
    const today = new Date();
    today.setHours(0,0,0,0);
    if (date.getMonth() !== currentDate.getMonth()) {
      classes.push('text-gray-600');
    } else {
      classes.push('text-white');
    }
    if (date.toDateString() === selectedDate.toDateString()) {
      classes.push('bg-blue-600');
    } else if (date.toDateString() === today.toDateString()) {
      classes.push('bg-gray-700/50', 'border', 'border-blue-500');
    }
    return classes.join(' ');
  };

  // Show a loading state while Clerk initializes
  if (!isLoaded) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <Link href="/dashboard/appointments/new" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <CalendarPlus className="w-4 h-4 mr-2" />
            Schedule New Appointment
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-4 px-2">
                <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-700"><ChevronLeft size={24} /></button>
                <h2 className="text-xl font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-700"><ChevronRight size={24} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map(day => (<div key={day} className="text-center text-xs font-bold text-gray-400 py-2">{day}</div>))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                  const dayNumber = day + 1;
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
                  date.setHours(0,0,0,0);
                  return (
                    <button key={dayNumber} onClick={() => setSelectedDate(date)} className={getTileClassName({ date })}>
                      <span>{dayNumber}</span>
                      {tileContent({ date })}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center items-center mt-4 pt-4 border-t border-gray-700">
                <button onClick={goToToday} className="font-semibold text-white hover:text-gray-300">Go to Today</button>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Schedule for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {appointmentsForSelectedDay.length > 0 ? (
                appointmentsForSelectedDay.map(appt => (
                  <button key={appt.id} onClick={() => handleAppointmentClick(appt)} className="w-full text-left p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">
                    <p className="font-bold text-blue-800 dark:text-blue-200">{appt.subject}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{appt.time}</p>
                  </button>
                ))
              ) : (<p className="text-gray-500">No appointments for this day.</p>)}
            </div>
            <Link href="/dashboard/appointments/new" className="w-full mt-6 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center">
              <CalendarPlus className="w-4 h-4 mr-2" />
              Add Appointment for this Date
            </Link>
          </div>
        </div>
      </div>

      {/* --- FIX: This now correctly uses your state to show the modal --- */}
      {isModalOpen && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          clients={clients}
          contacts={contacts}
          jobFiles={jobFiles}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
