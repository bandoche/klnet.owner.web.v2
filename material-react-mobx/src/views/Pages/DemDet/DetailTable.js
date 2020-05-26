import React from "react";

import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import MButton from '@material-ui/core/Button';
import Button from "components/CustomButtons/Button.js";

// core components
import { slideDown, slideUp } from "components/Slide/Slide.js";
import axios from 'axios';
import TableList from "components/Table/TableSmallLine.js";



const classes = makeStyles(theme => ({
  root: {
    padding: 0,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow : 'hidden',
    padding : 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const useStyles = makeStyles(styles => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow : 'hidden',
    padding : 0,
    position: 'absolute',
    top: 20,
    width: 1,
  }
}));

const useStyles1 = makeStyles(theme => ({
	root:{
		flexShrink:0,
		marginLeft: theme.spacing(2.5),
	}
}));




function TablePageinationActions(props) {
	const classes = useStyles1();
	const theme = useTheme();
	const {count,page,rowsPerPage,onChangePage } =props;
	
	//console.log(":"+count+":"+page+":"+rowsPerPage+":"+onChangePage);
	
	const handleFirstPageButtonClick = e => {
		onChangePage(e,0);
	}
	
	const handleBackButtonClick = e => {
		onChangePage(e,page -1);
	}
	
	const handleNextButtonClick = e => {
		onChangePage(e,page +1);
	}
	
	const handleLastPageButtonClick = e => {
		onChangePage(e,Math.max(0,Math.ceil(count / rowsPerPage)-1));
	}
	
	return (
		<div className = {classes.root}>
			<IconButton
				onClick = {handleFirstPageButtonClick}
				disabled={page === 0 }
				aria-label="first page"
			>
			{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon/>}
			</IconButton>
			<IconButton
				onClick = {handleBackButtonClick}
				disabled={page === 0 }
				aria-label="previous page"
			>
		{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
		</IconButton>
		<IconButton
			onClick = {handleNextButtonClick}
			disabled={page >= Math.ceil(count / rowsPerPage) -1 }
			aria-label="next page"
		>
	{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
	</IconButton>
		<IconButton
			onClick = {handleLastPageButtonClick}
			disabled={page >= Math.ceil(count / rowsPerPage)-1 }
			aria-label="last page"
		>
		{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon/>}
		</IconButton>
		</div>
	);
	
}

TablePageinationActions.propTypes = {
		count:	PropTypes.number.isRequired,
		onChangePage: PropTypes.func.isRequired,
		page: PropTypes.number.isRequired,
		rowsPerPage:PropTypes.number.isRequired,
}


export default function ToggleTable(props) {


  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor, tableRownum } = props;
  const [page,setPage] = React.useState(0);
  const [rowsPerPage,setRowsPerPage] = React.useState(5);
  //console.log(">>> tableData : ",tableData);
  //console.log(props);

  const handleAddFunction = () => {
    props.onClickHandle();
  }

  

  
  
  
  const handleChagePage = (e,newPage) => {
    //console.log(props);
    setPage(newPage);
  }
  
  const handleChangeRowsPerPage = event => {
	  setRowsPerPage(parseInt(event.target.value,10));
	  setPage(0);
  }
  
  

  return (
    <div className={classes.tableResponsive} style={{marginTop:'0px'}}>
      <Table className={classes.table} >
        <TableHead className={classes[tableHeaderColor + "TableHeader"]} style={{padding:'5px',textAlignLast:'center'}}>
          <TableRow className={classes.tableHeadRow} style={{borderBottomStyle:'solid',borderBottomColor:'#ececec'}}>
                <TableCell style={{borderBottomWidth:'3px'}} className={classes.demDettableCell + " " + classes.tableHeadCell}>선택</TableCell>
                <TableCell style={{borderBottomWidth:'3px'}} className={classes.demDettableCell + " " + classes.tableHeadCell}>CARRIER</TableCell>
                <TableCell style={{borderBottomWidth:'3px'}} className={classes.demDettableCell + " " + classes.tableHeadCell}>CNTR NO</TableCell>
                <TableCell style={{borderBottomWidth:'3px'}} className={classes.demDettableCell + " " + classes.tableHeadCell}>DEMERRAGE</TableCell>
                <TableCell style={{borderBottomWidth:'3px'}} className={classes.demDettableCell + " " + classes.tableHeadCell}>DETENTION</TableCell>
                <TableCell style={{borderBottomWidth:'3px'}} className={classes.demDettableCell + " " + classes.tableHeadCell}>STORAGE CHARGE</TableCell>
                <TableCell style={{borderBottomWidth:'3px'}} className={classes.demDettableCell + " " + classes.tableHeadCell}>REMARK</TableCell>
                <TableCell style={{borderBottomWidth:'3px'}} className={classes.demDettableCell + " " + classes.tableHeadCell}>DO신청</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRows key={key} index={key + 1} data={prop} color={tableHeaderColor} />
            );
          })}
          {/*  {
           (rowsPerPage > 0?  tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) :  tableData).map((prop, idx, key) => {
                  return (
                    <TableRows key={idx} index={idx + 1} data={prop} expand={false}/>
                  );
                })} */}
                
           
        </TableBody>
        {(tableData.length >= 10 ?
        <TableFooter>
        	<TableRow>
            <TableCell style={{textAlignLast:'center',paddingTop:'0',paddingBottom:'0'}} colSpan={8}>
              <Button 
                color="info" onClick={handleAddFunction}
        		    style={{paddingLeft:'60px',paddingRight:'60px'}}>
                  MORE
                  {/* &nbsp;(&nbsp;{tableRownum}&nbsp;/&nbsp;{tableData.length}&nbsp;) */}
              </Button>
		        </TableCell>
        	
        	</TableRow>
        </TableFooter>: null )}
      </Table>
    </div>
  );
}

ToggleTable.defaultProps = {
  tableHeaderColor: "gray"
};

ToggleTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
};


class TableRows extends React.Component { 
  
  state = {demExpanded: false , 
          detExpanded: false ,
          oscExpanded: false ,
          cntrExpanded: false
        };

  demExpander = () => {
    this.setState({ cntrExpanded: false });
    this.setState({ detExpanded: false });
    this.setState({ oscExpanded: false });
    if (!this.state.demExpanded) {
      this.setState({ demExpanded: true }, () => {
        if (this.refs.demExpand) {slideDown(this.refs.demExpand);}
      });
    } else {
      slideUp(this.refs.demExpand, {onComplete: () => {this.setState({ demExpanded: false });}});
    }
  }; 

  detExpander = () => {
    this.setState({ cntrExpanded: false });
    this.setState({ demExpanded: false });
    this.setState({ oscExpanded: false });
    if (!this.state.detExpanded) {
      this.setState({ detExpanded: true }, () => {
        if (this.refs.detExpand) {slideDown(this.refs.detExpand);}
      });
    } else {
      slideUp(this.refs.detExpand, {onComplete: () => {this.setState({ detExpanded: false });}});
    }
  }; 

  oscExpander = () => {
    this.setState({ cntrExpanded: false });
    this.setState({ demExpanded: false });
    this.setState({ detExpanded: false });
    if (!this.state.oscExpanded) {
      this.setState({ oscExpanded: true }, () => {
        if (this.refs.oscExpand) {slideDown(this.refs.oscExpand);}
      });
    } else {
      slideUp(this.refs.oscExpand, {onComplete: () => {this.setState({ oscExpanded: false });}});
    }
  }; 

  cntrExpander = () => {
    this.setState({ demExpanded: false });
    this.setState({ detExpanded: false });
    this.setState({ oscExpanded: false });

    if (!this.state.cntrExpanded) {
      this.setState({ cntrExpanded: true }, () => {
        if (this.refs.expandCntr) {slideDown(this.refs.expandCntr);}
      });
    } else {
      slideUp(this.refs.expandCntr, {onComplete: () => {this.setState({ cntrExpanded: false });}});
    }
  };
  
  render() {
    const { data } = this.props;
    
    return [
      
      <TableRow key={this.props.index} className={this.staterowStyle} style={{borderCollapse:'separate',borderSpacing:'2px 2px',paddingTop:'5px'}} >
        <TableCell align="center" >
          <Checkbox
          value="secondary"
          color="primary"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </TableCell>
        <TableCell align="center" ><b><a>{(data.image_yn == 'Y')?<img alt={data.line_code} src={require("assets/img/carrier/"+data.img_line_code+".gif")} />:data.line_code}</a></b></TableCell>
        <TableCell align="left" onClick={this.cntrExpander} ><b><a>{data.cntr_no}</a></b></TableCell>
        <TableCell align="right" onClick={this.demExpander}>{data.dem_amount} {data.dem_unit}</TableCell>
        <TableCell align="right" onClick={this.detExpander}>{data.det_amount} {data.det_unit}</TableCell> 
        {/* <TableCell align="right">{this.props.data[37]} {this.props.data[39]}</TableCell> */} 
        <TableCell align="right" onClick={this.oscExpander}>{data.osc_amount} {data.osc_unit}</TableCell>
        <TableCell >{data.dem_det_remark}</TableCell>
        <TableCell align="center">
          <MButton
            variant="contained"
            //color="primary"
            size="small"
            style={{lineHeight:"1",}}
            //startIcon={<CancelIcon/>}
            onClick={null}
          >DO신청
          </MButton>
        </TableCell>
      </TableRow>
      ,this.state.demExpanded && (
        <TableRow key = {this.props.index+100000} style={{marginTop:'5px',marginBottom:'5px',borderTopStyle:'double',borderTopColor:'whitesmoke',borderBottomStyle:'solid',borderBottomColor:'#ececec'}}>
          <TableCell colSpan={11} style={{padding:'5px'}}>
            <div ref="demExpand"> 
              {data.dem_tariff}
            </div>
          </TableCell>
        </TableRow>    
      )
      ,this.state.detExpanded && (
        <TableRow key = {this.props.index+200000} style={{marginTop:'5px',marginBottom:'5px',borderTopStyle:'double',borderTopColor:'whitesmoke',borderBottomStyle:'solid',borderBottomColor:'#ececec'}}>
          <TableCell colSpan={11} style={{padding:'5px'}}>
            <div ref="detExpand"> 
              {data.det_tariff}
            </div>
          </TableCell>
        </TableRow>    
      )
      ,this.state.oscExpanded && (
        <TableRow key = {this.props.index+300000} style={{marginTop:'5px',marginBottom:'5px',borderTopStyle:'double',borderTopColor:'whitesmoke',borderBottomStyle:'solid',borderBottomColor:'#ececec'}}>
          <TableCell colSpan={11} style={{padding:'5px'}}>
            <div ref="oscExpand"> 
              {data.osc_tariff}
            </div>
          </TableCell>
        </TableRow>    
      )
      ,this.state.cntrExpanded && (
        <TableRow key = {this.props.index+400000} style={{marginTop:'5px',marginBottom:'5px',borderTopStyle:'double',borderTopColor:'whitesmoke',borderBottomStyle:'solid',borderBottomColor:'#ececec'}}>
          <TableCell colSpan={11} style={{padding:'5px'}}>
            <div ref="expandCntr"> 
              <TableList
                  tableHeaderColor={this.props.color}
                  tableHead={["SZ/TP","M-BL","VSL","VOY","POL","POD","ATA","UNLOAD","GATE OUT","GATE IN"]}
                  tableData={[
                              [
                              data.type_size
                              ,data.mbl_no
                              ,data.vsl_name,data.voyage_no
                              ,data.pol,data.pod
                              ,data.ata,data.unloading_date
                              ,data.full_outgate_date,data.mt_ingate_date
                              ]
                            ]}
              /> 
            </div>
          </TableCell>
        </TableRow>    
      )
      
      
     
    ];
  }
}
