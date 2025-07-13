"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { getClients, getPersonalNetwork, getJobFiles } from '@/utils/firestoreService';
import type { Appointment, Client, PersonalNetworkContact, JobFile } from '@/types/app-interfaces';
import AppointmentForm from '@/components/AppointmentForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Helper function to calculate the end time based on a start time and duration.
const calculateEndTime = (startTime: string, durationInMinutes: number): string => {
  if (!startTime || !durationInMinutes) {
    return '';
  }
  
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + durationInMinutes * 60000);
  
  const endHours = endDate.getHours().toString().padStart(2, '0');
  const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
  
  return `${endHours}:${endMinutes}`;
};


const NewAppointmentPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<PersonalNetworkContact[]>([]);
  const [jobFiles, setJobFiles] = useState<JobFile[]>([]);

  const [pastedText, setPastedText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [prefilledData, setPrefilledData] = useState<Partial<Appointment> | undefined>(undefined);

  useEffect(() => {
    if (user) {
      getClients(user.id, setClients);
      getPersonalNetwork(user.id, setContacts);
      getJobFiles(user.id, setJobFiles);
    }
  }, [user]);

  const handleParseWithAI = async () => {
    if (!pastedText.trim()) {
      setAiMessage('Please paste some text to parse.');
      return;
    }
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setAiMessage('Error: AI API key is not configured.');
      return;
    }
    setIsParsing(true);
    setAiMessage('AI is parsing the text...');
    setPrefilledData(undefined);

    const clientListForAI = clients.map(c => ({ id: c.id, name: c.companyName || c.name }));
    const contactListForAI = contacts.map(c => ({ id: c.id, name: c.name }));

    const prompt = `You are an expert appointment scheduler. Analyze the text below.
The current year is ${new Date().getFullYear()}.

Here is a list of existing clients: ${JSON.stringify(clientListForAI)}
Here is a list of existing contacts: ${JSON.stringify(contactListForAI)}

Based on the text, extract the appointment details.
- If the text mentions a duration (e.g., "for 2 hours", "a 90 minute meeting"), return the total duration in minutes in the 'durationInMinutes' field.
- If the text mentions an existing client or contact, return their ID.
- Do not guess IDs.

Text to analyze:
"${pastedText}"`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            "subject": { "type": "STRING" },
            "date": { "type": "STRING", "description": "YYYY-MM-DD" },
            "time": { "type": "STRING", "description": "HH:MM (24-hour)" },
            "endTime": { "type": "STRING" },
            "durationInMinutes": { "type": "NUMBER", "description": "The total duration of the event in minutes." },
            "notes": { "type": "STRING" },
            "jobType": { "type": "STRING" },
            "address": { "type": "STRING" },
            "virtualLink": { "type": "STRING" },
            "clientId": { "type": "STRING" },
            "contactId": { "type": "STRING" }
          }
        }
      }
    };
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) {
        const errorBody = await response.json();
        console.error("AI API Error:", errorBody);
        throw new Error(`AI API request failed: ${response.statusText}`);
      }
      const result = await response.json();
      if (result.candidates && result.candidates[0].content) {
        const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
        
        if (parsedJson.time && parsedJson.durationInMinutes && !parsedJson.endTime) {
            parsedJson.endTime = calculateEndTime(parsedJson.time, parsedJson.durationInMinutes);
        }

        setPrefilledData(parsedJson);
        setAiMessage('Success! Form has been pre-filled.');
      } else {
        console.error("AI Error Response (Unexpected Format):", result);
        throw new Error("AI parsing succeeded, but the response format was unexpected.");
      }
    } catch (error) {
      console.error("AI Parsing Execution Error:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setAiMessage(`Error: ${errorMessage}`);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div>
      <Link href="/dashboard/appointments" className="inline-flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Calendar
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Create from Text (AI Powered)</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="e.g., 'Meeting with John Doe from Apple tomorrow at 2pm for 90 minutes'"
                    className="w-full h-40 p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                ></textarea>
                <button onClick={handleParseWithAI} disabled={isParsing} className="w-full mt-4 bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 disabled:bg-gray-400">
                    {isParsing ? 'Parsing...' : 'Parse with AI'}
                </button>
                {aiMessage && <p className="text-sm mt-2 text-center">{aiMessage}</p>}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Scan Document</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center text-gray-500">
                <p>Photo/Scan feature coming soon.</p>
            </div>
          </div>
        </div>
        <div>
           <h2 className="text-xl font-bold mb-4">Enter Manually</h2>
           <AppointmentForm
              onCancel={() => router.push('/dashboard/appointments')}
              onSave={() => router.push('/dashboard/appointments')}
              clients={clients}
              contacts={contacts}
              jobFiles={jobFiles}
              initialData={prefilledData}
            />
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentPage;
