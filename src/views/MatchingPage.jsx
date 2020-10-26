import React from "react";

import "semantic-ui-css/semantic.min.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Header from "components/Header/Header.jsx";
import SetMaxWhaleIdAutoDialog from "components/CustomDialog/SetMaxWhaleIdAutoDialog.jsx";
import DeletePictureDialog from "components/CustomDialog/DeletePictureDialog.jsx";
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
import { Dropdown } from "semantic-ui-react";

import { connect } from "react-redux";

import "react-image-picker/dist/index.css";

// aws stuff
import API, { graphqlOperation } from "@aws-amplify/api";
import Storage from "@aws-amplify/storage";

// graphql stuff
import { getConfig, getWhale } from "graphql/queries";
import {
  createMatch,
  createWhale,
  updateConfig,
  updatePicture,
  deletePicture,
  deleteEuclidianDistance,
} from "graphql/mutations";
import { pictureByIsNewFiltered, getPictureFiltered } from "graphql/customQueries";
import { listEuclidianDistances, euclidianDistanceByPicture2 } from "graphql/queries";

import { Auth } from "aws-amplify";

import moment from "moment";

class MatchingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      horizontal: 0,
      vertical: 0,
      dialogMessage: "",
      user: null,
      adminFlag: false,
      similar_pictures: [undefined],
      // newPicsList needs to be initialized with "undefined" object to prevent showing the error message "No pics available" in the first seconds
      newPicsList: [undefined],
      simPicObj: undefined,
      // first array value represents left img, second one the right img
      picsLoaded: [false, false],
      isDeleting: false,
      imageCreatedAt: "",
    };

    this.intervalIds = [];

    // BINDING FUNCTIONS
    this.matchPicture = this.matchPicture.bind(this);
    this.unmatchPictures = this.unmatchPictures.bind(this);

    this.go_manualId = this.go_manualId.bind(this);
    this.deleteLeftPicture = this.deleteLeftPicture.bind(this);

    this.go_up = this.go_up.bind(this);
    this.go_down = this.go_down.bind(this);
    this.go_left = this.go_left.bind(this);
    this.go_right = this.go_right.bind(this);

    this.fetchNewPicturesList = this.fetchNewPicturesList.bind(this);
    this.fetchAndDisplaySimilarPictures = this.fetchAndDisplaySimilarPictures.bind(this);
    this.picLoadHandler = this.picLoadHandler.bind(this);

    this._handleKeyDown = this._handleKeyDown.bind(this);

    this.handlePictureChange = this.handlePictureChange.bind(this);

    // function uses async code => no blocking
    this.authenticate_user();
  }

  authenticate_user() {
    const admins = new Set(["LisaSteiner", "whalewatching"]);
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("MATCHINGPAGE user", user, user.username);
        this.setState({
          user: user.username,
          adminFlag: admins.has(user.username),
        });
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

  async go_manualId(pId, maxwhaleID) {
    console.log("IN goManualId. whale ID value from previous comp", pId);
    console.log("IN goManualId. MaxID value from previous comp", maxwhaleID);

    const leftImgFileName = this.state.newPicsList[this.state.vertical].id;
    let idOrFalse;
    let existsError = false;
    if (pId === maxwhaleID) {
      console.log("Image needs to be set with max id only. carry on existing func");
      idOrFalse = await this.createAndAssignNewWhaleId(leftImgFileName);
    } else {
      console.log("Image needs to be set with existing ID", pId);
      //check if whale exists
      const whaleObjs = await API.graphql(graphqlOperation(getWhale, { id: pId }));
      console.log("whaleObjs", whaleObjs);
      console.log("whaleObjs", whaleObjs.data);

      if (whaleObjs.data.getWhale == null) {
        console.log("Ooops, This Whale ID doesn't exist. Creating Whale ID with given new ID");
        const newWhale = await API.graphql(
          graphqlOperation(createWhale, { input: { id: pId, name: pId } })
        );
        const newID = await API.graphql(
          graphqlOperation(updatePicture, {
            input: { id: leftImgFileName, is_new: 0, pictureWhaleId: pId },
          })
        );
        idOrFalse = pId;
        existsError = false;
      } else {
        console.log("whale exists with given id as,", whaleObjs.data.getWhale);
        //mapping whale to existing id and set is_new = 0
        try {
          const updateID = await API.graphql(
            graphqlOperation(updatePicture, {
              input: { id: leftImgFileName, is_new: 0, pictureWhaleId: pId },
            })
          );
          idOrFalse = pId;
        } catch (error) {
          idOrFalse = false;
          console.log("ERROR in assigning new whale ID to existing whale: ", error);
        }
      }
    }
    if (idOrFalse === false) {
      if (existsError === true) {
        this.showSnackBar("Ooops, This Whale ID doesn't exist. Please select valid Whale ID", 5000);
      } else {
        this.showSnackBarError();
      }
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

  async deleteLeftPicture() {
    this.setState({ isDeleting: true });
    const imageIdToBeDeleted = this.state.newPicsList[this.state.vertical].id;
    let euclDistArray = await this.getEuclidianDistanceTuples(imageIdToBeDeleted);
    console.log("first query:", euclDistArray);

    if (euclDistArray !== -1) {
      let resultsPromiseArray = [];
      // send a delete mutation for every single tuple (graphQL is handling it sequentially anyway)
      euclDistArray.forEach((item) => {
        resultsPromiseArray.push(
          API.graphql(
            graphqlOperation(deleteEuclidianDistance, {
              input: { picture1: item.picture1, picture2: item.picture2 },
            })
          )
        );
      });

      try {
        // all the update operations are send to the DB and then await Promise.all() waits for all of them to finish
        await Promise.all(resultsPromiseArray);

        // delete entry imageIdToBeDeleted from the picture table
        const result = await API.graphql(
          graphqlOperation(deletePicture, { input: { id: imageIdToBeDeleted } })
        );

        // delete the actual files from storage (NOTE: "cropped_images folder not working yet due to owner policy")
        Storage.remove("embeddings/input/" + imageIdToBeDeleted)
          .then((result) => console.log(result))
          .catch((err) => console.log("embeddings err", err));

        Storage.remove("thumbnails/" + imageIdToBeDeleted + "thumbnail.jpg")
          .then((result) => console.log("thumbnail", result))
          .catch((err) => console.log("thumbnail err", err));
        const customPrefix = { public: "" };
        Storage.remove("cropped_images/" + imageIdToBeDeleted, { customPrefix: customPrefix })
          .then((result) => console.log(result))
          .catch((err) => console.log("cropped err", err));

        Storage.remove("watermark/" + imageIdToBeDeleted)
          .then((result) => console.log(result))
          .catch((err) => console.log("watermark err", err));

        // update view
        this.fetchNewPicturesList(undefined, [], 0);
      } catch (error) {
        console.log(error);
        this.showSnackBarError();
      }
    } else {
      this.showSnackBarError();
    }

    this.setState({ isDeleting: false });
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
        this.showSnackBarError();
      }
    } else if (parseInt(leftWhaleId) < parseInt(rightWhaleId)) {
      // assign all pictures with the right id the left id
      queryWasSuccess = await this.changeWhaleIdOfPictures(rightWhaleId, leftWhaleId);
      if (queryWasSuccess) {
        this.showSnackBarAssignedIds(rightWhaleId, leftWhaleId);
      } else {
        this.showSnackBarError();
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
        if (toId == -1) {
          // handle the case when on the left AND right side are images with ID = -1
          // 1. give right pic a new ID
          let idOrFalse = await this.createAndAssignNewWhaleId(
            this.state.similar_pictures[this.state.horizontal].simPicName
          );
          // now assign the new ID of the right picture to the left picture by performing a recursive call
          if (idOrFalse !== false) {
            const tempRes = await this.changeWhaleIdOfPictures(-1, idOrFalse);
            if (!tempRes) return false;
          } else {
            return false;
          }
        } else {
          // this only works if on the right side is not a picture displayed with is_new = 1
          const picObjId = this.state.newPicsList[this.state.vertical].id;
          resultsPromiseArray.push(
            API.graphql(
              graphqlOperation(updatePicture, {
                input: { id: picObjId, pictureWhaleId: toId },
              })
            )
          );
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
    } else if (fromId == -1 && toId == -1) {
      this.showSnackBar(
        "Successfully created a new whale ID and assigned it to both pictures",
        5000
      );
    } else {
      this.showSnackBar("Successfully assigned whale ID " + toId, 5000);
    }
  }

  showSnackBarError() {
    this.showSnackBar("Ooops, an error occurred! Please try again!", 5000);
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
      this.navigationAction("right");
    });
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
        if (this.state.adminFlag) this.matchPicture();
        break;
      case U_KEY:
        if (this.state.adminFlag) this.unmatchPictures();
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

    // clear old interval IDs
    this.intervalIds.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    // if sim pics array is still empty we call the function again in 15 seconds
    if (this.state.similar_pictures.length === 0) {
      this.intervalIds.push(setInterval(this.fetchAndDisplaySimilarPictures, 15000));
    }

    // will be entered every time a match happened / the whole page was refreshed
    if (prevState.newPicsList !== this.state.newPicsList) {
      console.log("IN newPicsList UPDATE");

      this.doubleCheckVertical();
      if (this.state.newPicsList.length > 0) {
        const fetchedSimPics = this.fetchSimilarPictures();
        this.processNewSimilarPics(await fetchedSimPics);
      }
    }

    if (prevState.vertical !== this.state.vertical) {
      console.log("IN VERTICAL CHANGE");
      this.intervalIds.forEach((intervalId) => {
        clearInterval(intervalId);
      });
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

  async getEuclidianDistanceTuples(imgId) {
    let returnValue = undefined;
    try {
      // query where picture1 = imgId
      const query1 = API.graphql(
        graphqlOperation(listEuclidianDistances, {
          picture1: imgId,
          limit: 5000,
        })
      );

      //query where picture2 = imgId
      const query2 = API.graphql(
        graphqlOperation(euclidianDistanceByPicture2, {
          picture2: imgId,
          limit: 5000,
        })
      );

      const result1 = await query1;
      // check if the result that came back here is still the one we're looking for (in case it's an empty array we assume it is the right one)
      if (
        result1.data.listEuclidianDistances.items.length > 0 &&
        result1.data.listEuclidianDistances.items[0].picture1 !=
          this.state.newPicsList[this.state.vertical].id
      ) {
        return -1;
      }
      const result2 = await query2;

      console.log("GOT result1");
      console.log(result1);
      console.log("GOT result2");
      console.log(result2);

      // concatinate both arrays
      returnValue = result1.data.listEuclidianDistances.items.concat(
        result2.data.EuclidianDistanceByPicture2.items
        //[]
      );
    } catch (error) {
      console.log("ERROR IN getEuclidianDistanceTuples");
      console.log(error);
      returnValue = -1;
    }

    return returnValue;
  }

  async fetchAndDisplaySimilarPictures() {
    this.processNewSimilarPics(await this.fetchSimilarPictures());
  }

  /**
   * Executes two listEuclidianDistances graphQL-queries: One with the leftImgId as picture1; one with the leftImgId as picture2
   * Then concatenates and sorts the two result-arrays and shortens the concatenation to the 100 most similar pictures (smallest distance).
   * Returns this array as a Promise.
   */
  async fetchSimilarPictures() {
    let returnValue = undefined;
    const leftImgId = this.state.newPicsList[this.state.vertical].id;
    console.log("IN fetchSimilar");
    console.log(leftImgId);

    let result = await this.getEuclidianDistanceTuples(leftImgId);
    if (result !== -1) {
      // query was successful => sort by distance
      result.sort((a, b) => a.distance - b.distance);
      // we only want to display the first 100 most similar pictures
      let resultsFirst100 = result.slice(0, 100);

      let filteredFirst100 = [];
      // extract only the file name and distance out of the tupel (the rest is not relevant for us)
      resultsFirst100.forEach((elem) => {
        if (elem.picture1 === leftImgId) {
          filteredFirst100.push({ simPicName: elem.picture2, distance: elem.distance });
        } else {
          filteredFirst100.push({ simPicName: elem.picture1, distance: elem.distance });
        }
      });

      returnValue = filteredFirst100;
    } else {
      returnValue = result;
    }
    return returnValue;
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

  handlePictureChange(event, data) {
    console.log("change to picture " + data.options[data.value].text);
    this.setState({
      picsLoaded: [false, false],
      simPicObj: undefined,
      similar_pictures: [undefined],
      vertical: parseInt(data.value),
      horizontal: 0,
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

      this.setState({
        vertical: Math.max(0, Math.min(pics.length - 1, this.state.vertical)),
        similar_pictures: [undefined],
        newPicsList: pics,
      });
    } catch (error) {
      console.log("IN CATCH");
      console.log(error);
    }
  }

  render() {
    console.log("IN RENDER", this.state, this.state.newPicsList);

    const { classes, ...rest } = this.props;
    const { dialogMessage } = this.state;

    const leftPicObj = this.state.newPicsList[this.state.vertical];
    if (leftPicObj !== undefined) {
      this.state.imageCreatedAt = this.state.newPicsList[this.state.vertical].createdAt;
    }
    const myMoment = moment();
    const myMoment5 = moment(this.state.imageCreatedAt).add(100, "seconds");
    var allowDelete = false;
    allowDelete = Boolean(myMoment.diff(myMoment5) > 0);
    console.log("time diff ", myMoment.diff(myMoment5));
    console.log("allowdelete ", allowDelete);
    const leftButtonsDisabled = !allowDelete || this.state.isDeleting;
    //const rightButtonsDisabled = leftButtonsDisabled || !this.state.picsLoaded[1];
    const rightButtonsDisabled = leftButtonsDisabled;

    return (
      <div>
        <Header
          color="blue"
          brand={
            <img
              src={require("assets/img/fluketracker-logo(blue-bg).jpg")}
              style={{
                width: "90%",
                paddingBottom: "0px",
                margin: "0 auto",
              }}
            />
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
              <div class="section container" style={{ paddingTop: "180px", paddingBottom: "5px" }}>
                <div class="row">
                  <div class="col-12">
                    <div class="article-text">
                      <h2 style={{ paddingTop: "5px" }}>
                        <strong>Do these whales match?</strong>
                      </h2>
                    </div>
                    <Dropdown
                      placeholder="Select Uploaded Picture"
                      fluid
                      search
                      selection
                      onChange={this.handlePictureChange}
                      options={this.state.newPicsList
                        .filter((pic) => pic)
                        .map((pic, i) => {
                          return { key: i, value: i, text: pic.id };
                        })}
                    />
                    {this.state.newPicsList.length > 0 ? (
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12} space={10}>
                          <br />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <LinearProgress
                            variant="determinate"
                            value={
                              (this.state.vertical / (this.state.newPicsList.length - 1)) * 100
                            }
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <LinearProgress
                            variant="determinate"
                            value={
                              (this.state.horizontal / (this.state.similar_pictures.length - 1)) *
                              100
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
                            adminFlag={this.state.adminFlag}
                            notifyLoadHandler={this.picLoadHandler}
                          />
                          <br />
                          {this.state.adminFlag ? (
                            <div>
                              <SetMaxWhaleIdAutoDialog
                                function={this.go_manualId}
                                disabled={leftButtonsDisabled}
                              ></SetMaxWhaleIdAutoDialog>
                              <DeletePictureDialog
                                function={this.deleteLeftPicture}
                                disabled={leftButtonsDisabled || rightButtonsDisabled}
                                picName={
                                  this.state.newPicsList.length > 0 &&
                                  typeof this.state.newPicsList[0] !== "undefined"
                                    ? this.state.newPicsList[this.state.vertical].id
                                    : ""
                                }
                              ></DeletePictureDialog>
                              {this.state.isDeleting ? <CircularProgress /> : ""}
                            </div>
                          ) : (
                            ""
                          )}
                          <Button
                            disabled={this.state.isDeleting}
                            variant="contained"
                            onClick={() => this.navigationAction("up")}
                            color="info"
                            size="sm"
                          >
                            &#9650;
                          </Button>
                          <Button
                            disabled={this.state.isDeleting}
                            variant="contained"
                            onClick={() => this.navigationAction("down")}
                            color="info"
                            size="sm"
                          >
                            &#9660;
                          </Button>
                          <Snackbar
                            open={dialogMessage !== ""}
                            message={dialogMessage}
                            autoHideDuration={4000}
                          />
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
                              adminFlag={this.state.adminFlag}
                              notifyLoadHandler={this.picLoadHandler}
                            />
                          )}
                          {/*  new buttons for the matching result */}
                          {this.state.adminFlag ? (
                            <div style={{ marginTop: "15px" }}>
                              <Button
                                disabled={rightButtonsDisabled}
                                variant="contained"
                                onClick={() => this.matchPicture()}
                                color="success"
                                size="sm"
                              >
                                Match
                              </Button>
                              <Button
                                style={{ marginLeft: "6px" }}
                                disabled={rightButtonsDisabled}
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
                            disabled={this.state.isDeleting}
                            variant="contained"
                            onClick={() => this.navigationAction("left")}
                            color="info"
                            size="sm"
                          >
                            &#9668;
                          </Button>
                          <Button
                            disabled={this.state.isDeleting}
                            variant="contained"
                            onClick={() => this.navigationAction("right")}
                            color="info"
                            size="sm"
                          >
                            &#9658;
                          </Button>
                        </GridItem>
                        <br />
                      </GridContainer>
                    ) : (
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={6} style={{ color: "black" }}>
                          <br />
                          We are sorry, there are currently no unmatched pictures.
                          <br />
                          <br />
                          Please upload a new image and come back to this page.
                          <br />
                        </GridItem>
                      </GridContainer>
                    )}
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

const MatchingPageContainer = connect((dispatch) => ({ dispatch }))(MatchingPage);
export default withStyles(landingPageStyle)(MatchingPageContainer);
