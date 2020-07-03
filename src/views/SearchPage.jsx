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
import { Auth } from 'aws-amplify';
import Footer from "components/Footer/Footer.jsx";
import { getWhale  } from 'graphql/queries';
import { getPicture  } from 'graphql/queries';
import API, { graphqlOperation } from '@aws-amplify/api';
import { render } from 'react-dom';
import Gallery from 'react-grid-gallery';
import { listWhales } from 'graphql/queries';
const dashboardRoutes = [];
const IMAGES = []
class UploadPage extends React.Component {
    constructor(props) {
    super(props)
this.state = {
    searchInput: "",
    user: null,
    IMAGES: [],
    noData: false,
}
    if(props.match.params.whale_id) {
            this.state.searchInput =  props.match.params.whale_id;
            this.searchWhales(this.state);
    }
    this.authenticate_user();
}

authenticate_user() {
    Auth.currentAuthenticatedUser()
          .then(user => { 
           console.log('searchpage user',user.username);
           this.setState({ user: user })
          }).catch(err => console.log('currentAuthenticatedUser searchpage err', err))
  }
handleInputChange (event) {
    event.preventDefault()
/*     console.log(event.target.name)
    console.log(event.target.value) */
    this.setState({
        [event.target.name]: event.target.value
    })
  }
async searchWhales(data) {
try {
    const whale = await API.graphql(graphqlOperation(getWhale, {id: data.searchInput}));
    const pictures = await API.graphql(graphqlOperation(getPicture, {id: data.searchInput}));
    console.log('whale output aws',whale)
    console.log('pictures output aws',pictures)
    if(whale.data.getWhale)
    {
    console.log('whale ID output present. length',whale.data.getWhale.pictures.items.length)
    this.state.IMAGES=[]
    whale.data.getWhale.pictures.items.forEach(item => {
      this.state.IMAGES.push(this.formatImages(item,data.searchInput))
    });
    this.setState({noData: false})
    }
    else if (pictures.data.getPicture){
      console.log('pictures name output present. ',pictures.data.getPicture.id)
      this.state.IMAGES=[]
      this.state.IMAGES.push(this.formatImages(pictures.data.getPicture,pictures.data.getPicture.whale.id))
      this.setState({noData: false})
    }
    else {
      console.log('pictures and whales both null output. ')
      this.setState({noData: true,IMAGES:[]})
    }
  }
    catch(e)
  {
   this.setState({noData: true,IMAGES:[]})
    console.log("no results found",e)
  }
}
async handleSubmit (event){
    event.preventDefault()
    const data = this.state
    console.log('state before submit',data)
    this.searchWhales(data)
   console.log('state after submit',this.state)
}

async handleAlternate (event){
  event.preventDefault()
  const data = this.state
  console.log('inside handleAlternate function')
  console.log('state before submit',data)
  try {
  const whale = await API.graphql(graphqlOperation(listWhales, {limit: 3000 }));
  console.log('whale output aws',whale)
  const whale_items = whale.data.listWhales.items
  console.log('whale_items',whale_items)
  const randomID = whale_items[Math.floor(Math.random() * whale_items.length)];
  console.log('randomID',randomID)
  const random_whale = await API.graphql(graphqlOperation(getWhale, {id: randomID.name}));
  console.log('random_whale',random_whale)
  const picture_items = random_whale.data.getWhale.pictures.items
  console.log('picture_items',picture_items)
  this.state.IMAGES=[]
  picture_items.forEach(item => {
    this.state.IMAGES.push(this.formatImages(item,randomID.name))
  });
  this.setState({noData: false,searchInput:randomID.name})
  }
  catch(e)
{
 this.setState({noData: true,IMAGES:[]})
  console.log("no results found for random whale",e)
}
 console.log('state after submit',this.state)
}

formatImages(item,whale_id){
console.log('fetching images array from S3',item)
return {
    src: 'https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09213627-whaledev.s3.eu-central-1.amazonaws.com/cropped_images/'+ item.filename,
    thumbnail: 'https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09213627-whaledev.s3.eu-central-1.amazonaws.com/thumbnails/'+ item.thumbnail,
    thumbnailWidth: 320,
    thumbnailHeight: 174,
    tags: [{value: item.filename, title:"File name"},{value:whale_id, title:"Whale ID"}],
    caption: item.filename
  }
}
  render() {
    const { classes, ...rest } = this.props;
    const searchInput=this.state.searchInput;
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
                    <h2 style={{"paddingTop": "5px"}}><strong>Search Whale Image 🐳</strong></h2>
                    <p style={{"paddingBottom": "5px"}}>You can search for Whale Images using:</p>
                    <ul style={{"paddingBottom": "5px", "color":"black"}}>
                        <li><strong>Whale ID</strong>: This will display all Whales tagged to the given ID</li>
                        <li><strong>Random Whale</strong>: This will display a random image of the Whale with Image Name and ID</li>
                    </ul>
          </div></div></div>
          </div>

          <form onSubmit={this.handleSubmit.bind(this)} >
        <input
        type="text"
        style={{"text-align": "center"}}
        name = 'searchInput'
        placeholder="Whale ID/Image Name"
        value={this.state.searchInput}
        onChange={this.handleInputChange.bind(this)}
        required
      />
        <button >Search Whale</button>
        <button onClick={this.handleAlternate.bind(this)}>Display Random Whale</button>
        <Gallery images={this.state.IMAGES} rowHeight={174} enableLightbox={true} backdropClosesModal enableImageSelection={false}/>
      </form>
      {this.state.noData && (<p style={{ color: 'red' }}>No Results Found!</p>)}  
      </div>
      </div>
    );
  }
}
export default withStyles(landingPageStyle)(UploadPage);