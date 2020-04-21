import React,{useState,useEffect} from "react";
// @material-ui/core components
import { createStyles, Theme, withStyles,makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomSelect from "components/CustomInput/CustomSelect.js";
//import Table from "components/Table/Table.js";
import Table from "components/Table/TablePaging.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Icon from "@material-ui/core/Icon";
import CardIcon from "components/Card/CardIcon.js";
import Button from "components/CustomButtons/Button.js";
import Grid from '@material-ui/core/Grid';
import BackupIcon from "@material-ui/icons/Backup";
import StarIcon from "@material-ui/icons/Stars";
import CalendarBox from "components/CustomInput/CustomCalendar.js";
import SearchButton from "components/CustomButtons/Button.js";
import Popover from  '@material-ui/core/Popover';
import Excel from "views/Pages/BLUpload/ExcelUpload.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
//import Modal from '@material-ui/core/Modal';
//import JoinPage from "components/Form/Common/JoinPage.js";
import axios from 'axios';
import MaterialTable from 'material-table';
import leftPad from "left-pad";
// import page
import CarrierPage from "views/Pages/BLUpload/CarrierInfoPage.js";
import { useCookies  } from 'react-cookie';
const styles = {
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
    gridStyle1: {
    	paddingTop:'1px',
    	paddingBottom:'1px',
    },
};

const useStyles = makeStyles(styles);

export default function TableList() {
	const classes = useStyles();
	const setDate = new Date();
	const setEndDate = new Date();
	const [fromDate,setFromDate] = useState(new Date(setEndDate.setDate(setEndDate.getDate()-7)));
	const [toDate,setToDate] = useState(new Date());
	const [ieGubun, setIeGubun] = useState('');
	const [blbkgGubun, setBlbkgGubun] = useState('BL');
	const [lineCode,setLineCode] = useState([]);
	const [labelName,setLabelName] = useState("B/L NO.");
	const [searchKey,setSearchKey] = useState("");
	const [searchCount, setSearchCount] = useState(0);
	const [cookies, setCookie] = useCookies(['name']);
	useEffect(() => {
		axios.post("/loc/getCustomLineCode",{},
				{headers:{'Authorization':'Bearer '+cookies['connect.sid']}}
		).then(res => setLineCode(res.data));
		// .then(res => console.log(JSON.stringify(res.data)));
		return () => {
			console.log('LINE CODE cleanup');
		};
	}, []);

	const handleIEGubun = (e) => {
		console.log("xx",e.target.value);
		setIeGubun(e.target.value);
		//e.target.value=="IMPORT"?setLabelName("BL No."):setLabelName("BK No.")
		
	}
	const handleblbkgGubun = (e) => {
		setBlbkgGubun(e.target.value);
		e.target.value=="B/L"?setLabelName("B/L No."):setLabelName("B/K No.")
		
	}	
	
	const [selectData,setSelectData] = useState([]);
	// useEffect(() => {
	// 	console.log('BL LIST effect');
	// 	axios.post("/loc/getMyBlList",{ carrierCode:carrierCode, fromDate:'20200101', toDate:'20200313', }).then(res => setSelectData(res.data));
		
	// 	return () => {
	// 		console.log(' BL LIST cleanup');
	// 	};
	// }, []);


	const [carrierCode,setCarrierCode] = useState("");
	const [anchorE, setAnchorE] = useState(null);
	const [anchorU, setAnchorU] = useState(null);
	const [openJoin,setOpenJoin] = useState(false);
  
	const handleOpenJoin = () => {
		setOpenJoin(true);
	};
  
	const handleJoinClose = () => {
		setOpenJoin(false);
	};
  
	const handleClose = () => {
		setAnchorE(null);
		setAnchorU(null);
	};
  
	const carrier_open = Boolean(anchorE);
	const upload_open = Boolean(anchorU);
	const carrier = carrier_open ? 'simple-popover1':undefined;
	const upload = upload_open ? 'simple-popover2':undefined;
  
	const onCarrierChange = (e,data) => {
		if(data) {setCarrierCode(data.id);} else {setCarrierCode("");}
	}

	

	const onSubmit = () => {
		//search
		// if( '' == carrierCode ) {
		// 	alert( "선사코드를 지정해주시기 바랍니다." );
		// 	return false;
		// }
		// console.log( "fromDate" + fromDate.format("yyyyMMdd"));
		let fromYMD = fromDate.getFullYear()+leftPad((fromDate.getMonth()+1), 2, "0")+leftPad((fromDate.getDate()), 2, "0");
		let toYMD = toDate.getFullYear()+leftPad((toDate.getMonth()+1), 2, "0")+leftPad((toDate.getDate()), 2, "0");
		let typeGubun = "";
		
		if (ieGubun == "IMPORT") {
			typeGubun = "I";
		}else if (ieGubun == "EXPORT") {
			typeGubun = "E";
		}else {
			typeGubun = "";
		}
		if( fromYMD > toYMD ) {
			alert( "종료일자가 시작 일자보다 빠릅니다. 다시 확인하세요." );
			return false;
		}

		axios.post("/loc/getMyBlList",{ carrierCode:carrierCode, fromDate:fromYMD, toDate:toYMD, typeGubun:typeGubun, blbkgGubun:blbkgGubun,searchKey:searchKey},{headers:{'Authorization':'Bearer '+cookies['connect.sid']}})
		.then(res => (setSelectData(res), setSearchCount(res.data.length)));
	}

	return (	
		<div>
			<Card style={{marginBottom:'1px'}}>
				<CardHeader color="info" stats icon >
					<CardIcon color="info" style={{height:'55px'}}>
						<Icon style={{width:'26px',fontSize:'20px',lineHeight:'26px'}}>content_copy</Icon>
					</CardIcon>
					<h4 className={classes.cardTitleBlack}>B/L(B/K) MANAGEMENT</h4>
				</CardHeader>
				<CardBody style={{padding:'2px'}}>
					<GridItem>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={12} md={3}>
								<CustomSelect
									id="ieGubun"
									labelText = "IMPORT&EXPORT"
									setValue = {ieGubun}
									option = {["ALL","IMPORT","EXPORT"]}
									inputProps={{onChange:handleIEGubun, authWidth:true}}
									
									formControlProps={{fullWidth: true}} 
								/>								
							</Grid>
							<Grid item xs={12} sm={12} md={2}>
								<CustomSelect
										id="blbkGubun"
										labelText = "B/L & B/K"
										setValue = {blbkgGubun}
										option = {["B/L","B/K"]}
										inputProps={{onChange:handleblbkgGubun}}
										formControlProps={{fullWidth: true}}/>
							</Grid>
								<Grid item xs={12} sm={12} md={2}>
									<TextField id="blbk" label={labelName} onChange={event => setSearchKey(event.target.value)} value={searchKey} //variant="outlined" size="small" 
										fullWidth />
								</Grid>
								<Grid item xs={12} sm={12} md={1}>
								</Grid>
							<Grid item  xs={12} sm={12} md={4}>
								<SearchButton color="info" fullWidth onClick={onSubmit} >Search</SearchButton>
							</Grid>
						</Grid>



						<Grid container spacing={2}>
							<Grid item xs={12} sm={12} md={3}>
							<CalendarBox
								labelText ="Reg_Date From"
								id="fromDate"
								format="yyyy-MM-dd"
								setValue={fromDate}
								autoOk={true}
								onChangeValue={date => setFromDate(date)}
								formControlProps={{fullWidth: true}} 
							/>
							</Grid>
							<Grid item xs={12} sm={12} md={3}>
							<CalendarBox
								labelText =" Reg_Date To"
									id="toDate"
									format="yyyy-MM-dd"
									setValue={toDate}
									autoOk={true}
									onChangeValue={date => setToDate(date)}
								formControlProps={{fullWidth: true}}
							/>
							</Grid>
							<Grid item xs={12} sm={12} md={6}>
								<Autocomplete
									options = {lineCode}
									getOptionLabel = { option => option.id + '\n' +option.nm }
									id="carrierCode"
									onChange={onCarrierChange}
									renderInput={params => (
										<TextField inputProps={{maxLength:4}} {...params} label="선사" fullWidth />
									)}
								/>
							</Grid>
						</Grid>
					</GridItem>
					
				</CardBody>
			</Card>
	{/*			<Modal
				open={openJoin}
				onClose={handleJoinClose}
				>
				<JoinPage mode="0" page="/svc/tracking" reTurnText="Login" />
			</Modal>*/}
			<Grid item xs={12}>
				{/* <Table
				tableHeaderColor="info"
				tableHead={["No", "BL No.", "Carrier", "Register Time"]}
				tableData={selectData}

				/> */}
				<MaterialTable
					totalCount={10}
					options={{actionsColumnIndex: -1}}
					title=""
					columns={
						[{ width: '5%' ,title: 'No', field: 'num', editable:'never' }
						,{ width: '5%' ,title: 'I/E', field: 'ie_type', lookup: {'I': 'IMPORT', 'E': 'EXPORT'}}
						,{ width: '15%' ,title: 'LINE', field: 'carrier_code', editComponent: props => (
							
							
							<Autocomplete
									options = {lineCode}
									getOptionLabel = { option => option.id + ' ' +option.nm }
									id="carrier_code"
									onChange={(e,data) => props.onChange(data.id)}
									renderInput={params => (
										<TextField {...params} label="선사" fullWidth />
									)}/>
							)
						}		   
						,{ width: '20%' ,title: 'BL No.', field: 'bl_no', editComponent: (props) => (
							<CustomInput
								labelText={
									<span>
									B/L No. <small>(required)</small>
									</span>
								}
								id="blno"
								formControlProps={{
								fullWidth: true
								}}
								inputProps={{
									max:35,
									onChange:event => props.onChange(event.target.value)
								}}
							/>
							)}
							,{ width: '20%' ,title: 'B/K No.', field: 'bkg_no', editComponent: (props) => (
								<CustomInput
									labelText={
										<span>
										B/K No. <small>(required)</small>
										</span>
									}
									id="bkgno"
									formControlProps={{
									fullWidth: true
									}}
									inputProps={{
										max:35,
										onChange:event => props.onChange(event.target.value)
									}}
								/>
								)}
							,{ width: '20%', title: 'Container No.', field: 'cntr_no', editComponent: (props) => (
								<CustomInput
									id='cntrno'
									formControlProps={{
									fullWidth: true
									}}
									inputProps={{
										maxLength:5,
										onChange:event => props.onChange(event.target.value)
									}}
								/>
								)}		
						,{ width: '15%', title: 'Date', field: 'insert_date', editable:'never' }]
					}
					data={selectData.data}
					components={{
						Toolbar: props => (
								<GridItem>
									<Grid item xs={12} sm={12} md={12}>
										<Grid>
										<Button
											variant="contained"
											color="info"
											size="sm"
											style={{lineHeight:"1",}}
											onClick={() => props.actions[0].onClick()}
											startIcon={<BackupIcon/>}
											style={{marginRight: 5}}
											>B/L REG
										</Button>
										<Button
											variant="contained"
											color="info"
											size="sm"
											style={{lineHeight:"1",}}
											startIcon={<BackupIcon/>}
											onClick={e=>setAnchorU(e.currentTarget)}
											style={{marginRight: 5}}
											>Excel Upload
										</Button>&nbsp;&nbsp;
										<Button
											variant="contained"
											color="info"
											size="sm"
											style={{lineHeight:"1",}}
											startIcon={<StarIcon/>}
											onClick={e=>setAnchorE(e.currentTarget)}
											style={{marginRight: 5}}
										>Carrier Info
										</Button>
										<Popover
											id={upload}
											open={upload_open}
											anchorEl={anchorU}
											onClose={handleClose}
											anchorOrigin={{vertical:'top',horizontal:'center',}}
											transformOrigin={{vertical:'center',horizontal:'right',}}
											><Excel/>
										</Popover>
										<Popover
											id={carrier}
											open={carrier_open}
											anchorEl={anchorE}
											onClose={handleClose}
											anchorOrigin={{vertical:'top',horizontal:'center',}}
											transformOrigin={{vertical:'center',horizontal:'right',}}
											><CarrierPage/>
										</Popover>
											<label  style={{float:'right', padding:'5px'}}> Total : {searchCount}</label>
										</Grid>
										</Grid>
									</GridItem>
								
						)
					}}
					editable={{
						onRowAdd: newData =>
							
							new Promise(resolve => {
								setTimeout(() => {
									resolve();
									// setSelectData(prevState => {
									// 	const data = [...prevState.data];
									// 	data.push(newData);
									// 	return { ...prevState, data };
									// });
									if ( undefined == newData.ie_type || '' == newData.ie_type) {
										alert("수출입 구분을 선택해주세요.");
										return false;
									}
									if ( undefined == newData.carrier_code || '' == newData.carrier_code ) {
										alert("선사코드는 필수 입니다.");
										return false;
									}
									if (( '' == newData.bl_no || undefined == newData.bl_no) && ('' == newData.bkg_no || undefined == newData.bkg_no)) {
										alert("BL 번호 또는 BK 번호를 입력해주세요.");
										return false;
									} 

									if ( 4 < newData.carrier_code.length  ) {
										alert("선사코드는 최대 4자리 입니다.");
										return false;
									}
									if ( 16 < newData.bl_no.length ) {
										alert("BL번호는 16자리가 최대 입니다.");
										return false;
									}
									axios.post("/loc/getPkMyBlList",{newData:newData},{headers:{'Authorization':'Bearer '+cookies['connect.sid']}}).then(res => {
										
										if ( res.data == '' ) {
													axios.post("/loc/insertBlRequest",{newData:newData},{headers:{'Authorization':'Bearer '+cookies['connect.sid']}}).then(res => {
														setSelectData(prevState => {
															const data = [];
															
															if( 0 < prevState.length ) {
																data = [...prevState.data];
															}
															data.push(newData);

															setSearchCount(data.length);
															return { ...prevState, data };
														});		
													})
												}else {
													alert("["+newData.bl_bkg+"] 해당 BL 값은 이미 존재합니다. 등록 불가합니다.");
													// data[data.indexOf(newData)] = oldData;
													// return { ...prevState, data };
												}
												
											
											
									});
								}, 600);
						}),
						onRowUpdate: (newData, oldData) =>
								
							new Promise(resolve => {
								console.log(newData);
								setTimeout(() => {
									resolve();
									if ( undefined == newData.ie_type || '' == newData.ie_type) {
										alert("수출입 구분을 선택해주세요.");
										return false;
									}
									if ( undefined == newData.carrier_code || '' == newData.carrier_code ) {
										alert("선사코드는 필수 입니다.");
										return false;
									}
									if (( '' == newData.bl_no || undefined == newData.bl_no) && ('' == newData.bkg_no || undefined == newData.bkg_no)) {
										alert("BL 번호 또는 BK 번호를 입력해주세요.");
										return false;
									} 

									if ( 4 < newData.carrier_code.length  ) {
										alert("선사코드는 최대 4자리 입니다.");
										return false;
									}
									if ( 16 < newData.bl_no.length ) {
										alert("BL번호는 16자리가 최대 입니다.");
										return false;
									}
									if (oldData) {
										axios.post("/loc/getPkMyBlList",{newData:newData},{headers:{'Authorization':'Bearer '+cookies['connect.sid']}}).then(res => {
											// 수정 처리.
											if ( res.data == '' ) {
												
													axios.post("/loc/updateMyBlNo",{ oldData:oldData, newData:newData},{headers:{'Authorization':'Bearer '+cookies['connect.sid']}});
													setSelectData(prevState => {
														const data = [...prevState.data];
														
														data[data.indexOf(oldData)] = newData;
														console.log(data);
														return { ...prevState, data };
													});
													
											} else {
												console.log("event 1");
												alert("["+newData.bl_no+"] 해당 BL 값은 이미 존재합니다. 변경이 불가합니다.");
												// data[data.indexOf(newData)] = oldData;
												// return { ...prevState, data };
											}
										});
									}
									
								}, 600);
							}),
						onRowDelete: oldData =>
							new Promise(resolve => {
								setTimeout(() => {
									resolve();
									setSelectData(prevState => {
										const data = [...prevState.data];
										data.splice(data.indexOf(oldData), 1);
										// 삭제 처리.
										axios.post("/loc/deleteMyBlNo",{ oldData:oldData},{headers:{'Authorization':'Bearer '+cookies['connect.sid']}})
										setSearchCount(data.length);
										return { ...prevState, data };
									});
								}, 600);
						}),
					}}
				/>
			</Grid>
		</div>   
  );
}
