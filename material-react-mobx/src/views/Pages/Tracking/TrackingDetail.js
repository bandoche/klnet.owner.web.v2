import React from "react";

import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";

import ShipMap from "components/Map/ShipMap.js";
import GridContainer from "components/Grid/GridContainer.js";
import TableList from "components/Table/TableSmallLine.js";
import GridItem from "components/Grid/GridItem.js";
import Popover from  '@material-ui/core/Popover';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

//import Card from "components/Card/Card.js";
//import Access from "@material-ui/icons/AccessAlarm";
import Assign from "@material-ui/icons/AssignmentTurnedIn";

import Icon from '@material-ui/core/Icon';
import MapIcon from "@material-ui/icons/Map";
import CustomIcon from "@material-ui/icons/AccountBalanceSharp";
import TerminalIcon from "@material-ui/icons/LocalShippingOutlined";
//import ActListIcon from "@material-ui/icons/ListAlt";
// core components
import styles from "assets/jss/material-dashboard-pro-react/components/tableStyle.js";
import { slideDown, slideUp } from "components/Slide/Slide.js";
import TackingMap from "components/Map/TrackingMap.js"
import CurrentList from "views/Pages/Tracking/Current/TrackingCurrent.js";
import CntrListTable from "views/Pages/Tracking/Terminal/TrackingCntrList.js";
//import Slider from "components/Slide/Slider.js";
import Button from "components/CustomButtons/Button.js";
// page
import TerminalImp from "views/Pages/Tracking/TrackingImpTerminal.js";
import TerminalExp from "views/Pages/Tracking/TrackingExpTerminal.js";
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
//import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(styles);


export default function DetailTable(props) {

  const classes = useStyles();
  const { tableData, tableHeaderColor, tableRownum,store } = props;

  const handleAddFunction = () => {
    props.onClickHandle();
  }

  return (
    <div className={classes.tableResponsive} style={{marginTop:'0px'}}>
    	<Table className={classes.table}>
          <TableHead className={classes[tableHeaderColor + "TableHeader"]} style={{padding:'5px'}}>
            <TableRow className={classes.tableHeadRow} style={{borderBottomStyle:'solid',borderBottomColor:'#ececec'}}>
                  <TableCell style={{borderBottomWidth:'3px',width:'15%'}} className={classes.trackingtableCell + " " + classes.tableHeadCell}>(B/K NO.)<br/>B/L NO.</TableCell>
                  <TableCell style={{borderBottomWidth:'3px',width:'5%'}} className={classes.trackingtableCell + " " + classes.tableHeadCell}>IMPORT(I)<br/>EXPORT(E)</TableCell>
                  <TableCell style={{borderBottomWidth:'3px',width:'5%'}} className={classes.trackingtableCell + " " + classes.tableHeadCell}>CARRIER</TableCell>
                  <TableCell style={{borderBottomWidth:'3px',width:'13%'}} className={classes.trackingtableCell + " " + classes.tableHeadCell}>VESSEL<br/>/VOYAGE</TableCell>
                  <TableCell style={{borderBottomWidth:'3px'}} className={classes.trackingtableCell + " " + classes.tableHeadCell}>LAST CURRENT</TableCell>
                  <TableCell style={{borderBottomWidth:'3px',width:'12%'}} className={classes.trackingtableCell + " " + classes.tableHeadCell}>POL<br/><font color="orange">ETD</font>/<font color="blue">ATD</font>(<font color="red">TO</font>)</TableCell>
                  <TableCell style={{borderBottomWidth:'3px',width:'12%'}} className={classes.trackingtableCell + " " + classes.tableHeadCell}>POD<br/><font color="orange">ETA</font>/<font color="blue">ATA</font>(<font color="red">TO</font>)</TableCell>
                  <TableCell style={{borderBottomWidth:'3px',width:'2%'}} className={classes.trackingtableCell + " " + classes.tableHeadCell}>MORE</TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
           {
              tableData.map((prop, key) => {
                  return (
                    <TableRows key={key} index={key + 1} data={prop} store={store} color={tableHeaderColor} />
                  );
                })
           }
           
        </TableBody>
        {(tableData.length >= 10 ?
        <TableFooter >
        	<TableRow  >
        	<TableCell style={{textAlignLast:'center',paddingTop:'0',paddingBottom:'0'}} colSpan={8}>
        		<Button
				    color="info"
					onClick={handleAddFunction}
        		    style={{paddingLeft:'60px',paddingRight:'60px'}}
				>MORE&nbsp;(&nbsp;{tableRownum}&nbsp;/&nbsp;{tableData[0].tot_page}&nbsp;)</Button>
		    </TableCell>
        	</TableRow>
        </TableFooter>: null )}
      </Table>
    </div>
  );
}

DetailTable.defaultProps = {
  tableHeaderColor: "gray"
};

DetailTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  //tableHead: PropTypes.arrayOf(PropTypes.string),
};


 class TableRows extends React.Component {
  state = {
	  openMap:false,
	  openTrackingMap: false,
	  openPopup:false,expanded: false,
	  openCurrent: false,
	  bookmarkIcon:"N",
	  iconstate:"add_circle",
	  rowStyle:"borderTopStyle:'dashed'",
	  importUniPassList:[],
	  exportUniPassList:[],
	  demdetlist:[],
	  terminalPosition:[],
	  polyRender:[],
	};

  componentDidMount() {
	  this.setState({bookmarkIcon:this.props.data.book_mark});
	  
	  return axios ({
			url:'/loc/getdemdetCurrent',
			method:'POST',
			headers:{'Authorization':'Bearer '+this.props.store.token},
			data: {blbkg : this.props.data.bl_bkg,
				   ietype : this.props.data.ie_type,
				   }
		})//.then(response => console.log("db data",response.data));
		.then(response => this.setState({demdetlist:response.data })); 
  }
  
  // 테이블 조회
  scheduleToSearch = () => {

/*    return axios ({
		url:'/loc/getScheduleDetailList',
		method:'POST',
		data: {carrierCode : this.props.data.LINE_CODE,
			   startPort : this.props.data.START_PORT,
			   endPort : this.props.data.END_PORT,
			   voyage : this.props.data.VOYAGE_NO,
			   vesselName : this.props.data.VESSEL_NAME
			   }
	}).then(response => this.setState({port:response.data }));*/
    
  }
 
  // 로우 생성
  toggleExpander = () => {
    if (!this.state.expanded) {
      this.setState({ expanded: true ,iconstate:"remove_circle"}, () => {
        if (this.refs.expanderBody) {
			if( "E" == this.props.data.ie_type ) {
				// 수출
				//console.log( '수출', this.props.data.ie_type, this.props.data.bl_yy);
				this.__getUniPassExport(this.props);
				this.__getTrackingGoogleMap(this.props);

			} else if( "I" == this.props.data.ie_type ) {
				// 수입
				//console.log('수입', this.props.data.ie_type, this.props.data.bl_yy);
				this.__getUniPassImport(this.props);
				this.__getTrackingGoogleMap(this.props);
			}
          slideDown(this.refs.expanderBody);
        }
      });
    } else {
      slideUp(this.refs.expanderBody, {
        onComplete: () => {
          this.setState({ expanded: false , iconstate:"add_circle" });
        }
      });
    }

  };
  //current
  handleClickOpen = () => {
	  this.setState({ openCurrent: true }); 
  }
  
  handleClickClose = () => {
	  this.setState({ openPopup: false, openMap: false ,openCurrent: false,openTrackingMap: false});
  }
  //즐겨찾기
  handleStarClick = () => {
	  this.state.bookmarkIcon == "Y"?this.setState({bookmarkIcon:"N"}):this.setState({bookmarkIcon:"Y"})	  
	  return axios ({
			url:'/loc/setUserBLUpdate',
			method:'POST',
			headers:{'Authorization':'Bearer '+this.props.store.token},
			data: {blbk : this.props.data.bl_bkg,
				   reqseq: this.props.data.req_seq,
				   ietype: this.props.data.ie_type,
				   bookmark : this.state.bookmarkIcon=="Y"?"N":"Y"
				   }
		});
  }
  //컨테이너 이동 현황
  handleCntrClick = () => {
	  console.log("cntrList");
	  this.setState({ openPopup: true });
  }
  //선박 추적 맵
  handleClickMapOpen = () => {
	  console.log("map");
	  this.setState({ openMap: true });
  }
  //국내 화물 트래킹 맵
  handleClickTrackingMap = () => {
	  console.log("TrackingMap");
	  this.setState({ openTrackingMap : true})
  }
  //국내 화물 트래킹 데이터 수집 
  	__getTrackingGoogleMap = (props) => {
		return axios ({
			url:'/loc/getTrackingTerminal',
			method:'POST',
			headers:{'Authorization':'Bearer '+this.props.store.token},
			data: {ie_type:this.props.data.ie_type,
				   req_seq:this.props.data.req_seq,
				}
		}).then(res => {
			const params = res.data;
			let terminalPosition = [];
			let polyRender = [];
			if( params.length > 0){
				if (this.props.data.ie_type == "I") {
				  if(params[0].unload_terminal != null) {
					terminalPosition.push({time:params[0].unload_date,terminal:params[0].unload_terminal, wgs84_x:params[0].unload_terminal_x, wgs84_y: params[0].unload_terminal_y,work_name:'양하'});
		
					if(params[0].full_outgate_terminal != null && params[0].mt_outgate_terminal == null) {
					  terminalPosition.push({time:params[0].full_outgate_date,terminal:params[0].full_outgate_terminal, wgs84_x:params[0].full_outgate_terminal_x, wgs84_y: params[0].full_outgate_terminal_y, work_name:'풀컨테이너 반출'});
		
					  if(params[0].mt_ingate_terminal != null) {
						terminalPosition.push({time:params[0].mt_ingate_date, terminal:params[0].mt_ingate_terminal, wgs84_x:params[0].mt_ingate_terminal_x, wgs84_y: params[0].mt_ingate_terminal_y, work_name:'공컨테이너 반입'});
						
					  }
		
					}else if(params[0].full_outgate_terminal == null && params[0].mt_outgate_terminal !=null) {
					  terminalPosition.push({time:params[0].mt_outgate_date, terminal:params[0].mt_outgate_terminal, wgs84_x:params[0].mt_outgate_terminal_x, wgs84_y: params[0].mt_outgate_terminal_y, work_name:'공컨테이너 반출'});
					  if(params[0].mt_ingate_terminal != null) {
						terminalPosition.push({time:params[0].mt_ingate_date, terminal:params[0].mt_ingate_terminal, wgs84_x:params[0].mt_ingate_terminal_x, wgs84_y: params[0].mt_ingate_terminal_y, work_name:'공컨테이너 반입'});
						
					  }
					}else {
		
					}
				  }
		
				}else if(this.props.data.ie_type == "E") {
				  if(params[0].mt_outgate_terminal != null) {
					terminalPosition.push({time:params[0].mt_outgate_date,terminal:params[0].mt_outgate_terminal, wgs84_x:params[0].mt_outgate_terminal_x, wgs84_y: params[0].mt_outgate_terminal_y, work_name:'공컨테이너 반출'});
					if(params[0].full_ingate_terminal != null && params[0].mt_ingate_terminal == null) {
					  terminalPosition.push({time:params[0].full_ingate_date,terminal:params[0].full_ingate_terminal, wgs84_x:params[0].full_ingate_terminal_x, wgs84_y: params[0].full_ingate_terminal_y, work_name:'풀컨테이너 반입'}); 
					}else if(params[0].full_ingate_terminal == null && params[0].mt_ingate_terminal != null) {
					  terminalPosition.push({time:params[0].mt_ingate_date,terminal:params[0].mt_ingate_terminal, wgs84_x:params[0].mt_ingate_terminal_x, wgs84_y: params[0].mt_ingate_terminal_y, work_name:'공컨테이너 반입'}); 
					}else if(params[0].full_ingate_terminal != null && params[0].mt_ingate_terminal != null) {
					  terminalPosition.push({time:params[0].full_ingate_date,terminal:params[0].full_ingate_terminal, wgs84_x:params[0].full_ingate_terminal_x, wgs84_y: params[0].full_ingate_terminal_y, work_name:'풀컨테이너 반입'});             
					}else {
		
					}
		
				  }else {
		
				  }
				  if(params[0].load_terminal != null) {
					terminalPosition.push({time:params[0].load_date,terminal:params[0].load_terminal, wgs84_x:params[0].load_terminal_x, wgs84_y: params[0].load_terminal_y,work_name:'선적'});             
				  }else {
		
				  }
				}else {
		
				}
			  }
			  
			  terminalPosition.map((element, index) => {
				polyRender.push({lat:element.wgs84_y,lng:element.wgs84_x});
			  });
			  this.setState({terminalPosition:terminalPosition, polyRender:polyRender});
			  
			
	});
}

	// 세관정보 API 수출용
	__getUniPassExport = (props) => {
		return axios ({
			url:'/com/uniPassApiExportAPI002',
			method:'POST',
			headers:{'Authorization':'Bearer '+this.props.store.token},
			data: {
				mblNo: props.data.bl_bkg
			}
		})
	    .then(res => {
			// console.log( res.data );
			let returnList = [];
			res.data.forEach( element => {
				let returnValue = [];
				if( 'NO_DATA' == element.message ) {
					returnValue.push( '');
					returnValue.push( 'NO DATA');
					returnValue.push( '');
				} else {
					returnValue.push( element.exp_dclr_no);
					returnValue.push( element.tkof_dt);
					returnValue.push( element.shpm_cmpl_yn);
				}
				returnList.push(returnValue);
			});
			this.setState({exportUniPassList : returnList});
		})
	    .catch(err => {
	        console.log(err);
	    });
	}

	// 세관정보 API 수입용
	__getUniPassImport = (props) => {
		console.log(props);

		return axios ({
			url:'/com/uniPassApiExportAPI001',
			method:'POST',
			headers:{'Authorization':'Bearer '+this.props.store.token},
			data: {
				blYy : props.data.bl_yy,
				mblNo: props.data.bl_bkg
			}
		})
	    .then(res => {
			let returnList = [];
			res.data.forEach( element => {
				console.log( element );
				let returnValue = [];
				if( 'NO_DATA' == element.message ){
					returnValue.push( '' );
					returnValue.push( 'NO DATA' );
					returnValue.push( '' );
				} else {
					returnValue.push( element.mbl_no+ "-"+element.hbl_no);
					returnValue.push( element.clearance+"("+element.clearance_date+")");
					returnValue.push( element.mt_trgt_carg_yn_nm);
				}
				returnList.push(returnValue);
			});
			this.setState({importUniPassList : returnList});
		})
	    .catch(err => {
	        console.log(err);
	    });
	}

  
  render() {
     const { data } = this.props;

     const startColor = this.props.data.start_db =="E"?"orange":"BLUE";
     const endColor = this.props.data.end_db =="E"?"orange":"BLUE";
    return [
      <TableRow  key={this.props.index}  style={{borderCollapse:'separate',borderSpacing:'2px 2px',paddingTop:'5px'}} >
        <TableCell style={{padding:'8px ',textAlignLast:'left',borderBottomWidth:'3px'}}>{data.bl_bkg}
        	{this.state.bookmarkIcon == 'Y'?<Tooltip title="BookMark"><StarIcon onClick={this.handleStarClick} style={{color:'#00acc1',verticalAlign:'bottom'}} /></Tooltip>:
        	<Tooltip title="BookMark"><StarBorderIcon onClick={this.handleStarClick} style={{color:'#00acc1',verticalAlign:'bottom'}} /></Tooltip>}</TableCell>
        <TableCell style={{padding:'8px',borderBottomWidth:'3px'}}>{data.ie_type}</TableCell>
        <TableCell style={{padding:'8px',borderBottomWidth:'3px'}}>
        	<Tooltip title={data.line_nm}>
            	<a target="_blank" href={data.line_url}>
        			{data.image_yn=='Y'?<img src={require("assets/img/carrier/"+data.line_code+".gif")} />:<img src={require("assets/img/carrier/No-Image.gif")} />}
        		</a>
        	</Tooltip>
        </TableCell>
        <TableCell style={{padding:'8px',borderBottomWidth:'3px'}}>
        	{data.vsl_name}<br/>{data.voyage?"/"+data.voyage:""}
        	<Tooltip title="vessel map infomation"><MapIcon size="20" style={{verticalAlign:'bottom',color:'#00acc1',width:'20px',height:'20px'}} onClick={this.handleClickMapOpen} /></Tooltip></TableCell>
        <TableCell style={{padding:'8px',borderBottomWidth:'3px'}} onClick={this.handleClickOpen}>
        {/*{data.last_current.length>18?data.last_current.substring(0,15)+" ...":data.last_current}*/}{data.last_current}
        </TableCell>
        <TableCell style={{padding:'8px',borderBottomWidth:'3px'}}>
        	{data.pol}<br/>
        	<font color={startColor}>{data.start_day}</font>
        	{data.start_day?<font color="red">({data.start_cnt})</font>:""}</TableCell>
        <TableCell style={{padding:'8px',borderBottomWidth:'3px'}}>{data.pod}<br/><font color={endColor}>{data.end_day}</font>{data.end_day?<font color="red">({data.end_cnt})</font>:""}</TableCell>
        <TableCell style={{padding:'8px',borderBottomWidth:'3px'}}><Tooltip title="Detail infomation"><Icon style={{color:'#00acc1',paddingTop:'2px'}} onClick={this.toggleExpander}>{this.state.iconstate}</Icon></Tooltip></TableCell>
        {/*Tracking current detail */}
        <Popover
	      	id="popover"
	      	open={this.state.openCurrent}
	      	onClose={this.handleClickClose}
			anchorReference="anchorPosition"
			anchorPosition={{top:80,left:550}}
	      	anchorOrigin={{vertical:'bottom',horizontal:'center',}}
	      	transformOrigin={{vertical:'top',horizontal:'center',}}
	     > 
    	<CurrentList
    		data={data}
    		openLogin={this.props.onLoginPage} 
    		store ={this.props.store}/>
    </Popover>
        <Popover
	      	id="popover"
	      	open={this.state.openPopup}
	      	onClose={this.handleClickClose}
			anchorReference="anchorPosition"
			anchorPosition={{top:80,left:550}}
	      	anchorOrigin={{vertical:'bottom',horizontal:'center',}}
	      	transformOrigin={{vertical:'top',horizontal:'center',}}
	     > 
        	<CntrListTable 
        		data={data}
        		store ={this.props.store} />
        </Popover>
        <Popover
        	id="popover_map"
        	open={this.state.openMap}
        	onClose={this.handleClickClose}
            anchorReference="anchorPosition"
            anchorPosition={{top:80,left:550}}
        	anchorOrigin={{vertical:'bottom',horizontal:'center',}}
      		transformOrigin={{vertical:'top',horizontal:'center',}}>
      		<ShipMap
		  		vesselName={data.vsl_name}>
			</ShipMap>
          </Popover>
		  <Popover
        	id="popover_trackingmap"
        	open={this.state.openTrackingMap}
        	onClose={this.handleClickClose}
            anchorReference="anchorPosition"
            anchorPosition={{top:80,left:550}}
        	anchorOrigin={{vertical:'bottom',horizontal:'center',}}
      		transformOrigin={{vertical:'top',horizontal:'center',}}>
      		<TackingMap
			  setData={this.state.terminalPosition}
			  store={this.props.store.token}
			  ieGubun={data.ie_type}
			  polyRender={this.state.polyRender}>
			</TackingMap>
          </Popover>
      </TableRow>,
      this.state.expanded && (
        <TableRow key = {this.props.index+1} style={{marginTop:'5px',marginBottom:'5px',borderTopStyle:'double',borderTopColor:'whitesmoke',borderBottomStyle:'solid',borderBottomColor:'#ececec'}}>
          <TableCell colSpan={8} style={{padding:'10px'}}>
            <div ref="expanderBody">
            {data.ie_type=="I"?
	          	<GridItem xs={12}>
		          	<GridContainer>
		          		<GridItem xs={12} sm={5} md={5}>
		          		<div>
		          			<TerminalIcon style={{color:'#00acc1',verticalAlign:'bottom'}} />TERMINAL(ARRIVAL)　　　TRACKING MAP
							<MapIcon size="20" style={{verticalAlign:'bottom',color:'#00acc1',width:'20px',height:'20px'}} onClick={this.handleClickTrackingMap} />
		          		</div>
					          	<TerminalImp
					                tableHeaderColor={this.props.color}
					                tableHead={["TERMINAL", "ACTIVITY"]}
									tableData={this.state.demdetlist}
					          	    //tableData={[]}
					          	    handleCntr={this.handleCntrClick}
					          	/>

			          	</GridItem>
			          	<GridItem xs={12} sm={3} md={2}>
			          		<div><Assign style={{color:'#00acc1',verticalAlign:'bottom'}} />컨테이너 현황</div>

					          	<TableList
					                tableHeaderColor={this.props.color}
					                tableHead={["FULL-OUT", "EMPTY-IN"]}
									tableData={[[data.full_out+"/"+data.totalcnt , data.mt_in+"/"+data.totalcnt]]}
					          	/>
	          
			          	</GridItem>
			          	<GridItem xs={12} sm={4} md={5}>
		          		<div><CustomIcon style={{color:'#00acc1',verticalAlign:'bottom'}} />CUSTOM</div>
						  <TableList
							  tableHeaderColor={this.props.color}
							  tableHead={["B/L번호","CLEARLANCE", "관리대상"]}
							  tableData={this.state.importUniPassList}/>
		          
		          	</GridItem>
			          	</GridContainer>
			          </GridItem>
			          :
			        <GridItem xs={12}>
			          	<GridContainer>
			          		<GridItem xs={12} sm={4} md={5}>
			          		<div>
			          			<TerminalIcon style={{color:'#00acc1',verticalAlign:'bottom'}} />TERMINAL(ARRIVAL)　　　TRACKING MAP
								<MapIcon size="20" style={{verticalAlign:'bottom',color:'#00acc1',width:'20px',height:'20px'}} onClick={this.handleClickTrackingMap} />
							</div>
				          		
						          	<TerminalExp
						                tableHeaderColor={this.props.color}
						                tableHead={["TERMINAL", "ACTIVITY"]}
											tableData={this.state.demdetlist}
						          		handleCntr={this.handleCntrClick}
						          	/>
					
				          	</GridItem>
				          	<GridItem xs={12} sm={2} md={2}>
				          		<div><Assign style={{color:'#00acc1',verticalAlign:'bottom'}} />컨테이너 현황</div>
					          	
						          	<TableList
						                tableHeaderColor={this.props.color}
						                tableHead={["EMPTY-OUT", "FULL-IN"]}
						          		tableData={[[data.mt_out+"/"+data.totalcnt , data.full_in+"/"+data.totalcnt]]}
						          	/>
						          
				          	</GridItem>
				          	<GridItem xs={12} sm={5} md={5}>
			          		<div><CustomIcon style={{color:'#00acc1',verticalAlign:'bottom'}} />CUSTOM</div>
							  <TableList
					                tableHeaderColor={this.props.color}
									tableHead={["EXPORT LICENSE","CLEARLANCE", "INSPECT"]}
									tableData={this.state.exportUniPassList}
								/>
			          	</GridItem>
				          	</GridContainer>
				          </GridItem>}
            </div>
          </TableCell>
        </TableRow>    
      )
    ];
  }
}
