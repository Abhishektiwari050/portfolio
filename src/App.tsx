import { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { LandingPage } from './components/LandingPage';
import { CareerPage } from './components/CareerPage';

export function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [chatActive, setChatActive] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isExploreActivated = currentHash.startsWith('#/explore') || currentHash.startsWith('#explore');

  const handleExitChat = () => {
    setChatActive(false);
  };

  const handleChatFocus = () => {
    setChatActive(true);
  };

  const handleExplore = () => {
    window.location.hash = '#/explore';
  };

  const handleBack = () => {
    window.location.hash = '#/';
    setChatActive(false);
  };

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />
      <CustomCursor />
      
      {/* Aesthetic Liquid Background Blur Overlays */}
      <div className="aurora-container">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
        <div className="aurora-blob aurora-blob--3" />
      </div>
      <div className="grid-overlay" />
      <div className="noise-overlay" />

      {isLoaded && (
        !isExploreActivated ? (
          <LandingPage 
            onExplore={handleExplore}
            chatActive={chatActive}
            setChatActive={setChatActive}
            handleChatFocus={handleChatFocus}
            handleExitChat={handleExitChat}
          />
        ) : (
          <CareerPage 
            onBack={handleBack}
            currentHash={currentHash}
          />
        )
      )}
    </>
  );
}

export default App;
