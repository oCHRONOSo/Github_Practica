import { useState } from "react";
import "./App.css";
import Scene from "./scene";

function IntroScreen({ onStart }) {
  return (
    <div className="intro-screen">
      <h1 className="intro-title intro-fade-item">Welcome</h1>
      <p className="intro-description intro-fade-item">
        A quick look at what I do and what I like—explore the scene at your own pace.
      </p>
      <div className="intro-instructions intro-fade-item">
        <strong>Navigate:</strong>
        <ul>
          <li>Hold left click and drag to rotate</li>
          <li>Scroll wheel to zoom in and out</li>
        </ul>
        <p className="intro-note">There are <span className="intro-note-highlight">interactive objects to find</span>—hover and click to discover them.</p>
        <p className="intro-sound-note">Turn on the sound to enjoy the experience :)</p>
      </div>
      <button type="button" className="intro-start intro-fade-item" onClick={onStart}>
        Start
      </button>
    </div>
  );
}

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="app-container">
      <Scene onShowIntro={() => setStarted(false)} onRestart={() => setStarted(false)} />
      {!started && (
        <div className="intro-overlay">
          <IntroScreen onStart={() => setStarted(true)} />
        </div>
      )}
    </div>
  );
}

export default App;
