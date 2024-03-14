import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Board from './components/Board/Board.jsx';
import LoginForm from "./components/LoginForn/LoginForm";
import {store} from "./index";



function App() {
    return (
        <Router>
            <Routes>
                {/*<Route path="/" element={<Board />} />*/}
                <Route path={'/'} element={store.isAuthenticated() ? <Board /> : <LoginForm /> }/>
                {<Route path='/login' element={<LoginForm />}/>}
                {<Route path='/board' element={<Board />} />}
            </Routes>
        </Router>
    );
}

export default App;
