"use client";

import { useState, useEffect } from 'react';

// A simplified type for appointments in this component
interface Appointment {
  id: string;
  description: string;
  startTime: string;
}

export default function DashboardContent() {
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
    // Logic to accept an appointment
  };

  const handleDecline = async (appointmentId: string) => {
    setLoadingId(appointmentId);
    // Logic to decline an appointment
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
                {/* JSX for pending appointments */}
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
                {/* JSX for confirmed appointments */}
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
