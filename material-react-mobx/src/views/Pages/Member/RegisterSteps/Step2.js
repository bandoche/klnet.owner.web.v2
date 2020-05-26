import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import CustomInput from "components/CustomInput/CustomInput.js";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  choiche: {
    textAlign: "center",
    cursor: "pointer",
    marginTop: "20px"
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleSelect: "",
      desgin: false,
      code: false,
      develop: false,
      name:"",
      phone:"",
      phoneState:"",
      company:""
    };
  }
  sendState() {
    return this.state;
  }
  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  isValidated() {

	 if(this.state.name !=="" && this.state.phone !=="" && this.state.company !=="") {
		 if(this.state.phoneState !== "success") {
			 alert("휴대폰번호 형식이 잘못되었습니다.(-제외 숫자만 입력)");
			 return false;
		 } else {
			 return true;
		 }
	 } else {
		 if(this.state.name ==="") {
			 alert("name 은 필수 입력 값입니다."); 
		 } else if (this.state.phone ==="") {
			 alert("phone 은 필수 입력 값입니다.");
		 } else {
			 alert("company 은 필수 입력 값입니다.");
		 } 
		 return false;
	 }
    
  }
  
  verifyPhone(value) {
	  var phoneRex = /^01?([0-9]{9,11})$/;
	  return !phoneRex.test(value)?false:true;
  }
  
  change(event) {

	  if (this.verifyPhone(event.target.value)) {
	          this.setState({ phoneState: "success",phone: event.target.value});
	  } else {
	          this.setState({ phoneState: "error" ,phone: event.target.value});
	  }
	  
  }

  
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer justify="center">
              <GridItem xs={12}>
	              <CustomInput
	              labelText="Username"
	              id="name"
	              formControlProps={{
	                fullWidth: true,
	                //value:profileData[2],
	               onChange:(event => this.setState({name:event.target.value}))
	              }}
	            />
              </GridItem>
              <GridItem xs={12}>
              <CustomInput
	              labelText="Phone Number"
	              id="phone"
	              success={this.state.phoneState === "success"}
	              error={this.state.phoneState === "error"}
              	  helperText="'-' 제외 한 숫자로 입력해주세요."
	              formControlProps={{
	                  fullWidth: true
	                }}
	              inputProps={{
	                  onChange: event => this.change(event),
	              }}
            />
              </GridItem>
              <GridItem xs={12}>
              <CustomInput
              labelText="company"
              id="company"
              formControlProps={{
                fullWidth: true,
                //value:profileData[2],
                onChange:(event => this.setState({company:event.target.value}))
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Step2.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(Step2);