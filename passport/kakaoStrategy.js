const KakaoStrategy = require('passport-kakao').Strategy;
const sUser = require('../models/sessionUser');
const pgSql = require('../database/postgresql/users');
const pgsqlPool = require("../database/pool.js").pgsqlPool
// console.log("sUser:",sUser);

module.exports = (passport) => {

    // passport.use(new KakaoStrategy({
    //     clientID: secret_config.federation.kakao.client_id,
    //     callbackURL: '/auth/kakao/callback'
    //   },
    //   function (accessToken, refreshToken, profile, done) {
    //     var _profile = profile._json;
    
    //     loginByThirdparty({
    //       'auth_type': 'kakao',
    //       'auth_id': _profile.id,
    //       'auth_name': _profile.properties.nickname,
    //       'auth_email': _profile.id
    //     }, done);
    //   }
    // ));

    passport.use(new KakaoStrategy({
        clientID: '0b6d98316119442e856dd2ad7497df14', //process.env.KAKAO_ID,
        clientSecret: 'JBzQybkhxoJrj464OwaYSKJQygc69dEw',//JBzQybkhxoJrj464OwaYSKJQygc69dEw
        callbackURL: '/auth/kakao/callback',
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            console.log('(kakaoStrategy.js) profile:', profile, 'accessToken:', accessToken, 'refreshToken:', refreshToken);
            // const exUser = await User.find({ where: { snsId: profile.id, provider: 'kakao' } });
/*	            sUser.provider = 'kakao';
	            //sUser.userid = profile.id;  //1261001956
	            sUser.userno = '';
	            sUser.username = profile.username;
                sUser.displayName = profile.displayName;
                sUser.accessToken = accessToken;
                sUser.refreshToken = '';
                sUser.email = profile._json.kakao_account.email; //mamma1234@naver.com;
*/
            /*
                2020.01.21 pdk ship 

                kakao id 로 DB를 검색하여 존재하면 accessToken, refreshToken 저장
                이후 서버 세션 저장 (미정, 토큰으로 클라이언트 처리할지 검토중)

                kakao id DB에 존재하지 않을 경우 회원 가입 페이지로 이동, 
                    옵션 1 신규 회원 가입 및 카카오 아이디, accessToken, refreshToken 신규 저장
                    옵션 2 기존 회원 정보 찾아 카카오 아이디 업데이트

            */

            const userid = profile.id;
            console.log("user_id:",profile.id);
           //const password = accessToken
        	const sql = {
        	        text: "SELECT * FROM OWN_COMP_USER where trim(kakao_id) = trim($1) limit 1 ",
        	        values: [profile.id],
        	        //rowMode: 'array',
        	    }

        	    console.log(sql);
        	    pgsqlPool.connect(function(err,conn,release) {
        	        if(err){
        	            console.log("err" + err);
        	        }
        	        conn.query(sql, function(err,result){
        	        	release();
        	            if(err){
        	                console.log(err);
        	            }
        	            //console.log(">>>",result);
        	            console.log("USER DATA CNT:",result.rowCount);
        	            if(result.rowCount > 0) {
    	     	            sUser.provider = 'kakao';
    	    	            sUser.userid = '';  //1261001956
    	    	            sUser.userno = result.rows[0].user_no;
    	    	            sUser.username = profile.username?profile.username:result.rows[0].user_name;
                            sUser.displayName = profile.displayName;
                            sUser.accessToken = accessToken;
                            //sUser.refreshToken = refreshToken;
                            sUser.email = profile._json.kakao_account.email; //mamma1234@naver.com;
    	                    //req.session.sUser = sUser;
    	                    //console.log(">user value:",sUser);
    	                    done(null, sUser); 
        	            } else {
        	            	sUser.provider = 'kakao';
        		            sUser.userid = profile.id;  //1261001956
        		            sUser.userno = '';
        		            sUser.username = profile.username;
        	                sUser.displayName = profile.displayName;
        	                sUser.accessToken = accessToken;
        	                sUser.refreshToken = '';
        	                sUser.email = profile._json.kakao_account.email; //mamma1234@naver.com;
        	            	console.log('가입되지 않은 회원입니다.');
        	                done(null, sUser, { message: '가입되지 않은 회원입니다.' });
        	            }
        	            
        	            
        	        });
        	    });
        }
        catch(error) {
            console.error(error);
            done(error);
        }

    }));
};

