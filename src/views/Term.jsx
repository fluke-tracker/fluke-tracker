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
                    <b>Terms and Conditions</b>
                  </h1>
                  <div style={{
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif', color: 'black'
                      }}>
<h3>Welcome to FlukeTracker!</h3>
<p>These terms and conditions outline the rules and regulations for the use of FlukeTracker's website, located at https://fluke-tracker.com/.</p>
<p>By accessing this website we assume you accept these terms and conditions. Do not continue to use FlukeTracker if you do not agree to take all of the terms and conditions stated on this page. </p>
<p>The following terminology applies to these Terms and Conditions and Privacy Statement:"Client", "You" and "Your" refers to you, the person who logged on this website and compliant to our terms and conditions. "Ourselves", "We", "Our" and "Us", refers to the developers of FlukeTracker. "Party", "Parties", or "Us", refers to both the you and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of FlukeTracker’s stated services, in accordance with and subject to, prevailing law of Germany. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same. </p>
<h2>Cookies</h2>
<p>We employ the use of cookies. By accessing FlukeTracker, you agreed to use cookies in agreement with the FlukeTracker's Privacy Policy.</p>
<p>Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies. </p>
<h2>License</h2>
<p>Unless otherwise stated, FlukeTracker and/or its licensors own the intellectual property rights for all material on FlukeTracker. All intellectual property rights are reserved. You may access this from FlukeTracker for your own personal use subjected to restrictions set in these terms and conditions. </p>
<p>You must not: </p>
<ul>
<li>Republish material from FlukeTracker</li>
<li>Sell, rent or sub-license material from FlukeTracker</li>
<li>Reproduce, duplicate or copy material from FlukeTracker</li>
<li>Redistribute content from FlukeTracker</li>
</ul>
<p>FlukeTracker does NOT claim ANY ownership rights in the images and photos (collectively, "Content") that you upload on our website. By uploading any Content on our website, you hereby grant to us a non-exclusive, fully paid and royalty-free, worldwide, limited license to use, modify, delete from, add to, publicly perform, publicly display and reproduce such Content. </p>
<p>You represent and warrant that: (i) you own the Content uploaded by you on our website or otherwise have the right to grant the license set forth in this section, (ii) the upload to our website does not violate the privacy rights, publicity rights, copyrights, contract rights, intellectual property rights or any other rights of any person, and (iii) the posting of your Content on the Site does not result in a breach of contract between you and a third party. You agree to pay for all royalties, fees, and any other monies owing any person by reason of Content you upload on our website. </p>
<p>FlukeTracker contains Content of different Users. Except as provided within this Agreement, you may not copy, modify, translate, publish, broadcast, transmit, distribute, perform, display, or sell any Content appearing on our website without the explicit approval from the Content owner. </p>
<h2>iFrames</h2>
<p>Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our website. </p>
<h2>Reservation of Rights</h2>
<p>We reserve the right to request that you remove all links or any particular link to our website. You approve to immediately remove all links to our website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our website, you agree to be bound to and follow these linking terms and conditions. </p>
<h2>Removal of links from our website</h2>
<p>If you find any link on our website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly. </p>
<p>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date. </p>
<h2>Disclaimer</h2>
<p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will: </p>
<ul>
<li>Limit or exclude our or your liability for death or personal injury; </li>
<li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation; </li>
<li>Limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
<li>Exclude any of our or your liabilities that may not be excluded under applicable law. </li>
</ul>
<p>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty. </p>
<p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature. </p>

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
