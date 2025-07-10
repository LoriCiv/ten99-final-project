// src/types/app-interfaces.ts

// Note on Dates: When data is fetched from Firebase,
// date fields will be of type `Timestamp`. They need to be converted
// to JavaScript Date objects using the `.toDate()` method.

/**
 * Represents a client, who can be a 1099 client or a W2 employer.
 */
export interface Client {
  id?: string; // Firestore document ID. Optional for new clients.
  userId: string; // ID of the user who owns this client record.
  
  clientType: 'business_1099' | 'individual_1099' | 'employer_w2';
  billingName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;

  createdAt: Date; // Or Firebase Timestamp
  updatedAt: Date; // Or Firebase Timestamp
}

/**
 * Represents a contact in the user's personal/professional network.
 * Not necessarily a paying client.
 */
export interface PersonalNetworkContact {
  id?: string; // Firestore document ID.
  userId: string; // ID of the user who owns this contact.

  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  notes?: string;

  createdAt: Date; // Or Firebase Timestamp
  updatedAt: Date; // Or Firebase Timestamp
}

/**
 * Represents a single scheduled event or appointment.
 */
export interface Appointment {
  id?: string; // Firestore document ID.
  userId: string; // ID of the user who owns this appointment.

  clientId: string; // References a Client's id.
  title: string;
  description?: string;
  startTime: Date; // Or Firebase Timestamp
  endTime: Date;   // Or Firebase Timestamp
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  
  invoiceTriggered: boolean; // Flag to check if an invoice has been generated.
  jobFileId?: string; // Optional: references a JobFile.id

  createdAt: Date; // Or Firebase Timestamp
  updatedAt: Date; // Or Firebase Timestamp
}

/**
 * Represents a collection of files and notes related to one or more appointments.
 */
export interface JobFile {
  id?: string; // Firestore document ID.
  userId: string; // ID of the user who owns this job file.

  appointmentIds: string[]; // Array of appointment IDs connected to this job file.
  title: string;
  notes: string;
  sharedFiles: string[]; // URLs or paths to shared files.
  privateFiles: string[]; // URLs or paths to private files.

  createdAt: Date; // Or Firebase Timestamp
  updatedAt: Date; // Or Firebase Timestamp
}

/**
 * Represents a single invoice to be sent to a client.
 */
export interface Invoice {
  id?: string; // Firestore document ID.
  userId: string; // ID of the user who owns this invoice.

  appointmentId: string; // The primary appointment for this invoice.
  clientId: string;
  amount: number;
  status: 'draft' | 'pending' | 'sent' | 'paid' | 'overdue';
  issueDate: Date; // Or Firebase Timestamp
  dueDate: Date;   // Or Firebase Timestamp
  paidDate?: Date;  // Or Firebase Timestamp

  createdAt: Date; // Or Firebase Timestamp
  updatedAt: Date; // Or Firebase Timestamp
}
