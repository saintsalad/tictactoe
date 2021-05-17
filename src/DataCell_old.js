import React, { useState, useEffect } from 'react';

function DataCell(props) {
    const [isClick, setIsClick] = useState(false)
    const [css, setCSS] = useState('cell')

    useEffect(()=>{
        if(props.cellReset){
            setIsClick(false)
            setCSS('cell')
        }
    }, [props])

    const handleClick = (event) =>{
        if(!isClick){
            setIsClick(true)
            if(props.symbol !== "x"){
                setCSS(css + " circle")
                props.cellClick(props.index, "x")
    
            }else{
                setCSS(css + " x")
                props.cellClick(props.index, "o")
            }
        }
    }


    return (
        <div className={css} onClick={()=> handleClick()} data-cell>
        </div>
    );
}

export default DataCell;