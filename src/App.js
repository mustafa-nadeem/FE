import { useState, useEffect, useRef } from "react";
import "./App.css";
import familyEventsLogo from "./sponsors-logo/family-events.png";
import readFoundationLogo from "./sponsors-logo/read-foundation.png";
import impactEventsLogo from "./sponsors-logo/impact-events.png";
import maskGroupImage from "./Mask group123.png";
import charityDinnerLogo2 from "./Charitry-Dinner-logo2.svg";
import asimKhanImage from "./speakers/Asim Khan 1.jpg";
import shaqurRehmanImage from "./speakers/Shaqur Rehman 2 (1).png";
import umerSulemanImage from "./speakers/Umer Suleman 1 (1).jpeg";

const VENUE_IMAGE_GAP = 28;
const VENUE_IMAGE_HEIGHT = 336;

function App() {
  const [animationPhase, setAnimationPhase] = useState("initial"); // initial, heading-in, bg-fade, heading-shrink, content-in

  // ——— Countdown state ———
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [countdownActive, setCountdownActive] = useState(false);
  const countdownRef = useRef(null);

  const [venueProgress, setVenueProgress] = useState(0);
  const venueRef = useRef(null);
  const heroRef = useRef(null);
  const [logoVisible, setLogoVisible] = useState(true);
  const [scrollUnlocked, setScrollUnlocked] = useState(false);
  const [topicActive, setTopicActive] = useState(false);
  const topicRef = useRef(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // ——— Always start from top on page load ———
  useEffect(() => {
    // Prevent browser from restoring scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Also scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // ——— Scroll lock during hero animation ———
  useEffect(() => {
    if (!scrollUnlocked) {
      // Lock scroll
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Unlock scroll when animation completes
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [scrollUnlocked]);

  // Hero animation effect
  useEffect(() => {
    // Phase 1: Start heading animation immediately while black background is visible
    setTimeout(() => {
      setAnimationPhase("heading-in");
    }, 300);

    // Phase 2: After heading animation completes (~2.2s) + hold, shrink the heading
    // Letters finish at 2.2s, hold for ~0.8s, then start shrinking
    setTimeout(() => {
      setAnimationPhase("heading-shrink");
    }, 3300);

    // Phase 3: 0.2s after heading starts shrinking, fade the black background
    setTimeout(() => {
      setAnimationPhase("bg-fade");
    }, 3500);

    // Phase 4: After heading shrinks and bg fades (approx 1.5s), bring in other content
    setTimeout(() => {
      setAnimationPhase("content-in");
    }, 5000);

    // Phase 5: Unlock scroll after navbar and content animations complete
    // Navbar animation: 0.6s delay + 0.8s duration = 1.4s after content-in
    setTimeout(() => {
      setScrollUnlocked(true);
    }, 6400); // 5000ms (content-in) + 600ms (delay) + 800ms (duration)
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

  // ——— IntersectionObserver for topic scroll animation ———
  useEffect(() => {
    const section = topicRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setTopicActive(entry.isIntersecting);
      },
      { threshold: 0.2 }
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ——— Scroll detection for logo visibility ———
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = heroRef.current;
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Hide logo when hero section is completely scrolled past
      if (rect.bottom < windowHeight * 0.5) {
        setLogoVisible(false);
      } else {
        setLogoVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to pad numbers
  const pad = (num) => String(num).padStart(2, "0");

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
      <div className="hero-section" ref={heroRef}>
      <div
        className={`black-overlay ${animationPhase === "bg-fade" || animationPhase === "content-in" ? "fade-out" : ""}`}
      ></div>

      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/148593-794221531.mp4" type="video/mp4" />
      </video>

      {/* 30% black overlay below gradient */}
      <div className="black-overlay-30"></div>

      {/* Logo - positioned to the left of navbar */}
      <div
        className={`navbar-logo-container ${animationPhase === "content-in" ? "animate-in" : ""} ${!logoVisible ? "fade-out" : ""}`}
      >
        <img
          src={charityDinnerLogo2}
          alt="Charity Dinner"
          className="navbar-logo"
        />
      </div>

      {/* Navbar */}
      <nav
        className={`navbar ${animationPhase === "content-in" ? "animate-in" : ""}`}
      >
        <div className="navbar-links">
          <a href="#venue" className="navbar-link">
            Venue
          </a>
          <a href="#topic" className="navbar-link">
            Topic
          </a>
          <a href="#speakers" className="navbar-link">
            Speakers
          </a>
          <a href="#faq" className="navbar-link">
            FAQ
          </a>
        </div>
        <button className="book-now-button">Book Now</button>
      </nav>

      {/* Heading wrapper - heading exactly centered, image above, content below */}
      <div className="hero-heading-wrapper">
        {/* Image - animates in above the heading */}
        <img
          src={maskGroupImage}
          alt=""
          className={`heading-image ${animationPhase === "content-in" ? "fade-in" : ""}`}
        />

        {/* Heading - always centered */}
        <h1
          className={`hero-heading ${animationPhase === "heading-in" || animationPhase === "heading-shrink" || animationPhase === "bg-fade" || animationPhase === "content-in" ? "center-on-black" : ""} ${animationPhase === "heading-shrink" || animationPhase === "bg-fade" || animationPhase === "content-in" ? "shrink" : ""}`}
        >
          <span className="heading-line">
            {[
              "F",
              "I",
              "N",
              "D",
              "I",
              "N",
              "G",
              " ",
              "F",
              "O",
              "R",
              "G",
              "I",
              "V",
              "E",
              "N",
              "E",
              "S",
              "S",
            ].map((char, index) => {
              if (char === " ") {
                return (
                  <span key={`space-${index}`} className="letter-space">
                    {" "}
                  </span>
                );
              }
              const isFinding = index < 7;
              const forgivenessIndex = index > 7 ? index - 8 : -1;
              const letterClass = isFinding
                ? `letter-finding-${index}`
                : `letter-forgiveness-${forgivenessIndex}`;
              return (
                <span
                  key={`letter-${index}`}
                  className={`letter ${letterClass}`}
                >
                  {char}
                </span>
              );
            })}
          </span>
        </h1>

        {/* Subheading and button - animate in below heading */}
        <div
          className={`content-below ${animationPhase === "content-in" ? "animate-in" : ""}`}
        >
          <p className="hero-subheading">
            A luxury evening of inspirational knowledge and action,
            <br /> paired with a delicious iftar in West London.
          </p>
          <button className="book-now-button">Book Now</button>
        </div>
      </div>

      {/* Partner strip - always at bottom */}
      <div
        className={`partner-strip ${animationPhase === "content-in" ? "animate-in" : ""}`}
      >
        <div className="partner-item">
          <p className="partner-label">Event Partner</p>
          <img
            src={familyEventsLogo}
            alt="Family Events"
            className="partner-logo"
          />
        </div>
        <div className="partner-item">
          <p className="partner-label">Charity Partner</p>
          <img
            src={readFoundationLogo}
            alt="Read Foundation"
            className="partner-logo"
          />
        </div>
        <div className="partner-item">
          <p className="partner-label">Organised by</p>
          <img
            src={impactEventsLogo}
            alt="Impact Events"
            className="partner-logo"
          />
        </div>
      </div>
      </div>

      {/* ——— Countdown ——— */}
      <section
        className={`section section--black section--countdown ${countdownActive ? "is-active" : ""}`}
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
                <span className="venue-text-fill" style={{ "--fill-progress": `${venueProgress <= 0 ? 0 : Math.min(100, (venueProgress / 0.347) * 100)}%` }}>
                  Enjoy a memorable Iftar experience catered by Royal Nawaab, featuring a carefully curated three-course buffet with authentic flavors and premium ingredients.
                </span>
              </p>
              <p className="venue-paragraph">
                <span className="venue-text-fill" style={{ "--fill-progress": `${venueProgress < 0.347 ? 0 : Math.min(100, ((venueProgress - 0.347) / 0.348) * 100)}%` }}>
                  From classic starters to satisfying mains and sweet desserts, this elegant spread is perfect for sharing and celebrating together.
                </span>
              </p>
              <p className="venue-paragraph">
                <span className="venue-text-fill" style={{ "--fill-progress": `${venueProgress < 0.695 ? 0 : Math.min(100, ((venueProgress - 0.695) / 0.305) * 100)}%` }}>
                  Royal Nawaab Prevail
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Topic ——— */}
      <section className={`section section--black topic-section ${topicActive ? "is-active" : ""}`} id="topic" ref={topicRef}>
        <div className="topic-container">
          <div className="topic-content">
            <h2 className="topic-heading">In the Blessed Month of Ramadan,</h2>
            <p className="topic-subheading">How Can We Attain Allah's Mercy and Have Our Sins Completely Forgiven?</p>
            <p className="topic-description">
              How can we secure the immense reward of Laylatul Qadr? How do we become among those whom Allah loves?
            </p>
            <ul className="topic-features">
              <li className="topic-feature">
                <span className="topic-feature-icon">🕌</span>
                <span>Learn the profound teachings of forgiveness in Islamic tradition and their transformative power in our lives.</span>
              </li>
              <li className="topic-feature">
                <span className="topic-feature-icon">✨</span>
                <span>Learn how to secure the immense reward of Laylatul Qadr and become among those whom Allah loves.</span>
              </li>
              <li className="topic-feature">
                <span className="topic-feature-icon">🌙</span>
                <span>Reflect deeply on your actions, seek sincere repentance, and understand the path to spiritual purification.</span>
              </li>
              <li className="topic-feature">
                <span className="topic-feature-icon">🤲</span>
                <span>Be Forgiven through Allah's infinite mercy and grace, and experience the peace that comes with true forgiveness.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ——— Speakers ——— */}
      <section className="section section--black speakers-section" id="speakers">
        <div className="speakers-container">
          <h2 className="section-title speakers-title">Speakers</h2>
          <div className="speakers-grid">
            <div className="speaker-card">
              <img 
                src={asimKhanImage} 
                alt="Asim Khan" 
                className="speaker-image"
              />
              <div className="speaker-info">
                <h3 className="speaker-name">Asim Khan</h3>
                <p className="speaker-title">Speaker Title</p>
              </div>
            </div>
            <div className="speaker-card">
              <img 
                src={shaqurRehmanImage} 
                alt="Shaqur Rehman" 
                className="speaker-image"
              />
              <div className="speaker-info">
                <h3 className="speaker-name">Shaqur Rehman</h3>
                <p className="speaker-title">Speaker Title</p>
              </div>
            </div>
            <div className="speaker-card">
              <img 
                src={umerSulemanImage} 
                alt="Umer Suleman" 
                className="speaker-image"
              />
              <div className="speaker-info">
                <h3 className="speaker-name">Umer Suleman</h3>
                <p className="speaker-title">Speaker Title</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="section section--black faq-section" id="faq">
        <div className="faq-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item" onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}>
              <div className="faq-question">
                <span>What is the date and time of the charity dinner?</span>
                <span className="faq-icon">{openFaqIndex === 0 ? "−" : "+"}</span>
              </div>
              <div className={`faq-answer ${openFaqIndex === 0 ? "is-open" : ""}`}>
                <p>Placeholder answer for question 1. This is where the detailed answer will be displayed when the question is expanded.</p>
              </div>
            </div>

            <div className="faq-item" onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}>
              <div className="faq-question">
                <span>Where will the event take place?</span>
                <span className="faq-icon">{openFaqIndex === 1 ? "−" : "+"}</span>
              </div>
              <div className={`faq-answer ${openFaqIndex === 1 ? "is-open" : ""}`}>
                <p>Placeholder answer for question 2. This is where the detailed answer will be displayed when the question is expanded.</p>
              </div>
            </div>

            <div className="faq-item" onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}>
              <div className="faq-question">
                <span>What is included in the ticket price?</span>
                <span className="faq-icon">{openFaqIndex === 2 ? "−" : "+"}</span>
              </div>
              <div className={`faq-answer ${openFaqIndex === 2 ? "is-open" : ""}`}>
                <p>Placeholder answer for question 3. This is where the detailed answer will be displayed when the question is expanded.</p>
              </div>
            </div>

            <div className="faq-item" onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}>
              <div className="faq-question">
                <span>Is there parking available at the venue?</span>
                <span className="faq-icon">{openFaqIndex === 3 ? "−" : "+"}</span>
              </div>
              <div className={`faq-answer ${openFaqIndex === 3 ? "is-open" : ""}`}>
                <p>Placeholder answer for question 4. This is where the detailed answer will be displayed when the question is expanded.</p>
              </div>
            </div>

            <div className="faq-item" onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}>
              <div className="faq-question">
                <span>Can I purchase tickets at the door?</span>
                <span className="faq-icon">{openFaqIndex === 4 ? "−" : "+"}</span>
              </div>
              <div className={`faq-answer ${openFaqIndex === 4 ? "is-open" : ""}`}>
                <p>Placeholder answer for question 5. This is where the detailed answer will be displayed when the question is expanded.</p>
              </div>
            </div>

            <div className="faq-item" onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}>
              <div className="faq-question">
                <span>What should I wear to the event?</span>
                <span className="faq-icon">{openFaqIndex === 5 ? "−" : "+"}</span>
              </div>
              <div className={`faq-answer ${openFaqIndex === 5 ? "is-open" : ""}`}>
                <p>Placeholder answer for question 6. This is where the detailed answer will be displayed when the question is expanded.</p>
              </div>
            </div>

            <div className="faq-item" onClick={() => setOpenFaqIndex(openFaqIndex === 6 ? null : 6)}>
              <div className="faq-question">
                <span>Will there be vegetarian or special dietary options available?</span>
                <span className="faq-icon">{openFaqIndex === 6 ? "−" : "+"}</span>
              </div>
              <div className={`faq-answer ${openFaqIndex === 6 ? "is-open" : ""}`}>
                <p>Placeholder answer for question 7. This is where the detailed answer will be displayed when the question is expanded.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
