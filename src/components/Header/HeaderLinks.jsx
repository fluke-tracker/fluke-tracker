/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../store/actions";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Button from "components/CustomButtons/Button.jsx";
import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";
import { Auth } from "aws-amplify";

const RegisterButton = (props) => (
  <ListItem className={props.classes.listItem}>
    <Link to={"/login"} className={props.classes.navLink} user={props.user}>
        Login/Register
    </Link>
  </ListItem>
);

// the logout component emits a logout signal to redux
const Logout = (props) => (
  <ListItem className={props.classes.listItem}>
    <Link to={"/login"} className={props.classes.navLink} onClick={() => Auth.signOut()}>
      Logout
    </Link>
  </ListItem>
);

function HeaderLinks({ ...props }) {
  const { classes } = props;
  console.log("header props are,", props);
  return (

    <List className={classes.list}>
      {
      <>
      <ListItem className={classes.listItem}>
        <Link to= {"/welcome-upload"} className={classes.navLink} user={props.user}>
            Welcome
          </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
          <Link to= {"/upload"} className={classes.navLink} user={props.user}>
            Upload
          </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
            <Link to= {"/match-whales"} className={classes.navLink} user={props.user}>
              Match Whales
            </Link>
            </ListItem>
            <ListItem className={classes.listItem}>
            <Link to= {"/browse-pictures"} className={classes.navLink} user={props.user}>
            Browse Pictures
          </Link>
          </ListItem>
          <ListItem className={classes.listItem}>
             <Link to = {"/about"} className={classes.navLink} user={props.user}>
             About
           </Link>
      </ListItem>
      </>
}
{
            props.user ? <Logout {...props}/> : <RegisterButton {...props}/>
}

    </List>
  );
}

const HeaderLinksContainer = connect((state) => ({ state }))(HeaderLinks);

export default withStyles(headerLinksStyle)(HeaderLinksContainer);
