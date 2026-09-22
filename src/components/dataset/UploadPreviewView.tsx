import { ChevronDown, Trash2 } from 'lucide-react';

interface Props {
  onConfirm: () => void;
}

export function UploadPreviewView({ onConfirm }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12 pb-32">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <header className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Dataset Name</label>
            <input 
              type="text" 
              placeholder="e.g., quick-cart"
              className="w-full max-w-md bg-[#111] border border-[#333] rounded-md px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all"
            />
          </div>
        </header>

        {/* Schema Section */}
        <section className="rounded-xl border border-[#222] bg-[#0a0a0a] p-6 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-200 mb-2">Dataset Schema</h3>
          <p className="text-xs text-zinc-500 mb-5">Select a column to map to 'reference' — typically the ground truth output.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-400 w-24">reference</span>
            <div className="relative w-64">
              <select className="w-full bg-[#111] border border-[#333] rounded-md pl-4 pr-10 py-2 text-sm text-zinc-200 appearance-none focus:outline-none focus:border-zinc-500 transition-all">
                <option>expected_output</option>
                <option>ground_truth</option>
                <option>target</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Preview Data */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-200">Preview Data (10 rows)</h3>
            <button className="flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors">
              <Trash2 size={14} /> Clear file
            </button>
          </div>
          
          <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] bg-[#111]">
                  <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider w-12">Row</th>
                  <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">user_request</th>
                  <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mr-2">reference</span>
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">ai_answer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222] text-sm text-zinc-300">
                <tr className="hover:bg-[#111]/50 transition-colors">
                  <td colSpan={4} className="py-8 px-4 text-center text-zinc-500 text-sm">
                    No data uploaded yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Actions */}
        <div className="pt-6">
          <button 
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-3 bg-zinc-100 hover:bg-white text-black text-sm font-semibold rounded-md transition-colors"
          >
            Confirm & Upload Dataset
          </button>
        </div>

      </div>
    </div>
  );
}
