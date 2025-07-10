"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/inbox", label: "Inbox" },
    { href: "/dashboard/my-money", label: "My Money" },
    { href: "/dashboard/appointments", label: "Appointments" },
    { href: "/dashboard/clients", label: "Clients" },
    { href: "/dashboard/invoices", label: "Invoices" },
    { href: "/dashboard/certifications", label: "Certifications" },
    { href: "/dashboard/job-files", label: "Job Files" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Main application header */}
      <header className="bg-gray-800 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 font-bold text-xl"
                aria-label="Go to Dashboard"
              >
                <Image
                  src="/logo.png"
                  alt="Ten99 Logo"
                  width={32}
                  height={32}
                  priority
                />
                <span>Ten99</span>
              </Link>
              {/* Navigation menu */}
              <nav className="hidden md:flex md:ml-10 md:space-x-4">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/scan-documents"
                className="bg-teal-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-600"
              >
                Scan Documents
              </Link>
              <UserButton afterSignOutRedirectUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Page content will render here */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}