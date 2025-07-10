// src/components/ClientsPageContent.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs'; // Import the useUser hook
import { db } from '@/utils/firebaseConfig';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { Client } from '@/types/app-interfaces';

// NOTE: In a larger application, the ClientForm component would be in its own file.
// For simplicity here, it is included in this one file.

// --- ClientForm Component ---
interface ClientFormProps {
  userId: string;
  initialData?: Client | null;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ userId, initialData, onSave, onCancel }) => {
  // Set up the form's state, pre-filling with initialData if editing
  const [formData, setFormData] = useState({
    billingName: initialData?.billingName || '',
    contactPerson: initialData?.contactPerson || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    notes: initialData?.notes || '',
    clientType: initialData?.clientType || 'business_1099',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct the client object to be saved, including the userId
    const clientToSave = {
      ...formData,
      userId: userId,
      clientType: formData.clientType as Client['clientType'],
    };
    onSave(clientToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">{initialData ? 'Edit Client' : 'Add New Client'}</h3>
      
      <div>
        <label htmlFor="clientType" className="block text-sm font-bold text-gray-700">Client Type</label>
        <select
          id="clientType"
          name="clientType"
          value={formData.clientType}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="business_1099">Business (1099)</option>
          <option value="individual_1099">Individual (1099)</option>
          <option value="employer_w2">Employer (W2)</option>
        </select>
      </div>

      <div>
        <label htmlFor="billingName" className="block text-sm font-bold text-gray-700">Billing/Company Name</label>
        <input type="text" id="billingName" name="billingName" value={formData.billingName} onChange={handleChange} className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" required />
      </div>

      {/* ... other form fields (contactPerson, email, phone, etc.) ... */}
      
      <div className="flex space-x-4">
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
          {initialData ? 'Update Client' : 'Save Client'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
};


// --- Main ClientsPageContent Component ---
const ClientsPageContent: React.FC = () => {
  const { user } = useUser(); // Get the current user from Clerk
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to manage which view is active (list, form, or detail)
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // This useEffect sets up the real-time data subscription
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };

    setLoading(true);
    
    const clientsQuery = query(collection(db, 'clients'), where("userId", "==", user.id));

    const unsubscribe = onSnapshot(clientsQuery, (querySnapshot) => {
      const clientsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Client;
      });
      setClients(clientsList);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching clients in real-time:", err);
      setError("Failed to load clients.");
      setLoading(false);
    });

    return () => unsubscribe();

  }, [user]);

  const handleSaveClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      setError("You must be logged in to save a client.");
      return;
    }

    try {
      if (editingClient && editingClient.id) {
        const clientRef = doc(db, 'clients', editingClient.id);
        await updateDoc(clientRef, {
          ...clientData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'clients'), {
          ...clientData,
          userId: user.id, // Ensure userId is set on new documents
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setView('list');
      setEditingClient(null);
    } catch (err) {
      console.error("Error saving client:", err);
      setError("Failed to save client.");
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'clients', id));
    } catch (err) {
      console.error("Error deleting client:", err);
      setError("Failed to delete client.");
    }
  };

  const handleAddNew = () => {
    setEditingClient(null);
    setView('form');
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setView('form');
  };

  if (loading) return <p className="text-center text-gray-600">Loading clients...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!user) return <p className="text-center text-gray-600">Please sign in to manage your clients.</p>;

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Clients</h2>
        {view === 'list' && (
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add New Client
          </button>
        )}
      </div>

      {view === 'form' && (
        <ClientForm
          userId={user.id}
          initialData={editingClient}
          onSave={handleSaveClient}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.length > 0 ? (
            clients.map((client) => (
              <div key={client.id} className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <h4 className="text-lg font-bold text-gray-900">{client.billingName}</h4>
                <p className="text-sm text-gray-600">{client.contactPerson}</p>
                <p className="text-sm text-gray-600">{client.email}</p>
                <div className="mt-4 flex space-x-2">
                   <button onClick={() => handleEdit(client)} className="text-sm text-blue-600 hover:underline">Edit</button>
                   <button onClick={() => handleDeleteClient(client.id!)} className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full">No clients found. Add a new client to get started!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsPageContent;
