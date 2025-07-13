"use client";

import Link from 'next/link';
import type { Appointment, Client, PersonalNetworkContact } from '@/types/app-interfaces';
import { PlusCircle, Users, Calendar } from 'lucide-react';

interface DashboardContentProps {
  appointments: Appointment[];
  clients: Client[];
  personalNetwork: PersonalNetworkContact[];
}

export default function DashboardContent({
  appointments,
  clients,
  personalNetwork,
}: DashboardContentProps) {
  
  // FIX: Add a fallback to an empty array to prevent a crash if the data is not ready yet.
  // Also, filter for appointments that are today or in the future.
  const upcomingAppointments = (appointments || [])
    .filter(appt => new Date(appt.date + 'T00:00:00') >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5); // Show the next 5

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* FIX: This link now correctly points to the new appointment page */}
        <Link 
          href="/dashboard/appointments/new" 
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Appointment
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Appointments Column */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-3 text-blue-500" />
            Upcoming Appointments
          </h2>
          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(appt => (
                <div key={appt.id} className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <p className="font-bold">{appt.subject}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {/* FIX: Correctly handle the date string */}
                    {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {appt.time}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">You have no upcoming appointments.</p>
            )}
          </div>
        </div>

        {/* At a Glance Column */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">At a Glance</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <Users className="w-6 h-6 mr-4 text-green-600 dark:text-green-400" />
              <div>
                {/* FIX: Add a fallback for clients array */}
                <p className="text-2xl font-bold">{(clients || []).length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Clients</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Users className="w-6 h-6 mr-4 text-purple-600 dark:text-purple-400" />
              <div>
                {/* FIX: Add a fallback for personalNetwork array */}
                <p className="text-2xl font-bold">{(personalNetwork || []).length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Network Contacts</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
