import './App.css';

function App() {
  return (
    <div className="hero-section">
      <video 
        className="bg-video" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/148593-794221531.mp4" type="video/mp4" />
      </video>
      <div className="hero-content">
        <div className="heading-banner">
          <span className="banner-text">ATTAINING</span>
        </div>
        <h1 className="hero-heading">FINDING FORGIVENESS</h1>
        <div className="heading-divider"></div>
        <p className="hero-subheading">A luxury evening of inspirational knowledge and action, paired with a delicious iftar in West London.</p>
      </div>
    </div>
  );
}

export default App;
