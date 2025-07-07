"use client";

import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="bg-gray-800 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="font-bold text-xl">Ten99</Link>
              <nav className="hidden md:flex md:ml-10 md:space-x-4">
                <Link href="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
               <Link href="/dashboard/scan-documents" className="bg-teal-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-600">Scan Documents</Link>
               <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>
      
      <main className="py-10">
        {children}
      </main>
    </div>
  );
}
