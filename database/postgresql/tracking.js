'use strict';

const pgsqlPool = require("../pool.js").pgsqlPool
const basicauth = require("basic-auth");
const sUser = require('../../models/sessionUser');

  const getTrackingList = (request, response) => {
	  
	  request.session.sUser = sUser;

	 let sqlText ="";
	 
	 sqlText += "select mbl_no,bkg_no,totalCnt,req_seq,bl_bkg,book_mark,ie_type,carrier_code,(select line_code from own_code_cuship where id = carrier_code)as line_code, \n";
	 sqlText += " (select nm_kor from own_code_cuship where id = carrier_code)as line_nm, \n";
	 sqlText += " vsl_name,voyage,last_current,pol,start_db,start_day, start_cnt, \n";
	 sqlText += " pod,end_db,end_day,end_cnt,coalesce(substring(start_day,0,5), to_char(now(), 'YYYY') ) bl_yy from ( \n";
	 sqlText += " select mbl_no,bkg_no,count(*) over() as totalCnt,floor(((row_number() over()) -1) /10 +1) as curpage, \n";
	 sqlText += " req_seq,bl_bkg, book_mark, ie_type,carrier_code,vsl_name,voyage,last_current,pol,pod, \n";
	 sqlText += " case when (pol_atd is not null or pol_atd !='') then 'A' else 'E' end as start_db, \n";
	 sqlText += " to_char(to_date(case when (pol_atd is not null or pol_atd !='') then pol_atd else pol_etd end,'yyyymmdd'),'YYYY/MM/DD') as start_day, \n"; 
	 sqlText += " coalesce(to_date(case when (pol_atd is not null or pol_atd !='') then pol_atd else pol_etd end,'yyyymmdd')-current_Date,0) as start_cnt, \n";	 
	 sqlText += " case when (pod_ata is not null or pod_ata !='') then 'A' else 'E' end as end_db, \n";
	 sqlText += " to_char(to_date(case when (pod_ata is not null or pod_ata !='') then pod_ata else pod_eta end,'yyyymmdd'),'YYYY/MM/DD') as end_day, \n";
	 sqlText += " coalesce(to_date(case when (pod_ata is not null or pod_ata !='') then pod_ata else pod_eta end,'yyyymmdd')-current_Date,0) as end_cnt \n";
	 //sqlText += "  case when (pod_eta is null or pod_eta='') or (pol_atd is null or pol_atd='') or (to_date(pol_atd,'yyyymmdd') > current_Date) then '0' \n";
	 //sqlText += "  else (cast(case when current_Date = to_date(pol_atd,'yyyymmdd') then 1 else current_Date-to_date(pol_atd,'yyyymmdd') end as integer)/ \n";
     //sqlText += "  cast(to_date(pod_eta,'yyyymmdd')- to_date(pol_atd,'yyyymmdd') as integer) *100) end as percent \n";
	 sqlText += " from \n";
	 sqlText += " ( select a.book_mark,a.mbl_no,a.bkg_no, b.* from  \n";
	 sqlText += " ( select * from own_user_request  where user_no = '"+request.session.sUser.userno+"') a \n";
	 sqlText += " ,own_tracking_bl_new b \n";
	 //sqlText += " on a.bl_bkg = b.bl_bkg \n";
	 sqlText += " where a.req_seq = b.req_seq \n";
	 if(request.body.ietype != "" && request.body.ietype != "A") {
		 sqlText += " and b.ie_type = '"+request.body.ietype+"' \n";
	 }
	 
	 if(request.body.dategb == "A" ) {
		 sqlText += " and case when (b.pod_ata is not null or b.pod_ata != '') then b.pod_ata else b.pod_eta end between '"+request.body.from+"' and '"+request.body.to+"' \n";
	 } else {
		 sqlText += " and case when (b.pol_atd is not null or b.pol_atd != '') then b.pol_atd else b.pol_etd end between '"+request.body.from+"' and '"+request.body.to+"' \n";
	 }
	 
	 if(request.body.blbk != "") {
		 sqlText += " and b.bl_bkg = '"+request.body.blbk+"' \n";
     }
	sqlText += " order by case when a.book_mark='Y' then 0 else 1 end \n";
	 sqlText += ")x)a where curpage = '"+request.body.num+"' \n";

console.log(sqlText);
    pgsqlPool.connect(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.query(sqlText, function(err,result){
            done();
            if(err){
                console.log(err);
                response.status(400).send(err);
            }

            //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
            
            response.status(200).json(result.rows);
            // console.log(result.fields.map(f => f.name));

        });

        // conn.release();
    });
}

const getMyBlList = (request, response) => {
    let sql = "";
    sql = " select row_number()over( order by insert_date desc) as num ";
    sql += " ,bl_bkg as bl_no,carrier_code,to_char(insert_date,'YYYY/MM/DD') as insert_date, ie_type, bkg_no, cntr_no ";
    sql += " from own_user_request ";
    sql += " where user_no = '"+request.session.sUser.userno+"' ";
    if( '' != request.body.fromDate && '' != request.body.toDate ) {
        sql += " and to_char(insert_date , 'yyyymmdd') between '"+ request.body.fromDate +"' and  '" + request.body.toDate + "' " ;
    }
    
    if( '' != request.body.typeGubun) {
        sql += " and ie_type = '"+ request.body.typeGubun +"' ";
    }

    if( '' != request.body.carrierCode ) {
        sql += " and carrier_code = '"+ request.body.carrierCode +"'  ";
    }
    

    if( '' != request.body.searchKey) {
        if ('B/L' == request.body.blbkgGubun) {
            sql += " and bl_bkg = '"+ request.body.searchKey +"' ";
        }else if ('B/K' == request.body.blbkgGubun) {
            sql += " and bkg_no = '"+ request.body.searchKey +"' ";
        }
    }
    sql += " and del_yn ='N' order by num";
    console.log(sql);
    pgsqlPool.connect(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.query(sql, function(err,result){
            done();
            if(err){
                console.log(err);
                response.status(400).send(err);
            }

            response.status(200).json(result.rows);
        });
    });
}
  
  const getPkMyBlList = (request, response) => {
	    const sql = {
          text: "select bl_bkg "
          +" from own_user_request "
          +" where user_no = $1 and carrier_code = $2 and bl_bkg = $3 and ie_type = $4 ",
            values: [request.session.sUser.userno
                ,request.body.newData.carrier_code
                ,request.body.newData.bl_no
                ,request.body.newData.ie_type],
	        // rowMode: 'array',
        }
        console.log( sql )
	    pgsqlPool.connect(function(err,conn,done) {
	        if(err){
	            console.log("err" + err);
	            response.status(400).send(err);
	        }

	        conn.query(sql, function(err,result){
	            done();
	            if(err){
	                console.log(err);
	                response.status(400).send(err);
	            }
                if(result != null) {
                    response.status(200).json(result.rows);
                } else {
                    response.status(200).json([]);
                }
	        });

	        // conn.release();
	    });
  }

  const updateMyBlNo = (request, response) => {
      console.log(request.body);
	    const sql = {
          text: " update own_user_request "
          +" set ie_type = upper($1) "
          +" ,carrier_code = upper($2) "
          +" ,bl_bkg = upper($3) "
          +" ,bkg_no = upper($4) "
          +" ,cntr_no = upper($5) "
          +" ,update_user = $6 "
          +" ,update_date = now() "
          +" where carrier_code = upper($7) "
          +" and bl_bkg = upper($8) "
          +" and bkg_no = upper($9) "
          +" and cntr_no = upper($10) "
          +" and ie_type = upper($11) ",
          values: [request.body.newData.ie_type,
                   request.body.newData.carrier_code,
                   request.body.newData.bl_no,
                   request.body.newData.bkg_no,
                   request.body.newData.cntr_no,
                   request.session.sUser.userno,
                   request.body.oldData.carrier_code,
                   request.body.oldData.bl_no,
                   request.body.oldData.bkg_no,
                   request.body.oldData.cntr_no,
                   request.body.oldData.ie_type
                ],
      }
      // console.log( sql )
      pgsqlPool.connect(function(err,conn,done) {
          if(err){
              console.log("err" + err);
              response.status(400).send(err);
          }
  
          conn.query(sql, function(err,result){
              done();
              if(err){
                  console.log(err);
                  response.status(400).send(err);
              }
              if(result != null) {
                  response.status(200).json(result.rows);
              } else {
                  response.status(200).json([]);
              }
          });
      });
  }

  const deleteMyBlNo = (request, response) => {
	    const sql = {
          text: " update own_user_request "
          +" set del_yn = 'Y' "
          +" ,update_user =$1 "
          +" ,update_date = now() "
          +" where carrier_code = $2 "
          +" and bl_bkg = $3 ",
          values: [request.session.sUser.userno
              ,request.body.oldData.carrier_code
              ,request.body.oldData.bl_no],
      }
      // console.log( sql )
      pgsqlPool.connect(function(err,conn,done) {
          if(err){
              console.log("err" + err);
              response.status(400).send(err);
          }
  
          conn.query(sql, function(err,result){
              done();
              if(err){
                  console.log(err);
                  response.status(400).send(err);
              }
              if(result != null) {
                  response.status(200).json(result.rows);
              } else {
                  response.status(200).json([]);
              }
          });
      });
  }

const getBookMark = (request, response) => {

    const sql = {
        text: "select seq,vsl_name,ie_type,pol,pod from own_book_mark"+
        	  " where user_no =$1  and menu_code='T'  order by seq",
        values: [request.session.sUser.userno,],
        rowMode: 'array',
    }

    pgsqlPool.connect(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.query(sql, function(err,result){
            done();
            if(err){
                console.log(err);
                response.status(400).send(err);
            }

            //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
            response.status(200).json(result.rows);
            // console.log(result.fields.map(f => f.name));
        });

        // conn.release();
    });
}

const getCntrList = (request, response) => {

    const sql = {
            text: "select carrier_code,bl_bkg,cntr_no,move_time,move_name,loc_name from ("+
                  " select carrier_code,bl_bkg,cntr_no,row_number()over( partition by cntr_no order by move_time desc) as loc_seq,"+
                  "    to_char(to_timestamp(substr(move_time,1,8),'YYYYMMDDhh24mi'),'YYYY-MM-DD hh24:mi') as move_time,"+
            	  " vsl_name,voyage_no,loc_name,move_name"+
            	  " from own_tracking_loc_new"+
            	  " where carrier_code= $1 and bl_bkg= $2 and cntr_no !=''"+
            	  " ) a where loc_seq=1"+
            	  " order by cntr_no",
            values: [request.body.carriercode, request.body.blbk],
            rowMode: 'array',
        }
console.log(sql);
    pgsqlPool.connect(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.query(sql, function(err,result){
            done();
            if(err){
                console.log(err);
                response.status(400).send(err);
            }

            //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
            response.status(200).json(result.rows);
            // console.log(result.fields.map(f => f.name));
        });

        // conn.release();
    });
}
  
const getUserSetting = (request, response) => {

    const sql = {
        text: "select search_gb,search_name,search_pol,search_pod,search_eta,search_etd,"+
              " notice_eta_yn,notice_eta_value,notice_etd_yn,notice_etd_value,"+
              " notice_det_yn,notice_det_value,notice_dem_yn,notice_dem_value,"+
        	  " notice_inspect_yn,notice_inspect_off_yn,notice_email_yn,notice_email_value,"+
        	  " notice_sms_yn,notice_sms_value from own_user_ui_setting where user_no = $1",
        values: [request.session.sUser.userno],
        rowMode: 'array',
    }

    pgsqlPool.connect(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.query(sql, function(err,result){
            done();
            if(err){
                console.log(err);
                response.status(400).send(err);
            }
            if(result != null) {
            	response.status(200).json(result.rows);
            } else {
            	response.status(200).json([]);
            }
            //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
            //response.status(200).json(result.rows);
            // console.log(result.fields.map(f => f.name));
        });

        // conn.release();
    });
}

const getCntrDetailList = (request, response) => {

    const sql = {
        text: "select to_char(to_timestamp(substr(move_time,1,8),'YYYYMMDDhh24mi'),'YYYY-MM-DD hh24:mi')||' / '||"+
              " vsl_name||' '||case when voyage_no is not null then '('||voyage_no||')' else voyage_no end,"+
              " loc_name,move_name from own_tracking_loc_new "+
              " where carrier_code = $1 "+
        	  "   and bl_bkg = $2 "+
        	  "   and cntr_no is not null and cntr_no = $3 "+
        	  "   order by loc_seq ",
        values: [request.body.carriercode, request.body.blno, request.body.cntrno],
        rowMode: 'array',
    }

    pgsqlPool.connect(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.query(sql, function(err,result){
            done();
            if(err){
                console.log(err);
                response.status(400).send(err);
            }
            if(result != null) {
            	response.status(200).json(result.rows);
            } else {
            	response.status(200).json([]);
            }
            //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
            //response.status(200).json(result.rows);
            // console.log(result.fields.map(f => f.name));
        });

        // conn.release();
    });
}



















const getCarrierInfo = (request, response) => {
    const params = request.body.nm;
    const sql = {
        text: " select id,line_code,nm_kor,nm from OWN_CODE_CUSHIP where 1=1 and nm_kor like '%"+params+"%' ",
        //values: [request.body.carriercode, request.body.blno, request.body.cntrno],
        rowMode: 'array',
    }
    console.log("query == ",sql);    
    pgsqlPool.connect(function(err,client,done) {
      if(err){
        console.log("err" + err);
        response.status(400).send(err);
      }
      client.query(sql, function(err,result){
        done();
        if(err){
          console.log(err);
          response.status(400).send(err);
        }
        response.status(200).send(result.rows);
      });
  
    });
}

const setUserSetting = (request, response) => {

    const sql = {
        text: "WITH UPSERT AS ("+
              " UPDATE OWN_USER_UI_SETTING SET "+
              "  SEARCH_GB=$1 , SEARCH_NAME= $2, SEARCH_POL=$3 , SEARCH_POD =$4, SEARCH_ETA=$5,"+
              "  SEARCH_ETD=$6, NOTICE_ETA_YN= $7, NOTICE_ETA_VALUE=$8, NOTICE_ETD_YN= $9 ,NOTICE_ETD_VALUE=$10, "+
        	  "  NOTICE_DET_YN=$11, NOTICE_DET_VALUE= $12, NOTICE_DEM_YN=$13, NOTICE_DEM_VALUE=$14, NOTICE_INSPECT_YN= $15, "+
        	  "  NOTICE_INSPECT_OFF_YN= $16, NOTICE_EMAIL_YN= $17 , NOTICE_EMAIL_VALUE=$18, NOTICE_SMS_YN= $19, NOTICE_SMS_VALUE= $20, "+
        	  "  INSERT_DATE= NOW() WHERE USER_NO=$21 AND  SERVICE_TYPE ='T' RETURNING*) "+
        	  " INSERT INTO OWN_USER_UI_SETTING (USER_NO,SERVICE_TYPE,SEARCH_GB,SEARCH_NAME,SEARCH_POL,  "+
        	  "     SEARCH_POD,SEARCH_ETA,SEARCH_ETD,NOTICE_ETA_YN,NOTICE_ETA_VALUE, "+
        	  "     NOTICE_ETD_YN,NOTICE_ETD_VALUE,NOTICE_DET_YN,NOTICE_DET_VALUE,NOTICE_DEM_YN, "+
        	  "     NOTICE_DEM_VALUE,NOTICE_INSPECT_YN,NOTICE_INSPECT_OFF_YN,NOTICE_EMAIL_YN,NOTICE_EMAIL_VALUE, "+
        	  "     NOTICE_SMS_YN,NOTICE_SMS_VALUE, INSERT_ID,INSERT_DATE) "+
        	  "          	    SELECT $21,'T',$1,$2,$3,"+  
        	  "         $4,$5,$6,$7,$8, "+
        	  "         $9,$10,$11,$12, "+
        	  "         $13,$14,$15,$16, "+
        	  "         $17,$18,$19,$20,$21,now() WHERE NOT EXISTS ( SELECT * FROM UPSERT)",
        values: [request.body.col0, request.body.col1, request.body.col2,request.body.col3,request.body.col4,
        		request.body.col5,request.body.col6,request.body.col7,request.body.col8,request.body.col9,
        		request.body.col10,request.body.col11,request.body.col12,request.body.col13,request.body.col14,
        		request.body.col15,request.body.col16,request.body.col17,request.body.col18,request.body.col19,request.session.sUser.userno
        		],
        rowMode: 'array',
    }
console.log(sql);
    pgsqlPool.connect(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.query(sql, function(err,result){
            done();
            if(err){
                console.log(err);
                response.status(400).send(err);
            }
            if(result != null) {
            	response.status(200).json(result.rows);
            } else {
            	response.status(200).json([]);
            }
            //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
            //response.status(200).json(result.rows);
            // console.log(result.fields.map(f => f.name));
        });

        // conn.release();
    });
}

const saveBlList = ( request, response ) => {
    // console.log( request.body );
    let dataRows = request.body.dataRows;
    let params = [];
    let multi_params = [];
    let count = 0;
    let error = null;
    
    let conditions = " INSERT INTO own_user_request(req_seq, user_no, carrier_code, bl_bkg, ie_type, cntr_no, mbl_no, bkg_no, start_date, insert_date, insert_user)";
    for( let i = 0; i < dataRows.length; i++ ){
        // $1 user_no
        let userNo = request.session.sUser.userno;
        // $2 carrier_code
        let ie_gubun = dataRows[i][0];
        // $3 bl_bkg
        let carrier_code = dataRows[i][1];
        let bl_no = "";
        let bk_no = "";
        
        // BL NO & BK NO 입력 확인
        if (( 'null' == dataRows[i][2] || '' == dataRows[i][2] || null == dataRows[i][2] ) ||( 'null' == dataRows[i][3] || '' == dataRows[i][3] || null == dataRows[i][3] )) {
            break;
        } else {
            bl_no = dataRows[i][2];
            bk_no = dataRows[i][3];
        }
        // $5 cntr_no 
        let cntr_no = dataRows[i][4];

        conditions += " select to_char( now(), 'yyyymmddhh24miss' )||lpad(cast( nextval('user_request_seq') as varchar),6,'0') req_seq, "
        conditions += " '" + userNo + "' user_no, " 
        conditions += " '" + carrier_code+  "' carrier_code, "
        conditions += " '" + bl_no + "' bl_bkg, " 
        conditions += " '" + ie_gubun + "' ie_type, "
        conditions += " '" + cntr_no + "' cntr_no, "
        conditions += " '" + bl_no + "' mbl_no, "
        //conditions += " null hbl_no, "
        conditions += " '" + bk_no + "' bkg_no, "
        //conditions += " 'Y' tracking_yn, "
        //conditions += " null tracking_remark, "
        //conditions += " 'Y' dem_det_yn, "
        //conditions += " null dem_det_remark, "
        //conditions += " 'N' book_mark, "
        //conditions += " null customs_line_code, "
        //conditions += " 'N' current_status, "
        //conditions += " null scrap_result, "
        //conditions += " null scrap_start_date, "
        //conditions += " null scrap_end_date, "
        //conditions += " null scrap_log, "
        //conditions += " null web_seq, "
        conditions += " to_char(now(),'YYYYMMDD') start_date, "
        //conditions += " 'N' to_oracle, "
        //conditions += " 'N' del_yn, "
        //conditions += " 'N' close_yn, "
        conditions += " now() insert_date, "
        conditions += " '" + userNo + "' insert_user "
        //conditions += " null update_date, "
        //conditions += " null update_user "
        // conditions += " where not exists (select 1 from own_user_request b ";
        // conditions += " where b.user_no = '"+userNo+"' and b.carrier_code = '"+carrier_code+"' and b.bl_bkg = '"+bl_no+"' and b.ie_type = '"+ie_gubun+"' ) ";
        if( i != (dataRows.length-1) ) {
            conditions += " union all ";
        }
    }
    let sql = {
        text: conditions,
        // values: multi_params,
    }
    console.log( sql );
    pgsqlPool.connect( (err,conn,done) =>{
        if(err){
            console.log("err" + err);
            // response.status(400).send(err);
        }

        conn.query(sql, function(err,result){
            done();
            // console.log( result.command );
            if(err){
                error = err;
                console.log(err);
                // console.log(error);
                response.status(200).send(err);
                // response.status(400).send(err);
            } else {
                count += 1;
                console.log(count)
                // if(null != error){
                // } else {
                //     console.log("COUNT "+ count)
                //     response.status(200).json(count+"건 처리되었습니다.");
                // }
                // if ( count == dataRows.length) {
                    response.status(200).json(count+"건 처리되었습니다.");
                // }
            }
        });
    });
    // }
    // console.log( "최종>>>", error);

    // console.log( "<><><><><><><>"+error )
}


const insertBlRequest = ( request, response ) => {
    let dataRows = request.body.dataRows;
    console.log('insertBlRequest' , request.body)
    const sql = {
        text: " INSERT INTO own_user_request (req_seq, user_no, carrier_code, bl_bkg, ie_type, cntr_no, mbl_no, hbl_no, bkg_no, tracking_yn, tracking_remark, dem_det_yn, dem_det_remark, book_mark, customs_line_code, current_status, scrap_result, scrap_start_date, scrap_end_date, scrap_log, web_seq, start_date, to_oracle, del_yn, close_yn, insert_date, insert_user, update_date, update_user)"
        +     " VALUES(to_char( now(), 'yyyymmddhh24miss' )||lpad(cast( nextval('user_request_seq') as varchar),6,'0'), upper($1), upper($2), upper($3), upper($4), upper($6), upper($3), '', upper($5), 'Y', '', 'Y', '', 'N', '', 'N', '', null, null, '', '', to_char(now(),'YYYYMMDD'), 'N', 'N', 'N', now(), upper($1), null, '') ",
        values: [request.session.sUser.userno, request.body.newData.carrier_code, request.body.newData.bl_no, request.body.newData.ie_type, request.body.newData.bkg_no, request.body.newData.cntr_no],
    }


    console.log('sql===',sql);

    pgsqlPool.connect(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.query(sql, function(err,result){
            done();
            if(err){
                console.log(err);
                response.status(400).send(err);
            }
            if(result != null) {
                
                response.status(200).json(result.rows);
            } else {
                response.status(200).json([]);
            }
        });
    });
}

const setUserBLUpdate = ( request, response ) => {
   
    const sql = {
        
        text: " UPDATE own_user_request set book_mark=$1 where req_seq=$2 and user_no=$3 and bl_bkg=$4",
        values: [request.body.bookmark,request.body.reqseq,request.session.sUser.userno, request.body.blbk],
    }
console.log(sql);
    pgsqlPool.connect(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.query(sql, function(err,result){
            done();
            if(err){
                console.log(err);
                response.status(400).send(err);
            }
            if(result != null) {
                
                response.status(200).json(result.rows);
            } else {
                response.status(200).json([]);
            }
        });
    });
}








module.exports = {
	getTrackingList,
	getMyBlList,
	getBookMark,
	getCntrList,
	getUserSetting,
	getCntrDetailList,
	getCarrierInfo,
	setUserSetting,
	updateMyBlNo,
    deleteMyBlNo,
    getPkMyBlList,
    saveBlList,
    insertBlRequest,
    setUserBLUpdate,
}