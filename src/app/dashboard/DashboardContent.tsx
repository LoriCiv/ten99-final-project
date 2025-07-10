"use client";

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function DashboardContent() {
  const { user, isLoaded } = useUser();

  // This will print the component's status to the browser console
  useEffect(() => {
    console.log("DashboardContent status check:");
    console.log("Clerk is loaded:", isLoaded);
    console.log("User object:", user);
  }, [user, isLoaded]);

  // This part displays the status directly on the screen
  return (
    <div className="p-8 bg-white rounded-lg shadow-inner">
      <h2 className="text-xl font-bold mb-4">Dashboard Content Debug View</h2>
      
      <div className="space-y-2">
        <p>
          <strong>Clerk Loaded:</strong> 
          <span className={isLoaded ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
            {isLoaded ? ' Yes' : ' No'}
          </span>
        </p>
        <p>
          <strong>User Signed In:</strong> 
          <span className={user ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
            {user ? ` Yes (ID: ${user.id})` : ' No'}
          </span>
        </p>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold">What this means:</h3>
        {!isLoaded && <p className="mt-2">The component is waiting for Clerk to initialize.</p>}
        {isLoaded && !user && <p className="mt-2">Clerk has loaded, but no user is signed in. The component will not fetch data.</p>}
        {isLoaded && user && <p className="mt-2">Clerk has loaded AND a user is signed in. The component should now be fetching your appointments.</p>}
      </div>
    </div>
  );
}
