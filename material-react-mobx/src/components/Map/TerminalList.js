import React,{useState,useEffect, Component} from "react";
import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// core components
import { InfoWindow, Marker} from "react-google-maps";
import { Router, Route, Switch, Redirect ,Link} from "react-router-dom";
import trackingList from "views/Pages/Tracking/TrackingList.js";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Provider } from "mobx-react";


import {MAP} from 'react-google-maps/lib/constants'
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { borderRadius } from "@material-ui/system";

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
	tableHeadRow: {
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
	  

	}	
  };
  
  const useStyles = makeStyles(styles);

export default function TermianlList(props) {
	const classes = useStyles();
	const { port } = props; 
	const [usePort,setUsePort] = useState([]);
	
	useEffect(() => {
		console.log('호출....');
	    axios.post("/loc/getPortLocation",{ portCode:[props.portCode]}).then(res => setUsePort(res.data));
		return () => {
			console.log('cleanup');
		  };
		},[props.portCode]);
	
	return (
	  
		<MapControl position = {window.google.maps.ControlPosition.BOTTOM_CENTER}>
			<div style={{backgroundColor: "#ffffff", width: "500px", height:"500px", borderRadius:"20px",marginBottom: "50px", overflow:'auto'}}>
				<Table className={classes.table}>
				
					<TableHead>
						<TableRow className={classes.tableHeadRow}>
							<TableCell align={'center'} style={{padding:"1px", fontSize: "10px"}}><span>{port.port_code}<br></br>{port.port_kname}</span></TableCell>
							<TableCell align={'center'} colSpan={'4'} style={{color:"blue", padding:"1px", fontSize: "10px"}}>IN</TableCell>
							<TableCell align={'center'} colSpan={'4'} style={{color:"red", padding:"1px", fontSize: "10px"}}>OUT</TableCell>
						</TableRow>
					
						<TableRow hover={true} className={classes.tableHeadRow}>
							<TableCell style={{padding:"1px", fontSize: "5px"}}>TERMINAL</TableCell>
							<TableCell style={{color:"blue", padding:"1px", fontSize: "5px"}}>DEM</TableCell>
							<TableCell style={{color:"blue", padding:"1px", fontSize: "5px"}}>DET</TableCell>
							<TableCell style={{color:"blue", padding:"1px", fontSize: "5px"}}>COMBINE</TableCell>
							<TableCell style={{color:"blue", padding:"1px", fontSize: "5px"}}>STO</TableCell>		
							<TableCell style={{color:"red", padding:"1px", fontSize: "5px"}}>DEM</TableCell>
							<TableCell style={{color:"red", padding:"1px", fontSize: "5px"}}>DET</TableCell>
							<TableCell style={{color:"red", padding:"1px", fontSize: "5px"}}>COMBINE</TableCell>
							<TableCell style={{color:"red", padding:"1px", fontSize: "5px"}}>STO</TableCell>
						</TableRow>
					</TableHead>
					
					<TableBody>
						{usePort.length !== 0 && (usePort.map((data, index) => {
						
						return (
							<TableRow key={index} className={classes.tableBodyRow} >
								<TableCell align={'center'} className={classes.tableCell} style={{padding:"3px", fontSize: "5px"}}>
									{data.terminal}
								</TableCell>
								<TableCell align={'center'} className={classes.tableCell} style={{padding:"3px", fontSize: "5px"}}>
									<a href="http://localhost:3000/own/demDet" className={classes.block}>
									1
									</a>
								</TableCell>
								<TableCell align={'center'} className={classes.tableCell} style={{padding:"3px", fontSize: "5px"}}>
									<Link to={{
										pathname : `/svc/demDet/`,
										state : {param : data.terminal}}}>
										2
									</Link>
								</TableCell>
								<TableCell align={'center'} className={classes.tableCell} style={{padding:"3px", fontSize: "5px"}}>
									3
								</TableCell>
								<TableCell align={'center'} className={classes.tableCell} style={{padding:"3px", fontSize: "5px"}}> 
									4
								</TableCell>
								<TableCell align={'center'} className={classes.tableCell} style={{padding:"3px", fontSize: "5px"}}> 
									5
								</TableCell>
								<TableCell align={'center'} className={classes.tableCell} style={{padding:"3px", fontSize: "5px"}}> 
									6
								</TableCell>
								<TableCell align={'center'} className={classes.tableCell} style={{padding:"3px", fontSize: "5px"}}> 
									7
								</TableCell>
								<TableCell align={'center'} className={classes.tableCell} style={{padding:"3px", fontSize: "5px"}}> 
									8
								</TableCell>
							</TableRow>
						);
						}))}
					</TableBody> 
				</Table>	
			</div>
		</MapControl>

	);
}

class MapControl extends Component {
    static contextTypes = {
      [MAP] : PropTypes.object
    }
  
    componentWillMount() {
      this.map = this.context[MAP]
      this.controlDiv = document.createElement('div');
      this.map.controls[this.props.position].push(this.controlDiv);
    }
  
    componentWillUnmount() {
      const controlArray = this.map.controls[this.props.position].getArray();
      for (let i=0; i < controlArray.length; i++) {
        if(controlArray[i] === this.controlDiv) {
          this.map.controls[this.props.position].removeAt(i);
        }
      }
    }
    render() {
      return createPortal(this.props.children,this.controlDiv)
    }
  }