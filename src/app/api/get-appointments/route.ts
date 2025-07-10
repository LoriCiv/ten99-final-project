// src/app/api/get-appointments/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Appointment } from '@/types/app-interfaces';

/**
 * This API route securely fetches appointments for the currently logged-in user.
 * It connects to Firestore, queries for appointments matching the user's ID,
 * and separates them into 'pending' and 'confirmed' lists.
 */
export async function GET(request: Request) {
  // Get the user ID from the Clerk authentication session
  const { userId } = auth();

  // If there is no user, return a 401 Unauthorized error
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Create a query to fetch only the appointments belonging to the current user
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(appointmentsQuery);

    const allAppointments: Appointment[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allAppointments.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamps to JS Dates for the client
        startTime: data.startTime?.toDate(),
        endTime: data.endTime?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Appointment);
    });

    // Separate the appointments into pending and confirmed lists
    const pending = allAppointments.filter(appt => appt.status === 'pending');
    const confirmed = allAppointments.filter(appt => appt.status === 'scheduled'); // Assuming 'scheduled' is a confirmed status

    // Return the categorized data
    return NextResponse.json({ pending, confirmed });

  } catch (error) {
    console.error("Error fetching appointments:", error);
    // Return a generic 500 Internal Server Error if something goes wrong
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
