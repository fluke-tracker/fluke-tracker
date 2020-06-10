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
import { Auth } from 'aws-amplify';

const RegisterButton = props => (
    <ListItem className={props.classes.listItem}>
        <Link to={"/login-page"}>
            <Button 
            href=""
            color="transparent"
            target="_blank"
            style={{color: 'white'}}
            className={props.classes.navLink}>Register</Button>
        </Link>
    </ListItem>
)

// the logout component emits a logout signal to redux
const Logout = props => (
    <ListItem className={props.classes.listItem}>
       <Link to={"/login-page"}>
        <Button 
        href=""
        color="transparent"
        target="_blank"
        style={{color: 'white'}}
        onClick={() => Auth.signOut()}
        className={props.classes.navLink}>Logout</Button>
        </Link>
    </ListItem>
)


function HeaderLinks({ ...props }) {
  const { classes } = props;
  console.log('header props are,', props);
  return (
    <List className={classes.list}>
      { props.user ?
      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          buttonText="Pages"
          buttonProps={{
            className: classes.navLink,
            color: "transparent"
          }}
          buttonIcon={Apps}
          dropdownList={[
            <Link to= {"/landing-page"} className={classes.dropdownLink} user={props.user}>
              Matching Page
            </Link>,
            <Link to= {"/upload-page"} className={classes.dropdownLink} user={props.user}>
            Upload Page
          </Link>,
          <Link to= {"/profile-page"} className={classes.dropdownLink} user={props.user}>
            Profile Page
          </Link>,
             <Link to = {"/search-page"} className={classes.dropdownLink} user={props.user}>
             Search Page
           </Link>
          ]}
        />
      </ListItem>
: <ListItem>
  </ListItem>}
      
{/*         <ListItem className={classes.listItem}>
            <Link to={props.user ? "/profile-page" : "/login-page"}>
                <Button 
                href=""
                color="transparent"
                target="_blank"
                style={{color: 'white'}}
                className={classes.navLink}>{props.user ? `${props.user.name} ${props.user.surname}` : `Login`}</Button>
            </Link>
        </ListItem>      */}         
        {
            props.user ? <Logout {...props}/> : <div></div>
        }
        
    </List>
  );
}

const HeaderLinksContainer = connect(state => ({ state }))(HeaderLinks);

export default withStyles(headerLinksStyle)(HeaderLinksContainer);
