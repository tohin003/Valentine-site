```
import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Teddy from './components/Teddy';

function App() {
  const [hasEntered, setHasEntered] = useState(false);
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
      setHasEntered(true); // Skip welcome screen if already successful
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
  
  const handleEnter = () => {
      setHasEntered(true);
  };

  const [thoughtMessage, setThoughtMessage] = useState(null);

  const messages = [
    "Don't chase him!",
    "You're scaring him!",
    "Click here instead!",
    "I know you love Tohin...",
    "Just click YES!",
    "Look at his sad face :(",
    "He's hiding from you!",
    "Please say yes..."
  ];

  const handleNoHover = (e) => {
    if (isSuccess) return;

    const newCount = hoverCount + 1;
    setHoverCount(newCount);

    // Make teddy sad/scared
    if (newCount > 3) {
      setTeddyState('scared');
    } else {
      setTeddyState('sad');
    }

    // Show thought message
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setThoughtMessage(randomMsg);

    // Logic to hide behind Yes button if user is too persistent
    if (newCount > 10 && yesBtnRef.current) {
      moveBehindYes();
      return;
    }

    // Run away logic
    const container = containerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = e.target.getBoundingClientRect();
      const btnGroupRect = e.target.parentElement.getBoundingClientRect();

      // Calculate boundaries relative to the button group
      // We want to keep it inside the container (card)
      // The button group is roughly in the middle/bottom of the card

      // Allow moving mostly anywhere in the card, but relative to button group
      // This requires converting card bounds to button-group relative coords

      const minX = -btnGroupRect.left + containerRect.left + 20; // Left edge of card
      const maxX = -btnGroupRect.left + containerRect.right - btnRect.width - 20; // Right edge

      const minY = -btnGroupRect.top + containerRect.top + 20; // Top edge
      const maxY = -btnGroupRect.top + containerRect.bottom - btnRect.height - 20; // Bottom edge

      const randomX = Math.random() * (maxX - minX) + minX;
      const randomY = Math.random() * (maxY - minY) + minY;

      setIsNoBtnAbsolute(true);
      setNoBtnPosition({ x: randomX, y: randomY });
    }
  };

  const moveBehindYes = () => {
    setIsNoBtnAbsolute(true);
    setNoBtnPosition({ x: 50, y: -20 });

    // Trigger special message after 3 seconds if not clicked yet
    setTimeout(() => {
      if (!isSuccess) {
        setThoughtMessage("Emn Fida demu tratri yes tip de");
      }
    }, 3000);
  };

  const handleYesClick = () => {
    setIsSuccess(true);
    setTeddyState('success');
    fireworks();
  };

  const handleYesHover = () => {
    if (!isSuccess) {
      setTeddyState('idle'); // Make teddy happy/idle again
      setThoughtMessage(null); // Clear negative thoughts
    }
  };

  return (
    <div className="bg-pattern_overlay">
      <div className="bg-pattern" />
            <button
              ref={yesBtnRef}
              className="btn btn-yes"
              onClick={handleYesClick}
              onMouseEnter={handleYesHover}
              style={{ position: 'relative' }}
            >
              YES
              {thoughtMessage && (
                <div className="thought-cloud">
                  {thoughtMessage}
                </div>
              )}
            </button>

            <button
              className="btn btn-no"
              onMouseEnter={handleNoHover}
              style={isNoBtnAbsolute ? {
                position: 'absolute',
                transform: `translate(${ noBtnPosition.x }px, ${ noBtnPosition.y }px)`,
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
