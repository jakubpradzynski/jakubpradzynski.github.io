import React from 'react';
import { Placeholder } from './components/Placeholder';
import { Background } from './components/Background';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Background />
      <div className="relative z-10 w-full max-w-4xl px-4">
        <Placeholder />
      </div>
    </div>
  );
};

export default App;