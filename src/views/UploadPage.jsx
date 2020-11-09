import React from "react";

import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Storage from "@aws-amplify/storage";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import Auth from "@aws-amplify/auth";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import { createPicture } from "graphql/mutations";
import {API, graphqlOperation} from "@aws-amplify/api";
import exifr from "exifr";
import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";
import CropperComponent from "components/Cropper/Cropper.jsx";
import WorkerHandler from "views/WorkerHandler.jsx";
import { Icon } from 'semantic-ui-react'
import Amplify from '@aws-amplify/core';

class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadingFiles: false,
      imageNames: [],
      imageFiles: [],
      imageFilesStrings: [],
      responses: [],
      user: null,
      latitude: null,
      longitude: null,
      imageDate: null,
      cropperComponents: [],
      selectedEnabled: "browserCropping",
    };
    this.workerHandler = new WorkerHandler();
    Amplify.configure({
        "aws_appsync_authenticationType": "API_KEY",
    });
    this.authenticate_user();
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
    this.uploadImages = this.uploadImages.bind(this);
  }
  componentWillUnmount() {
    this.workerHandler.worker.terminate();
  }
  handleChangeEnabled(event) {
    this.setState({ selectedEnabled: event.target.value });
  }
  authenticate_user() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("uploadpage user", user.username);
        this.setState({ user: user });
        Amplify.configure({
            "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
        });
      })
      .catch((err) => {
        console.log(
          "currentAuthenticatedUser uploadpage er pushing to login page",
          err
        );
        this.setState({ user: null });
        Amplify.configure({
            "aws_appsync_authenticationType": "API_KEY",
        });
        //this.props.history.push("/login-page");
      });
  }
  async addResponse(response, color) {
    console.log("add Response " + response);
    await this.setState((state) => {
      return {
        responses: [
          ...state.responses,
          { response: response, responseColor: color },
        ],
      };
    });
  }

  async readFileAsDataURL(file) {
    let result_base64 = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsDataURL(file);
    });

    return result_base64;
  }
  blobToFile(theBlob, fileName) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  async uploadImages() {
    await this.setState({ uploadingFiles: true });
    await Promise.all(
      this.state.imageFiles.map(async (file) => {
        if (typeof file !== "undefined") {
          const allowedFileTypes = new Set(["image/jpeg"]);
          const filetype = file.type;
          if (!allowedFileTypes.has(filetype)) {
            this.addResponse(
              "Error " +
                file.name +
                "! File could not be uploaded: Expected file type is 'image/jpeg' but received '" +
                filetype +
                "'.",
              "red"
            );
            // artifical "break"
            return;
          }

          // if we got to this point, we set the response to "" to enable the circularProgress item
          this.setState({ responses: [] });

          // modify file ending if written in capital letters or as 'jpeg' instead of 'jpg'
          let splitFileName = file.name.split(".");
          const fileExt = splitFileName.pop();
          if (fileExt === "JPG" || fileExt === "jpeg") {
            file = new File([file], splitFileName.join("") + ".jpg", {
              type: filetype,
            });
            console.log(file);
          }

          // extract meta data if available
          try {
            const output = await exifr.parse(file);
            this.setState({
              latitude: output.latitude,
              longitude: output.longitude,
              imageData: output.DateTimeOriginal.toGMTString(),
            });
            console.log("image output", output);
          } catch (e) {
            this.setState({
              latitude: null,
              longitude: null,
              imageData: null,
            });
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
              let uploadPath;
              var options = {
                ACL: "public-read",
                level: "public",
                contentType: filetype,
              };
              if (this.state.selectedEnabled === "noCropping") {
                console.log("no cropping selected");
                const customPrefix = { public: "" };
                uploadPath = "cropped_images/";
                Storage.put(uploadPath + file.name, file, {
                  customPrefix: customPrefix,
                })
                  .then((result) => {
                    this.uploadThumbnail(file);
                    console.log("image uploaded", result);
                    this.upload = null;
                    this.addResponse(
                      "File " + file.name + " uploaded successfully!",
                      "green"
                    );
                  })
                  .catch((err) => {
                    console.log("error while uploading,", err);
                    this.addResponse(
                      "Error! File " +
                        file.name +
                        " could not be uploaded, please try again.",
                      "red"
                    );
                  });
              } else if (this.state.selectedEnabled === "browserCropping") {
                console.log("browser cropping selected");
                const customPrefix = { public: "" };
                uploadPath = "cropped_images/";
                console.log(
                  this.state.cropperComponents.map(
                    (comp) => comp.props.filename
                  )
                );
                const matchingCropperComponents = this.state.cropperComponents.filter(
                  (comp) => comp.props.filename === file.name
                );
                if (matchingCropperComponents.length < 1) {
                  console.log("no matching cropper component");
                }
                const cropperComponent = matchingCropperComponents[0];
                const croppedFile = this.blobToFile(
                  await cropperComponent.getCroppedImage(),
                  file.name
                );
                Storage.put(uploadPath + croppedFile.name, croppedFile, {
                  customPrefix: customPrefix,
                })
                  .then((result) => {
                    this.uploadThumbnail(croppedFile);
                    console.log("image uploaded", result);
                    this.upload = null;
                    this.addResponse(
                      "File " + file.name + " uploaded successfully!",
                      "green"
                    );
                  })
                  .catch((err) => {
                    console.log("error while uploading,", err);
                    this.addResponse(
                      "Error! File " +
                        croppedFile.name +
                        " could not be uploaded, please try again.",
                      "red"
                    );
                  });
              } else if (this.state.selectedEnabled === "cropping") {
                console.log("cropping algorithm selected");
                uploadPath = "embeddings/input/";

                Storage.put(uploadPath + file.name, file, options)
                  .then((result) => {
                    this.uploadThumbnail(file);
                    console.log("image uploaded", result);
                    this.upload = null;
                    this.addResponse(
                      "File " + file.name + " uploaded successfully!",
                      "green"
                    );
                  })
                  .catch((err) => {
                    console.log("error while uploading,", err);
                    this.addResponse(
                      "Error! File " +
                        file.name +
                        " could not be uploaded, please try again.",
                      "red"
                    );
                  });
              }
            } catch (e) {
              console.log("error in uploading", e);
            }
          } else {
            console.log("cannot upload image");
          }
        }
      })
    );
    await this.setState({ uploadingFiles: false });
  }

  async uploadThumbnail(pFile) {
    try {
      var options = {
        ACL: "public-read",
        level: "public",
        contentType: pFile.type,
      };
      console.log("upload thumbnail", pFile.name + "thumbnail.jpg");
      await Storage.put(
        "thumbnails/" + pFile.name + "thumbnail.jpg",
        pFile,
        options
      );
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
      this.addResponse(
        "Error " +
          image +
          "! Please make sure that the image you are trying " +
          "to upload does not exist in the database already.",
        "red"
      );
    }
    return allowUpload;
  }

  render() {
    const { classes, ...rest } = this.props;

    return (
      <div style={{ minHeight: "100vh" }}>
        <Header
          fixed
          rightLinks={<HeaderLinks user={this.state.user} />}
          {...rest}
        />
          <div>
            <div
              className="section container"
              style={{
                backgroundImage: 'url(require("../assets/img/tail.jpg"))',
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className={classes.container}>
              <div
                className="section container"
                style={{ paddingTop: "80px", paddingBottom: "5px" }}
              >
                <div className="row">
                  <div className="col-12">
                    <div className="article-text">
                      <h1 style={{ paddingTop: "5px" }}>
                        <strong>FlukeTracker</strong>
                      </h1>
                      <h4 style={{ paddingTop: "5px", marginTop: "10px" }}>
                        <strong>What is the FlukeTracker website?</strong>
                      </h4>
                      <p style={{ paddingBottom: "5px" }}>
                        For Whale-Lovers: You can use this website to find sperm
                        whales and match your whale pictures with others.
                        <br></br> After uploading a whale image, potential
                        matches generated by the AI can be reviewed on the{" "}
                        <i>Match Whales</i> page.<br></br> Feel free to view our
                        entire whale catalogue on the <i> Browse Pictures </i>{" "}
                        page.
                      </p>
                      <video id="vid" src={require("../assets/mp4/whatcanyoudo.mp4")} height="auto" width="600px" autoPlay muted loop>
                          Ihr Browser kann dieses Video nicht wiedergeben.<br/>
                          Dieser Film zeigt eine Demonstration der Website.
                          Sie können ihn unter <a href={require("../assets/mp4/whatcanyoudo.mp4")}>Link-Addresse</a> abrufen.
                      </video>
                      <script>
                        document.getElementById('vid').play();
                      </script>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.container}>
              <div
                className="section container"
                style={{ paddingTop: "5px", paddingBottom: "5px" }}
              >
                <div className="row">
                  <div className="col-12">
                    <div className="article-text">
                      <h4 style={{ paddingTop: "5px", marginTop: "10px" }}>
                        <strong>Upload Whale Image 🐳</strong> (Registration required)
                      </h4>
                      <p style={{ marginBottom: "5px" }}>
                        Here are a few points about the uploading of images:
                      </p>
                      <ul
                        style={{
                          listStyleType: "none",
                          paddingBottom: "0px",
                          color: "black",
                        }}
                      >
                        <li>
                          Image must be ventral side of the animal in an upright
                          (or as close to vertical as possible) position.
                        </li>
                        <li>
                          If the image is taken from the front of the animal,
                          then the image must be flipped horizontally before
                          uploading.
                        </li>
                        <li>
                          If the image is taken on the lifting of the fluke, the
                          image has to be flipped vertically, so the trailing
                          edge is on the top of the image.
                        </li>
                        <li>
                          Please do not upload dorsal fin or head images as this
                          will confuse the algorithm.
                        </li>
                      </ul>
                      <p style={{ marginBottom: "5px" }}>
                        What is the cropping algorithm?
                      </p>
                      <ul
                        style={{
                          listStyleType: "none",
                          paddingBottom: "0px",
                          color: "black",
                        }}
                      >
                        <li>
                          The fluke tracker machine learning model, finds the
                          best matches to images in the database by using images
                          tightly cropped around the flukes of whales.
                        </li>
                        <li>
                          {" "}
                          Select <b>Browser Cropping </b>option to crop images
                          yourself. You are supported by a algorithm which makes
                          a suggestion. Depending on your system this can take
                          some time since the algorithm is running on your
                          browser.
                        </li>
                        <li>
                          {" "}
                          Select the <b>Use Cropping Algorithm </b>option to
                          leverage the algorithm which automatically crops
                          uploaded images{" "}
                        </li>
                        <li>
                          To upload manually cropped images, select the{" "}
                          <b>No Cropping</b> option.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ paddingRight: "15px", paddingLeft: "15px" }}>
                <input
                  multiple={true}
                  type="file"
                  accept="image/jpeg"
                  style={{ display: "none" }}
                  ref={(ref) => (this.upload = ref)}
                  onChange={(e) => {
                    this.setState({
                      imageFiles: Array.from(this.upload.files),
                      imageNames: Array.from(this.upload.files).map(
                        (item) => item.name
                      ),
                    });
                    Promise.all(
                      Array.from(this.upload.files).map((file) =>
                        this.readFileAsDataURL(file)
                      )
                    ).then((results) => {
                      this.setState({ imageFilesStrings: results });
                    });
                  }}
                  required
                />

                <input
                  style={{ "textAlign": "center" }}
                  value={this.state.imageNames.join(",")}
                  onClick={(e) => {
                    this.upload.value = null;
                    this.upload.click();
                  }}
                  placeholder="Select file"
                  readOnly
                  required
                />

                {this.state.selectedEnabled === "browserCropping"
                  ? this.state.imageFilesStrings.map( (image, i) =>
                     <CropperComponent
                        filename={this.state.imageNames[i]}
                        ref={(ref) => (this.state.cropperComponents[i] = ref)}
                        workerHandler={this.workerHandler}
                        key={image}
                        src={image}
                      />
                    )
                  : ""}

                <Button
                  style={{ marginLeft: "10px" }}
                  variant="contained"
                  color="info"
                  size="lg"
                  onClick={(e) => {
                    this.upload.value = null;
                    this.upload.click();
                  }}
                  loading={
                    this.state.uploadingFiles ? "uploading..." : undefined
                  }
                >
                  <Icon name="folder open outline"/>Browse
                </Button>
                <Button
                  style={{ marginLeft: "10px" }}
                  variant="contained"
                  onClick={() => this.state.user ? this.uploadImages(): this.props.history.push(`/login`)}
                  color="success"
                  size="lg"
                  disabled={this.state.uploadingFiles}
                >
                  {this.state.user ? <><Icon name="cloud upload"/><div>Upload File</div></> : <><Icon name="address book outline"/><div>Login to upload</div></>}
                </Button>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <br />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={
                          this.state.selectedEnabled === "browserCropping"
                        }
                        onChange={this.handleChangeEnabled}
                        value="browserCropping"
                        name="radio button browserCropping"
                        aria-label="Browser Cropping"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                    }}
                    label="Cropping in Browser"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={this.state.selectedEnabled === "cropping"}
                        onChange={this.handleChangeEnabled}
                        value="cropping"
                        name="radio button cropping"
                        aria-label="Cropping"
                        color="secondary"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                    }}
                    label="Use Cropping Algorithm"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={this.state.selectedEnabled === "noCropping"}
                        onChange={this.handleChangeEnabled}
                        value="noCropping"
                        name="radio button noCropping"
                        aria-label="No Cropping"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                    }}
                    label="No Cropping"
                  />
                </div>
                <div size="sm">
                  {this.state.uploadingFiles ? (
                    <CircularProgress />
                  ) : (
                    ""
                  )}
                  {this.state.responses.map((response) => (
                    <h5 style={{ color: response.responseColor }}>
                      {response.response}
                    </h5>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default withStyles(basicsStyle)(UploadPage);
