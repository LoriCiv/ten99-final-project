"use client";

import { useState, useEffect } from 'react';

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

  // ... (rest of the functions: handleAccept, handleDecline)

  if (isLoading) {
    return <p className="text-center p-8">Loading appointments...</p>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Pending Appointments Section */}
      <div>
        <h2 className="text-2xl font-semibold border-b pb-2">Pending Appointments</h2>
        {/* ... JSX for pending appointments */}
      </div>
      {/* Confirmed Appointments Section */}
      <div>
        <h2 className="text-2xl font-semibold">Confirmed Appointments</h2>
        {/* ... JSX for confirmed appointments */}
      </div>
    </div>
  );
}
