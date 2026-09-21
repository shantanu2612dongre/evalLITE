import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileBarChart, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 h-screen shrink-0 relative overflow-hidden text-zinc-300 border-r border-white/10 transition-all duration-500">
      {/* Background Layers for Liquid Glass Black */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Base layer */}
        <div className="absolute inset-0 bg-[#020202]" />
        
        {/* Fluid searchlight effect */}
        <motion.div
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_transparent_70%)] bg-[length:200%_200%]"
        />

        {/* Specular Highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Shine Sweep */}
        <motion.div
          animate={{ left: ["-100%", "200%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
          className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent skew-x-[-25deg]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-4">
        <div className="flex items-center gap-3 px-2 py-4 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#c3ff9b] to-[#a6c1ff] flex items-center justify-center shadow-[0_0_15px_rgba(195,255,155,0.3)]">
            <LayoutDashboard className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold text-white tracking-wide">Eval Lite</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <NavItem icon={<FileBarChart size={18} />} label="Evaluations" />
        </nav>

        <div className="mt-auto">
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
      active ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'hover:bg-white/5 hover:text-white'
    }`}>
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
