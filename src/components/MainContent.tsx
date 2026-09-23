import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';
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
    progress, setProgress, setActiveTab
  } = context;

  const [showToast, setShowToast] = useState(false);

  const handleRunEval = async () => {
    if (isRunning || datasetRows.length === 0) return;
    setIsRunning(true);
    setShowToast(false);
    await runBatchEvaluation(context, (curr, tot) => setProgress({ current: curr, total: tot }));
    setIsRunning(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setActiveTab('dataset');
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#000] relative">
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#0a0a0a] border border-green-500/30 text-green-400 text-sm font-medium px-5 py-3 rounded-full shadow-xl shadow-green-500/10"
          >
            <CheckCircle2 size={16} />
            Evaluation complete! Switching to Examples view…
            <ArrowRight size={14} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12 pb-32">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <header className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight mb-2">Prompt Playground</h1>
              <p className="text-zinc-500">Draft your prompt and set evaluation criteria.</p>
            </div>
            
            <button 
              onClick={handleRunEval}
              disabled={isRunning || datasetRows.length === 0}
              className={`relative group overflow-hidden rounded-full px-8 py-3.5 font-semibold text-black shadow-lg ${isRunning || datasetRows.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#c3ff9b] via-[#b6f1ff] to-[#a6c1ff] bg-[length:200%_200%] animate-[gradient_3s_ease_infinite] group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full" />
              <div className="absolute inset-[1px] rounded-full shadow-[inset_0_-2px_10px_rgba(0,0,0,0.2)] pointer-events-none" />
              <motion.div
                animate={{ left: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]"
              />
              <span className="relative z-10 flex items-center gap-2">
                {isRunning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                    />
                    Running ({progress.current}/{progress.total})…
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    Run Batch Evaluation ({datasetRows.length})
                  </>
                )}
              </span>
            </button>
          </header>

          <section className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">System Prompt</label>
            <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
              <textarea 
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full h-[250px] bg-transparent p-5 text-zinc-200 placeholder-zinc-600 resize-none outline-none font-mono text-sm leading-relaxed"
                placeholder={`You are an impartial evaluator grading a customer support response.\n\n[Evaluation Criteria]\n- PASS: The response is empathetic, courteous, professional, and directly addresses the user's issue.\n- FAIL: The response is robotic, rude, dismissive, or uses corporate jargon unnecessarily.\n\n[Input Data]\nCustomer Request: {{user_request}}\nAI Response: {{ai_answer}}\n\n[Output Instruction]\nReturn a JSON object with:\n- "verdict": "PASS" or "FAIL"\n- "reason": A one-sentence explanation of why the score was given.`}
              />
            </div>
          </section>

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
                    Info: Evaluates whether the AI response can be parsed as valid JSON.
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
                        <option>Tone &amp; Brand Voice</option>
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

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-200">Results Preview</h3>
              {isRunning && (
                <span className="flex items-center gap-2 text-xs text-zinc-500">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="inline-block w-2 h-2 rounded-full bg-[#c3ff9b]"
                  />
                  Live — evaluating {progress.current} of {progress.total}
                </span>
              )}
            </div>
            
            <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-[#222] bg-[#111]">
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/5">Input</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/5">Expected Output</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/5">Actual LLM Output</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/5">Reason</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222] text-sm text-zinc-300">
                  {context.evalResults.length === 0 && !isRunning ? (
                    <tr>
                      <td colSpan={5} className="py-8 px-4 text-center text-zinc-500 text-sm">
                        No results yet. Click 'Run Batch Evaluation' to see a preview.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {context.evalResults.slice(0, 5).map((result, i) => (
                        <motion.tr
                          key={result.exampleId}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className="hover:bg-[#111]/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-xs text-zinc-400 truncate max-w-0">
                            <span className="block truncate" title={result.inputVal || '-'}>{result.inputVal || '-'}</span>
                          </td>
                          <td className="py-3 px-4 text-xs text-zinc-400 truncate max-w-0">
                            <span className="block truncate" title={result.referenceAnswer || '-'}>{result.referenceAnswer || '-'}</span>
                          </td>
                          <td className="py-3 px-4 text-xs text-zinc-200 truncate max-w-0">
                            <span className="block truncate" title={result.aiAnswer}>{result.aiAnswer}</span>
                          </td>
                          <td className="py-3 px-4 text-xs text-zinc-500 truncate max-w-0">
                            <span className="block truncate" title={result.reason}>{result.reason}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium border ${
                              result.status === 'PASS' 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              {result.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                      {isRunning && context.evalResults.length < 5 && (
                        Array.from({ length: Math.min(3, 5 - context.evalResults.length) }).map((_, i) => (
                          <tr key={`pending-${i}`} className="border-t border-[#222]">
                            <td colSpan={5} className="py-4 px-4">
                              <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
                                className="h-3 rounded bg-zinc-800 w-full"
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
