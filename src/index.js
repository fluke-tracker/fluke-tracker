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
        <Route path="/match-whales" render= {() => <MatchingPage history={hist} />} />
        <Route path="/welcome-upload" render= {() => <UploadPage history={hist} />} />
        <Route path="/login" render= {() => <LoginPage history={hist} />} />
        <Route path="/browse-pictures/:whale_id" render= {(props) => <SearchPage {...props} history={hist} />} />
        <Route path="/browse-pictures" render= {(props) => <SearchPage {...props} history={hist} />} />
        <Route path="/about" render= {() => <Imprint history={hist} />} />
        <Route path="/" render= {() => <UploadPage history={hist} />} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
