import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { ClientOnly } from '@/components/ClientOnly';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard Navigation</h2>
        <ul>
          <li>Clients</li>
          <li>Appointments</li>
          <li>Inbox</li>
          <li>Job Files</li>
          <li>My Money</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <header className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome to your Dashboard
          </h1>
          <div>
            <ClientOnly>
              <UserButton afterSignOutRedirectUrl="/" />
            </ClientOnly>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}