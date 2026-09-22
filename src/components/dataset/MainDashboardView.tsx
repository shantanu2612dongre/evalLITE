import { Search, ChevronDown, Edit2 } from 'lucide-react';
import { useEval } from '../../context/EvalContext';

interface Props {
  onExampleSelect: (id: string) => void;
}

export function MainDashboardView({ onExampleSelect }: Props) {
  const { evalResults } = useEval();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header Navigation */}
      <div className="border-b border-[#222] bg-[#0a0a0a] px-8 pt-6">
        <div className="flex items-center gap-6">
          <button className="pb-3 text-sm font-medium text-zinc-100 border-b-2 border-zinc-100 flex items-center gap-2">
            Examples <span className="bg-[#222] text-zinc-400 text-[10px] px-2 py-0.5 rounded-full">{evalResults.length}</span>
          </button>
          <button className="pb-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
            Experiment Analysis
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text"
                placeholder="Example Query..."
                className="w-full bg-[#111] border border-[#333] rounded-md pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all"
              />
            </div>
            
            <div className="relative">
              <button className="flex items-center gap-2 bg-[#111] border border-[#333] rounded-md px-4 py-2 text-sm text-zinc-300 hover:bg-[#161616] transition-colors">
                Views <ChevronDown size={14} className="text-zinc-500" />
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-[#222] bg-[#111]">
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-32">Example ID</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/4">reference_answer</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-24">Evaluations</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-24">Annotations</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/4">ai_answer</th>
                    <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/4">user_request</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222] text-sm text-zinc-300">
                  {evalResults.length === 0 ? (
                    <tr className="hover:bg-[#111]/50 transition-colors">
                      <td colSpan={6} className="py-8 px-4 text-center text-zinc-500 text-sm">
                        No examples found.
                      </td>
                    </tr>
                  ) : (
                    evalResults.map((result) => (
                      <tr key={result.exampleId} className="hover:bg-[#111]/50 transition-colors">
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => onExampleSelect(result.exampleId)}
                            className="inline-flex items-center px-2 py-1 rounded bg-[#222] hover:bg-[#333] text-zinc-300 text-xs font-mono transition-colors"
                          >
                            {result.exampleId.substring(0, 8)}...
                          </button>
                        </td>
                        <td className="py-3 px-4 text-xs line-clamp-2">{result.referenceAnswer}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium border ${
                            result.status === 'PASS' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {result.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-zinc-500 hover:text-zinc-300 transition-colors"><Edit2 size={14} /></button>
                        </td>
                        <td className="py-3 px-4 text-xs text-zinc-400 line-clamp-2">{result.aiAnswer}</td>
                        <td className="py-3 px-4 text-xs text-zinc-400 line-clamp-2" title={result.reason}>{result.reason}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
