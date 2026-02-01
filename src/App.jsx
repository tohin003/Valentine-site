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

  const handleNoHover = (e) => {
    if (isSuccess) return;

    // Increment hover count to track persistence
    const newCount = hoverCount + 1;
    setHoverCount(newCount);

    // Make teddy sad/scared
    if (newCount > 3) {
      setTeddyState('scared');
    } else {
      setTeddyState('sad');
    }

    // Logic to hide behind Yes button if user is too persistent
    if (newCount > 6 && yesBtnRef.current) {
      moveBehindYes();
      return;
    }

    // Run away logic
    const container = containerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = e.target.getBoundingClientRect();

      // Calculate random position within container bounds
      // Subtract button size to ensure it stays inside
      const maxX = containerRect.width - btnRect.width;
      const maxY = containerRect.height - btnRect.height;

      const randomX = Math.random() * maxX - (containerRect.width / 2) + 50;
      const randomY = Math.random() * maxY - (containerRect.height / 2) + 50;

      setIsNoBtnAbsolute(true);
      setNoBtnPosition({ x: randomX, y: randomY });
    }
  };

  const moveBehindYes = () => {
    // Create effect of hiding behind
    // We rely on z-index control in CSS (handled by checking state if needed, but here simple overlap works)
    // Actually, we'll just set its position to exactly overlap the Yes button
    // But purely visually, it might be better to just disappear or "duck"
    // User request: "hide itself behind the yes button"

    // We'll set coordinates slightly offset to show it's peeking or just fully behind
    setIsNoBtnAbsolute(true);
    setNoBtnPosition({ x: 0, y: 0 }); // Assuming relative to center/group if we change layout, but let's try direct overlap

    // Force update to ensure it moves
    // For better "hiding", let's actually just make it minimize or opacity fade while moving behind?
    // Let's try simple overlap first. 
    // Since the YES button has z-index 10, the NO button (default z-index) will naturally go behind if they overlap.
  };

  const handleYesClick = () => {
    setIsSuccess(true);
    setTeddyState('success');

    // Fireworks
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Open new tab
    setTimeout(() => {
      window.open('about:blank', '_blank').document.write('<h1>I LOVE YOU! ❤️</h1>');
      // Note: Browsers might block this. The in-page message is the backup.
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
                zIndex: 1 // Lower than Yes (10)
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
    </div>
  );
}

export default App;
