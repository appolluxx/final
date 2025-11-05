import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Simulator } from './components/Simulator';

type View = 'landing' | 'simulator';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');

  const startSimulator = () => {
    setView('simulator');
  };

  const backToHome = () => {
    setView('landing');
  };

  return (
    <>
      {view === 'landing' && <LandingPage onStart={startSimulator} />}
      {view === 'simulator' && <Simulator onBackToHome={backToHome} />}
    </>
  );
};

export default App;