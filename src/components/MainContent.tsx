import React from 'react';
import { motion } from 'framer-motion';
import { Play, UploadCloud } from 'lucide-react';

export function MainContent() {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#050505] p-10 relative">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#c3ff9b]/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">New Evaluation</h1>
          <p className="text-zinc-400">Configure parameters and run your assessment.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <h3 className="text-lg font-semibold text-white mb-4">Input Data</h3>
            
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/[0.02] transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
              <UploadCloud className="w-10 h-10 text-zinc-500 mb-3 group-hover:text-[#b6f1ff] transition-colors" />
              <p className="text-zinc-400 text-sm">Drag and drop files here or click to upload</p>
              <p className="text-zinc-600 text-xs mt-2">Supports .json, .csv, .txt</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Model Target</label>
                <select className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#a6c1ff] transition-colors">
                  <option>gemini-1.5-pro</option>
                  <option>gemini-1.5-flash</option>
                  <option>claude-3-opus</option>
                  <option>gpt-4o</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Eval Metric</label>
                <select className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#a6c1ff] transition-colors">
                  <option>Accuracy</option>
                  <option>Relevance</option>
                  <option>Tone & Style</option>
                  <option>Custom Heuristics</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="relative group overflow-hidden rounded-full px-8 py-3 font-semibold text-black shadow-lg">
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
              Run Evaluation
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
