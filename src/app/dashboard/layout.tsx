import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ClientOnly } from "@/components/ClientOnly";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Sidebar Navigation */}
      <aside className="w-56 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col">
        <div className="mb-8 text-center">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-800 dark:text-white">
                Ten99
            </Link>
        </div>
        <nav className="flex-grow space-y-2">
          <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700">Dashboard</Link>
          <Link href="/dashboard/clients" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700">Clients</Link>
          <Link href="/dashboard/inbox" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700">Inbox</Link>
          <Link href="/dashboard/job-files" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700">Job Files</Link>
          {/* 👇 This is the new line */}
          <Link href="/dashboard/appointments" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-700">Appointments</Link>
        </nav>
        <div className="mt-auto p-4 flex justify-center">
            <ClientOnly>
                <UserButton />
            </ClientOnly>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
