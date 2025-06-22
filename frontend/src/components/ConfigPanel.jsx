import React, { useState, useEffect } from 'react';
import { X, Upload, Eye, EyeOff } from 'lucide-react';

export default function ConfigPanel({ node, onSave, onClose }) {
  const [config, setConfig] = useState(node.config || {});
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    setConfig(node.config || {});
  }, [node]);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const handleInputChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const renderConfigFields = () => {
    switch (node.type) {
      case 'user-query':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Query
              </label>
              <input
                type="text"
                value={config.placeholder || ''}
                onChange={(e) => handleInputChange('placeholder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Write your query here"
              />
            </div>
          </div>
        );

      case 'llm':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={config.model || 'GPT 4o- Mini'}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>GPT 4o- Mini</option>
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
                <opton>Gemini Pro</opton>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={config.apiKey || ''}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt
              </label>
              <textarea
                value={config.prompt || ''}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="You are a helpful PDF assistant. Use web search if the PDF lacks context."
              />
              <div className="mt-2 text-xs text-blue-600">
                • CONTEXT: (context)
                • User Query: (query)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.temperature || 0.75}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-600">{config.temperature || 0.75}</div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="webSearchTool"
                checked={config.webSearchTool || false}
                onChange={(e) => handleInputChange('webSearchTool', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="webSearchTool" className="text-sm font-medium text-gray-700">
                WebSearch Tool
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SERP API
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={config.serpApi || ''}
                  onChange={(e) => handleInputChange('serpApi', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        );

      case 'knowledge-base':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File for Knowledge Base
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload File</p>
                {config.file && (
                  <p className="text-xs text-green-600 mt-1">AllPlans_file.Pdf</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Embedding Model
              </label>
              <select
                value={config.embeddingModel || 'text-embedding-3-large'}
                onChange={(e) => handleInputChange('embeddingModel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>text-embedding-3-large</option>
                <option>text-embedding-3-small</option>
                <option>text-embedding-ada-002</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={config.apiKey || ''}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        );

      case 'output':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Text
              </label>
              <textarea
                value={config.text || ''}
                onChange={(e) => handleInputChange('text', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Output will be generated based on query"
              />
            </div>
          </div>
        );

      default:
        return <div>No configuration available for this component.</div>;
    }
  };

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-10">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{node.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto h-full pb-20">
        {renderConfigFields()}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}