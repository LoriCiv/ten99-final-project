"use client";

import { useState } from 'react';
import { Pencil } from 'lucide-react';

// Define the 'types' for our mock data to satisfy TypeScript
type MockInboxItem = {
  id: number;
  sender: string;
  subject: string;
  body: string;
  isRead: boolean;
  status: string;
  proposedDate: Date;
};

type MockScheduleItem = {
  id: number;
  title: string;
  date: Date;
};

// --- MOCK DATA ---
const mockInboxItems: MockInboxItem[] = [
  { id: 1, sender: "Apple Inc.", subject: "ASL Interpreting for WWDC Keynote", body: "Hi, we are looking for a team of ASL interpreters for our upcoming keynote event...", isRead: false, status: 'new', proposedDate: new Date('2025-09-10T10:00:00') },
  { id: 2, sender: "Local Hospital", subject: "Request for VRI Services - Dr. Smith", body: "We have an urgent need for Video Remote Interpreting for a patient consultation...", isRead: true, status: 'pending', proposedDate: new Date('2025-09-12T14:00:00') },
  { id: 3, sender: "Community Theatre", subject: "Interpreting for 'Cats'", body: "We are seeking an interpreter for our upcoming performance...", isRead: true, status: 'new', proposedDate: new Date('2025-09-12T19:00:00') },
];

const userSchedule: MockScheduleItem[] = [
    { id: 101, title: "Doctor's Appointment", date: new Date('2025-09-12T14:00:00')},
];
// --- END MOCK DATA ---

const checkForConflict = (proposedDate: Date) => {
    return userSchedule.some(event => event.date.toDateString() === proposedDate.toDateString());
};

const InboxPage = () => {
  const [selectedItem, setSelectedItem] = useState<MockInboxItem | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const handleSelect = (item: MockInboxItem) => {
    setSelectedItem(item);
    setIsReplying(false);
    setIsComposing(false);
  };
  
  const handleComposeClick = () => {
    setIsComposing(true);
    setSelectedItem(null);
    setIsReplying(false);
  };
  
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      
      {/* Inbox List Panel */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Inbox</h1>
          <button onClick={handleComposeClick} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        <ul>
          {mockInboxItems.map((item) => {
            const hasConflict = checkForConflict(item.proposedDate);
            return (
              <li 
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 ${selectedItem?.id === item.id ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <p className={`text-md ${!item.isRead ? 'font-bold' : ''}`}>{item.sender}</p>
                  {hasConflict ? (
                     <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">Conflict</span>
                  ) : (
                     <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Available</span>
                  )}
                </div>
                <p className="text-sm truncate text-gray-800 dark:text-gray-300">{item.subject}</p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Panel: Detail, Reply, or Compose */}
      <div className="w-2/3 p-6 overflow-y-auto">
        {isComposing ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">New Message</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">To:</label>
                <input type="email" placeholder="recipient@example.com" className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-900"/>
              </div>
              <div>
                <label className="block text-sm font-medium">Subject:</label>
                <input type="text" placeholder="Message subject" className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-900"/>
              </div>
              <div>
                <label className="block text-sm font-medium">Message:</label>
                <textarea 
                  className="w-full h-60 p-2 border rounded-md bg-white dark:bg-gray-900"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end space-x-3">
              <button onClick={() => setIsComposing(false)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
              <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Send</button>
            </div>
          </div>
        ) : selectedItem ? (
          <div>
            {isReplying ? (
              <div>
                <h2 className="text-2xl font-bold mb-2">Reply to: {selectedItem.sender}</h2>
                <p className="text-sm text-gray-500 mb-6">Re: {selectedItem.subject}</p>
                <textarea 
                  className="w-full h-64 p-2 border rounded-md bg-white dark:bg-gray-900"
                  placeholder="Type your reply here..."
                ></textarea>
                <div className="mt-4 flex items-center justify-end space-x-3">
                  <button onClick={() => setIsReplying(false)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Send Reply</button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedItem.subject}</h2>
                <p className="text-sm text-gray-500 mb-6">From: {selectedItem.sender}</p>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{selectedItem.body}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                   <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700">Approve</button>
                   <button onClick={() => setIsReplying(true)} className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600">Reply (Pending)</button>
                   <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700">Decline</button>
                   <button className="text-sm text-gray-500 hover:text-red-500 hover:underline ml-auto">Delete</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a message to read or compose a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
