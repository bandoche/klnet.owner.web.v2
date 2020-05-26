'use strict';

//const oraclePool = require("../pool.js").oraclePool
const pgsqlPool = require("../pool.js").pgsqlPool
// const oracledb = require('oracledb');


const getCarrierInfo = (request, response) => {
    console.log(">>>>>> CARRIER INFO log");
/* 	const sql = "SELECT A.line_code ,'['||A.LINE_CODE||'] '||B.CNAME_KR AS line_name "
        +" FROM TCS_ESHIP_CONFIG A,TCS_COMP_HEADER_TBL B"
	      +" WHERE A.KLNET_ID = B.KLNET_ID(+)"
        +" ORDER BY A.LINE_CODE ASC"; */
 	const sql = "select distinct line_code, '[' || line_code || '] ' || nm_kor as line_name  "
        +" from own_code_cuship where line_code is not null and nm_kor is not null order by line_code";

        console.log ("query:" +sql);

        pgsqlPool.connect(function(err,conn,done) {
            if(err){
                console.log("err" + err);
                response.status(400).send(err);
            }
            console.log("sql : " + sql.text);
            conn.query(sql, function(err,result){
                done();
                if(err){
                    console.log(err);
                    response.status(400).send(err);
                }
    
                //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
                console.log(result);
                response.status(200).json(result.rows);
                // console.log(result.fields.map(f => f.name));
    
            });
    
            // conn.release();
        });
}

const getScheduleList = (request, response) => {
	console.log(">>>>>> FCL_SCHEDULE_HEADER log");
	console.log (">>PARAM1:"+request.body.carrierCode);
	console.log (">>PARAM2:"+request.body.startPort);
	console.log (">>PARAM3:"+request.body.endPort);
	console.log (">>PARAM4:"+request.body.startDate);
	console.log (">>PARAM5:"+request.body.endDate);
	console.log (">>PARAM6:"+request.body.vesselName);
	
/*     let sql = "select a.line_code,a.vsl_name,a.voyage_no,a.svc,to_char(to_date(a.etd,'YYYYMMDD'),'YYYY-MM-DD') as start_day,a.port_code as start_port, \n "
    + "to_char(to_date(b.eta,'YYYYMMDD'),'YYYY-MM-DD') as end_day,b.port_code as end_port \n"
    + "from own_vsl_Sch_20200408 a, own_vsl_sch_20200408 b \n"
    + "where a.line_code = b.line_code and a.voyage_no = b.voyage_no and a.vsl_name = b.vsl_name and a.svc = b.svc and a.port_code = '"+request.body.startPort+"' \n"
    + "and b.port_code = '"+request.body.endPort+"' and a.etd between '"+request.body.startDate+"' and '"+request.body.endDate+"' and a.etd <= b.eta \n"
    if(request.body.carrierCode != "") {
        sql= sql + "AND a.line_code ='"+request.body.carrierCode+"' \n";	
    }
    if(request.body.vesselName != "") {
        sql = sql + "AND a.vsl_name LIKE '%"+request.body.vesselName+"%' \n";	
    }
    sql = sql + "order by a.etd, a.line_Code, a.vsl_name, a.voyage_no, svc, b.eta" */

    let sql = "select case when length(line_code) = 4 then (select line_code from own_code_cuship cus where id = sch.line_code limit 1) else line_code end, line_code as org_line_code, vsl_name,voyage_no,to_char(to_date(start_date,'YYYYMMDD'),'YYYY-MM-DD') as start_day, start_port_code as start_port, coalesce(start_port_name,start_port_code) as start_port_name, \n "
    + "to_char(to_date(end_date,'YYYYMMDD'),'YYYY-MM-DD') as end_day, end_port_code as end_port, coalesce(end_port_name,end_port_code) as end_port_name, '[' || line_code || '] ' || vsl_name as title, to_date(start_date,'YYYYMMDD') as start, to_date(start_date,'YYYYMMDD') as end, \n"
    + "'true' as \"allDay\", (select image_yn from own_code_cuship cus where line_code = sch.line_code limit 1) as image_yn, (select url from own_code_cuship where line_code = sch.line_code limit 1) as line_url, coalesce((select nm_kor from own_code_cuship where line_code = sch.line_code limit 1),sch.line_code ) as line_nm, \n" 
    + "case when to_date(end_date,'yyyymmdd') - to_date(start_date,'yyyymmdd') in ('0','1') then to_date(end_date,'yyyymmdd') - to_date(start_date,'yyyymmdd') || ' Day' else to_date(end_date,'yyyymmdd') - to_date(start_date,'yyyymmdd') || ' Days' end as tt, \n" 
    + "(select ts from own_code_ts where line_code = sch.line_code and start_port_code = sch.start_port_code and end_port_code = sch.end_port_code) as ts from own_vsl_sch sch \n"
    + "where (length(start_date) = 8 and length(end_date) = 8) and start_port_code = '"+request.body.startPort+"' and end_port_code = '"+request.body.endPort+"'  \n"
    //+ "and start_date >= '"+request.body.startDate+"' and start_date <= '"+request.body.endDate+"' \n"
    if(request.body.tapNum == "1") {
        sql = sql + "and start_date like substring('"+request.body.startDate+"',1,6) || '%' \n"
    } else {
        sql = sql + "and start_date >= '"+request.body.startDate+"' and start_date <= to_char('"+request.body.startDate+"'::date + interval '"+request.body.eWeek+"','yyyymmdd') \n"
    }
    if(request.body.carrierCode != "") {
        //sql= sql + "and line_code ='"+request.body.carrierCode+"' \n";	
        sql= sql + "and line_code in ("+request.body.carrierCode+") \n";	
    }
    if(request.body.vesselName != "") {
        sql = sql + "and vsl_name LIKE '%"+request.body.vesselName+"%' \n";	
    }
    sql = sql + "group by line_Code, vsl_name, voyage_no, start_port_code, end_port_code, start_date, end_date, start_port_name, end_port_name \n"
    sql = sql + "order by start_date, line_Code, vsl_name, voyage_no, end_date"
            
            console.log ("query:" +sql);

            pgsqlPool.connect(function(err,conn,done) {
                if(err){
                    console.log("err" + err);
                    response.status(400).send(err);
                }
                console.log("sql : " + sql.text);
                conn.query(sql, function(err,result){
                    done();
                    if(err){
                        console.log(err);
                        response.status(400).send(err);
                    }
        
                    //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
                    console.log(result);
                    response.status(200).json(result.rows);
                    // console.log(result.fields.map(f => f.name));
        
                });
        
                // conn.release();
            });
}


const getScheduleDetailList = (request, response) => {
	console.log(">>>>>> FCL_SCHEDULE_DETAIL log");
	console.log (">>PARAM1:"+request.body.carrierCode);
	console.log (">>PARAM2:"+request.body.vesselName);
	console.log (">>PARAM3:"+request.body.voyage);
	console.log (">>PARAM4:"+request.body.startDate);
	console.log (">>PARAM5:"+request.body.endDate);
	console.log (">>PARAM6:"+request.body.svc);
	
//    let sql = "select line_Code,voyage_no,vsl_name,svc,eta,etd,port_code from own_vsl_Sch where line_code = '"+request.body.carrierCode+"' \n"
//    + "and vsl_name = '"+request.body.vesselName+"' and voyage_no = '"+request.body.voyage+"' \n"
//    + "and etd >= replace('"+request.body.startDate+"','-','') and eta <= replace('"+request.body.endDate+"','-','') \n"
//    + "order by etd "

/*     const sql = {
        text: "select to_char(to_date(eta,'YYYYMMDD'),'YYYY-MM-DD'),to_char(to_date(etd,'YYYYMMDD'),'YYYY-MM-DD'),port_code from own_vsl_Sch_20200408 where line_code = $1 \n "
        + "and vsl_name = $2 and voyage_no = $3 \n"
        + "and etd >= replace($4,'-','') and eta <= replace($5,'-','') and svc = $6 \n"
        + "order by eta,etd ",
        values: [request.body.carrierCode,request.body.vesselName,request.body.voyage,request.body.startDate,request.body.endDate,request.body.svc],
        rowMode: 'array',
    } */

/*     const sql = {
        text: "select act_vsl_name, act_voyage_no, port_date, port_code port from ( \n"
        + "(select act_vsl_name, act_voyage_no, to_char(to_date(start_date,'YYYYMMDD'),'YYYY-MM-DD') port_date, pol port_code \n"
        + "from own_vsl_sch where line_code = $1 and vsl_name = $2 and voyage_no = $3 \n"
        + "and start_port_code = $4 and end_port_code = $5 group by start_date, pol, act_vsl_name, act_voyage_no ) \n"
        + "union all \n"
        + "(select act_vsl_name, act_voyage_no, to_char(to_date(end_date,'YYYYMMDD'),'YYYY-MM-DD') port_date, pod port_code \n "
        + "from own_vsl_sch where line_code = $1 and vsl_name = $2 and voyage_no = $3 \n"
        + "and start_port_code = $4 and end_port_code = $5 \n"
        + "order by end_date, end_port_code) ) a",
        values: [request.body.carrierCode,request.body.vesselName,request.body.voyage,request.body.startPort,request.body.endPort],
        rowMode: 'array',
    } */

    const sql = {
        text: "select act_vsl_name, act_voyage_no, pol || pol_date, pod || pod_date from (select distinct act_vsl_name, act_voyage_no, pol, ' (' || to_char(to_date(coalesce(pol_date,start_date),'YYYYMMDD'),'YYYY-MM-DD') || ')' pol_date, \n"
        + "pod, ' (' || to_char(to_date(coalesce(pod_date,end_date),'YYYYMMDD'),'YYYY-MM-DD') || ')' pod_date, end_port_code, start_port_code \n "
        + "from own_vsl_sch where line_code = $1 and vsl_name = $2 and voyage_no = $3 \n"
        + "and start_port_code = $4 and end_port_code = $5 \n"
        + "order by pol_date, pod_date, end_port_code, start_port_code) a",
        values: [request.body.carrierCode,request.body.vesselName,request.body.voyage,request.body.startPort,request.body.endPort],
        rowMode: 'array',
    }
            
            console.log ("query:" +sql);

            pgsqlPool.connect(function(err,conn,done) {
                if(err){
                    console.log("err" + err);
                    response.status(400).send(err);
                }
                console.log("sql : " + sql.text);
                conn.query(sql, function(err,result){
                    done();
                    if(err){
                        console.log(err);
                        response.status(400).send(err);
                    }
        
                    //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
                    console.log(result);
                    response.status(200).json(result.rows);
                    // console.log(result.fields.map(f => f.name));
        
                });
        
                // conn.release();
            });
}

const getPortCodeInfo = (request, response) => {
	  let sql = "";
	  const portCode=request.body.portCode.substr(0,3);
	console.log("입력Keyword:"+portCode);

/* 	    sql = "SELECT P.PORT_CODE,P.PORT_NAME FROM MFEDI.CODE_PORT P"
		      +",MFEDI. TCS_CODE_PORT A "
		      +" WHERE P.PORT_CODE = A.ISO_PORT"
		      +" AND (P.PORT_CODE LIKE upper('%"+portCode+"%') or P.PORT_NAME LIKE upper('%"+portCode+"%'))"
		      +" AND NVL(P.PORT_TYPE,' ') LIKE (CASE WHEN P.NATION_CODE = 'KR' THEN 'P' ELSE '%%' END)"
		      +" AND P.PORT_NAME IS NOT NULL"
		      +" AND A.LINE_CODE IN ( SELECT LINE_CODE FROM MFEDI.TCS_ESHIP_CONFIG)"
              +" GROUP BY P.PORT_CODE,P.PORT_NAME"; */
              
              sql = "select distinct PORT_CODE, PORT_NAME from own_code_port "
		      +"where (PORT_CODE LIKE upper('%"+portCode+"%') or PORT_NAME LIKE upper('%"+portCode+"%')) "
		      +" and COALESCE(PORT_TYPE,' ') LIKE (CASE WHEN NATION_CODE = 'KR' THEN 'P' ELSE '%%' END) "
		      +" AND PORT_NAME IS NOT NULL ";
	    
	    console.log("쿼리:"+sql);

        pgsqlPool.connect(function(err,conn,done) {
            if(err){
                console.log("err" + err);
                response.status(400).send(err);
            }
            console.log("sql : " + sql.text);
            conn.query(sql, function(err,result){
                done();
                if(err){
                    console.log(err);
                    response.status(400).send(err);
                }
    
                //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
                console.log(result);
                response.status(200).json(result.rows);
                // console.log(result.fields.map(f => f.name));
    
            });
    
            // conn.release();
        });
}

const getLinePicInfo = (request, response) => {
	console.log(">>>>>> getLinePicInfo log");
	console.log (">>PARAM1:"+request.body.carrierCode);
	
    const sql = {
        text: "select pic_position, pic_name, pic_tel \n"
        + "from own_code_pic where line_code = $1 order by pic_position, pic_name ",
        values: [request.body.carrierCode],
        rowMode: 'array',
    }
            
            console.log ("query:" +sql);

            pgsqlPool.connect(function(err,conn,done) {
                if(err){
                    console.log("err" + err);
                    response.status(400).send(err);
                }
                console.log("sql : " + sql.text);
                conn.query(sql, function(err,result){
                    done();
                    if(err){
                        console.log(err);
                        response.status(400).send(err);
                    }
        
                    //response.status(200).send({'record':result.rows, 'field':result.fields.map(f => f.name)});
                    console.log(result);
                    response.status(200).json(result.rows);
                    // console.log(result.fields.map(f => f.name));
        
                });
        
                // conn.release();
            });
}


const getScheduleSample = (request, response) => {

	 let sqlText ="";
		 sqlText += " select * from (SELECT count(*) over()/10+1 as tot_page,floor(((row_number() over()) -1) /10 +1) as curpage, \n";
		 sqlText +=" line_code, vsl_name, voyage, start_route_date, start_route_code, end_route_date, \n";
		 sqlText +=" end_route_code, start_route_name, end_route_name, eta, eta_time, etd, etd_time, ts_yn, \n";
		 sqlText +=" insert_date, insert_user, update_date, update_user, svc \n";
		 sqlText +=" FROM own_vsl_sch_route_list \n";
		 if(request.body.carriercode !="" || request.body.pol !="" || request.body.pod != "") {
             sqlText +="  where \n";
         } 
         if(request.body.carriercode !="" && request.body.pol =="" && request.body.pol =="") {
             sqlText +="  upper(line_code) = upper('"+request.body.carriercode+"') \n";
         }
      
		 if(request.body.carriercode !="" && request.body.pol !="") {
             sqlText +="  and upper(start_route_code) = upper('"+ request.body.pol+"') \n";
		 } else if(request.body.carriercode =="" && request.body.pol !=""){
			 sqlText +="  upper(start_route_code) = upper('"+ request.body.pol+"') \n";
		 }
		if(request.body.carriercode !="" && request.body.pod != "") {
             sqlText +="  and upper(end_route_code) = upper('"+request.body.pod+"') \n";
		 } else if(request.body.carriercode =="" && request.body.pod !=""){
			 sqlText +="  upper(end_route_code) = upper('"+request.body.pod+"') \n";
		 }
		sqlText +=")a where curpage ='"+request.body.num+"' \n";


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
            if(result != null) {
            	response.status(200).json(result.rows);
            } else {
            	response.status(200).json([]);
            }

        });

        // conn.release();
    });
}

const getSchedulePortCodeList = (request, response) => {
    var sql = "select row_number() over (order by line_code) as num, line_code, port_name, iso_port_code"
               +" from own_vsl_sch_iso_port_code"
               +" where 1 = 1";
    
    if(request.body.data != '' && request.body.data != undefined){
        if(request.body.data.line_code != '' && request.body.data.line_code != undefined){
            sql += " and line_code = '" + request.body.data.line_code + "' ";
        }
        if(request.body.data.port_name != '' && request.body.data.port_name != undefined){
            sql += " and port_name = '" + request.body.data.port_name + "' ";
        }
    }

    console.log( sql );

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

const insertSchPortCode = ( request, response ) => {
    let dataRows = request.body.dataRows;
    console.log('insertSchPortCode' , request.body)
    const sql = {
        text: " INSERT INTO own_vsl_sch_iso_port_code (line_code, port_name, iso_port_code)"
        +     " VALUES($1, $2, $3) ",
        values: [request.body.newData.line_code, request.body.newData.port_name, request.body.newData.iso_port_code],
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

const updateSchPortCode = (request, response) => {
    console.log(request.body);
    const sql = {
        text: " update own_vsl_sch_iso_port_code "
        +" set line_code = $1 "
        +" ,port_name = $2 "
        +" ,iso_port_code = $3 "
        +" where line_code = $4 "
        +" and port_name =$5 "
        +" and iso_port_code = $6 ",
        values: [request.body.newData.line_code,
                request.body.newData.port_name,
                request.body.newData.iso_port_code,
                request.body.oldData.line_code,
                request.body.oldData.port_name,
                request.body.oldData.iso_port_code
            ],
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
    });
}

const deleteSchPortCode = (request, response) => {
    const sql = {
        text: " delete from own_vsl_sch_iso_port_code "
        +" where line_code = $1 "
        +" and port_name =$2 "
        +" and iso_port_code = $3 ",
        values: [request.body.oldData.line_code
            ,request.body.oldData.port_name
            ,request.body.oldData.iso_port_code],
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
    });
}

module.exports = {
	    getCarrierInfo,
	    getScheduleList,
	    getPortCodeInfo,
	    getScheduleDetailList,
	    getScheduleSample,
        getSchedulePortCodeList,
        insertSchPortCode,
        updateSchPortCode,
        deleteSchPortCode,
        getLinePicInfo
	}