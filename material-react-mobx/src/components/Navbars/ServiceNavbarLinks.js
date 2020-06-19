import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import { Manager, Target, Popper } from "react-popper";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
//import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import Popper from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";

// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
//import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";

// core components
//import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import axios from 'axios';
import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";
//import Cookies from "js-cookie";
import { observer, inject} from 'mobx-react'; // 6.x

const useStyles = makeStyles(styles);


//export default function HeaderLinks(props) {
	
const HeaderLinks = inject('userStore', 'trackStore')(observer(({ userStore, trackStore, ...props }) => {  

  const [openNotification, setOpenNotification] = React.useState(null);
  
  const { rtlActive , isAuthenticated } = props;
  
  const [msgCnt,setMsgCnt] = React.useState();
  const [msg,setMsg] = React.useState([]);

  React.useEffect(() => {
	  
	  if(userStore.token) {
		  axios.post("/com/getUserNotice",{},{headers:{'Authorization':'Bearer '+userStore.token}})
		    .then(res => setMsgCnt(res.data[0].noti_cnt))
		    .catch(err => {
		       console.log("HeaderLinks err",err);
		    });  
	  }
	  
	  return () => {
	      console.log('cleanup');
	    }; 
	  
  }, []);
  
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const [openProfile, setOpenProfile] = React.useState(null);

  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const classes = useStyles();

/*  const searchButton =
    classes.top +
    " " +
    classes.searchButton +
    " " +
    classNames({
      [classes.searchRTL]: rtlActive
    });*/
  const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover, {
    [classes.dropdownItemRTL]: rtlActive
  });
  const wrapper = classNames({
    [classes.wrapperRTL]: rtlActive
  });
  const managerClasses = classNames({
    [classes.managerClasses]: true
  });

 /* const handleLogout = () => {

	    axios.get("/auth/logout")
	    .then(res => {
	        if (res.data.message) {
            alert(res.data.message);
          } else {
            setOpenProfile(null);
            localStorage.removeItem('plismplus');
            alert("로그아웃 되었습니다.");
            props.history.push('/landing');
          }
	    })
	    .catch(err => {
	        console.log(err);
	    })
  }*/
  
  const handleLogout = () => {
	    //console.log(">>>logout button click");
		    axios.get("/auth/logout",{headers:{'Authorization':'Bearer '+userStore.token}} )
		    .then(res => {
		        if (res.data.message){
		        	alert(res.data.message);
		        } else {
		        	localStorage.removeItem('plismplus');
	                userStore.setUser('');
	                userStore.setToken('');
		        	props.history.push('/landing');
		        }
		        	//window.location.href = "/login"; //alert(res.data.userid + " �α��� ����");
		    })
		    .catch(err => {
		        console.log(err);
		        //window.location.href = "/Landing";
		    })

	  }
  const handleSelectMsg = (event) => {
	  if(userStore.token) {
		  axios.post("/com/getUserMessage",{},{headers:{'Authorization':'Bearer '+userStore.token}}
			  )//.then(res=>console.log(res.data))
			.then(setMsg([]))
		    .then(res => {setMsg(res.data);setMsgCnt(0);})
		    .catch(err => {
		       console.log("HeaderLinks err",err);
		    });  
	  }
	    if (openNotification && openNotification.contains(event.target)) {
	        setOpenNotification(null);
	      } else {
	        setOpenNotification(event.currentTarget);
	      }
  }
  
  const handleMoreMessage = () => {
	  alert('서비스준비중입니다.');
  }
  
  
  return (
    <div className={wrapper}>
	{/*   <CustomInput
        rtlActive={rtlActive}
        formControlProps={{
          className: classes.top + " " + classes.search
        }}
        inputProps={{
          placeholder: rtlActive ? "بحث" : "Search",
          inputProps: {
            "aria-label": rtlActive ? "بحث" : "Search",
            className: classes.searchInput
          }
        }}
      />
      <Button
        color="white"
        aria-label="edit"
        justIcon
        round
        className={searchButton}
      >
        <Search className={classes.headerLinksSvg + " " + classes.searchIcon} />
      </Button>
      <Button
        color="transparent"
        simple
        aria-label="Dashboard"
        justIcon
        className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
        muiClasses={{
          label: rtlActive ? classes.labelRTL : ""
        }}
      >
        <Dashboard
          className={
            classes.headerLinksSvg +
            " " +
            (rtlActive ? classes.links + " " + classes.linksRTL : classes.links)
          }
        />
        <Hidden mdUp implementation="css">
          <span className={classes.linkText}>
            {rtlActive ? "لوحة القيادة" : "Dashboard"}
          </span>
        </Hidden>
      </Button>*/}
      <div className={managerClasses}>
      	{isAuthenticated && userStore.user.usertype=="A"?"ADMIN":isAuthenticated?userStore.user.username:null} {isAuthenticated?" 님 환영합니다.":null}
        {isAuthenticated?
        <Button
          color="transparent"
          justIcon
          aria-label="Notifications"
          aria-owns={openNotification ? "notification-menu-list" : null}
          aria-haspopup="true"
          onClick={handleSelectMsg}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : ""
          }}
        >
          <Notifications
            className={
              classes.headerLinksSvg +
              " " +
              (rtlActive
                ? classes.links + " " + classes.linksRTL
                : classes.links)
            }
          />
          {msgCnt>0?<span className={classes.notifications}>{msgCnt}</span>:null}
          <Hidden mdUp implementation="css">
            <span
              onClick={handleClickNotification}
              className={classes.linkText}
            >
              {rtlActive ? "إعلام" : "Notification"}
            </span>
          </Hidden>
        </Button>
        :null}
        <Popper
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openNotification,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true
          })}
        >
          <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={handleCloseNotification}>
                <MenuList role="menu">
			          {msg.map((data,key) => {
			        	  return (
			                      <MenuItem
			                        key={key}
			                        onClick={handleCloseNotification}
			                        className={dropdownItem}
			                      >
			                        {data.message}
			                      </MenuItem>  
			        	  );
			          })}
			          <MenuItem
                      onClick={handleMoreMessage}
                      className={dropdownItem}
                    >
                      ...더보기
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
        </Popper>
      </div>

      <div className={managerClasses}>
        {isAuthenticated?
        <Button
          color="transparent"
          aria-label="Person"
          justIcon
          aria-owns={openProfile ? "profile-menu-list" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : ""
          }}
        >
          <Person
            className={
              classes.headerLinksSvg +
              " " +
              (rtlActive
                ? classes.links + " " + classes.linksRTL
                : classes.links)
            }
          />
          <Hidden mdUp implementation="css">
            <span onClick={handleClickProfile} className={classes.linkText}>
              {rtlActive ? "الملف الشخصي" : "Profile"}
            </span>
          </Hidden>
        </Button>
        :
        <Button
          color="transparent"
          justIcon
          aria-label="Notifications"
          aria-owns={openNotification ? "notification-menu-list" : null}
          aria-haspopup="true"
          onClick={props.onLoginPageOpen}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : ""
          }}
        >
          <Person
            className={
              classes.headerLinksSvg +
              " " +
              (rtlActive
                ? classes.links + " " + classes.linksRTL
                : classes.links)
            }
          />
        </Button>
        }
        <Popper
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openProfile,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true
          })}
        >
          {({ TransitionProps }) => (

              <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                	{isAuthenticated && userStore.user.usertype=="A"?
                	 <MenuItem
                        component={Link}
                        to="/admin"
                        onClick={handleCloseProfile}
                        className={dropdownItem}
                       >{rtlActive ? "관리자전환" : "Admin Change"}
                          </MenuItem>:null}
                	
	                    <MenuItem
	                      component={Link}
	                      to="/svc/profile"
	                      onClick={handleCloseProfile}
	                      className={dropdownItem}
	                    >{rtlActive ? "사용자정보" : "Profile"}
	                    </MenuItem>
	                    
	                    <MenuItem
	                      component={Link}
	                      to="/svc/setting"
	                      onClick={handleCloseProfile}
	                      className={dropdownItem}
	                    >
	                    {rtlActive ? "설정" : "Settings"}
	                    </MenuItem>

	                    <MenuItem
	                      onClick={handleLogout}
	                      className={dropdownItem}
	                    >
	                      {rtlActive ? "로그아웃" : "Log out"}
	                    </MenuItem>
	                    <Divider light />
                  </MenuList>
                </ClickAwayListener>
              </Paper>
          )}
        </Popper>
      </div>
    </div>
  );
}

))

export default HeaderLinks;

HeaderLinks.propTypes = {
  rtlActive: PropTypes.bool
};
