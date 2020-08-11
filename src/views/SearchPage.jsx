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
import { getWhale, listWhales, getPicture } from "graphql/queries";
import { updatePicture } from "graphql/mutations";
import API, { graphqlOperation } from "@aws-amplify/api";
import { render } from "react-dom";
import Gallery from "react-grid-gallery";
import Snackbar from "@material-ui/core/Snackbar";

const dashboardRoutes = [];
const IMAGES = [];
class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      user: null,
      IMAGES: [],
      noData: false,
      selectedImages: [],
      dialogMessage: "",
    };
    this.onSelectImage = this.onSelectImage.bind(this);
    this.getSelectedImages = this.getSelectedImages.bind(this);

    if (props.match.params.whale_id) {
      this.state.searchInput = props.match.params.whale_id;
      this.searchWhales(this.state);
    }
    this.authenticate_user();
  }
  onSelectImage(index, image) {
    console.log("index", index);
    console.log("image", image);
    var images = this.state.IMAGES.slice();
    var img = images[index];
    if (img.hasOwnProperty("isSelected")) img.isSelected = !img.isSelected;
    else img.isSelected = true;
    this.setState({
      IMAGES: images,
    });
    console.log("state images", this.state.IMAGES);
  }

  async getSelectedImages() {
    try {
      let queryWasSuccess = false;
      console.log("setting whaleid of images -1 and is_new flag as false");
      for (var i = 0; i < this.state.IMAGES.length; i++) {
        if (this.state.IMAGES[i].isSelected == true) {
          console.log("rematching selected images", this.state.IMAGES[i].caption);
          const selected_image_name = this.state.IMAGES[i].caption;
          queryWasSuccess = await API.graphql(
            graphqlOperation(updatePicture, {
              input: { id: selected_image_name, is_new: 1, pictureWhaleId: -1 },
            })
          );
          if (queryWasSuccess) {
            console.log("Successfully assigned whales ", selected_image_name);
            this.showSnackBar("Picture '" + selected_image_name + "' can now be re-matched", 5000);
          }
        }
      }
      this.searchWhales(this.state);
    } catch (e) {
      console.log("error while re-setting whaleID and is_new flag");
    }
  }

  /**
   * A Snackbar with message will appear for timeout milliseconds.
   **/
  showSnackBar(message, timeout) {
    this.setState({
      dialogMessage: message,
    });
    setTimeout((_) => this.setState({ dialogMessage: "" }), timeout);
  }

  authenticate_user() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("searchpage user", user.username);
        this.setState({ user: user });
      })
      .catch((err) => {
        console.log("currentAuthenticatedUser searchpage err", err);
        this.props.history.push("/login-page");
      });
  }
  handleInputChange(event) {
    event.preventDefault();
    /*     console.log(event.target.name)
    console.log(event.target.value) */
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  async searchWhales(data) {
    let returnPath;
    try {
      const S3bucket = await Storage.get("");
      returnPath = S3bucket.split("public/")[0];
      console.log("search page bucket path", returnPath);
      const whale = await API.graphql(graphqlOperation(getWhale, { id: data.searchInput }));
      const pictures = await API.graphql(graphqlOperation(getPicture, { id: data.searchInput }));
      console.log("whale output aws", whale);
      console.log("pictures output aws", pictures);
      if (whale.data.getWhale) {
        console.log("whale ID output present. length", whale.data.getWhale.pictures.items.length);
        this.state.IMAGES = [];
        whale.data.getWhale.pictures.items.forEach((item) => {
          this.state.IMAGES.push(this.formatImages(item, data.searchInput, returnPath));
        });
        this.setState({ noData: false });
      } else if (pictures.data.getPicture) {
        console.log("pictures name output present. ", pictures.data.getPicture.id);
        this.state.IMAGES = [];
        this.state.IMAGES.push(
          this.formatImages(pictures.data.getPicture, pictures.data.getPicture.whale.id, returnPath)
        );
        this.setState({ noData: false });
      } else {
        console.log("pictures and whales both null output. ");
        this.setState({ noData: true, IMAGES: [] });
      }
    } catch (e) {
      this.setState({ noData: true, IMAGES: [] });
      console.log("no results found", e);
    }
  }
  async handleSubmit(event) {
    event.preventDefault();
    const data = this.state;
    console.log("state before submit", data);
    this.searchWhales(data);
    console.log("state after submit", this.state);
  }

  async handleAlternate(event) {
    event.preventDefault();
    const data = this.state;
    console.log("inside handleAlternate function");
    console.log("state before submit", data);
    let returnPath;
    try {
      const S3bucket = await Storage.get("");
      returnPath = S3bucket.split("public/")[0];
      console.log("search page bucket path", returnPath);
      const whale = await API.graphql(graphqlOperation(listWhales, { limit: 3000 }));
      console.log("whale output aws", whale);
      const whale_items = whale.data.listWhales.items;
      console.log("whale_items", whale_items);
      const randomID = whale_items[Math.floor(Math.random() * whale_items.length)];
      console.log("randomID", randomID);
      const random_whale = await API.graphql(graphqlOperation(getWhale, { id: randomID.name }));
      console.log("random_whale", random_whale);
      const picture_items = random_whale.data.getWhale.pictures.items;
      console.log("picture_items", picture_items);
      this.state.IMAGES = [];
      picture_items.forEach((item) => {
        this.state.IMAGES.push(this.formatImages(item, randomID.name, returnPath));
      });
      this.setState({ noData: false, searchInput: randomID.name });
    } catch (e) {
      this.setState({ noData: true, IMAGES: [] });
      console.log("no results found for random whale", e);
    }
    console.log("state after submit", this.state);
  }

  formatImages(item, whale_id, S3bucket) {
    console.log("fetching images array from S3", item);
    return {
      src: S3bucket + "cropped_images/" + item.filename,
      thumbnail: S3bucket + "cropped_images/" + item.filename,
      thumbnailWidth: 320,
      thumbnailHeight: 174,
      tags: [
        { value: item.filename, title: "File name" },
        { value: whale_id, title: "Whale ID" },
      ],
      caption: item.filename,
    };
  }
  render() {
    const { dialogMessage } = this.state;
    const { classes, ...rest } = this.props;
    const searchInput = this.state.searchInput;
    return (
      <div>
        <Header
          color="blue"
          brand={
            <img src="https://www.capgemini.com/de-de/wp-content/themes/capgemini-komposite/assets/images/logo.svg" />
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
          <div className={classes.container}>
            <div class="section container" style={{ paddingTop: "150px", paddingBottom: "5px" }}>
              <div class="row">
                <div class="col-12">
                  <div class="article-text">
                    <h2 style={{ paddingTop: "5px" }}>
                      <strong>Search Whale Image 🐳</strong>
                    </h2>
                    <p style={{ paddingBottom: "5px" }}>You can search for whale images using:</p>
                    <ul style={{ paddingBottom: "5px", color: "black" }}>
                      <li>
                        <strong>Search whale / image: </strong>This will display all whales tagged
                        to the given ID
                      </li>
                      <li>
                        <strong>Display random whale: </strong>This will display the images of a
                        random whale
                      </li>
                      <li>
                        <strong>Re-match whale: </strong>After searching for a whale ID you can
                        select one of the displayed pictures and remove the ID from it.
                        <br />
                        This way you will be able to re-match it again, in case of a
                        matching-mistake.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <input
              type="text"
              style={{ "text-align": "center", borderRadius: "5px" }}
              name="searchInput"
              placeholder="whale ID / image name"
              value={this.state.searchInput}
              onChange={this.handleInputChange.bind(this)}
              required
            />
            <Button
              onClick={this.handleSubmit.bind(this)}
              style={{ margin: "10px" }}
              variant="contained"
              color="info"
              size="sm"
            >
              Search Whale / Image
            </Button>
            <Button
              onClick={this.handleAlternate.bind(this)}
              style={{ margin: "10px" }}
              variant="contained"
              color="info"
              size="sm"
            >
              Display Random Whale
            </Button>
            <Button
              onClick={this.getSelectedImages.bind(this)}
              style={{ margin: "10px" }}
              variant="contained"
              color="info"
              size="sm"
            >
              Re-Match Whale
            </Button>
            <Gallery
              images={this.state.IMAGES}
              rowHeight={174}
              enableLightbox={true}
              backdropClosesModal
              onSelectImage={this.onSelectImage}
            />

            {this.state.noData && (
              <p style={{ color: "red" }}>No results found. Please try again.</p>
            )}
            <Snackbar open={dialogMessage !== ""} message={dialogMessage} autoHideDuration={4000} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
export default withStyles(landingPageStyle)(SearchPage);
