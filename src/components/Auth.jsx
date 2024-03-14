// import React, {memo, useContext, useEffect} from 'react';
// import LoginForm from "./LoginForm";
// import {Context} from "../index";
//
// const Auth = ({ children }) => {
//     const { store } = useContext(Context);
//
//     useEffect(() => {
//         if (localStorage.getItem('token')) {
//             console.log("Проверка в Auth")
//             console.log(localStorage.getItem('token'))
//             store.checkAuth();
//         }
//     }, [])
//
//
//     if (store.isLoading) {
//         return <div>Loading...</div>
//     }
//     console.log("Проверка Аутентификации")
//     console.log(store.isAuth)
//     if (!store.isAuth) {
//
//         return (
//             <div>
//                 <LoginForm/>
//             </div>
//         );
//     }
//
//     return (
//         <div>
//              {/*<h1>{store.isAuth ? `User authenticated ${store.user.id}` : 'Please authenticate'}</h1>*/}
//             {/*<h1>{store.user.isActivated ? 'Account confirmed by email' : 'PLEASE CONFIRM ACCOUNT!!!!'}</h1>*/}
//             {/* <button onClick={() => store.logout()}>Logout</button> */}
//             {children}
//         </div>
//     );
// };
//
// export default memo(Auth);
