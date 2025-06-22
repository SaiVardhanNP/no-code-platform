import React from 'react';
import { Type, Brain, Database, FileText } from 'lucide-react';

const components = [
  { id: 'input', name: 'Input', icon: Type },
  { id: 'llm', name: 'LLM (OpenAI)', icon: Brain },
  { id: 'knowledge-base', name: 'Knowledge Base', icon: Database },
  { id: 'output', name: 'Output', icon: FileText }
];

export default function ComponentSidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Components</h3>
      
      <div className="space-y-2">
        {components.map((component) => {
          const IconComponent = component.icon;
          return (
            <div
              key={component.id}
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 cursor-grab transition-all duration-200"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('component-type', component.id);
              }}
            >
              <IconComponent className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{component.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}