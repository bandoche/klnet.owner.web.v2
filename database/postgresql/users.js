'use strict';

const pgsqlPool = require("../pool.js").pgsqlPool
const basicauth = require("basic-auth");

const getUserInfo = (request, response) => {
    const sql = {
        text: "select  case when user_type='S' then '선사'"+
        	"               when user_type='F' then '포워더'"+
        	"               when user_type='O' then '화주'"+
        	"               when user_type='A' then '관리자'"+
        	"               else user_type end, "+
        	" user_email,user_name,user_company," +
        	" user_phone,social_link_yn,social_name,local_login_date from own_comp_user where user_no = $1",
        values: [request.session.sUser.userno],
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
            console.log(result);
            
            if(result != null) {
            	console.log(result.rows[0]);
                response.status(200).json(result.rows);
            } else {
                response.status(200).json([]);
            }

        });

        // conn.release();
    });
}


const setUserSocial = (provider,userid, password) => {
console.log(">>>>pro:",provider,"db userId:",userid,">:",password);
let sql ={};
if(provider == "kakao") {
    sql = {
        text: "WITH UPSERT AS ("+
              " UPDATE OWN_COMP_USER SET "+
              "  token_kakao=$1 , kakao_login_date= now()"+
        	  "  WHERE kakao_id=$2 RETURNING*) "+
        	  " INSERT INTO OWN_COMP_USER (USER_NO,KAKAO_ID,TOKEN_KAKAO,KAKAO_LOGIN_DATE) "+
        	  "  SELECT 'M'||to_char(now(),'YYYYMMDDhh24miss'), $3,$4,now() WHERE NOT EXISTS ( SELECT * FROM UPSERT)",
        values: [password, userid, userid,password],
        rowMode: 'array',
    }
} else if (provider == "naver") {
    sql = {
        text: "WITH UPSERT AS ("+
              " UPDATE OWN_COMP_USER SET "+
              "  token_naver=$1 , naver_login_date= now()"+
        	  "  WHERE naver_id=$2 RETURNING*) "+
        	  " INSERT INTO OWN_COMP_USER (USER_NO,NAVER_ID,TOKEN_NAVER,NAVER_LOGIN_DATE) "+
        	  "  SELECT 'M'||to_char(now(),'YYYYMMDDhh24miss'), $3,$4,now() WHERE NOT EXISTS ( SELECT * FROM UPSERT)",
        values: [password, userid, userid,password],
        rowMode: 'array',
    }
} else if (provider == "google") {
    sql = {
        text: "WITH UPSERT AS ("+
              " UPDATE OWN_COMP_USER SET "+
              "  token_google=$1 , google_login_date= now()"+
        	  "  WHERE google_id=$2 RETURNING*) "+
        	  " INSERT INTO OWN_COMP_USER (USER_NO,google_ID,TOKEN_google,google_LOGIN_DATE) "+
        	  "  SELECT 'M'||to_char(now(),'YYYYMMDDhh24miss'), $3,$4,now() WHERE NOT EXISTS ( SELECT * FROM UPSERT)",
        values: [password, userid, userid,password],
        rowMode: 'array',
    }
}

console.log(sql);
    pgsqlPool.connect(function(err,conn,done) {

        if(err){
            console.log("err" + err);
        }

        conn.query(sql, function(err,result){
             done();
            if(err){
                console.log(err);
            }
            console.log(">>>",result);
            return result;
        });
    });
}

const setUserToken = (user, token) => {

const sql = {
        text: "UPDATE OWN_COMP_USER SET token_local=$1 , local_login_date= now() WHERE user_no=$2",
        values: [token, user.userno],
        rowMode: 'array',
    }

console.log("db token insert:",sql);
    pgsqlPool.connect(function(err,conn,done) {

        if(err){
            console.log("err" + err);
        }

        conn.query(sql, function(err,result){
             done();
            if(err){
                console.log(err);
            }
            console.log(">>>",result);
            return "ok";
        });
    });
}


const setUser = (email,inputpassword,phone,name,company,kakaoid,tokenkakao,naverid,tokennaver,faceid,tokenface,googleid,tokengoogle) => {
	//console.log(">>>>pro:",device,"db id:",id);
	console.log(">>>>email:",email,"inputpassword :",inputpassword);
	const setsql = {
            text: "insert into own_comp_user(user_no,user_type,user_email,user_pw,insert_date,user_phone,user_name," +
                  "svc_use_yn,del_yn,user_company,kakao_id,token_kakao,naver_id,token_naver,face_id,token_face,google_id,token_google) values (replace(to_char(nextval('auth_user_id_seq'),'M000000'),' ',''),'O'," +
                  "$1,$2,now(),$3,$4,'Y','N',$5,$6,$7,$8,$9,$10,$11,$12,$13)",
            values: [email,inputpassword,phone,name,company,kakaoid,tokenkakao,naverid,tokennaver,faceid,tokenface,googleid,tokengoogle]
       }
	 pgsqlPool.connect(function(err,conn) {
		 if(err){
	            console.log("err" + err);
	        }
      conn.query(setsql);
	 });
	}



module.exports = {
    getUserInfo,
    setUserSocial,
    setUserToken,
    setUser
}