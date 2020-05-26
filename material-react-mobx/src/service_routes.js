import FclPage from "views/Pages/Schedule/FclScheduleList.js";
//import TerminalPage from "views/Pages/TestPage/SamplePage.js";
import TrackingPage from 'views/Pages/Tracking/TrackingList.js';
import DemDetPage from 'views/Pages/DemDet/DemDetList.js';

import DemDetMapPage from 'views/Pages/DemDet/Map/DemDetMap.js';

import ProfilePage from "views/Pages/Member/UserProfile.js";
import SettingPage from "views/Pages/Member/UserServiceSetting.js";
import BoardPage from "views/Pages/Board/BoardPage.js";
import MainUploadBL from "views/Pages/BLUpload/UploadPage"
// @material-ui/icons
//import Apps from "@material-ui/icons/Apps";
//import DashboardIcon from "@material-ui/icons/Dashboard";
//import DateRange from "@material-ui/icons/DateRange";
//import GridOn from "@material-ui/icons/GridOn";
//import Image from "@material-ui/icons/Image";
//import Place from "@material-ui/icons/Place";
//import Timeline from "@material-ui/icons/Timeline";
//import WidgetsIcon from "@material-ui/icons/Widgets";

// @material-ui/icons
//import DirectionsBoat from  "@material-ui/icons/DirectionsBoat";
import ScrapIcon from '@material-ui/icons/Description';
//import MapIcon from "@material-ui/icons/Map";
//import BackupIcon from "@material-ui/icons/Backup";
import Person from "@material-ui/icons/Person";
import LocationOn from "@material-ui/icons/LocationOn";

var ServiceRoutes = [
  {
    collapse: true,
    name: "Location",
    rtlName: "위치정보",
    icon: LocationOn,
    state: "pageCollapse",
    views: [
      {
        path: "/tracking",
        name: "Tracking Service",
        rtlName: "선박위치정보",
        mini: "TK",
        rtlMini: "TK",
        component: TrackingPage,
        layout: "/svc"
      },
      {
        path: "/demDet",
        name: "DEM/DET/STORAGE",
        rtlName: "보관기한",
        mini: "DD",
        rtlMini: "DD",
        component: DemDetPage,
        layout: "/svc"
      },
      {
        path: "/uploadbl",
        name: "BL Upload",
        rtlName: "User BL Upload",
        mini: "BU",
        rtlMini: "BU",
        component: MainUploadBL,
        layout: "/svc"
      },
      {
          path: "/mapService",
          name: "Dem&Det MAP",
          rtlName: "MAP",
          mini: "MP",
          rtlMini: "MP",
          component: DemDetMapPage,
          layout: "/svc"
        },
    ]
  },
  {
    collapse: true,
    name: "SCHEDULE",
    rtlName: "스케쥴",
    icon: ScrapIcon,
    state: "componentsCollapse",
    views: [
      {
        path: "/fcl",
        name: "FCL Sea Schedule",
        rtlName: "FCL 해상 스케쥴",
        mini: "FS",
        rtlMini: "FC",
        component: FclPage,
        layout: "/svc"
      },
    ]
  },
  {
	path: "/profile",
	name: "Profile Page",
	rtlName: "사용자정보",
    icon: Person,
	component: ProfilePage,
	layout: "/svc"
  },
  {
	path: "/setting",
	name: "Setting Page",
	rtlName: "설정",
    icon: Person,
	component: SettingPage,
	layout: "/svc"
  },
  {
	path: "/board",
	name: "Board Page",
	rtlName: "게시판",
	   icon: Person,
	component: BoardPage,
	layout: "/svc"
  },  

];
export default ServiceRoutes;
