import React from "react";
import "./App.css";
import Cards from "./components/Cards";
import Header from "./components/Header";
import SwipeButtons from "./components/SwipeButtons";

function App() {
  return (
    <div className="app">
      <Header />
      <Cards />
      <SwipeButtons />
    </div>
  );
}

export default App;
