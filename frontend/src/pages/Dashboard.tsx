import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import CreateStackModal from '../components/CreateStackModal';
import StackCard from '../components/StackCard';
import { Stack } from '../types';

interface DashboardProps {
  onEditStack: (stack: Stack) => void;
}

const initialStacks: Stack[] = [
  {
    id: '1',
    name: 'Chat With AI',
    description: 'Chat with a smart AI',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Content Writer',
    description: 'Helps you write content',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Content Summarizer',
    description: 'Helps you summarize content',
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Information Finder',
    description: 'Helps you find relevant information',
    createdAt: new Date()
  }
];

export default function Dashboard({ onEditStack }: DashboardProps) {
  const [stacks, setStacks] = useState<Stack[]>(initialStacks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateStack = (stackData: Omit<Stack, 'id' | 'createdAt'>) => {
    const newStack: Stack = {
      ...stackData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setStacks(prev => [...prev, newStack]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Stacks</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New Stack</span>
          </button>
        </div>

        {stacks.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Create New Stack</h2>
              <p className="text-gray-600 mb-6">
                Start building your generative AI apps with our essential tools and frameworks
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>New Stack</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stacks.map((stack) => (
              <StackCard key={stack.id} stack={stack} onEdit={onEditStack} />
            ))}
          </div>
        )}
      </main>

      <CreateStackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateStack={handleCreateStack}
      />
    </div>
  );
}