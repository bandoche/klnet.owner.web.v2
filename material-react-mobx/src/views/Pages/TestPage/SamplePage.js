import React,{ useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";


import TextField from '@material-ui/core/TextField';

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
//import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";

//import CardIcon from "components/Card/CardIcon.js";
// other import
import axios from 'axios';
//import moment from 'moment';

import Icon from "@material-ui/core/Icon";
import CardIcon from "components/Card/CardIcon.js";

import Grid from '@material-ui/core/Grid';
import CustomTabs from "components/CustomTabs/CustomTabs2.js";
import ImpTable from "components/Table/TablePaging.js";
import ExpTable from "components/Table/TablePaging.js";

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


export default function ScheduleList(props) {

  const {store} = props;
  console.log(">>>>admin:",store);
  //const [carrierCode,setCarrierCode] = useState("");
  const [cntrNo,setCntrNo] = useState("");
  const [tapNum,setTapNum] = useState(0);
  const [importData,setImportData] = useState([]);
  const [exportData,setExportData] = useState([]);
  //const [openJoin,setOpenJoin] = useState(false);
  
  
  const handleTapsClick = (e) => {
	  setTapNum(e);
	  if(cntrNo) {
		  onSubmit(); 
	  }
  }
  
  const onSubmit = () => {
	  
		  if(tapNum===0) {

			  axios.post("/com/getImpFlowSample",{cntrNo:cntrNo},{headers:{'Authorization':'Bearer '+store.token}})
				.then(setImportData([]))
			    .then(res => setImportData(res.data))
			    .catch(err => {
			        if(err.response.status == "403") {
			        	//setOpenJoin(true);
			        }
			    });

		  } else {	
		      axios.post("/com/getExpFlowSample",{cntrNo:cntrNo},{headers:{'Authorization':'Bearer '+store.token}})
					.then(setExportData([]))
					.then(res => setExportData(res.data))
					.catch(err => {
						if(err.response.status == "403") {
					       	//setOpenJoin(true);
					    }
					});

		  }
  }
  const classes = useStyles();
  
  return (
    <GridContainer>
    	<GridItem xs={12} sm={12} md={12}>
        	<Card style={{marginBottom:'0px'}}>
      			<CardHeader color="info" stats icon style={{paddingBottom:'2px'}}>
					<CardIcon color="info" style={{height:'26px'}}>
						<Icon style={{width:'26px',fontSize:'20px',lineHeight:'26px'}}>content_copy</Icon>
				</CardIcon>
				<h4 className={classes.cardTitleBlack}>Search To Tacking Info </h4>
	  		</CardHeader>
          	<CardBody style={{paddingBottom: '0px',paddingTop: '10px',paddingLeft: '15px',paddingRight: '15px'}}>
          		<Grid item xs={12}>
			     	<Grid container spacing={1}>
			     		<Grid item xs={12} sm={9} md={4}>
			     			<TextField id="cntrNo" label="Container No." onChange={event => setCntrNo(event.target.value)} value={cntrNo} fullWidth />
			     		</Grid>	
			     		<Grid item xs={12} sm={9} md={6}></Grid>
						<Grid item xs={12} sm={12} md={2} >
							<Button color="info" onClick = {onSubmit}  
							fullWidth>Search</Button>							
						</Grid>
		      		</Grid>
		      	</Grid>
		     </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12}>
	      <CustomTabs headerColor="info"
	    	  handleTapsClick={handleTapsClick}
	          tabs={[
	          {
	              tabName: "Import"
	              //,tabIcon: Face
	              ,tabContent: (
	                  <ImpTable
	                      tableHeaderColor="info"
	                      tableHead={[  "SEQ","CNTR_NO","UNLOAD_DATE_TIME","UNLOAD_VESSEL_CODE","UNLOAD_TERMINAL_REF_NO","UNLOAD_TERMINAL","UNLOAD_CARRIER_CODE","UNLOAD_SEAL_NO","UNLOAD_BL_NO","UNLOAD_BOOKING_NO","UNLOAD_FULL_EMPTY","UNLOAD_VESSEL_NAME","UNLOAD_CARRIER_REF_NO","UNLOAD_POL","UNLOAD_POD","OUT_DATE_TIME","OUT_TERMINAL","OUT_FULL_EMPTY","OUT_BL_NO","OUT_CARRIER_CODE","OUT_SEAL_NO","OUT_CAR_NO","IN_DATE_TIME","IN_TERMINAL","IN_FULL_EMPTY","IN_BL_NO","IN_CARRIER_CODE","IN_SEAL_NO","IN_CAR_NO","MFCS_MRN","MFCS_ARV_DATE","MFCS_LINE_CODE","MFCS_BL_NO","MFCS_SEAL_NO","MFCS_POD","MFCS_POL","DISCHARGE_TERMINAL","UNLOAD_COARRI_THIS_IPM","OUT_CODECO_THIS_IPM","OUT_CODECO_KEY_ID","IN_CODECO_THIS_IPM","IN_CODECO_KEY_ID","REG_DATE","UPDATE_DATE","CLOSE_DATE","CARRIER_CODE","BL_NO","TYPE_SIZE","POD","POL","DELIVERY_ORDER_NO"]}
	                      tableData={importData}
	                  />
	              )
	          }

	          
	          ,{
	              tabName: "Export"
	              //,tabIcon: Face
	              ,tabContent: (
	                  <ExpTable
	                      tableHeaderColor="info"
	                      tableHead={[   "SEQ","CNTR_NO","OUT_DATE_TIME","OUT_TERMINAL","OUT_FULL_EMPTY","OUT_BKG_NO","OUT_BL_NO","OUT_CARRIER_CODE","OUT_SEAL_NO","OUT_CAR_NO","PRE_IN_DATE_TIME","PRE_IN_TERMINAL","PRE_IN_FULL_EMPTY","PRE_IN_BKG_NO","PRE_IN_BL_NO","PRE_IN_CARRIER_CODE","PRE_IN_SEAL_NO","PRE_IN_CAR_NO","POL","POL_IN_DATE_TIME","POL_IN_TERMINAL","POL_IN_FULL_EMPTY","POL_IN_BKG_NO","POL_IN_BL_NO ","POL_IN_CARRIER_CODE","POL_IN_SEAL_NO","POL_IN_CAR_NO","IN_DATE_TIME","IN_TERMINAL","IN_FULL_EMPTY","IN_BKG_NO","IN_BL_NO","IN_CARRIER_CODE","IN_SEAL_NO","IN_CAR_NO","RETURN_DATE","LOAD_DATE_TIME","LOAD_VESSEL_CODE","LOAD_TERMINAL_REF_NO","LOAD_TERMINAL","LOAD_CARRIER_CODE","LOAD_SEAL_NO","LOAD_BL_NO","LOAD_BOOKING_NO","LOAD_FULL_EMPTY","MFCS_MRN","MFCS_DPT_DATE","MFCS_LINE_CODE","MFCS_BL_NO","MFCS_SEAL_NO","CLL_SEQ","CLL_CARRIER_CODE","CLL_SOC","CLL_BL_NO","CLL_SEAL_NO","OUT_SCH_ETA","OUT_SCH_ETD","OUT_SCH_LINE_CODE","OUT_SCH_TERMINAL","OUT_SCH_VESSEL_CODE","OUT_SCH_TERMINAL_REF_NO","OUT_SCH_ROUTE_CODE","OUT_SCH_ETB","OUT_SCH_LINE_VSL","OUT_SCH_VOYAGE_NO","OUT_BKG_SHIPPER_ID","OUT_BKG_SHIPPER_NAME","IN_SCH_ETA","IN_SCH_ETD","IN_SCH_LINE_CODE","IN_SCH_TERMINAL","IN_SCH_VESSEL_CODE","IN_SCH_TERMINAL_REF_NO","IN_SCH_ROUTE_CODE","IN_SCH_ETB","IN_SCH_LINE_VSL","IN_SCH_VOYAGE_NO","IN_BKG_SHIPPER_ID","IN_BKG_SHIPPER_NAME","CLL_SCH_CH_LINE_CODE","CLL_SCH_TERMINAL","CLL_SCH_VESSEL_CODE","CLL_SCH_TERMINAL_REF_NO","CLL_SCH_ROUTE_CODE","CLL_SCH_ETB","CLL_SCH_LINE_VSL","CLL_SCH_VOYAGE_NO","LOAD_SCH_ETA","LOAD_SCH_ETD","LOAD_SCH_LINE_CODE","LOAD_SCH_TERMINAL","LOAD_SCH_VESSEL_CODE","LOAD_SCH_TERMINAL_REF_NO","LOAD_SCH_ROUTE_CODE","LOAD_SCH_ETB","LOAD_SCH_LINE_VSL","LOAD_SCH_VOYAGE_NO","CHANGE_VESSEL_CODE","CHANGE_TERMINAL_REF_NO","CHANGE_LINE_VSL","CHANGE_VOYAGE_NO","CHANGE_ROUTE","CHANGE_TERMINAL","CHANGE_ETA","CHANGE_ETB","CHANGE_ETD","CHANGE_POL","OUT_CODECO_THIS_IPM","OUT_CODECO_KEY_ID","PRE_IN_CODECO_THIS_IPM","PRE_IN_CODECO_KEY_ID","POL_IN_CODECO_THIS_IPM","POL_IN_CODECO_KEY_ID","IN_CODECO_THIS_IPM","IN_CODECO_KEY_ID","LOAD_COARRI_THIS_IPM","OUT_BKG_SIETA","CLL_SCH_ETD","CLL_SD","IN_BKG_SID","OUT_SCH_VOYAGE_SID","IN_SCH_VOYAGE_SID","CLL_SCH_VOYAGE_SID","LOAD_SCH_VOYAGE_SID","REG_DATE","UPDATE_DATE","CLOSE_DATE"," CARRIER_CODE","BL_NO","TYPE_SIZE"]}
	                      tableData={exportData}
	                  />
	              )
	          }]}>     
      </CustomTabs>
		</GridItem>
    </GridContainer>
  );
}
