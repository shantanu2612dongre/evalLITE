import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Lock, UploadCloud, ChevronDown } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-[300px] h-screen shrink-0 bg-[#0a0a0a] border-r border-[#222] flex flex-col p-5">
      
      {/* Header / Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700 shadow-sm">
          <Terminal size={18} className="text-zinc-300" />
        </div>
        <span className="text-xl font-bold text-zinc-100 tracking-tight">EvalOS</span>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Configuration Section */}
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Provider Setup</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">API Key (BYOK)</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="password" 
                  placeholder="sk-..." 
                  className="w-full bg-[#111] border border-[#333] rounded-md pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Select Model</label>
              <div className="relative">
                <select className="w-full bg-[#111] border border-[#333] rounded-md pl-3 pr-9 py-2 text-sm text-zinc-200 appearance-none focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all">
                  <option>GPT-4o</option>
                  <option>Claude 3.5 Sonnet</option>
                  <option>Llama 3</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Dataset Section */}
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Test Data</h2>
          
          <div className="border border-dashed border-[#444] rounded-lg p-5 flex flex-col items-center justify-center bg-[#111] hover:bg-[#161616] transition-colors cursor-pointer group">
            <UploadCloud size={20} className="text-zinc-500 mb-2 group-hover:text-zinc-300 transition-colors" />
            <p className="text-sm text-zinc-300 font-medium">Upload CSV or JSON</p>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Required columns: <code className="bg-[#222] px-1 py-0.5 rounded text-zinc-300">input</code>, <code className="bg-[#222] px-1 py-0.5 rounded text-zinc-300">expected_output</code></p>
        </section>

      </div>
    </div>
  );
}
