import { useState } from 'react';
import { Users, CheckCircle, X, Pencil, Undo2, Check } from 'lucide-react';
import { ThemeConfig } from '../theme';
import { Participant } from '../types';

interface ParticipantsListProps {
  participants: Participant[];
  doneParticipants: Participant[];
  onRemoveParticipant: (id: string) => void;
  onEditParticipant: (id: string, name: string) => void;
  onRestoreParticipant: (id: string) => void;
  isSpinning: boolean;
  themeConfig: ThemeConfig;
}

const ParticipantsList = ({
  participants,
  doneParticipants,
  onRemoveParticipant,
  onEditParticipant,
  onRestoreParticipant,
  isSpinning,
  themeConfig
}: ParticipantsListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const startEdit = (participant: Participant) => {
    setEditingId(participant.id);
    setDraftName(participant.name);
  };

  const commitEdit = () => {
    if (editingId && draftName.trim()) {
      onEditParticipant(editingId, draftName.trim());
    }
    setEditingId(null);
    setDraftName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName('');
  };

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
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 shrink-0 bg-gradient-to-r ${themeConfig.avatarGradient} rounded-full flex items-center justify-center`}>
                    <span className="text-sm font-bold text-white">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {editingId === participant.id ? (
                    <input
                      type="text"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      onBlur={commitEdit}
                      autoFocus
                      maxLength={20}
                      aria-label={`Edit name for ${participant.name}`}
                      className={`flex-1 min-w-0 px-2 py-1 rounded-md border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeConfig.input}`}
                    />
                  ) : (
                    <span className={`font-semibold truncate ${themeConfig.textSecondary}`}>
                      {participant.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center shrink-0">
                  {editingId === participant.id ? (
                    <button
                      onMouseDown={(e) => { e.preventDefault(); commitEdit(); }}
                      aria-label={`Save name for ${participant.name}`}
                      className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 ${themeConfig.accentText}`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(participant)}
                      disabled={isSpinning}
                      aria-label={`Edit ${participant.name}`}
                      className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 ${isSpinning ? 'opacity-50 cursor-not-allowed' : themeConfig.textMuted}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onRemoveParticipant(participant.id)}
                    disabled={isSpinning}
                    aria-label={`Remove ${participant.name}`}
                    className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 ${isSpinning ? 'opacity-50 cursor-not-allowed' : themeConfig.removeBtn}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Participants */}
      {doneParticipants.length > 0 && (
        <div className={`p-6 rounded-2xl shadow-lg ${themeConfig.card}`}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${themeConfig.textPrimary}`}>
            <CheckCircle className={`w-5 h-5 ${themeConfig.accentText}`} />
            ✅ Completed ({doneParticipants.length})
          </h3>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {doneParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-lg animate-fade-in ${themeConfig.doneItem}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 shrink-0 bg-gradient-to-r ${themeConfig.doneAvatarGradient} rounded-full flex items-center justify-center`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className={`font-semibold truncate ${themeConfig.doneText}`}>
                    {participant.name}
                  </span>
                </div>
                <button
                  onClick={() => onRestoreParticipant(participant.id)}
                  aria-label={`Put ${participant.name} back in the pool`}
                  title="Put back in the pool"
                  className={`p-2 rounded-full shrink-0 transition-all duration-200 hover:scale-110 ${themeConfig.textMuted}`}
                >
                  <Undo2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;