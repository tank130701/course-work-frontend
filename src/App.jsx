import Board from './components/Board/Board';
import React, {useContext, useEffect} from 'react';
import Auth from './components/Auth/Auth';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import './App.css';
import LoginForm from "./components/LoginForn/LoginForm";
import {Context} from "./index";


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
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, [])
    console.log("App: ", store.isAuth)
    return (
        <Router>
            <Routes>
                <Route path={'/'} element={store.isAuthenticated() ? <Board /> : <LoginForm /> }/>
                {<Route path='/login' element={<LoginForm />}/>}
                {<Route path='/board' element={<Board />} />}
                {/*<Route path="/" element={store.isAuthenticated() ? <Navigate to="/board" /> : <LoginForm />} />*/}
                {/*<Route path="/board" element={!store.isAuth ? <Navigate to="/" /> : <Board />} />*/}
            </Routes>
        </Router>
    );
}

// function App() {
//     const { store } = useContext(Context);
//     // const navigate = useNavigate();
//     useEffect(() => {
//         if (store.isAuthenticated()) {
//             navigate("/board");
//         } else {
//             navigate("/");
//         }
//     }, [store.isAuth]);
//
//     console.log("App: ", store.isAuthenticated())
//
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={store.isAuthenticated() ? <Navigate to="/board" /> : <LoginForm />} />
//                 <Route path="/board" element={!store.isAuthenticated() ? <Navigate to="/" /> : <Board />} />
//             </Routes>
//         </Router>
//     );
// }

export default App;
