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
    if(this.props.match.params.whale_id) {
        this.setState({searchInput: this.props.match.params.whale_id})
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
async handleSubmit (event){
    event.preventDefault()
    const data = this.state
    console.log('state before submit',data)
    try {
    const whale = await API.graphql(graphqlOperation(getWhale, {id: data.searchInput}));
    //const pictures = API.graphql(graphqlOperation(getPicture, {id: "PM-WWA-20060531-D057.jpg"})).then(data => console.log(data));
    console.log('whale output aws',whale)
    console.log('length',whale.data.getWhale.pictures.items.length)
    this.state.IMAGES=[]
    whale.data.getWhale.pictures.items.forEach(item => {
      this.state.IMAGES.push(this.formatImages(item,data.searchInput))
    });
   this.setState({noData: false})
    }
    catch(e)
  {
   this.setState({noData: true,IMAGES:[]})
    console.log("no results found",e)
  }
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
        color="transparent"
        routes={dashboardRoutes}
        brand=""
        fixed
        rightLinks={<HeaderLinks user={this.state.user} />}
        changeColorOnScroll={{
          "height": "400",
          "color": "white"
        }}
        {...rest}
      />
         <Parallax color="black" small center fixed filter image={require("assets/img/tail.jpg")} style={{"height": "20vh"}} />
          <div className={classes.container}>
          <GridContainer color = "black">
            <GridItem xs={12} sm={12} md={6}><h2 className={classes.title} style={{"color": "black"}}>Search Whale Image 🐳</h2></GridItem>
            <GridItem xs={6} sm={12} md={12}>
            <h4 style={{ color: 'black' }}>You can search for Whale Images using:</h4>
            <ul>
            <li style={{ color: 'black' }}>Whale ID: This will display all Whales tagged to the given ID</li>
            <li style={{ color: 'black' }}>Random Whale: This will display a random image of the Whale with Image Name and ID</li>
            </ul>
            </GridItem>
        </GridContainer>
          <form onSubmit={this.handleSubmit.bind(this)} >
        <input
        type="text"
        style={{"text-align": "center"}}
        name = 'searchInput'
        placeholder="Whale ID"
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