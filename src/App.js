import { useState, useEffect, useRef } from "react";
import "./App.css";
import familyEventsLogo from "./sponsors-logo/family-events.png";
import readFoundationLogo from "./sponsors-logo/muslim-in-need.png";
import impactEventsLogo from "./sponsors-logo/impact-events.png";
import maskGroupImage from "./Mask group123.png";
import charityDinnerLogo2 from "./Charitry-Dinner-logo2.svg";
import asimKhanImage from "./speakers/Asim Khan 1.jpg";
import shaqurRehmanImage from "./speakers/Shaqur Rehman 2 (1).png";
import umerSulemanImage from "./speakers/Umer Suleman 1 (1).jpeg";
import gazaEmergencyImage from "./mincharity-gaza-emergency2-scaled.webp";

const VENUE_IMAGE_GAP = 24;
const VENUE_IMAGE_SIZE = 568;
const VENUE_IMAGE_STEP = VENUE_IMAGE_SIZE + VENUE_IMAGE_GAP; // 592px
const VENUE_IMAGE_SIZE_MOBILE = 333;
const VENUE_IMAGE_STEP_MOBILE = VENUE_IMAGE_SIZE_MOBILE + VENUE_IMAGE_GAP; // 357px

function App() {
  const [animationPhase, setAnimationPhase] = useState("initial"); // initial, heading-in, bg-fade, heading-shrink, content-in

  // ——— Countdown state ———
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [countdownActive, setCountdownActive] = useState(false);
  const countdownRef = useRef(null);

  const [venueProgress, setVenueProgress] = useState(0);
  const maxVenueProgressRef = useRef(0); // Track max progress for navbar navigation
  const venueRef = useRef(null);
  const heroRef = useRef(null);
  const [logoVisible, setLogoVisible] = useState(true);
  const [scrollUnlocked, setScrollUnlocked] = useState(false);
  const [topicActive, setTopicActive] = useState(false);
  const topicRef = useRef(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const speakersRef = useRef(null);
  const faqRef = useRef(null);
  const [activeNavLink, setActiveNavLink] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState(null);

  // ——— Always start from top on page load ———
  useEffect(() => {
    // Prevent browser from restoring scroll position
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
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
      if (
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0
      ) {
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
      { threshold: 0.3 },
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
      { threshold: 0.2 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // ——— Mobile detection ———
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  // ——— Venue nav click handler ———
  const handleVenueNavClick = (e) => {
    e.preventDefault();
    const section = venueRef.current;
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ——— Section nav click handlers - scroll to start of section ———
  const handleSectionNavClick = (e, sectionRef) => {
    e.preventDefault();
    const section = sectionRef.current;
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
        setIsInHero(false);
      } else {
        setLogoVisible(true);
        setIsInHero(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ——— Scroll detection for active navbar link ———
  useEffect(() => {
    const handleNavScroll = () => {
      const sections = [
        { id: "venue", ref: venueRef },
        { id: "topic", ref: topicRef },
        { id: "speakers", ref: speakersRef },
        { id: "faq", ref: faqRef },
      ];

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const viewportCenter = scrollY + windowHeight / 2;

      // Check countdown section first to exclude it
      const countdownSection = countdownRef.current;
      let isInCountdown = false;
      if (countdownSection) {
        const countdownRect = countdownSection.getBoundingClientRect();
        const countdownTop = countdownRect.top + scrollY;
        const countdownBottom = countdownTop + countdownRect.height;
        
        if (viewportCenter >= countdownTop && viewportCenter < countdownBottom) {
          isInCountdown = true;
        }
      }

      // Only check nav sections if not in countdown
      if (!isInCountdown) {
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section.ref.current) {
            const rect = section.ref.current.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionBottom = sectionTop + rect.height;

            // More precise check: section must be significantly in view
            if (viewportCenter >= sectionTop + 100 && viewportCenter < sectionBottom - 100) {
              setActiveNavLink(section.id);
              return;
            }
          }
        }
      }

      // If no section is active, check if we're in hero or countdown
      if (scrollY < windowHeight * 0.5 || isInCountdown) {
        setActiveNavLink("");
      }
    };

    window.addEventListener("scroll", handleNavScroll, { passive: true });
    handleNavScroll();

    return () => window.removeEventListener("scroll", handleNavScroll);
  }, []);

  // Helper to pad numbers
  const pad = (num) => String(num).padStart(2, "0");

  // Venue animation - images scroll through viewport as a group
  // All images stay stacked together with 24px gaps
  // Each image scales up during its phase while the whole stack scrolls up
  // When animation completes, third image is centered vertically
  const getImageTransformY = (imageIndex) => {
    // Base position that moves the entire stack up as we scroll
    // Start: first image enters from below viewport (baseY = 400)
    // End: third image centered vertically (baseY = -1184, so third image at baseY + 1184 = 0)
    const startBaseY = 400; // Start position - first image enters from below
    // End position: third image (index 2) should be at 0 (centered) when venueProgress = 1.0
    // Third image position = baseY + (2 * 592) = baseY + 1184
    // For it to be at 0: baseY = -1184
    const endBaseY = -(2 * VENUE_IMAGE_STEP); // -1184, so third image ends at 0 (centered)
    const totalScrollDistance = startBaseY - endBaseY; // Total distance to scroll
    
    // Base Y position moves linearly from start to end
    const baseY = startBaseY - (venueProgress * totalScrollDistance);
    
    // Each image's position is relative to baseY, maintaining 24px gap
    // Image 0: baseY + 0
    // Image 1: baseY + 592 (568 + 24)
    // Image 2: baseY + 1184 (2 * 592) - ends at 0 when venueProgress = 1.0
    const imageOffset = imageIndex * VENUE_IMAGE_STEP;
    
    return baseY + imageOffset;
  };

  // Horizontal transform for mobile - images scroll left to right, no scaling
  const getImageTransformX = (imageIndex) => {
    // Base position that moves the entire stack left to right as we scroll
    // Image 0 (first) enters from left, then Image 1 follows to its LEFT, then Image 2 follows to the LEFT of Image 1
    // Final arrangement from left to right: Image 2, Image 1, Image 0
    // Start: first image (Image 0) starts completely off-screen left (no visible bit)
    // End: leftmost image (Image 2) aligns with the text left edge
    const startBaseX = -(VENUE_IMAGE_SIZE_MOBILE + 50); // Start: first image completely off-screen left (-383px)
    
    // Calculate end position: leftmost image (Image 2) should align with text
    // Image 2 position = baseX - 714
    // For Image 2 to align with text left edge (position 0): baseX - 714 = 0, so baseX = 714
    const endBaseX = 2 * VENUE_IMAGE_STEP_MOBILE; // 714px - so Image 2 ends at position 0 (aligned with text)
    
    // Scroll distance: move baseX from start to end
    const scrollDistance = endBaseX - startBaseX; // 714 - (-383) = 1097px
    
    // Base X position moves linearly from start to end
    const baseX = startBaseX + (venueProgress * scrollDistance);
    
    // Each image's position is relative to baseX, maintaining 24px gap
    // Image 0: baseX + 0 (enters first from left, rightmost in final arrangement)
    // Image 1: baseX - 357 (positioned to the LEFT of image 0)
    // Image 2: baseX - 714 (positioned to the LEFT of image 1, ends at 0 to align with text)
    // Images follow from the LEFT side of the first image
    const imageOffset = -imageIndex * VENUE_IMAGE_STEP_MOBILE; // Negative offset to position to the left
    
    return baseX + imageOffset;
  };

  // Get scale for each image - starts small and grows to full size during its phase (desktop only)
  const getImageScale = (imageIndex) => {
    // On mobile, no scaling - always return 1.0
    if (isMobile) {
      return 1.0;
    }
    
    const phaseStart = imageIndex * 0.33;
    const phaseEnd = phaseStart + 0.33;
    const minScale = 0.3; // Start at 30% size
    const maxScale = 1.0; // End at 100% size (568x568)
    
    if (venueProgress < phaseStart) {
      return minScale; // Still small, not yet animating
    } else if (venueProgress < phaseEnd) {
      // Scale from minScale to maxScale during the phase
      const phaseProgress = (venueProgress - phaseStart) / 0.33;
      // Use ease-out curve for smoother animation
      const easedProgress = 1 - Math.pow(1 - phaseProgress, 3);
      return minScale + (maxScale - minScale) * easedProgress;
    } else {
      return maxScale; // At full size
    }
  };

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

        {/* Logo - positioned to the left of navbar, only visible in hero */}
        <div
          className={`navbar-logo-container ${animationPhase === "content-in" ? "animate-in" : ""} ${!logoVisible ? "fade-out" : ""} ${!isInHero ? "hidden-mobile" : ""}`}
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
          {/* Desktop Navigation */}
          <div className="navbar-links">
            <a href="#venue" className={`navbar-link ${activeNavLink === "venue" ? "active" : ""}`} onClick={handleVenueNavClick}>
              Venue
            </a>
            <a href="#topic" className={`navbar-link ${activeNavLink === "topic" ? "active" : ""}`}>
              Topic
            </a>
            <a href="#speakers" className={`navbar-link ${activeNavLink === "speakers" ? "active" : ""}`}>
              Speakers
            </a>
            <a href="#faq" className={`navbar-link ${activeNavLink === "faq" ? "active" : ""}`}>
              FAQ
            </a>
          </div>
          <a href="https://www.tickettailor.com/events/familyevents2/2052743" target="_blank" rel="noopener noreferrer" className="book-now-button">Book Now</a>

        </nav>

        {/* Mobile Sticky Book Now Button - appears when logo disappears */}
        <a 
          href="https://www.tickettailor.com/events/familyevents2/2052743"
          target="_blank"
          rel="noopener noreferrer"
          className={`mobile-sticky-book-button ${animationPhase === "content-in" ? "animate-in" : ""} ${isInHero ? "hidden" : ""}`}
        >
          Book Now
        </a>

        {/* Mobile Menu Button - pill shape with grid icon and "Menu" text */}
        <button 
          className={`mobile-menu-button ${animationPhase === "content-in" ? "animate-in" : ""} ${isMenuOpen ? "menu-open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span className="menu-grid-icon">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="menu-text">Menu</span>
        </button>

        {/* Mobile Menu Fullscreen Overlay */}
        <div className={`mobile-menu-overlay ${isMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-links">
              <a 
                href="#venue" 
                className={`mobile-menu-link ${activeNavLink === "venue" ? "active" : ""}`}
                onClick={(e) => { handleVenueNavClick(e); setIsMenuOpen(false); }}
              >
                Venue
                <span className="mobile-menu-arrow">›</span>
              </a>
              <a 
                href="#topic" 
                className={`mobile-menu-link ${activeNavLink === "topic" ? "active" : ""}`}
                onClick={(e) => { handleSectionNavClick(e, topicRef); setIsMenuOpen(false); }}
              >
                Topic
                <span className="mobile-menu-arrow">›</span>
              </a>
              <a 
                href="#speakers" 
                className={`mobile-menu-link ${activeNavLink === "speakers" ? "active" : ""}`}
                onClick={(e) => { handleSectionNavClick(e, speakersRef); setIsMenuOpen(false); }}
              >
                Speakers
                <span className="mobile-menu-arrow">›</span>
              </a>
              <a 
                href="#faq" 
                className={`mobile-menu-link ${activeNavLink === "faq" ? "active" : ""}`}
                onClick={(e) => { handleSectionNavClick(e, faqRef); setIsMenuOpen(false); }}
              >
                FAQ
                <span className="mobile-menu-arrow">›</span>
              </a>
            </div>
            <a 
              href="https://www.tickettailor.com/events/familyevents2/2052743"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-book-now-button"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Now
            </a>
            <div className="mobile-menu-footer">
              <div className="mobile-menu-footer-links">
                <a href="https://charitydinner.co.uk/terms/" className="mobile-footer-link" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
              </div>
              <p className="mobile-footer-contact">
                <a href="mailto:enquires@familyevents.org.uk">enquires@familyevents.org.uk</a>
              </p>
            </div>
          </div>
        </div>

        {/* Heading wrapper - heading exactly centered, image above, content below */}
        <div className={`hero-heading-wrapper ${animationPhase === "content-in" ? "position-final" : ""}`}>
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
            <div className="heading-lines">
              {/* FINDING - First line */}
              <span className="heading-line heading-line--finding">
                {["F", "I", "N", "D", "I", "N", "G"].map((char, index) => (
                  <span
                    key={`finding-${index}`}
                    className={`letter letter-finding-${index}`}
                  >
                    {char}
                  </span>
                ))}
              </span>
              {/* FORGIVENESS - Second line */}
              <span className="heading-line heading-line--forgiveness">
                {["F", "O", "R", "G", "I", "V", "E", "N", "E", "S", "S"].map((char, index) => (
                  <span
                    key={`forgiveness-${index}`}
                    className={`letter letter-forgiveness-${index}`}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </div>
          </h1>

          {/* Subheading and button - animate in below heading */}
          <div
            className={`content-below ${animationPhase === "content-in" ? "animate-in" : ""}`}
          >
            <p className="hero-subheading">
              A luxury evening of inspirational knowledge and action,
              <br /> paired with a delicious iftar in West London.
            </p>
            <div className="hero-cta-wrapper">
              <div className="hero-discount-banner">
                <p className="hero-discount-text">
                  <span className="hero-discount-label">50% Discount</span>
                  <span className="hero-discount-price">
                    <span className="hero-price-old">£20</span>
                    <span className="hero-price-new">£10</span>
                  </span>
                </p>
                <p className="hero-discount-date">Valid until 10th Feb</p>
              </div>
              <a href="https://www.tickettailor.com/events/familyevents2/2052743" target="_blank" rel="noopener noreferrer" className="book-now-button">Book Now</a>
            </div>
          </div>
        </div>

        {/* Partner strip - always at bottom */}
        <div
          className={`partner-strip ${animationPhase === "content-in" ? "animate-in" : ""}`}
        >
          <div className="partner-item">
            <p className="partner-label">Event Organiser</p>
            <img
              src={impactEventsLogo}
              alt="Impact Events"
              className="partner-logo"
            />
          </div>
          <div className="partner-item">
            <p className="partner-label">Event Sponsor</p>
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
              />
            </div>
            <div className="venue-text">
              <h2 className="venue-heading">
                Venue
              </h2>
              <h3 className="venue-subheading">
                Royal Nawab | West London
              </h3>
              <p className="venue-paragraph">
                Join us at Royal Nawaab for a special "Finding Forgiveness in Ramadan" Iftar—an evening of reflection, renewal, and togetherness. As we break our fast, enjoy a luxurious Iftar feast of authentic Pakistani and Indian cuisine in an elegant setting, creating space for meaningful conversation and spiritual connection.
              </p>
              <p className="venue-paragraph">
                Come together with family and friends to nourish both heart and soul during this blessed month.
              </p>
              <p className="venue-paragraph">
                <span className="venue-date-1st">1</span>st of March at{' '}
                <a
                  href="https://www.google.com/maps/place/Royal+Nawaab+Perivale/@51.5337869,-0.3226802,17z/data=!3m1!4b1!4m6!3m5!1s0x48761267bc9cecbf:0x18d70a62ce4449f5!8m2!3d51.5337836!4d-0.3201053!16s%2Fg%2F11b6pw_2rb?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="venue-link"
                >
                  <span className="venue-link-text">
                    Royal Nawaab Perivale
                  </span>
                  <span className="venue-link-arrow">
                    {' '}→
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Topic ——— */}
      <section
        className={`section section--black topic-section ${topicActive ? "is-active" : ""}`}
        id="topic"
        ref={topicRef}
      >
        <div className="topic-container">
          <div className="topic-content">
            <h2 className="section-title topic-title">
              Finding Forgiveness
            </h2>
            <h3 className="topic-subheading">
              in the Month of Ramadan
            </h3>
            <p className="topic-description">
              Join us for a special Ramadan Iftar & Spiritual Programme dedicated to reflection, renewal, and returning to Allah ﷻ. As we enter the most sacred days of the month, this gathering is designed to help you seek Allah's forgiveness, heal relationships, and maximise the final 10 nights of Ramadan.
            </p>
            <p className="topic-description">
              Through uplifting and practical talks, our speakers will explore:
            </p>
            <ul className="topic-features">
              <li className="topic-feature">
                <span className="topic-feature-icon">🕌</span>
                <span>
                  How to attain forgiveness from Allah
                </span>
              </li>
              <li className="topic-feature">
                <span className="topic-feature-icon">✨</span>
                <span>
                  The spiritual importance of forgiving others
                </span>
              </li>
              <li className="topic-feature">
                <span className="topic-feature-icon">🌙</span>
                <span>
                  How to maximise the last 10 nights of Ramadan, including Laylatul Qadr
                </span>
              </li>
            </ul>
            <p className="topic-description">
              The event starts at 4pm and will conclude with Esha Salah & Taraweeh on the night with guest Imams.
            </p>
            <a href="https://www.tickettailor.com/events/familyevents2/2052743" target="_blank" rel="noopener noreferrer" className="book-now-button">Book Now</a>
          </div>
        </div>
      </section>

      {/* ——— Speakers ——— */}
      <section
        className="section section--black speakers-section"
        id="speakers"
        ref={speakersRef}
      >
        <div className="speakers-container">
          <h2 className="section-title speakers-title">Speakers</h2>
          <div className="speakers-grid">
            <div 
              className={`speaker-card ${activeSpeakerIndex === 0 ? "active" : ""}`}
              onClick={() => setActiveSpeakerIndex(activeSpeakerIndex === 0 ? null : 0)}
            >
              <img
                src={asimKhanImage}
                alt="Asim Khan"
                className="speaker-image"
              />
              <div className="speaker-info">
                <p className="speaker-description">
                  A dynamic speaker known for his insights on personal growth, community development, and purposeful living. Imam Asim draws from real-life experiences to deliver practical lessons that inspire audiences to think deeper and act with confidence.
                </p>
                <p className="speaker-title">Imam</p>
                <h3 className="speaker-name">Asim Khan</h3>
              </div>
            </div>
            <div 
              className={`speaker-card ${activeSpeakerIndex === 1 ? "active" : ""}`}
              onClick={() => setActiveSpeakerIndex(activeSpeakerIndex === 1 ? null : 1)}
            >
              <img
                src={shaqurRehmanImage}
                alt="Shaqur Rehman"
                className="speaker-image"
              />
              <div className="speaker-info">
                <p className="speaker-description">
                  An engaging and motivational speaker with a passion for empowering the next generation. Shaqur focuses on mindset, identity, and navigating modern challenges while staying true to strong values and principles.
                </p>
                <p className="speaker-title">Sheikh</p>
                <h3 className="speaker-name">Shaqur Rehman</h3>
              </div>
            </div>
            <div 
              className={`speaker-card ${activeSpeakerIndex === 2 ? "active" : ""}`}
              onClick={() => setActiveSpeakerIndex(activeSpeakerIndex === 2 ? null : 2)}
            >
              <img
                src={umerSulemanImage}
                alt="Umer Suleman"
                className="speaker-image"
              />
              <div className="speaker-info">
                <p className="speaker-description">
                  A respected community figure and inspiring voice who connects deeply with young audiences. Umer shares reflections on faith, character, and everyday challenges, offering relatable guidance on how to live with purpose and balance in today's world.
                </p>
                <p className="speaker-title">Ustadh</p>
                <h3 className="speaker-name">Umer Suleman</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="section section--black faq-section" id="faq" ref={faqRef}>
        <div className="faq-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            <div
              className="faq-item"
              onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
            >
              <div className="faq-question">
                <span>What time do the doors open and when do they close?</span>
                <span className="faq-icon">
                  {openFaqIndex === 0 ? "−" : "+"}
                </span>
              </div>
              <div
                className={`faq-answer ${openFaqIndex === 0 ? "is-open" : ""}`}
              >
                <p>
                  The doors open at 3:45 PM and close at 4:30 PM. The event runs from 4:00 PM to 8:00 PM. Please ensure you arrive before 4:30 PM, as late arrivals may not be accommodated.
                </p>
              </div>
            </div>

            <div
              className="faq-item"
              onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
            >
              <div className="faq-question">
                <span>Do children need a ticket for the event?</span>
                <span className="faq-icon">
                  {openFaqIndex === 1 ? "−" : "+"}
                </span>
              </div>
              <div
                className={`faq-answer ${openFaqIndex === 1 ? "is-open" : ""}`}
              >
                <p>
                  All children aged 3 and above require a seat and must have a ticket. Children below 3 will not be provided a seat or space at the table unless a seat is purchased for them.
                </p>
              </div>
            </div>

            <div
              className="faq-item"
              onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
            >
              <div className="faq-question">
                <span>How much are the tickets?</span>
                <span className="faq-icon">
                  {openFaqIndex === 2 ? "−" : "+"}
                </span>
              </div>
              <div
                className={`faq-answer ${openFaqIndex === 2 ? "is-open" : ""}`}
              >
                <p>
                  Tickets are priced at £20 per person. However, a FLASH SALE is available for just £10 for limited time.
                </p>
              </div>
            </div>

            <div
              className="faq-item"
              onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
            >
              <div className="faq-question">
                <span>What is included in the ticket price?</span>
                <span className="faq-icon">
                  {openFaqIndex === 3 ? "−" : "+"}
                </span>
              </div>
              <div
                className={`faq-answer ${openFaqIndex === 3 ? "is-open" : ""}`}
              >
                <p>
                  The ticket price includes:
                </p>
                <ul>
                  <li>Admission to the charity iftar</li>
                  <li>A delicious 3-course iftar</li>
                  <li>Inspiring talks from our esteemed speakers</li>
                  <li>An opportunity to support a meaningful cause</li>
                </ul>
              </div>
            </div>

            <div
              className="faq-item"
              onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
            >
              <div className="faq-question">
                <span>Who are the speakers at the event?</span>
                <span className="faq-icon">
                  {openFaqIndex === 4 ? "−" : "+"}
                </span>
              </div>
              <div
                className={`faq-answer ${openFaqIndex === 4 ? "is-open" : ""}`}
              >
                <p>
                  The event features three renowned speakers:
                </p>
                <ul>
                  <li>Imam Asim Khan</li>
                  <li>Shaykh Shaqur Rehman</li>
                  <li>Umer Sulaiman</li>
                </ul>
              </div>
            </div>

            <div
              className="faq-item"
              onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}
            >
              <div className="faq-question">
                <span>
                  How do I get in touch if I have more questions?
                </span>
                <span className="faq-icon">
                  {openFaqIndex === 5 ? "−" : "+"}
                </span>
              </div>
              <div
                className={`faq-answer ${openFaqIndex === 5 ? "is-open" : ""}`}
              >
                <p>
                  If you have any additional questions, feel free to contact us at <a href="mailto:enquires@familyevents.org.uk" style={{color: '#fff', textDecoration: 'underline'}}>enquires@familyevents.org.uk</a>. We'll be happy to assist you with any inquiries about the event.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Footer ——— */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-wrapper">
            <div className="footer-content">
              <div className="footer-header">
                <img src={readFoundationLogo} alt="Muslims in Need" className="footer-logo" />
                <h3 className="footer-label">CHARITY PARTNER</h3>
              </div>
              <p className="footer-heading">This event is proudly sponsored by Muslims in Need.</p>
              <p className="footer-text">
                On the night, we will be raising Sadaqah and Zakat in support of vital humanitarian projects. 100% of all donations go directly to those in need, in line with Muslims in Need's 100% donation policy.
              </p>
              <p className="footer-text">
                Join us for a powerful Ramadan evening of faith, forgiveness, and generosity—an opportunity to nourish both the soul and the wider Ummah.
              </p>
            </div>
            <div className="footer-image-wrapper">
              <img src={gazaEmergencyImage} alt="Gaza Emergency" className="footer-image" />
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-links">
              <a href="https://charitydinner.co.uk/terms/" className="footer-link" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
            </div>
            <p className="footer-contact">Contact: <a href="mailto:enquires@familyevents.org.uk">enquires@familyevents.org.uk</a></p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
