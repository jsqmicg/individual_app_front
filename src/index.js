import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Register from "./Screens/Register";
import Activate from "./Screens/Activate";
import Login from "./Screens/Login";
import ForgetPassword from "./Screens/Forget";
import ResetPassword from "./Screens/Reset";
import "react-toastify/dist/ReactToastify.css";
import Map from "./Screens/Map";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={(props) => <App {...props} />} />
      <Route
        path="/register"
        exact
        render={(props) => <Register {...props} />}
      />
      <Route
        path="/users/activate/:token"
        exact
        render={(props) => <Activate {...props} />}
      />
      <Route path="/login" exact render={(props) => <Login {...props} />} />
      <Route
        path="/users/passwords/forget"
        exact
        render={(props) => <ForgetPassword {...props} />}
      />
      <Route
        path="/users/password/reset/:token"
        exact
        render={(props) => <ResetPassword {...props} />}
      />
      <Route path="/map" exact render={(props) => <Map {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
