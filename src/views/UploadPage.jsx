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

const dashboardRoutes = [];
class UploadPage extends React.Component {
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
           console.log('uploadpage user',user.username);
           this.setState({ user: user })
          }).catch(err => console.log('currentAuthenticatedUser uploadpage err', err))
  }
  uploadImage = () => {
  //  SetS3Config("my-test-bucket-amplify", "protected");
  try {
    Storage.put('embeddings/input/'+`${this.upload.files[0].name}`,
                this.upload.files[0],
                { contentType: this.upload.files[0].type })
      .then(result => {
        this.upload = null;
        console.log("upload success," );
        this.setState({ response: "Success uploading file!" });
      })
      .catch(err => {
          console.log("error while uploading,",err );
        this.setState({ response: `Cannot uploading file: ${err}` });
      });
    }catch(e) {
      console.log("error in uploading",e);
   }      
  };

  render() {
    const { classes, ...rest } = this.props;

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
            <GridItem xs={12} sm={12} md={6}><h2 className={classes.title} style={{"color": "black"}}>Upload Whale Image 🐳</h2></GridItem>
            <GridItem xs={12} sm={12} md={6}>
        <input
          type="file"
          accept="image/png, image/jpeg"
          style={{ "display": "none" }}
          ref={ref => (this.upload = ref)}
          onChange={e =>
            this.setState({
              imageFile: this.upload.files[0],
              imageName: this.upload.files[0].name
            })
          }
          required
        /></GridItem>
        <input value={this.state.imageName} placeholder="Select file" required/>
        <Button
        variant="contained"
        color="info" size="sm"
          onClick={e => {
            this.upload.value = null;
            this.upload.click();
          }}
          loading={this.state.uploading} 
        >Browse
        </Button>

        <Button variant="contained" onClick={() => this.uploadImage()} color="info" size="sm">Upload File</Button>
        </GridContainer>      
        <GridItem xs={12} sm={12} md={6}> 
        <div color="red" size="sm">{!!this.state.response && <h5 style={{ color: 'red' }}>{this.state.response}</h5>}</div>
        </GridItem>
      </div>
      </div>
              <Footer />
      </div>
    );
  }
}
export default withStyles(landingPageStyle)(UploadPage);