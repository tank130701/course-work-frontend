import React, { useState, useContext } from 'react';
import styles from './LoginForm.module.css';
import { Context } from "../../index";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await store.login(email, password);
            setError(null); // clear any previous errors
            if (store.isAuth) {
                navigate("/root");
            }
        } catch (e) {
            setError(e.response?.data?.message);
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formBox}>
                <input
                    className={styles.formInput}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    placeholder='Username'
                />
                <input
                    className={styles.formInput}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder='Password'
                />
                <button 
                    className={styles.formButton} 
                    onClick={handleLogin}
                >
                    Login
                </button>
                <button 
                    className={styles.formButton} 
                    onClick={() => store.registration(email, password)}
                >
                    Register
                </button>
                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    );
};

export default LoginForm;
