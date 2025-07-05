"use client";
import React, { useState, useEffect } from 'react';

// Define the shape of our appointment data
interface Appointment {
  id: string;
  subject?: string;
  clientName?: string;
  dateTime?: string;
}

export default function DashboardPage() {
  // Use our new Appointment type instead of 'any'
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('https://api.ten99.app/api/getAppointments');
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Pending Appointments</h1>

      {isLoading && <p>Loading appointments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="space-y-4">
          {appointments.length > 0 ? (
            // Use our Appointment type for 'appt'
            appointments.map((appt: Appointment) => (
              <div key={appt.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg">{appt.subject || 'No Subject'}</h3>
                <p><strong>Client:</strong> {appt.clientName || 'N/A'}</p>
                <p><strong>Date/Time:</strong> {appt.dateTime || 'N/A'}</p>
                <div className="mt-4">
                  <button className="bg-green-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-green-600">Accept</button>
                  <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">Decline</button>
                </div>
              </div>
            ))
          ) : (
            <p>No pending appointments found.</p>
          )}
        </div>
      )}
    </div>
  );
}
