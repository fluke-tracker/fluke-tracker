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
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Snackbar from '@material-ui/core/Snackbar';
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from "react-redux";

// Sections for this page
import ProductSection from "./Sections/ProductSection.jsx";
import TeamSection from "./Sections/TeamSection.jsx";
import WorkSection from "./Sections/WorkSection.jsx";

import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'
import Cookies from "utils/Cookies";
import { withAuthenticator } from 'aws-amplify-react'

//import images from local
import { MuiThemeProvider } from "@material-ui/core";

// aws stuff
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createMatchingImage  } from 'graphql/mutations';
import { updateMatchingImage  } from 'graphql/mutations';
import { deleteMatchingImage  } from 'graphql/mutations';
import { listMatchingImages } from 'graphql/queries';

//import awsconfig from 'aws-exports';
import Amplify , { Storage } from 'aws-amplify';

// Configure Amplify
/* API.configure(awsconfig);
PubSub.configure(awsconfig);
Amplify.configure(awsconfig);  */



var imageList = []

const papaparseOptions = {
  header: false,
  dynamicTyping: true,
  sokipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};


const dashboardRoutes = [];

class LandingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null,
      horizontal: 0,
      vertical: 0,
      dialogMessage: '',
      right_img: '',
      left_img: '',
      whale_csv: [[]],
      is_loaded: new Set(),
      matchedPictures: {}
    }
    this.acceptPicture = this.acceptPicture.bind(this);
    this.unacceptPicture = this.unacceptPicture.bind(this);
    this.go_up.bind(this);
    this.go_down.bind(this);
    this.go_left.bind(this);
    this.go_right.bind(this);
    this.onPick = this.onPick.bind(this);
    this.handleCsvData = this.handleCsvData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.loadMatches = this.loadMatches.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this)
    this.loadData("http://localhost:3000/csv");
    this.loadMatches();
    this.handleForce = (data, fileInfo) => this.setState({ whale_csv: data }, this.handleCsvData);
    this.handleForce.bind(this);

  }

  go_left() {
    //console.log("left");
    this.setState(prevState => ({
      horizontal: Math.max(0, prevState.horizontal - 1)
    }), this.handleCsvData());
  }
  go_up() {
    //console.log("up");
    this.setState(prevState => ({
      vertical: Math.max(0, prevState.vertical - 1)
    }), this.handleCsvData());
  }
  go_down() {
    //console.log("down");
    this.setState((prevState, props) => { return { horizontal: 0 } }
    );
    this.setState(prevState => { return { vertical: Math.max(0, Math.min(this.state.whale_csv.length - 2, prevState.vertical + 1)) } }
      , this.handleCsvData());

  }
  go_right() {
    //console.log("right");
    this.setState(prevState => ({
      horizontal: Math.max(0, Math.min(this.state.whale_csv[this.state.vertical].length - 2, prevState.horizontal + 1))
    }), this.handleCsvData());
  }
  acceptPicture() {
    const left_img_name = this.state.whale_csv[this.state.vertical][0];
    const right_img_name = this.state.whale_csv[this.state.vertical][this.state.horizontal + 1];
    console.log(right_img_name);
    this.setState(prevState => { 
      if (prevState.matchedPictures[left_img_name] == undefined){
        prevState.matchedPictures[left_img_name] = new Set([right_img_name]);
        API.graphql(graphqlOperation(createMatchingImage, {input: { image: {name: left_img_name}, matchingImages: [{name: right_img_name}] }})).then( () => console.log("created matching image"));
      } 
      else {
        prevState.matchedPictures[left_img_name].add(right_img_name)
        API.graphql(graphqlOperation(updateMatchingImage, {input: { image: {name: left_img_name}, matchingImages: Array.from(prevState.matchedPictures[left_img_name]) }}));
      } 
      console.log(prevState.matchedPictures);
      return {matchedPictures:  prevState.matchedPictures}}
    );
    if (left_img_name && right_img_name) {
      
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
    const left_img_name = this.state.whale_csv[this.state.vertical][0];
    const right_img_name = this.state.whale_csv[this.state.vertical][this.state.horizontal + 1];
    this.setState(prevState => { 
      prevState.matchedPictures[left_img_name].delete(right_img_name); 
      API.graphql(graphqlOperation(updateMatchingImage, {image: left_img_name, matchingImages: Array.from(prevState.matchedPictures[left_img_name])}));
      return prevState.matchedPictures;

    });
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
  };
  handleLeftImageLoaded(image) {
    this.setState({ imageStatusLeft: "loaded" });
    this.setState(prevState => {return prevState.is_loaded.add(this.state.whale_csv[this.state.vertical][0])});
  }
  handleRightImageLoaded() {
    this.setState({ imageStatusRight: "loaded" });
    this.setState(prevState => {return prevState.is_loaded.add(this.state.whale_csv[this.state.vertical][this.state.horizontal + 1])});
  }
  handleLeftImageErrored() {
    this.setState({ imageStatusLeft: "failed to load" });
  }

  handleRightImageErrored() {
    this.setState({ imageStatusRight: "failed to load" });
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
        
        const left_img = this.state.whale_csv[this.state.vertical][0];
        const right_img = this.state.whale_csv[this.state.vertical][this.state.horizontal + 1];
        if (left_img in this.state.matchedPictures && this.state.matchedPictures[left_img].has(right_img)){
          
          this.unacceptPicture();
        }
        else {
          this.acceptPicture();
        }

        break;
      case LEFT_ARROW_KEY:
        this.go_left()

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
  }


  // componentWillMount deprecated in React 16.3
  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);
  }


  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  onPick(image) {

    //console.log(image);

    this.handleCsvData();
    this.setState({ image: null });
  }


  handleCsvData() {

    if (this.state.whale_csv) {
      console.log("yyy");
      const vertical = this.state.vertical;
      const horizontal = this.state.horizontal;

      const img1 = this.state.whale_csv[vertical][0];
      const img2 = this.state.whale_csv[vertical][horizontal + 1];
      //console.log("img1"+img1);
      //console.log("img2"+img2);
      if (img1 != this.state.left_img && img1 !== '') {
        this.setState({ imageStatusLeft: "loading" })
        this.setState({ left_img: img1 });
      }
      if (img2 != this.state.right_img && img2 !== '') {
        this.setState({ imageStatusRight: "loading" })
        this.setState({ right_img: img2 });
      }


      //this.imageList[0]..
    }
  }

  loadData = (url) => {
    var _this = this;
    fetch(url, { credentials: "same-origin", 'headers': { 'token': 'Bearer ' + Cookies.read('token') } })
      .then(function (response) {
        // console.log(url + " -> " + response.ok);
        if (response.ok) {
          return response.text();
        }
        if (response.status == 401) { console.log("not authorized!") };
        throw new Error('Error message.');
      })
      .then(function (data) {
        /* when csv is downloaded it is converted into arrays and saved in whale_csv var */
        this.setState({ whale_csv: data.split("\n").map(data => data.split(",")) }, () => setTimeout(() => this.handleCsvData(), 100));
      }.bind(this))
      .catch(function (err) {
        console.log("failed to load ", url, err.message);
      });
  }

  loadMatches =  () => {
    console.log("load matches");
    const matchingImages = API.graphql(graphqlOperation(listMatchingImages)).then(
      response => {
        const matchedPictures = response.data.listMatchingImages.items;
        const reformatedMatchedPictures = matchedPictures.reduce((obj, item) => {if(item.image) obj[item.image.name] = new Set(item.matchingImages.map( img => img.name)); return obj} , {})
        this.setState(() => { return { matchedPictures:  reformatedMatchedPictures} });
      }
    );
    
    return matchingImages;
  }
  // loadMatches = (url) => {
  //   var _this = this;
  //   fetch(url, { credentials: "same-origin", 'headers': { 'token': 'Bearer ' + Cookies.read('token') } })
  //     .then(function (response) {
  //       // console.log(url + " -> " + response.ok);
  //       if (response.ok) {
  //         return response.text();
  //       }
  //       if (response.status == 401) { console.log("not authorized!") };
  //       throw new Error('Error message.');
  //     })
  //     .then(function (data) {
  //       /* when csv is downloaded it is converted into arrays and saved in whale_csv var */
  //       this.setState(() => { 
  //         const json=JSON.parse(data); const matchedPictures = {}; 
  //        Object.keys(json.matchedPictures).forEach( 
  //          left => { 
  //            if (left in matchedPictures) {json.matchedPictures[left].forEach(right => matchedPictures[left].add(right))}
  //            else {matchedPictures[left] = new Set(json.matchedPictures[left])} 
  //           })
  //           console.log(matchedPictures);
  //           return { matchedPictures:  matchedPictures}
  //         });
  //     }.bind(this))
  //     .catch(function (err) {
  //       console.log("failed to load ", url, err.message);
  //     });
  // }

  render() {
    const { classes, ...rest } = this.props;
    const { dialogMessage } = this.state;

    return (
      <div>
        <Header
          color="transparent"
          routes={dashboardRoutes}
          brand="Capgemini"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
          {...rest}
        />

        <Parallax filter image={require("assets/img/landing-bg.jpg")}>
          <div className={classes.container}>
            <GridContainer>
            <GridItem xs={12} sm={12} md={6}><h1 className={classes.title}>Do the whales match?</h1></GridItem>
{/*             <GridItem xs={12} sm={12} md={6}>
              <img src={require("assets/img/arrow_keys.svg")} style={{"width": "150px", "height": "150px", "backgroundColor": "white"}}/>
            </GridItem> */}

              <GridItem xs={12} sm={12} md={12} space={10}>
                
                      <CSVReader
                          cssClass="react-csv-input"
                          label="Select CSV with results from your Machine Learning model"
                          onFileLoaded={this.handleForce}
                          parserOptions={papaparseOptions}
                        />
                        <br/>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                        <LinearProgress variant="determinate" value={this.state.vertical / (this.state.whale_csv.length - 2) * 100} />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                        <LinearProgress variant="determinate" value={this.state.horizontal / (this.state.whale_csv[this.state.vertical].length - 2) * 100} />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                        New Image Number: {this.state.vertical} 
                        <br/>
                        {this.state.whale_csv[this.state.vertical][0]}
                        {this.state.is_loaded.has(this.state.whale_csv[this.state.vertical][0]) ? '' : <CircularProgress />}
                        <img src={"http://localhost:3000/images/" + this.state.whale_csv[this.state.vertical][0]} onLoad={this.handleLeftImageLoaded.bind(this)}
                          onError={this.handleLeftImageErrored.bind(this)}
                        />
                </GridItem>

                <GridItem xs={12} sm={12} md={6}>
                        Best Matching Picture Number:
                        {this.state.horizontal} 
                        <br/>
                        {this.state.whale_csv[this.state.vertical][this.state.horizontal + 1]}
                        {this.state.is_loaded.has(this.state.whale_csv[this.state.vertical][this.state.horizontal + 1]) ? '': <CircularProgress />}
                        <img src={"http://localhost:3000/images/" + this.state.whale_csv[this.state.vertical][this.state.horizontal + 1]} onLoad={this.handleRightImageLoaded.bind(this)} />     
                </GridItem>      
                <GridItem xs={12} sm={12} md={6}>
                {this.state.whale_csv[this.state.vertical][0] in this.state.matchedPictures  && this.state.matchedPictures[this.state.whale_csv[this.state.vertical][0]].has(this.state.whale_csv[this.state.vertical][this.state.horizontal+1]) ? <Button variant="contained" onClick={() => this.acceptPicture()} color="warning">🐳 UnMatch!</Button> : <Button variant="contained" onClick={() => this.acceptPicture()} color="success">🐳 Match!</Button>}
                <br/>
                <Button variant="contained" onClick={() => this.go_up()}color="info" size="sm">&#9650;</Button>
              <Button variant="contained" onClick={() => this.go_down()}color="info" size="sm">&#9660;</Button>
                <div>
                  <ImagePicker
                    images={imageList.map((image, i) => ({ src: image, value: i }))}
                    onPick={this.onPick} onLoad="console.log('ASDASD')"
                  />
                </div>
                <Snackbar
                  open={dialogMessage !== ''}
                  message={dialogMessage}
                  autoHideDuration={4000}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
              <Button variant="contained" onClick={() => this.go_left()}color="info" size="sm">&#9664;</Button>
              <Button variant="contained" onClick={() => this.go_right()}color="info" size="sm">&#10148;</Button>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>

          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const LandingPageContainer = connect(dispatch => ({ dispatch }))(LandingPage);

export default withStyles(landingPageStyle)(LandingPageContainer);
