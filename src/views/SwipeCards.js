import Cards from "../components/Cards";
import Header from "../components/Header";
import SwipeButtons from "../components/SwipeButtons";
import React from "react";

function SwipeCards() {
  return (
    <div className="app">
      <Header />
      <Cards />
      <SwipeButtons />
    </div>
  );
}

export default SwipeCards;
