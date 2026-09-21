import React from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronDown } from 'lucide-react';

export function MainContent() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#000]">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 pb-32">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <header>
            <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight mb-2">Prompt Playground</h1>
            <p className="text-zinc-500">Draft your prompt and set evaluation criteria.</p>
          </header>

          {/* Prompt Editor */}
          <section className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">System Prompt</label>
            <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
              <textarea 
                className="w-full h-[250px] bg-transparent p-5 text-zinc-200 placeholder-zinc-600 resize-none outline-none font-mono text-sm leading-relaxed"
                placeholder="Enter your system prompt here. Use {{input}} to inject variables from your dataset."
              />
            </div>
          </section>

          {/* Evaluation Settings Card */}
          <section className="rounded-xl border border-[#222] bg-[#0a0a0a] p-6 shadow-sm">
            <h3 className="text-sm font-medium text-zinc-200 mb-5">Evaluation Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Evaluation Criteria</label>
                <div className="relative">
                  <select className="w-full bg-[#111] border border-[#333] rounded-md pl-4 pr-10 py-2.5 text-sm text-zinc-200 appearance-none focus:outline-none focus:border-zinc-500 transition-all">
                    <option>Exact Match</option>
                    <option>Contains Keyword</option>
                    <option>Valid JSON</option>
                    <option>LLM-as-a-Judge</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Target Value</label>
                <input 
                  type="text" 
                  placeholder="e.g. 'success' or JSON schema"
                  className="w-full bg-[#111] border border-[#333] rounded-md px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all"
                />
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

      {/* Action Bar (Sticky Bottom) */}
      <div className="absolute bottom-0 left-[300px] right-0 border-t border-[#222] bg-[#050505]/80 backdrop-blur-md p-6 flex justify-end z-20">
        <button className="relative group overflow-hidden rounded-full px-8 py-3.5 font-semibold text-black shadow-lg">
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
            Run Batch Evaluation (0/100)
          </span>
        </button>
      </div>

    </div>
  );
}
