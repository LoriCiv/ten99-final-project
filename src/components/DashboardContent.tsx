"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import type { Appointment, Client } from '@/types/app-interfaces';
import { getAppointments, getClients } from '@/utils/firestoreService';
import Link from 'next/link';

export default function DashboardContent() {
  const { user, isLoaded } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      const today = new Date();
      
      const unsubAppointments = getAppointments(user.id, (allAppointments) => {
        // Filter for upcoming appointments
        const upcoming = allAppointments.filter(appt => new Date(appt.date) >= today);
        setAppointments(upcoming);
      });

      const unsubClients = getClients(user.id, setClients);

      setIsLoading(false);

      return () => {
        unsubAppointments();
        unsubClients();
      };
    } else if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  const getClientName = (clientId?: string) => {
    if (!clientId) return 'N/A';
    const client = clients.find(c => c.id === clientId);
    return client?.companyName || client?.name || 'Unknown Client';
  };

  if (isLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.firstName || 'User'}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.slice(0, 3).map(appt => (
                <div key={appt.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <p className="font-bold">{appt.subject}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(appt.date).toLocaleDateString()} at {appt.time}
                  </p>
                  <p className="text-sm">Client: {getClientName(appt.clientId)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming appointments.</p>
            )}
            <Link href="/dashboard/appointments" className="text-blue-500 hover:underline mt-4 block">
              View all appointments
            </Link>
          </div>
        </div>

        {/* You can add more dashboard cards here */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <p className="text-gray-500">More stats coming soon!</p>
        </div>
      </div>
    </div>
  );
}