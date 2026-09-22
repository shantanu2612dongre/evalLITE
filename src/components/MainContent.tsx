import { motion } from 'framer-motion';
import { Play, ChevronDown } from 'lucide-react';
import { useEval } from '../context/EvalContext';
import { runBatchEvaluation } from '../lib/evalEngine';

export function MainContent() {
  const context = useEval();
  const { 
    systemPrompt, setSystemPrompt,
    evalCriteria, setEvalCriteria,
    targetValue, setTargetValue,
    judgeRubric, setJudgeRubric,
    datasetRows, isRunning, setIsRunning,
    progress, setProgress
  } = context;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#000]">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 pb-32">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <header className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight mb-2">Prompt Playground</h1>
              <p className="text-zinc-500">Draft your prompt and set evaluation criteria.</p>
            </div>
            
            <button 
              onClick={async () => {
                if (isRunning || datasetRows.length === 0) return;
                setIsRunning(true);
                await runBatchEvaluation(context, (curr, tot) => setProgress({ current: curr, total: tot }));
                setIsRunning(false);
              }}
              disabled={isRunning || datasetRows.length === 0}
              className={`relative group overflow-hidden rounded-full px-8 py-3.5 font-semibold text-black shadow-lg ${isRunning || datasetRows.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Vibrant Liquid Glass Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#c3ff9b] via-[#b6f1ff] to-[#a6c1ff] bg-[length:200%_200%] animate-[gradient_3s_ease_infinite] group-hover:scale-105 transition-transform duration-500" />
              
              {/* Specular Highlight */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full" />
              
              {/* Inner Shadow for depth */}
              <div className="absolute inset-[1px] rounded-full shadow-[inset_0_-2px_10px_rgba(0,0,0,0.2)] pointer-events-none" />
              
              {/* Sweeping Shine */}
              <motion.div
                animate={{ left: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]"
              />

              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-4 h-4 fill-black" />
                {isRunning ? `Running (${progress.current}/${progress.total})` : `Run Batch Evaluation (${datasetRows.length})`}
              </span>
            </button>
          </header>

          {/* Prompt Editor */}
          <section className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">System Prompt</label>
            <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
              <textarea 
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full h-[250px] bg-transparent p-5 text-zinc-200 placeholder-zinc-600 resize-none outline-none font-mono text-sm leading-relaxed"
                placeholder={`You are an impartial evaluator grading a customer support response.

[Evaluation Criteria]
- PASS: The response is empathetic, courteous, professional, and directly addresses the user's issue.
- FAIL: The response is robotic, rude, dismissive, or uses corporate jargon unnecessarily.

[Input Data]
Customer Request: {{user_request}}
AI Response: {{ai_answer}}

[Output Instruction]
Return a JSON object with:
- "verdict": "PASS" or "FAIL"
- "reason": A one-sentence explanation of why the score was given.`}
              />
            </div>
          </section>

          {/* Evaluation Settings Card */}
          <section className="rounded-xl border border-[#222] bg-[#0a0a0a] p-6 shadow-sm">
            <h3 className="text-sm font-medium text-zinc-200 mb-5">Evaluation Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Evaluation Criteria</label>
                <div className="relative max-w-md">
                  <select 
                    value={evalCriteria}
                    onChange={(e) => setEvalCriteria(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] rounded-md pl-4 pr-10 py-2.5 text-sm text-zinc-200 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="Exact Match">Exact Match</option>
                    <option value="Contains Keyword">Contains Keyword</option>
                    <option value="Valid JSON">Valid JSON</option>
                    <option value="LLM-as-a-Judge">LLM-as-a-Judge</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* Conditional Rendering */}
              <div className="max-w-md">
                {evalCriteria === 'Exact Match' && (
                  <div className="p-4 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                    Info: The AI output will be compared strictly against the reference_answer column in your dataset.
                  </div>
                )}

                {evalCriteria === 'Contains Keyword' && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Target Keyword</label>
                    <input 
                      type="text" 
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="e.g., Refund, Error, Success"
                      className="w-full bg-[#111] border border-[#333] rounded-md px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                )}

                {evalCriteria === 'Valid JSON' && (
                  <div className="p-4 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                    Info: Evaluates whether the AI's response can be successfully parsed as valid JSON.
                  </div>
                )}

                {evalCriteria === 'LLM-as-a-Judge' && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Judge Rubric</label>
                    <div className="relative">
                      <select 
                        value={judgeRubric}
                        onChange={(e) => setJudgeRubric(e.target.value)}
                        className="w-full bg-[#111] border border-[#333] rounded-md pl-4 pr-10 py-2.5 text-sm text-zinc-200 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      >
                        <option>Tone & Brand Voice</option>
                        <option>Hallucination Check</option>
                        <option>Custom Prompt</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">Uses an LLM to grade the output based on qualitative criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Results Preview */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-200">Results Preview</h3>
            
            <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#222] bg-[#111]">
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Input Variable</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Expected Output</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Actual LLM Output</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222] text-sm text-zinc-300">
                  <tr className="hover:bg-[#111]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-zinc-400">"What is capital of France?"</td>
                    <td className="py-3 px-4">"Paris"</td>
                    <td className="py-3 px-4 text-zinc-200">"The capital of France is Paris."</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Pass
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#111]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-zinc-400">"Explain quantum mechanics"</td>
                    <td className="py-3 px-4">JSON object</td>
                    <td className="py-3 px-4 text-red-400 font-mono text-xs">Error: Timeout</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        Fail
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>



    </div>
  );
}
