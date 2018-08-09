import * as React from 'react';
import '../styles/Loader.scss';

function Loader() {
    return (
        <div className='Loader'>
            <div className='arc'/>
            <h1 className='loading'><span>LOADING</span></h1>
        </div>
    );
}

export default Loader;