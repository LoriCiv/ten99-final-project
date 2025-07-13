"use client";
import { useState, useEffect } from 'react';
import type { JobFile, Client, Appointment } from '@/types/app-interfaces';
import { useUser } from '@clerk/nextjs';
import { deleteJobFile, createPublicJobFile } from '@/utils/firestoreService';
import JobFileForm from './JobFileForm';
import { X, Edit, Trash2, Share2, Copy, Send, Eye } from 'lucide-react';

interface JobFileDetailModalProps {
  file: JobFile | null;
  clients: Client[];
  appointments: Appointment[];
  onClose: () => void;
  onSave: () => void;
}

export default function JobFileDetailModal({ file, clients, appointments, onClose, onSave }: JobFileDetailModalProps) {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [publicLink, setPublicLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    // Reset state when the file changes
    setIsEditing(false);
    setIsSharing(false);
    setPublicLink('');
    setRecipientEmail('');
  }, [file]);

  if (!file) return null;

  // This function now handles toggling the share UI AND generating the link
  const handleToggleShare = async () => {
    const turningOnShare = !isSharing;
    setIsSharing(turningOnShare);

    // If we are opening the share panel and the link doesn't exist yet, generate it.
    if (turningOnShare && !publicLink && file) {
      setIsGenerating(true);
      try {
        const publicDocRef = await createPublicJobFile(file);
        const link = `${window.location.origin}/shared/job-file/${publicDocRef.id}`;
        setPublicLink(link);
      } catch (error) {
        console.error("Error generating share link:", error);
        alert("Could not create sharable link.");
        // If it fails, close the share panel
        setIsSharing(false);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this job file?")) {
      if (user && file.id) {
        try {
          await deleteJobFile(user.id, file.id);
          onClose();
        } catch (error) {
          console.error("Error deleting job file:", error);
          alert("Failed to delete job file.");
        }
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicLink).then(() => {
      alert("Link copied to clipboard!");
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const handleSendEmail = async () => {
    if (!recipientEmail || !publicLink) return alert("Please enter a recipient's email address.");
    setIsSendingEmail(true);
    try {
      const response = await fetch('/api/send-share-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          from: 'noreply@ten99.app',
          subject: `A job file has been shared with you: ${file.jobTitle}`,
          link: publicLink
        }),
      });
      if (!response.ok) throw new Error('Failed to send email.');
      alert(`Shared file link sent to ${recipientEmail}`);
      setRecipientEmail('');
    } catch (error) {
      console.error("Email sending error:", error);
      alert("There was an error sending the email.");
    } finally {
      setIsSendingEmail(false);
    }
  };
  
  const handleSaveSuccess = () => {
    setIsEditing(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Job File' : 'Job File Details'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X size={24} /></button>
        </div>

        {isEditing ? (
          <JobFileForm 
            initialData={file} 
            clients={clients} 
            appointments={appointments}
            onSave={handleSaveSuccess} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">{file.jobTitle}</h3>
              <p className="text-sm text-gray-400">Status: {file.status || 'Pending'}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-md">
                <h4 className="font-semibold text-gray-300">Private Notes</h4>
                <p className="text-gray-400 whitespace-pre-wrap">{file.prepMaterials?.privateNotes || 'No private notes.'}</p>
            </div>
              <div className="bg-gray-900 p-3 rounded-md">
                <h4 className="font-semibold text-gray-300">Shared Notes</h4>
                <p className="text-gray-400 whitespace-pre-wrap">{file.prepMaterials?.sharedNotes || 'No shared notes.'}</p>
            </div>

            {/* This is the updated Share section */}
            {isSharing && (
              <div className="bg-gray-900 p-4 rounded-lg border border-dashed border-gray-600 space-y-4">
                <h4 className="font-semibold text-lg">Share File</h4>
                
                {/* Preview of what will be shared */}
                <div className="border border-gray-700 rounded-md p-3">
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                        <Eye size={16} className="mr-2"/>
                        <span>Public Preview: This is what others will see.</span>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap text-sm">
                        {file.prepMaterials?.sharedNotes || 'No shared notes were provided.'}
                    </p>
                </div>

                {isGenerating ? (
                    <p className="text-center text-gray-400">Generating link...</p>
                ) : (
                  <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400">Sharable Link</label>
                        <div className="flex items-center bg-gray-700 rounded-md p-2 mt-1">
                          <input type="text" readOnly value={publicLink} className="bg-transparent w-full text-white focus:outline-none"/>
                          <button onClick={copyToClipboard} className="p-2 text-gray-300 hover:text-white"><Copy size={18}/></button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="recipientEmail" className="text-sm font-medium text-gray-400">Send to Email</label>
                        <div className="flex items-center bg-gray-700 rounded-md p-2 mt-1">
                          <input type="email" id="recipientEmail" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="Enter recipient's email" className="bg-transparent w-full text-white focus:outline-none"/>
                          <button onClick={handleSendEmail} disabled={isSendingEmail} className="p-2 text-gray-300 hover:text-white disabled:text-gray-500"><Send size={18}/></button>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              {/* This button now calls the new handler */}
              <button onClick={handleToggleShare} className="flex items-center bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500">
                <Share2 className="w-4 h-4 mr-2" />
                {isSharing ? 'Close Share' : 'Share'}
              </button>
              <button onClick={handleDelete} className="flex items-center bg-red-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700"><Trash2 className="w-4 h-4 mr-2" />Delete</button>
              <button onClick={() => setIsEditing(true)} className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"><Edit className="w-4 h-4 mr-2" />Edit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}