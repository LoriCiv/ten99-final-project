"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { addAppointment, updateAppointment } from '@/utils/firestoreService';
import type { Appointment, Client, PersonalNetworkContact, JobFile } from '@/types/app-interfaces';

interface AppointmentFormProps {
  onCancel: () => void;
  onSave: () => void;
  clients: Client[];
  contacts: PersonalNetworkContact[];
  jobFiles: JobFile[];
  initialData?: Partial<Appointment>;
}

export default function AppointmentForm({ 
  onCancel,
  onSave,
  clients = [],
  contacts = [],
  jobFiles = [],
  initialData
}: AppointmentFormProps) {
  const { user } = useUser();
  const isEditMode = !!initialData?.id;

  const [formState, setFormState] = useState<Partial<Appointment>>({});
  const [locationType, setLocationType] = useState<'physical' | 'virtual' | ''>('');

  useEffect(() => {
    const startingData = initialData || {};
    setFormState(startingData);
    setLocationType(startingData.locationType || '');
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in.");
      return;
    }
    if (!formState.subject || !formState.date || !formState.time) {
      alert("Subject, Date, and Time are required fields.");
      return;
    }
    
    const dataToSave = {
      ...formState,
      status: formState.status || 'scheduled',
      locationType: locationType,
    };

    try {
      if (isEditMode) {
        await updateAppointment(user.id, formState.id!, dataToSave);
        alert("Appointment updated successfully!");
      } else {
        await addAppointment(user.id, dataToSave);
        alert("Appointment saved successfully!");
      }
      onSave();
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Appointment' : 'New Appointment'} Details</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Subject*</label>
          <input name="subject" value={formState.subject || ''} onChange={handleInputChange} type="text" placeholder="e.g., On-site at Apple HQ" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Billing Client</label>
          <select name="clientId" value={formState.clientId || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700">
            <option value="">-- Select Client --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.companyName || client.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Working With (Contact)</label>
          <select name="contactId" value={formState.contactId || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700">
            <option value="">-- Select Contact --</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>{contact.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Date*</label>
          <input name="date" value={formState.date || ''} onChange={handleInputChange} type="date" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Start Time*</label>
            <input name="time" value={formState.time || ''} onChange={handleInputChange} type="time" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input name="endTime" value={formState.endTime || ''} onChange={handleInputChange} type="time" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Location Type</label>
          <select name="locationType" value={locationType} onChange={(e) => setLocationType(e.target.value as any)} className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700">
            <option value="">Not Specified</option>
            <option value="physical">Physical Address</option>
            <option value="virtual">Virtual Meeting</option>
          </select>
        </div>
        {locationType === 'physical' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Physical Address</label>
            <input name="address" value={formState.address || ''} onChange={handleInputChange} type="text" placeholder="123 Main St, Anytown, USA" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>
        )}
        {locationType === 'virtual' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Virtual Meeting Link</label>
            <input name="virtualLink" value={formState.virtualLink || ''} onChange={handleInputChange} type="url" placeholder="https://zoom.us/j/..." className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium">Job Type/Label</label>
          <input name="jobType" value={formState.jobType || ''} onChange={handleInputChange} type="text" placeholder="e.g., VRI, Consultation" className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label className="block text-sm font-medium">Link to Job File</label>
          <select name="jobFileId" value={formState.jobFileId || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700">
            <option value="">-- No Linked File --</option>
            {/* --- THIS IS THE FIX --- */}
            {jobFiles.map(file => (
              <option key={file.id} value={file.id}>{file.jobTitle}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Appointment Notes</label>
          <textarea name="notes" value={formState.notes || ''} onChange={handleInputChange} placeholder="Add any specific details for this job..." rows={4} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
        </div>
        <div className="md:col-span-2 flex justify-end items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <button type="button" onClick={onCancel} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
              {isEditMode ? 'Update Appointment' : 'Save Appointment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
