import React, { useState, useEffect } from 'react';
import { PartyPopper, RotateCcw, X } from 'lucide-react';
import { ThemeConfig } from '../theme';

interface ConfettiPiece {
  id: number;
  emoji: string;
  left: number;
}

interface CelebrationModalProps {
  show: boolean;
  onClose: () => void;
  onRestart: () => void;
  themeConfig: ThemeConfig;
}

const EMOJIS = ['🎉', '🎊', '✨', '🌟', '🎈', '🎁', '🥳'];

const CelebrationModal: React.FC<CelebrationModalProps> = ({ show, onClose, onRestart, themeConfig }) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!show) {
      setConfetti([]);
      return;
    }

    let counter = 0;
    const interval = setInterval(() => {
      setConfetti(prev => [
        ...prev,
        {
          id: counter++,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          left: Math.random() * 100
        }
      ]);
    }, 100);

    // Stop spawning after 2s, clear pieces after all animations finish (3s per piece)
    const stopSpawning = setTimeout(() => clearInterval(interval), 2000);
    const cleanup = setTimeout(() => setConfetti([]), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(stopSpawning);
      clearTimeout(cleanup);
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      {confetti.map(piece => (
        <span
          key={piece.id}
          className="fixed top-0 text-2xl pointer-events-none z-[9999]"
          style={{
            left: `${piece.left}%`,
            animation: 'confetti-fall 3s linear forwards'
          }}
        >
          {piece.emoji}
        </span>
      ))}

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`relative max-w-md w-full p-8 rounded-3xl shadow-2xl text-center animate-bounce-in ${themeConfig.modalBg}`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
              themeConfig.isDark
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>

            <h2 className={`text-4xl font-bold mb-2 ${themeConfig.textPrimary}`} style={{ fontFamily: 'DM Serif Display, serif' }}>
              🎉 All Done! 🎉
            </h2>

            <p className={`text-lg font-semibold ${themeConfig.textSecondary}`}>
              Everyone has had their turn to speak! 🗣️✨
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onRestart}
              className={`w-full px-6 py-4 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${themeConfig.newMeetingBtn}`}
            >
              <RotateCcw className="w-5 h-5" />
              🚀 Start New Meeting
            </button>

            <button
              onClick={onClose}
              className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                themeConfig.isDark
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CelebrationModal;
