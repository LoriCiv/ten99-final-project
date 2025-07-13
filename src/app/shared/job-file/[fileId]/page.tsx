"use client";
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
// FIX: Corrected import path
import { db } from '@/utils/firebaseConfig';
import { FileText } from 'lucide-react';

// FIX: Updated interface to match the actual public data structure
interface PublicJobFile {
  jobTitle: string;
  status: string;
  sharedNotes: string;
}

export default function SharedJobFilePage({ params }: { params: { fileId: string } }) {
  const [file, setFile] = useState<PublicJobFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFile = async () => {
      if (!params.fileId) {
        setError('No file ID provided.');
        setLoading(false);
        return;
      }
      try {
        const fileDocRef = doc(db, 'publicJobFiles', params.fileId);
        const fileDoc = await getDoc(fileDocRef);

        if (fileDoc.exists()) {
          setFile(fileDoc.data() as PublicJobFile);
        } else {
          setError('Shared file not found or access has been revoked.');
        }
      } catch (err) {
        console.error("Error fetching shared file:", err);
        setError('An error occurred while trying to load the file.');
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [params.fileId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading shared file...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500">{error}</div>;
  }

  if (!file) {
    return null;
  }

  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
        <div className="flex items-center mb-4">
          <FileText className="w-8 h-8 text-blue-400 mr-4"/>
          <div>
            <h1 className="text-3xl font-bold text-white">{file.jobTitle}</h1>
            <p className="text-lg text-yellow-400">{file.status}</p>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Shared Notes</h2>
          <div className="bg-gray-900 p-4 rounded-md">
            <p className="text-gray-300 whitespace-pre-wrap">
              {/* FIX: Corrected data access for shared notes */}
              {file.sharedNotes || 'No shared notes were provided.'}
            </p>
          </div>
        </div>
        <div className="text-center mt-8 text-xs text-gray-500">
            <p>This document was shared from the Ten99 App.</p>
        </div>
      </div>
    </div>
  );
}
