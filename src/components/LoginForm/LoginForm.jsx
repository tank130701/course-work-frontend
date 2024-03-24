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
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Пожалуйста, заполните все поля.");
            return;
        }
        try {
            await store.login(email, password);
            setError(null); 
            if (store.isAuth) {
                navigate("/root");
            }
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка авторизации.");
        }
    };

    const handleRegistration = async () => {
        if (!email || !password) {
            setError("Пожалуйста, заполните все поля.");
            return;
        }
        try {
            await store.registration(email, password);
            setError('');
            setSuccessMessage("Регистрация прошла успешно. Теперь вы можете войти в систему.");
            navigate("/login"); // или куда вы хотите направить пользователя после регистрации
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка регистрации.");
        }
    };

    console.log(error);
    return (
        <div className={styles.formContainer}>
            <div className={styles.siteHeader}>
                <img src="/notion.svg" alt="Иконка сайта" className={styles.siteIcon}/>
                <h1 className={styles.siteName}>ProNotion</h1>
            </div>
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
                <button className={styles.formButton} onClick={handleRegistration}>Register</button>

                {error && <div className={styles.error}>{error}</div>}
                {successMessage && <div className={styles.success}>{successMessage}</div>}

            </div>
        </div>
    );
};

export default LoginForm;
