import React from "react";
import { connect } from "react-redux";
// utils
import Cookies from "../../utils/Cookies";
import { login } from "../../store/actions";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
// assets
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import image from "assets/img/bg.jpg";
import { Authenticator, Greetings } from "aws-amplify-react";
import { Auth } from "aws-amplify";
import {
  ConfirmSignIn,
  ConfirmSignUp,
  ForgotPassword,
  RequireNewPassword,
  SignIn,
  SignUp,
  VerifyContact,
  withAuthenticator,
} from "aws-amplify-react";

//amplify
import Amplify, { Storage } from "aws-amplify";
//import awsconfig from 'aws-exports';

//Amplify.configure(awsconfig);

const AlwaysOn = (props) => {
  return (
    <div>
      <div>I am always here to show current auth state: {props.authState}</div>
      <button onClick={() => props.onStateChange("signUp")}>Show Sign Up</button>
    </div>
  );
};

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      /*         cardAnimaton: "cardHidden",
        email: {
            value: "",
            errors: []
        },
        password: {
            value: "",
            errors: []
        } */
      user: null,
    };
    /*     this.handleInputChange = this.handleInputChange.bind(this);
    this.submitForm = this.submitForm.bind(this); */
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  handleInputChange(e) {
    const { name, value } = e.target;

    this.setState((state) => ({ [name]: { ...this.state[name], value } }));
  }
  loginRedirect(authState) {
    if (authState == "signedIn") {
      const _this = this;
      Auth.currentSession()
        .then((data) => console.log("current session data", data))
        .catch((err) => console.log("current session err", err));
      /*       Auth.currentAuthenticatedUser()
        .then(user => 
          {
            const email = user.attribues.email;
            const user2 = {name: user.username, surname: '', email: email}
            _this.setState({user: user2})
          }
          )
        .catch(err => console.log('error,err',err)); */

      Auth.currentAuthenticatedUser()
        .then((user) => {
          console.log("loginpage user", user.username);
          this.setState({ user: user.username });
          this.props.history.push("/profile-page");
        })
        .catch((err) => console.log("currentAuthenticatedUser err", err));
    }
  }

  /*   submitForm(e){
    console.log("inside submit form");
    e.preventDefault();

    const user = {
        email: this.state.email.value,
        password: this.state.password.value
    }

    const url = 'http://localhost:3000/api/users/login';

    fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }), // body data type must match "Content-Type" header
    })
    .then( res => res.json())
    .then( data => {
        const { errors, user } = data;

        this.setState({ email: { ...this.state.email, errors: [] }, password: { ...this.state.password, errors: [] }  })

        if (errors) {
            for (let name in errors) {
                const errorMessage = errors[name];

                this.setState(state => ({ [name]: { ...state[name], errors: [ ...state[name].errors, errorMessage ] } }));
            }

            return;
        }

        if (user) {
            const { token, ...userData } = user;

            Cookies.create('token', token, null);
            
            this.props.dispatch(login(userData));
            this.props.history.push('/landing-page');
        }
    });
  } */
  render() {
    const { classes, ...rest } = this.props;
    const { user } = this.props;
    return (
      <div>
        <Header
          absolute
          color="transparent"
          brand=""
          rightLinks={<HeaderLinks user={this.state.user} state={this.state} />}
          {...rest}
        />
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="left">
              <GridItem xs={12} sm={12} md={6}>
                <Card
                  className={classes[this.state.cardAnimaton]}
                  style={{
                    backgroundColor: "#434245",
                    color: "black",
                    boxShadow: "7px 8px",
                    fontSize: "100%",
                    lineHeight: "1.6",
                    border: "1px solid",
                  }}
                >
                  <div className={classes.container} style={{ paddingTop: "0px" }}>
                    <h3>
                      <strong>Welcome to the FlukeTracker</strong>
                    </h3>
                    <h4 style={{ paddingBottom: "5px" }}>
                      <strong>
                        For whale-lovers, who can use this website to find sperm whales and match
                        whale pictures with others.
                      </strong>
                    </h4>
                    {/*               <form onSubmit={this.submitForm} className={classes.form}>
                {   <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Login</h4>
                    </CardHeader>
                     <p className={classes.divider}></p> 
                    <CardBody>
                    <Authenticator onStateChange={(authState) => this.loginRedirect(authState)} >
                          <SignIn/>
                    </Authenticator>  
                    </CardBody>
                      
                    <CardFooter className={classes.cardFooter}>
                      <Button type="submit" simple color="primary" size="lg">
                        Login
                      </Button>
                    </CardFooter>
                  
                </Card> */}
                    {/*     <Authenticator onStateChange={(authState) => this.loginRedirect(authState)} >
                    </Authenticator>   */}
                    <Authenticator
                      hide={[Greetings, SignUp]}
                      onStateChange={(authState) => this.loginRedirect(authState)}
                    ></Authenticator>
                  </div>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          <Footer whiteFont />
        </div>
      </div>
    );
  }
}

const LoginPageContainer = connect((dispatch) => ({ dispatch }))(LoginPage);
export default withStyles(loginPageStyle)(LoginPageContainer);
