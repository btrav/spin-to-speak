import React, { useReducer, useState, useEffect } from 'react';
import { Moon, Sun, RotateCcw, Plus } from 'lucide-react';
import SpinnerWheel from './components/SpinnerWheel';
import CurrentSpeaker from './components/CurrentSpeaker';
import ParticipantsList from './components/ParticipantsList';
import CelebrationModal from './components/CelebrationModal';

interface Participant {
  id: string;
  name: string;
}

interface State {
  participants: Participant[];
  doneParticipants: Participant[];
  currentSpeaker: Participant | null;
  isSpinning: boolean;
  showCelebration: boolean;
  spinRotation: number;
  // Snapshot of participants at spin start so the wheel doesn't change mid-spin
  spinningParticipants: Participant[];
}

type Action =
  | { type: 'ADD_PARTICIPANT'; name: string }
  | { type: 'REMOVE_PARTICIPANT'; id: string }
  | { type: 'START_SPIN'; finalRotation: number }
  | { type: 'FINISH_SPIN'; speaker: Participant }
  | { type: 'MARK_DONE' }
  | { type: 'SHOW_CELEBRATION' }
  | { type: 'HIDE_CELEBRATION' }
  | { type: 'RESET_ALL' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_PARTICIPANT':
      if (state.participants.length >= 20) return state;
      return {
        ...state,
        participants: [
          ...state.participants,
          { id: crypto.randomUUID(), name: action.name }
        ]
      };
    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== action.id)
      };
    case 'START_SPIN':
      return {
        ...state,
        isSpinning: true,
        spinningParticipants: [...state.participants],
        spinRotation: action.finalRotation
      };
    case 'FINISH_SPIN':
      return { ...state, isSpinning: false, currentSpeaker: action.speaker };
    case 'MARK_DONE': {
      if (!state.currentSpeaker) return state;
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== state.currentSpeaker!.id),
        doneParticipants: [...state.doneParticipants, state.currentSpeaker],
        currentSpeaker: null,
        spinningParticipants: []
      };
    }
    case 'SHOW_CELEBRATION':
      return { ...state, showCelebration: true };
    case 'HIDE_CELEBRATION':
      return { ...state, showCelebration: false };
    case 'RESET_ALL':
      return {
        ...state,
        // Merge everyone back into the active pool: waiting + done + current speaker (if any)
        participants: [
          ...state.participants,
          ...state.doneParticipants,
          ...(state.currentSpeaker ? [state.currentSpeaker] : [])
        ],
        doneParticipants: [],
        currentSpeaker: null,
        showCelebration: false,
        spinRotation: 0,
        spinningParticipants: [],
        isSpinning: false
      };
    default:
      return state;
  }
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

const initialState: State = {
  participants: [],
  doneParticipants: [],
  currentSpeaker: null,
  isSpinning: false,
  showCelebration: false,
  spinRotation: 0,
  spinningParticipants: []
};

function loadInitialState(): State {
  try {
    const saved = localStorage.getItem('spinToSpeak');
    if (saved) {
      const data = JSON.parse(saved);
      return { ...initialState, ...data };
    }
  } catch { /* ignore */ }
  return initialState;
}

function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);
  const [newName, setNewName] = useState('');
  const [darkMode, setDarkMode] = useLocalStorage(
    'spinToSpeakDarkMode',
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Persist session state
  useEffect(() => {
    localStorage.setItem('spinToSpeak', JSON.stringify({
      participants: state.participants,
      doneParticipants: state.doneParticipants,
      currentSpeaker: state.currentSpeaker
    }));
  }, [state.participants, state.doneParticipants, state.currentSpeaker]);

  const { participants, doneParticipants, currentSpeaker, isSpinning, showCelebration, spinRotation, spinningParticipants } = state;
  const totalParticipants = participants.length + doneParticipants.length + (currentSpeaker ? 1 : 0);
  // While someone is speaking, show the frozen snapshot from spin time so the wheel
  // doesn't visually jump if a participant is added or removed mid-turn
  const displayParticipants = currentSpeaker ? spinningParticipants : participants;
  const atLimit = totalParticipants >= 20;

  const addParticipant = () => {
    if (!newName.trim() || isSpinning || atLimit) return;
    dispatch({ type: 'ADD_PARTICIPANT', name: newName.trim() });
    setNewName('');
  };

  const spinWheel = () => {
    if (participants.length === 0 || isSpinning || currentSpeaker) return;
    // Add at least 5 full rotations (1800°) plus a random extra amount for unpredictability
    const finalRotation = spinRotation + 1800 + Math.random() * 360;
    // Capture participants at spin time to avoid stale closure in timeout
    const capturedParticipants = participants;
    dispatch({ type: 'START_SPIN', finalRotation });

    setTimeout(() => {
      // Convert cumulative rotation to a 0–360 position, then invert because
      // the wheel rotates clockwise while the pointer stays fixed at the top
      const normalizedRotation = (360 - (finalRotation % 360)) % 360;
      const segmentAngle = 360 / capturedParticipants.length;
      const selectedIndex = Math.floor(normalizedRotation / segmentAngle) % capturedParticipants.length;
      dispatch({ type: 'FINISH_SPIN', speaker: capturedParticipants[selectedIndex] });
    }, 3000); // matches the CSS transition duration on the wheel
  };

  const markAsDone = () => {
    if (!currentSpeaker) return;
    const remaining = participants.filter(p => p.id !== currentSpeaker.id);
    dispatch({ type: 'MARK_DONE' });
    if (remaining.length === 0) {
      setTimeout(() => dispatch({ type: 'SHOW_CELEBRATION' }), 500);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`} style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'DM Serif Display, serif' }}>
              🎡 Spin to Speak
            </h1>
            <p className={`text-xl mt-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Let the wheel decide who speaks next! ✨
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                darkMode
                  ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-400'
                  : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
              }`}
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            <button
              onClick={() => dispatch({ type: 'RESET_ALL' })}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Reset All
            </button>
          </div>
        </div>

        {/* Add Participant */}
        <div className={`mb-8 p-6 rounded-2xl shadow-lg ${
          darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/70 backdrop-blur-sm'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            🎪 Add Participants ({totalParticipants}/20)
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
              placeholder="Enter participant name..."
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
              }`}
              disabled={isSpinning || atLimit}
              maxLength={20}
            />
            <button
              onClick={addParticipant}
              disabled={!newName.trim() || isSpinning || atLimit}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {atLimit && (
            <p className={`text-sm mt-2 font-medium ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>
              Maximum 20 participants reached! 🎯
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className={`p-6 rounded-2xl shadow-lg ${
              darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/70 backdrop-blur-sm'
            }`}>
              <div className="text-center mb-6">
                <SpinnerWheel
                  participants={displayParticipants}
                  isSpinning={isSpinning}
                  darkMode={darkMode}
                  spinRotation={spinRotation}
                />

                <button
                  onClick={spinWheel}
                  disabled={participants.length === 0 || isSpinning || currentSpeaker !== null}
                  className={`mt-8 px-12 py-4 text-xl font-bold rounded-full transition-all duration-200 shadow-lg ${
                    participants.length === 0 || isSpinning || currentSpeaker !== null
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:scale-105 hover:shadow-xl animate-pulse-slow'
                  }`}
                >
                  {isSpinning ? '🌪️ Spinning...' : currentSpeaker ? '🎤 Someone is speaking!' : '🎯 Spin the Wheel!'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <CurrentSpeaker
              currentSpeaker={currentSpeaker}
              onMarkDone={markAsDone}
              darkMode={darkMode}
            />

            <ParticipantsList
              participants={participants}
              doneParticipants={doneParticipants}
              onRemoveParticipant={(id) => dispatch({ type: 'REMOVE_PARTICIPANT', id })}
              isSpinning={isSpinning}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>

      <footer className={`text-center py-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        made by <a href="https://github.com/btrav" className="hover:underline">btrav</a>
      </footer>

      <CelebrationModal
        show={showCelebration}
        onClose={() => dispatch({ type: 'HIDE_CELEBRATION' })}
        onRestart={() => dispatch({ type: 'RESET_ALL' })}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;
