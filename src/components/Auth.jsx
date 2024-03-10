import React, { useContext, useEffect, useState } from 'react';
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUser";
import UserService from "./services/UserService";
import LoginForm from "./components/LoginForm";

const Auth = observer(() => {
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    if (store.isLoading) {
        return <div>Loading...</div>
    }

    if (!store.isAuth) {
        return <LoginForm/>
    }

    return (
        <div>
            <h1>{store.isAuth ? `User authenticated ${store.user.email}` : 'Please authenticate'}</h1>
            <h1>{store.user.isActivated ? 'Account confirmed by email' : 'PLEASE CONFIRM ACCOUNT!!!!'}</h1>
            <button onClick={() => store.logout()}>Logout</button>
        </div>
    );
});

export default Auth;

