import React from 'react';

const Teddy = ({ state }) => {
  let imageSrc = '/assets/teddy-idle.png';
  
  switch (state) {
    case 'sad':
      imageSrc = '/assets/teddy-sad.png';
      break;
    case 'scared': // Hiding state
      imageSrc = '/assets/teddy-hiding.png';
      break;
    case 'success':
      imageSrc = '/assets/teddy-love.png';
      break;
    default: // idle
      imageSrc = '/assets/teddy-idle.png';
      break;
  }

  return (
    <div className="teddy-container floating">
      <img 
        src={imageSrc} 
        alt="Cute Teddy" 
        style={{ 
          height: '300px', 
          objectFit: 'contain',
          transition: 'all 0.5s ease'
        }} 
      />
    </div>
  );
};

export default Teddy;
