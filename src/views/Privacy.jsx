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

class Privacy extends React.Component {
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
<h3>This privacy policy will explain how FlukeTracker uses the personal data we collect from you when you use our website. </h3>
<h3>Topics: </h3>
<ul>
<li>What data do we collect? </li>
<li>How do we collect your data? </li>
<li>How will we use your data? </li>
<li>How do we store your data? </li>
<li>Marketing</li>
<li>What are your data protection rights? </li>
<li>What are cookies? </li>
<li>How do we use cookies? </li>
<li>What types of cookies do we use? </li>
<li>How to manage your cookies</li>
<li>Privacy policies of other websites</li>
<li>Changes to our privacy policy</li>
<li>How to contact us</li>
</ul>
<h2>What data do we collect? </h2>
<p>FlukeTracker collects the following data: </p>
<ul>
<li>Personal identification information (Name, email address) </li>
</ul>
<h2>How do we collect your data? </h2>
<p>You directly provide FlukeTracker with most of the data we collect. We collect data and process data when you: </p>
<ul>
<li>Register online or log in. </li>
<li>Use or view our website via your browser’s cookies. </li>
<li>Upload photos on our website. </li>
</ul>
<h2>How will we use your data? </h2>
<p>FlukeTracker collects your data so that we can: </p>
<ul>
<li>Manage access to different functions on our website. </li>
<li>Add watermarks to the photos that are uploaded to our website</li>
<li>Assign and display the user name of the photos on our website</li>
</ul>
<h2>How do we store your data? </h2>
<>FlukeTracker securely stores your data on cloud infrastructure which is managed by AWS. Security precautions are taken by our service provider AWS. All privacy-related information can be found in AWS’s privacy policy on https://aws.amazon.com. </>
<>FlukeTracker will keep your user data for as long as there are photos uploaded by you in our database. Once this is not fulfilled anymore, your user information is automatically deleted with the photos. </>
<h2>What are your data protection rights? </h2>
<p>FlukeTracker would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following: </p>
<p><strong>The right to access</strong> – You have the right to request FlukeTracker for copies of your personal data. We may charge you a small fee for this service. </p>
<p><strong>The right to rectification</strong> – You have the right to request that FlukeTracker correct any information you believe is inaccurate. You also have the right to request FlukeTracker to complete the information you believe is incomplete. </p>
<p><strong>The right to erasure</strong> – You have the right to request that FlukeTracker erase your personal data, under certain conditions. </p>
<p><strong>The right to restrict processing</strong>  – You have the right to request that FlukeTracker restrict the processing of your personal data, under certain conditions. </p>
<p><strong>The right to object to processing</strong>  – You have the right to object to FlukeTracker’s processing of your personal data, under certain conditions. </p>
<p><strong>The right to data portability</strong> – You have the right to request that FlukeTracker transfer the data that we have collected to another organization, or directly to you, under certain conditions. </p>
<p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at our email: </p>
<p>Call us at: <a href="mailto:marcel.bergmann@capgemini.com">marcel.bergmann@capgemini.com</a></p>
<h2>Cookies</h2>
<p>Cookies are text files placed on your computer to collect standard Internet log information and visitor behavior information. When you visit our websites, we may collect information from you automatically through cookies or similar technology</p>
<p>For further information, visit allaboutcookies.org. </p>
<h2>How do we use cookies? </h2>
<p>FlukeTracker uses cookies in a range of ways to improve your experience on our website, including: </p>
<ul>
<li>Keeping you signed in</li>
<li>Understanding how you use our website</li>
</ul>
<h2>What types of cookies do we use? </h2>
<p>There are a number of different types of cookies, however, our website uses: </p>
<ul>
<li>Functionality – FlukeTracker uses these cookies so that we recognize you on our website and remember your previously selected preferences. These could include what language you prefer and location you are in. A mix of first-party and third-party cookies are used. </li>
<li>Advertising – FlukeTracker uses these cookies to collect information about your visit to our website, the content you viewed, the links you followed and information about your browser, device, and your IP address. FlukeTracker sometimes shares some limited aspects of this data with third parties for advertising purposes. We may also share online data collected through cookies with our advertising partners. This means that when you visit another website, you may be shown advertising based on your browsing patterns on our website. </li>
</ul>
<h2>How to manage cookies</h2>
<p>You can set your browser not to accept cookies, and the above website tells you how to remove cookies from your browser. However, in a few cases, some of our website features may not function as a result. </p>
<h2>Privacy policies of other websites</h2>
<p>The FlukeTracker website contains links to other websites. Our privacy policy applies only to our website, so if you click on a link to another website, you should read their privacy policy. </p>
<h2>Changes to our privacy policy</h2>
<p>FlukeTracker keeps its privacy policy under regular review and places any updates on this web page. This privacy policy was last updated on 1st December 2020. </p>
<h2>How to contact us</h2>
<p>If you have any questions about FlukeTracker’s privacy policy, the data we hold on you, or you would like to exercise one of your data protection rights, please do not hesitate to contact us. </p>
<p>Email us at: <a href="mailto:marcel.bergmann@capgemini.com">marcel.bergmann@capgemini.com</a></p>

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
Privacy.propTypes = {
  classes: PropTypes.element.isRequired,
};

export default withStyles(landingPageStyle)(Privacy);
