import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";

class SecretContactPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
    };
  }

  render() {
    const { classes, ...rest } = this.props;

    return (
      <div>
        <Header
          color="blue"
          brand={
            <img src="https://visualidentity.capgemini.com/wp-content/themes/v/html/images/logo.png" />
          }
          fixed
          rightLinks={<HeaderLinks user={this.state.user} />}
          changeColorOnScroll={{
            height: "400",
            color: "black",
          }}
          {...rest}
        />

        <div className={classes.container}>
          <div class="section container" style={{ paddingTop: "150px", paddingBottom: "5px" }}>
            <div class="row">
              <div class="col-12">
                <div class="article-text">
                  <h2 style={{ paddingTop: "5px" }}>
                    <strong>
                      Contact picture owner <i>... (show username)</i>
                    </strong>
                  </h2>
                </div>
                <form id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.name}
                      onChange={this.onNameChange.bind(this)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Your email address</label>
                    <input
                      type="email"
                      className="form-control"
                      aria-describedby="emailHelp"
                      value={this.state.email}
                      onChange={this.onEmailChange.bind(this)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      value={this.state.message}
                      onChange={this.onMessageChange.bind(this)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onNameChange(event) {
    this.setState({ name: event.target.value });
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  onMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  handleSubmit(event) {}
}

export default withStyles(landingPageStyle)(SecretContactPage);
