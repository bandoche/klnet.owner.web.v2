'use strict';

const pgsqlPool = require("../pool.js").pgsqlPool
const basicauth = require("basic-auth");
const sUser = require('../../models/sessionUser');

const getDemDetList = (request, response) => {
	request.session.sUser = sUser;
    console.log( request.body );
    let sql_string = "";
    let params = [];

    sql_string = "select * from ("+
        "select x.*, floor(((row_number() over()) -1) / 10 + 1) as curpage from ( "+
        "select  "+
        "  a.carrier_code as line_code, a.ie_type, a.bl_bkg, a.cntr_no, b.type_size "+
        ", a.mbl_no, a.hbl_no, b.bkg_no, b.vsl_code, b.vsl_name, b.voyage, b.ter_ref_no, b.pol, b.pod "+
        ", to_char(to_date(b.eta,'YYYYMMDD'), 'YYYY-MM-DD') as eta, eta_time "+
        ", to_char(to_date(b.etd,'YYYYMMDD'), 'YYYY-MM-DD') as etd, etd_time "+
        ", to_char(to_timestamp(b.ata||b.ata_time,'YYYYMMDDHH24MI'),'YYYY-MM-DD HH24:MI') as ata, b.ata_time "+
        ", to_char(to_date(b.atd,'YYYYMMDD'), 'YYYY-MM-DD') as atd, b.atd_time "+
        ", to_char(to_timestamp(b.unload_date,'YYYYMMDDHH24MI'), 'YYYY-MM-DD') as unloading_date "+
        ", to_char(to_timestamp(b.load_date,'YYYYMMDDHH24MI'), 'YYYY-MM-DD') as loading_date "+
        ", to_char(to_timestamp(b.full_outgate_date,'YYYYMMDDHH24MI'), 'YYYY-MM-DD') as full_outgate_date "+
        ", to_char(to_timestamp(b.full_ingate_date,'YYYYMMDDHH24MI'), 'YYYY-MM-DD') as full_ingate_date "+
        ", to_char(to_timestamp(b.mt_outgate_date,'YYYYMMDDHH24MI'), 'YYYY-MM-DD') as mt_outgate_date "+
        ", to_char(to_timestamp(b.mt_ingate_date,'YYYYMMDDHH24MI'), 'YYYY-MM-DD') as mt_ingate_date "+
        ", b.ret_date, b.dem_date, b.osc_date "+
        ", trim(to_char(b.dem_amount,'999,999,999,999')) as dem_amount "+
        ", trim(to_char(b.dem_vat,'999,999,999,999')) as dem_vat "+
        ", b.dem_unit "+
        ", trim(to_char(b.det_amount,'999,999,999,999')) as det_amount "+
        ", trim(to_char(b.det_vat,'999,999,999,999')) as det_vat "+
        ", b.det_unit "+
        ", trim(to_char(b.combin_amount,'999,999,999,999')) as combin_amount "+
        ", trim(to_char(b.combin_vat,'999,999,999,999')) as combin_vat "+
        ", b.combin_unit  "+
        ", trim(to_char(b.osc_amount,'999,999,999,999')) as osc_amount "+
        ", trim(to_char(b.osc_vat,'999,999,999,999')) as osc_vat "+
        ", b.osc_unit "+
        ", a.tracking_remark, a.tracking_yn, a.dem_det_remark, a.dem_det_yn "+
        ", b.dem_tariff, b.det_tariff, b.osc_tariff "+
        ", c.line_code as img_line_code, c.image_yn "+
        "from own_user_request a "+
        " left outer join own_dem_det b "+
        "   on a.req_seq = b.req_seq  "+
        "  and a.dem_det_yn = 'Y' " +
        " left outer join own_code_cuship c on "+
		"  	a.carrier_code = c.id ";

        sql_string += "where a.user_no = $1 ";

        if( '' != request.body.lineCode) {
            sql_string += " and a.carrier_code = '"+ request.body.lineCode +"' ";
        }

        if( '' != request.body.mblNo) {
            sql_string += " and a.mbl_no = '"+ request.body.mblNo +"' ";
        }

        if( '' != request.body.cntrNo) {
            sql_string += " and a.cntr_no = '"+ request.body.cntrNo +"' ";
        }        

        
        
        //console.log("> request.session.sUser.userno :"+request.session.sUser.userno );
        sql_string += "order by cast(b.dem_amount as float), cast(b.det_amount as float), cast(b.osc_amount as float), a.carrier_code, a.insert_date desc ";
        sql_string += ") X "
        sql_string += ") Z where Z.curpage = $2 "

        params.push( request.session.sUser.userno );
        params.push( request.body.num );

    const sql = {
        text: sql_string,
        values: params,
    }

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
            //response.status(200).json(result.rows);
            // console.log(result.fields.map(f => f.name));
            
            if(result != null) {
            	response.status(200).json(result.rows);
            } else {
            	response.status(200).json([]);
            }

        });

        // conn.release();
    });
}

const getTarrifList = (request, response) => { 
    //console.log(">> request.body :"+request.body);
    const sql = {
        text: "select bound, cntr_type, cntr_size, date1, date2, "+
              "       case when m_gubun = '1' then 'KRW' "+
              "            when m_gubun = '2' then 'USD' end m_gubun "+
              ", trim(to_char(cast(charge as float),'999,999,999,999'))  as charge "+
              ", to_char(to_date(begin_date,'YYYYMMDD'), 'YYYY-MM-DD') as begin_date "+
              ", to_char(to_date(expire_date,'YYYYMMDD'), 'YYYY-MM-DD') as expire_date "+
              "from mfedi_tcs_do_charge  "+
              "where line_code is not null  "+
              "and line_code = $1 "+
              "and dem_det_type = '1' "+  
            //   "and cntr_type = $2 "+
            //   "and cntr_size = $3 "+
              "order by line_code, bound, dem_det_type, cntr_type, cntr_size, date1, date2, begin_date, expire_date ",
              //values: [request.body.lineCode, request.body.cntrType, request.body.cntrSize],
              values: [request.body.lineCode],
        rowMode: 'array',
    }

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
            response.status(200).json(result.rows);
            // console.log(result.fields.map(f => f.name));

        });

        // conn.release();
    });
}
  
module.exports = {
    getDemDetList,
    getTarrifList,
}