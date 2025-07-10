"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs'; // We'll use this to know if we should fetch
import { Appointment } from '@/types/app-interfaces'; // Using the main Appointment type

export default function DashboardContent() {
  const { user, isLoaded } = useUser(); // Get the user and loading state from Clerk
  const [pending, setPending] = useState<Appointment[]>([]);
  const [confirmed, setConfirmed] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait until Clerk has loaded the user information before doing anything
    if (!isLoaded) {
      return;
    }

    // If the user is not signed in, we don't need to fetch data.
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/get-appointments');
        
        // Check if the API call was successful
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();
        setPending(data.pending || []);
        setConfirmed(data.confirmed || []);

      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Could not load your appointments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, isLoaded]); // This effect runs when the user logs in or out

  const handleAccept = async (appointmentToAccept: Appointment) => {
    // Placeholder for accept logic
    console.log("Accepting:", appointmentToAccept.id);
  };

  const handleDecline = async (appointmentId: string) => {
    // Placeholder for decline logic
    console.log("Declining:", appointmentId);
  };

  // --- Render Logic ---

  if (isLoading) {
    return <p className="text-center p-8">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-center p-8 text-red-500">{error}</p>;
  }
  
  if (!user) {
      return <p className="text-center p-8">Please sign in to view your dashboard.</p>
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
                  <button onClick={() => handleDecline(appt.id!)} disabled={loadingId === appt.id} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-400">
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
