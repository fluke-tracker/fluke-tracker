import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Header from "components/Header/Header.jsx";
import SetMaxWhaleIdAutoDialog from "components/CustomDialog/SetMaxWhaleIdAutoDialog.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Badge from "components/Badge/Badge.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Snackbar from "@material-ui/core/Snackbar";
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import ImageWithInfoComponent from "components/ImageComponent/ImageWithInfoComponent.jsx";

import { connect } from "react-redux";

import "react-image-picker/dist/index.css";

// aws stuff
import API, { graphqlOperation } from "@aws-amplify/api";

// graphql stuff
import { getConfig, getWhale } from "graphql/queries";
import { createMatch, createWhale, updateConfig, updatePicture } from "graphql/mutations";
import { pictureByIsNewFiltered, getPictureFiltered } from "graphql/customQueries";
import { listEuclidianDistances, euclidianDistanceByPicture2 } from "graphql/queries";

import { Auth } from "aws-amplify";

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      horizontal: 0,
      vertical: 0,
      dialogMessage: "",
      user: null,
      similar_pictures: [undefined],
      newPicsList: [],
      simPicObj: undefined,
      // first array value represents left img, second one the right img
      picsLoaded: [false, false],
    };

    // BINDING FUNCTIONS
    this.matchPicture = this.matchPicture.bind(this);
    this.unmatchPictures = this.unmatchPictures.bind(this);

    this.go_manualId = this.go_manualId.bind(this);

    this.go_up = this.go_up.bind(this);
    this.go_down = this.go_down.bind(this);
    this.go_left = this.go_left.bind(this);
    this.go_right = this.go_right.bind(this);

    this.fetchNewPicturesList = this.fetchNewPicturesList.bind(this);
    this.picLoadHandler = this.picLoadHandler.bind(this);

    this._handleKeyDown = this._handleKeyDown.bind(this);

    // function uses async code => no blocking
    this.authenticate_user();
  }

  authenticate_user() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("MATCHINGPAGE user", user, user.username);
        this.setState({ user: user.username });
      })
      .catch((err) => {
        console.log("currentAuthenticatedUser landing page err redirect to login", err);
        this.props.history.push("/login-page");
      });
  }

  /**
   * This function is passed to the components that are loading the actual image.
   * These components will then call this function so we can activate the matching buttons accordingly.
   */
  picLoadHandler(filename) {
    console.log("NOTIFY HANDLER CALLED");
    // check if left image was the loaded one
    if (filename === this.state.newPicsList[this.state.vertical].filename) {
      this.setState({ picsLoaded: [true, this.state.picsLoaded[1]] });
    }
    // check if right image was the loaded one
    else if (
      typeof this.state.simPicObj !== "undefined" &&
      filename === this.state.simPicObj.filename
    ) {
      this.setState({ picsLoaded: [this.state.picsLoaded[0], true] });
    }
  }

  async go_manualId(pId) {
    console.log("IN goManualId");
    const leftImgFileName = this.state.newPicsList[this.state.vertical].id;
    const idOrFalse = await this.createAndAssignNewWhaleId(leftImgFileName);

    if (idOrFalse === false) {
      this.showSnackBar("Ooops, an error occured! Please try again!", 5000);
    } else {
      this.showSnackBar(
        "Successfully created and assigned whale ID " +
          idOrFalse +
          " to picture " +
          leftImgFileName,
        5000
      );
    }
    this.fetchNewPicturesList(undefined, [], 0);
  }

  go_badPicture() {
    console.log("bad picture code goes here");
  }

  go_left() {
    if (this.state.horizontal > 0) {
      this.setState({
        picsLoaded: [this.state.picsLoaded[0], false],
        simPicObj: undefined,
        horizontal: this.state.horizontal - 1,
      });
    }
  }
  go_up() {
    if (this.state.vertical > 0) {
      this.setState({
        picsLoaded: [false, false],
        simPicObj: undefined,
        similar_pictures: [undefined],
        vertical: this.state.vertical - 1,
        horizontal: 0,
      });
    }
  }
  go_down() {
    if (this.state.vertical < this.state.newPicsList.length - 1) {
      this.setState({
        picsLoaded: [false, false],
        simPicObj: undefined,
        similar_pictures: [undefined],
        vertical: this.state.vertical + 1,
        horizontal: 0,
      });
    }
  }
  go_right() {
    if (this.state.horizontal < this.state.similar_pictures.length - 1) {
      this.setState({
        picsLoaded: [this.state.picsLoaded[0], false],
        simPicObj: undefined,
        horizontal: Math.min(this.state.similar_pictures.length - 1, this.state.horizontal + 1),
      });
    }
  }

  /**
   * 1. Creates new whale entry with the current max whale ID
   * 2. Updates the picture ID to the max whale ID
   * 3. Increments the max whale ID by one
   *
   * The awaits in the first two graphQL calls are necessary to ensure data consistency.
   *
   * @param {string} picFileName
   */
  async createAndAssignNewWhaleId(picFileName) {
    let idOrFalse;
    try {
      // look up current max whale ID
      const result = await API.graphql(graphqlOperation(getConfig, { id: "maxWhaleId" }));
      const currentMaxWhaleId = result.data.getConfig.value;

      // create new whale with the current max whale ID
      await API.graphql(
        graphqlOperation(createWhale, { input: { id: currentMaxWhaleId, name: currentMaxWhaleId } })
      );

      //update picture with ID of the newly created whale
      await API.graphql(
        graphqlOperation(updatePicture, {
          input: { id: picFileName, is_new: 0, pictureWhaleId: currentMaxWhaleId },
        })
      );
      idOrFalse = currentMaxWhaleId;

      // increment max whale id
      const newMaxWhaleId = (parseInt(currentMaxWhaleId) + 1).toString();
      API.graphql(
        graphqlOperation(updateConfig, { input: { id: "maxWhaleId", value: newMaxWhaleId } })
      );
    } catch (error) {
      idOrFalse = false;
      console.log("ERROR in createAndAssignNewWhaleId: ", error);
    }

    return new Promise((resolve) => {
      resolve(idOrFalse); // Rückgabewert der Funktion
      console.log("Promise returned: ", idOrFalse);
    });
  }

  /**
   * Returns the ID's and names of the left and right whale / picture.
   */
  getCurrentNamesIds() {
    const leftPicObj = this.state.newPicsList[this.state.vertical];
    const rightPicObj = this.state.simPicObj;
    const leftImgName = leftPicObj.id;
    const rightImgName = rightPicObj.id;
    const leftWhaleId = leftPicObj.whale.id;
    const rightWhaleId = rightPicObj.whale.id;

    return [leftImgName, rightImgName, leftWhaleId, rightWhaleId];
  }

  async matchPicture() {
    const [left_img_name, right_img_name, leftWhaleId, rightWhaleId] = this.getCurrentNamesIds();

    console.log("left_img_name is: ", left_img_name, "left id is: ", leftWhaleId);
    console.log("right_image is: ", right_img_name, "right id is: ", rightWhaleId);

    let queryWasSuccess = false;
    if (parseInt(leftWhaleId) === -1 || parseInt(rightWhaleId) < parseInt(leftWhaleId)) {
      // assign all pictures with the left id the right id
      queryWasSuccess = await this.changeWhaleIdOfPictures(leftWhaleId, rightWhaleId);
      if (queryWasSuccess) {
        this.showSnackBarAssignedIds(leftWhaleId, rightWhaleId);
      } else {
        this.showSnackBar("Oops! An error occured! Please try again!", 5000);
      }
    } else if (parseInt(leftWhaleId) < parseInt(rightWhaleId)) {
      // assign all pictures with the right id the left id
      queryWasSuccess = await this.changeWhaleIdOfPictures(rightWhaleId, leftWhaleId);
      if (queryWasSuccess) {
        this.showSnackBarAssignedIds(rightWhaleId, leftWhaleId);
      } else {
        this.showSnackBar("Oops! An error occured! Please try again!", 5000);
      }
    }

    // make sure that is_new is only set if everything was successful (NOTE that this if also implicitly check left != right)
    if (queryWasSuccess) {
      // we need to be sure that the updatePicture operation finished before starting the fetchNewPicturesList function
      await API.graphql(
        graphqlOperation(updatePicture, { input: { id: left_img_name, is_new: 0 } })
      );
      this.fetchNewPicturesList(undefined, [], 0);
    }
  }

  /**
   * This function assigns the toId to every picture object that currently holds fromId as its whaleId.
   * In case of fromId being -1 we only change the ID of the picture currently displayed as it was not attached to a
   * "real" whale yet and therefore would break the DB if assigning the new ID to every -1 picture.
   *
   * @param {number} fromId ID that should be changed
   * @param {number} toId ID the fromId should be changed to
   */
  async changeWhaleIdOfPictures(fromId, toId) {
    console.log("IN changeWhaleIdOfPictures");
    let successfulOp = false;
    try {
      let resultsPromiseArray = [];
      // -1 has to be handled specially to only set the ID of one picture and not every picture that has -1 as whale ID
      if (fromId == -1) {
        console.log("IN -1 case");
        if (toId != -1) {
          // NOTE this only works if we can be sure that on the right side can't be any picture displayed with is_new = 1
          const picObjId = this.state.newPicsList[this.state.vertical].id;
          resultsPromiseArray.push(
            API.graphql(
              graphqlOperation(updatePicture, {
                input: { id: picObjId, pictureWhaleId: toId },
              })
            )
          );
        } else {
          // handle the case when on the right side is an image with ID = -1
          // -> get the current max ID and assign it to both images
          // 1. give right pic a new ID
          // 2. do a recursive call with the new right ID
          // 3. -> successful end
        }
      } else {
        console.log("IN NOT -1 case");
        const whaleObjs = await API.graphql(graphqlOperation(getWhale, { id: fromId }));
        whaleObjs.data.getWhale.pictures.items.forEach((picture) => {
          resultsPromiseArray.push(
            API.graphql(
              graphqlOperation(updatePicture, {
                input: { id: picture.id, pictureWhaleId: toId },
              })
            )
          );
        });
      }
      console.log("AFTER GRAPHQL query");

      // all the update operations are send to the DB and then await Promise.all() waits for all of them to finish
      await Promise.all(resultsPromiseArray);
      console.log("AFTER Promise.all ", resultsPromiseArray);
      successfulOp = true;
    } catch (error) {
      console.log("ERROR in DB queries in changeWhaleIdOfPictures: ", error);
    }

    console.log("END of changeWhaleIdOfPictures");
    return new Promise((resolve) => {
      resolve(successfulOp); // Rückgabewert der Funktion
      console.log("Promise returned: ", successfulOp);
    });
  }

  showSnackBarAssignedIds(fromId, toId) {
    if (fromId != -1) {
      this.showSnackBar(
        "Successfully assigned all whales with ID " + fromId + " the ID " + toId,
        5000
      );
    } else {
      this.showSnackBar("Successfully assigned whale ID " + toId, 5000);
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

  unmatchPictures() {
    const [left_img_name, right_img_name, leftWhaleId, rightWhaleId] = this.getCurrentNamesIds();

    // to have a unique ID with concatenate the two file names
    const constructedId = left_img_name + "_" + right_img_name;
    API.graphql(
      graphqlOperation(createMatch, {
        input: {
          id: constructedId,
          matchPicture1Id: left_img_name,
          matchPicture2Id: right_img_name,
          match_status: "no_match",
        },
      })
    ).then(() => {
      console.log("Created a new 'NO MATCH' pair");
      this.showSnackBar("Successfully saved 'no match' between the two pictures", 5000);
    });

    // this can never happen due to the fact that a picture with an assigned ID won't be on the left side
    /*
    if (leftWhaleId == rightWhaleId) {
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
    }*/
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
        console.log("Error in navigationAction: Couldn't find case: " + direction);
        break;
    }
  }

  _handleKeyDown = (event) => {
    const LEFT_ARROW_KEY = 37;
    const UP_ARROW_KEY = 38;
    const RIGHT_ARROW_KEY = 39;
    const DOWN_ARROW_KEY = 40;
    const M_KEY = 77;
    const U_KEY = 85;

    switch (event.keyCode) {
      case M_KEY:
        this.matchPicture();
        break;
      case U_KEY:
        this.unmatchPictures();
        this.navigationAction("right");
        break;
      case LEFT_ARROW_KEY:
        this.navigationAction("left");
        break;
      case RIGHT_ARROW_KEY:
        this.navigationAction("right");
        break;
      case DOWN_ARROW_KEY:
        this.navigationAction("down");
        break;
      case UP_ARROW_KEY:
        this.navigationAction("up");
        break;
      default:
        console.log("WARNING! Key code of pressed key did not match.");
        break;
    }
  };

  // componentWillMount deprecated in React 16.3
  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);

    this.fetchNewPicturesList(undefined, [], 0);
  }

  async componentDidUpdate(prevProps, prevState) {
    console.log("IN UPDATE");
    console.log(prevState);
    console.log(this.state);

    // will be entered every time a match happened / the whole page was refreshed
    if (prevState.newPicsList !== this.state.newPicsList) {
      console.log("IN newPicsList UPDATE");

      this.doubleCheckVertical();
      const fetchedSimPics = this.fetchSimilarPictures();
      this.processNewSimilarPics(await fetchedSimPics);
    }

    if (prevState.vertical !== this.state.vertical) {
      console.log("IN VERTICAL CHANGE");
      this.processNewSimilarPics(await this.fetchSimilarPictures());
    } else if (prevState.horizontal !== this.state.horizontal) {
      console.log("IN HORIZONTAL CHANGE");
      /* this means vertical didn't change, only horizontal did */
      const newSimPic = this.fetchPictureObject(
        this.state.similar_pictures[this.state.horizontal].simPicName
      );
      this.processNewSimPicObj(await newSimPic);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  /**
   * Makes sure that this.state.vertical does not become greater than the length of the array.
   * This could happen when matching an image that then disappears from the left side.
   */
  doubleCheckVertical() {
    const vert = this.state.vertical;
    if (vert !== Math.min(vert, this.state.newPicsList.length)) {
      this.setState({
        vertical: Math.min(vert, this.state.newPicsList.length),
      });
    }
  }

  /**
   * Executes two listEuclidianDistances graphQL-queries: One with the leftImgId as picture1; one with the leftImgId as picture2
   * Then concatenates and sorts the two result-arrays and shortens the concatenation to the 100 most similar pictures (smallest distance).
   * Returns this array as a Promise.
   */
  async fetchSimilarPictures() {
    // TODO activate second request with picture2 and add pictures
    let returnValue = undefined;
    const leftImgId = this.state.newPicsList[this.state.vertical].id;
    console.log("IN fetchSimilar");
    console.log(leftImgId);
    try {
      // query where picture1 = leftImgId
      const query1 = API.graphql(
        graphqlOperation(listEuclidianDistances, {
          picture1: leftImgId,
          limit: 5000,
        })
      );
      //query where picture2 = leftImgId
      /*const query2 = API.graphql(
        graphqlOperation(euclidianDistanceByPicture2, {
          picture2: leftImgId,
          limit: 5000,
        })
      );*/

      const result1 = await query1;
      //const result2 = await query2;

      console.log("GOT result1");
      console.log(result1);
      console.log("GOT result2");
      //console.log(result2);

      // concatinate both arrays
      let resultsAllItems = await result1.data.listEuclidianDistances.items.concat(
        //result2.data.listEuclidianDistances.items
        []
      );

      resultsAllItems.sort((a, b) => a.distance - b.distance);
      let resultsFirst100 = resultsAllItems.slice(0, 100);

      let filteredFirst100 = [];
      // extract only the relevant file name out of the tupel
      resultsFirst100.forEach((elem) => {
        if (elem.picture1 === leftImgId) {
          filteredFirst100.push({ simPicName: elem.picture2, distance: elem.distance });
        } else {
          filteredFirst100.push({ simPicName: elem.picture1, distance: elem.distance });
        }
      });

      returnValue = filteredFirst100;
    } catch (error) {
      console.log("ERROR IN fetchSimilarPictures");
      console.log(error);
      returnValue = -1;
    }

    return new Promise((resolve) => {
      resolve(returnValue); // Rückgabewert der Funktion
      console.log("Promise returned");
      console.log(returnValue);
    });
  }

  async processNewSimilarPics(picArray) {
    console.log("IN processNewSimilarPics");
    if (picArray !== -1) {
      if (picArray.length >= 1) {
        const simPicObjTemp = await this.fetchPictureObject(
          picArray[this.state.horizontal].simPicName
        );
        if (simPicObjTemp !== -1) {
          this.setState({ similar_pictures: picArray, simPicObj: simPicObjTemp });
        }
      } else {
        this.setState({ similar_pictures: picArray });
      }
    }
  }

  processNewSimPicObj(simPicObjNew) {
    if (simPicObjNew !== -1) {
      console.log("PROCESS NEW SIM PIC", simPicObjNew);
      this.setState({ simPicObj: simPicObjNew });
    }
  }

  async fetchPictureObject(picId) {
    console.log("AT BEGINNING OF FETCHPICTUREOBJECT");
    let returnValue = undefined;
    try {
      const result = await API.graphql(graphqlOperation(getPictureFiltered, { id: picId }));
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
        // retrieving only the necessary information, therefore using the pictureByIsNewFiltered query
        graphqlOperation(pictureByIsNewFiltered, { is_new: 1, limit: 2000, nextToken: nextToken })
      );
      result.data.PictureByIsNew.items.forEach((picItem) => pics.push(picItem));
      nextToken = result.data.PictureByIsNew.nextToken;

      console.log("IN PROCESSING - SETTING STATE");
      console.log(pics);
      this.setState({ similar_pictures: [undefined], newPicsList: pics });
    } catch (error) {
      console.log("IN CATCH");
      console.log(error);
    }
  }

  render() {
    console.log("IN RENDER", this.state);

    const { classes, ...rest } = this.props;
    const { dialogMessage } = this.state;

    const admins = new Set(["LisaSteiner", "whalewatching"]);
    const adminFlag = admins.has(this.state.user) ? true : false;

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
                        <Badge color="success">{this.state.vertical + 1}</Badge> of{" "}
                        <Badge color="success">{this.state.newPicsList.length}</Badge>
                        <br />
                        <br />
                        <ImageWithInfoComponent
                          picObj={this.state.newPicsList[this.state.vertical]}
                          adminFlag={adminFlag}
                          notifyLoadHandler={this.picLoadHandler}
                        />
                        <br />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6} style={{ color: "black" }}>
                        <strong>Best Matching Picture Number: </strong>
                        <Badge color="success">{this.state.horizontal + 1}</Badge>
                        <br />
                        <br />
                        {this.state.similar_pictures.length === 0 ? (
                          <div style={{ textAlign: "center", marginTop: 100 }}>
                            Computing similar images.
                            <br />
                            <br />
                            <CircularProgress />
                            <br />
                            <br />
                            Please come back in a few minutes.
                          </div>
                        ) : (
                          <ImageWithInfoComponent
                            picObj={this.state.simPicObj}
                            distance={
                              typeof this.state.similar_pictures[this.state.horizontal] ===
                              "undefined"
                                ? undefined
                                : this.state.similar_pictures[this.state.horizontal].distance
                            }
                            adminFlag={adminFlag}
                            notifyLoadHandler={this.picLoadHandler}
                          />
                        )}
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        {adminFlag ? (
                          <SetMaxWhaleIdAutoDialog
                            function={this.go_manualId}
                          ></SetMaxWhaleIdAutoDialog>
                        ) : (
                          ""
                        )}
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
                        {adminFlag ? (
                          <Button
                            disabled={!this.state.picsLoaded[0]}
                            variant="contained"
                            onClick={() => this.go_badPicture()}
                            color="warning"
                            size="sm"
                          >
                            Bad picture
                          </Button>
                        ) : (
                          ""
                        )}
                        <Snackbar
                          open={dialogMessage !== ""}
                          message={dialogMessage}
                          autoHideDuration={4000}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        {/*  new buttons for the matching result */}
                        {adminFlag ? (
                          <div>
                            <Button
                              disabled={!this.state.picsLoaded[0] || !this.state.picsLoaded[1]}
                              variant="contained"
                              onClick={() => this.matchPicture()}
                              color="success"
                              size="sm"
                            >
                              Match
                            </Button>
                            <Button
                              disabled={!this.state.picsLoaded[0] || !this.state.picsLoaded[1]}
                              variant="contained"
                              onClick={() => this.unmatchPictures()}
                              color="info"
                              size="sm"
                            >
                              Don't match
                            </Button>
                          </div>
                        ) : (
                          ""
                        )}
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
                      </GridItem>
                      <br />
                    </GridContainer>
                  </div>
                </div>
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

const LandingPageContainer = connect((dispatch) => ({ dispatch }))(LandingPage);
export default withStyles(landingPageStyle)(LandingPageContainer);
