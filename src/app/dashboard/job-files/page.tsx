"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
// --- FIX: Using useAuth to manage loading state ---
import { useAuth } from '@clerk/nextjs';
import { getJobFiles, getClients, getAppointments } from '@/utils/firestoreService';
import type { JobFile, Client, Appointment } from '@/types/app-interfaces';
import JobFileForm from '@/components/JobFileForm';
import JobFileDetailModal from '@/components/JobFileDetailModal';
import { PlusCircle, Search, ArrowLeft } from 'lucide-react';

export default function JobFilesPage() {
  // --- FIX: Getting isLoaded and userId from useAuth ---
  const { isLoaded, userId } = useAuth();
  const [jobFiles, setJobFiles] = useState<JobFile[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<JobFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<JobFile | null>(null);

  useEffect(() => {
    // --- FIX: Only fetch data when authentication is ready ---
    if (isLoaded && userId) {
      const unsubJobFiles = getJobFiles(userId, setJobFiles);
      const unsubClients = getClients(userId, setClients);
      const unsubAppointments = getAppointments(userId, setAppointments);
      
      return () => {
        unsubJobFiles();
        unsubClients();
        unsubAppointments();
      };
    }
  }, [isLoaded, userId]); // Dependency array is correct

  useEffect(() => {
    // This check prevents the filter from running on an undefined array
    if (jobFiles) {
      const sorted = [...jobFiles].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      let filtered = sorted;
      if (searchTerm) {
        filtered = sorted.filter(file =>
          file.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredFiles(filtered);
    }
  }, [searchTerm, jobFiles]);

  const getAppointmentDate = (appointmentId?: string) => {
    if (!appointmentId) return null;
    const appt = appointments.find(a => a.id === appointmentId);
    return appt ? new Date(appt.date).toLocaleDateString() : null;
  };

  const handleSave = () => {
    setIsFormVisible(false);
    setSelectedFile(null);
  };

  // --- FIX: Show a loading state until Clerk is ready ---
  if (!isLoaded || !userId) {
    return <div className="p-8 text-center">Loading Job Files...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-semibold text-gray-300 hover:text-blue-400 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Files</h1>
        {!isFormVisible && (
          <button onClick={() => setIsFormVisible(true)} className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Job File
          </button>
        )}
      </div>

      {isFormVisible ? (
        <JobFileForm 
          clients={clients} 
          appointments={appointments} 
          onSave={handleSave} 
          onCancel={() => setIsFormVisible(false)} 
        />
      ) : (
        <>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map(file => {
              const appointmentDate = getAppointmentDate(file.appointmentId);
              return (
                <button key={file.id} onClick={() => setSelectedFile(file)} className="bg-gray-800 p-4 rounded-lg shadow-md text-left w-full hover:bg-gray-700">
                  <h3 className="font-bold text-lg truncate text-white">{file.jobTitle}</h3>
                  <p className="text-sm text-yellow-400">Status: {file.status || 'Pending'}</p>
                  {appointmentDate && <p className="text-sm text-gray-400">Date: {appointmentDate}</p>}
                </button>
              );
            })}
          </div>
        </>
      )}

      {selectedFile && (
        <JobFileDetailModal 
            file={selectedFile} 
            clients={clients} 
            appointments={appointments}
            onClose={() => setSelectedFile(null)} 
            onSave={handleSave} 
        />
      )}
    </div>
  );
}
