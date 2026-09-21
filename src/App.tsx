import React from 'react'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'

function App() {
  return (
    <div className="flex w-full h-screen bg-black overflow-hidden selection:bg-[#c3ff9b]/30">
      <Sidebar />
      <MainContent />
    </div>
  )
}

export default App
