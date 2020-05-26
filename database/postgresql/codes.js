'use strict';

const pgsqlPool = require("../pool.js").pgsqlPool
const basicauth = require("basic-auth");


const getPortCode = (request, response) => {

	  const portCode=request.body.portCode+"%";
	console.log("입력Keyword:"+portCode);
       const sql = {
                    text: "select distinct PORT_CODE, PORT_NAME from own_code_port \n" +
                    	  " where (PORT_CODE LIKE upper($1)) \n"+
                          " and COALESCE(PORT_TYPE,' ') LIKE (CASE WHEN NATION_CODE = 'KR' THEN 'P' ELSE '%%' END) \n",
                    values: [portCode],
                    //rowMode: 'array',
                }
            
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
              //console.log(result);
              response.status(200).json(result.rows);
              // console.log(result.fields.map(f => f.name));
  
          });
  
          // conn.release();
      });
}

  const getPortCodeInfo = (request, response) => {
    const sql = {
        text: "select port_code,port_name from own_code_port order by port_code",
       // values: [request.session.sUser.userno],
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
            console.log(result);
            
            if(result != null) {
            	//console.log(result.rows[0]);
                response.status(200).json(result.rows);
            } else {
                response.status(200).json([]);
            }

        });

        // conn.release();
    });
}



const getCustomLineCode = (request, response) => {
                      
    let sql = 
        " select id, case when nm is not null then '['|| nm || ']' else '[ No Name ]' end as nm " +
        " from own_code_cuship " +
        " where line_code is not null "        
                                            


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


module.exports = {
        getPortCodeInfo,
        getCustomLineCode,
        getPortCode
}