import React, {memo, useState, useContext, useEffect} from 'react';
import styles from './LoginForm.module.css';
import { Context } from "../../index";
import {useNavigate} from "react-router-dom";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { store } = useContext(Context);
    const navigate = useNavigate();

    // useEffect(() => {
    if (store.isAuth) {
        navigate("/board");
    }
    // }, []);

    return (
        <div className={styles.loginForm}>
            <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder='Username'
            />
            <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='Password'
            />
            <button onClick={async () => {
                try {
                    await store.login(email, password);
                    setError(null); // clear any previous errors
                    console.log(store.isAuth)
                    console.log("Вы авторизованы")
                    if (store.isAuth) {
                        navigate("/board");
                    }
                } catch (e) {
                    setError(e.response?.data?.message);
                }
            }}>
                Login
            </button>
            <button onClick={() => store.registration(email, password)}>
                Register
            </button>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default LoginForm;