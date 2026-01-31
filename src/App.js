import { useState, useEffect } from 'react';
import './App.css';
import familyEventsLogo from './sponsors-logo/family-events.png';
import readFoundationLogo from './sponsors-logo/read-foundation.png';
import impactEventsLogo from './sponsors-logo/impact-events.png';
import maskGroupImage from './Mask group123.png';

function App() {
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, heading-in, video-reveal, content-in

  useEffect(() => {
    // Start heading animation immediately while black background is visible
    setTimeout(() => {
      setAnimationPhase('heading-in');
    }, 300);

    // After heading animation completes (all letters animated ~2.2s), start fading black and move heading to position
    // FINDING: 0.2s to 0.8s (0.6s duration per letter)
    // FORGIVENESS: 1.2s to 2.2s (0.6s duration per letter)
    // Total: ~2.2s + 0.5s pause = 2.7s
    // At the same time, start animating in other components
    setTimeout(() => {
      setAnimationPhase('content-in');
    }, 2700);
  }, []);

  return (
    <div className="hero-section">
      <div className={`black-overlay ${animationPhase === 'video-reveal' || animationPhase === 'content-in' ? 'fade-out' : ''}`}></div>
      
      {/* Image and heading container - heading animates in first, then moves to position with image */}
      <div className={`image-heading-container ${animationPhase === 'heading-in' ? 'center-on-black' : ''} ${animationPhase === 'video-reveal' || animationPhase === 'content-in' ? 'position-final' : ''}`}>
        <img src={maskGroupImage} alt="" className={`heading-image ${animationPhase === 'content-in' ? 'fade-in' : ''}`} />
        <h1 className={`hero-heading ${animationPhase === 'heading-in' ? 'center-on-black' : ''} ${animationPhase === 'video-reveal' || animationPhase === 'content-in' ? 'position-final' : ''}`}>
          <span className="heading-line">
            {['F', 'I', 'N', 'D', 'I', 'N', 'G', ' ', 'F', 'O', 'R', 'G', 'I', 'V', 'E', 'N', 'E', 'S', 'S'].map((char, index) => {
              if (char === ' ') {
                return <span key={`space-${index}`} className="letter-space"> </span>;
              }
              // FINDING letters: 0-6, FORGIVENESS letters: 8-18 (skip index 7 which is space)
              const isFinding = index < 7;
              const forgivenessIndex = index > 7 ? index - 8 : -1;
              const letterClass = isFinding ? `letter-finding-${index}` : `letter-forgiveness-${forgivenessIndex}`;
              return (
                <span key={`letter-${index}`} className={`letter ${letterClass}`}>
                  {char}
                </span>
              );
            })}
          </span>
        </h1>
      </div>
      
      {/* Content container - subheading and button animate in after heading is in position */}
      <div className={`content-container ${animationPhase === 'content-in' ? 'animate-in' : ''}`}>
        <p className={`hero-subheading ${animationPhase === 'content-in' ? 'animate-in' : ''}`}>
          A luxury evening of inspirational knowledge and action,<br /> paired with a delicious iftar in West London.
        </p>
        <button className={`book-now-button ${animationPhase === 'content-in' ? 'animate-in' : ''}`}>Book Now</button>
      </div>
      
      <video 
        className="bg-video" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/148593-794221531.mp4" type="video/mp4" />
      </video>
      <div className={`partner-strip ${animationPhase === 'content-in' ? 'animate-in' : ''}`}>
        <div className="partner-item">
          <p className="partner-label">Event Partner</p>
          <img src={familyEventsLogo} alt="Family Events" className="partner-logo" />
        </div>
        <div className="partner-item">
          <p className="partner-label">Charity Partner</p>
          <img src={readFoundationLogo} alt="Read Foundation" className="partner-logo" />
        </div>
        <div className="partner-item">
          <p className="partner-label">Organised by</p>
          <img src={impactEventsLogo} alt="Impact Events" className="partner-logo" />
        </div>
      </div>
    </div>
  );
}

export default App;
