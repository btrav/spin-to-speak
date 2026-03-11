import React, { useEffect } from 'react';
import { PartyPopper, RotateCcw, X } from 'lucide-react';

interface CelebrationModalProps {
  show: boolean;
  onClose: () => void;
  onRestart: () => void;
  darkMode: boolean;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ show, onClose, onRestart, darkMode }) => {
  useEffect(() => {
    if (show) {
      // Create confetti effect
      const createConfetti = () => {
        const confetti = document.createElement('div');
        const emojis = ['🎉', '🎊', '✨', '🌟', '🎈', '🎁', '🥳'];
        confetti.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.fontSize = '24px';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = 'confetti-fall 3s linear forwards';
        document.body.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, 3000);
      };

      // Create multiple confetti pieces
      const confettiInterval = setInterval(createConfetti, 100);

      setTimeout(() => {
        clearInterval(confettiInterval);
      }, 2000);

      return () => clearInterval(confettiInterval);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`relative max-w-md w-full p-8 rounded-3xl shadow-2xl text-center animate-bounce-in ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
            darkMode 
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
          
          <h2 className={`text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`} style={{ fontFamily: 'DM Serif Display, serif' }}>
            🎉 All Done! 🎉
          </h2>
          
          <p className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Everyone has had their turn to speak! 🗣️✨
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            🚀 Start New Meeting
          </button>
          
          <button
            onClick={onClose}
            className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
              darkMode 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationModal;