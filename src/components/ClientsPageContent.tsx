// src/components/ClientsPageContent.tsx
'use client'; // This component uses client-side interactivity

import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Client, PersonalNetworkContact } from '@/types/app-interfaces';

// --- ClientDetailView Component (inlined) ---
interface ClientDetailViewProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client, onEdit, onDelete, onBack }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 className="text-2xl font-bold mb-4 text-gray-800">{client.billingName}</h3>
    <p className="mb-2"><span className="font-semibold">Contact Person:</span> {client.contactPerson}</p>
    <p className="mb-2"><span className="font-semibold">Email:</span> {client.email}</p>
    <p className="mb-2"><span className="font-semibold">Phone:</span> {client.phone}</p>
    <p className="mb-2"><span className="font-semibold">Address:</span> {client.address}</p>
    {client.notes && <p className="mb-4"><span className="font-semibold">Notes:</span> {client.notes}</p>}
    <div className="flex space-x-4">
      <button
        onClick={() => onEdit(client)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Edit Client
      </button>
      <button
        onClick={() => onDelete(client.id!)}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Delete Client
      </button>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
      >
        Back to Clients
      </button>
    </div>
  </div>
);

// --- ContactDetailView Component (inlined) ---
interface ContactDetailViewProps {
  contact: PersonalNetworkContact;
  onEdit: (contact: PersonalNetworkContact) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const ContactDetailView: React.FC<ContactDetailViewProps> = ({ contact, onEdit, onDelete, onBack }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 className="text-2xl font-bold mb-4 text-gray-800">{contact.name}</h3>
    <p className="mb-2"><span className="font-semibold">Relationship:</span> {contact.relationship}</p>
    {contact.email && <p className="mb-2"><span className="font-semibold">Email:</span> {contact.email}</p>}
    {contact.phone && <p className="mb-2"><span className="font-semibold">Phone:</span> {contact.phone}</p>}
    {contact.notes && <p className="mb-4"><span className="font-semibold">Notes:</span> {contact.notes}</p>}
    <div className="flex space-x-4">
      <button
        onClick={() => onEdit(contact)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Edit Contact
      </button>
      <button
        onClick={() => onDelete(contact.id!)}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Delete Contact
      </button>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
      >
        Back to Contacts
      </button>
    </div>
  </div>
);


// --- ClientForm Component (inlined) ---
interface ClientFormProps {
  initialData?: Client | null;
  onSave: (client: Client) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Client>(initialData || {
    billingName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, updatedAt: new Date() });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">{initialData ? 'Edit Client' : 'Add New Client'}</h3>
      <div className="mb-4">
        <label htmlFor="billingName" className="block text-gray-700 text-sm font-bold mb-2">Billing Name:</label>
        <input
          type="text"
          id="billingName"
          name="billingName"
          value={formData.billingName}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="contactPerson" className="block text-gray-700 text-sm font-bold mb-2">Contact Person:</label>
        <input
          type="text"
          id="contactPerson"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
      <div className="flex space-x-4">
        <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
        {initialData ? 'Update Client' : 'Add Client'}
        </button>
        <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
        >
        Cancel
        </button>
      </div>
    </form>
  );
};


// --- ContactForm Component (inlined) ---
interface ContactFormProps {
  initialData?: PersonalNetworkContact | null;
  onSave: (contact: PersonalNetworkContact) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PersonalNetworkContact>(initialData || {
    name: '',
    relationship: '',
    email: '',
    phone: '',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, updatedAt: new Date() });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">{initialData ? 'Edit Contact' : 'Add New Contact'}</h3>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="relationship" className="block text-gray-700 text-sm font-bold mb-2">Relationship:</label>
        <input
          type="text"
          id="relationship"
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
      <div className="flex space-x-4">
        <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
        {initialData ? 'Update Contact' : 'Add Contact'}
        </button>
        <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
        >
        Cancel
        </button>
      </div>
    </form>
  );
};


// --- Main ClientsPageContent Component ---
const ClientsPageContent: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<PersonalNetworkContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showClientForm, setShowClientForm] = useState(false);

  const [selectedContact, setSelectedContact] = useState<PersonalNetworkContact | null>(null);
  const [editingContact, setEditingContact] = useState<PersonalNetworkContact | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsCollectionRef = collection(db, 'clients');
        const clientsSnapshot = await getDocs(clientsCollectionRef);
        const clientsList = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        setClients(clientsList);

        const contactsCollectionRef = collection(db, 'personalNetworkContacts');
        const contactsSnapshot = await getDocs(contactsCollectionRef);
        const contactsList = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PersonalNetworkContact));
        setContacts(contactsList);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Client Operations
  const handleAddOrUpdateClient = async (client: Client) => {
    try {
      if (client.id) {
        // Update existing client
        const clientRef = doc(db, 'clients', client.id);
        await updateDoc(clientRef, { ...client });
        setClients(clients.map(c => (c.id === client.id ? client : c)));
      } else {
        // Add new client
        const newClientRef = await addDoc(collection(db, 'clients'), client);
        setClients([...clients, { ...client, id: newClientRef.id }]);
      }
      setShowClientForm(false);
      setEditingClient(null);
      setSelectedClient(null); // Clear selection after save
    } catch (err) {
      console.error("Error saving client:", err);
      setError("Failed to save client.");
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteDoc(doc(db, 'clients', id));
        setClients(clients.filter(client => client.id !== id));
        setSelectedClient(null); // Deselect after deletion
      } catch (err) {
        console.error("Error deleting client:", err);
        setError("Failed to delete client.");
      }
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientForm(true);
    setSelectedClient(null); // Hide detail view when editing
  };

  const handleViewClientDetail = (client: Client) => {
    setSelectedClient(client);
    setShowClientForm(false);
    setEditingClient(null);
  };

  const handleCancelClientForm = () => {
    setShowClientForm(false);
    setEditingClient(null);
  };

  // Contact Operations
  const handleAddOrUpdateContact = async (contact: PersonalNetworkContact) => {
    try {
      if (contact.id) {
        // Update existing contact
        const contactRef = doc(db, 'personalNetworkContacts', contact.id);
        await updateDoc(contactRef, { ...contact });
        setContacts(contacts.map(c => (c.id === contact.id ? contact : c)));
      } else {
        // Add new contact
        const newContactRef = await addDoc(collection(db, 'personalNetworkContacts'), contact);
        setContacts([...contacts, { ...contact, id: newContactRef.id }]);
      }
      setShowContactForm(false);
      setEditingContact(null);
      setSelectedContact(null); // Clear selection after save
    } catch (err) {
      console.error("Error saving contact:", err);
      setError("Failed to save contact.");
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteDoc(doc(db, 'personalNetworkContacts', id));
        setContacts(contacts.filter(contact => contact.id !== id));
        setSelectedContact(null); // Deselect after deletion
      } catch (err) {
        console.error("Error deleting contact:", err);
        setError("Failed to delete contact.");
      }
    }
  };

  const handleEditContact = (contact: PersonalNetworkContact) => {
    setEditingContact(contact);
    setShowContactForm(true);
    setSelectedContact(null); // Hide detail view when editing
  };

  const handleViewContactDetail = (contact: PersonalNetworkContact) => {
    setSelectedContact(contact);
    setShowContactForm(false);
    setEditingContact(null);
  };

  const handleCancelContactForm = () => {
    setShowContactForm(false);
    setEditingContact(null);
  };


  if (loading) return <p className="text-center text-gray-600">Loading clients and contacts...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Clients & Personal Network</h2>

      {/* Client Section */}
      <div className="mb-10 border-b pb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-700">Clients</h3>
          {!showClientForm && !selectedClient && (
            <button
              onClick={() => { setShowClientForm(true); setEditingClient(null); }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add New Client
            </button>
          )}
        </div>

        {showClientForm && (
          <ClientForm
            initialData={editingClient}
            onSave={handleAddOrUpdateClient}
            onCancel={handleCancelClientForm}
          />
        )}

        {selectedClient && (
          <ClientDetailView
            client={selectedClient}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            onBack={() => setSelectedClient(null)}
          />
        )}

        {!showClientForm && !selectedClient && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.length > 0 ? (
              clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleViewClientDetail(client)}
                  className="bg-gray-50 p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200"
                >
                  <h4 className="text-lg font-bold text-gray-900">{client.billingName}</h4>
                  <p className="text-sm text-gray-600">{client.contactPerson}</p>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-full">No clients found. Add a new client to get started!</p>
            )}
          </div>
        )}
      </div>

      {/* Personal Network Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-700">Personal Network</h3>
          {!showContactForm && !selectedContact && (
            <button
              onClick={() => { setShowContactForm(true); setEditingContact(null); }}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add New Contact
            </button>
          )}
        </div>

        {showContactForm && (
          <ContactForm
            initialData={editingContact}
            onSave={handleAddOrUpdateContact}
            onCancel={handleCancelContactForm}
          />
        )}

        {selectedContact && (
          <ContactDetailView
            contact={selectedContact}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            onBack={() => setSelectedContact(null)}
          />
        )}

        {!showContactForm && !selectedContact && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleViewContactDetail(contact)}
                  className="bg-gray-50 p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow duration-200"
                >
                  <h4 className="text-lg font-bold text-gray-900">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.relationship}</p>
                  {contact.email && <p className="text-sm text-gray-600">{contact.email}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-full">No personal network contacts found. Add a new contact to get started!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPageContent;