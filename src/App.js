import React, { useEffect, useState } from 'react';
import Board from './Board'
import firebase from './firebase'
import { v4 as uuidv4 } from 'uuid'

import DataCell from './DataCell'
import Modal from './Modal'
import LoadingPage from  './LoadingPage'

function App(props) {

  const [rooms, setRooms] = useState([])
  const [USER_ID] = useState(uuidv4())
  const [isJoined, setIsJoined] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [winingText, setWiningText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [currentRoom, setCurrenRoom] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [boardClass, setBoardClass] = useState('board x')

  const WIN_CON = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const ref = firebase.firestore().collection('room')

  useEffect(() => {

    var curr = currentRoom[0]

    if(typeof(curr) == 'undefined'){

      if(showModal && !isHost){
        alert('Host leave the room')
      }

      setIsJoined(false)
      setIsStarting(false)
      getRooms()
    }else{

      let turn = curr.turn
      let indices = curr.indexMark
      let symbol = turn === "host" ? "o" : "x"
      let status = curr.status
      let roomId = curr.id

      if((checkWin(symbol) && status === "starting")){

        setIsLoading(true)
        setTimeout(() => {
          setIsLoading(false)
          setGameToEnd(roomId)
          setShowModal(true)
          setWiningText(`${symbol} wins the game!`)
        }, 1000);

      }else if(isDraw(indices) && status === "starting"){

        setIsLoading(true)
        setTimeout(() => {
          setIsLoading(false)
          setGameToEnd(roomId)
          setShowModal(true)
          setWiningText("the game is draw")
        }, 1000);

      }

      if(turn === "host" ){
        setBoardClass('board x')
      }else{
        setBoardClass('board circle')
      }

      curr = null
    }

    if(isHost){
      checkIfClientJoined()
    }

  }, [currentRoom[0]])


  const checkWin = (symbol) =>{
    return WIN_CON.some(combination => {
     return combination.every(index => {
       return currentRoom[0].indexMark[index] === symbol
     })
   })
 }

 const isDraw = (arr) =>{
  return [...arr].every(index => {
    return index === "o" || index ==="x"
  })
}

  // GET
  function getRooms(){
    ref
    .onSnapshot((querySnapshot)=>{
      const list = []
      querySnapshot.forEach((doc)=>{
        list.push({id: doc.id, ...doc.data()})
      })
      setRooms(list)
    })
  }


  // GET
  function checkIfClientJoined(){

      ref
      .where('hostId', '==', USER_ID)
      .where('status', '==', 'starting')
      .onSnapshot((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
        // console.log(doc.data().clientId, ": joined the room")
        setIsStarting(true)
        })

      })

  }

  function getCurrentRoom(hostId){
      ref
      .where('hostId', '==', hostId)
      .onSnapshot((querySnapshot) => {
      const list = []
        querySnapshot.forEach((doc) => {
          list.push({id: doc.id, ...doc.data()})
        })
        setCurrenRoom(list)
      })
  }

  function setGameToEnd(roomId){
    
    if(roomId){
      ref
      .doc(roomId)
      .update({
        status: "end", turn: "unknown"
      }).then(()=>{
        console.log("game set to end")
      })
      .catch((err) => {
        console.error(err)
      })
    }

  }

  //EDIT
  function handleJoinRoom(room){

    if(room.status === 'waiting' || room.status === 'end'){
      setIsLoading(true)
      setCurrenRoom([])
      setIsJoined(false)
      setIsStarting(false)

      const updateRoom = {
        clientId: USER_ID,
        status: 'starting'
      }

      ref
      .doc(room.id)
      .update(updateRoom)
      .then(()=>{
        setIsJoined(true)
        setIsHost(false)
        // console.log("joined")
        getCurrentRoom(room.hostId)
        setIsStarting(true)
        setIsLoading(false)

      })
      .catch((err) => {
        console.error(err)
      })

    }else{
      alert('room is already starting')
    }
  }

  function setMark(index, symbol){
    setIsLoading(true)

    const newIndexMark = currentRoom[0].indexMark.slice()
    newIndexMark[index] = symbol

    const newObj = [
      ...newIndexMark
    ]

    ref
    .doc(currentRoom[0].id)
    .update({
      "indexMark" : newObj,
      "turn" : symbol === "x" ? "client" : "host"
    })
    .then(() => {
    setIsLoading(false)

    })
    .catch((err) => {
      console.error(err)
    })

  }



  // CREATE
  function handleCreateRoom(){

    setIsLoading(true)
    const newRoom ={
      hostId: USER_ID,
      clientId: "",
      status: "waiting",
      turn: "host",
      indexMark: ["", "", "", "", "", "", "", "" ,""]
    }

    ref
    .doc()
    .set(newRoom)
    .then(() => {
      setIsJoined(true)
      setIsHost(true)
      getCurrentRoom(USER_ID)
      // console.log("room created")
      setIsLoading(false)

    }).catch((err) => {
      console.error(err)
    })
  }


  function exitGame(){
    setShowModal(false)
    setIsLoading(true)

    setTimeout(() => {
      if(isHost){
        ref
        .doc(currentRoom[0].id)
        .delete()
        .then(()=>{
          setCurrenRoom([])
        })
        .catch((err) => {
          console.error(err);
        });
      }else{

        if(currentRoom.length){

          ref
          .where("hostId", "==", currentRoom[0].hostId)
          .where("status", "==", "starting")
          .get()
          .then(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
              
              if(doc.data()){
                const updateRoom = {clientId: '', status: 'end'}
                ref
                .doc(currentRoom[0].id)
                .update(updateRoom)
                .then(()=>{
                  setIsJoined(false)
                  setIsStarting(false)
                })
              }

            })


          })

        }else{
            setIsJoined(false)
            setIsStarting(false)
        }

      }
    }, 500);

    setIsLoading(false)
  }


  function resetGame(){
    setShowModal(false)
    setIsLoading(true)
    if(isHost){

      const updateRoom = {
        turn: 'host', 
        clientId: '', 
        status: 'waiting', 
        indexMark: ["", "", "", "", "", "", "", "" ,""]
      }

      ref
      .doc(currentRoom[0].id)
      .update(updateRoom)
      .then(()=>{

        setIsJoined(true)
        setIsStarting(false)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
      })

    }else{

      //RESET GAME CLIENT
      let curr = currentRoom[0]
      handleJoinRoom(curr)


    }

    setIsLoading(false)
  }



  // window.onbeforeunload = function(event){
  //   event.preventDefault();

  //   // Google Chrome requires returnValue to be set
  //   event.returnValue = '';

  //   return null;
  // }

  function RenderCells(){
    const arr = []
    for (let i = 0; i <= 8; i++) {
      arr.push(
      <DataCell key={uuidv4()} 
      index={i} mark={currentRoom[0].indexMark[i]} 
      turn={currentRoom[0].turn} isHost={isHost} 
      setMark={setMark}/>
      )
    }
    return arr
  }



  return (
    <>
      { isLoading && <LoadingPage />}
      <Modal text={winingText} isShow={showModal} exitGame={exitGame} resetGame={resetGame}/>

      { !isJoined && (
        <div>
        <button onClick={()=> handleCreateRoom()}>Create Room</button><br /><br />
        <span>My ID: {USER_ID}</span>
        <ul>
          {rooms.map((room, i)=>(
            <li key={i} onClick={() => handleJoinRoom(room)}>Host : {room.hostId} | status : {room.status}</li>
          ))}
        </ul>
        </div>
      )}

      { (isStarting && currentRoom.length) && (
            <div className="App">
            <button onClick={()=>exitGame()}>Exit Game </button>
            <div className={boardClass} id="board">
              { <RenderCells /> }
              {/* <DataCell index={0} mark={currentRoom[0].indexMark[0]} turn={currentRoom[0].turn} isHost={isHost} setMark={setMark}/>
              <DataCell index={1} mark={currentRoom[0].indexMark[1]} turn={currentRoom[0].turn} isHost={isHost} setMark={setMark}/>
              <DataCell index={2} mark={currentRoom[0].indexMark[2]} turn={currentRoom[0].turn} isHost={isHost} setMark={setMark}/>
              <DataCell index={3} mark={currentRoom[0].indexMark[3]} turn={currentRoom[0].turn} isHost={isHost} setMark={setMark}/>
              <DataCell index={4} mark={currentRoom[0].indexMark[4]} turn={currentRoom[0].turn} isHost={isHost} setMark={setMark}/>
              <DataCell index={5} mark={currentRoom[0].indexMark[5]} turn={currentRoom[0].turn} isHost={isHost} setMark={setMark}/>
              <DataCell index={6} mark={currentRoom[0].indexMark[6]} turn={currentRoom[0].turn} isHost={isHost} setMark={setMark}/>
              <DataCell index={7} mark={currentRoom[0].indexMark[7]} turn={currentRoom[0].turn} isHost={isHost} setMark={setMark}/>
              <DataCell index={8} mark={currentRoom[0].indexMark[8]} turn={currentRoom[0].turn} isHost={isHost} setMark={setMark}/> */}
            </div>
          </div>
      )}
    </>
  );
}

export default App;