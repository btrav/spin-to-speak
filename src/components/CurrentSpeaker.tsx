import { CheckCircle, User, SkipForward, Plus } from 'lucide-react';
import { ThemeConfig } from '../theme';
import { Participant } from '../types';

interface CurrentSpeakerProps {
  currentSpeaker: Participant | null;
  onMarkDone: () => void;
  onSkip: () => void;
  onAddTime: () => void;
  themeConfig: ThemeConfig;
  timerRemaining: number | null;
  timerDuration: number;
}

const CurrentSpeaker = ({ currentSpeaker, onMarkDone, onSkip, onAddTime, themeConfig, timerRemaining, timerDuration }: CurrentSpeakerProps) => {
  if (!currentSpeaker) {
    return (
      <div className={`p-6 rounded-2xl shadow-lg ${themeConfig.card}`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${themeConfig.textPrimary}`}>
          <User className="w-5 h-5" />
          🎤 Now Speaking
        </h3>
        <div className={`text-center py-8 ${themeConfig.textMuted}`}>
          <p className="text-lg font-bold">
            No one is speaking yet! 🤐
          </p>
          <p className="text-sm mt-1 font-medium">Spin the wheel to select! ✨</p>
        </div>
      </div>
    );
  }

  const ratio = timerDuration > 0 && timerRemaining !== null ? timerRemaining / timerDuration : 1;
  const timeUp = timerRemaining === 0;
  // Non-color cue so the timer state does not rely on color alone
  const timerLabel = timeUp ? "Time's up" : ratio <= 0.2 ? 'Wrap up soon' : null;

  return (
    <div className={`animate-slide-up-in p-6 rounded-2xl shadow-lg ${themeConfig.cardHighlight}`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${themeConfig.textPrimary}`}>
        <User className={`w-5 h-5 ${themeConfig.accentText}`} />
        🎤 Now Speaking
      </h3>
      
      <div className="text-center">
        <div className="relative inline-block">
          <div className={`w-20 h-20 bg-gradient-to-r ${themeConfig.speakerAvatarGradient} rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse-slow`}>
            <span className="text-2xl font-bold text-white">
              {currentSpeaker.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className={`absolute -top-1 -right-1 w-6 h-6 ${themeConfig.accentBg} rounded-full animate-ping`}></div>
        </div>
        
        <h4 className={`text-xl font-bold font-display mb-4 ${themeConfig.textPrimary}`}>
          🌟 {currentSpeaker.name}
        </h4>

        {timerRemaining !== null && (
          <div className={`mb-4 ${timeUp ? 'animate-time-up' : ''}`}>
            <div className={`relative h-2 rounded-full overflow-hidden ${themeConfig.timerTrack}`}>
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${ratio * 100}%`,
                  backgroundColor: ratio > 0.5 ? '#22c55e' : ratio > 0.2 ? '#eab308' : '#ef4444'
                }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <p className={`text-sm font-mono font-bold ${
                ratio > 0.5 ? 'text-green-500' : ratio > 0.2 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {Math.floor(timerRemaining / 60)}:{String(timerRemaining % 60).padStart(2, '0')}
              </p>
              {timerLabel && (
                <span className={`text-xs font-bold ${
                  timeUp ? 'text-red-500' : 'text-yellow-600'
                }`}>
                  {timeUp ? '⏰' : '⏳'} {timerLabel}
                </span>
              )}
              <button
                onClick={onAddTime}
                className={`ml-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-200 ${themeConfig.skipBtn}`}
                aria-label="Add 30 seconds"
              >
                <Plus className="w-3 h-3" /> 30s
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onSkip}
            className={`px-4 py-3 rounded-xl font-bold transition-all duration-200 shadow flex items-center justify-center gap-2 ${themeConfig.skipBtn}`}
            aria-label={`Skip ${currentSpeaker.name} and return to the pool`}
          >
            <SkipForward className="w-5 h-5" />
            <span className="hidden sm:inline">Skip</span>
          </button>
          <button
            onClick={onMarkDone}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${themeConfig.markDoneBtn}`}
          >
            <CheckCircle className="w-5 h-5" />
            ✅ Mark as Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentSpeaker;