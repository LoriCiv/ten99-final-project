"use client";
import React, { useState, useEffect, useMemo } from 'react';
import type { Client, PersonalNetworkContact } from '@/types/app-interfaces';
import { useUser } from '@clerk/nextjs';
import { addClient, addPersonalNetworkContact, getClients, getPersonalNetwork } from '@/utils/firestoreService';
import { Building, Users } from 'lucide-react';

export default function ClientsPageContent() {
  const { user, isLoaded } = useUser();

  const [clients, setClients] = useState<Client[]>([]);
  const [personalNetwork, setPersonalNetwork] = useState<PersonalNetworkContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientFormVisible, setIsClientFormVisible] = useState(false);
  const [clientFormState, setClientFormState] = useState<Partial<Client>>({
    clientType: 'business_1099', name: '', companyName: '', status: 'Active'
  });
  const [isContactFormVisible, setIsContactFormVisible] = useState(false);
  const [contactFormState, setContactFormState] = useState<{
    name?: string; email?: string; phone?: string; notes?: string; tagsInput?: string; clientId?: string;
  }>({ name: '', email: '', phone: '', notes: '', tagsInput: '', clientId: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      const unsubscribeClients = getClients(user.id, setClients);
      const unsubscribePersonalNetwork = getPersonalNetwork(user.id, setPersonalNetwork);
      setIsLoading(false);

      return () => {
        unsubscribeClients();
        unsubscribePersonalNetwork();
      };
    } else {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value;
    setClientFormState(prev => ({ ...prev, [name]: finalValue }));
  };
  
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { alert("Authentication error. Please try again."); return; }
    if (!clientFormState.companyName?.trim() && !clientFormState.name?.trim()) {
      alert('A Company Name or Primary Contact Name is required.');
      return;
    }
    const cleanedData: { [key: string]: any } = {};
    Object.entries(clientFormState).forEach(([key, value]) => {
      if (value !== undefined && value !== '') cleanedData[key] = value;
    });
    try {
      await addClient(user.id, cleanedData);
      alert('Client saved!');
      setIsClientFormVisible(false);
      setClientFormState({ clientType: 'business_1099', name: '', companyName: '', status: 'Active' });
    } catch (error) {
      console.error("Error saving client:", error);
      alert('Failed to save client.');
    }
  };

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { alert("Authentication error. Please try again."); return; }
    if (!contactFormState.name?.trim()) { alert('Contact Name is required.'); return; }
    
    const tags = contactFormState.tagsInput?.split(',').map(tag => tag.trim()).filter(Boolean) || [];
    const contactData = { ...contactFormState, tags, tagsInput: undefined };
    const cleanedData: { [key: string]: any } = {};
    Object.entries(contactData).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)) {
        cleanedData[key] = value;
      }
    });
    try {
      await addPersonalNetworkContact(user.id, cleanedData);
      alert('Contact saved!');
      setIsContactFormVisible(false);
      setContactFormState({ name: '', email: '', phone: '', notes: '', tagsInput: '', clientId: '' });
    } catch (error) {
      console.error("Error saving contact:", error);
      alert('Failed to save contact.');
    }
  };

  const combinedAddressBook = useMemo(() => {
    const formattedClients = clients.map(c => ({ id: c.id, name: c.companyName || c.name, subtext: c.companyName ? c.name : c.email, type: 'Company', tags: c.clientType ? [c.clientType.replace(/_/g, ' ')] : [], icon: <Building className="w-5 h-5 text-purple-400 flex-shrink-0" /> }));
    const formattedContacts = personalNetwork.map(p => { const companyName = p.clientId ? clients.find(c => c.id === p.clientId)?.companyName : null; return { id: p.id, name: p.name, subtext: companyName ? `${p.email || ''} | ${companyName}` : p.email, type: 'Contact', tags: p.tags || [], icon: <Users className="w-5 h-5 text-green-400 flex-shrink-0" /> }; });
    return [...formattedClients, ...formattedContacts].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [clients, personalNetwork]);
  
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    personalNetwork.forEach(contact => { contact.tags?.forEach(tag => tagsSet.add(tag)); });
    return Array.from(tagsSet).sort();
  }, [personalNetwork]);

  const filteredAddressBook = useMemo(() => {
    let list = combinedAddressBook;
    if (activeTag) { list = list.filter(item => item.tags?.includes(activeTag)); }
    if (searchTerm) { const lowercasedFilter = searchTerm.toLowerCase(); list = list.filter(item => (item.name || '').toLowerCase().includes(lowercasedFilter) || (item.subtext || '').toLowerCase().includes(lowercasedFilter)); }
    return list;
  }, [searchTerm, activeTag, combinedAddressBook]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading your connections...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Clients & Connections</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="p-6 bg-gray-800 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-200">Companies</h2>
            <button onClick={() => setIsClientFormVisible(!isClientFormVisible)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
              {isClientFormVisible ? 'Cancel' : '+ New Company'}
            </button>
          </div>
          {isClientFormVisible && (
            <form onSubmit={handleSaveClient} className="space-y-4 mt-4">
               <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-3 mb-6">New Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Client Type*</label>
                  <select name="clientType" value={clientFormState.clientType} onChange={handleClientInputChange} className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600">
                    <option value="business_1099">Business / Agency (1099)</option>
                    <option value="individual_1099">Individual (1099)</option>
                    <option value="employer_w2">Employer (W2)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Status</label>
                  <select name="status" value={clientFormState.status} onChange={handleClientInputChange} className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
                <input type="text" name="companyName" value={clientFormState.companyName || ''} onChange={handleClientInputChange} placeholder="Company Name" className="p-2 border rounded-md bg-gray-700 border-gray-600 md:col-span-2" />
                <input type="text" name="name" value={clientFormState.name || ''} onChange={handleClientInputChange} placeholder="Primary Contact Name*" className="p-2 border rounded-md bg-gray-700 border-gray-600" />
                <input type="email" name="email" value={clientFormState.email || ''} onChange={handleClientInputChange} placeholder="Contact Email" className="p-2 border rounded-md bg-gray-700 border-gray-600" />
                <input type="email" name="billingEmail" value={clientFormState.billingEmail || ''} onChange={handleClientInputChange} placeholder="Billing Email" className="p-2 border rounded-md bg-gray-700 border-gray-600" />
                <input type="tel" name="phone" value={clientFormState.phone || ''} onChange={handleClientInputChange} placeholder="Phone Number" className="p-2 border rounded-md bg-gray-700 border-gray-600" />
                <input type="text" name="address" value={clientFormState.address || ''} onChange={handleClientInputChange} placeholder="Address" className="p-2 border rounded-md bg-gray-700 border-gray-600 md:col-span-2" />
                <input type="url" name="website" value={clientFormState.website || ''} onChange={handleClientInputChange} placeholder="Website" className="p-2 border rounded-md bg-gray-700 border-gray-600 md:col-span-2" />
              </div>
              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-lg font-medium text-gray-200">Financials</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <input type="number" step="0.01" name="rate" value={clientFormState.rate ?? ''} onChange={handleClientInputChange} placeholder={clientFormState.clientType === 'employer_w2' ? 'W2 Base Rate ($)' : '1099 Hourly Rate ($)'} className="p-2 border rounded-md bg-gray-700 border-gray-600" />
                  {clientFormState.clientType?.includes('1099') && ( <textarea name="differentials" value={clientFormState.differentials || ''} onChange={handleClientInputChange} rows={2} placeholder="Differential rate notes..." className="p-2 border rounded-md bg-gray-700 border-gray-600 md:col-span-2"></textarea> )}
                  {clientFormState.clientType === 'employer_w2' && ( <> <select name="payFrequency" value={clientFormState.payFrequency} onChange={handleClientInputChange} className="p-2 border rounded-md bg-gray-700 border-gray-600"> <option value="weekly">Weekly</option> <option value="biweekly">Bi-weekly</option> <option value="semimonthly">Semi-monthly</option> <option value="monthly">Monthly</option> </select> <input type="number" step="0.01" name="federalWithholding" value={clientFormState.federalWithholding ?? ''} onChange={handleClientInputChange} placeholder="Fed Withholding ($)" className="p-2 border rounded-md bg-gray-700 border-gray-600" /> <input type="number" step="0.01" name="stateWithholding" value={clientFormState.stateWithholding ?? ''} onChange={handleClientInputChange} placeholder="State Withholding ($)" className="p-2 border rounded-md bg-gray-700 border-gray-600" /> </> )}
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={!isLoaded} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500">Save Company</button>
              </div>
            </form>
          )}
        </div>
        <div className="p-6 bg-blue-900/20 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-200">Contacts</h2>
            <button onClick={() => setIsContactFormVisible(!isContactFormVisible)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
              {isContactFormVisible ? 'Cancel' : '+ New Contact'}
            </button>
          </div>
          {isContactFormVisible && (
            <form onSubmit={handleSaveContact} className="space-y-4 mt-4">
               <h3 className="text-xl font-semibold text-blue-200 border-b border-blue-800 pb-3 mb-6">New Contact Details</h3>
              <input type="text" name="name" value={contactFormState.name || ''} onChange={handleContactInputChange} placeholder="Full Name*" className="w-full p-2 border rounded-md bg-gray-700 border-gray-600" required />
              <input type="email" name="email" value={contactFormState.email || ''} onChange={handleContactInputChange} placeholder="Email" className="w-full p-2 border rounded-md bg-gray-700 border-gray-600" />
              <input type="tel" name="phone" value={contactFormState.phone || ''} onChange={handleContactInputChange} placeholder="Phone" className="w-full p-2 border rounded-md bg-gray-700 border-gray-600" />
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-300">Link to Company (Optional)</label>
                <select name="clientId" id="clientId" value={contactFormState.clientId || ''} onChange={handleContactInputChange} className="mt-1 block w-full p-2 border rounded-md bg-gray-700 border-gray-600">
                  <option value="">-- No Company --</option>
                  {clients.map(client => ( <option key={client.id} value={client.id}>{client.companyName || client.name}</option> ))}
                </select>
              </div>
              <input type="text" name="tagsInput" value={contactFormState.tagsInput || ''} onChange={handleContactInputChange} placeholder="Tags (comma-separated)" className="w-full p-2 border rounded-md bg-gray-700 border-gray-600" />
              <textarea name="notes" value={contactFormState.notes || ''} onChange={handleContactInputChange} rows={3} placeholder="Notes..." className="w-full p-2 border rounded-md bg-gray-700 border-gray-600"></textarea>
              <div className="flex justify-end">
                <button type="submit" disabled={!isLoaded} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500">Save Contact</button>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">Address Book</h2>
        <input type="text" placeholder="Search by name, contact, or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-500" />
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => setActiveTag(null)} className={`px-3 py-1 rounded-full text-sm font-semibold ${!activeTag ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>All</button>
          {allTags.map(tag => ( <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1 rounded-full text-sm font-semibold ${activeTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>{tag}</button> ))}
        </div>
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden mt-4">
          <ul className="divide-y divide-gray-700">
            {filteredAddressBook.length > 0 ? ( filteredAddressBook.map(item => ( <li key={item.id} className="p-4 hover:bg-gray-700/50 transition-colors flex justify-between items-center"> <div className="flex items-center gap-4"> {item.icon} <div> <p className="font-semibold text-white">{item.name}</p> <p className="text-sm text-gray-400">{item.subtext}</p> </div> </div> <div className="flex items-center gap-2"> {item.tags?.map(tag => ( <span key={tag} className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${ item.type === 'Company' ? 'bg-purple-900 text-purple-300' : 'bg-green-900 text-green-300' }`}>{tag}</span> ))} </div> </li> )) ) : (<li className="p-4 text-center text-gray-500">No entries match your search or filters.</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}