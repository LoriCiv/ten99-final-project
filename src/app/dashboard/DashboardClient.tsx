"use client";

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type CalendarValue = Date | [Date | null, Date | null] | null;

interface Appointment {
  id: string;
  description: string;
  startTime: string;
}

export default function DashboardClient() {
  const [pending, setPending] = useState<Appointment[]>([]);
  const [confirmed, setConfirmed] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/get-appointments');
        const data = await response.json();
        setPending(data.pending || []);
        setConfirmed(data.confirmed || []);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleAccept = async (appointmentToAccept: Appointment) => {
    setLoadingId(appointmentToAccept.id);
    try {
      await fetch('/api/accept', {
        method: 'POST',
        body: JSON.stringify({ id: appointmentToAccept.id }),
      });
      const newlyConfirmed = { ...appointmentToAccept, status: 'confirmed' };
      setConfirmed(prev => [...prev, newlyConfirmed].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()));
      setPending(prev => prev.filter(appt => appt.id !== appointmentToAccept.id));
    } catch (error) {
      console.error("Error accepting appointment:", error);
      alert("There was an error accepting the appointment.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (appointmentId: string) => {
    setLoadingId(appointmentId);
    try {
      await fetch('/api/decline', {
        method: 'POST',
        body: JSON.stringify({ id: appointmentId }),
      });
      setPending(prev => prev.filter(appt => appt.id !== appointmentId));
    } catch (error) {
      console.error("Error declining appointment:", error);
      alert("There was an error declining the appointment.");
    } finally {
      setLoadingId(null);
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const hasAppointment = confirmed.some(
        (appt) => new Date(appt.startTime).toDateString() === date.toDateString()
      );
      if (hasAppointment) {
        return <div className="h-2 w-2 bg-blue-500 rounded-full mx-auto mt-1"></div>;
      }
    }
    return null;
  };

  const filteredConfirmed = selectedDate
    ? confirmed.filter(appt => new Date(appt.startTime).toDateString() === (selectedDate as Date).toDateString())
    : confirmed;

  if (isLoading) {
    return <p className="text-center p-8">Loading appointments...</p>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-10">
        <div>
          <h2 className="text-2xl font-semibold border-b pb-2">Pending Appointments</h2>
          <div className="mt-4 space-y-4">
            {pending.length > 0 ? (
              pending.map((appt) => (
                <div key={appt.id} className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center">
                  <div>
                    <p><strong>Description:</strong> {appt.description}</p>
                    <p><strong>Start Time:</strong> {new Date(appt.startTime).toLocaleString()}</p>
                  </div>
                  <div className="space-x-2 flex-shrink-0">
                    <button onClick={() => handleAccept(appt)} disabled={loadingId === appt.id} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400">
                      {loadingId === appt.id ? 'Accepting...' : 'Accept'}
                    </button>
                    <button onClick={() => handleDecline(appt.id)} disabled={loadingId === appt.id} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-400">
                      {loadingId === appt.id ? 'Declining...' : 'Decline'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-4 text-gray-500">No pending appointments.</p>
            )}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-2xl font-semibold">Confirmed Appointments</h2>
            {selectedDate && (<button onClick={() => setSelectedDate(null)} className="text-sm text-blue-600 hover:underline">Show All</button>)}
          </div>
          <div className="mt-4 space-y-4">
            {filteredConfirmed.length > 0 ? (
              filteredConfirmed.map((appt) => (
                <div key={appt.id} className="p-4 border rounded-lg shadow-sm bg-green-50">
                  <p><strong>Description:</strong> {appt.description}</p>
                  <p><strong>Start Time:</strong> {new Date(appt.startTime).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="mt-4 text-gray-500">{selectedDate ? "No appointments on this day." : "No confirmed appointments."}</p>
            )}
          </div>
        </div>
      </div>
      <div className="md:col-span-1">
        <h2 className="text-2xl font-semibold border-b pb-2">Your Schedule</h2>
        <div className="mt-4">
          <Calendar onChange={setSelectedDate} value={selectedDate} className="mx-auto" tileContent={tileContent} />
        </div>
      </div>
    </div>
  );
}
