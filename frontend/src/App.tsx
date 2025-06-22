import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import StackEditor from './pages/StackEditor';
import { Stack } from './types';

type AppState = 'dashboard' | 'editor';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('dashboard');
  const [currentStack, setCurrentStack] = useState<Stack | null>(null);

  const handleEditStack = (stack: Stack) => {
    setCurrentStack(stack);
    setCurrentState('editor');
  };

  const handleBackToDashboard = () => {
    setCurrentStack(null);
    setCurrentState('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentState === 'dashboard' && (
        <Dashboard onEditStack={handleEditStack} />
      )}
      
      {currentState === 'editor' && currentStack && (
        <StackEditor stack={currentStack} onBack={handleBackToDashboard} />
      )}
    </div>
  );
}

export default App;