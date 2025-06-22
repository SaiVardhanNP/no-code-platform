import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import StackEditor from './pages/StackEditor';

function App() {
  const [currentState, setCurrentState] = useState('dashboard');
  const [currentStack, setCurrentStack] = useState(null);

  const handleEditStack = (stack) => {
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