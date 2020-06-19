import React,{ useState, useEffect } from "react";
import Board from "components/Board/Board.js"

import axios from 'axios';

import { observer, inject} from 'mobx-react'; // 6.x

const BoardTest = inject('userStore', 'trackStore')(observer(({ userStore, trackStore, ...props }) => { 
//export default function BoardTest(props) {

    const [boardMode,setBoardMode] = useState("LIST");
    const [boardId,setBoardId] = useState();
    const [boardList,setBoardList] = useState([]);
    const [boardDetailData,setBoardData] = useState([]);
    

    const changeDataHandler = (boardMode, boardId) => {
        setBoardMode(boardMode);
        setBoardId(boardId)
    }

    const getBoardList = () => {
      axios.post("/api/getBoardList",{type:"main"}, {headers:{'Authorization':'Bearer '+userStore.token}}
          )
        .then(res => {setBoardList(res.data)
          console.log(res.data)
        })
        .catch(err => {
          alert('오류가 발생했습니다.');
        });
    }

    const getBoardDetail = (boardId) => {
      console.log('effect');
      //search
      axios.post("/api/getBoardDetail", {type:"main",board_id:boardId}, {headers:{'Authorization':'Bearer '+userStore.token}}
          )
        .then(res => {
          setBoardData(res.data[0]);
        })
        .catch(err => {
          alert('오류가 발생했습니다.');
        });
    }

    const deleteBoard = (boardId) => {
      //delete
      axios.post("/com/deleteBoard",{ type:"main",board_id:boardId }, {headers:{'Authorization':'Bearer '+userStore.token}})
        .then(res => {
              alert("삭제되었습니다."); 
              setBoardMode("LIST");
            })
        .catch(err => {
          if(err.response.status == "403") {
            alert('오류가 발생했습니다.');
          }
        });
    }

    
    const saveBoard = (boardId, title, content) => {
      //save
      axios.post("/com/saveBoard",{ type:"main",board_id:boardId, title:title, content:content}, {headers:{'Authorization':'Bearer '+userStore.token}})
        .then(res => {
            alert("게시글이 등록 되었습니다."); 
            setBoardMode("LIST")
          })
        .catch(err => {
          alert('오류가 발생했습니다.');
        });
    }

    return(
        <Board
        	title ="공지사항"
            boardList = {boardList}
            boardData = {boardDetailData}
            boardMode = {boardMode}
            boardId = {boardId}
            onChangeData = {changeDataHandler}
            getBoardList = {getBoardList}
            getBoardDetail = {getBoardDetail}
            deleteBoard = {deleteBoard}
            saveBoard = {saveBoard}
        	returnUrl={"/svc/board"}
        ></Board>
    );
}

))

export default BoardTest;