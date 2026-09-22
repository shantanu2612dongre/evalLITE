import { useState } from 'react';
import { UploadPreviewView } from './UploadPreviewView';
import { MainDashboardView } from './MainDashboardView';
import { SingleExampleView } from './SingleExampleView';

export type DatasetView = 'upload_preview' | 'dashboard' | 'single_detail';

export function DatasetManager() {
  const [currentView, setCurrentView] = useState<DatasetView>('upload_preview');
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(null);

  const handleUploadComplete = () => {
    setCurrentView('dashboard');
  };

  const handleExampleSelect = (id: string) => {
    setSelectedExampleId(id);
    setCurrentView('single_detail');
  };

  const handleBackToDashboard = () => {
    setSelectedExampleId(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#000]">
      {currentView === 'upload_preview' && (
        <UploadPreviewView onConfirm={handleUploadComplete} />
      )}
      {currentView === 'dashboard' && (
        <MainDashboardView onExampleSelect={handleExampleSelect} />
      )}
      {currentView === 'single_detail' && selectedExampleId && (
        <SingleExampleView 
          exampleId={selectedExampleId} 
          onBack={handleBackToDashboard} 
        />
      )}
    </div>
  );
}
