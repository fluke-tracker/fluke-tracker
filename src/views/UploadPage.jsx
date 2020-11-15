import React from 'react';
import Header from 'components/Header/Header.jsx';
import HeaderLinks from 'components/Header/HeaderLinks.jsx';
import withStyles from '@material-ui/core/styles/withStyles';
import Auth from '@aws-amplify/auth';
import basicsStyle from 'assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx';
import Amplify from '@aws-amplify/core';
import 'react-dropzone-uploader/dist/styles.css';
import WhaleUploader from 'components/WhaleUploader/WhaleUploader.jsx';
import PropTypes from 'prop-types';

class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    Amplify.configure({
      aws_appsync_authenticationType: 'API_KEY',
    });
    this.authenticate_user();
  }

  authenticate_user() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log('uploadpage user', user.username);
        this.setState({ user: user });
        Amplify.configure({
          aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
        });
      })
      .catch((err) => {
        console.log(
          'currentAuthenticatedUser uploadpage er pushing to login page',
          err
        );
        this.setState({ user: null });
        Amplify.configure({
          aws_appsync_authenticationType: 'API_KEY',
        });
        //this.props.history.push("/login-page");
      });
  }

  render() {
    const { classes, ...rest } = this.props;

    return (
      <div style={{ minHeight: '100vh' }}>
        <Header
          fixed
          rightLinks={<HeaderLinks user={this.state.user} />}
          {...rest}
        />
        <div>
          <div
            className="section container"
            style={{
              backgroundImage: 'url(require("../assets/img/tail.jpg"))',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          ></div>
          <br />
          <br />
          <br />

          <div className={classes.container}>
            <div className="section container">
              <div className="row">
                <div className="col-12">
                  <div className="article-text">
                    <h1>
                      <strong>Upload Whale Image 🐳</strong> (Registration
                      required)
                    </h1>
                    <WhaleUploader
                      user={this.state.user}
                      history={this.props.history}
                      classes={this.props.classes}
                    />
                    <br />

                    <p style={{ marginBottom: '5px' }}>
                      Here are a few points about the uploading of images:
                    </p>
                    <ul
                      style={{
                        listStyleType: 'none',
                        paddingBottom: '0px',
                        color: 'black',
                      }}
                    >
                      <li>
                        Image must be ventral side of the animal in an upright
                        (or as close to vertical as possible) position.
                      </li>
                      <li>
                        If the image is taken from the front of the animal, then
                        the image must be flipped horizontally before uploading.
                      </li>
                      <li>
                        If the image is taken on the lifting of the fluke, the
                        image has to be flipped vertically, so the trailing edge
                        is on the top of the image.
                      </li>
                      <li>
                        Please do not upload dorsal fin or head images as this
                        will confuse the algorithm.
                      </li>
                    </ul>
                    <p style={{ marginBottom: '5px' }}>
                      What is the cropping algorithm?
                    </p>
                    <ul
                      style={{
                        listStyleType: 'none',
                        paddingBottom: '0px',
                        color: 'black',
                      }}
                    >
                      <li>
                        The fluke tracker machine learning model, finds the best
                        matches to images in the database by using images
                        tightly cropped around the flukes of whales.
                      </li>
                      <li>
                        {' '}
                        Select <b>Browser Cropping </b>option to crop images
                        yourself. You are supported by a algorithm which makes a
                        suggestion. Depending on your system this can take some
                        time since the algorithm is running on your browser.
                      </li>
                      <li>
                        {' '}
                        Select the <b>Use Cropping Algorithm </b>option to
                        leverage the algorithm which automatically crops
                        uploaded images{' '}
                      </li>
                      <li>
                        To upload manually cropped images, select the{' '}
                        <b>No Cropping</b> option.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
UploadPage.propTypes = {
  classes: PropTypes.element.isRequired,
  history: PropTypes.element.isRequired,
};

export default withStyles(basicsStyle)(UploadPage);
