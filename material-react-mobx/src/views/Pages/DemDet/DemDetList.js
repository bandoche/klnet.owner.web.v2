import React,{ useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomTable from "views/Pages/DemDet/CustomTable.js";
import { CardContent, TextField } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "components/CustomButtons/Button.js";
import Grid from '@material-ui/core/Grid';
import MButton from '@material-ui/core/Button';

import Popover from  '@material-ui/core/Popover';
import ExcelUpload from "views/Pages/DemDet/PopUp/ExcelUpload.js";

import CardIcon from "components/Card/CardIcon.js";
import Icon from "@material-ui/core/Icon";
import BackupIcon from "@material-ui/icons/Backup";
import CancelIcon from "@material-ui/icons/CancelPresentation";
import AddIcon from "@material-ui/icons/AddBox";
import DetailTable from "views/Pages/DemDet/DetailTable.js";
import Assignment from "@material-ui/icons/Assignment";


import axios from 'axios';
//import {ExcelFile, ExcelSheet} from "react-export-excel";
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
{/*class Download extends React.Component {
  
  render() {
    const { data, index } = this.props;
    return (
      <ExcelFile>
        <ExcelSheet dataSet={data} name="Oraganization"/>
      </ExcelFile>
    )
  }
}*/}
let numCnt =1;

export default function DemDetList(props) {
  
  const [anchorCancel, setAnchorCancel] = useState(null);
  const [anchorExcel, setAnchorExcel] = useState(null);
  const [anchorAdd, setAnchorAdd] = useState(null);
  
  
  const [demDetList,setDemDetList] = useState([]);
  const [openJoin,setOpenJoin] = useState(false);

  const [lineData, setLineData] = useState([]);

  //조회조건
  const [lineCode, setLineCode] = useState("");
  const [mblNo,setMblNo] = useState("");
  const [cntrNo,setCntrNo] = useState("");
  const [paramData, setParamData] = useState('');
  const [store,setStore] = useState(props.store);
 
  useEffect(() => {
    
    //console.log(props.location.state);
   /* if (props.location.state != undefined) {
      setParamData(props.location.state.param);
    }*/

    if(store.token){
     axios.post("/loc/getCustomLineCode",{},{headers:{'Authorization':'Bearer '+store.token}})
       .then(res => setLineData(res.data))
       .catch(err => {
    		        if(err.response.status == "403"||err.response.status == "401") {
    		        	props.openLogin();
    				}
       });
    }
    
    return () => {
        console.log('cleanup');
      };
  },[]);

  const excelHandleClose = () => {
    setAnchorExcel(null);
  }
  const onSubmit = () => {

	  if(store.token) {
	    numCnt=1;
		  //search
		  axios.post("/loc/getDemDetList",{
	      lineCode:lineCode
	      ,mblNo:mblNo
	      ,cntrNo:cntrNo
	      ,num:numCnt
	    },{headers:{'Authorization':'Bearer '+store.token}})
	    	.then(setDemDetList([]))
		    .then(res => setDemDetList(res.data))
		    .catch(err => {
		       //console.log(err.response.status);
		    	 if(err.response.status == "403"||err.response.status == "401") {
		        	props.openLogin();
		        }
		        
		    });
	  } else {
		  props.openLogin();
	  }
    console.log(">>> demDetList : ",demDetList) ;
  }
  //console.log(paramData);

  const handleAddRow = () => {
	  if(store.token) {
	    //page ++
	    numCnt=numCnt+1;
	
	    axios.post("/loc/getDemDetList",{
	      lineCode:lineCode
	      ,mblNo:mblNo
	      ,cntrNo:cntrNo
	      ,num:numCnt
	    },{headers:{'Authorization':'Bearer '+store.token}}) 
	    .then(res => setDemDetList([...demDetList,...res.data]))
	    .catch(err => {
	      if(err.response.status == "403" || err.response.status == "401") {
	    	  props.openLogin();
	      }
	    }); 
	  } else {
		  props.openLogin();
	  }
  };
  

  const onCarrierSearchValue = (e) => {
    const values = e.target.value;
    if(values != "" && values.length > 2) {
    	if(store.token) {
	      axios.post("/loc/getCustomLineCode",{},{headers:{'Authorization':'Bearer '+store.token}})
	      .then(res => setLineData(res.data))
	      .catch(err => {
	    		        if(err.response.status == "403"||err.response.status == "401") {
	    		        	props.openLogin();
	    				}
	    		    });
    	} else {
    		props.openLogin();
    	}
    }  
    console.log(">>> lineData : ",lineData) ;
  }

  const onCarrierChange = (e,data) => {
	  if(data) {
		  setLineCode(data.id);
	  } else {
		  setLineCode("");
	  }
  }
  const classes = useStyles();  
  
  return (
    <GridContainer>
      <GridItem xs={12} xm={12}>
        <Card style={{marginBottom:'0px'}}>
          <CardHeader color="info" icon style={{height:'10px'}}>
            <CardIcon color="info" style={{padding:'0'}}>
              <Assignment />
            </CardIcon>
	        </CardHeader>
          <CardBody style={{paddingBottom: '0px',paddingTop: '10px',paddingLeft: '15px',paddingRight: '15px'}}>
            <Grid container spacing={1}>
              <GridItem xs={3} sm={3} md={3}>
                <Autocomplete
                  options = {lineData}
                  getOptionLabel = { option => option.id+" "+option.nm}
                  id="lineCode"
                  onChange={onCarrierChange}
                  onInputChange={onCarrierSearchValue}
                  setValue = {lineData}
                  inputProps={{onChange:event => setLineCode(event.target.value)}}
                  renderInput={params => (
                    <TextField {...params} label="선사" fullWidth />
                  )}
                />
              </GridItem>
              <GridItem xs={2} sm={2} md={2}>
                <CustomInput
                  labelText="M-B/L NO"
                  id="mblNo"
                  inputProps={{onChange:event => setMblNo(event.target.value)}}
                  formControlProps={{fullWidth: true}}
                />
              </GridItem>
              <GridItem xs={2} sm={2} md={2}>
                <CustomInput
                  labelText="CNTR NO"
                  id="cntrNo"
                  inputProps={{onChange:event => setCntrNo(event.target.value)}}
                  formControlProps={{fullWidth: true}} 
                />
              </GridItem>
               
              <GridItem xs={5} sm={5} md={5} style={{textAlignLast:'right'}}>
                {/* <Button color="info" onClick = {onSubmit} startIcon={<CancelIcon/>}>초기화</Button> */}
                <Button color="info" onClick = {onSubmit}  >조회</Button>
                <Button color="info" >삭제</Button>
                <Button color="info" //onClick = {Download} 
                  id='btnExport' >엑셀다운로드</Button>
              </GridItem>
              
            </Grid>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12}>
        <Card style={{marginTop:'5px',marginBottom:'5px'}}>
          <CardBody style={{padding:'0px'}}>
            {/* <GridItem xm={12} sm={12} md={12} style={{textAlignLast:'right'}}>
              <Button color="info" onClick = {onSubmit}  >조회</Button>
              <Button color="info" onClick = {onSubmit}  >저장</Button>
              <Button color="info" onClick = {onSubmit}  >삭제</Button>
              <Button color="info" onClick = {onSubmit}  >상세보기</Button>
            </GridItem> */}
              <DetailTable 
                tableHeaderColor = "info"
                //tableHead = {["선택","선사", "CNTR NO", "DETENTION", "DEMURRAGE", "COMBINED","STORAGE","REMARKS","DO신청"]}
                tableData = { demDetList }
                tableRownum={numCnt}
                onClickHandle ={handleAddRow}
              />
          </CardBody>
        </Card> 
      </GridItem>    
    </GridContainer>
  );
}