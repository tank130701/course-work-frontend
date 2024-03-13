import React, { memo, useState, useContext } from 'react';
import { Context } from "../index";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { store } = useContext(Context);

    return (
        <div>
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
            <button onClick={() => store.login(email, password)}>
                Login
            </button>
            <button onClick={() => store.registration(email, password)}>
                Register
            </button>
        </div>
    );
};

export default memo(LoginForm);
