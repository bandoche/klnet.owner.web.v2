// var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
// const bcrypt = require('bcrypt');
const sUser = require('../models/sessionUser');
const pgsqlPool = require("../database/pool.js").pgsqlPool
const pgSql = require('../database/postgresql/users');
 
// const { User } = require('../models');

module.exports = (passport) => {  

	passport.use('localjoin',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
                console.log('Sign (localStrategy.js) email:', email, 'password:', password,'req:',req.body);
                const inputpassword = crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha512').toString('hex');
                let status = "N";
                
            try {
            	req.session.sUser = null;  

            	if(email) {          	    
            	    pgsqlPool.connect(function(err,conn) {

            	        if(err){
            	            console.log("err" + err);
            	        }
            	        
            	        const sql = {
            	    	        text: "SELECT * FROM OWN_COMP_USER \n"+
            	    	              " where upper(user_email) = upper($1) \n"+
            	    	        	  "  limit 1 ",
            	    	        values: [email]
            	    	    }

            	        conn.query(sql, function(err,result){
            	        	//done();
            	            if(err){
            	                console.log(err);
            	            }

            	            if(result.rowCount > 0) {
            	            	conn.release();
            	            	console.log("이미 등록되어 있음.");
            	            	done(null, false, { message: '동일한 아이디가 존재 합니다.' });
            	            } else {
            	            	console.log("등록되어 있지 않음.");
            	            	pgSql.setUser(email,inputpassword,req.body.phone,req.body.name,req.body.company,
            	            			req.body.kakaoid,req.body.tokenkakao,req.body.naverid,req.body.tokennaver,
            	            			req.body.faceid,req.body.tokenface,req.body.googleid,req.body.tokengoogle,
            	            			function(err) {if (err) {
            	            		done(null, false, { message: 'DataBase error' });
            	            	}});
            	            	conn.release();
 	                            sUser.provider = 'local';
	                            //sUser.userid = userid;
	                            //sUser.userno = result.rows[0].user_no;
	                            sUser.username = req.body.name,
	                            sUser.displayName = 'web',
	                            sUser.email = email;
	                            sUser.usertype = 'O';
                            	req.session.sUser = sUser;
               	                done(null, sUser);
            	            
            	            }
              
            	        });
            	    }); 
            	}

            } catch(error) {
            	console.log(">>>>>error",error);
                console.error(error);
                done(error);
            }
    }));
	
    passport.use('local',new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw',
        passReqToCallback: true
    }, async (req, userid, password, done) => {
                console.log('(localStrategy.js) userid:', userid, 'password:', password);
                const inputpassword = crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha512').toString('hex');
            try {

				// test용 pdk ship
				// sUser.provider = 'local';
				// sUser.userid = "test1@klnet.co.kr";
				// sUser.userno = "M000002";
				// sUser.username = "니꼬동",
				// sUser.displayName = 'web',
				// sUser.email = "test1@klnet.co.kr";
				// sUser.token_local = "";
				// req.session.sUser = sUser;
				// done(null, null);

            	//console.log(userid, password);

               // console.log(".Input Password:"+crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha512').toString('hex'));
                /*
                    2020.01.21 pdk ship 

                    userid, password 로 DB를 검색하여 존재하는지에 따라 프로세스 처리
                */
                            
                // const exUser = await User.find({ where: { email } });
            	
            	if(userid) {
            		console.log(">>>>>2");
	                pgsqlPool.connect(function(err,conn) { 
	                    if(err){
	                        console.log("err" + err);
	                    } else {
	                    	 console.log(">>>>>3");
	                    conn.query("select  * from own_comp_user where upper(user_email) = upper('"+userid+"')", function(err,result) {
	                        if(err){
	                            console.log(err);
	                        } else {
		                        if(result.rows[0] != null) {
			                           
		                            const exUser = {userid, password}
	
		                            let resultSet = false; 
		                                 if (inputpassword == result.rows[0].user_pw.toString()) resultSet = true;
		                                 // console.log("result:"+result);
		                                 if(resultSet) {
		     	                            sUser.provider = 'local';
		    	                            //sUser.userid = userid;
		    	                            sUser.userno = result.rows[0].user_no;
		    	                            sUser.username = result.rows[0].user_name,
		    	                            sUser.displayName = 'web',
		    	                            sUser.email = result.rows[0].user_email;
		    	                            sUser.usertype = result.rows[0].user_type;
		                                	req.session.sUser = sUser;
		                                	conn.release();
		                                    done(null, sUser);
		                                 } else {
		                                    console.log('아이디 또는 비밀번호가 일치하지 않습니다.');
		                                    done(null, false, { message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
		                                 }   
		                        } else {
		                            console.log('가입되지 않은 회원입니다.');
		                            done(null, false, { message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
		                        }
	                        }
	                    });
	                    // conn.release();
	                 }
	                });
	                console.log(">>>>>end");
            	}

            } catch(error) {
            	console.log(">>>>>error",error);
                console.error(error);
                done(error);
            }
    }));
    
    console.log('passport2');
    
    
   
};
