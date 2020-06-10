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
import { getWhale  } from 'graphql/queries';
import { getPicture  } from 'graphql/queries';
import API, { graphqlOperation } from '@aws-amplify/api';
const dashboardRoutes = [];
class UploadPage extends React.Component {
    constructor(props) {
    super(props)
this.state = {
    searchInput: "",
    user: null
}
    this.authenticate_user();
}

authenticate_user() {
    Auth.currentAuthenticatedUser()
          .then(user => { 
           console.log('searchpage user',user.username);
           this.setState({ user: user })
          }).catch(err => console.log('currentAuthenticatedUser searchpage err', err))
  }
handleInputChange (event) {
    event.preventDefault()
/*     console.log(event.target.name)
    console.log(event.target.value) */
    this.setState({
        [event.target.name]: event.target.value
    })
  }
handleSubmit (event){
    event.preventDefault()
    const data = this.state
    console.log('final search data',data)
    const whale = API.graphql(graphqlOperation(getWhale, {id: "1078"})).then(data => console.log(data));
    const pictures = API.graphql(graphqlOperation(getPicture, {id: "PM-WWA-20060531-D057.jpg"})).then(data => console.log(data));
}  
  render() {
    const { classes, ...rest } = this.props;
const searchInput=this.state.searchInput
    return (
      <div>
        <Header
        color="transparent"
        routes={dashboardRoutes}
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
            <GridItem xs={12} sm={12} md={6}><h2 className={classes.title} style={{"color": "black"}}>Search Whale Image 🐳</h2></GridItem>
        </GridContainer>   
        <p style={{ color: 'red' }}>{searchInput}</p>
          <form onSubmit={this.handleSubmit.bind(this)}>
        <input
        type="text"
        name = 'searchInput'
        placeholder="Search"
        value={this.state.searchInput}
        onChange={this.handleInputChange.bind(this)}
      />
        <button >Search Whale</button>

      </form>
      </div>
      </div>
              <Footer />
      </div>
    );
  }
}
export default withStyles(landingPageStyle)(UploadPage);