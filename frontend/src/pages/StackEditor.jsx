import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import ComponentSidebar from '../components/ComponentSidebar';
import WorkflowCanvas from '../components/WorkflowCanvas';

export default function StackEditor({ stack, onBack }) {
  const handleSave = () => {
    console.log('Saving stack:', stack.name);
    // Here you would implement the save functionality
  };

  const handleRunStack = (nodes) => {
    console.log('Running stack with nodes:', nodes);
    // Here you would implement the stack execution logic
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentStack={stack.name} onSave={handleSave} />
      
      <div className="flex-1 flex">
        <div className="flex flex-col">
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{stack.name}</span>
            </button>
          </div>
          <ComponentSidebar />
        </div>
        
        <WorkflowCanvas onRunStack={handleRunStack} />
      </div>
    </div>
  );
}