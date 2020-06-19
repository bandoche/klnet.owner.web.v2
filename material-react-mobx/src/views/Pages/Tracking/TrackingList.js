import React,{ useState, useEffect } from "react";
import { Link } from 'react-router-dom';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
//import Drawer from '@material-ui/core/Drawer';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
//import BackupIcon from "@material-ui/icons/Backup";
//import StarIcon from "@material-ui/icons/Stars";
//import MapIcon from "@material-ui/icons/Map";
//import SpeakerNotes from "@material-ui/icons/SpeakerNotes";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
//import FormControl from "@material-ui/core/FormControl";
//import Icon from "@material-ui/core/Icon";
//import Popover from  '@material-ui/core/Popover';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
//import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import CalendarBox from "components/CustomInput/CustomCalendar.js";
//import CustomInput from "components/CustomInput/CustomInput.js";
//import CustomSelect from "components/CustomInput/CustomSelect.js";
//import CardIcon from "components/Card/CardIcon.js";

// import page
//import Login from "views/Pages/Login/LoginPage.js";
//import Blupload from "views/Pages/Tracking/BLPage/UploadPage.js";
//import HotSet from "views/Pages/Tracking/HotSet/HotSet.js";
//import Map from "views/Pages/Tracking/Map/Map.js";
import Table from "views/Pages/Tracking/TrackingDetail.js";
// @material-ui/core icon
//import Icon from "@material-ui/core/Icon";
import CardIcon from "components/Card/CardIcon.js";
import Assignment from "@material-ui/icons/Assignment";
// other import
import axios from 'axios';
//import moment from 'moment';
//import Dialog from '@material-ui/core/Dialog';
//import DialogContent from '@material-ui/core/DialogContent';
//import LoginPage from 'views/Pages/Login/LoginPage.js';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';

//import FixedPlugin from "views/Tracking/Setting/CustomFixedPlugin.js";
//import Modal from '@material-ui/core/Modal';
//import JoinPage from "components/Form/Common/JoinPage.js";

//import clsx from 'clsx';
//import IconButton from '@material-ui/core/IconButton';
//import CardActions from '@material-ui/core/CardActions';
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
//import TestForm from "components/Form/Common/Search.js";
import Grid from '@material-ui/core/Grid';
import Moment from 'moment'
//import { observer, inject} from 'mobx-react'; // 6.x

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
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
let numCnt =1;

export default function TrackingList(props) {

  const {store} =props;
  const setStartDate = new Date();
  const setEndDate = new Date();
  const [dategb,setDategb] = useState("D");
  
  const [ietype,setIetype] = useState("A");
  //const [labelName,setLabelName] = useState("BL & BK NO.");
  const [sPort,setSPort] = useState("");
  const [ePort,setEPort] = useState("");
  //const [vesselName,setVesselName] = useState("");
  const [searchKey,setSearchKey] = useState("");
	const [lineCode,setLineCode] = useState([]);
	const [carrierCode,setCarrierCode] = useState("");
  //const [selectData,setSelectData] = useState([]);
  const [portData,setPortData] = useState([]);
  const [trackingList,setTrackingList] = useState([]);
  const [fromDate,setFromDate] = useState(setStartDate.setDate(setStartDate.getDate()-3));
  const [toDate,setToDate] = useState(setEndDate.setDate(setEndDate.getDate()+3));
  const [anchorE1, setAnchorE1] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
  //const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  //const [optionData,setOptionData] = useState([]);
 
  //const [openTest,setOpenTest] = useState(false);

  let portCode = [];
  

  /* const handleFixedClick = () => {
	    if (fixedClasses === "dropdown") {
	    	 setFixedClasses("dropdown show");
			  axios.post("/com/getUserSetting").then(res => portCode(res.data[0]))
			  //.then(res => console.log(JSON.stringify(res.data[0])))
			  .catch(err => {
			        if(err.response.status == "403") {
						//setOpenJoin(true);
						
			        }
			    });

	    } else {
	      setFixedClasses("dropdown");
	      setOptionData([]);
	    }
};
  */

useEffect(() => {
	   // console.log('Tracking effect');
		//console.log('userStore',store);
    	//axios.get("/com/getPortCodeInfo")
	    //.then(res => setPortData(res.data));
    	
	   /* function handleTouchMove(event) {
	    	if(openJoin) {
	    		event.preventDefault();
	    	}
	    }*/
	    
	   /* window.addEventListener("touchmove",handleTouchMove, {
	    	passive: false
	    });*/

	    return () => {
	      console.log('cleanup');
	     // window.removeEventListener("touchmove",handleTouchMove);
	    };
}, []);
  
  
/*  const onPortSearchValue = (e) => {
	    const values = e.target.value;
	    if(values != "" && values.length > 2) {
	    	axios.get("/com/getPortCodeInfo")
		    .then(res => setPortData(res.data));
	    }  
  }*/

  
  const onPortSearchValue = (e) => {
	    const values = e.target.value;
	    if(values != undefined && values != "" && values.length >= 2) {
	    	if(store.token) {
		    	axios.post("/com/getTrackingPortCode",{ portCode:values},{headers:{'Authorization':'Bearer '+store.token}})
		    	.then(setPortData([]))
			    .then(res => setPortData(res.data))
			    .catch(err => {
			        if(err.response.status == "403"||err.response.status == "401") {
			        	props.openLogin();
					}
			    });
	    	} else {
	    		props.openLogin();
	    	}
	    }  
}
  
  const onLineSearchValue = (e) => {
	    const values = e.target.value;
	    if(values != undefined && values != "" && values.length >= 1) {
	    	if(store.token) {
		    	axios.post("/loc/getCustomLineCode",{},{headers:{'Authorization':'Bearer '+store.token}})
		    	.then(setLineCode([]))
			    .then(res => setLineCode(res.data))
			    .catch(err => {
			        if(err.response.status == "403"||err.response.status == "401") {
			        	props.openLogin();
					}
			    });
	    	} else {
	    		props.openLogin();
	    	}
	    }  
}

  
  const onSubmit = () => {

	  if(store.token) {
	  //search
	  numCnt=1;
	  axios.post("/loc/getTrackingList",{
		  ietype:ietype,
		  dategb:dategb,
		  from:Moment(fromDate).format('YYYYMMDD'),
		  to:Moment(toDate).format('YYYYMMDD'),
		  blbk:searchKey,
		  start:sPort,
		  end:ePort,
		  line:carrierCode,
		  num:numCnt},{headers:{'Authorization':'Bearer '+store.token}}
		  )
		.then(setTrackingList([]))
	    .then(res => setTrackingList(res.data))
	    .catch(err => {
	        if(err.response.status == "403"||err.response.status == "401") {
	        	props.openLogin();
			}
	    });
	  } else {
		  props.openLogin();
	  }
  }

   const handleAddRow = () => {

	  if(store.token) {
		  if(numCnt != trackingList[0].tot_page) {
			//page ++
		    numCnt=numCnt+1; 
		    axios.post("/loc/getTrackingList",{
			    	  ietype:ietype,
					  dategb:dategb,
					  from:Moment(fromDate).format('YYYYMMDD'),
					  to:Moment(toDate).format('YYYYMMDD'),
					  blbk:searchKey,
					  start:sPort,
					  end:ePort,
					  line:carrierCode,
					  num:numCnt},{headers:{'Authorization':'Bearer '+store.token}})
				  .then(res => setTrackingList([...trackingList,...res.data]))
		          .catch(err => {
		            if(err.response.status == "403" || err.response.status == "401") {
			        	//setOpenJoin(true);
			        	props.openLogin();
			        }
		            });
		  }
	  } else {
		  props.openLogin();
	  }     
  };
  
  const handleClose = () => {
	  setAnchorE1(null);
	  setAnchorE2(null);
	  setAnchorE3(null);
  }
    
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleIEGubun = (e) => {
	 // console.log("xx",e.target.value);
	  setIetype(e.target.value);	  
  }
  
  const handelLoginOpen = () => {
	  props.openLogin();
  }
  
  const handelSelectDate =(event) => {
	  if(event.target.value === "X") {
		  setDategb(event.target.value);
		  setFromDate(null);
		  setToDate(null);
	  } else {
		  setDategb(event.target.value);
	  }
  }
  
  return (
    <GridContainer>
    	<GridItem xs={12} sm={12}>
        	<Card style={{marginBottom:'0px'}}>
      			<CardHeader color="info" icon style={{height:'10px'}}>
					<CardIcon color="info" style={{padding:'0'}}>
						<Assignment />
					</CardIcon>
				{/*<h5 className={classes.cardTitleBlack}>Search To Tacking Info </h5>*/}				
	  		</CardHeader>
          	<CardBody style={{paddingBottom: '0px',paddingTop: '10px',paddingLeft: '15px',paddingRight: '15px'}}>
          		<Grid item xs={12} sm={12}>
		     	<Grid container spacing={1}>
	     		<Grid item xs={12} sm={9}>
	      			<Grid container spacing={1}>
	      			<Grid item xs={12} sm={12}>
	    			<Grid container spacing={1}>
	    				<Grid item xs={12} sm={2} md={2} >
	    					<FormControl fullWidth>
						        <InputLabel id = "ie_type" >IMPORT&EXPORT</InputLabel>
						        <Select
						          native
						          id = "IE_TYPE_SELECT"
						          value={ietype}
						          label="IMPORT&EXPORT"
						           onChange={handleIEGubun}
						        >
						        <option value="A">ALL</option>
						        <option value="I">IMPORT</option>
						        <option value="E">EXPORT</option>
						        </Select>
						   </FormControl>
	    				</Grid>
	    				<Grid item xs={12} sm={3} md={3}>
	    					<TextField id="blbk" label="B/L & B/K No." onChange={event => setSearchKey(event.target.value)} value={searchKey} //variant="outlined" size="small" 
	    						fullWidth />
	    				</Grid>
	    				<Grid item xs={12} sm={2} md={2} >
    					<FormControl fullWidth>
						        <InputLabel id = "ie_type" >Date</InputLabel>
						        <Select
						          native
						          id = "start_end"
						          value={dategb}
						          label="Date"
						           onChange={handelSelectDate}
						        >
						        <option value="D">ETD&ATD</option>
						        <option value="A">ETA&ATA</option>
						        <option value="X">No Period</option>
						        </Select>
						   </FormControl>
    				</Grid>
	    				<Grid item xs={12} sm={6} md={5}>
	    					<Grid container spacing={1}>
	    						<Grid item xs={12} sm={6}> 
	    							<CalendarBox
	    								labelText ="From"
	    								id="fromDate"
	    								variant="inline"
										format="yyyy-MM-dd"
										//inputVariant="outlined"
										//margin="dense"
	    								setValue={fromDate}
	    								autoOk={true}
	    								onChangeValue={date => setFromDate(date)}
	    								formControlProps={{fullWidth: true}} 
	    							/>
	    						</Grid>
	    						<Grid item xs={12} sm={6}>
	    							<CalendarBox
	    								labelText ="To"
	    								id="toDate"
	    								variant="inline"
										format="yyyy-MM-dd"
										//inputVariant="outlined"
										//margin="dense"
	    								setValue={toDate}
	    								autoOk={true}
	    								onChangeValue={date => setToDate(date)}
	    								formControlProps={{fullWidth: true}}
	    							/>
	    						</Grid>
	    					</Grid>
	    				</Grid>
	    				
	    			</Grid>
	    		</Grid>	
						<Collapse in={expanded} timeout="auto" unmountOnExit style={{width:'100%'}}>
							<Grid item xs={12} sm={12}>
								<Grid container spacing={1}>
									<Grid item xs={12} md={12} sm={12}>
										<Grid container spacing={1}>
											<Grid item xs={12} sm={4} style={{paddingLeft:'8px',paddingRight:'8px'}}>
												<Autocomplete
													options = {portData}
													getOptionLabel = { options => "["+options.port_code+"] "+options.port_name}
													id="start"
													onChange={(e,data)=>setSPort(!data?'':data.port_code)}
													noOptionsText="Please enter 2 characters ..."
													onInputChange={onPortSearchValue}
													renderInput={params => (
														<TextField {...params} label="출발지"  //variant="outlined" size="small" 
															fullWidth />
													)}
												/>
											</Grid>
											<Grid item xs={12} sm={4} style={{paddingLeft:'8px',paddingRight:'8px'}}>
												<Autocomplete
													options = {portData}
													getOptionLabel = { options => "["+options.port_code+"] "+options.port_name}
													id="end"
													noOptionsText="Please enter 2 characters ..."
													onChange={(e,data)=>setEPort(!data?'':data.port_code)}
													onInputChange={onPortSearchValue}
													renderInput={params => (
														<TextField {...params} label="도착지"  //variant="outlined" size="small" 
															fullWidth />
													)}
												/>
											</Grid> 
											<Grid item xs={12} sm={4} style={{paddingLeft:'8px',paddingRight:'8px'}}>	
												<Autocomplete
												options = {lineCode}
												getOptionLabel = { option => option.id +' '+option.nm }
												noOptionsText="Please enter 1 characters ..."
												id="carrierCode"
												onInputChange={onLineSearchValue}
												onChange={(e,data)=>setCarrierCode(!data?'':data.id)}
												renderInput={params => (
													<TextField inputProps={{maxLength:4}} {...params} label="선사" fullWidth />
												)}
											/>
											</Grid> 	
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Collapse>
						
		        		</Grid>
	        		</Grid> 
	        	<Grid item xs={12} sm={1} style={{paddingTop:'6px',paddingBottom:'10px',alignSelf:'flex-end'}}>
	        		<Tooltip title="B/L(B/K) Upload">
	        			<Button color="info" //onClick={() => setAnchorE1(true)}  
	        			component={Link} to="/svc/uploadbl"
	        			fullWidth style={{paddingTop:'11px'}}><Assignment />B/L(B/K)</Button>
	        		</Tooltip>
				</Grid>
				<Grid item xs={12} sm={2} md={2} style={{paddingTop:'6px',paddingBottom:'10px',alignSelf:'flex-end'}}>
					<Button color="info" onClick = {onSubmit}  fullWidth>Search</Button>							
				</Grid>
			</Grid>
		  </Grid> 
		  <Grid container spacing={1}>
		      	<Grid item xs={12} style={{textAlignLast:'center',height:'30px',paddingTop:'5px'}}>
		      		{expanded?<ExpandLess onClick = {handleExpandClick} style={{color:'#00acc1'}}/>:<ExpandMore onClick = {handleExpandClick} style={{color:'#00acc1'}}/>}
		      	</Grid>
		  </Grid>
          </CardBody>
        </Card>
	   </GridItem>
      <GridItem xs={12}>
		    <Card style={{marginTop:'5px',marginBottom:'5px'}}>
				<CardBody style={{padding:'0px'}}>
					<Table
						tableHeaderColor="info"
						tableRownum={numCnt}
						tableData={trackingList}
						onClickHandle ={handleAddRow}
						onLoginPage ={handelLoginOpen}
						store={store}
		            /> 
				</CardBody>
			</Card>
		</GridItem>
    </GridContainer>
  );
}
