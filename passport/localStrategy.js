// var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
// const bcrypt = require('bcrypt');
const sUser = require('../models/sessionUser');
const pgsqlPool = require("../database/pool.js").pgsqlPool

 
// const { User } = require('../models');

module.exports = (passport) => {          
    passport.use(new LocalStrategy({
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
	
		                            const userName = result.rows[0].user_name;
									const userNo = result.rows[0].user_no;
									const userEmail = result.rows[0].user_email;
		                           
		                            const exUser = {userid, password}
	
		                            let resultSet = false; 
		                                 if (inputpassword == result.rows[0].user_pw.toString()) resultSet = true;
		                                 // console.log("result:"+result);
		                                 if(resultSet) {
		     	                            sUser.provider = 'local';
		    	                            sUser.userid = userid;
		    	                            sUser.userno = userNo;
		    	                            sUser.username = userName,
		    	                            sUser.displayName = 'web',
		    	                            sUser.email = userEmail;
		                                	req.session.sUser = sUser;
		                                	console.log(">>>>>4");
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
            	}

            } catch(error) {
                console.error(error);
                done(error);
            }
    }));   
   
};
