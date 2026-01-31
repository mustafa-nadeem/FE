import { useState, useEffect, useRef } from 'react';
import './App.css';
import familyEventsLogo from './sponsors-logo/family-events.png';
import readFoundationLogo from './sponsors-logo/read-foundation.png';
import impactEventsLogo from './sponsors-logo/impact-events.png';
import maskGroupImage from './Mask group123.png';

const VENUE_IMAGE_GAP = 28;
const VENUE_IMAGE_HEIGHT = 336;

function App() {
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, heading-in, video-reveal, content-in

  // ——— Countdown state ———
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [countdownActive, setCountdownActive] = useState(false);
  const countdownRef = useRef(null);

  const [venueProgress, setVenueProgress] = useState(0);
  const venueRef = useRef(null);

  // Hero animation effect
  useEffect(() => {
    setTimeout(() => {
      setAnimationPhase('heading-in');
    }, 300);

    setTimeout(() => {
      setAnimationPhase('content-in');
    }, 2700);
  }, []);

  // ——— Countdown timer effect ———
  useEffect(() => {
    const targetDate = new Date(2026, 2, 1, 14, 0, 0); // March 1, 2026 at 2:00 PM

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    setCountdown(calculateTimeLeft());

    const interval = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setCountdown(timeLeft);

      // Stop interval if countdown reached zero
      if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ——— IntersectionObserver for countdown scroll animation ———
  useEffect(() => {
    const section = countdownRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCountdownActive(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // ——— Scroll-based venue animation ———
  useEffect(() => {
    const handleScroll = () => {
      const section = venueRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      const entryThreshold = windowHeight * 0.35;
      const scrollRangeToComplete = 0.75 * (entryThreshold + sectionHeight);
      const rawProgress = rect.top > entryThreshold
        ? 0
        : Math.max(0, Math.min(1, (entryThreshold - rect.top) / scrollRangeToComplete));

      const progress = rawProgress < 0.05 ? 0 : (rawProgress - 0.05) / 0.95;

      setVenueProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pad = (num) => String(num).padStart(2, '0');

  const venueImageStep = VENUE_IMAGE_HEIGHT + VENUE_IMAGE_GAP;

  const venueStackY = venueProgress === 0
    ? 320
    : venueProgress < 0.347
      ? 320 * (1 - venueProgress / 0.347)
      : venueProgress < 0.695
        ? 0 - ((venueProgress - 0.347) / 0.348) * 500
        : -500 - ((venueProgress - 0.695) / 0.305) * (2 * venueImageStep - 500);

  return (
    <main className="app">
      {/* ——— Hero ——— */}
      <section className="hero-section" id="hero">
        <div className={`black-overlay ${animationPhase === 'video-reveal' || animationPhase === 'content-in' ? 'fade-out' : ''}`}></div>
        
        <div className={`image-heading-container ${animationPhase === 'heading-in' ? 'center-on-black' : ''} ${animationPhase === 'video-reveal' || animationPhase === 'content-in' ? 'position-final' : ''}`}>
          <img src={maskGroupImage} alt="" className={`heading-image ${animationPhase === 'content-in' ? 'fade-in' : ''}`} />
          <h1 className={`hero-heading ${animationPhase === 'heading-in' ? 'center-on-black' : ''} ${animationPhase === 'video-reveal' || animationPhase === 'content-in' ? 'position-final' : ''}`}>
            <span className="heading-line">
              {['F', 'I', 'N', 'D', 'I', 'N', 'G', ' ', 'F', 'O', 'R', 'G', 'I', 'V', 'E', 'N', 'E', 'S', 'S'].map((char, index) => {
                if (char === ' ') {
                  return <span key={`space-${index}`} className="letter-space"> </span>;
                }
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
        
        <div className={`content-container ${animationPhase === 'content-in' ? 'animate-in' : ''}`}>
          <p className={`hero-subheading ${animationPhase === 'content-in' ? 'animate-in' : ''}`}>
            A luxury evening of inspirational knowledge and action,<br /> paired with a delicious iftar in West London.
          </p>
          <button className={`book-now-button ${animationPhase === 'content-in' ? 'animate-in' : ''}`}>Book Now</button>
        </div>
        
        <video className="bg-video" autoPlay loop muted playsInline>
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
      </section>

      {/* ——— Countdown ——— */}
      <section
        className={`section section--black section--countdown ${countdownActive ? 'is-active' : ''}`}
        id="countdown"
        ref={countdownRef}
      >
        <div className="section-inner">
          <div
            className="countdown"
            aria-label={`Countdown: ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}
          >
            <div className="countdown-unit countdown-unit--days">
              <span className="countdown-number">{pad(countdown.days)}</span>
              <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-unit countdown-unit--hours">
              <span className="countdown-number">{pad(countdown.hours)}</span>
              <span className="countdown-label">Hours</span>
            </div>
            <div className="countdown-unit countdown-unit--minutes">
              <span className="countdown-number">{pad(countdown.minutes)}</span>
              <span className="countdown-label">Minutes</span>
            </div>
            <div className="countdown-unit countdown-unit--seconds">
              <span className="countdown-number">{pad(countdown.seconds)}</span>
              <span className="countdown-label">Seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Venue ——— */}
      <section className="venue-section" id="venue" ref={venueRef}>
        <div className="venue-sticky">
          <div className="venue-container">
            <div className="venue-images">
              <img
                src="/royalnawaab/food1.jpg"
                alt="Royal Nawaab cuisine"
                className="venue-image"
                style={{
                  transform: `translateY(${venueStackY}px) scale(${
                    venueProgress === 0
                      ? 0.5915
                      : venueProgress < 0.347
                        ? 0.5915 + (venueProgress / 0.347) * 0.4085
                        : 1
                  })`,
                  opacity: 1,
                  zIndex: 3
                }}
              />
              <img
                src="/royalnawaab/food2.jpg"
                alt="Royal Nawaab dishes"
                className="venue-image"
                style={{
                  transform: `translateY(${venueStackY + venueImageStep}px) scale(${
                    venueProgress < 0.1
                      ? 0.845
                      : venueProgress < 0.347
                        ? 0.845
                        : venueProgress < 0.695
                          ? 0.845 + ((venueProgress - 0.347) / 0.348) * 0.155
                          : 1
                  })`,
                  opacity: venueProgress < 0.1 ? 0 : 1,
                  zIndex: 2
                }}
              />
              <img
                src="/royalnawaab/inside.jpg"
                alt="Royal Nawaab interior"
                className="venue-image"
                style={{
                  transform: `translateY(${venueStackY + 2 * venueImageStep}px) scale(${
                    venueProgress < 0.45
                      ? 0.845
                      : venueProgress < 0.695
                        ? 0.845
                        : 0.845 + ((venueProgress - 0.695) / 0.305) * 0.155
                  })`,
                  opacity: venueProgress < 0.45 ? 0 : 1,
                  zIndex: 1
                }}
              />
            </div>
            <div className="venue-text">
              <p className="venue-paragraph">
                <span className="venue-text-fill" style={{ '--fill-progress': `${venueProgress <= 0 ? 0 : Math.min(100, (venueProgress / 0.347) * 100)}%` }}>
                  Enjoy a memorable Iftar experience catered by Royal Nawaab, featuring a carefully curated three-course buffet with authentic flavors and premium ingredients.
                </span>
              </p>
              <p className="venue-paragraph">
                <span className="venue-text-fill" style={{ '--fill-progress': `${venueProgress < 0.347 ? 0 : Math.min(100, ((venueProgress - 0.347) / 0.348) * 100)}%` }}>
                  From classic starters to satisfying mains and sweet desserts, this elegant spread is perfect for sharing and celebrating together.
                </span>
              </p>
              <p className="venue-paragraph">
                <span className="venue-text-fill" style={{ '--fill-progress': `${venueProgress < 0.695 ? 0 : Math.min(100, ((venueProgress - 0.695) / 0.305) * 100)}%` }}>
                  Royal Nawaab Prevail
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Topic ——— */}
      <section className="section section--black" id="topic">
        <div className="section-inner">
          <h2 className="section-title">Topic</h2>
          <p className="section-placeholder">Topic content coming soon.</p>
        </div>
      </section>

      {/* ——— Speakers ——— */}
      <section className="section section--black" id="speakers">
        <div className="section-inner">
          <h2 className="section-title">Speakers</h2>
          <p className="section-placeholder">Speakers content coming soon.</p>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="section section--black" id="faq">
        <div className="section-inner">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-placeholder">FAQ content coming soon.</p>
        </div>
      </section>
    </main>
  );
}

export default App;
