import { Terminal, Lock, UploadCloud, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import Papa from 'papaparse';
import { useEval } from '../context/EvalContext';

export function Sidebar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { apiKey, setApiKey, selectedModel, setSelectedModel, setDatasetRows, setActiveTab } = useEval();
  
  return (
    <div className="w-[300px] h-screen shrink-0 bg-[#0a0a0a] border-r border-[#222] flex flex-col p-5">

      {/* Header / Logo */}
      <div 
        className="flex items-center gap-3 mb-10 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setActiveTab('prompt')}
      >
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700 shadow-sm">
          <Terminal size={18} className="text-zinc-300" />
        </div>
        <span className="text-xl font-bold text-zinc-100 tracking-tight">EvalLITE</span>
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
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] rounded-md pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Select Model</label>
              <div className="relative">
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] rounded-md pl-3 pr-9 py-2 text-sm text-zinc-200 appearance-none focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
                >
                  <optgroup label="OpenAI">
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="gpt-4-turbo">gpt-4-turbo</option>
                    <option value="gpt-4">gpt-4</option>
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                  </optgroup>
                  <optgroup label="OpenRouter">
                    <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="google/gemini-pro-1.5">Gemini 1.5 Pro</option>
                    <option value="google/gemini-flash-1.5">Gemini 1.5 Flash</option>
                  </optgroup>
                  <optgroup label="Anthropic">
                    <option value="claude-3-5-sonnet-20240620">claude-3-5-sonnet-20240620</option>
                    <option value="claude-3-opus-20240229">claude-3-opus-20240229</option>
                    <option value="claude-3-sonnet-20240229">claude-3-sonnet-20240229</option>
                    <option value="claude-3-haiku-20240307">claude-3-haiku-20240307</option>
                  </optgroup>
                  <optgroup label="Google">
                    <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                    <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                    <option value="gemini-1.0-pro">gemini-1.0-pro</option>
                  </optgroup>
                  <optgroup label="Meta">
                    <option value="llama-3.1-405b-instruct">llama-3.1-405b-instruct</option>
                    <option value="llama-3.1-70b-instruct">llama-3.1-70b-instruct</option>
                    <option value="llama-3.1-8b-instruct">llama-3.1-8b-instruct</option>
                  </optgroup>
                  <optgroup label="Mistral">
                    <option value="mistral-large-latest">mistral-large-latest</option>
                    <option value="open-mixtral-8x22b">open-mixtral-8x22b</option>
                    <option value="open-mistral-7b">open-mistral-7b</option>
                  </optgroup>
                  <optgroup label="Cohere">
                    <option value="command-r-plus">command-r-plus</option>
                    <option value="command-r">command-r</option>
                  </optgroup>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Dataset Section */}
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Test Data</h2>

          <input 
            type="file"
            accept=".csv,.json"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                Papa.parse(file, {
                  header: true,
                  skipEmptyLines: true,
                  complete: (results) => {
                    const rows = results.data.map((row: any) => ({
                      _id: `eval_${Math.random().toString(36).substr(2, 9)}`,
                      ...row
                    }));
                    setDatasetRows(rows);
                    setActiveTab('dataset');
                  },
                  error: (err) => console.error("Error parsing CSV:", err)
                });
              }
            }}
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-[#444] rounded-lg p-5 flex flex-col items-center justify-center bg-[#111] hover:bg-[#161616] transition-colors cursor-pointer group"
          >
            <UploadCloud size={20} className="text-zinc-500 mb-2 group-hover:text-zinc-300 transition-colors" />
            <p className="text-sm text-zinc-300 font-medium">Upload CSV or JSON</p>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Required columns: <code className="bg-[#222] px-1 py-0.5 rounded text-zinc-300">input</code>, <code className="bg-[#222] px-1 py-0.5 rounded text-zinc-300">expected_output</code>,<code className="bg-[#222] px-1 py-0.5 rounded text-zinc-300">AI_output</code></p>
        </section>

      </div>
    </div>
  );
}
