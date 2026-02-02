import React from "react";
import Counter from "./Counter";
import "./App.css";

function App() {
  return (
    <div className="App-header">
      <div className="bg-anim" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>

      <div className="app-container">
        <h1 className="app-title">Simple Counter</h1>
        <Counter />
        <div className="app-footer">Fast, friendly and colorful</div>
      </div>
    </div>
  );
}

export default App;