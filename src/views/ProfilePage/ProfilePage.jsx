import React, { Component } from "react";
import ReactDOM from "react-dom";
//import { configureAmplify, SetS3Config } from "./services";
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Storage from "@aws-amplify/storage";
import withStyles from "@material-ui/core/styles/withStyles";
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import classNames from "classnames";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import { Auth } from 'aws-amplify';
import Footer from "components/Footer/Footer.jsx";


class ProfilePage extends React.Component {
    constructor(props) {
    super(props)
this.state = {
    imageName: "",
    imageFile: "",
    response: "",
    user: null
}
    this.authenticate_user();
  }


  authenticate_user() {

    Auth.currentAuthenticatedUser()
          .then(user => {
           console.log('profilepage user',user.username);
           this.setState({ user: user })
          }).catch(err => console.log('currentAuthenticatedUser profilepage err', err))
  }

  render() {
    const { classes, ...rest } = this.props;

    return (
      <div>
        <Header
        color="transparent"
        brand=""
        fixed
        rightLinks={<HeaderLinks user={this.state.user} />}
        changeColorOnScroll={{
          "height": "400",
          "color": "white"
        }}
        {...rest}
      />
         <Parallax color="black" small center fixed filter image={require("assets/img/Pardot-Banner-GDSC_TD.png")} />
                <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container} style={{"height": "350px"}}>
          <GridContainer color = "black">
            <GridItem xs={12} sm={12} md={6}><h2 className={classes.title} style={{"color": "black"}}>Welcome to our home page</h2>
            <p style={{"color": "black"}}>Here is a short instruction of how to use this website</p>
            </GridItem>
        </GridContainer>
      </div>
      </div>
              <Footer />
      </div>
    );
  }
}
export default withStyles(landingPageStyle)(ProfilePage);