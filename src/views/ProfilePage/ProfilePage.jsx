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
import { createPicture,updateConfig } from 'graphql/mutations';
import { getConfig } from 'graphql/queries';
import API, { graphqlOperation } from '@aws-amplify/api';
const dashboardRoutes = [];
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
  async uploadImage() {
    var allowUpload = false
    allowUpload = await this.insertToDynamo(`${this.upload.files[0].name}`,allowUpload)
    console.log('allowUpload ',allowUpload)
    if (allowUpload==true){
   try {
    console.log('upload image to S3 bucket')
    Storage.put('embeddings/input/'+`${this.upload.files[0].name}`,
                this.upload.files[0],
                { contentType: this.upload.files[0].type })
      .then(result => {
        const image = `${this.upload.files[0].name}`
        console.log('image name',image)
        this.upload = null;
        console.log("upload success," );
        this.setState({ response: "Success uploading file!" ,imageName:""});
      })
      .catch(err => {
          console.log("error while uploading,",err );
        this.setState({ response: `Cannot uploading file: ${err}` });
      });
    }catch(e) {
      console.log("error in uploading",e);
   } 
  }
  else {
    console.log('cannot upload image')
  }
  }
  async insertToDynamo(image,allowUpload) {
      try {
      console.log('getting config from dynamodb')
      const getWhaleConfig =  await API.graphql(graphqlOperation(getConfig, {id: 'maxWhaleId'} ));
      console.log('getConfig output aws',getWhaleConfig)
      const maxWhaleID = getWhaleConfig.data.getConfig.value
      console.log('maxWhaleID',maxWhaleID)
      var newWhaleID = parseInt(maxWhaleID)+1
      }
      catch(e)
      {
        allowUpload = false
        console.log("getting config error",e)
        this.setState({ response: `Error: while fetching AWS Config for upload: ${e}`,imageName:""});
      }
       try {
      console.log('inserting image record to dynamodb')
      console.log('newWhaleID',newWhaleID)
      const insertImage = await API.graphql(graphqlOperation(createPicture, 
      { input : 
        {
        id: image,
        filename: image,
        geocoords: ',',
        thumbnail: image+'thumbnail.jpg',
        pictureWhaleId: newWhaleID,
        is_new:true,
        embedding:123,
        uploaded_by:'whalewatching'
        } 
      }));
      console.log('insertImage output aws',insertImage)
      console.log('updating maxwhaleID config',newWhaleID)
      const updateWhaleConfig =  await API.graphql(graphqlOperation(updateConfig, 
      {input:
        {
          id: 'maxWhaleId',
          value: newWhaleID
        }
      }));
      console.log('updateWhaleConfig output aws',updateWhaleConfig)
      allowUpload = true
      console.log('setting allowupload as ',allowUpload)
      
      }
      catch(e)
      {
        allowUpload = false
        console.log("getting insertImage error",e)
        this.setState({ response: `Error while upload. Check if Image already exists in the Database: ${e}`,imageName:"" });
      }
    return allowUpload   
    }

  render() {
    const { classes, ...rest } = this.props;

    return (
      <div>
        <Header
        color="blue"
        brand={<img src="https://visualidentity.capgemini.com/wp-content/themes/v/html/images/logo.png" />}
        fixed
        rightLinks={<HeaderLinks user={this.state.user} />}
        changeColorOnScroll={{
          "height": "400",
          "color": "black"
        }}
        {...rest}
      />
      <div class="section container" style={{
  backgroundImage: 'url(require("../assets/img/tail.jpg"))',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'}}>
</div>
          <div className={classes.container}>
    <div class="section container" style={{"paddingTop": "50px", "paddingBottom": "5px"}}>
        <div class="row">
            <div class="col-12">
                <div class="article-text">
                <h2 style={{"paddingTop": "5px"}}><strong>Whalewatching</strong></h2>
                    <h4 style={{"paddingTop": "5px"}}><strong>What is the Whalewatching website?</strong></h4>
                    <p style={{"paddingBottom": "5px"}}>For Whale-Lovers, you can use this website to find sperm whales and match your whale pictures with others. This website consists of the following pages: </p>
                        <ul style={{"paddingBottom": "5px", "color":"black"}}>
                        <li><strong>Profile Page</strong>: where you can find the basic instruction and upload your pictures after log-in</li>
                        <li><strong>Matching Page</strong>: where you can compare two pictures and confirm whether they are the same</li>
                        <li><strong>Search Page</strong>: where you can find the whale pictures with the same id</li>
                        <li><strong>Impressum (?)</strong></li>
                    </ul>
                        </div></div></div></div>
      </div>
      <div className={classes.container}>
          <div class="section container" style={{"paddingTop": "5px", "paddingBottom": "5px"}}>
        <div class="row">
        <div class="col-12">
                      <div class="article-text">
                    <h4 style={{"paddingTop": "5px"}}><strong>Upload Whale Image 🐳</strong></h4>
                        </div></div></div></div>
        <input
          type="file"
          accept="image/png, image/jpeg"
          style={{ "display": "none"}}
          ref={ref => (this.upload = ref)}
          onChange={e =>
            this.setState({
              imageFile: this.upload.files[0],
              imageName: this.upload.files[0].name
            })
          }
          required
        />
        <input style={{"text-align": "center"}} value={this.state.imageName} placeholder="Select file" required/>
        <Button
        variant="contained"
        color="info" size="md"
          onClick={e => {
            this.upload.value = null;
            this.upload.click();
          }}
          loading={this.state.uploading}
        >Browse
        </Button>
        <Button variant="contained" onClick={() => this.uploadImage()} color="success" size="md">Upload File</Button>

        <div color="red" size="sm">{!!this.state.response && <h5 style={{ color: 'red' }}>{this.state.response}</h5>}</div>

      </div>
      </div>
    );
  }
}

export default withStyles(landingPageStyle)(ProfilePage);