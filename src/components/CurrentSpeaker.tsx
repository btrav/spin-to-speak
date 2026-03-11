import React from 'react';
import { CheckCircle, User } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
}

interface CurrentSpeakerProps {
  currentSpeaker: Participant | null;
  onMarkDone: () => void;
  darkMode: boolean;
}

const CurrentSpeaker: React.FC<CurrentSpeakerProps> = ({ currentSpeaker, onMarkDone, darkMode }) => {
  if (!currentSpeaker) {
    return (
      <div className={`p-6 rounded-2xl shadow-lg ${
        darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/70 backdrop-blur-sm'
      }`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          <User className="w-5 h-5" />
          🎤 Now Speaking
        </h3>
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-lg font-bold">
            No one is speaking yet! 🤐
          </p>
          <p className="text-sm mt-1 font-medium">Spin the wheel to select! ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl shadow-lg border-2 border-green-400 ${
      darkMode ? 'bg-gray-800/50' : 'bg-white/70 backdrop-blur-sm'
    }`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <User className="w-5 h-5 text-green-500" />
        🎤 Now Speaking
      </h3>
      
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse-slow">
            <span className="text-2xl font-bold text-white">
              {currentSpeaker.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
        </div>
        
        <h4 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'DM Serif Display, serif' }}>
          🌟 {currentSpeaker.name}
        </h4>
        
        <button
          onClick={onMarkDone}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          ✅ Mark as Done
        </button>
      </div>
    </div>
  );
};

export default CurrentSpeaker;