import React,{useState,useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
//import Table from "components/Table/TablePaging.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// core components
//import icon
import Icon from "@material-ui/core/Icon";
import CardIcon from "components/Card/CardIcon.js";
//import page
import Detail from "views/Pages/Tracking/TrackingCurrentDetail.js";
import { observer, inject} from 'mobx-react'; // 6.x

import axios from 'axios';

const styles = {

  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardTitleBlack: {
	    textAlign: "left",
	    color: "#000000",
	    minHeight: "auto",
	    fontWeight: "300",
	    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
	    marginBottom: "3px",
	    textDecoration: "none",
	    "& small": {
	      color: "#777",
	      fontSize: "65%",
	      fontWeight: "400",
	      lineHeight: "1"
	    }
	  },
};

const useStyles = makeStyles(styles);

const CurrentList = inject('userStore', 'trackStore')(observer(({ userStore, trackStore, ...props }) => { 
  const classes = useStyles();

  const {carrierCode,blbk,blNo,bkNo} = props;

  const [selectData,setSelectData] = useState([]);

  useEffect(() => {
	  //console.log("blNo:"+blNo+"carrer:"+carrierCode);
	  if(userStore.token) {
	    axios.post("/loc/getCntrList",{ carriercode:carrierCode,blbk: blbk, },
	    		{headers:{'Authorization':'Bearer '+userStore.token}})
	    .then(setSelectData([]))
	    .then(res => setSelectData(res.data))
	    .catch(err => {
	       //console.log(err.response.status);
	        if(err.response.status == "403"||err.response.status == "401") {
	        	props.openLogin();
			}

	    });
	    
	    return () => {
	      console.log('cleanup');
	    };
	  } else {
		  props.openLogin();
	  }
}, []);

  
  
  return (
        <Card>
        	<CardHeader color="info" stats icon style={{paddingBottom:'2px'}}>
        		<CardIcon color="info">
        			<Icon>content_copy</Icon>
        		</CardIcon>
        		<h4 className={classes.cardTitleBlack}>Container List</h4>
        		<p className={classes.cardTitleBlack}>BKG NO :{bkNo}</p>
        		<p className={classes.cardTitleBlack}>BL NO :{blNo}</p>
        	</CardHeader>
        	<CardBody style={{paddingBottom:'2px'}}>   
	        	<Detail
	            tableHeaderColor="info"
	            tableHead={["no", "Container No", "TIME","EVENT","LOCATION"]}
	            tableData={selectData}
	          />	
          </CardBody>
        </Card>
  );
}
))

export default CurrentList;
