import React,{ useState, useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Alert,AlertTitle } from '@material-ui/lab';

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import CalendarBox from "components/CustomInput/CustomCalendar.js";
import CustomInput from "components/CustomInput/CustomInput.js";
// other import
import axios from 'axios';
import moment from 'moment';
import ScheduleToggleTable from "views/Pages/Schedule/ScheduleDetailTable.js";

import CustomTabs from "components/CustomTabs/CustomTabs2.js";

import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
//import "views/Pages/Schedule/react-big-calendar.css";

import Popover from "@material-ui/core/Popover";
import Typography from '@material-ui/core/Typography';

import SchDetailPop from "views/Pages/Schedule/SchDetailPop.js";

import Icon from "@material-ui/core/Icon";
import CardIcon from "components/Card/CardIcon.js";

//import { events as calendarEvents } from "variables/general.js";
//import SweetAlert from "react-bootstrap-sweetalert";

//import styles2 from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";

const localizer = momentLocalizer(moment);

//const useStyles2 = makeStyles(styles2);

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

export default function ScheduleList() {

  const setDate = new Date();
  const setEndDate = new Date();
  const [carrierCode,setCarrierCode] = useState("");
  const [sPort,setSPort] = useState("");
  const [ePort,setEPort] = useState("");
  const [vesselName,setVesselName] = useState("");
  const [selectData,setSelectData] = useState([]);
  const [portData,setPortData] = useState([]);
  const [scheduleData,setScheduleData] = useState([]);
  const [sDate,setSDate] = useState(new Date());
  const [eDate,setEDate] = useState(setEndDate.setDate(setEndDate.getDate()+6));

  const [anchorEl, setAnchorEl] = useState(null);

  const [detailParam, setDetailParam] = useState(null);


  //const [cDate,setCDate] = useState(new Date());

  const [tapNum,setTapNum] = useState(0);

  const handleTapsClick = (e) => {
	setTapNum(e);
  }


  
  useEffect(() => {
	    console.log('effect');
	    axios.post("/sch/getCarrierInfo").then(res => setSelectData(res.data));
	    //.then(res => console.log(JSON.stringify(res.data)));
	    
	    return () => {
	      console.log('cleanup');
	    };
	  }, []);
  
  const onCarrierChange = (e,data) => {
	  //console.log(data.LINE_CODE);
	  if(data) {setCarrierCode(data.LINE_CODE);} else {setCarrierCode("");}
	  
  }
  
  const onPortSearchValue = (e) => {
	    const values = e.target.value;
	    if(values != undefined && values != "" && values.length >= 2) {
	    	axios.post("/sch/getPortCodeInfo",{ portCode:values})
		    .then(res => setPortData(res.data));
	    }  
  }

  
  const onSPortChange = (e,data) => {
	  if(data) {
		  setSPort(data.PORT_CODE);
	  } else {
		  setSPort("");
	  }
  }

  const onEPortChange = (e,data) => {
	  if(data) {
		  setEPort(data.PORT_CODE);
	  } else {
		  setEPort("");
	  }
  }
  
  const onSubmit = (e,sPDate,ePDate) => {
	  let sQDate = "";
	  let eQDate = "";
	  
	  if (sPDate != undefined) {
		sQDate = sPDate;
	  } else {
		sQDate = sDate;
	  }
	 
	  if (ePDate != undefined) {
		eQDate = ePDate;
	  } else {
		eQDate = eDate;
	  }

	setScheduleData([]);
	  //search
	  axios.post("/sch/getScheduleList",{ carrierCode:carrierCode,
		  								  startDate:moment(sQDate).format('YYYYMMDD'),
		  								  endDate:moment(eQDate).format('YYYYMMDD'),
		  								  startPort:sPort,
		  								  endPort:ePort,
		  								  vesselName:vesselName
	  									})
		.then(res => setScheduleData(res.data));

		//if(sDate.toString() != "Invalid Date") {
		//	setCDate(sDate);
		//}
  }
  
  const classes = useStyles();

  //const classes2 = useStyles2();
  //const [events, setEvents] = React.useState(calendarEvents);
  //const [alert, setAlert] = React.useState(null);
  const selectedEvent = (event,e) => {
	//window.alert(event.title);
	//debugger;
	setDetailParam(event);
	setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

/*   const handleClick = (event) => {
	  debugger;
    setAnchorEl("testpop");
  }; */
  
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const navigatedEvent = date => {
 	  //debugger;
	  const nDate = new Date(date);
	  const pDate = nDate.setDate(1);
	setSDate(pDate);
	nDate.setMonth( nDate.getMonth() + 1); 
	setEDate(nDate.setDate(0));
	console.log(moment(sDate).format('YYYYMMDD') + moment(eDate).format('YYYYMMDD'));
	onSubmit(null,pDate,nDate);
  };

  /*
  const addNewEventAlert = slotInfo => {
    setAlert(
      <SweetAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Input something"
        onConfirm={e => addNewEvent(e, slotInfo)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
      />
    );
  };
  const addNewEvent = (e, slotInfo) => {
    var newEvents = events;
    newEvents.push({
      title: e,
      start: slotInfo.start,
      end: slotInfo.end
    });
    setAlert(null);
    setEvents(newEvents);
  };
  const hideAlert = () => {
    setAlert(null);
  };

  const eventColors = event => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor
    };
  };
  */
  

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
{/*         <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>FCL Schedule</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader> */}
        	<Card style={{marginBottom:'0px'}}>
      			<CardHeader color="info" stats icon style={{paddingBottom:'2px'}}>
					<CardIcon color="info" style={{height:'26px'}}>
						<Icon style={{width:'26px',fontSize:'20px',lineHeight:'26px'}}>content_copy</Icon>
				</CardIcon>
				<h4 className={classes.cardTitleBlack}>FCL Sea Schedule</h4>
	  		</CardHeader>
          <CardBody style={{paddingBottom: '0px',paddingTop: '10px',paddingLeft: '15px',paddingRight: '15px'}}>
          	<Card>
          		<CardHeader >
		          <GridItem xs={12}>
			      	<GridContainer>
			      		<GridItem xs={12} sm={9} md={10}>
			      			<GridContainer spacing={1}>
			      				<GridItem xs={12} sm={4}>
					        	  	<CalendarBox
					        			labelText ="출항일자"
					      				id="portDate"
					      				format="yyyy-MM-dd"
					      				setValue={sDate}
					        			onChangeValue={date => setSDate(date)}
					        			formControlProps={{fullWidth: true}}
					        	  	/>
					        	</GridItem>
					        	<GridItem xs={12} sm={4}>
					        		<Autocomplete
					        			options = {portData}
					        			getOptionLabel = { options => "["+options.PORT_CODE+"] "+options.PORT_NAME}
					        			id="start"
					        			onChange={onSPortChange}
					        			onInputChange={onPortSearchValue}
					        			renderInput={params => (
					        					<TextField {...params} label="출발지"  fullWidth />
					        			)}
					        		/>
					        	</GridItem>
					        	<GridItem xs={12} sm={4}>
{/* 					        		<CustomInput
					        			labelText="Vessel Name"
					        			id="vesselName"
					        			inputProps={{onChange:event => setVesselName(event.target.value)}}
					        			formControlProps={{fullWidth: true}}
					        		/> */}
									<TextField id="vesselName" label="Vessel Name" onChange={event => setVesselName(event.target.value)} value={vesselName} fullWidth />
					        	</GridItem>
					        	<GridItem xs={12} sm={4}>
					        		<CalendarBox
					        			labelText ="입항일자"
					        			id="portDate"
					        			format="yyyy-MM-dd"
					        			setValue={eDate}
					        		    onChangeValue={
											date => setEDate(date)
										}
					        			formControlProps={{fullWidth: true}}
					        		/>
					        	</GridItem>
					        	<GridItem xs={12} sm={4}>
					        		<Autocomplete
					        			options = {portData}
					        			getOptionLabel = { options => "["+options.PORT_CODE+"] "+options.PORT_NAME}
					        			id="end"
					        			onChange={onEPortChange}
					        			onInputChange={onPortSearchValue}
					        			renderInput={params => (
					        				<TextField {...params} label="도착지"  fullWidth />
					        			)}
					        		/>
					        	</GridItem>
					        	<GridItem xs={12} sm={4}>
					        		<Autocomplete
					        			options = {selectData}
					        			getOptionLabel = { option => option.LINE_NAME }
					        			id="carrierCode"
					        			onChange={onCarrierChange}
					        			renderInput={params => (
					        				<TextField {...params} label="선사" fullWidth />
					        			)}
					        		/>
					        	</GridItem>
				        	 </GridContainer>
			        	 </GridItem>
			        	<GridItem xs={12} sm={2} md={2}>
			        		<Button color="info" onClick = {onSubmit}fullWidth>Search</Button>
			        	</GridItem>
		        	</GridContainer>
		          </GridItem>    	
          		</CardHeader>
          		<CardBody style={{paddingBottom: '0px',paddingTop: '10px',paddingLeft: '15px',paddingRight: '15px'}}>
					  <CustomTabs headerColor="info"
					  handleTapsClick={handleTapsClick}
					  tabs={[
						  {
							tabName: "List"
							,tabContent: (
          			<GridContainer>
          				<GridItem xs={12}>
          					<ScheduleToggleTable
		                        tableHeaderColor="info"
		                        tableHead={["Carrier", "Vessel Name", "Voyage No", "Start Port", "End Port"]}
								tableData={scheduleData}
		                     /> 
		                </GridItem>
					</GridContainer>
							)
							},{
								tabName: "Calendar"
								//,tabIcon: Face
								,tabContent: (
									<GridContainer justify="center">
									<GridItem xs={12}>
									  <Card>
										<CardBody calendar>
										  <BigCalendar
											selectable
											localizer={localizer}
											//events={events}
											events={scheduleData
/* 												[{
													title: "CMA CGM VOLGA\n0BX56E1MA",
													allDay: false,
													start: new Date(2020, 3, 10, 10, 0),
													end: new Date(2020, 3, 10, 11, 0)
												},
												{
													title: "SM JAKARTA\n1917W",
													allDay: false,
													start: new Date(2020, 3, 14),
													end: new Date(2020, 3, 14)
												},
												{
													title: "TEST\n12345",
													allDay: false,
													start: new Date(2020, 3, 14),
													end: new Date(2020, 3, 14)
												}
												] */
											}
											defaultView="month"
											popup
											views={['month','agenda']}
											scrollToTime={new Date(1970, 1, 1, 6)}
											//defaultDate={new Date()}
											defaultDate={new Date(sDate)}
											onSelectEvent={(event,e) => selectedEvent(event,e)}
											//onSelectSlot={slotInfo => addNewEventAlert(slotInfo)}
											//eventPropGetter={eventColors}
											onNavigate={date => navigatedEvent(date)}
											//elementProps={{ onClick: e => selectedEvent(e.currentTarget,e.event)}}
											//style={{height: "1000px"}}
										  />
										<Popover
											id={id}
											open={open}
											anchorEl={anchorEl}
											onClose={handleClose}
											anchorReference="anchorPosition"
											anchorPosition={{top:80,left:550}}
											anchorOrigin={{vertical:'bottom',horizontal:'center',}}
											transformOrigin={{vertical:'top',horizontal:'center',}}
										>
											<SchDetailPop
												detailParam = {detailParam}
											/>
										</Popover>
										</CardBody>
									  </Card>								  
									</GridItem>

								  </GridContainer>
								)
					 }]}>    
					</CustomTabs>
				  </CardBody>
          	</Card>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
