import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Provider } from "react-redux";
import store from "./store";
import { login } from "./store/actions";
import Cookies from "./utils/Cookies";

import "./assets/scss/material-kit-react.scss?v=1.4.0";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
import { Auth } from "aws-amplify";
// pages for this product
import Components from "views/Components/Components.jsx";
import MatchingPage from "views/MatchingPage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";
import UploadPage from "views/UploadPage.jsx";
import SearchPage from "views/SearchPage.jsx";
import SecretContactPage from "views/SecretContactPage.jsx";
import Impressum from "views/impressum.jsx";

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
        <Route path="/components" component={Components} />
        <Route path="/browse-pictures/:whale_id" component={SearchPage} />
        <Route path="/browse-pictures" component={SearchPage} />
        <Route path="/contact-owner" component={SecretContactPage} />
        <Route path="/about" component={Impressum} />
        <Route path="/" component={LoginPage} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
