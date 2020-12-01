import React from 'react';
//import { configureAmplify, SetS3Config } from "./services";
import Header from 'components/Header/Header.jsx';
import HeaderLinks from 'components/Header/HeaderLinks.jsx';
import Storage from '@aws-amplify/storage';
import withStyles from '@material-ui/core/styles/withStyles';
import landingPageStyle from 'assets/jss/material-kit-react/views/landingPage.jsx';
import { Auth } from 'aws-amplify';
import { createPicture, updateConfig } from 'graphql/mutations';
import { getConfig } from 'graphql/queries';
import API, { graphqlOperation } from '@aws-amplify/api';
import PropTypes from 'prop-types';
import Footer from 'components/Footer/Footer.jsx';

class Term extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageName: '',
      imageFile: '',
      response: '',
      user: null,
    };
    this.authenticate_user();
  }

  authenticate_user() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log('termpage user', user.username);
        this.setState({ user: user });
      })
      .catch((err) =>
        console.log('currentAuthenticatedUser termpage err', err)
      );
  }

  render() {
    const { classes, ...rest } = this.props;

    let boxStyle = {
      border: '2px solid white',
      borderRadius: '12px',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '25px',
      paddingBottom: '15px',
      backgroundColor: '#f0f0f0', // "#ebf7ff",
    };
    boxStyle = {
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '15px',
      paddingBottom: '15px',
    };

    return (
      <div style={{ minHeight: '100vh' }}>
        <Header
          color="blue"
          brand={
            <img
              src={require('assets/img/fluketracker-logo(blue-bg).jpg')}
              style={{
                width: '90%',
                paddingBottom: '0px',
                margin: '0 auto 0 0',
                'max-width': '40%',
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
        <div className={classes.container}>
          <div
            className="section container"
            style={{ paddingTop: '180px', paddingBottom: '5px' }}
          >
            <div className="row">
              <div className="col-12">
                <div className="article-text" style={{ paddingTop: "60px" }}>
                  <h1 style={{ paddingTop: "5px" }}>
                    <b>FlukeTracker’s Privacy Policy</b>
                  </h1>
                  <div style={{
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif', color: 'black'
                      }}>
                  </div>
                </div>
                              </div>
            </div>
          </div>
        </div>
        <Footer whiteFont />
      </div>
    );
  }
}
Term.propTypes = {
  classes: PropTypes.element.isRequired,
};

export default withStyles(landingPageStyle)(Term);
