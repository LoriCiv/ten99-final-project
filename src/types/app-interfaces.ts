import type { Timestamp } from 'firebase/firestore';

export interface Client {
  id: string;
  userId: string;
  createdAt: Timestamp;
  clientType: 'business_1099' | 'individual_1099' | 'employer_w2';
  companyName?: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Lead';
  jobTitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  billingEmail?: string;
  rate?: number;
  differentials?: string;
  payFrequency?: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
  federalWithholding?: number;
  stateWithholding?: number;
}

export interface PersonalNetworkContact {
  id: string;
  userId: string;
  createdAt: Timestamp;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  // --- NEW FEATURE: Link to a company/client ---
  clientId?: string; 
}

export interface JobFile {
  id: string;
  userId: string;
  jobTitle: string;
  status: 'pending' | 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  clientId?: string;
  appointmentId?: string;
  prepMaterials: {
    privateNotes: string;
    sharedNotes: string;
    attachments: {
      name: string;
      url: string;
    }[];
  };
  createdAt: Timestamp;
}

export interface Appointment {
  id: string;
  userId: string;
  createdAt: Timestamp | string;
  subject: string;
  status: 'pending' | 'scheduled' | 'completed' | 'canceled' | 'canceled-billable';
  date: string;
  time: string;
  endTime?: string;
  clientId?: string;
  contactId?: string;
  jobFileId?: string;
  jobType?: string;
  locationType?: 'physical' | 'virtual' | '';
  address?: string;
  virtualLink?: string;
  notes?: string;
}

export interface Certification {
  id: string;
  userId: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  ceus?: number;
  notes?: string;
}
