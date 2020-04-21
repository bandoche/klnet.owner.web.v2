import React,{ useState,useEffect } from "react";

import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles,useTheme } from "@material-ui/core/styles";
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

// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import { slideDown, slideUp } from "components/Slide/Slide.js";

import axios from 'axios';
import TableList from "components/Table/TableSmallLine.js";

const classes = makeStyles(theme => ({
  root: {
    padding: 0,
  },
}));

const useStyles = makeStyles(styles);

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


	
	console.log(":"+count+":"+page+":"+rowsPerPage+":"+onChangePage);
	
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
  
  useEffect(() => {
    console.log('effect-detail');
    setPage(0);
  },[props.tableData]);

  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor } = props;
  const [page,setPage] = React.useState(0);
  const [rowsPerPage,setRowsPerPage] = React.useState(5);

  const [det,setDet] = useState(true);

  const handleChagePage = (e,newPage) => {
    console.log("handleChagePage : ");
    setDet(false);
    setPage(newPage);
  }
  
  const handleChangeRowsPerPage = event => {
    console.log("handleChangeRowsPerPage");
    setDet(false);
	  setRowsPerPage(parseInt(event.target.value,10));
    setPage(0);
  }


  
  
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
           {(rowsPerPage > 0?tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) :  tableData).map((prop, key) => {
                  return (
                    <TableRows key={key} index={key + 1} data={prop} page={page} />
                  );
                })}
           
        </TableBody>
        {(tableData.length >= 5 ?
        <TableFooter>
        	<TableRow>
        		<TablePagination 
        			rowsPerPageOptions={[5,10,15,{label:'All',value:-1}]}
        			colSpan={5}
        			count={tableData.length}
        		    rowsPerPage={rowsPerPage}
        			page={page}
        			SelectProps={{
        				inputProps: {'aria-label':'Rows Per Page'},
        			    native:true,
        			}}
        			onChangePage={handleChagePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              
        			ActionsComponent={TablePageinationActions}
        	/>
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
  state = { expanded: false , port: []};

  componentDidMount() {
    console.log("componentDidMount");
    this.scheduleToSearch();
  }

  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate");
    //debugger;
    if(this.props.page != prevProps.page) {
      this.setState({ expanded: false });
      this.scheduleToSearch();
    }
  }

  // 테이블 조회
  scheduleToSearch = () => {
    this.setState({port:[]});
    return axios ({
		url:'/sch/getScheduleDetailList',
		method:'POST',
		data: {carrierCode : this.props.data.line_code,
			   startPort : this.props.data.start_port,
			   endPort : this.props.data.end_port,
			   voyage : this.props.data.voyage_no,
         vesselName : this.props.data.vsl_name,
         startDate : this.props.data.start_day,
         endDate : this.props.data.end_day,
         svc : this.props.data.svc
			   }
  }).then(response => this.setState({port:response.data }));

    
  }
 
  // 로우 생성
  toggleExpander = () => {
    if (!this.state.expanded) {
      this.setState({ expanded: true }, () => {
        if (this.refs.expanderBody) {
          slideDown(this.refs.expanderBody);//this.scheduleToSearch();
        }
      });
    } else {
      slideUp(this.refs.expanderBody, {
        onComplete: () => {
          this.setState({ expanded: false });
        }
      });
    }

  };
  
  render() {
    //const { data } = this.props;
     const { port } = this.state;

     

     
    if(!this.props.det && this.state.expanded) {
      //this.toggleExpander();
      //console.log("render!!!!");
    }
     
     console.log(">>> port : ",this.state.port) ;
     console.log(">>> line_code : ",port) ;
    return [
      <TableRow  key={this.props.index} onClick={this.toggleExpander} >
        <TableCell >{this.props.data.line_code}</TableCell>
        <TableCell >{this.props.data.vsl_name}</TableCell>
        <TableCell >{this.props.data.voyage_no}</TableCell>
        <TableCell >{this.props.data.start_port} ({this.props.data.start_day})</TableCell>
        <TableCell >{this.props.data.end_port} ({this.props.data.end_day})</TableCell>
      </TableRow>,
      this.state.expanded && (
        <TableRow key = {this.props.index+1}>
          <TableCell colSpan={3}>
            <div ref="expanderBody"> 
            <TableList
                  tableHeaderColor={this.props.color}
                  tableHead={["Vessel Name","Voyage No","POL","POD"]}
//                  tableData={[["DEPATURE 2020-01-29", "2020-01-29", "2020-01-29","1","2","3","4"],
//                  ["LOGING 2020-01-29", "2020-01-29", "2020-01-29","1","2","3","4"]]}
                  tableData={port}
              />  
            </div>
          </TableCell>
        </TableRow>
      )
    ];
  }
}
