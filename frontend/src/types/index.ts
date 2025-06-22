export interface Stack {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface Component {
  id: string;
  type: 'input' | 'llm' | 'knowledge-base' | 'output';
  name: string;
  icon: string;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}