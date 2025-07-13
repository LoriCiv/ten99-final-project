import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import type { Appointment, Client, PersonalNetworkContact, JobFile } from '../types/app-interfaces';

// --- Client (Company) Functions ---
export const getClients = (userId: string, callback: (data: Client[]) => void) => {
  const q = query(collection(db, 'users', userId, 'clients'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
    callback(docs);
  });
};

export const addClient = (userId: string, clientData: Partial<Client>) => {
  return addDoc(collection(db, 'users', userId, 'clients'), {
    ...clientData,
    createdAt: serverTimestamp(),
  });
};

// --- Personal Network (Contact) Functions ---
export const getPersonalNetwork = (userId: string, callback: (data: PersonalNetworkContact[]) => void) => {
  const q = query(collection(db, 'users', userId, 'personalNetwork'), orderBy('name'));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PersonalNetworkContact));
    callback(docs);
  });
};

export const addPersonalNetworkContact = (userId: string, contactData: Partial<PersonalNetworkContact>) => {
  return addDoc(collection(db, 'users', userId, 'personalNetwork'), {
    ...contactData,
    createdAt: serverTimestamp(),
  });
};

// --- Appointment Functions ---
export const getAppointments = (userId: string, callback: (data: Appointment[]) => void) => {
  const q = query(collection(db, 'users', userId, 'appointments'), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    callback(docs);
  });
};

export const addAppointment = (userId: string, apptData: Partial<Appointment>) => {
  return addDoc(collection(db, 'users', userId, 'appointments'), {
    ...apptData,
    createdAt: serverTimestamp(),
  });
};

export const updateAppointment = (userId: string, apptId: string, apptData: Partial<Appointment>) => {
  return updateDoc(doc(db, 'users', userId, 'appointments', apptId), apptData);
};

export const deleteAppointment = (userId: string, apptId: string) => {
  return deleteDoc(doc(db, 'users', userId, 'appointments', apptId));
};

// --- Job File Functions ---
export const getJobFiles = (userId: string, callback: (data: JobFile[]) => void) => {
  const q = query(collection(db, 'users', userId, 'jobFiles'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobFile));
    callback(docs);
  });
};

export const addJobFile = (userId: string, fileData: Partial<JobFile>) => {
  return addDoc(collection(db, 'users', userId, 'jobFiles'), {
    ...fileData,
    createdAt: serverTimestamp(),
  });
};

export const updateJobFile = (userId: string, fileId: string, fileData: Partial<JobFile>) => {
    return updateDoc(doc(db, 'users', userId, 'jobFiles', fileId), fileData);
};

export const deleteJobFile = (userId: string, fileId: string) => {
    return deleteDoc(doc(db, 'users', userId, 'jobFiles', fileId));
};

// --- NEW FUNCTION FOR SHARING JOB FILES ---
export const createPublicJobFile = (jobFile: JobFile) => {
  // We select only the specific fields we want to make public
  const publicData = {
    jobTitle: jobFile.jobTitle,
    status: jobFile.status,
    sharedNotes: jobFile.prepMaterials?.sharedNotes || '',
  };

  return addDoc(collection(db, 'publicJobFiles'), {
    ...publicData,
    createdAt: serverTimestamp(),
  });
};
