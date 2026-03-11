import React, { useState, useEffect } from 'react';
import { Moon, Sun, RotateCcw, Plus, X } from 'lucide-react';
import SpinnerWheel from './components/SpinnerWheel';
import CurrentSpeaker from './components/CurrentSpeaker';
import ParticipantsList from './components/ParticipantsList';
import CelebrationModal from './components/CelebrationModal';

interface Participant {
  id: string;
  name: string;
}

function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [doneParticipants, setDoneParticipants] = useState<Participant[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<Participant | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newName, setNewName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  // Keep track of participants as they were when spinning started
  const [spinningParticipants, setSpinningParticipants] = useState<Participant[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('spinToSpeak');
    if (savedData) {
      const data = JSON.parse(savedData);
      setParticipants(data.participants || []);
      setDoneParticipants(data.doneParticipants || []);
      setCurrentSpeaker(data.currentSpeaker || null);
    }

    const savedDarkMode = localStorage.getItem('spinToSpeakDarkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      participants,
      doneParticipants,
      currentSpeaker
    };
    localStorage.setItem('spinToSpeak', JSON.stringify(dataToSave));
  }, [participants, doneParticipants, currentSpeaker]);

  useEffect(() => {
    localStorage.setItem('spinToSpeakDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addParticipant = () => {
    if (newName.trim() && !isSpinning && participants.length < 20) {
      const newParticipant = {
        id: Date.now().toString(),
        name: newName.trim()
      };
      setParticipants([...participants, newParticipant]);
      setNewName('');
    }
  };

  const removeParticipant = (id: string) => {
    if (!isSpinning) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const spinWheel = () => {
    if (participants.length === 0 || isSpinning || currentSpeaker) return;

    setIsSpinning(true);
    // Capture the current participants for the spinner display
    setSpinningParticipants([...participants]);
    
    // Calculate final rotation - multiple full spins plus random position
    const baseRotation = 1800; // 5 full rotations
    const randomRotation = Math.random() * 360;
    const finalRotation = spinRotation + baseRotation + randomRotation;
    setSpinRotation(finalRotation);
    
    // Wait for animation to complete, then select participant
    setTimeout(() => {
      // Calculate which segment the pointer landed on
      const normalizedRotation = (360 - (finalRotation % 360)) % 360;
      const segmentAngle = 360 / participants.length;
      const selectedIndex = Math.floor(normalizedRotation / segmentAngle) % participants.length;
      
      const selectedParticipant = participants[selectedIndex];
      setCurrentSpeaker(selectedParticipant);
      // DON'T remove from participants yet - wait until marked as done
      setIsSpinning(false);
    }, 3000);
  };

  const markAsDone = () => {
    if (currentSpeaker) {
      // NOW remove the current speaker from participants and add to done
      setParticipants(participants.filter(p => p.id !== currentSpeaker.id));
      setDoneParticipants([...doneParticipants, currentSpeaker]);
      setCurrentSpeaker(null);
      // Clear the spinning participants since we're resetting
      setSpinningParticipants([]);
      
      // Check if all participants are done (after removing current speaker)
      const remainingParticipants = participants.filter(p => p.id !== currentSpeaker.id);
      if (remainingParticipants.length === 0) {
        setTimeout(() => setShowCelebration(true), 500);
      }
    }
  };

  const resetAll = () => {
    setParticipants([...participants, ...doneParticipants, ...(currentSpeaker ? [currentSpeaker] : [])]);
    setDoneParticipants([]);
    setCurrentSpeaker(null);
    setShowCelebration(false);
    setSpinRotation(0);
    setSpinningParticipants([]);
    setIsSpinning(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addParticipant();
    }
  };

  const totalParticipants = participants.length + doneParticipants.length + (currentSpeaker ? 1 : 0);

  // Determine which participants to show in the spinner
  const displayParticipants = currentSpeaker ? spinningParticipants : participants;

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`} style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
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
              onClick={resetAll}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Reset All
            </button>
          </div>
        </div>

        {/* Add Participant Section */}
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
              onKeyPress={handleKeyPress}
              placeholder="Enter participant name..."
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
              }`}
              disabled={isSpinning || participants.length >= 20}
              maxLength={20}
            />
            <button
              onClick={addParticipant}
              disabled={!newName.trim() || isSpinning || participants.length >= 20}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {participants.length >= 20 && (
            <p className={`text-sm mt-2 font-medium ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>
              Maximum 20 participants reached! 🎯
            </p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Spinner Section */}
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

          {/* Status Section */}
          <div className="space-y-6">
            <CurrentSpeaker 
              currentSpeaker={currentSpeaker} 
              onMarkDone={markAsDone} 
              darkMode={darkMode}
            />
            
            <ParticipantsList 
              participants={participants}
              doneParticipants={doneParticipants}
              onRemoveParticipant={removeParticipant}
              isSpinning={isSpinning}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal 
        show={showCelebration} 
        onClose={() => setShowCelebration(false)}
        onRestart={resetAll}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;