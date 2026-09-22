import { EvalProvider, useEval } from './context/EvalContext'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { DatasetManager } from './components/dataset/DatasetManager'

function AppInner() {
  const { activeTab } = useEval();
  return (
    <div className="flex w-full h-screen bg-black overflow-hidden selection:bg-[#c3ff9b]/30">
      <Sidebar />
      {activeTab === 'prompt' ? <MainContent /> : <DatasetManager />}
    </div>
  )
}

function App() {
  return (
    <EvalProvider>
      <AppInner />
    </EvalProvider>
  )
}

export default App
