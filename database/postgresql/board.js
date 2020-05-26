'use strict';

const pgsqlPool = require("../pool.js").pgsqlPool
const basicauth = require("basic-auth");

  const getBoardList = (request, response) => {
      //순번","제목", "작성자", "조회수", "작성일"
	    const sql = {
          text: "select board_id, title, author_name, hit_count, to_char(insert_date, 'YYYY-MM-DD hh24:mi') as insert_date "
          +" from own_board "
          +" order by board_id desc",
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

	    });
  }

  const getBoardDetail = (request, response) => {
        updateBoardHits(request, response);
        selectBoardDetail(request, response);
  }
  
  const selectBoardDetail = (request, response) => {
      const sql = {
        text: "select board_id, user_no, title, content, author_name, hit_count, to_char(insert_date, 'YYYY-MM-DD hh24:mi') as insert_date "
        +" from own_board "
        +" where board_id = $1",
        values: [request.body.board_id]
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
                  console.log(result.rows);
                  response.status(200).json(result.rows);
              } else {
                  response.status(200).json([]);
              }
          });

      });
    }

    
    const updateBoardHits = (request, response) => {
        const sql = {
            text: " update own_board  "
            +" set hit_count = hit_count+1" 
            +" where board_id = $1",
            values: [request.body.board_id],
        }
        console.log( sql )
        pgsqlPool.connect(function(err,conn,done) {
            if(err){
                console.log("err" + err);
                response.status(400).send(err);
            }

            conn.query(sql, function(err,result){
                done();
            });
        });
    }

    const saveBoard = (request, response) => {

        let sql = {};
        if(request.session.sUser == undefined){
            response.status(400).send("error");
        } else{
            if(request.body.board_id != null && request.body.board_id != undefined && request.body.board_id != ""){
                sql = {
                    text: " update own_board  "
                    +" set title = $1,"
                    +"     content = $2"
                    +" where board_id = $3",
                    values: [request.body.title,
                            request.body.content,
                            request.body.board_id],
                }
            } else{
                sql = {
                text: " insert into own_board  "
                +" (user_no, title, content, hit_count, author_name, insert_date) "
                +" values ( $1, $2, $3, 0, $4, now() )",
                values: [request.session.sUser.userno,
                        request.body.title,
                        request.body.content,
                        request.session.sUser.username],
                }
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
    }

    const deleteBoard = (request, response) => {
	    const sql = {
          text: " delete from own_board  "
          +" where board_id = $1",
          values: [request.body.board_id],
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

    const getBoardDataList = (request, response) => { //regexp_replace(content, '\n', '<br/>', 'g') as content
        //순번","제목", "작성자", "조회수", "작성일"
          var sql = "select * from (SELECT count(*) over()/10+1 as tot_page,floor(((row_number() over()) -1) /10 +1) as curpage, \n"
            + "board_id, title, content, author_name, hit_count, to_char(insert_date, 'YYYY-MM-DD hh24:mi') as insert_date \n"
            +" from (select * from own_board where 1=1" ;

            if(request.body.boardId !="" && request.body.boardId != undefined) {
                sql +=" and board_id = '"+request.body.boardId+"' \n";
            }
            if(request.body.title != "" && request.body.title != undefined) {
                sql +=" and title like '%"+request.body.title+"%' \n";
            }
            if(request.body.authorName !="" && request.body.authorName != undefined) {
                sql +=" and author_name = '"+request.body.authorName+"' \n";
            }
            sql += "order by board_id desc) b ) a \n"
                  +" where curpage ='"+request.body.num+"' \n";
              // rowMode: 'array',
          
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
                      for(var i = 0; i < result.rows.length; i++){
                          result.rows[i]['content'] = result.rows[i]['content'].split('\n');
                      }
                      console.log(result.rows[0]['content']);
                      response.status(200).json(result.rows);
                  } else {
                      response.status(200).json([]);
                  }
              });
  
          });
    }

module.exports = {
    getBoardList,
    getBoardDetail,
    saveBoard,
    deleteBoard,
    getBoardDataList
}