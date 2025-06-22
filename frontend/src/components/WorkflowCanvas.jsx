import React, { useState } from 'react';
import { Move, Settings, X, Upload, Eye, EyeOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ComponentNode from './ComponentNode';
import ConfigPanel from './ConfigPanel';
import ChatModal from './ChatModal';

export default function WorkflowCanvas({ onRunStack }) {
  const [dragOver, setDragOver] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [zoom, setZoom] = useState(100);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const componentType = e.dataTransfer.getData('component-type');
    const componentName = e.dataTransfer.getData('component-name');
    
    if (componentType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newNode = {
        id: uuidv4(),
        type: componentType,
        name: componentName,
        position: { x: x - 100, y: y - 50 },
        config: getDefaultConfig(componentType)
      };
      
      setNodes(prev => [...prev, newNode]);
    }
  };

  const getDefaultConfig = (type) => {
    switch (type) {
      case 'user-query':
        return { placeholder: 'Write your query here' };
      case 'llm':
        return { 
          model: 'GPT 4o- Mini',
          apiKey: '',
          prompt: 'You are a helpful PDF assistant. Use web search if the PDF lacks context.',
          temperature: 0.75,
          webSearchTool: true,
          serpApi: ''
        };
      case 'knowledge-base':
        return { 
          file: null,
          embeddingModel: 'text-embedding-3-large',
          apiKey: ''
        };
      case 'web-search':
        return { apiKey: '' };
      case 'output':
        return { text: 'Output will be generated based on query' };
      default:
        return {};
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowConfigPanel(true);
  };

  const handleNodeDelete = (nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
      setShowConfigPanel(false);
    }
  };

  const handleConfigSave = (config) => {
    if (selectedNode) {
      setNodes(prev => prev.map(node => 
        node.id === selectedNode.id 
          ? { ...node, config }
          : node
      ));
      setSelectedNode({ ...selectedNode, config });
    }
  };

  const handleRunStack = () => {
    setShowChatModal(true);
    if (onRunStack) {
      onRunStack(nodes);
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const zoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const resetZoom = () => setZoom(100);

  return (
    <div className="flex-1 bg-gray-50 relative overflow-hidden">
      <div
        className={`h-full transition-colors duration-200 ${
          dragOver ? 'bg-green-50 border-2 border-dashed border-green-300' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
      >
        {nodes.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Move className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-lg font-medium text-gray-600">Drag & drop to get started</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {nodes.map((node) => (
              <ComponentNode
                key={node.id}
                node={node}
                onClick={() => handleNodeClick(node)}
                onDelete={() => handleNodeDelete(node.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Canvas controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md border border-gray-200 px-4 py-2 flex items-center space-x-4">
        <button onClick={zoomIn} className="p-1 hover:bg-gray-100 rounded">
          <span className="text-lg">+</span>
        </button>
        <button onClick={zoomOut} className="p-1 hover:bg-gray-100 rounded">
          <span className="text-lg">−</span>
        </button>
        <button onClick={resetZoom} className="p-1 hover:bg-gray-100 rounded">
          <span className="text-sm">⛶</span>
        </button>
        <span className="text-sm text-gray-600">{zoom}%</span>
      </div>

      {/* Build Stack button */}
      <button 
        onClick={handleRunStack}
        className="absolute bottom-6 right-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium shadow-lg"
      >
        Build Stack
      </button>

      {/* Chat with Stack button */}
      <button 
        onClick={() => setShowChatModal(true)}
        className="absolute bottom-20 right-6 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors duration-200"
      >
        <span className="text-white text-xl">💬</span>
      </button>

      {/* Help button */}
      <button className="absolute bottom-32 right-6 w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-600 transition-colors duration-200">
        <span className="text-white text-xl">?</span>
      </button>

      {/* Configuration Panel */}
      {showConfigPanel && selectedNode && (
        <ConfigPanel
          node={selectedNode}
          onSave={handleConfigSave}
          onClose={() => setShowConfigPanel(false)}
        />
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <ChatModal
          onClose={() => setShowChatModal(false)}
          nodes={nodes}
        />
      )}
    </div>
  );
}