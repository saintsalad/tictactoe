import React, { useState, useEffect } from 'react'
import DataCell from './DataCell_old'
import Modal from './Modal'

function Board(props) {

  const [symbol, setSymbol] = useState(props.isHost? 'x' : 'o')
  const [boardClass, setBoardClass] = useState(props.isHost? 'board x' : 'board circle')
  const [indexMark, setIndexMark] = useState(Array(9))
  const [winingText, setWiningText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [cellReset, setCellReset] = useState(false)

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

  useEffect(() => {

    if(checkWin(symbol)){
      setWiningText(symbol + " wins!")
      setShowModal(true)
      console.log("win")
   }else if(isDraw(indexMark)){
      setWiningText("draw")
      setShowModal(true)
   }

  },[indexMark])

  const checkWin = (symbol) =>{
     return WIN_CON.some(combination => {
      return combination.every(index => {
        return indexMark[index] === symbol
      })
    })
  }

  const isDraw = (arr) =>{
    return [...arr].every(index => {
      return index === "o" || index ==="x"
    })
  }

  const handleCellClick = (value, newSymbol) => {
    let x = props.isHost ? 'host' : 'client'
    if(props.turn === x){
      const newIndexMark = indexMark.slice()
      newIndexMark[value] = symbol
      setIndexMark( newIndexMark)
  
      handleToogleTurn(newSymbol)
    }

  }

  const resetGame = () => {
    setCellReset(true)
    setTimeout(()=>{
      setIndexMark(Array(9))
      setSymbol("x")
      setBoardClass("board x")
      setWiningText("")
      setShowModal(false)
      setCellReset(false)
    }, 100)
  }

  const handleToogleTurn = (value) =>{
    setTimeout(() => {
      if(symbol !== "o" ){
        setBoardClass('board circle')
      }else{
        setBoardClass('board x')
      }
      setSymbol(value)
    }, 100)
  }

  return (
    <div className="App">
      <div className={boardClass} id="board">
        <DataCell index={0} symbol={symbol} cellReset={cellReset} cellClick={handleCellClick} toogleTurn={handleToogleTurn}/>
        <DataCell index={1} symbol={symbol} cellReset={cellReset} cellClick={handleCellClick} toogleTurn={handleToogleTurn}/>
        <DataCell index={2} symbol={symbol} cellReset={cellReset} cellClick={handleCellClick} toogleTurn={handleToogleTurn}/>
        <DataCell index={3} symbol={symbol} cellReset={cellReset} cellClick={handleCellClick} toogleTurn={handleToogleTurn}/>
        <DataCell index={4} symbol={symbol} cellReset={cellReset} cellClick={handleCellClick} toogleTurn={handleToogleTurn}/>
        <DataCell index={5} symbol={symbol} cellReset={cellReset} cellClick={handleCellClick} toogleTurn={handleToogleTurn}/>
        <DataCell index={6} symbol={symbol} cellReset={cellReset} cellClick={handleCellClick} toogleTurn={handleToogleTurn}/>
        <DataCell index={7} symbol={symbol} cellReset={cellReset} cellClick={handleCellClick} toogleTurn={handleToogleTurn}/>
        <DataCell index={8} symbol={symbol} cellReset={cellReset} cellClick={handleCellClick} toogleTurn={handleToogleTurn}/>
      </div>
      <Modal text={winingText} isShow={showModal} resetGame={resetGame}/>
    </div>
  );
}

export default Board;
