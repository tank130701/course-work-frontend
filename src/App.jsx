import React from 'react';
import Auth from './components/Auth';
import Board from './components/Board';
import './App.css';


function App() {
    return (
        <div className="App">
            <Auth>
                <Board/>
            </Auth>
        </div>
    );
}
export default App;
