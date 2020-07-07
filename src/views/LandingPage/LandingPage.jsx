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
import Snackbar from '@material-ui/core/Snackbar';
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import LinearProgress from '@material-ui/core/LinearProgress';
    import Gallery from 'react-grid-gallery';

import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from "react-redux";

// Sections for this page
import ProductSection from "./Sections/ProductSection.jsx";
import TeamSection from "./Sections/TeamSection.jsx";
import WorkSection from "./Sections/WorkSection.jsx";

import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'
import Cookies from "utils/Cookies";
import { withAuthenticator,SignOut } from 'aws-amplify-react'

//import images from local
import { MuiThemeProvider } from "@material-ui/core";

// aws stuff
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createMatchingImage  } from 'graphql/mutations';
import { updateMatchingImage  } from 'graphql/mutations';
import { deleteMatchingImage  } from 'graphql/mutations';
import { createMatch  } from 'graphql/mutations';
import { listMatchingImages } from 'graphql/queries';
import { listMatchs } from 'graphql/queries';
import { getConfig } from 'graphql/queries';
import { updateConfig } from 'graphql/mutations';

import { getMatchingImage } from 'graphql/queries';
import { getPicture } from 'graphql/queries';
import { pictureByIsNew } from 'graphql/queries';
import { listPictures } from 'graphql/customQueries';
import { getWhale } from 'graphql/queries';
import { createWhale } from 'graphql/mutations';
import { listWhales } from 'graphql/queries';
import { createPicture } from 'graphql/mutations';
import { updatePicture } from 'graphql/mutations';
import { listEuclidianDistances } from 'graphql/queries'

//import awsconfig from 'aws-exports';
import Amplify , { Storage } from 'aws-amplify';
import { Auth } from 'aws-amplify';


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

class ImageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        };
    }

    render () {
            return <img {...this.props.imageProps} onLoad={this.props.item.onLoad} onError={this.props.item.onError} />;
    }
}

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
      left_id: '',
      right_id: '',
      is_loaded: new Set(),
      matchedPictures: {},
      image_id: {},
      isMatched: '',
      user: null,
      new_pictures: [''],
      similar_pictures: [''],
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
    //this.loadData("http://localhost:3000/csv");
    this.loadData("https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09213627-whaledev.s3.eu-central-1.amazonaws.com/AI_Sensing.csv");
    this.loadMatches();
    //this.handleForce = (data, fileInfo) => this.setState({ whale_csv: data }, this.handleCsvData);
    //this.handleForce.bind(this);
    this.authenticate_user();

  }
  go_badPicture() {
    console.log('bad picture code goes here')
  }
  go_newId() {
    console.log('new id code goes here');

    //  API.graphql(graphqlOperation(updateConfig, {id: "maxWhaleId"}));
  }
  go_manualId(id) {
    console.log('manual id code goes here, id: ' + id)
    const left_img_name = this.state.new_pictures[this.state.vertical];
    const right_img_name = this.state.similar_pictures[this.state.horizontal];
    API.graphql(graphqlOperation(updatePicture, {input:  {id: left_img_name, pictureWhaleId: id}}));
    this.setState({left_id: id});
  }
authenticate_user() {

  Auth.currentAuthenticatedUser()
        .then(user => {  console.log('matchingpage user',user,user.username);
          this.setState({ user: user.username })
        }).catch(err => console.log('currentAuthenticatedUser err', err))
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
    this.setState(prevState => { return { vertical: Math.max(0, Math.min(this.state.new_pictures.length, prevState.vertical + 1)) } }
      , this.handleCsvData());

  }
  go_right() {
    //console.log("right");
    this.setState(prevState => ({
      horizontal: Math.max(0, Math.min(this.state.new_pictures[this.state.vertical].length, prevState.horizontal + 1))
    }), this.handleCsvData());
  }
  acceptPicture() {
    const left_img_name = this.state.new_pictures[this.state.vertical];
    const right_img_name = this.state.similar_pictures[this.state.horizontal];
    console.log('left_img_name is: ',left_img_name);
    console.log('right_image is: ',right_img_name);
    console.log('ismached',this.state.isMatched)
    this.setState(prevState => { 
      if (prevState.matchedPictures[left_img_name] == undefined){
        prevState.matchedPictures[left_img_name] = new Set([right_img_name]);
        console.log(this.state.left_id, this.state.right_id);
        //API.graphql(graphqlOperation(createMatchingImage, { input: { image: {name: left_img_name}, matchingImages: {name: right_img_name} }} )).then( () => console.log("created matching image"));


            //API.graphql(graphqlOperation(updatePicture, {input:  {id: left_img_name, pictureWhaleId: this.state.right_id}}));
            //API.graphql(graphqlOperation(updatePicture, {input:  {id: this.state.right_id, filename: left_img_name}})).then(() => console.log("created matching image")).catch(err => console.log(err));;
        //API.graphql(graphqlOperation(createMatch, {input: { matchPicture1Id: left_img_name, matchPicture2Id: right_img_name, match_status: "match" }} )).then( () => {console.log("created matching image");this.handleCsvData();});
      }
      else {
        prevState.matchedPictures[left_img_name].add(right_img_name)
        console.log ('prevState.matchedPictures[left_img_name])::: ',prevState.matchedPictures[left_img_name]);
        console.log('added_arry:', Array.from(prevState.matchedPictures[left_img_name]));
      }
      if (parseInt(this.state.right_id) < parseInt(this.state.left_id)){
        // assign all pictures of the left id the right id
        API.graphql(graphqlOperation(getWhale, { id:  this.state.left_id})).then(
            pictures => pictures.data.getWhale.pictures.items.forEach(picture => API.graphql(graphqlOperation(updatePicture, {input:  {id: picture.id, pictureWhaleId: this.state.right_id}}))
        ));
        this.setState({ dialogMessage: "Assigned all whales with id " + this.state.left_id + " the id " + this.state.right_id});
        setTimeout(_ => this.setState({ dialogMessage: "" }), 2000)
      }
      if (parseInt(this.state.left_id) < parseInt(this.state.right_id)){
        // assign all pictures of the right id the left id
        API.graphql(graphqlOperation(getWhale, { id:  this.state.right_id})).then(
            pictures => pictures.data.getWhale.pictures.items.forEach(picture => API.graphql(graphqlOperation(updatePicture, {input:  {id: picture.id, pictureWhaleId: this.state.left_id}}))
        ));
        this.setState({ dialogMessage: "Assigned all whales with id " + this.state.right_id + " the id " + this.state.left_id});
        setTimeout(_ => this.setState({ dialogMessage: "" }), 2000)
      }
      API.graphql(graphqlOperation(updatePicture, {input:  {id: left_img_name, is_new: 1}}));
      console.log('returning matched pictures', prevState.matchedPictures);
      return {matchedPictures:  prevState.matchedPictures}
    });
    if (left_img_name && right_img_name) {
      console.log('commented');
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
    const left_img_name = this.state.new_pictures[this.state.vertical];;
    const right_img_name = this.state.similar_pictures[this.state.horizontal];
    this.setState(prevState => { 
      console.log('left img id: ',prevState.image_id[left_img_name]);
      prevState.matchedPictures[left_img_name].delete(right_img_name); 
      console.log("array after deletion", prevState.matchedPictures[left_img_name]);
      //API.graphql(graphqlOperation(updateMatchingImage, {input: {id: prevState.image_id[left_img_name], image:  {name: left_img_name}, matchingImages: {name: Array.from(prevState.matchedPictures[left_img_name])} }} )).then( () => console.log("deletin matching image")).catch(err => console.log(err));
        API.graphql(graphqlOperation(createMatch, {input: { matchPicture1Id: left_img_name, matchPicture2Id: right_img_name, match_status: "match" }} )).then( () => {console.log("created matching image");this.handleCsvData();});

      return prevState.matchedPictures;

    });

    if (this.state.left_id != this.state.right_id) {
        API.graphql(graphqlOperation(getConfig, {id: "maxWhaleId"})).then(
            result => {
                    const maxWhaleId = result.data.getConfig.value;
                    const newMaxWhaleId = (parseInt(maxWhaleId)+1).toString();
                    const left_img_name = this.state.new_pictures[this.state.vertical];;
                    API.graphql(graphqlOperation(createWhale, {input: {id: maxWhaleId, name: maxWhaleId}})).then(
                        result => API.graphql(graphqlOperation(updatePicture, {input: {id: left_img_name, pictureWhaleId: maxWhaleId}}))
                    );

                    API.graphql(graphqlOperation(updateConfig, {input: {id: "maxWhaleId", value: newMaxWhaleId}}));
            }

        );
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
  };
  handleLeftImageLoaded(image) {
    this.setState({ imageStatusLeft: "loaded" });
    this.setState(prevState => {return prevState.is_loaded.add(this.state.new_pictures[this.state.vertical])});
  }
  handleRightImageLoaded() {
    this.setState({ imageStatusRight: "loaded" });
    this.setState(prevState => {return prevState.is_loaded.add(this.state.similar_pictures[this.state.horizontal])});
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
        
        const left_img = this.state.new_pictures[this.state.vertical];;
        const right_img = this.state.similar_pictures[this.state.horizontal];
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

      const vertical = this.state.vertical;
      const horizontal = this.state.horizontal;

      const img1 = this.state.new_pictures[vertical];
      const img2 = this.state.similar_pictures[this.state.horizontal];
      API.graphql(graphqlOperation(getPicture, { id:  this.state.new_pictures[vertical]}))
      .then( picture => {
          console.log("get picture" + picture);
          this.setState({left_id: picture.data.getPicture.whale.name});});
          API.graphql(graphqlOperation(getPicture, { id:  this.state.similar_pictures[this.state.horizontal]}))
          .then( picture =>
              {
                  console.log("get picture");console.log(picture);
                  this.setState({right_id: picture.data.getPicture.whale.name},
                        _ => console.log(picture.data.getPicture.whale))
              }
          );

      this.setState({
      isMatched: this.state.new_pictures[this.state.vertical] in this.state.matchedPictures &&
                Array.from(this.state.matchedPictures[this.state.new_pictures[this.state.vertical]]).join().includes(this.state.similar_pictures[this.state.horizontal])
      }, data => console.log(data));
      this.list_pictures_right_side();
  }
  list_pictures_right_side() {
  // TODO add second request with picture2 and add pictures

    API.graphql(graphqlOperation(listEuclidianDistances, {picture1: this.state.new_pictures[this.state.vertical]})).then(
                    result =>
                            {
                                let pictures = [];
                                result.data.listEuclidianDistances.items.forEach(picture => pictures.push(picture.picture2));
                                this.setState({
                                    similar_pictures: pictures
                                });
                            }

    ).catch(result => this.setState({similar_pictures: ['']}));
  }
  list_pictures_left_side = (nextToken, ids, numReq) => {
      API.graphql(graphqlOperation(pictureByIsNew, {is_new: 1, limit: 5000, nextToken: nextToken})).then(result => {
                result.data.PictureByIsNew.items.forEach(id => ids.push(id.id));
                nextToken = result.data.PictureByIsNew.nextToken;

                this.setState(
                    {new_pictures: ids},
                    result => {
                        this.list_pictures_right_side();
                    }
                );
            }
      );
  }
  loadData = (url) => {
    const ids = [];
    this.list_pictures_left_side(undefined, [], 0);
    //var _this = this;
    //fetch(url, { credentials: "same-origin", 'headers': { 'token': 'Bearer ' + Cookies.read('token') } })
    //  .then(function (response) {
    //    // console.log(url + " -> " + response.ok);
    //    if (response.ok) {
    //      return response.text();
    //    }
    //    if (response.status == 401) { console.log("not authorized!") };
    //    throw new Error('Error message.');
    //  })
    //  .then(function (data) {
    //    // when csv is downloaded it is converted into arrays and saved in whale_csv var
    //    this.setState({ whale_csv: data.split("\n").map(data => data.split(",")) }, () => setTimeout(() => this.handleCsvData(), 100));
    //  }.bind(this))
    //  .catch(function (err) {
    //    console.log("failed to load ", url, err.message);
    //  });
  } 

  loadMatches =  () => {
    console.log("load matches");
    const img2id = {};
    API.graphql(graphqlOperation(listMatchs)).then(response => {
        console.log(response);
        const imgArr = {};
        response.data.listMatchs.items.forEach(
            match => {
                if(match.picture1.filename in imgArr){

                }
                else{
                    imgArr[match.picture1.filename] = new Set();
                }
                imgArr[match.picture1.filename].add(match.picture2.filename);
            }
        );
        console.log("imgArr");
        console.log(imgArr);
        this.setState({matchedPictures: imgArr});
    }
    );
    /*const matchingImages = API.graphql(graphqlOperation(listMatchingImages)).then(
      response => {
        const image_id = {};
        const matchedPictures = response.data.listMatchingImages.items;
        const reformatedMatchedPictures = matchedPictures.reduce((obj_id, item) => { 
          const left_image_name = item.image.name;
          if(item.image) image_id[left_image_name] = item.id;
          if(item.image) obj_id[left_image_name] = new Set(item.matchingImages.map( right_img => right_img.name)); return obj_id} , {})
        this.setState(() => { return { matchedPictures:  reformatedMatchedPictures} });
        this.setState(() => { return { image_id: image_id} });
        console.log(response);
      }
    );*/
    }
  
/*   signout = () =>{
    const currentUser = Auth.userPool.getCurrentUser();
    console.log('currentUser',currentUser)
    try {
       currentUser.signOut()
      console.log('signout success');
   }
   catch(e) {
    console.log('signout failed',e);
    }
  }  */
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
  getimages = (image) => {
  const bucket_url ='https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09213627-whaledev.s3.eu-central-1.amazonaws.com/public/thumbnails/'
  const image_url = bucket_url+image+"thumbnail.jpg"
    return image_url
  }
  getimagescropped = (image) => {
    const bucket_url ='https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09213627-whaledev.s3.eu-central-1.amazonaws.com/cropped_images/'
    const image_url = bucket_url+image
    return image_url
  }

  render() {
    const { classes, ...rest } = this.props;
    const { dialogMessage } = this.state;

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

         <div className={classes.container}>
    <div class="section container" style={{"paddingTop": "150px", "paddingBottom": "5px"}}>
        <div class="row">
            <div class="col-12">
                <div class="article-text">
                    <h2 style={{"paddingTop": "5px"}}><strong>Do these whales match?</strong></h2>
                              </div>
                                          <GridContainer>
{/*             <GridItem xs={12} sm={12} md={6}>
              <img src={require("assets/img/arrow_keys.svg")} style={{"width": "150px", "height": "150px", "backgroundColor": "white"}}/>
            </GridItem> */}

              <GridItem xs={12} sm={12} md={12} space={10}>


                        <br/>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                        <LinearProgress variant="determinate" value={this.state.vertical / (this.state.new_pictures.length - 1) * 100} />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                        <LinearProgress variant="determinate" value={this.state.horizontal / (this.state.new_pictures[this.state.vertical].length - 1) * 100} />
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{"color": "black"}}>
                        <strong>New Image Number: </strong> <Badge color="success">{this.state.vertical}</Badge>
                        <br/>
                        <strong>Assigned Whale Id:</strong> <Badge  color="info">{this.state.left_id}</Badge>
                        <br/>
                        {this.state.is_loaded.has(this.state.new_pictures[this.state.vertical]) ? '' : <CircularProgress />}
{/*                         <img src={"http://localhost:3000/images/" + this.state.new_pictures[this.state.vertical];} onLoad={this.handleLeftImageLoaded.bind(this)}
                          onError={this.handleLeftImageErrored.bind(this)}
                        /> */}

                        <Gallery thumbnailImageComponent={ImageComponent} images={[{tags: [], onError: this.handleLeftImageErrored.bind(this), onLoad: this.handleLeftImageLoaded.bind(this), src: this.getimagescropped(this.state.new_pictures[this.state.vertical]), thumbnailWidth: 480, thumbnailHeight: 320,thumbnail: this.getimages(this.state.new_pictures[this.state.vertical])}]} rowHeight={240} enableLightbox={true} backdropClosesModal enableImageSelection={false}/>
                        <br/>
                </GridItem>

                <GridItem xs={12} sm={12} md={6} style={{"color": "black"}}>
                        <strong>Best Matching Picture Number:</strong>
                        <Badge color="success">{this.state.horizontal}</Badge>
                        <br/>
                        <strong>Whale Id:</strong> <Badge color="info">{this.state.right_id}</Badge >
                        <br/>
                        {this.state.is_loaded.has(this.state.similar_pictures[this.state.horizontal]) ? '' : <CircularProgress />}
                       {/*  <img src={"http://localhost:3000/images/" + this.state.similar_pictures[this.state.horizontal]} onLoad={this.handleRightImageLoaded.bind(this)} /> */}
                        <Gallery thumbnailImageComponent={ImageComponent} images={[{tags: [], onError: this.handleRightImageErrored.bind(this), onLoad: this.handleRightImageLoaded.bind(this), src: this.getimagescropped(this.state.similar_pictures[this.state.horizontal]), thumbnailWidth: 480, thumbnailHeight: 320,thumbnail: this.getimages(this.state.similar_pictures[this.state.horizontal])}]} rowHeight={240} enableLightbox={true} backdropClosesModal enableImageSelection={false}/>
                        <br/>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                <h4 style={{ color: 'black' }}><a href={"search-page/"+ this.state.left_id}>{this.state.new_pictures[this.state.vertical]}</a> </h4>
                    {/*     {console.log('this.state.vertical][0]::',this.state.whale_csv[this.state.vertical][0])}
                        {console.log('this.state.matchedPictures[this.state.whale_csv[this.state.vertical][0]]:  ',this.state.matchedPictures[this.state.whale_csv[this.state.vertical][0]])}
                <GridItem xs={12} sm={12} md={6}>
                <h4 style={{ color: 'black' }}><a href={"search-page/"+ this.state.left_id}>{this.state.new_pictures[this.state.vertical]}</a> </h4>
                    {/*     {console.log('this.state.vertical][0]::',this.state.new_pictures[this.state.vertical];)}
                        {console.log('this.state.matchedPictures[this.state.new_pictures[this.state.vertical];]:  ',this.state.matchedPictures[this.state.new_pictures[this.state.vertical];])}
                        {console.log('has(this.state.whale_csv[this.state.vertical][this.state.horizontal+1]): ',this.state.whale_csv[this.state.vertical][this.state.horizontal+1])} */}
{/*                 {this.state.whale_csv[this.state.vertical][0] in this.state.matchedPictures &&
                 Array.from(this.state.matchedPictures[this.state.whale_csv[this.state.vertical][0]]).join().includes(this.state.whale_csv[this.state.vertical][this.state.horizontal+1]) ?
                 <Button variant="contained" onClick={() => this.unacceptPicture()} color="warning">🐳 UnMatch!</Button> :
{/*                 {this.state.new_pictures[this.state.vertical]; in this.state.matchedPictures &&
                 Array.from(this.state.matchedPictures[this.state.new_pictures[this.state.vertical];]).join().includes(this.state.whale_csv[this.state.vertical][this.state.horizontal+1]) ?
                 <Button variant="contained" onClick={() => this.unacceptPicture()} color="warning">🐳 UnMatch!</Button> :
                 <Button variant="contained" onClick={() => this.acceptPicture()} color="success">🐳 Match!</Button>} */}
                <Button variant="contained" onClick={() => this.go_up()}color="info" size="sm">&#9650;</Button>
              <Button variant="contained" onClick={() => this.go_down()}color="info" size="sm">&#9660;</Button>
              <Button variant="contained" onClick={() => this.go_badPicture()}color="badPicture" size="sm">Bad picture</Button>
              <SetWhaleDialog function={this.go_manualId.bind(this)}></SetWhaleDialog>
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
              <h4 style={{ color: 'black' }}><a href={"search-page/"+ this.state.left_id}>{this.state.similar_pictures[this.state.horizontal]}</a></h4>
      {/*  new buttons for the matching result */}
              <Button disabled={(this.state.user =="LisaSteiner"||this.state.user == "whalewatching")?false:true} variant="contained" onClick={() => this.acceptPicture()} color = "success"/* color={this.state.isMatched ? "grey" : "success"} disabled = {this.state.isMatched} */ size="sm">Match</Button>
              <Button disabled={(this.state.user == "LisaSteiner"||this.state.user == "whalewatching")?false:true} variant="contained" onClick={() => this.unacceptPicture()} color = "info"/* color={this.state.isMatched ? "warning" : "grey"}  disabled = {!this.state.isMatched} */ size="sm">Don't match</Button>
{/*               <Button variant="contained" onClick={() => this.go_decideLater()}color="decideLater" size="sm">Decide later</Button> */}
{/*               <Button variant="contained" onClick={() => this.go_newId()}color="newId" size="sm">New ID</Button> */}
              <br/>
{/*  next pictures */}
              <Button variant="contained" onClick={() => this.go_left()}color="info" size="sm">&#9664;</Button>
              <Button variant="contained" onClick={() => this.go_right()}color="info" size="sm">&#10148;</Button>
{/*               <Button variant="contained" onClick={() => this.signout()}color="info" size="sm">Signout</Button>
              <SignOut/> */}
                     {/*        <Button variant="contained" onClick={() => this.signout()}color="info" size="sm">Log Out</Button>
                            <SignOut/> */}
              </GridItem>
            </GridContainer>
          </div></div>
          </div></div>
          </div>
    );
  }
}
const LandingPageContainer = connect(dispatch => ({ dispatch }))(LandingPage);

export default withStyles(landingPageStyle)(LandingPageContainer);
