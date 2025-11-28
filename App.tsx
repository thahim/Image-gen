import React from 'react';
import ImageGenerator from './components/ImageGenerator';
import { DEVELOPER_NAME, DEVELOPER_PHOTO_URL } from './constants';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="flex-grow">
        <ImageGenerator />
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-blue-800 text-white p-4 flex items-center justify-center shadow-lg z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white">
            <img
              src={DEVELOPER_PHOTO_URL}
              alt="Developer"
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-md font-medium">Developed by {DEVELOPER_NAME}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
