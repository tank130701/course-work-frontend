import React from 'react';
import Auth from './components/Auth';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Board from './components/Board/Board';
import './App.css';
import LoginForm from "./components/LoginForn/LoginForm";
import {store} from "./index";


// function App() {
//     return (
//         <div className="App">
//             <Auth>
//                 <Board/>
//             </Auth>
//         </div>
//     );
// }

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={store.isAuthenticated() ? <Navigate to="/board" /> : <LoginForm />} />
                <Route path="/board" element={!store.isAuthenticated() ? <Navigate to="/" /> : <Board />} />
            </Routes>
        </Router>
    );
}

export default App;
