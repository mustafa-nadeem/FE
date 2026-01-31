import { useState, useEffect } from "react";
import "./App.css";
import familyEventsLogo from "./sponsors-logo/family-events.png";
import readFoundationLogo from "./sponsors-logo/read-foundation.png";
import maskGroupImage from "./Mask group123.png";
import charityDinnerLogo2 from "./Charitry-Dinner-logo2.svg";

function App() {
  const [animationPhase, setAnimationPhase] = useState("initial"); // initial, heading-in, bg-fade, heading-shrink, content-in

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
  }, []);

  return (
    <div className="hero-section">
      <div
        className={`black-overlay ${animationPhase === "bg-fade" || animationPhase === "content-in" ? "fade-out" : ""}`}
      ></div>

      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/148593-794221531.mp4" type="video/mp4" />
      </video>

      {/* Logo - positioned to the left of navbar */}
      <div
        className={`navbar-logo-container ${animationPhase === "content-in" ? "animate-in" : ""}`}
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
      </div>
    </div>
  );
}

export default App;
