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

class Imprint extends React.Component {
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
        console.log('profilepage user', user.username);
        this.setState({ user: user });
      })
      .catch((err) =>
        console.log('currentAuthenticatedUser profilepage err', err)
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
                <div
                  className="article-text"
                  style={{
                    textAlign: "center",
                    color: "black",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                  }}
                >
                  <h1
                    style={{
                      paddingTop: '40px',
                      textAlign: 'center',
                      fontSize: '40px',
                    }}
                  >
                    <strong>A big THANK YOU to our SPONSORS!</strong>
                  </h1>
                  <hr />
                  <div style={{ display: "inline-block", width: "50%", float: "left", marginTop: "10px"}}>
                    <a href="https://www.capgemini.com" target="_blank"><img
                      src="https://www.capgemini.com/de-de/wp-content/themes/capgemini-komposite/assets/images/logo.svg"
                      style={{
                        paddingBottom: "10px",
                        margin: "10px auto",
                      }}
                    /></a>
                    <div className="article-text" style={{textAlign: "justify", margin: "5px 25px 5px 15px"}}>
                    Capgemini is a global leader in consulting, digital transformation, technology, and engineering services. The Group is at the forefront of innovation to address the entire breadth of clients’ opportunities in the evolving world of cloud, digital and platforms. Capgemini founded the annual Global Data Science Challenge, a Group-wide internal competition where hundreds of employees from all over the world compete in small teams to solve a given AI-related task. Capgemini believes that digital transformation should benefit all of humanity and its projects like the Global Data Science Challenge will continue to focus on addressing issues relating to sustainability by unleashing human energy through technology for an inclusive and sustainable future.
                  </div></div>
                  <div style={{ display: "inline-block", width: "50%", marginTop: "10px" }}>
                    <a href="https://www.aws.com" target="_blank"><img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/314px-Amazon_Web_Services_Logo.svg.png"
                      style={{
                        width: "58px",
                        height: "auto",
                        paddingBottom: "15px",
                        margin: "10px auto",
                      }}
                    /></a>
                    <div className="article-text" style={{textAlign: "justify", margin: "5px 15px 5px 25px"}}>
                    Amazon Web Services (AWS) is the world’s most comprehensive and broadly adopted cloud platform, offering over 175 fully featured services from data centers globally. AWS were delighted to work with Capgemini and sponsor the Global Data Science Challenge, enabling us to use AWS Machine Learning technology to build solutions that directly address sustainability and the environment, showcasing how ML can benefit society in many ways.
                  </div></div>
                </div>
                <br />
                <br />
                <div className="article-text" style={{ paddingTop: "60px" }}>
                  <h1 style={{ paddingTop: "5px" }}>
                    <b>Collaborator</b>
                  </h1>
                  <h3 style={{ marginTop: "5px" }}><a href="https://www.facebook.com/WhaleWatchAzores" target="_blank">Lisa Steiner</a></h3>
                  <div>
                    <img
                      src={require('assets/img/Lisa-2018-MLI7527.jpg')}
                      style={{
                        width: '38%',
                        paddingBottom: '15px',
                        paddingTop: '5px',
                        marginRight: '15px',
                        float: 'left',
                      }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        fontSize: '16px',
                        lineHeight: '24px',
                        fontWeight: '300',
                      }}
                    >
                      In 1988, after graduating with a degree in Marine Science,
                      Lisa joined “Song of the Whale”, the International Fund
                      for Animal Welfare’s research boat in the Azores studying
                      sperm whales. When the boat moved on to other projects in
                      1992, she became co-founder of Whale Watch Azores to
                      continue that research and now is based permanently in the
                      Azores. Lisa’s main focus has always been in photo
                      identification, be it sperm whales or other species. She
                      has several publications based on photo-id work and
                      presented findings at International marine mammal
                      conferences. For several years, she developed B&W films,
                      printed the flukes and matched them on her living room
                      floor! In 2002, an semi-automated system was developed as
                      part of “Europhlukes” a EU funded project, to do the
                      matching and she has been using that program ever since.
                      But technology has come a long way since 1992 and when the
                      offer came to develop a new algorithm as part of
                      Capgemini’s annual competition, she accepted the offer and
                      the rest as they say is history!
                    </p>
                  </div>
                </div>
                <div className="article-text">
                  <h1 style={{ paddingTop: '20px' }}>
                    <b>Development Team</b>
                  </h1>
                  <ul style={{listStyleType:"none", color:"black"}}>
                  <li><a href="https://www.linkedin.com/in/daniel-k%C3%BChlwein-a0b6051/" target="_blank">Daniel Kühlwein</a> (Germany)</li>
                  <li><a href="https://www.linkedin.com/in/bergmannmarcel/" target="_blank">Marcel Bergmann</a> (Germany)</li>
                  <li><a href="https://www.linkedin.com/in/moritz-schaffenroth-bbaa84142/?originalSubdomain=de" target="_blank">Moritz Schaffenroth</a> (Germany)</li>
                  <li><a href="https://www.linkedin.com/in/kanwalmeet-singh/" target="_blank">Kanwalmeet Singh</a> (Germany)</li>
                  <li><a href="https://www.linkedin.com/in/hartvig-johannson-04a0b6193" target="_blank">Hartvig Johannson</a> (Normay)</li>
                  <li><a href="">Simen Norrheim Larsen</a> (Norway)</li>
                  <li><a href="">Robin Wulfes</a> (Germany)</li>
                  <li><a href="mailto:gdsc3_core.iandd@capgemini.com">Sophie (Nien-chun) Yin</a> (Germany)</li>
                  </ul>
                </div>
                {/* comment
                <div className="article-text">
                  <h1 style={{ paddingTop: "20px" }}>
                    <b>Imprint</b>
                  </h1>
                  <h2>This site is edited by: / Ce site web est édité par :</h2>
                  <p>
                    Capgemini Service SAS
                    <br />
                    Société par actions simplifiée au capital de 8, 000,000 euros – 652 025 792 RCS
                    Paris
                    <br />
                    Siège social : 11 rue de Tilsitt, 75017 Paris
                    <br />
                    Tel: +33 (0)1 47 54 50 00
                    <br />
                    Publication Director: / Directeur de la publication : M. Paul Hermelin
                  </p>
                  <h2>ISP: / Hébergeur :</h2>
                  <p>
                    <a href="https://automattic.com/" target="_blank" rel="noopener noreferrer">
                      Automattic Inc
                    </a>
                    <br />
                    60 29th Street #343
                    <br />
                    San Francisco, CA 94110
                    <br />
                    Tel: (877) 273-3049.
                  </p>

                  <h5 style={{ paddingTop: "5px" }}>
                    <a href="mailto:gdsc3_core.iandd@capgemini.com">Contact us</a>
                  </h5>
                </div>
                */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Imprint.propTypes = {
  classes: PropTypes.element.isRequired,
};

export default withStyles(landingPageStyle)(Imprint);
