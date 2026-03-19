import React from 'react';
import { Sparkles, Users } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
}

interface SpinnerWheelProps {
  participants: Participant[];
  isSpinning: boolean;
  darkMode: boolean;
  spinRotation: number;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2', '#A3E4D7',
  '#FAD7A0', '#D5A6BD', '#AED6F1', '#A9DFBF'
];

const Pointer = () => (
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-20">
    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-black drop-shadow-lg" />
  </div>
);

const SpinnerWheel: React.FC<SpinnerWheelProps> = ({ participants, isSpinning: _isSpinning, darkMode, spinRotation }) => {
  // Empty state
  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className={`w-full max-w-[320px] aspect-square rounded-full border-4 border-dashed flex flex-col items-center justify-center relative overflow-hidden ${
          darkMode ? 'border-gray-600 bg-gray-800/30' : 'border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50'
        }`}>
          <div className="absolute inset-0">
            <Sparkles className={`absolute top-16 left-16 w-6 h-6 animate-pulse ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} style={{ animationDelay: '0s' }} />
            <Sparkles className={`absolute top-24 right-20 w-4 h-4 animate-pulse ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} style={{ animationDelay: '1s' }} />
            <Sparkles className={`absolute bottom-20 left-24 w-5 h-5 animate-pulse ${darkMode ? 'text-pink-400' : 'text-pink-500'}`} style={{ animationDelay: '2s' }} />
            <Sparkles className={`absolute bottom-16 right-16 w-4 h-4 animate-pulse ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} style={{ animationDelay: '0.5s' }} />
          </div>

          <Users className={`w-16 h-16 mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <p className={`text-lg font-bold text-center px-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Add some friends to get the party started! 🎉
          </p>
          <p className={`text-sm mt-2 font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Up to 20 participants
          </p>
        </div>
      </div>
    );
  }

  // Single participant
  if (participants.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[320px] mx-auto">
          <Pointer />
          <div
            className="w-full aspect-square rounded-full flex items-center justify-center shadow-2xl border-8 border-white transition-transform duration-[3000ms] ease-out"
            style={{
              background: colors[0],
              transform: `rotate(${spinRotation}deg)`
            }}
          >
            <div className="text-center px-6 max-w-[80%]">
              <span
                className="text-white font-bold text-3xl block leading-tight"
                style={{
                  filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.8))',
                  fontFamily: 'DM Serif Display, serif',
                  wordBreak: 'break-word'
                }}
              >
                {participants[0].name}
              </span>
            </div>
          </div>
        </div>

        <p className={`mt-6 text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          🎯 {participants.length} participant ready to spin!
        </p>
      </div>
    );
  }

  // Multiple participants
  const segmentAngle = 360 / participants.length;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[320px] mx-auto">
        <Pointer />

        <div className="relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 320 320"
            className="transition-transform duration-[3000ms] ease-out drop-shadow-2xl"
            style={{ transform: `rotate(${spinRotation}deg)` }}
          >
            <circle cx="160" cy="160" r="158" fill="white" stroke="#e5e7eb" strokeWidth="4" />

            {participants.map((participant, index) => {
              // SVG 0° points right (3 o'clock); subtract 90° so the first segment starts at the top
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
              // SVG arc largeArcFlag must be 1 when the arc spans more than 180° (e.g. 1 or 2 participants)
              const largeArcFlag = segmentAngle > 180 ? 1 : 0;

              // Arc start and end points on the wheel rim (radius 150, center 160,160)
              const x1 = 160 + 150 * Math.cos(startAngle);
              const y1 = 160 + 150 * Math.sin(startAngle);
              const x2 = 160 + 150 * Math.cos(endAngle);
              const y2 = 160 + 150 * Math.sin(endAngle);

              const pathData = [`M 160 160`, `L ${x1} ${y1}`, `A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(' ');

              // Place label at the angular midpoint of the segment, 100px from center
              const textAngle = startAngle + (segmentAngle * Math.PI / 180) / 2;
              const textX = 160 + 100 * Math.cos(textAngle);
              const textY = 160 + 100 * Math.sin(textAngle);

              return (
                <g key={participant.id}>
                  <path d={pathData} fill={colors[index % colors.length]} stroke="white" strokeWidth="2" />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="600"
                    fontFamily="DM Serif Display, serif"
                    // Rotate label to follow the segment's radial direction (convert radians → degrees)
                    transform={`rotate(${(startAngle + endAngle) * 90 / Math.PI}, ${textX}, ${textY})`}
                    style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.4))' }}
                  >
                    {participant.name.length > 12 ? participant.name.substring(0, 12) + '…' : participant.name}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-xl border-4 border-gray-200 flex items-center justify-center z-10">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-slow" />
          </div>
        </div>
      </div>

      <p className={`mt-6 text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        🎯 {participants.length} participant{participants.length !== 1 ? 's' : ''} ready to spin!
      </p>
    </div>
  );
};

export default SpinnerWheel;
