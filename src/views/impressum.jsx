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
import { Auth } from "aws-amplify";
import Footer from "components/Footer/Footer.jsx";
import { createPicture, updateConfig } from "graphql/mutations";
import { getConfig } from "graphql/queries";
import API, { graphqlOperation } from "@aws-amplify/api";
const dashboardRoutes = [];
class Impressum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageName: "",
      imageFile: "",
      response: "",
      user: null,
    };
    this.authenticate_user();
  }

  authenticate_user() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("profilepage user", user.username);
        this.setState({ user: user });
      })
      .catch((err) => console.log("currentAuthenticatedUser profilepage err", err));
  }
  async uploadImage() {
    var allowUpload = false;
    allowUpload = await this.insertToDynamo(`${this.upload.files[0].name}`, allowUpload);
    console.log("allowUpload ", allowUpload);
    if (allowUpload == true) {
      try {
        console.log("upload image to S3 bucket");
        Storage.put("embeddings/input/" + `${this.upload.files[0].name}`, this.upload.files[0], {
          contentType: this.upload.files[0].type,
        })
          .then((result) => {
            const image = `${this.upload.files[0].name}`;
            console.log("image name", image);
            this.upload = null;
            console.log("upload success,");
            this.setState({ response: "Success uploading file!", imageName: "" });
          })
          .catch((err) => {
            console.log("error while uploading,", err);
            this.setState({ response: `Cannot uploading file: ${err}` });
          });
      } catch (e) {
        console.log("error in uploading", e);
      }
    } else {
      console.log("cannot upload image");
    }
  }
  async insertToDynamo(image, allowUpload) {
    try {
      console.log("getting config from dynamodb");
      const getWhaleConfig = await API.graphql(graphqlOperation(getConfig, { id: "maxWhaleId" }));
      console.log("getConfig output aws", getWhaleConfig);
      const maxWhaleID = getWhaleConfig.data.getConfig.value;
      console.log("maxWhaleID", maxWhaleID);
      var newWhaleID = parseInt(maxWhaleID) + 1;
    } catch (e) {
      allowUpload = false;
      console.log("getting config error", e);
      this.setState({
        response: `Error: while fetching AWS Config for upload: ${e}`,
        imageName: "",
      });
    }
    try {
      console.log("inserting image record to dynamodb");
      console.log("newWhaleID", newWhaleID);
      const insertImage = await API.graphql(
        graphqlOperation(createPicture, {
          input: {
            id: image,
            filename: image,
            geocoords: ",",
            thumbnail: image + "thumbnail.jpg",
            pictureWhaleId: newWhaleID,
            is_new: true,
            embedding: 123,
            uploaded_by: "whalewatching",
          },
        })
      );
      console.log("insertImage output aws", insertImage);
      console.log("updating maxwhaleID config", newWhaleID);
      const updateWhaleConfig = await API.graphql(
        graphqlOperation(updateConfig, {
          input: {
            id: "maxWhaleId",
            value: newWhaleID,
          },
        })
      );
      console.log("updateWhaleConfig output aws", updateWhaleConfig);
      allowUpload = true;
      console.log("setting allowupload as ", allowUpload);
    } catch (e) {
      allowUpload = false;
      console.log("getting insertImage error", e);
      this.setState({
        response: `Error while upload. Check if Image already exists in the Database: ${e}`,
        imageName: "",
      });
    }
    return allowUpload;
  }

  render() {
    const { classes, ...rest } = this.props;

    return (
      <div style={{ minHeight: "100vh" }}>
        <Header
          color="blue"
          brand={
            <img src={require('assets/img/placeholder.jpg')} />
          }
          fixed
          rightLinks={<HeaderLinks user={this.state.user} />}
          changeColorOnScroll={{
            height: "400",
            color: "black",
          }}
          {...rest}
        />
        <div className={classes.container}>
              <div class="section container" style={{ paddingTop: "125px", paddingBottom: "5px" }}>
                <div class="row">
                  <div class="col-12">
                    <div class="article-text">
                  <h1 style={{ paddingTop: "20px" }}>
                        <strong>Sponsors</strong>
                      </h1>
                  <img src="https://www.capgemini.com/de-de/wp-content/themes/capgemini-komposite/assets/images/logo.svg" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/314px-Amazon_Web_Services_Logo.svg.png" style={{ width:"20%", paddingTop: "30px" }} />
                  </div>
                    <div class="article-text">
                      <h1 style={{ paddingTop: "20px" }}>
                        <strong>Impressum</strong>
                      </h1>
                      <h2>This site is edited by: / Ce site web est édité par :</h2>
                      <p>
                        Capgemini Service SAS
                        <br />
                        Société par actions simplifiée au capital de 8, 000,000 euros – 652 025 792
                        RCS Paris
                        <br />
                        Siège social : 11 rue de Tilsitt, 75017 Paris
                        <br />
                        Tel: +33 (0)1 47 54 50 00
                        <br />
                        Publication Director: / Directeur de la publication : M. Paul Hermelin
                      </p>
                      <h2>ISP: / Hébergeur :</h2>
                      <p>
                        <a href="https://automattic.com/" target="_blank" rel="noopener noreferrer">
                          Automattic Inc
                        </a>
                        <br />
                        60 29th Street #343
                        <br />
                        San Francisco, CA 94110
                        <br />
                        Tel: (877) 273-3049.
                      </p>

                      <h5 style={{ paddingTop: "5px" }}>
                        <a href="mailto:gdsc3_core.iandd@capgemini.com">Contact us</a>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    );
  }
}

export default withStyles(landingPageStyle)(Impressum);
