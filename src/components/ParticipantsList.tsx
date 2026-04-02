import React from 'react';
import { Users, CheckCircle, X } from 'lucide-react';
import { ThemeConfig } from '../theme';

interface Participant {
  id: string;
  name: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  doneParticipants: Participant[];
  onRemoveParticipant: (id: string) => void;
  isSpinning: boolean;
  themeConfig: ThemeConfig;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  doneParticipants,
  onRemoveParticipant,
  isSpinning,
  themeConfig
}) => {
  return (
    <div className="space-y-6">
      {/* Remaining Participants */}
      <div className={`p-6 rounded-2xl shadow-lg ${themeConfig.card}`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${themeConfig.textPrimary}`}>
          <Users className="w-5 h-5" />
          ⏳ Waiting ({participants.length})
        </h3>
        
        {participants.length === 0 ? (
          <p className={`text-center py-4 font-bold ${themeConfig.textMuted}`}>
            No participants waiting! 🎭
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${themeConfig.listItem}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`font-semibold ${themeConfig.textSecondary}`}>
                    {participant.name}
                  </span>
                </div>
                
                <button
                  onClick={() => onRemoveParticipant(participant.id)}
                  disabled={isSpinning}
                  aria-label={`Remove ${participant.name}`}
                  className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 ${isSpinning ? 'opacity-50 cursor-not-allowed' : themeConfig.removeBtn}`}
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
        <div className={`p-6 rounded-2xl shadow-lg ${themeConfig.card}`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${themeConfig.textPrimary}`}>
            <CheckCircle className="w-5 h-5 text-green-500" />
            ✅ Completed ({doneParticipants.length})
          </h3>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {doneParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className={`flex items-center gap-3 p-3 rounded-lg animate-fade-in ${themeConfig.doneItem}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className={`font-semibold ${themeConfig.doneText}`}>
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