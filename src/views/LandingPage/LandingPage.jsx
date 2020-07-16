import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { logout } from "../../store/actions";

// @material-ui/icons

// core components
import CSVReader from "react-csv-reader";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import SetWhaleDialog from "components/CustomDialog/SetWhaleID.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Badge from "components/Badge/Badge.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Snackbar from "@material-ui/core/Snackbar";
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import LinearProgress from "@material-ui/core/LinearProgress";
import ImageWithInfoComponent from "components/ImageComponent/ImageWithInfoComponent.jsx";

import { connect } from "react-redux";

// Sections for this page
import ProductSection from "./Sections/ProductSection.jsx";
import TeamSection from "./Sections/TeamSection.jsx";
import WorkSection from "./Sections/WorkSection.jsx";

import ImagePicker from "react-image-picker";
import "react-image-picker/dist/index.css";
import Cookies from "utils/Cookies";
import { withAuthenticator, SignOut } from "aws-amplify-react";

//import images from local
import { MuiThemeProvider } from "@material-ui/core";

// aws stuff
import API, { graphqlOperation } from "@aws-amplify/api";
import PubSub from "@aws-amplify/pubsub";
import { createMatchingImage } from "graphql/mutations";
import { updateMatchingImage } from "graphql/mutations";
import { deleteMatchingImage } from "graphql/mutations";
import { createMatch } from "graphql/mutations";
import { listMatchingImages } from "graphql/queries";
import { listMatchs } from "graphql/queries";
import { getConfig } from "graphql/queries";
import { updateConfig } from "graphql/mutations";

import { getMatchingImage } from "graphql/queries";
import { getPicture } from "graphql/queries";
import { pictureByIsNew } from "graphql/queries";
import { getWhale } from "graphql/queries";
import { createWhale } from "graphql/mutations";
import { listWhales } from "graphql/queries";
import { createPicture } from "graphql/mutations";
import { updatePicture } from "graphql/mutations";
import { listEuclidianDistances } from "graphql/queries";

//import awsconfig from 'aws-exports';
import Amplify, { Storage } from "aws-amplify";
import { Auth } from "aws-amplify";

var imageList = [];

const papaparseOptions = {
  header: false,
  dynamicTyping: true,
  sokipEmptyLines: true,
  transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
};

const dashboardRoutes = [];

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      horizontal: 0,
      vertical: 0,
      dialogMessage: "",
      right_img: "",
      left_img: "",
      is_loaded: new Set(),
      matchedPictures: {},
      image_id: {},
      isMatched: "",
      user: null,
      similar_pictures: [""],
      newPicsList: [],
      simPicObj: undefined,
    };

    // BINDING FUNCTIONS
    this.acceptPicture = this.acceptPicture.bind(this);
    this.unacceptPicture = this.unacceptPicture.bind(this);

    this.go_up = this.go_up.bind(this);
    this.go_down = this.go_down.bind(this);
    this.go_left = this.go_left.bind(this);
    this.go_right = this.go_right.bind(this);

    this.onPick = this.onPick.bind(this);
    this.handleCsvData = this.handleCsvData.bind(this);
    this.fetchNewPicturesList = this.fetchNewPicturesList.bind(this);
    this.loadMatches = this.loadMatches.bind(this);

    this._handleKeyDown = this._handleKeyDown.bind(this);

    // function uses async code => no blocking
    this.authenticate_user();
  }

  go_badPicture() {
    console.log("bad picture code goes here");
  }
  go_newId() {
    console.log("new id code goes here");
  }
  go_manualId(pId) {
    console.log("manual id code goes here, id: " + pId);
    const vert = this.state.vertical;
    const leftImgFileName = this.state.newPicsList[vert].id;

    /*API.graphql(
      graphqlOperation(updatePicture, { input: { id: leftImgFileName, pictureWhaleId: pId } })
    );*/

    const updatedList = [...this.state.newPicsList];
    updatedList[vert].whale.id = pId;
    this.setState({ newPicsList: updatedList });
  }

  authenticate_user() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("MATCHINGPAGE user", user, user.username);
        this.setState({ user: user.username });
      })
      .catch((err) => console.log("currentAuthenticatedUser err", err));
  }

  go_left() {
    this.setState({ simPicObj: undefined, horizontal: Math.max(0, this.state.horizontal - 1) });
  }
  go_up() {
    this.setState({
      simPicObj: undefined,
      vertical: Math.max(0, this.state.vertical - 1),
      horizontal: 0,
    });
  }
  go_down() {
    this.setState({
      simPicObj: undefined,
      vertical: Math.min(this.state.newPicsList.length - 1, this.state.vertical + 1),
      horizontal: 0,
    });
  }
  go_right() {
    this.setState({
      simPicObj: undefined,
      horizontal: Math.min(this.state.similar_pictures.length - 1, this.state.horizontal + 1),
    });
  }

  getCurrentNamesIds() {
    const leftPicObj = this.state.newPicsList[this.state.vertical];
    const rightPicObj = this.state.newPicsList[this.state.horizontal];
    const leftImgName = leftPicObj.id;
    const rightImgName = rightPicObj.id;
    const leftWhaleId = leftPicObj.whale.id;
    const rightWhaleId = rightPicObj.whale.id;

    return [leftImgName, rightImgName, leftWhaleId, rightWhaleId];
  }

  acceptPicture() {
    const [left_img_name, right_img_name, leftWhaleId, rightWhaleId] = this.getCurrentNamesIds();

    console.log("left_img_name is: ", left_img_name);
    console.log("right_image is: ", right_img_name);
    console.log("ismached", this.state.isMatched);
    this.setState((prevState) => {
      if (prevState.matchedPictures[left_img_name] == undefined) {
        prevState.matchedPictures[left_img_name] = new Set([right_img_name]);

        //API.graphql(graphqlOperation(createMatchingImage, { input: { image: {name: left_img_name}, matchingImages: {name: right_img_name} }} )).then( () => console.log("created matching image"));

        //API.graphql(graphqlOperation(updatePicture, {input:  {id: left_img_name, pictureWhaleId: rightWhaleId}}));
        //API.graphql(graphqlOperation(updatePicture, {input:  {id: rightWhaleId, filename: left_img_name}})).then(() => console.log("created matching image")).catch(err => console.log(err));;
        //API.graphql(graphqlOperation(createMatch, {input: { matchPicture1Id: left_img_name, matchPicture2Id: right_img_name, match_status: "match" }} )).then( () => {console.log("created matching image");this.handleCsvData();});
      } else {
        prevState.matchedPictures[left_img_name].add(right_img_name);
        console.log(
          "prevState.matchedPictures[left_img_name])::: ",
          prevState.matchedPictures[left_img_name]
        );
        console.log("added_arry:", Array.from(prevState.matchedPictures[left_img_name]));
      }
      if (parseInt(rightWhaleId) < parseInt(leftWhaleId)) {
        // assign all pictures of the left id the right id
        API.graphql(graphqlOperation(getWhale, { id: leftWhaleId })).then((pictures) =>
          pictures.data.getWhale.pictures.items.forEach((picture) =>
            API.graphql(
              graphqlOperation(updatePicture, {
                input: { id: picture.id, pictureWhaleId: rightWhaleId },
              })
            )
          )
        );
        this.setState({
          dialogMessage: "Assigned all whales with id " + leftWhaleId + " the id " + rightWhaleId,
        });
        setTimeout((_) => this.setState({ dialogMessage: "" }), 2000);
      }
      if (parseInt(leftWhaleId) < parseInt(rightWhaleId)) {
        // assign all pictures of the right id the left id
        API.graphql(graphqlOperation(getWhale, { id: rightWhaleId })).then((pictures) =>
          pictures.data.getWhale.pictures.items.forEach((picture) =>
            API.graphql(
              graphqlOperation(updatePicture, {
                input: { id: picture.id, pictureWhaleId: leftWhaleId },
              })
            )
          )
        );
        this.setState({
          dialogMessage: "Assigned all whales with id " + rightWhaleId + " the id " + leftWhaleId,
        });
        setTimeout((_) => this.setState({ dialogMessage: "" }), 2000);
      }
      API.graphql(graphqlOperation(updatePicture, { input: { id: left_img_name, is_new: 1 } }));
      console.log("returning matched pictures", prevState.matchedPictures);
      return { matchedPictures: prevState.matchedPictures };
    });
    if (left_img_name && right_img_name) {
      console.log("commented");
      //   const url = 'http://localhost:3000/accept/' + left_img_name + '/' + right_img_name;
      //   var _this = this;
      //   fetch(url, { credentials: "same-origin", 'headers': { 'Authorization': 'Bearer ' + Cookies.read('token') } })
      //     .then(function (response) {
      //       if (response.ok) {
      //         return response.text();
      //       }
      //       if (response.status == 401) { _this.props.dispatch(logout()) };
      //       throw new Error('Error message.');
      //     })
      //     .then(function (data) {
      //       _this.setState({ dialogMessage: "Picture combination saved!" });
      //       setTimeout(_ => _this.setState({ dialogMessage: "" }), 1000);

      //     })
      //     .catch(function (err) {
      //       console.log("failed to load ", url, err.message);
      //     });
      // }
    }
  }

  unacceptPicture() {
    const [left_img_name, right_img_name, leftWhaleId, rightWhaleId] = this.getCurrentNamesIds();

    this.setState((prevState) => {
      console.log("left img id: ", prevState.image_id[left_img_name]);
      prevState.matchedPictures[left_img_name].delete(right_img_name);
      console.log("array after deletion", prevState.matchedPictures[left_img_name]);
      //API.graphql(graphqlOperation(updateMatchingImage, {input: {id: prevState.image_id[left_img_name], image:  {name: left_img_name}, matchingImages: {name: Array.from(prevState.matchedPictures[left_img_name])} }} )).then( () => console.log("deletin matching image")).catch(err => console.log(err));
      API.graphql(
        graphqlOperation(createMatch, {
          input: {
            matchPicture1Id: left_img_name,
            matchPicture2Id: right_img_name,
            match_status: "match",
          },
        })
      ).then(() => {
        console.log("created matching image");
        this.handleCsvData();
      });

      return prevState.matchedPictures;
    });

    if (leftWhaleId != rightWhaleId) {
      API.graphql(graphqlOperation(getConfig, { id: "maxWhaleId" })).then((result) => {
        const maxWhaleId = result.data.getConfig.value;
        const newMaxWhaleId = (parseInt(maxWhaleId) + 1).toString();
        const left_img_name = this.state.newPicsList[this.state.vertical];
        API.graphql(
          graphqlOperation(createWhale, { input: { id: maxWhaleId, name: maxWhaleId } })
        ).then((result) =>
          API.graphql(
            graphqlOperation(updatePicture, {
              input: { id: left_img_name, pictureWhaleId: maxWhaleId },
            })
          )
        );

        API.graphql(
          graphqlOperation(updateConfig, { input: { id: "maxWhaleId", value: newMaxWhaleId } })
        );
      });
    }

    if (left_img_name && right_img_name) {
      // const url = 'http://localhost:3000/unaccept/' + left_img_name + '/' + right_img_name;
      // var _this = this;
      // fetch(url, { credentials: "same-origin", 'headers': { 'Authorization': 'Bearer ' + Cookies.read('token') } })
      //   .then(function (response) {
      //     if (response.ok) {
      //       return response.text();
      //     }
      //     if (response.status == 401) { _this.props.dispatch(logout()) };
      //     throw new Error('Error message.');
      //   })
      //   .then(function (data) {
      //     _this.setState({ dialogMessage: "Picture combination removed!" });
      //     setTimeout(_ => _this.setState({ dialogMessage: "" }), 1000);
      //   })
      //   .catch(function (err) {
      //     console.log("failed to load ", url, err.message);
      //   });
    }
  }

  navigationAction(direction) {
    let withOutError = true;
    switch (direction) {
      case "left":
        this.go_left();
        break;
      case "right":
        this.go_right();
        break;
      case "down":
        this.go_down();
        break;
      case "up":
        this.go_up();
        break;
      default:
        withOutError = false;
        break;
    }

    /*withOutError
      ? this.handleCsvData()
      : console.log("Error in navigationAction: Couldn't find case: " + direction);*/
  }

  _handleKeyDown = (event) => {
    const LEFT_ARROW_KEY = 37;
    const UP_ARROW_KEY = 38;
    const RIGHT_ARROW_KEY = 39;
    const DOWN_ARROW_KEY = 40;
    const M_KEY = 77;
    const U_KEY = 85;

    //console.log(event);
    switch (event.keyCode) {
      case M_KEY:
        const left_img = this.state.newPicsList[this.state.vertical];
        const right_img = this.state.similar_pictures[this.state.horizontal];
        if (
          left_img in this.state.matchedPictures &&
          this.state.matchedPictures[left_img].has(right_img)
        ) {
          this.unacceptPicture();
        } else {
          this.acceptPicture();
        }
        break;
      case LEFT_ARROW_KEY:
        this.go_left();

        break;
      case RIGHT_ARROW_KEY:
        this.go_right();

        break;
      case DOWN_ARROW_KEY:
        this.go_down();
        break;
      case UP_ARROW_KEY:
        this.go_up();

        break;
      default:
        break;
    }
  };

  // componentWillMount deprecated in React 16.3
  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);

    this.fetchNewPicturesList(undefined, [], 0);
    this.loadMatches();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.newPicsList !== this.state.newPicsList) {
      console.log("IN UPDATE");
      console.log(prevState.newPicsList);
      console.log(this.state.newPicsList);
      const fetchedSimPics = this.fetchSimilarPictures();
      this.processNewSimilarPics(await fetchedSimPics);
    }

    if (prevState.vertical !== this.state.vertical) {
      this.processNewSimilarPics(await this.fetchSimilarPictures());
    } else if (prevState.horizontal !== this.state.horizontal) {
      /* this means vertical didn't change, only horizontal did */
      const newSimPic = this.fetchPictureObject(this.state.similar_pictures[this.state.horizontal]);
      this.processNewSimPicObj(await newSimPic);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  onPick(image) {
    this.handleCsvData();
    this.setState({ image: null });
  }

  handleCsvData() {
    const currentImgIdLeft = this.state.newPicsList[this.state.vertical].id;
    const currentImgIdRight = this.state.similar_pictures[this.state.horizontal];
    // TODO add functionality to differentiate between the left and right side to optimize performance
    /*API.graphql(graphqlOperation(getPicture, { id: currentImgIdLeft })).then((picture) => {
      console.log("get picture left" + picture.data.getPicture);
      console.log(picture.data.getPicture);
      this.setState({ leftWhaleId: picture.data.getPicture.whale.id });
    });
    API.graphql(graphqlOperation(getPicture, { id: currentImgIdRight })).then((picture) => {
      console.log("get picture right");
      console.log(picture);
      this.setState({ rightWhaleId: picture.data.getPicture.whale.id }, (_) =>
        console.log(picture.data.getPicture.whale)
      );
    });*/

    // is isMatched still needed?
    /*this.setState(
      {
        isMatched:
          this.state.newPicsList[this.state.vertical].id in this.state.matchedPictures &&
          Array.from(this.state.matchedPictures[this.state.newPicsList[this.state.vertical].id])
            .join()
            .includes(this.state.similar_pictures[this.state.horizontal]),
      },
      (data) => console.log(data)
    );*/
    this.fetchSimilarPictures();
  }

  async fetchSimilarPictures() {
    // TODO add second request with picture2 and add pictures
    let returnValue = undefined;
    console.log("IN fetchSimilar");
    console.log(this.state.newPicsList[this.state.vertical].id);
    try {
      const result = await API.graphql(
        graphqlOperation(listEuclidianDistances, {
          picture1: this.state.newPicsList[this.state.vertical].id,
          limit: 5000,
        })
      );
      console.log("got result");
      console.log(result);
      let pictures = [];
      result.data.listEuclidianDistances.items
        .sort((a, b) => a.distance - b.distance)
        .forEach((picture) => pictures.push(picture.picture2));

      console.log(pictures);
      returnValue = pictures;
      console.log(returnValue);
    } catch (error) {
      console.log("ERROR IN fetchSimilarPictures");
      console.log(error);
      returnValue = -1;
    }

    return new Promise((resolve) => {
      setTimeout(function() {
        resolve(returnValue); // Rückgabewert der Funktion
        console.log("Promise returned");
        console.log(returnValue);
      });
    });
  }

  async processNewSimilarPics(picArray) {
    console.log("IN processNewSimilarPics");
    if (picArray !== -1 && picArray.length >= 1) {
      const simPicObjTemp = this.fetchPictureObject(picArray[this.state.horizontal]);
      this.processNewSimPicObj(await simPicObjTemp);
      this.setState({ similar_pictures: picArray });
    }
  }

  processNewSimPicObj(simPicObjNew) {
    if (simPicObjNew !== -1) {
      console.log("AFTER await");
      console.log(simPicObjNew);
      this.setState({ simPicObj: simPicObjNew });
    }
  }

  async fetchPictureObject(picId) {
    console.log("AT BEGINNING OF FETCHPICTUREOBJECT");
    let returnValue = undefined;
    try {
      const result = await API.graphql(graphqlOperation(getPicture, { id: picId }));
      console.log("PROCESS PIC OBJ RESULT");
      console.log(result);
      returnValue = result.data.getPicture;
    } catch (error) {
      console.log("IN CATCH");
      console.log(error);
      returnValue = -1;
    }

    return new Promise((resolve) => {
      resolve(returnValue); // Rückgabewert der Funktion
      console.log("Promise returned");
      console.log(returnValue);
    });
  }

  async fetchNewPicturesList(nextToken, pics, numReq) {
    console.log("AT BEGINNING OF FETCHNEWPICTURESLIST");
    try {
      const result = await API.graphql(
        graphqlOperation(pictureByIsNew, { is_new: 1, limit: 2000, nextToken: nextToken })
      );
      result.data.PictureByIsNew.items.forEach((picItem) => pics.push(picItem));
      nextToken = result.data.PictureByIsNew.nextToken;

      console.log("IN PROCESSING - SETTING STATE");
      console.log(pics);
      this.setState({ newPicsList: pics });
    } catch (error) {
      console.log("IN CATCH");
      console.log(error);
    }
  }

  loadMatches = () => {
    API.graphql(graphqlOperation(listMatchs)).then((response) => {
      console.log(response);
      const imgArr = {};
      response.data.listMatchs.items.forEach((match) => {
        if (match.picture1.filename in imgArr) {
        } else {
          imgArr[match.picture1.filename] = new Set();
        }
        imgArr[match.picture1.filename].add(match.picture2.filename);
      });

      this.setState({ matchedPictures: imgArr });
    });
  };

  render() {
    const { classes, ...rest } = this.props;
    const { dialogMessage } = this.state;

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

        <div className={classes.container}>
          <div class="section container" style={{ paddingTop: "150px", paddingBottom: "5px" }}>
            <div class="row">
              <div class="col-12">
                <div class="article-text">
                  <h2 style={{ paddingTop: "5px" }}>
                    <strong>Do these whales match?</strong>
                  </h2>
                </div>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} space={10}>
                    <br />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <LinearProgress
                      variant="determinate"
                      value={(this.state.vertical / (this.state.newPicsList.length - 1)) * 100}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (this.state.horizontal / (this.state.similar_pictures.length - 1)) * 100
                      }
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} style={{ color: "black" }}>
                    <strong>New Image Number: </strong>
                    <Badge color="success">{this.state.vertical}</Badge>
                    <br />
                    <br />
                    <ImageWithInfoComponent picObj={this.state.newPicsList[this.state.vertical]} />
                    <br />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} style={{ color: "black" }}>
                    <strong>Best Matching Picture Number:</strong>
                    <Badge color="success">{this.state.horizontal}</Badge>
                    <br />
                    <br />
                    <ImageWithInfoComponent picObj={this.state.simPicObj} />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <Button
                      variant="contained"
                      onClick={() => this.navigationAction("up")}
                      color="info"
                      size="sm"
                    >
                      &#9650;
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => this.navigationAction("down")}
                      color="info"
                      size="sm"
                    >
                      &#9660;
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => this.go_badPicture()}
                      color="badPicture"
                      size="sm"
                    >
                      Bad picture
                    </Button>
                    <SetWhaleDialog function={this.go_manualId.bind(this)}></SetWhaleDialog>
                    <div>
                      <ImagePicker
                        images={imageList.map((image, i) => ({ src: image, value: i }))}
                        onPick={this.onPick}
                        onLoad="console.log('loaded onPick')"
                      />
                    </div>
                    <Snackbar
                      open={dialogMessage !== ""}
                      message={dialogMessage}
                      autoHideDuration={4000}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    {/*  new buttons for the matching result */}
                    <Button
                      disabled={
                        this.state.user == "LisaSteiner" || this.state.user == "whalewatching"
                          ? false
                          : true
                      }
                      variant="contained"
                      onClick={() => this.acceptPicture()}
                      color="success"
                      /* color={this.state.isMatched ? "grey" : "success"} disabled = {this.state.isMatched} */ size="sm"
                    >
                      Match
                    </Button>
                    <Button
                      disabled={
                        this.state.user == "LisaSteiner" || this.state.user == "whalewatching"
                          ? false
                          : true
                      }
                      variant="contained"
                      onClick={() => this.unacceptPicture()}
                      color="info"
                      /* color={this.state.isMatched ? "warning" : "grey"}  disabled = {!this.state.isMatched} */ size="sm"
                    >
                      Don't match
                    </Button>
                    {/*               <Button variant="contained" onClick={() => this.go_decideLater()}color="decideLater" size="sm">Decide later</Button> */}
                    {/*               <Button variant="contained" onClick={() => this.go_newId()}color="newId" size="sm">New ID</Button> */}
                    <br />
                    {/*  next pictures */}
                    <Button
                      variant="contained"
                      onClick={() => this.navigationAction("left")}
                      color="info"
                      size="sm"
                    >
                      &#9664;
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => this.navigationAction("right")}
                      color="info"
                      size="sm"
                    >
                      &#10148;
                    </Button>
                    {/*               <Button variant="contained" onClick={() => this.signout()}color="info" size="sm">Signout</Button>
              <SignOut/> */}
                    {/*        <Button variant="contained" onClick={() => this.signout()}color="info" size="sm">Log Out</Button>
                            <SignOut/> */}
                  </GridItem>
                  <br />
                </GridContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const LandingPageContainer = connect((dispatch) => ({ dispatch }))(LandingPage);
export default withStyles(landingPageStyle)(LandingPageContainer);
