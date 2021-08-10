import React from "react";
import SwipeCards from "./views/SwipeCards";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./views/Home";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/match" component={SwipeCards} />
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
