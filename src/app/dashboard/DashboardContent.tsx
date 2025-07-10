"use client";

import { useState, useEffect } from 'react';

// This is a simplified Appointment type for this component
interface Appointment {
  id: string;
  description: string;
  startTime: string;
}

export default function DashboardClient() {
  const [pending, setPending] = useState<Appointment[]>([]);
  const [confirmed, setConfirmed] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    // Logic to accept an appointment will go here
  };

  const handleDecline = async (appointmentId: string) => {
    setLoadingId(appointmentId);
    // Logic to decline an appointment will go here
  };

  if (isLoading) {
    return <p className="text-center p-8">Loading appointments...</p>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
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
        </div>
        <div className="mt-4 space-y-4">
          {confirmed.length > 0 ? (
            confirmed.map((appt) => (
              <div key={appt.id} className="p-4 border rounded-lg shadow-sm bg-green-50">
                <p><strong>Description:</strong> {appt.description}</p>
                <p><strong>Start Time:</strong> {new Date(appt.startTime).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="mt-4 text-gray-500">No confirmed appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
}
