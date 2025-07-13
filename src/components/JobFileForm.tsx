"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { addJobFile, updateJobFile } from '@/utils/firestoreService';
import type { JobFile, Client, Appointment } from '@/types/app-interfaces';
import { Save, Upload } from 'lucide-react';

interface JobFileFormProps {
  onSave: () => void;
  onCancel: () => void;
  clients: Client[];
  appointments: Appointment[];
  initialData?: Partial<JobFile>;
}

// A complete, empty state to prevent errors on initialization
const emptyFormState: JobFile = {
  id: '',
  userId: '',
  jobTitle: '',
  status: 'upcoming',
  prepMaterials: { privateNotes: '', sharedNotes: '', attachments: [] },
  clientId: '',
  appointmentId: '',
  createdAt: new Date() as any, // Type assertion for initial state
};

export default function JobFileForm({ onSave, onCancel, clients, appointments, initialData }: JobFileFormProps) {
  const { user } = useUser();
  const [formState, setFormState] = useState<Partial<JobFile>>(emptyFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Deep merge to ensure prepMaterials is not lost
      setFormState(current => ({ ...emptyFormState, ...current, ...initialData }));
    } else {
      setFormState(emptyFormState);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'privateNotes' || name === 'sharedNotes') {
      setFormState(prev => ({
        ...prev,
        prepMaterials: {
          ...prev.prepMaterials!,
          [name]: value,
        }
      }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in.');
      return;
    }
    if (!formState.jobTitle?.trim()) {
      alert('Job file title is required.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (formState.id) {
        await updateJobFile(user.id, formState.id, formState);
        alert('Job file updated!');
      } else {
        await addJobFile(user.id, formState);
        alert('Job file created!');
      }
      onSave();
    } catch (error) {
      console.error("Error saving job file:", error);
      alert('Failed to save job file.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-gray-900 p-8 rounded-lg border border-gray-700">
      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300">Job Title*</label>
        <input type="text" name="jobTitle" id="jobTitle" value={formState.jobTitle || ''} onChange={handleInputChange} className="mt-1 block w-full p-3 border rounded-md bg-gray-700 border-gray-600" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-300">Link to Client (Optional)</label>
          <select name="clientId" id="clientId" value={formState.clientId || ''} onChange={handleInputChange} className="mt-1 block w-full p-3 border rounded-md bg-gray-700 border-gray-600">
            <option value="">-- No Client --</option>
            {(clients || []).map(client => (<option key={client.id} value={client.id}>{client.companyName || client.name}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-300">Link to Appointment (Optional)</label>
          <select name="appointmentId" id="appointmentId" value={formState.appointmentId || ''} onChange={handleInputChange} className="mt-1 block w-full p-3 border rounded-md bg-gray-700 border-gray-600">
            <option value="">-- No Appointment --</option>
            {(appointments || []).map(appt => (<option key={appt.id} value={appt.id}>{`${appt.subject} on ${new Date(appt.date).toLocaleDateString()}`}</option>))}
          </select>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Prep Materials</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="privateNotes" className="block text-sm font-medium text-gray-300">My Private Notes</label>
            <textarea name="privateNotes" id="privateNotes" rows={6} value={formState.prepMaterials?.privateNotes || ''} onChange={handleInputChange} className="mt-1 block w-full p-3 border rounded-md bg-gray-700 border-gray-600" placeholder="Only you can see this." />
          </div>
          <div>
            <label htmlFor="sharedNotes" className="block text-sm font-medium text-gray-300">Shared Notes for Team</label>
            <textarea name="sharedNotes" id="sharedNotes" rows={6} value={formState.prepMaterials?.sharedNotes || ''} onChange={handleInputChange} className="mt-1 block w-full p-3 border rounded-md bg-gray-700 border-gray-600" placeholder="Notes shared with your team or client." />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-5 border-t border-gray-700">
        <div className="flex space-x-4">
          <button type="button" onClick={onCancel} className="bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center">
            <Save className="w-4 h-4 mr-2"/>
            {isSubmitting ? 'Saving...' : 'Save Job File'}
          </button>
        </div>
      </div>
    </form>
  );
}
