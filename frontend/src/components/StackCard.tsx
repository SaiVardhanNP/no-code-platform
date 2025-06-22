import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Stack } from '../types';

interface StackCardProps {
  stack: Stack;
  onEdit: (stack: Stack) => void;
}

export default function StackCard({ stack, onEdit }: StackCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{stack.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{stack.description}</p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => onEdit(stack)}
            className="inline-flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
          >
            <span>Edit Stack</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}