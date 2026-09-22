import { useState } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useEval } from '../../context/EvalContext';

interface Props {
  exampleId: string;
  onBack: () => void;
}

export function SingleExampleView({ exampleId, onBack }: Props) {
  const { datasetRows, evalResults, referenceColumn } = useEval();
  
  const [activeTab, setActiveTab] = useState<'data' | 'annotations'>('data');
  const [tags, setTags] = useState<string[]>(['needs-review']);
  const [currentTagInput, setCurrentTagInput] = useState('');

  const row = datasetRows.find(r => r._id === exampleId) || ({} as any);
  const result = evalResults.find(r => r.exampleId === exampleId);

  const data = {
    ai_answer: result ? result.aiAnswer : "-",
    reference_answer: referenceColumn ? row[referenceColumn] : (row.reference_answer || row.expected_output || "-"),
    user_request: row.user_request || row.input || "-",
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTagInput.trim())) {
        setTags([...tags, currentTagInput.trim()]);
      }
      setCurrentTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#000]">
      
      {/* Top Navigation */}
      <div className="px-8 py-4 border-b border-[#222] flex items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dataset
        </button>
        <span className="ml-4 pl-4 border-l border-[#333] text-sm text-zinc-500 font-mono">
          Example {exampleId}
        </span>
      </div>

      {/* Header Tabs */}
      <div className="border-b border-[#222] bg-[#0a0a0a] px-8 pt-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('data')}
            className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'data' ? 'text-zinc-100 border-b-2 border-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Data
          </button>
          <button 
            onClick={() => setActiveTab('annotations')}
            className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'annotations' ? 'text-zinc-100 border-b-2 border-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Annotations
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Main Content Area */}
          {activeTab === 'data' ? (
            <>
              {/* Search */}
              <div className="relative w-full max-w-md mb-8">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Search in example..."
                  className="w-full bg-[#111] border border-[#333] rounded-md pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all"
                />
              </div>

              {/* Detail Layout */}
              <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#222] bg-[#111]">
                      <th className="py-3 px-6 text-xs font-medium text-zinc-500 uppercase tracking-wider w-48">Attribute</th>
                      <th className="py-3 px-6 text-xs font-medium text-zinc-500 uppercase tracking-wider">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    
                    <tr>
                      <td className="py-6 px-6 align-top text-sm font-medium text-zinc-300">
                        ai_answer
                      </td>
                      <td className="py-6 px-6">
                        <div className="bg-[#111] border border-[#333] rounded-lg p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap">
                          {data.ai_answer}
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-6 px-6 align-top text-sm font-medium text-zinc-300">
                        reference_answer
                      </td>
                      <td className="py-6 px-6">
                        <div className="bg-[#111] border border-[#333] rounded-lg p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap">
                          {data.reference_answer}
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-6 px-6 align-top text-sm font-medium text-zinc-300">
                        user_request
                      </td>
                      <td className="py-6 px-6">
                        <div className="bg-[#111] border border-[#333] rounded-lg p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap">
                          {data.user_request}
                        </div>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-8">
              <h2 className="text-lg font-semibold text-zinc-100 mb-6">Review & Tag</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Add Tag</label>
                  <input 
                    type="text"
                    value={currentTagInput}
                    onChange={(e) => setCurrentTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type and press Enter (e.g. hallucination)"
                    className="w-full max-w-md bg-[#111] border border-[#333] rounded-md px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.length === 0 ? (
                    <span className="text-sm text-zinc-600">No tags added yet.</span>
                  ) : (
                    tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {tag}
                        <button 
                          onClick={() => removeTag(tag)}
                          className="text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
