import React, { useState, useEffect } from "react";
import "./App.css";

function Counter() {
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [direction, setDirection] = useState("up");
  const [cardPulse, setCardPulse] = useState(false);
  const [colorState, setColorState] = useState("increment"); // increment or decrement

  // Ensure count never goes below 0
  const increment = () => {
    setDirection("up");
    setColorState("increment");
    setCardPulse(true);
    setTimeout(() => setCardPulse(false), 520);
    setCount((c) => c + 1);
  };
  
  const decrement = () => {
    setDirection("down");
    setColorState("decrement");
    setCount((c) => Math.max(0, c - 1));
  };
  
  const reset = () => {
    setDirection("reset");
    setCount(0);
  };

  // Trigger breaking pieces animation whenever the count changes
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 420);
    return () => clearTimeout(t);
  }, [count]);

  // Add keyboard event listener for arrow keys
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowUp") {
        increment();
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (count > 0) {
          decrement();
        }
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [count]);

  return (
    <div className={`counter-card ${cardPulse ? "card-pulse" : ""}`} role="region" aria-label="counter">
      <h2 className="counter-subtitle">Counter</h2>

      <div className="count-wrap" aria-hidden="false">
        <div className="count-ring" aria-hidden="true"></div>
        <div className="count-glow" aria-hidden="true"></div>
        <div 
          className={`count-display color-${colorState} ${pulse ? `count-anim count-anim-${direction}` : ""} ${pulse ? "color-transitioning" : ""}`} 
          aria-live="polite"
        >
          {count}
        </div>
      </div>

      <div className="btn-row">
        <button className="btn btn-accent" onClick={increment} aria-label="Increment">Increment</button>
        <button
          className="btn btn-secondary"
          onClick={decrement}
          aria-label="Decrement"
          disabled={count === 0}
          aria-disabled={count === 0}
        >
          Decrement
        </button>
        <button className="btn btn-muted" onClick={reset} aria-label="Reset">Reset</button>
      </div>
    </div>
  );
}

export default Counter;