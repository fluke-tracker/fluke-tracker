/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
import { List, ListItem, withStyles } from "@material-ui/core";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import footerStyle from "assets/jss/material-kit-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes, whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
                <footer className='footerClasses' style={{backgroundColor: "#0070AD", padding:"20px", fontFamily: "Verdana, Arial, sans-serif", fontSize: "9px", color: "white", bottom: "0%"}}>
          <div className='container'>
        <div className='row' style={{textAlign: "center"}}>
        <div style={{margin: "auto 250px auto 25px"}}>
        <p style={{fontSize: "9px"}}>All rights reserved by fluke-tracker. Copyright © 2020</p></div>
                <div style={{margin: "auto 0px auto 200px"}}>
        <a href={"/terms"} style={{color: "white"}}>Terms</a></div>
        <div style={{margin: "auto 0px auto 25px"}}>
        <a href={"/privacy-policy"} style={{color: "white"}}>Privacy Policy</a></div>
        </div></div>
        </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);
