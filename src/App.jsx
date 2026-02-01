import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Teddy from './components/Teddy';

function App() {
  const [teddyState, setTeddyState] = useState('idle');
  const [isSuccess, setIsSuccess] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [isNoBtnAbsolute, setIsNoBtnAbsolute] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);

  const containerRef = useRef(null);
  const yesBtnRef = useRef(null);

  // Check for success query param (for the new tab)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      handleSuccessState();
    }
  }, []);

  const handleSuccessState = () => {
    setIsSuccess(true);
    setTeddyState('success');
    fireworks();
  };

  const fireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleNoHover = (e) => {
    if (isSuccess) return;

    const newCount = hoverCount + 1;
    setHoverCount(newCount);

    if (newCount > 3) {
      setTeddyState('scared');
    } else {
      setTeddyState('sad');
    }

    if (newCount > 6 && yesBtnRef.current) {
      moveBehindYes();
      return;
    }

    const container = containerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = e.target.getBoundingClientRect();
      const maxX = containerRect.width - btnRect.width;
      const maxY = containerRect.height - btnRect.height;
      const randomX = Math.random() * maxX - (containerRect.width / 2) + 50;
      const randomY = Math.random() * maxY - (containerRect.height / 2) + 50;

      setIsNoBtnAbsolute(true);
      setNoBtnPosition({ x: randomX, y: randomY });
    }
  };

  const moveBehindYes = () => {
    setIsNoBtnAbsolute(true);
    // Offset slightly so it looks like it's peeking/hiding behind
    // Assuming buttons are relative to the group container. 
    // We'll tuck it just slightly to the right and back.
    setNoBtnPosition({ x: 20, y: 10 });
  };

  const handleYesClick = () => {
    handleSuccessState();

    // Open new tab with the same site but with success param
    // This ensures it has the full design
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('success', 'true');
      window.open(url.toString(), '_blank');
    }, 1000);
  };

  const resetTeddy = () => {
    if (!isSuccess && teddyState !== 'idle') {
      // Optional: Reset to idle after delay? 
      // For now, let's keep it responsive.
      // setTeddyState('idle'); 
    }
  };

  return (
    <div className="bg-pattern_overlay">
      <div className="bg-pattern" />

      {!isSuccess ? (
        <div
          className="container"
          ref={containerRef}
          onMouseLeave={() => !isSuccess && setTeddyState('idle')}
        >
          <Teddy state={teddyState} />

          <h1>Will you be my Valentine?</h1>

          <div className="button-group">
            <button
              ref={yesBtnRef}
              className="btn btn-yes"
              onClick={handleYesClick}
            >
              YES
            </button>

            <button
              className="btn btn-no"
              onMouseEnter={handleNoHover}
              style={isNoBtnAbsolute ? {
                position: 'absolute',
                transform: `translate(${noBtnPosition.x}px, ${noBtnPosition.y}px)`,
                zIndex: 1
              } : {}}
            >
              NO
            </button>
          </div>
        </div>
      ) : (
        <div className="container success-message">
          <Teddy state="success" />
          <h1>YAYYY! 🎉</h1>
          <p className="love-text">I knew you would accept my proposal!</p>
          <h2 style={{ color: '#ff5c8d', fontSize: '3rem', marginTop: '1rem' }}>I LOVE YOU! ❤️</h2>
        </div>
      )}

      <footer className="site-footer">
        © 2026 made with love and by Tohin the love of your life
      </footer>
    </div>
  );
}

export default App;
