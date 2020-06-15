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
      this.state.IMAGES.push(this.formatImages(item))
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
formatImages(item){
console.log('fetching images array from S3',item)
return {
    src: 'https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09175546-dev.s3.eu-central-1.amazonaws.com/cropped_images/'+ item.filename,
    thumbnail: 'https://whalewatch315ac43cc81e4e31bd2ebcdca3e4bb09175546-dev.s3.eu-central-1.amazonaws.com/thumbnails/'+ item.thumbnail,
    thumbnailWidth: 320,
    thumbnailHeight: 174,
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
         <Parallax color="black" small center fixed filter image={require("assets/img/tail.jpg")} style={{"height": "30vh"}} />
                <div className={classNames(classes.main, classes.mainRaised)} style={{"height": "66vh"}}>
          <div className={classes.container}>
          <GridContainer color = "black">
            <GridItem xs={12} sm={12} md={6}><h2 className={classes.title} style={{"color": "black"}}>Search Whale Image 🐳</h2></GridItem>
        </GridContainer> 
         {this.state.noData && (<p style={{ color: 'red' }}>No Results Found!</p>)}  
          <form onSubmit={this.handleSubmit.bind(this)} >
        <input
        type="text"
        style={{"text-align": "center"}}
        name = 'searchInput'
        placeholder="Search"
        value={this.state.searchInput}
        onChange={this.handleInputChange.bind(this)}
        required
      />
        <button >Search Whale</button>
        <Gallery images={this.state.IMAGES}/>
      </form>
      </div>
      </div>
              <Footer />
      </div>
    );
  }
}
export default withStyles(landingPageStyle)(UploadPage);