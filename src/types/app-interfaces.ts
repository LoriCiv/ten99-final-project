// src/types/app-interfaces.ts

export interface Client {
  id?: string; // Optional for new clients
  billingName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalNetworkContact {
  id?: string; // Optional for new contacts
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id?: string; // Optional for new appointments
  clientId: string; // References Client.id
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled'; // e.g.,
  invoiceTriggered: boolean;
  jobFileId?: string; // Optional: references a JobFile.id
  createdAt: Date;
  updatedAt: Date;
}

export interface JobFile {
  id?: string; // Optional for new job files
  appointmentIds: string[]; // Array of appointment IDs connected to this job file
  title: string;
  notes: string;
  sharedFiles: string[]; // URLs or paths to shared files
  privateFiles: string[]; // URLs or paths to private files
  createdAt: Date;
  updatedAt: Date;
}

// Add other interfaces as needed (e.g., Invoice, UserProfile, etc.)
export interface Invoice {
  id?: string;
  appointmentId: string;
  clientId: string;
  amount: number;
  status: 'pending' | 'sent' | 'paid' | 'overdue';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
