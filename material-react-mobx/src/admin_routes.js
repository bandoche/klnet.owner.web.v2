import Buttons from "views/Components/Buttons.js";
//import Calendar from "views/Calendar/Calendar.js";
//import Charts from "views/Charts/Charts.js";
//import Dashboard from "views/Dashboard/Dashboard.js";
/*import ErrorPage from "views/Pages/ErrorPage.js";
import ExtendedForms from "views/Forms/ExtendedForms.js";
import ExtendedTables from "views/Tables/ExtendedTables.js";
import FullScreenMap from "views/Maps/FullScreenMap.js";
import GoogleMaps from "views/Maps/GoogleMaps.js";
import GridSystem from "views/Components/GridSystem.js";
import Icons from "views/Components/Icons.js";
import LockScreenPage from "views/Pages/LockScreenPage.js";
import LoginPage from "views/Pages/LoginPage.js";
import Notifications from "views/Components/Notifications.js";
import Panels from "views/Components/Panels.js";
import PricingPage from "views/Pages/PricingPage.js";
import RTLSupport from "views/Pages/RTLSupport.js";
import ReactTables from "views/Tables/ReactTables.js";
import RegisterPage from "views/Pages/RegisterPage.js";
import RegularTables from "views/Tables/RegularTables.js";
import SweetAlert from "views/Components/SweetAlert.js";
import TimelinePage from "views/Pages/Timeline.js";
import Typography from "views/Components/Typography.js";
import UserProfile from "views/Pages/UserProfile.js";
import ValidationForms from "views/Forms/ValidationForms.js";
import VectorMap from "views/Maps/VectorMap.js";
import Widgets from "views/Widgets/Widgets.js";
import Wizard from "views/Forms/Wizard.js";*/

import RegularForms from "views/Forms/RegularForms.js";
import SampleData from "views/Pages/TestPage/SamplePage.js";
import SampleData2 from "views/Pages/TestPage/SamplePage2.js";
import SchedulePage from "views/Pages/TestPage/SampleSchedulePage.js";
import ScrapSchedule from "views/Pages/TestPage/SamplePage.js";
import ScrapManage from "views/Pages/TestPage/ScrapManage.js";
import ScrapResult from "views/Pages/TestPage/ScrapResult.js";
import ScrapPort from "views/Pages/TestPage/ScrapPort.js";
import SchPortCode from "views/Pages/TestPage/SchPortCodeList";
// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
//import DashboardIcon from "@material-ui/icons/Dashboard";
//import DateRange from "@material-ui/icons/DateRange";
//import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
//import Place from "@material-ui/icons/Place";
//import Timeline from "@material-ui/icons/Timeline";
//import WidgetsIcon from "@material-ui/icons/Widgets";
import Person from "@material-ui/icons/Person";
import ScrapIcon from '@material-ui/icons/Description';
import TerminalIcon from "@material-ui/icons/LocalShippingOutlined";
var dashRoutes = [
  {
	path: "/schedule",
	name: "Excel Sch Row Data",
	rtlName: "Excel Sch Row Data",
	icon: TerminalIcon,
	component: SampleData,
	layout: "/admin"
  },
  {
	path: "/demdetosc",
	name: "DEM&DET&OSC Data",
	rtlName: "DEM&DET&OSC Data",
	icon: TerminalIcon,
	component: SampleData,
	layout: "/admin"
  },
  {
		path: "/usersetting",
		name: "User Setting Manage",
		rtlName: "User Setting Manage",
		icon: TerminalIcon,
		component: SampleData,
		layout: "/admin"
  },
  {
    collapse: true,
    name: "Code",
    rtlName: "코드",
    icon: Apps,
    state: "componentsCollapse",
    views: [
      {
        path: "/portcode",
        name: "PORT CODE PAGE",
        rtlName: "항구코드",
        mini: "PT",
        rtlMini: "PT",
        component: SchPortCode,
        layout: "/admin"
      },
    ]
  },
  {
      collapse: true,
	    name: "Web Scraping",
	    rtlName: "Web Scraping",
	    icon: ScrapIcon,
      // layout: "/admin"
      views: [
        {
          path: "/lineManage",
          name: "LINE SCRAP MANAGE",
          rtlName: "선사별 스크랩 설정",
          mini: "PT",
          rtlMini: "PT",
          component: Buttons,
          component: ScrapManage,
          layout: "/admin"
        },
        {
          path: "/lineScrap",
          name: "LINE SCRAP",
          rtlName: "선사별 스크랩 조회",
          mini: "PT",
          rtlMini: "PT",
          component: ScrapResult,
          layout: "/admin"
        },
        {
          path: "/linePort",
          name: "LINE PORT",
          rtlName: "선사별 스크랩 PORT",
          mini: "PT",
          rtlMini: "PT",
          component: ScrapPort,
          layout: "/admin"
        },
      ]
	  },
	  {
	    path: "/sample",
	    name: "Exp&Imp Tracking Data",
	    rtlName: "Exp&Imp Tracking Data",
	    icon: TerminalIcon,
	    component: SampleData,
	    layout: "/admin"
	  },
  {
    collapse: true,
    name: "MANAGE",
    rtlName: "회원관리",
    icon: "content_paste",
    state: "formsCollapse",
    views: [
      {
        path: "/manage",
        name: "manage Page",
        rtlName: "회원관리",
        mini: "MB",
        rtlMini: "MB",
        component: RegularForms,
        layout: "/admin"
      },
      
    ]
  },
];
export default dashRoutes;
