import React from 'react';

function Modal(props) {

    const cssClass = props.isShow ? "winning-message show" : "winning-message"

    return (
        <div className={cssClass} id="winningMessage">
            <div data-winning-message-text>{props.text}</div>
            <button className="modal-btn" id="restartButton" onClick={() => props.resetGame()}>Play Again</button>
            <button className="modal-btn" id="restartButton" onClick={() => props.exitGame()}>Exit Game</button>
      </div>
    );
}

export default Modal;