import React, { useState, useEffect } from 'react';

function DataCell(props) {
    const [css, setCSS] = useState('cell')

    useEffect(() => {
        if(props.mark){
            setCSS(`cell ${props.mark === "x" ? "x" : "circle"}`)
        }
    }, [props.mark])

    function handleClick(){

        if(!props.mark){
            let x = props.isHost ? "host" : "client"
            if(props.turn === x ){
                props.setMark(props.index, props.isHost ? "x" : "o")
            }
            // else{
            //     console.log("not click", x, props.isHost )
            // }
        }

    }

    return (
        <div className={css} onClick={()=> handleClick()} data-cell>
        </div>
    );
}

export default DataCell;