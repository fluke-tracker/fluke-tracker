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
import { createPicture, updateConfig, createWhale } from "graphql/mutations";
import { getConfig } from "graphql/queries";
import API, { graphqlOperation } from "@aws-amplify/api";
import exifr from "exifr";

const dashboardRoutes = [];
class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageName: "",
      imageFile: "",
      response: "",
      responseColor: "",
      user: null,
      latitude: null,
      longitude: null,
      imageDate: null,
    };
    this.authenticate_user();
  }

  authenticate_user() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("profilepage user", user.username);
        this.setState({ user: user });
      })
      .catch((err) => {
        console.log("currentAuthenticatedUser profilepage er pushing to login page", err);
        this.props.history.push("/login-page");
      });
  }

  async uploadImage() {
    let file = this.upload.files[0];
    const allowedFileTypes = new Set(["image/jpeg"]);
    const filetype = file.type;
    if (!allowedFileTypes.has(filetype)) {
      this.setState({
        response:
          "Error! File could not be uploaded: Expected file type is 'image/jpeg' but received '" +
          filetype +
          "'.",
        responseColor: "red",
      });
      return;
    }

    // modify file ending if written in capital letters or as 'jpeg' instead of 'jpg'
    let splitFileName = file.name.split(".");
    const fileExt = splitFileName.pop();
    if (fileExt === "JPG" || fileExt === "jpeg") {
      file = new File([file], splitFileName.join("") + ".jpg", { type: filetype });
      console.log(file);
    }

    // extract meta data if available
    try {
      const output = await exifr.parse(file);
      this.state.latitude = output.latitude;
      this.state.longitude = output.longitude;
      this.state.imageDate = output.DateTimeOriginal.toGMTString();
      console.log("image output", output);
    } catch (e) {
      this.state.latitude = null;
      this.state.longitude = null;
      this.state.imageDate = null;
      console.log("error in exifr ", e);
    }

    let allowUpload = false;
    try {
      allowUpload = await this.insertToDynamo(file.name, allowUpload);
    } catch (e) {
      console.log("error in insertToDynamo ", e);
    }
    console.log("allowUpload ", allowUpload);
    if (allowUpload == true) {
      try {
        console.log("upload image to S3 bucket");
        var options = {
          ACL: "public-read",
          level: "public",
          contentType: filetype,
        };

        Storage.put(
          "embeddings/input/" + file.name,
          file,
          options
          //         { contentType: this.upload.files[0].type,level: 'public' }
        )
          .then((result) => {
            this.uploadThumbnail(file);
            console.log("image uploaded", result);
            this.upload = null;
            this.setState({
              response: "File uploaded successfully!",
              responseColor: "green",
              imageName: "",
            });
          })
          .catch((err) => {
            console.log("error while uploading,", err);
            this.setState({
              response: "Error! File could not be uploaded, please try again.",
              responseColor: "red",
            });
          });
      } catch (e) {
        console.log("error in uploading", e);
      }
    } else {
      console.log("cannot upload image");
    }
  }

  async uploadThumbnail(pFile) {
    try {
      var options = {
        ACL: "public-read",
        level: "public",
        contentType: pFile.type,
      };
      console.log("upload thumbnail", pFile.name + "thumbnail.jpg");
      await Storage.put("thumbnails/" + pFile.name + "thumbnail.jpg", pFile, options);
      console.log("AFTER thumbnail upload");
    } catch (e) {
      console.log("cannot upload thumbnail", e);
    }
  }

  async insertToDynamo(image, allowUpload) {
    try {
      console.log("inserting image record to dynamodb");
      const insertImage = await API.graphql(
        graphqlOperation(createPicture, {
          input: {
            id: image,
            filename: image,
            geocoords: this.state.latitude + "," + this.state.longitude,
            thumbnail: image + "thumbnail.jpg",
            pictureWhaleId: -1,
            is_new: 1,
            embedding: 123,
            uploaded_by: this.state.user.username,
            date_taken: this.state.imageDate,
          },
        })
      );
      console.log("insertImage output aws", insertImage);

      allowUpload = true;
      console.log("setting allowupload as ", allowUpload);
    } catch (e) {
      allowUpload = false;
      console.log("getting insertImage error", e);
      this.setState({
        response:
          "Error! Please make sure that the image you are trying to upload does not exist in the database already.",
        responseColor: "red",
        imageName: "",
      });
    }
    return allowUpload;
  }

  render() {
    const { classes, ...rest } = this.props;

    return (
      <div>
        <Header
          color="blue"
          brand={
            <img src="https://visualidentity.capgemini.com/wp-content/themes/v/html/images/logo.png" />
          }
          fixed
          rightLinks={<HeaderLinks user={this.state.user} />}
          changeColorOnScroll={{
            height: "400",
            color: "black",
          }}
          {...rest}
        />
        {this.state.user != null ? (
          <div>
            <div
              class="section container"
              style={{
                backgroundImage: 'url(require("../assets/img/tail.jpg"))',
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className={classes.container}>
              <div class="section container" style={{ paddingTop: "50px", paddingBottom: "5px" }}>
                <div class="row">
                  <div class="col-12">
                    <div class="article-text">
                      <h2 style={{ paddingTop: "5px" }}>
                        <strong>Whalewatching</strong>
                      </h2>
                      <h4 style={{ paddingTop: "5px" }}>
                        <strong>What is the Whalewatching website?</strong>
                      </h4>
                      <p style={{ paddingBottom: "5px" }}>
                        For Whale-Lovers, you can use this website to find sperm whales and match
                        your whale pictures with others. This website consists of the following
                        pages:{" "}
                      </p>
                      <ul style={{ paddingBottom: "5px", color: "black" }}>
                        <li>
                          <strong>Profile Page</strong>: where you can find the basic instruction
                          and upload your pictures after log-in
                        </li>
                        <li>
                          <strong>Matching Page</strong>: where you can compare two pictures and
                          confirm whether they are the same
                        </li>
                        <li>
                          <strong>Search Page</strong>: where you can find the whale pictures with
                          the same id
                        </li>
                        <li>
                          <strong>Imprint (?)</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.container}>
              <div class="section container" style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                <div class="row">
                  <div class="col-12">
                    <div class="article-text">
                      <h4 style={{ paddingTop: "5px" }}>
                        <strong>Upload Whale Image 🐳</strong>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <input
                type="file"
                accept="image/jpeg"
                style={{ display: "none" }}
                ref={(ref) => (this.upload = ref)}
                onChange={(e) =>
                  this.setState({
                    imageFile: this.upload.files[0],
                    imageName: this.upload.files[0].name,
                  })
                }
                required
              />
              <input
                style={{ "text-align": "center" }}
                value={this.state.imageName}
                placeholder="Select file"
                required
              />
              <Button
                style={{ marginLeft: "10px" }}
                variant="contained"
                color="info"
                size="md"
                onClick={(e) => {
                  this.upload.value = null;
                  this.upload.click();
                }}
                loading={this.state.uploading}
              >
                Browse
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                variant="contained"
                onClick={() => this.uploadImage()}
                color="success"
                size="md"
              >
                Upload File
              </Button>

              <div color="red" size="sm">
                {!!this.state.response && (
                  <h5 style={{ color: this.state.responseColor }}>{this.state.response}</h5>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default withStyles(landingPageStyle)(ProfilePage);
