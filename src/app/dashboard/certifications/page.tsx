"use client";

import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import Image from 'next/image';
import '../globals.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Main application header */}
      <header className="bg-gray-800 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2 font-bold text-xl">
                 <Image src="/logo.png" alt="Ten99 Logo" width={32} height={32} />
                 <span>Ten99</span>
              </Link>
              {/* This is the full navigation bar */}
              <nav className="hidden md:flex md:ml-10 md:space-x-4">
                <Link href="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <Link href="/dashboard/inbox" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Inbox</Link>
                <Link href="/dashboard/my-money" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My Money</Link>
                <Link href="/dashboard/appointments" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Appointments</Link>
                <Link href="/dashboard/clients" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Clients</Link>
                <Link href="/dashboard/invoices" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Invoices</Link>
                <Link href="/dashboard/certifications" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Certifications</Link>
                <Link href="/dashboard/job-files" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Job Files</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
               <Link href="/dashboard/scan-documents" className="bg-teal-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-600">Scan Documents</Link>
               <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>
      
      {/* Page content will render here */}
      <main className="py-10">
        {children}
      </main>
    </div>
  );
}
