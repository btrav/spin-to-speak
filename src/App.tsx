import React, { useReducer, useState, useEffect } from 'react';
import { RotateCcw, Plus, ChevronDown } from 'lucide-react';
import { ThemeName, ThemeConfig, THEMES } from './theme';
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
  winnerId: string | null;
}

interface SavedRoster {
  id: string;
  name: string;
  participants: Participant[];
}

type Action =
  | { type: 'ADD_PARTICIPANT'; name: string }
  | { type: 'REMOVE_PARTICIPANT'; id: string }
  | { type: 'START_SPIN'; finalRotation: number }
  | { type: 'FINISH_SPIN'; speaker: Participant }
  | { type: 'MARK_DONE' }
  | { type: 'SHOW_CELEBRATION' }
  | { type: 'HIDE_CELEBRATION' }
  | { type: 'RESET_ALL' }
  | { type: 'LOAD_ROSTER'; participants: Participant[] };

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
      return { ...state, isSpinning: false, currentSpeaker: action.speaker, winnerId: action.speaker.id };
    case 'MARK_DONE': {
      if (!state.currentSpeaker) return state;
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== state.currentSpeaker!.id),
        doneParticipants: [...state.doneParticipants, state.currentSpeaker],
        currentSpeaker: null,
        spinningParticipants: [],
        winnerId: null
      };
    }
    case 'SHOW_CELEBRATION':
      return { ...state, showCelebration: true };
    case 'HIDE_CELEBRATION':
      return { ...state, showCelebration: false };
    case 'RESET_ALL':
      return {
        ...state,
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
        isSpinning: false,
        winnerId: null
      };
    case 'LOAD_ROSTER':
      return {
        participants: action.participants,
        doneParticipants: [],
        currentSpeaker: null,
        isSpinning: false,
        showCelebration: false,
        spinRotation: 0,
        spinningParticipants: [],
        winnerId: null
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
  spinningParticipants: [],
  winnerId: null
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

const TIMER_OPTIONS = [
  { label: 'Off', value: 0 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '3 min', value: 180 },
  { label: '5 min', value: 300 }
];

function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);
  const [newName, setNewName] = useState('');
  const [theme, setTheme] = useLocalStorage<ThemeName>('spinToSpeakTheme', 'pastel');
  const [timerDuration, setTimerDuration] = useLocalStorage('spinToSpeakTimerDuration', 120);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [savedRosters, setSavedRosters] = useLocalStorage<SavedRoster[]>('spinToSpeakRosters', []);
  const [rosterName, setRosterName] = useState('');

  // Persist session state
  useEffect(() => {
    localStorage.setItem('spinToSpeak', JSON.stringify({
      participants: state.participants,
      doneParticipants: state.doneParticipants,
      currentSpeaker: state.currentSpeaker
    }));
  }, [state.participants, state.doneParticipants, state.currentSpeaker]);

  // Start timer when a new speaker is selected
  useEffect(() => {
    if (state.currentSpeaker && timerDuration > 0) {
      setTimerRemaining(timerDuration);
    } else {
      setTimerRemaining(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentSpeaker?.id]);

  // Tick the timer down
  useEffect(() => {
    if (timerRemaining === null || timerRemaining <= 0) return;
    const id = setTimeout(() => setTimerRemaining(r => r !== null ? r - 1 : null), 1000);
    return () => clearTimeout(id);
  }, [timerRemaining]);

  const themeConfig: ThemeConfig = THEMES[theme];

  const { participants, doneParticipants, currentSpeaker, isSpinning, showCelebration, spinRotation, spinningParticipants, winnerId } = state;
  const totalParticipants = participants.length + doneParticipants.length + (currentSpeaker ? 1 : 0);
  // While someone is speaking, show the frozen snapshot from spin time so the wheel
  // doesn't visually jump if a participant is added or removed mid-turn
  const displayParticipants = currentSpeaker ? spinningParticipants : participants;
  const atLimit = totalParticipants >= 20;
  const isSpinDisabled = participants.length === 0 || isSpinning || currentSpeaker !== null;

  const saveRoster = () => {
    if (!rosterName.trim() || totalParticipants === 0) return;
    const allParticipants = [
      ...participants,
      ...doneParticipants,
      ...(currentSpeaker ? [currentSpeaker] : [])
    ];
    setSavedRosters(prev => [...prev, { id: crypto.randomUUID(), name: rosterName.trim(), participants: allParticipants }]);
    setRosterName('');
  };

  const deleteRoster = (id: string) => setSavedRosters(prev => prev.filter(r => r.id !== id));

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
    <div className={`min-h-screen transition-all duration-300 ${themeConfig.root}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl sm:text-5xl font-bold ${themeConfig.titleClass}`} style={{ fontFamily: 'DM Serif Display, serif' }}>
              🎡 Spin to Speak
            </h1>
            <p className={`hidden sm:block text-xl mt-2 font-medium ${themeConfig.textSecondary}`}>
              Let the wheel decide who speaks next! ✨
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeName)}
                className={`text-sm rounded-full pl-3 pr-8 py-2 border font-semibold transition-all duration-200 appearance-none cursor-pointer ${themeConfig.select}`}
                aria-label="Select theme"
              >
                {(Object.keys(THEMES) as ThemeName[]).map(t => (
                  <option key={t} value={t}>{THEMES[t].label}</option>
                ))}
              </select>
              <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${themeConfig.textMuted}`} />
            </div>

            <button
              onClick={() => dispatch({ type: 'RESET_ALL' })}
              className={`flex items-center gap-2 px-3 sm:px-6 py-3 rounded-full font-bold transition-all duration-200 shadow-lg ${themeConfig.resetBtn}`}
              aria-label="Reset all"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="hidden sm:inline">Reset All</span>
            </button>
          </div>
        </div>

        {/* Add Participant */}
        <div className={`mb-8 p-6 rounded-2xl shadow-lg ${themeConfig.card}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${themeConfig.textPrimary}`}>
              🎪 Add Participants ({totalParticipants}/20)
            </h2>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${themeConfig.textMuted}`}>⏱</span>
              <div className="relative">
                <select
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(Number(e.target.value))}
                  className={`text-sm rounded-lg pl-2 pr-7 py-1 border appearance-none cursor-pointer ${themeConfig.select}`}
                >
                  {TIMER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${themeConfig.textMuted}`} />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
              placeholder="Enter participant name..."
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${themeConfig.input}`}
              disabled={isSpinning || atLimit}
              maxLength={20}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
            />
            <button
              onClick={addParticipant}
              disabled={!newName.trim() || isSpinning || atLimit}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 shadow-lg ${themeConfig.addBtn}`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {atLimit && (
            <p className={`text-sm mt-2 font-medium ${themeConfig.isDark ? 'text-yellow-400' : 'text-orange-600'}`}>
              Maximum 20 participants reached! 🎯
            </p>
          )}

          {/* Roster save row */}
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={rosterName}
              onChange={(e) => setRosterName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveRoster()}
              placeholder="Save as roster..."
              className={`flex-1 px-3 py-2 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${themeConfig.input}`}
              maxLength={30}
              autoComplete="off"
            />
            <button
              onClick={saveRoster}
              disabled={!rosterName.trim() || totalParticipants === 0}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 shadow ${themeConfig.saveRosterBtn}`}
            >
              Save
            </button>
          </div>

          {/* Saved roster chips */}
          {savedRosters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {savedRosters.map(r => (
                <div
                  key={r.id}
                  className={`flex items-center gap-1 pl-3 pr-1 py-1.5 rounded-lg text-sm font-medium ${themeConfig.rosterChip}`}
                >
                  <button
                    onClick={() => dispatch({ type: 'LOAD_ROSTER', participants: r.participants })}
                    className="hover:underline"
                  >
                    {r.name}
                  </button>
                  <button
                    onClick={() => deleteRoster(r.id)}
                    className={`ml-1 p-0.5 rounded hover:text-red-500 transition-colors ${themeConfig.rosterDelete}`}
                    aria-label={`Delete roster ${r.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className={`p-6 rounded-2xl shadow-lg ${themeConfig.card}`}>
              <div className="text-center mb-6">
                <SpinnerWheel
                  participants={displayParticipants}
                  isSpinning={isSpinning}
                  themeConfig={themeConfig}
                  spinRotation={spinRotation}
                  winnerId={winnerId}
                />

                <button
                  onClick={spinWheel}
                  disabled={isSpinDisabled}
                  className={`mt-8 px-6 sm:px-12 py-4 text-lg sm:text-xl font-bold rounded-full transition-all duration-200 shadow-lg ${
                    isSpinDisabled
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : themeConfig.spinBtnActive
                  }`}
                >
                  {isSpinning ? '🌪️ Spinning...' : currentSpeaker ? '🎤 Someone is speaking!' : '🎯 Spin the Wheel!'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <CurrentSpeaker
              key={currentSpeaker?.id ?? 'no-speaker'}
              currentSpeaker={currentSpeaker}
              onMarkDone={markAsDone}
              themeConfig={themeConfig}
              timerRemaining={timerRemaining}
              timerDuration={timerDuration}
            />

            <ParticipantsList
              participants={participants}
              doneParticipants={doneParticipants}
              onRemoveParticipant={(id) => dispatch({ type: 'REMOVE_PARTICIPANT', id })}
              isSpinning={isSpinning}
              themeConfig={themeConfig}
            />
          </div>
        </div>
      </div>

      <footer className={`text-center py-4 text-sm ${themeConfig.textMuted}`}>
        made by <a href="https://github.com/btrav" className="hover:underline">btrav</a>
      </footer>

      <CelebrationModal
        show={showCelebration}
        onClose={() => dispatch({ type: 'HIDE_CELEBRATION' })}
        onRestart={() => dispatch({ type: 'RESET_ALL' })}
        themeConfig={themeConfig}
      />
    </div>
  );
}

export default App;
