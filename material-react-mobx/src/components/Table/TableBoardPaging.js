import React from "react";
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
import styles from "assets/jss/material-dashboard-pro-react/components/tableStyle.js";

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
	const {count,page,rowsPerPage,onChangePage} =props;
	
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

export default function CustomTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor, colSpan } = props; // eslint-disable-line no-unused-vars
  const [page,setPage] = React.useState(0);
  const [rowsPerPage,setRowsPerPage] = React.useState(6);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage,tableData.length - page * rowsPerPage); // eslint-disable-line no-unused-vars
  
  const handleChagePage = (e,newPage) => {
	  setPage(newPage);
  }
  
  const handleChangeRowsPerPage = event => {
	  setRowsPerPage(parseInt(event.target.value,10));
	  setPage(0);
  }
  
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]} style={{padding:'5px',backgroundColor:'aliceblue'}}>
            <TableRow className={classes.tableHeadRow}>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell} stype={{width:'5%'}}>no</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>title</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell} stype={{width:'10%'}}>inser_name</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell} stype={{width:'5%'}}>search_cnt</TableCell>
            <TableCell className={classes.tableCell + " " + classes.tableHeadCell} stype={{width:'10%'}}>insert_date</TableCell>
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
        {(rowsPerPage > 0?tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) :  tableData).map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                    <TableCell className={classes.tableCell}>{prop.board_id}</TableCell>
                    <TableCell className={classes.tableCell}>{prop.title}</TableCell>
                    <TableCell className={classes.tableCell}>{prop.author_name}</TableCell>
                    <TableCell className={classes.tableCell}>{prop.hit_count}</TableCell>
                    <TableCell className={classes.tableCell}>{prop.insert_date}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {(tableData.length >= 10 ?
        <TableFooter>
    	<TableRow>
    		<TablePagination 
    			rowsPerPageOptions={[6]}
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

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
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
  //tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};
