import React from 'react';
import { Users, CheckCircle, X } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  doneParticipants: Participant[];
  onRemoveParticipant: (id: string) => void;
  isSpinning: boolean;
  darkMode: boolean;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ 
  participants, 
  doneParticipants, 
  onRemoveParticipant, 
  isSpinning, 
  darkMode 
}) => {
  return (
    <div className="space-y-6">
      {/* Remaining Participants */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/70 backdrop-blur-sm'
      }`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          <Users className="w-5 h-5" />
          ⏳ Waiting ({participants.length})
        </h3>
        
        {participants.length === 0 ? (
          <p className={`text-center py-4 font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No participants waiting! 🎭
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700/50 hover:bg-gray-700' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {participant.name}
                  </span>
                </div>
                
                <button
                  onClick={() => onRemoveParticipant(participant.id)}
                  disabled={isSpinning}
                  aria-label={`Remove ${participant.name}`}
                  className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 ${
                    isSpinning
                      ? 'opacity-50 cursor-not-allowed'
                      : 'text-red-500 hover:bg-red-100 hover:text-red-600'
                  } ${darkMode && !isSpinning ? 'hover:bg-red-900/30' : ''}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Participants */}
      {doneParticipants.length > 0 && (
        <div className={`p-6 rounded-2xl shadow-lg ${
          darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/70 backdrop-blur-sm'
        }`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <CheckCircle className="w-5 h-5 text-green-500" />
            ✅ Completed ({doneParticipants.length})
          </h3>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {doneParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className={`flex items-center gap-3 p-3 rounded-lg animate-fade-in ${
                  darkMode ? 'bg-green-900/20' : 'bg-green-50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className={`font-semibold ${
                  darkMode ? 'text-green-200' : 'text-green-700'
                }`}>
                  {participant.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;