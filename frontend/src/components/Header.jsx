import React from 'react';
import { User } from 'lucide-react';

export default function Header({ currentStack, onSave }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">GenAI Stack</span>
          </div>
          {currentStack && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700 font-medium">{currentStack}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Save
            </button>
          )}
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}