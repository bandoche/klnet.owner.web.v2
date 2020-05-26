import React, { Component } from "react"; 

//import componets
// import { Table,Popconfirm, Row, Col, Icon, Upload } from "antd";
import { Popconfirm, Icon, Upload } from "antd";
// import * as Link from 'react-router-dom';
import { ExcelRenderer } from "react-excel-renderer";
import { EditableFormRow, EditableCell } from "components/ExcelRender/editable.js";
import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
import Grid from '@material-ui/core/Grid';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import CardIcon from "components/Card/CardIcon.js";
import axios from 'axios';
import Filesaver from 'file-saver';
//import icon
import IconM from "@material-ui/core/Icon";
// import * as XLSX from 'xlsx';
//import pages
import TablePaging from "views/Pages/BLUpload/UploadTable.js";
export default class ExcelPage extends Component {
  
  constructor(props) {
    super(props);
    this.uploadRef = React.createRef();
  this.state = {
    selectedFile: null,
    selectedFileList: [],
    lineCode:props.params,
    userStore:props,
    cols: [],
    rows: [],
    errRows: [],
    errorMessage: null,
    extendDiv: false,
    columns: [
      {
        title: "BL No.",
        dataIndex: "name",
        editable: true
      },
      {
        title: "Carrier Code",
        dataIndex: "carrierCode",
        editable: true
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (text, record) => 
        this.state.rows.length >= 1 ? (
          <Popconfirm
          title="Sure to delete?"
          onConfirm={() => this.handleDelete(record.key)}
          >
          <Icon
            type="delete"
            theme="filled"
            style={{ color: "red", fontSize: "20px" }}
          />
          </Popconfirm>
        ) : null
      }
      ],
    errColumns: [
      {
        title: "BL No.",
        dataIndex: "name",
        editable: true
      },
      {
        title: "Carrier Code",
        dataIndex: "carrierCode",
        editable: true
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (text, record) => 
        this.state.errRows.length >= 1 ? (
          <Popconfirm
          title="Sure to delete?">
          <Icon
            type="delete"
            theme="filled"
            style={{ color: "red", fontSize: "20px" }}
          />
          </Popconfirm>
        ) : null
      }
      ]    
    };
  } 

  handleSave = row => { 
    
    const newData = [...this.state.rows]; 
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index]; 
    
    newData.splice(index, 1, { 
      ...item, 
      ...row 
    }); 
    this.setState({ rows: newData }); 
  }; 

  checkFile(file) {
    let errorMessage = ""; 
    if (!file || !file[0]) { 
      return; 
    } 
    const isExcel = 
    file[0].type === "application/vnd.ms-excel" || 
    file[0].type === 
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; 
    if (!isExcel) { 
      errorMessage = "You can only upload Excel file!";
    }
    const isLt2M = file[0].size / 1024 / 1024 < 2; 
    if (!isLt2M) { 
      errorMessage = "File must be smaller than 2MB!";
    } 
    return errorMessage; 
  } 

  fileHandler = fileList => {
    
    let fileObj = fileList; 
      if (!fileObj) {
        this.setState({ 
          errorMessage: "No file uploaded!" 
        }); 
      return false; 
    } 
    if (!(fileObj.type === "application/vnd.ms-excel" || fileObj.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ) ) { 
      this.setState({ 
        errorMessage: "Unknown file format. Only Excel files are uploaded!"
      });
    return false; 
    }
    //just pass the fileObj as parameter 
      ExcelRenderer(fileObj, (err, resp) => {
        if (err) { 
          console.log(err); 
        } else {
          let newRows = [];
          let errRows = [];
          resp.rows.slice(2).map((row, index) => {
            
            if (row && row !== "undefined") {
              if(row[0] != undefined) { 
                
                if((row[0] != 'I' && row[0] != 'E')) {
                  errRows.push([row[0],row[1],row[2],row[3],row[4], '수출입 구분을 확인 해주십시요.']);
                }else {
                  let checkLine = false;
                  this.state.lineCode.forEach(element => {
                    if (element.id == row[1]) {
                      checkLine = true;
                      return;
                    }
                  });
                  if(checkLine) {
                      if(row[0] != undefined) {
                        if(row[0] > 2) {
                          errRows.push([row[0],row[1],row[2],row[3],row[4],'I/E Type 형식이 맞지않습니다.']);
                          return;
                        }
                      }
                      if((row[2] == undefined) && (row[3] == undefined)) {
                        errRows.push([row[0],row[1],row[2],row[3],row[4],'B/L No. 혹은 B/K No. 가 입력되지 않았습니다.']);
                        return;  
                      }

                      if(row[2] != undefined) {
                        if(row[2].length > 35) {
                          errRows.push([row[0],row[1],row[2],row[3],row[4],'B/L No.길이가 너무 큽니다.']);
                          return;
                        }
                      }
                      if(row[3] != undefined) {
                        if(row[3].length > 35) {
                          errRows.push([row[0],row[1],row[2],row[3],row[4],'B/K No.길이가 너무 큽니다.']);
                          return;
                        }
                      }
                      if(row[4] != undefined) {
                        if(row[4].length > 20) {
                          errRows.push([row[0],row[1],row[2],row[3],row[4],'Container Number 길이가 너무 큽니다.']);
                          return;
                        }
                      } 
                    
                    
                    newRows.push([row[0],row[1],row[2],row[3],row[4]]);
                  }else {
                    errRows.push([row[0],row[1],row[2],row[3],row[4], 'CARRIER CODE가 틀리거나 맞지 않습니다.']);
                  }
                  
                  
                }
              
              }
            }
          });
          if (newRows.length === 0) {
            this.setState({
              errorMessage: "No data found in file!",
              cols: [],
              rows: [],
            }); 
            return false; 
          } else {
            let errCheck = false;

            if (errRows.length === 0){
              errCheck = false;
            }else {
              errCheck = true;
            }

            this.setState({
              cols: resp.cols,
              rows: newRows,
              errRows: errRows,
              errorMessage: null,
              extendDiv: errCheck,
            });
          }
        }
      });
    
    return false; 
  }; 
  onChangeFile = (info) => {
    let setArray = [];
    if(info.fileList.length != 0 ){
      setArray.push(info.fileList[info.fileList.length-1]);

      console.log('setArray',setArray);
      this.setState({
        selectedFileList: setArray,
        rows:[],
        cols:[]
      })
    }else {
      this.setState({
        selectedFileList: [],
        rows:[],
        cols:[]
      })
    }
  }

  handleDown = () => {
    
    axios.get("/loc/downloadExcel",{responseType:"arraybuffer",headers:{'Authorization':'Bearer '+this.state.userStore.token.token}}).
    then(res => {
      console.log(res.data);
      Filesaver.saveAs(new Blob([res.data]),"BLUploadFormat.xlsx")});
  }

  handleSubmit = async () => { 
    // console.log("submitting: ", this.state.rows);
    let dataRows = this.state.rows;
    if(dataRows.length != 0) {
      axios.post("/loc/saveBlList", { dataRows:dataRows },{headers:{'Authorization':'Bearer '+this.state.userStore.token.token}})
      .then(response => {
        alert(" 정상 처리되었습니다.");
        this.setState({ rows: [], errRows: [], extendDiv: false});
      })
      .catch(error => {
        console.log(error)
        alert(error);
      })
    }else {
      alert("업로드된 BL이 존재하지 않습니다.");
    }
    //submit to API 
    //if successful, banigate and clear the data 
    //this.setState({ rows: [] }) 
  };

  handleDelete = key => {
    const rows = [...this.state.rows];
    this.setState({ rows: rows.filter(item => item.key !== key) });
  }; 
/*handleAdd = () => { 
const { count, rows } = this.state; 
const newData = { 
key: count, 
name: "User's name", 
age: "22", 
gender: "Female" 
}; 
this.setState({ 
rows: [newData, ...rows], 
count: count + 1 
}); 
}; */

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    }; 
    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col, 
        onCell: record => ({ 
          record, 
          editable: col.editable, 
          dataIndex: col.dataIndex, 
          title: col.title, 
          handleSave: this.handleSave 
        }) 
      }; 
    });      
    if(this.state.extendDiv) {
      return(
      <div>
      <Card>
        <CardHeader color="info" stats icon >
          <CardIcon color="info" style={{height:'55px'}}>
            <IconM style={{width:'26px',fontSize:'20px',lineHeight:'26px'}}>
              content_copy
            </IconM>
          </CardIcon>
            <h4 style={{textAlign: "left",color:"#000000"}}>Excel Upload</h4>
        </CardHeader>
        <CardBody>
        <GridItem >
						<Grid container spacing={2}>
							<Grid item xs={12} sm={12} md={12}>
								<Upload
                  name="file"
                  fileList = {this.state.selectedFileList}
                  beforeUpload={this.fileHandler}
                  onRemove={() => this.setState({ rows: [], errRows: [], extendDiv: false})}
                  onChange={this.onChangeFile}
                  multiple={false}>
                  
                  
                  <Button color="info" size="sm" style={{width:'620px'}}>
                    <Icon type="upload" /> Click to Upload Excel File
                  </Button>
                </Upload>
							</Grid>
						</Grid>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={12} md={6}>
							 <Button style={{width:"200px"}} style={{width:'300px'}} color="info" size="sm" onClick={this.handleDown}>SAMPLE DOWNLOAD</Button>
							</Grid>
							<Grid item xs={12} sm={12} md={6}>
								<Button style={{width:"200px"}} style={{width:'300px'}} color="info"  onClick={this.handleSubmit} size="sm"> Submit Data </Button>
							</Grid>
						</Grid>
					</GridItem>
        </CardBody>
      </Card>
      <CardHeader color="info" stats icon >
          <h4 style={{textAlign: "right",color:"#000000"}}>Total : {this.state.rows.length}</h4>
      </CardHeader>
      <div style={{marginLeft:'15px'}}>
      <TablePaging
        style={{marginLeft:'10px'}}
        tableHeaderColor="info"
        tableHead={["I/E","CARRIER","B/L No.", "BK No.","Container No."]}
        tableData={this.state.rows}
      />
      </div>
      <Card>
        <CardHeader color="info" stats icon >
            <h4 style={{textAlign: "left",color:"#000000"}}>Error BL List</h4>
            <h4 style={{textAlign: "right",color:"#000000"}}>Total : {this.state.errRows.length}</h4>
        </CardHeader>
      </Card>
      <div style={{marginLeft:'15px'}}>
      <TablePaging
        style={{marginLeft:'10px'}}
        tableHeaderColor="info"
        tableHead={["I/E","CARRIER","B/L No.", "BK No.","Container No.", "Remark"]}
        tableData={this.state.errRows}
      />
      </div>
      </div>
      
    );
    } else{
      return (
        <div>
        <Card>
          <CardHeader color="info" stats icon >
            <CardIcon color="info" style={{height:'52px'}}>
              <IconM style={{width:'26px',fontSize:'20px',lineHeight:'26px'}}>
                content_copy
              </IconM>
            </CardIcon>
              <h4 style={{textAlign: "left",color:"#000000"}}>Excel Upload</h4>
          </CardHeader>
          <CardBody>
          <GridItem >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                  
                  
                  <Upload
                    name="file"
                    fileList = {this.state.selectedFileList}
                    beforeUpload={this.fileHandler}
                    onRemove={() => this.setState({ rows: [], errRows: [], extendDiv: false})}
                    onChange={this.onChangeFile}
                    multiple={false}>
                      
                    <Button color="info" size="sm" style={{width:'620px'}}>
                      <Icon type="upload" /> Click to Upload Excel File
                    </Button>
                  </Upload>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6}>
                 <Button style={{width:"200px"}} style={{width:'300px'}} color="info" size="sm" onClick={this.handleDown}>SAMPLE DOWNLOAD</Button>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Button style={{width:"200px"}} style={{width:'300px'}} color="info"  onClick={this.handleSubmit} size="sm"> Submit Data </Button>
                </Grid>
              </Grid>
            </GridItem>
          </CardBody>
        </Card>
        <CardHeader color="info" stats icon >
          <label  style={{float:'right', padding:'10px'}}> Total : {this.state.rows.length}</label>
        </CardHeader>
        <div style={{marginLeft:'15px'}}>
        <TablePaging
          
          tableHeaderColor="info"
          tableHead={["I/E","CARRIER","B/L No.", "BK No.","Container No."]}
          tableData={this.state.rows}
        />
        </div>
        </div>
        
      );
    }
    
  } 
}