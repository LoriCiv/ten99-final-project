"use client";

import { useState } from 'react';

export default function ScanDocumentsPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const handleParse = () => {
    // This is where the AI parsing logic will go later.
    // For now, it's a placeholder.
    setResult(`Parsing this text: "${text}"`);
    console.log(result); // To see the result in the console for now
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Scan Document or Paste Text</h1>
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Column 1: Upload Image */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">1. Upload Image (Optional)</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
              <p>Image upload feature coming soon.</p>
            </div>
          </div>

          {/* Column 2: Paste Text & Parse */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">2. Paste Text & Create</h2>
            <textarea
              className="w-full h-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Paste text from your email or message here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button
              onClick={handleParse}
              className="w-full mt-2 bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-teal-700 transition-colors"
            >
              Create from Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
