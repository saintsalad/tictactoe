import React from 'react';
import ReactLoading from 'react-loading';

function LoadingPage(props) {
    return (
        <div className="winning-message show">
            <ReactLoading type={'bubbles'} color={"white"} height={'10%'} width={'10%'} />
        </div>
    );
}

export default LoadingPage;