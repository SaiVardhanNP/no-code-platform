import React from 'react';
import { Type, Brain, Database, FileText, Search, Settings, X } from 'lucide-react';

const iconMap = {
  'user-query': Type,
  'llm': Brain,
  'knowledge-base': Database,
  'web-search': Search,
  'output': FileText
};

export default function ComponentNode({ node, onClick, onDelete }) {
  const IconComponent = iconMap[node.type] || Type;

  return (
    <div
      className="absolute bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      style={{ 
        left: node.position.x, 
        top: node.position.y,
        width: '200px'
      }}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <IconComponent className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">{node.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Settings className="w-3 h-3 text-gray-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          {getNodeDescription(node)}
        </div>
      </div>
      
      {/* Connection points */}
      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      {node.type !== 'user-query' && (
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
}

function getNodeDescription(node) {
  switch (node.type) {
    case 'user-query':
      return 'Enter point for queries';
    case 'llm':
      return `Run a query with ${node.config?.model || 'OpenAI LLM'}`;
    case 'knowledge-base':
      return 'Let LLM search info in your file';
    case 'web-search':
      return 'Search the web for information';
    case 'output':
      return 'Output of the result nodes as text';
    default:
      return '';
  }
}