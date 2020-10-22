import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Provider } from "react-redux";
import store from "./store";
import { login } from "./store/actions";
import Cookies from "./utils/Cookies";

import "./assets/scss/material-kit-react.scss";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";

import MatchingPage from "views/MatchingPage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";
import UploadPage from "views/UploadPage.jsx";
import SearchPage from "views/SearchPage.jsx";
import Imprint from "views/Imprint.jsx";

var hist = createBrowserHistory();
Amplify.configure(awsmobile);
const token = Cookies.read("token");

if (token) {
  const user = jwtDecode(token);
  console.log("token present user,", user);
  store.dispatch(login(user));
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
      <Switch>
        <Route path="/match-whales" component={MatchingPage} />
        <Route path="/welcome-upload" component={UploadPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/browse-pictures/:whale_id" component={SearchPage} />
        <Route path="/browse-pictures" component={SearchPage} />
        <Route path="/about" component={Imprint} />
        <Route path="/" component={UploadPage} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
