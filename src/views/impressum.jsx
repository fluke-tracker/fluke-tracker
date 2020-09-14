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

    let boxStyle = {
      border: "2px solid white",
      borderRadius: "12px",
      paddingLeft: "20px",
      paddingRight: "20px",
      paddingTop: "25px",
      paddingBottom: "15px",
      backgroundColor: "#f0f0f0", // "#ebf7ff",
    };
    boxStyle = {
      paddingLeft: "20px",
      paddingRight: "20px",
      paddingTop: "15px",
      paddingBottom: "15px",
    };

    return (
      <div style={{ minHeight: "100vh" }}>
        <Header
          color="blue"
          brand={<img src={require("assets/img/fluketracker-logo(blue-bg).jpg")}           style={{
                        width: "90%",
                        paddingBottom: "0px",
                        margin: "0 auto",
                      }} />}
          fixed
          rightLinks={<HeaderLinks user={this.state.user} />}
          changeColorOnScroll={{
            height: "400",
            color: "black",
          }}
          {...rest}
        />
        <div className={classes.container}>
          <div class="section container" style={{ paddingTop: "180px", paddingBottom: "5px" }}>
            <div class="row">
              <div class="col-12">
                <div
                  class="article-text"
                  style={{
                    textAlign: "center",
                    color: "black",
                    paddingLeft: "50px",
                    paddingRight: "50px",
                  }}
                >
                  <h1 style={{ paddingTop: "40px", textAlign: "center", fontSize: "40px" }}>
                    <strong>A big THANK YOU to our SPONSORS!</strong>
                  </h1>
                  <hr />
                  <div style={{ ...boxStyle }}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/314px-Amazon_Web_Services_Logo.svg.png"
                      style={{
                        width: "9%",
                        paddingBottom: "15px",
                        margin: "0 auto",
                      }}
                    />
                    We're proud to present AWS as our official cloud-service partner whose team
                    supported us throughout the whole journey of this amazing project: Starting with
                    their assistance during the development of the AI up to the use of their
                    technology that makes hosting this website possible.
                  </div>
                  <hr />
                  <div style={{ ...boxStyle, marginTop: "15px" }}>
                    <img
                      src="https://www.capgemini.com/de-de/wp-content/themes/capgemini-komposite/assets/images/logo.svg"
                      style={{
                        paddingBottom: "10px",
                        margin: "0 auto",
                      }}
                    />
                    As the founder and organizer of the Global Data Science Challenge 2020,
                    Capgemini is another big sponsor who really pushed this project forward. The
                    constant innovation and dedication of Capgemini brought this idea to life and
                    ensured creating an AI for good.
                  </div>
                                    <hr />
                  <div style={{ ...boxStyle }}>
                    <img
                      src={require("assets/img/logotipo_01.jpg")}
                      style={{
                        width: "30%",
                        paddingBottom: "15px",
                        margin: "0 auto",
                      }}
                    />
                    Whale Watch Azores, is a pioneer in whale watching in the Azores. We offer you an unforgettable experience at sea: with or without the whales & dolphins. Being a local, Norberto is proud of his heritage and particularly values local habits and culture. Don’t find it weird if he invites you to taste a fish soup or a glass of Pico wine.The Azores archipelago sits in the middle of the North Atlantic, where man and sea naturally mingle. Bathed by the warm Gulf stream, with sea temperatures ranging 17º to 24º, the Azores harbors a rich marine fauna, including all major large whales and a suite of dolphin species. Come visit the Azores and live an ocean adventure where you can enjoy the company of some of the largest and most impressive animals on earth.
                  </div>
                  <hr />
                </div>
                <br />
                <br />
                                <div class="article-text">
                  <h1 style={{ paddingTop: "20px" }}>
                    <b>Development Team</b>
                  </h1>
                  <ul style={{listStyleType:"none", color:"black"}}>
                  <li><a href="mailto:daniel.kuehlwein@capgemini.com">Daniel Kühlwein</a> (Germany)</li>
                  <li><a href="mailto:marcel.bergmann@capgemini.com">Marcel Bergmann</a> (Germany)</li>
                  <li><a href="mailto:moritz.schaffenroth@capgemini.com">Moritz Schaffenroth</a> (Germany)</li>
                  <li><a href="mailto:kanwalmeet.singh-kochar@capgemini.com">Kanwalmeet Singh Kochar</a> (Germany)</li>
                  <li><a href="mailto:hartvig.johannson@capgemini.com">Hartvig Johannson</a> (Normay)</li>
                  <li><a href="mailto:simen-norrheim.larsen@capgemini.com">Simen Norrheim Larsen</a> (Norway)</li>
                  <li><a href="">Robin Wulfes</a> (Germany)</li>
                  <li><a href="mailto:nien-chun.yin@capgemini.com">Sophie (Nien-chun) Yin</a> (Germany)</li>
                  </ul>
                  </div>
                <div class="article-text">
                  <h1 style={{ paddingTop: "20px" }}>
                    <b>Imprint</b>
                  </h1>
                  <h2>This site is edited by: / Ce site web est édité par :</h2>
                  <p>
                    Capgemini Service SAS
                    <br />
                    Société par actions simplifiée au capital de 8, 000,000 euros – 652 025 792 RCS
                    Paris
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
