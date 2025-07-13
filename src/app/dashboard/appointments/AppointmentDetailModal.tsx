"use client";

import { useState, useEffect } from 'react';
import type { Appointment, Client, PersonalNetworkContact, JobFile } from '@/types/app-interfaces';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { updateAppointment, deleteAppointment } from '@/utils/firestoreService';
import AppointmentForm from '@/components/AppointmentForm';
import { X, Edit, Trash2, Calendar, Clock, MapPin, Link as LinkIcon, FileText, User, Briefcase, DollarSign, FolderPlus } from 'lucide-react';

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  clients: Client[];
  contacts: PersonalNetworkContact[];
  jobFiles: JobFile[];
  onClose: () => void;
}

export default function AppointmentDetailModal({ appointment, clients, contacts, jobFiles, onClose }: AppointmentDetailModalProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [localAppointment, setLocalAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    setLocalAppointment(appointment);
    setIsEditing(false);
  }, [appointment]);

  if (!localAppointment) return null;

  const handleCreateJobFile = () => {
    const query = new URLSearchParams({
        appointmentId: localAppointment.id || '',
        clientId: localAppointment.clientId || '',
        subject: localAppointment.subject || '',
        date: localAppointment.date || ''
    }).toString();
    
    router.push(`/dashboard/job-files?${query}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this appointment?")) {
      if (user && localAppointment.id) {
        await deleteAppointment(user.id, localAppointment.id);
        onClose();
      }
    }
  };

  const handleStatusChange = async (newStatus: 'scheduled' | 'completed' | 'canceled' | 'canceled-billable') => {
     if (user && localAppointment.id) {
        await updateAppointment(user.id, localAppointment.id, { status: newStatus });
        setLocalAppointment(prev => prev ? { ...prev, status: newStatus } : null);
     }
  };

  const getClientName = (clientId?: string) => clients.find(c => c.id === clientId)?.companyName || 'N/A';
  const getContactName = (contactId?: string) => contacts.find(c => c.id === contactId)?.name || 'N/A';
  const displayStatus = localAppointment.status || 'scheduled';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{isEditing ? 'Edit Appointment' : 'Appointment Details'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={28} /></button>
          </div>

          {isEditing ? (
            <AppointmentForm
              initialData={localAppointment}
              clients={clients}
              contacts={contacts}
              jobFiles={jobFiles}
              onCancel={() => setIsEditing(false)}
              onSave={() => { setIsEditing(false); onClose(); }}
            />
          ) : (
            <div>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{localAppointment.subject}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-gray-500" /> <span>{new Date(localAppointment.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
                    <div className="flex items-center"><Clock className="w-5 h-5 mr-3 text-gray-500" /> <span>{localAppointment.time} {localAppointment.endTime && `- ${localAppointment.endTime}`}</span></div>
                    <div className="flex items-center"><Briefcase className="w-5 h-5 mr-3 text-gray-500" /> <span>Client: <strong>{getClientName(localAppointment.clientId)}</strong></span></div>
                    <div className="flex items-center"><User className="w-5 h-5 mr-3 text-gray-500" /> <span>Contact: <strong>{getContactName(localAppointment.contactId)}</strong></span></div>
                </div>
                {localAppointment.address && <div className="flex items-start"><MapPin className="w-5 h-5 mr-3 mt-1 text-gray-500" /> <div><strong>Location:</strong><br/>{localAppointment.address}</div></div>}
                {localAppointment.virtualLink && <div className="flex items-start"><LinkIcon className="w-5 h-5 mr-3 mt-1 text-gray-500" /> <div><strong>Meeting Link:</strong><br/><a href={localAppointment.virtualLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{localAppointment.virtualLink}</a></div></div>}
                {localAppointment.notes && <div className="flex items-start"><FileText className="w-5 h-5 mr-3 mt-1 text-gray-500" /> <div><strong>Notes:</strong><br/><p className="whitespace-pre-wrap">{localAppointment.notes}</p></div></div>}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500">Status: </span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${ displayStatus === 'completed' ? 'bg-green-100 text-green-800' : displayStatus === 'canceled-billable' ? 'bg-orange-100 text-orange-800' : displayStatus === 'canceled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800' }`}>{displayStatus.replace('-', ' ')}</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 justify-between">
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center"><Edit className="w-4 h-4 mr-2"/>Edit</button>
                    <button onClick={handleCreateJobFile} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center">
                        <FolderPlus className="w-4 h-4 mr-2"/>
                        Create Job File
                    </button>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleStatusChange('completed')} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600">Mark as Completed</button>
                    <button onClick={() => handleStatusChange('canceled-billable')} className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center"><DollarSign className="w-4 h-4 mr-2"/>Cancel (Billable)</button>
                    <button onClick={() => handleStatusChange('canceled')} className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600">Cancel (Non-Billable)</button>
                    <button onClick={handleDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 flex items-center"><Trash2 className="w-4 h-4 mr-2"/>Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
