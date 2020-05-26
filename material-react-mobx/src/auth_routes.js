//import LoginPage from "views/Pages/Login/LoginPage.js";
//import LoginPage from "views/Pages/Login/TestLoginPage.js";
import RegisterPage from "views/Pages/Member/RegisterPage.js";
import Temp from "views/Pages/Login/Authorization.js";


// @material-ui/icons
import Person from "@material-ui/icons/Person";

var ServiceRoutes = [
 {
	    path: "/authcheck",
	    name: "",
	    rtlName: "로그인",
		icon: Person,
	    component: Temp,
	    layout: "/authpage"
	  },
  {
	path: "/register",
	name: "Plism Plus+",
	rtlName: "회원가입",
    icon: Person,
	component: RegisterPage,
	layout: "/authpage"
  },

];
export default ServiceRoutes;
