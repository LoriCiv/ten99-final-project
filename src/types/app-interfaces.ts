export interface Client {
  id?: string; // Firestore document ID. Optional for new clients.
  userId: string; // ID of the user who owns this client record. CRITICAL for security.
  
  clientType: 'business_1099' | 'individual_1099' | 'employer_w2';
  billingName: string; // The official name for invoices.
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes?: string; // General notes about the client.

  createdAt: Date; // Or Firebase Timestamp
  updatedAt: Date; // Or Firebase Timestamp
}

/**
 * Represents a contact in the user's personal/professional network.
 * These are not necessarily paying clients (e.g., mentors, colleagues).
 */
export interface PersonalNetworkContact {
  id?: string; // Firestore document ID.
  userId: string; // ID of the user who owns this contact.

  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  notes?: string; // Private notes about this contact.

  createdAt: Date; // Or Firebase Timestamp
  updatedAt: Date; // Or Firebase Timestamp
}

/**
 * Represents a single scheduled event or appointment.
 */
export interface Appointment {
  id?: string; // Firestore document ID.
  userId: string; // ID of the user who owns this appointment.

  clientId: string; // References a Client's id for billing and context.
  title: string;
  description?: string;
  startTime: Date; // Or Firebase Timestamp
  endTime: Date;   // Or Firebase Timestamp
  location?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  
  // --- Integration Fields ---
  mileageId?: string; // Optional link to a mileage log entry.
  invoiceId?: string; // Optional link to the generated invoice.
  jobFileId?: string; // Optional link to associated job files.

  createdAt: Date; // Or Firebase Timestamp
  updatedAt: Date; // Or Firebase Timestamp
}

/**
 * Represents a user's professional profile and certifications.
 * This will be used for the "Job Board" feature.
 */
export interface UserProfile {
    id?: string; // This will be the same as the user's Clerk ID.
    userId: string;

    photoUrl?: string;
    bio?: string;
    // The primary category of work the user does.
    professionalCategory: 'Graphic Designer' | 'Tattoo Artist' | 'Tutor' | 'Interpreter' | 'Other';
    
    certifications: Certification[];

    updatedAt: Date; // Or Firebase Timestamp
}

/**
 * Represents a single certification or license within a UserProfile.
 */
export interface Certification {
    id?: string; // A unique ID for this specific certification entry.
    name: string;
    issuingBody: string;
    issueDate?: Date; // Or Firebase Timestamp
    expirationDate?: Date; // Or Firebase Timestamp
    credentialId?: string;
}


/**
 * Represents a single invoice to be sent to a client.
 */
export interface Invoice {
  id?: string; // Firestore document ID.
  userId: string; // ID of the user who owns this invoice.

  appointmentId: string; // The primary appointment for this invoice.
  clientId: string;
  invoiceNumber: string; // e.g., "2025-001"
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: Date; // Or Firebase Timestamp
  dueDate: Date;   // Or Firebase Timestamp
  paidDate?: Date;  // Or Firebase Timestamp

  // A version of the appointment details safe for an invoice, per HIPAA requirements.
  lineItems: {
    description: string; // e.g., "Graphic Design Services" or "Job #12345"
    quantity: number;
    unitPrice: number;
  }[];

  createdAt: Date; // Or Firebase Timestamp
  updatedAt: Date; // Or Firebase Timestamp
}
