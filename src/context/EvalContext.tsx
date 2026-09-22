/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

export interface DatasetRow {
  _id: string;
  [key: string]: any;
}

export interface EvalResult {
  exampleId: string;
  inputData: any;
  aiAnswer: string;
  referenceAnswer: string;
  status: 'PASS' | 'FAIL';
  score: number;
  reason: string;
  latencyMs: number;
}

interface EvalContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;

  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  evalCriteria: string;
  setEvalCriteria: (criteria: string) => void;
  targetValue: string;
  setTargetValue: (value: string) => void;
  judgeRubric: string;
  setJudgeRubric: (rubric: string) => void;

  datasetRows: DatasetRow[];
  setDatasetRows: (rows: DatasetRow[]) => void;
  referenceColumn: string;
  setReferenceColumn: (col: string) => void;

  evalResults: EvalResult[];
  setEvalResults: (results: EvalResult[]) => void;
  
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  progress: { current: number; total: number };
  setProgress: (prog: { current: number; total: number }) => void;
}

const EvalContext = createContext<EvalContextType | undefined>(undefined);

export function EvalProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [systemPrompt, setSystemPrompt] = useState(`You are an impartial evaluator grading a customer support response.

[Evaluation Criteria]
- PASS: The response is empathetic, courteous, professional, and directly addresses the user's issue.
- FAIL: The response is robotic, rude, dismissive, or uses corporate jargon unnecessarily.

[Input Data]
Customer Request: {{user_request}}
AI Response: {{ai_answer}}

[Output Instruction]
Return a JSON object with:
- "verdict": "PASS" or "FAIL"
- "reason": A one-sentence explanation of why the score was given.`);
  
  const [evalCriteria, setEvalCriteria] = useState('Exact Match');
  const [targetValue, setTargetValue] = useState('');
  const [judgeRubric, setJudgeRubric] = useState('Tone & Brand Voice');
  
  const [datasetRows, setDatasetRows] = useState<DatasetRow[]>([]);
  const [referenceColumn, setReferenceColumn] = useState('');
  
  const [evalResults, setEvalResults] = useState<EvalResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  return (
    <EvalContext.Provider value={{
      apiKey, setApiKey,
      selectedModel, setSelectedModel,
      systemPrompt, setSystemPrompt,
      evalCriteria, setEvalCriteria,
      targetValue, setTargetValue,
      judgeRubric, setJudgeRubric,
      datasetRows, setDatasetRows,
      referenceColumn, setReferenceColumn,
      evalResults, setEvalResults,
      isRunning, setIsRunning,
      progress, setProgress
    }}>
      {children}
    </EvalContext.Provider>
  );
}

export function useEval() {
  const context = useContext(EvalContext);
  if (!context) throw new Error('useEval must be used within EvalProvider');
  return context;
}
