import React from 'react';
//import { configureAmplify, SetS3Config } from "./services";
import Header from 'components/Header/Header.jsx';
import HeaderLinks from 'components/Header/HeaderLinks.jsx';
import Storage from '@aws-amplify/storage';
// Pagination See: https://demos.creative-tim.com/material-kit-react/#/documentation/pagination
import Pagination from 'components/Pagination/Pagination.jsx';
import withStyles from '@material-ui/core/styles/withStyles';
import landingPageStyle from 'assets/jss/material-kit-react/views/landingPage.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import { Auth } from 'aws-amplify';
import { getWhale, listWhales, getPicture } from 'graphql/queries';
import { updatePicture } from 'graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api';
import Gallery from 'react-grid-gallery';
import Snackbar from '@material-ui/core/Snackbar';
import Amplify from '@aws-amplify/core';
import { Search } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Footer from 'components/Footer/Footer.jsx';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      IMAGES: [],
      VISIBLE_IMAGES: [],
      noData: false,
      selectedImages: [],
      dialogMessage: '',
      response: undefined,
      loading: true,
      whales: [],
      searchResult: [],
      page: 0,
      max_per_page: 3,
    };
    Amplify.configure({
      aws_appsync_authenticationType: 'API_KEY',
    });
    this.searchRef = React.createRef();
    this.onSelectImage = this.onSelectImage.bind(this);
    this.getSelectedImages = this.getSelectedImages.bind(this);
    this.authenticate_user();

    this.getWhales();
  }
  componentDidMount() {
    const whale_id = this.props.match.params.whale_id;
    if (whale_id) {
      this.searchRef.current.state.value = whale_id;
      this.searchWhales(this.state, whale_id);
    }
  }

  async getWhales() {
    const _whales = await API.graphql(
      graphqlOperation(listWhales, { limit: 3000 })
    );
    console.log('whale output aws', _whales);
    const whale_items = _whales.data.listWhales.items;
    await this.setState({
      searchResult: this.state.whales.map((item) => {
        return { title: item };
      }),
    });
    await this.setState({ whales: whale_items.map((item) => item.name) });
    await this.setState({ loading: false });
    return whale_items;
  }
  onSelectImage(index, image) {
    console.log('index', index);
    console.log('image', image);
    var images = this.state.IMAGES.slice();
    var img = images[index];
    if (Object.hasOwnProperty.call(img, 'isSelected')) {
      img.isSelected = !img.isSelected;
    } else img.isSelected = true;
    this.setState({
      IMAGES: images,
    });
    this.updatePage(this.state.page);
    console.log('state images', this.state.IMAGES);
  }

  async getSelectedImages() {
    try {
      let queryWasSuccess = false;
      console.log('setting whaleid of images -1 and is_new flag as false');
      for (var i = 0; i < this.state.IMAGES.length; i++) {
        if (this.state.IMAGES[i].isSelected == true) {
          console.log(
            'rematching selected images',
            this.state.IMAGES[i].caption
          );
          const selected_image_name = this.state.IMAGES[i].caption;
          queryWasSuccess = await API.graphql(
            graphqlOperation(updatePicture, {
              input: { id: selected_image_name, is_new: 1, pictureWhaleId: -1 },
            })
          );
          if (queryWasSuccess) {
            console.log('Successfully assigned whales ', selected_image_name);
            this.showSnackBar(
              "Picture '" + selected_image_name + "' can now be re-matched",
              5000
            );
          }
        }
      }
      const searchInput = this.searchRef.current.state.value;
      this.searchWhales(this.state, searchInput);
    } catch (e) {
      console.log('error while re-setting whaleID and is_new flag');
    }
  }

  /**
   * A Snackbar with message will appear for timeout milliseconds.
   **/
  showSnackBar(message, timeout) {
    this.setState({
      dialogMessage: message,
    });
    setTimeout(() => this.setState({ dialogMessage: '' }), timeout);
  }

  authenticate_user() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log('searchpage user', user.username);
        this.setState({ user: user.username });
        Amplify.configure({
          aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
        });
      })
      .catch((err) => {
        console.log('currentAuthenticatedUser searchpage err', err);
        this.setState({ user: null });
        Amplify.configure({
          aws_appsync_authenticationType: 'API_KEY',
        });
        //this.props.history.push("/login-page");
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
  async searchWhales(data, query) {
    let returnPath;
    try {
      await this.setState({ loading: true });
      const S3bucket = await Storage.get('');
      returnPath = S3bucket.split('public/')[0];
      console.log('search page bucket path', returnPath);
      const whale = await API.graphql(
        graphqlOperation(getWhale, { id: query })
      );
      const pictures = await API.graphql(
        graphqlOperation(getPicture, { id: query })
      );
      await this.setState({ loading: false });
      console.log('whale output aws', whale);
      console.log('pictures output aws', pictures);
      if (whale.data.getWhale) {
        console.log(
          'whale ID output present. length',
          whale.data.getWhale.pictures.items.length
        );
        this.state.IMAGES = [];
        whale.data.getWhale.pictures.items.forEach((item) => {
          this.state.IMAGES.push(this.formatImages(item, query, returnPath));
        });
        this.setState({ noData: false });
      } else if (pictures.data.getPicture) {
        console.log(
          'pictures name output present. ',
          pictures.data.getPicture.id
        );
        this.state.IMAGES = [];
        this.state.IMAGES.push(
          this.formatImages(
            pictures.data.getPicture,
            pictures.data.getPicture.whale.id,
            returnPath
          )
        );
        this.setState({ noData: false });
      } else {
        console.log('pictures and whales both null output. ');
        this.setState({ noData: true, IMAGES: [] });
      }
    } catch (e) {
      this.setState({ noData: true, IMAGES: [] });
      console.log('no results found', e);
      await this.setState({ loading: false });
    }
    this.updatePage(this.state.page);
  }
  async handleSubmit(event) {
    event.preventDefault();
    const searchInput = event.target.textContent;
    const data = this.state;
    console.log('state before submit', data);
    this.searchWhales(data, searchInput);
    console.log('state after submit', this.state);
  }

  async handleAlternate(event) {
    event.preventDefault();
    const data = this.state;
    console.log('inside handleAlternate function');
    console.log('state before submit', data);
    let returnPath;
    try {
      this.setState({ loading: true });
      this.setState({ IMAGES: [], response: '' });
      this.updatePage(this.state.page);
      const S3bucket = await Storage.get('');
      returnPath = S3bucket.split('public/')[0];
      console.log('search page bucket path', returnPath);

      const whale_items = this.state.whales;
      console.log('whale_items', whale_items);
      const randomID =
        whale_items[Math.floor(Math.random() * whale_items.length)];
      console.log('randomID', randomID);
      const random_whale = await API.graphql(
        graphqlOperation(getWhale, { id: randomID })
      );
      console.log('random_whale', random_whale);
      const picture_items = random_whale.data.getWhale.pictures.items;
      console.log('picture_items', picture_items);
      this.state.IMAGES = [];
      picture_items.forEach((item) => {
        this.state.IMAGES.push(this.formatImages(item, randomID, returnPath));
      });
      this.setState({
        noData: false,
        response: undefined,
      });
      this.searchRef.current.state.value = randomID;
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ noData: true, IMAGES: [] });
      console.log('no results found for random whale', e);
      this.setState({ loading: false });
    }
    console.log('state after submit', this.state);
    this.updatePage(this.state.page);
  }

  formatImages(item, whale_id, S3bucket) {
    console.log('fetching images array from S3', item);
    return {
      src: S3bucket + 'public/watermark/' + item.filename,
      thumbnail: S3bucket + 'public/watermark/' + item.filename,
      /*  thumbnailWidth: 360,
      thumbnailHeight: 90, */
      tags: [
        { value: item.filename, title: 'File name' },
        { value: whale_id, title: 'Whale ID' },
      ],
      caption: item.filename,
    };
  }
  async _handleKeyDown(e) {
    const isEnter = e.key === 'Enter';
    if (isEnter) {
      console.log('ENTER');
    }
    setTimeout(() => {
      const searchInput = this.searchRef.current.state.value;
      this.setState({
        searchResult: this.state.whales
          .filter((item) => {
            return item.toString().startsWith(searchInput);
          })
          .map((item) => {
            return { title: item };
          }),
      });
      if (isEnter) {
        this.searchWhales(this.state, searchInput);
      }
    }, 1);
  }
  updatePage(page){
      console.log(page);
      page = Math.min(Math.round(this.state.IMAGES.length/this.state.max_per_page), page);
      console.log(page);
      this.setState({VISIBLE_IMAGES: this.state.IMAGES.slice(this.state.max_per_page*page, this.state.max_per_page * page+this.state.max_per_page), page: page});
  }
  render() {
    const { dialogMessage } = this.state;
    const { classes, ...rest } = this.props;
    const admins = new Set(['LisaSteiner', 'whalewatching']);
    const adminFlag = admins.has(this.state.user) ? true : false;
    console.log('adminFlag', adminFlag);

    return (
      <div>
        <Header
          color="blue"
          brand={
            <img
              src={require('assets/img/fluketracker-logo(blue-bg).jpg')}
              style={{
                width: '90%',
                paddingBottom: '0px',
                margin: '0 auto',
              }}
            />
          }
          fixed
          rightLinks={<HeaderLinks user={this.state.user} />}
          changeColorOnScroll={{
            height: '400',
            color: 'black',
          }}
          {...rest}
        />
        {
          <div className={classes.container} style={{ minHeight: '95vh' }}>
            <div
              className="section container"
              style={{ paddingTop: '180px', paddingBottom: '5px' }}
            >
              <div className="row">
                <div className="col-12">
                  <div className="article-text">
                    <h2 style={{ paddingTop: '5px' }}>
                      <strong>Search Whale Image 🐳</strong>
                    </h2>
                    <p style={{ paddingBottom: '5px' }}>
                      You can search for whale images using:
                    </p>
                    <ul
                      style={{
                        listStyleType: 'none',
                        paddingBottom: '5px',
                        color: 'black',
                      }}
                    >
                      <li>
                        <strong>Search whale / image: </strong>This will display
                        all whales tagged to the given ID
                      </li>
                      <li>
                        <strong>Display random whale: </strong>This will display
                        the images of a random whale
                      </li>
                      <li>
                        <strong>Re-match whale: </strong>After searching for a
                        whale ID you can select one of the displayed pictures
                        and remove the ID from it.
                        <br />
                        This way you will be able to re-match it again, in case
                        of a matching-mistake.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Search
              results={this.state.searchResult}
              placeholder="whale ID / image name"
              loading={this.state.loading}
              onResultSelect={this.handleSubmit.bind(this)}
              ref={this.searchRef}
              onKeyDown={this._handleKeyDown.bind(this)}
              noResultsMessage="Whale id not found, search if you want to query image"
            />

            <Button
              onClick={this.handleSubmit.bind(this)}
              style={{ margin: '10px' }}
              variant="contained"
              color="info"
              size="sm"
            >
              Search Whale / Image
            </Button>
            <Button
              onClick={this.handleAlternate.bind(this)}
              style={{ margin: '10px' }}
              variant="contained"
              color="info"
              size="sm"
            >
              🎲 Display Random Whale
            </Button>
            {adminFlag ? (
              <Button
                onClick={this.getSelectedImages.bind(this)}
                style={{ margin: '10px' }}
                variant="contained"
                color="info"
                size="sm"
              >
                Re-Match Whale
              </Button>
            ) : (
              <div></div>
            )}

             <div className="row">
                <div className="col-12">
                    <Gallery
                      images={this.state.VISIBLE_IMAGES}
                      rowHeight={90}
                      enableLightbox={true}
                      backdropClosesModal
                      onSelectImage={this.onSelectImage}
                    />
                </div>
                <div className="col-12">
                    {this.state.IMAGES.length > 0 &&
                        <>
                        <Pagination
                          pages={
                          Array.from(Array(Math.ceil(this.state.IMAGES.length/this.state.max_per_page)).keys()).map(num => {return {text: num+1, active: num == this.state.page, onClick: p => this.updatePage(num) }})
                         }
                          color="info"
                        />

                       </>
                    }
                </div>
            </div>

            {this.state.noData && (
              <p style={{ color: 'red' }}>
                No results found. Please try again.
              </p>
            )}
            <Snackbar
              open={dialogMessage !== ''}
              message={dialogMessage}
              autoHideDuration={4000}
            />
          </div>
        }
        <Footer whiteFont />
      </div>
    );
  }
}
SearchPage.propTypes = {
  match: PropTypes.element.isRequired,
  classes: PropTypes.element.isRequired,
};

export default withStyles(landingPageStyle)(SearchPage);
