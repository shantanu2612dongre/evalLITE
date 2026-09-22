import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { DatasetManager } from './components/dataset/DatasetManager'

function App() {
  const [activeTab, setActiveTab] = useState<'prompt' | 'dataset'>('prompt');

  return (
    <div className="flex w-full h-screen bg-black overflow-hidden selection:bg-[#c3ff9b]/30">
      <Sidebar onTabChange={setActiveTab} />
      {activeTab === 'prompt' ? <MainContent /> : <DatasetManager />}
    </div>
  )
}

export default App
