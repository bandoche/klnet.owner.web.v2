import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import CommentIcon from '@material-ui/icons/Comment';
import IconButton from '@material-ui/core/IconButton';

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  ...customSelectStyle
};

class Step3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signchecked1: false,
      signchecked2: false,
    };
  }
  sendState() {
    return this.state;
  }

  isValidated() {
	 if(this.state.signchecked1 && this.state.signchecked2){
		 return true;
	 } else {
		 alert("이용약관 을 확인해 주세요.");
		 return false;
	 }
  }
  
  handleChange (event,name) {
	  if(name ==="useYn") {
		  this.setState({signchecked1:!this.state.signchecked1});
	  } else {
		  this.setState({signchecked2:!this.state.signchecked2});
	  }
  }

  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} style={{paddingLeft:"0",paddingRight:"0"}}>
	        <List>
	         <ListItem dense button style={{padding:"0"}}>
	         	<ListItemIcon style={{minWidth:"0"}}>
	         		<Checkbox edge="start" checked={this.state.signchecked1} onChange={event => this.handleChange(event,"useYn")} disableRipple />
	         	</ListItemIcon>
	         	<ListItemText primary={"이용약관에 동의"}/>
	         	<ListItemSecondaryAction>
	         	<a href="/service" target="_blank" >
	         		<IconButton edge="end" style={{padding:"0"}}>
	         			<CommentIcon />
	         		</IconButton>
	         		  </a>
	         	</ListItemSecondaryAction>
	         	</ListItem>
	         	
	         	<ListItem dense button style={{padding:"0"}}>
	         	<ListItemIcon style={{minWidth:"0"}}>
	         		<Checkbox edge="start" checked={this.state.signchecked2} onChange={event => this.handleChange(event,"useUser")}  disableRipple />
	         	</ListItemIcon>
	         	<ListItemText primary={"개인정보 처리방침에 동의"} />
	         	<ListItemSecondaryAction>
	         	<a href="/policy" target="_blank" >
	         		<IconButton edge="end" style={{padding:"0"}}>
	         			<CommentIcon />
	         		</IconButton>
	         		</a>
	         	</ListItemSecondaryAction>
	         	</ListItem>
	         	
	         </List>
	     </GridItem>  
      </GridContainer>
    );
  }
}

Step3.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(Step3);
