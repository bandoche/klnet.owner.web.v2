'use strict';

const oraclePool = require("../pool.js").oraclePool
// const oracledb = require('oracledb');

const getTestSimple = (request, response) => {
    response.send([    
        {
            'id': 1,
            'image': 'https://placeimg.com/64/64/1',
            'name': '홍길동',
            'birthday': '961222',
            'gender': '남자',
            'job': '대학생'
        },
        {
            'id': 2,
            'image': 'https://placeimg.com/64/64/2',
            'name': '나동빈',
            'birthday': '960508',
            'gender': '남자',
            'job': '프로그래머'
        },
        {
            'id': 3,
            'image': 'https://placeimg.com/64/64/3',
            'name': '이순신',
            'birthday': '961127',
            'gender': '남자',
            'job': '디자이너'
        }
    ]);
}



const getTestQuerySample = (request, response) => {
    const sql = "SELECT sysdate, sysdate FROM dual";
    oraclePool.getConnection(function (err, conn) {
        conn.execute(sql, (error, results) => {
            if (error) {
            response.status(400).json({ "error": error.message });
            return;
            }
            // response.send(results);
            response.send(results.rows);
        });  
    });

}


const getTestQueryParamSample = (request, response) => {
    const sql = "SELECT * FROM NCS_EXP_MRN where dpt_date = :1 and dpt_date = :2 "

    oraclePool.getConnection(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.execute(sql, ['20111218', '20111218'], (error, results) => {
            if (error) {
                response.status(400).json({ "error": error.message });
                return;
            }

            // console.log(results.json);
            // console.log(results);
            // response.send(results.rows);
            response.status(200).json(results.rows);
        });  

        // conn.release();
    });
}


const getTestQueryAttibuteSample = (request, response) => {
	console.log(">>>>>>>>>>>>");
    const sql = "SELECT * FROM NCS_EXP_MRN where dpt_date = :1 and dpt_date = :2 "
    console.log(request.body)

    oraclePool.getConnection(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.execute(sql, {outFormat:oraclePool.OBJECT}, (error, results) => {
            if (error) {
                response.status(400).json({ "error": error.message });
                return;
            }

            // console.log(results.json);
            // console.log(results);
            // response.send(results.rows);
            
            response.status(200).json(results.rows);
            // console.log(results.fields);

            // console.log(results.rows.length);
        });  

        // conn.release();
    });
}

const getImpFlowSample = (request, response) => {

    let sql = "SELECT SEQ,CNTR_NO,UNLOAD_DATE_TIME,UNLOAD_VESSEL_CODE,UNLOAD_TERMINAL_REF_NO," +
    		"UNLOAD_TERMINAL,UNLOAD_CARRIER_CODE,UNLOAD_SEAL_NO,UNLOAD_BL_NO,UNLOAD_BOOKING_NO," +
    		"UNLOAD_FULL_EMPTY,UNLOAD_VESSEL_NAME,UNLOAD_CARRIER_REF_NO,UNLOAD_POL,UNLOAD_POD," +
    		"OUT_DATE_TIME,OUT_TERMINAL,OUT_FULL_EMPTY,OUT_BL_NO,OUT_CARRIER_CODE,OUT_SEAL_NO," +
    		"OUT_CAR_NO,IN_DATE_TIME,IN_TERMINAL,IN_FULL_EMPTY,IN_BL_NO,IN_CARRIER_CODE,IN_SEAL_NO," +
    		"IN_CAR_NO,MFCS_MRN,MFCS_ARV_DATE,MFCS_LINE_CODE,MFCS_BL_NO,MFCS_SEAL_NO,MFCS_POD,MFCS_POL," +
    		"DISCHARGE_TERMINAL,UNLOAD_COARRI_THIS_IPM,OUT_CODECO_THIS_IPM,OUT_CODECO_KEY_ID," +
    		"IN_CODECO_THIS_IPM,IN_CODECO_KEY_ID,REG_DATE,UPDATE_DATE,CLOSE_DATE,CARRIER_CODE," +
    		"BL_NO,TYPE_SIZE,POD,POL,DELIVERY_ORDER_NO FROM mfedi.tcs_flow_import_tracking ";
	if(request.body.cntrNo !="") {
		sql +=  "where cntr_no='"+request.body.cntrNo+"'";
	}
console.log(">>>>",sql);
    oraclePool.getConnection(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.execute(sql, (error, results) => {
            if (error) {
                response.status(400).json({ "error": error.message });
                return;
            }

            response.status(200).json(results.rows);

        }); 
    });
}

const getExpFlowSample = (request, response) => {
	let sql= "";
	sql += "SELECT SEQ,CNTR_NO,OUT_DATE_TIME,OUT_TERMINAL,OUT_FULL_EMPTY,OUT_BKG_NO,OUT_BL_NO,OUT_CARRIER_CODE,OUT_SEAL_NO,OUT_CAR_NO,PRE_IN_DATE_TIME,PRE_IN_TERMINAL,PRE_IN_FULL_EMPTY,PRE_IN_BKG_NO,PRE_IN_BL_NO,PRE_IN_CARRIER_CODE,PRE_IN_SEAL_NO,PRE_IN_CAR_NO,POL,POL_IN_DATE_TIME,POL_IN_TERMINAL,POL_IN_FULL_EMPTY,POL_IN_BKG_NO,POL_IN_BL_NO ,POL_IN_CARRIER_CODE,POL_IN_SEAL_NO,POL_IN_CAR_NO,IN_DATE_TIME,IN_TERMINAL,IN_FULL_EMPTY,IN_BKG_NO,IN_BL_NO,IN_CARRIER_CODE,IN_SEAL_NO,IN_CAR_NO,RETURN_DATE,LOAD_DATE_TIME,LOAD_VESSEL_CODE,LOAD_TERMINAL_REF_NO,LOAD_TERMINAL,LOAD_CARRIER_CODE,LOAD_SEAL_NO,LOAD_BL_NO,LOAD_BOOKING_NO,LOAD_FULL_EMPTY,MFCS_MRN,MFCS_DPT_DATE,MFCS_LINE_CODE,MFCS_BL_NO,MFCS_SEAL_NO,CLL_SEQ,CLL_CARRIER_CODE,CLL_SOC,CLL_BL_NO,CLL_SEAL_NO,OUT_SCH_ETA,OUT_SCH_ETD,OUT_SCH_LINE_CODE,OUT_SCH_TERMINAL,OUT_SCH_VESSEL_CODE,OUT_SCH_TERMINAL_REF_NO,OUT_SCH_ROUTE_CODE,OUT_SCH_ETB,OUT_SCH_LINE_VSL,OUT_SCH_VOYAGE_NO,OUT_BKG_SHIPPER_ID,OUT_BKG_SHIPPER_NAME,IN_SCH_ETA,IN_SCH_ETD,IN_SCH_LINE_CODE,IN_SCH_TERMINAL,IN_SCH_VESSEL_CODE,IN_SCH_TERMINAL_REF_NO,IN_SCH_ROUTE_CODE,IN_SCH_ETB,IN_SCH_LINE_VSL,IN_SCH_VOYAGE_NO,IN_BKG_SHIPPER_ID,IN_BKG_SHIPPER_NAME,CLL_SCH_ETA,CLL_SCH_ETD,CLL_SCH_LINE_CODE,CLL_SCH_TERMINAL,CLL_SCH_VESSEL_CODE,CLL_SCH_TERMINAL_REF_NO,CLL_SCH_ROUTE_CODE,CLL_SCH_ETB,CLL_SCH_LINE_VSL,CLL_SCH_VOYAGE_NO,LOAD_SCH_ETA,LOAD_SCH_ETD,LOAD_SCH_LINE_CODE,LOAD_SCH_TERMINAL,LOAD_SCH_VESSEL_CODE,LOAD_SCH_TERMINAL_REF_NO,LOAD_SCH_ROUTE_CODE,LOAD_SCH_ETB,LOAD_SCH_LINE_VSL,LOAD_SCH_VOYAGE_NO,CHANGE_VESSEL_CODE,CHANGE_TERMINAL_REF_NO,CHANGE_LINE_VSL,CHANGE_VOYAGE_NO,CHANGE_ROUTE,CHANGE_TERMINAL,CHANGE_ETA,CHANGE_ETB,CHANGE_ETD,CHANGE_POL,OUT_CODECO_THIS_IPM,OUT_CODECO_KEY_ID,PRE_IN_CODECO_THIS_IPM,PRE_IN_CODECO_KEY_ID,POL_IN_CODECO_THIS_IPM,POL_IN_CODECO_KEY_ID,IN_CODECO_THIS_IPM,IN_CODECO_KEY_ID,LOAD_COARRI_THIS_IPM,OUT_BKG_SID,IN_BKG_SID ,OUT_SCH_VOYAGE_SID ,IN_SCH_VOYAGE_SID ,CLL_SCH_VOYAGE_SID,LOAD_SCH_VOYAGE_SID,REG_DATE,UPDATE_DATE,CLOSE_DATE, CARRIER_CODE,BL_NO,TYPE_SIZE FROM mfedi.tcs_flow_export_tracking \n";
	if(request.body.cntrNo !="") {
		sql +=  "where cntr_no='"+request.body.cntrNo+"'";
	}

	console.log(sql);
    oraclePool.getConnection(function(err,conn,done) {
        if(err){
            console.log("err" + err);
            response.status(400).send(err);
        }

        conn.execute(sql, (error, results) => {
            if (error) {
                response.status(400).json({ "error": error.message });
                return;
            }

            response.status(200).json(results.rows);
        });  

    });
}


module.exports = {
	    getTestSimple,
	    getTestQuerySample,
	    getTestQueryParamSample,
	    getTestQueryAttibuteSample,
	    getImpFlowSample,
	    getExpFlowSample
	}