import React from 'react';
import { Move } from 'lucide-react';

export default function WorkflowCanvas() {
  const [dragOver, setDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const componentType = e.dataTransfer.getData('component-type');
    console.log('Dropped component:', componentType);
    // Here you would handle adding the component to the canvas
  };

  return (
    <div className="flex-1 bg-gray-50 relative">
      <div
        className={`h-full flex items-center justify-center transition-colors duration-200 ${
          dragOver ? 'bg-green-50 border-2 border-dashed border-green-300' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Move className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-lg font-medium text-gray-600">Drag & drop to get started</p>
        </div>
      </div>
      
      {/* Canvas controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md border border-gray-200 px-4 py-2 flex items-center space-x-4">
        <button className="p-1 hover:bg-gray-100 rounded">
          <span className="text-lg">+</span>
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <span className="text-lg">−</span>
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <span className="text-sm">⛶</span>
        </button>
        <span className="text-sm text-gray-600">100%</span>
      </div>

      {/* Play button */}
      <button className="absolute bottom-6 right-6 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors duration-200">
        <span className="text-white text-xl ml-1">▶</span>
      </button>

      {/* Help button */}
      <button className="absolute bottom-20 right-6 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-200">
        <span className="text-white text-xl">?</span>
      </button>
    </div>
  );
}