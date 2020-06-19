/* eslint-disable */
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// react components for routing our app without refresh
import { Link,Redirect  } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
//import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
//import ShoppingCart from "@material-ui/icons/ShoppingCart";
import ViewDay from "@material-ui/icons/ViewDay";
import Dns from "@material-ui/icons/Dns";
//import Build from "@material-ui/icons/Build";
//import ListIcon from "@material-ui/icons/List";
//import People from "@material-ui/icons/People";
//import Assignment from "@material-ui/icons/Assignment";
//import MonetizationOn from "@material-ui/icons/MonetizationOn";
//import Chat from "@material-ui/icons/Chat";
//import Call from "@material-ui/icons/Call";
//import ViewCarousel from "@material-ui/icons/ViewCarousel";
//import AccountBalance from "@material-ui/icons/AccountBalance";
//import ArtTrack from "@material-ui/icons/ArtTrack";
//import ViewQuilt from "@material-ui/icons/ViewQuilt";
//import LocationOn from "@material-ui/icons/LocationOn";
import Fingerprint from "@material-ui/icons/Fingerprint";
//import AttachMoney from "@material-ui/icons/AttachMoney";
//import Store from "@material-ui/icons/Store";
//import AccountCircle from "@material-ui/icons/AccountCircle";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Layers from "@material-ui/icons/Layers";
//import ShoppingBasket from "@material-ui/icons/ShoppingBasket";
import LineStyle from "@material-ui/icons/LineStyle";
//import Error from "@material-ui/icons/Error";
import axios from 'axios';
// core components
import CustomDropdown from "components/CustomDropdown/CustomKitDropdown.js";
//import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-pro-react/components/headerLinksStyle.js";

import { observer, inject} from 'mobx-react'; // 6.x

//@material-ui/icons

import ShoppingCart from "@material-ui/icons/ShoppingCart";

import DirectionsBoat from  "@material-ui/icons/DirectionsBoat";
import Build from "@material-ui/icons/Build";
import ListIcon from "@material-ui/icons/List";
import People from "@material-ui/icons/People";
import Assignment from "@material-ui/icons/Assignment";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import Chat from "@material-ui/icons/Chat";
import Call from "@material-ui/icons/Call";
import ViewCarousel from "@material-ui/icons/ViewCarousel";
import AccountBalance from "@material-ui/icons/AccountBalance";
import ArtTrack from "@material-ui/icons/ArtTrack";
import ViewQuilt from "@material-ui/icons/ViewQuilt";
import LocationOn from "@material-ui/icons/LocationOn";

import AttachMoney from "@material-ui/icons/AttachMoney";
import Store from "@material-ui/icons/Store";
import AccountCircle from "@material-ui/icons/AccountCircle";


import ShoppingBasket from "@material-ui/icons/ShoppingBasket";

import Error from "@material-ui/icons/Error";

const useStyles = makeStyles(styles);


// export default function HeaderLinks(props) {
const HeaderLinks = inject('userStore', 'trackStore')(observer(({ userStore, trackStore, ...props }) => {   
//console.log("header prop:",props);
	const { dropdownHoverColor ,isAuthenticated, userData} = props;

  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const smoothScroll = (e, target) => {
    if (window.location.pathname === "/sections") {
      var isMobile = navigator.userAgent.match(
        /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
      );
      if (isMobile) {
        // if we are on mobile device the scroll into view will be managed by the browser
      } else {
        e.preventDefault();
        var targetScroll = document.getElementById(target);
        scrollGo(document.documentElement, targetScroll.offsetTop, 1250);
      }
    }
  };
  const scrollGo = (element, to, duration) => {
    var start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;

    var animateScroll = function() {
      currentTime += increment;
      var val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  };
  //var onClickSections = {};

  
  const classes = useStyles();
   
  const logout = () => {
    //console.log(">>>logout button click");
	    axios.get("/auth/logout",{headers:{'Authorization':'Bearer '+userStore.token}} )
	    .then(res => {
	        if (res.data.message){
	        	alert(res.data.message);
	        } else {
	        	localStorage.removeItem('plismplus');
                userStore.setUser('');
                userStore.setToken('');
	        	props.logOut();
	        }
	    })
	    .catch(err => {
	        console.log(err);
	        //window.location.href = "/Landing";
	    })

  }
  
  const clean = () => {
	  userStore.setUser('');
	  userStore.setToken('');
  }

  return (
    <List className={classes.list + " " + classes.mlAuto}>
    {isAuthenticated && userData.usertype=="A"?"ADMIN":isAuthenticated?userData.username:null} {isAuthenticated?" 님 환영합니다.":null}
    {isAuthenticated && userData.usertype=="A"?
	    <ListItem className={classes.listItem}>
		    <Link to="/admin" 
		   	 className={classes.dropdownLink}
		    	//onClick={props.onLoginOpen}
		    >
		         <AccountBalance className={classes.dropdownIcons} /> ADMIN MENU
		  </Link>
		  </ListItem>
		  :null}
      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          navDropdown
          hoverColor={dropdownHoverColor}
          buttonText="Location"
          buttonProps={{
            className: classes.navLink,
            color: "transparent"
          }}
          buttonIcon={LocationOn}
          dropdownList={[
            <Link to="/svc/tracking" className={classes.dropdownLink} refresh="true">
              <DirectionsBoat className={classes.dropdownIcons} /> Tracking
            </Link>,
            <Link to="/svc/demdet" className={classes.dropdownLink}>
              <Layers className={classes.dropdownIcons} /> Dem&Det
            </Link>
          ]}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          navDropdown
          hoverColor={dropdownHoverColor}
          buttonText="Schedule"
          buttonProps={{
            className: classes.navLink,
            color: "transparent"
          }}
          buttonIcon={ViewDay}
          dropdownList={[
            <Link
              to="/svc/fcl"
              className={classes.dropdownLink}
              onClick={e => smoothScroll(e, "headers")}
            >
              <ShoppingBasket className={classes.dropdownIcons} /> FCL-Sea
            </Link>,
            <Link
            to="/svc/cal"
            className={classes.dropdownLink}
            onClick={e => smoothScroll(e, "headers")}
          >
            <ShoppingBasket className={classes.dropdownIcons} /> TERMINAL
          </Link>
          ]}
        />
      </ListItem>
  

        
      {isAuthenticated==false?<div>
	  <ListItem className={classes.listItem}>
	     <Link to="#" 
	    	 className={classes.dropdownLink}
	     	onClick={props.onLoginOpen}>
              <Fingerprint className={classes.dropdownIcons} /> Login
       </Link>
	  </ListItem>
	  <ListItem className={classes.listItem}>
	   <Link to="/authpage/register" className={classes.dropdownLink}
	   onClick={clean}
	   >
         <PersonAdd className={classes.dropdownIcons} /> Signup
       </Link>
	  </ListItem></div>
	  :
	  <ListItem className={classes.listItem}>
	     <Link   to="#"   // component="button"
          //variant="body2"
          onClick={
            logout
          } className={classes.dropdownLink}>
           <AccountCircle className={classes.dropdownIcons} /> LogOut
           </Link>
	  </ListItem>
        }
    </List>
  );
}
))

export default HeaderLinks;

HeaderLinks.defaultProps = {
  hoverColor: "primary"
};

HeaderLinks.propTypes = {
  dropdownHoverColor: PropTypes.oneOf([
    "dark",
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose"
  ])
};

