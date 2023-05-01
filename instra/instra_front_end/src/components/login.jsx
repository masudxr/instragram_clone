import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import LoginHeader from './LoginHeader';
import './style.css';
import {  Link } from "react-router-dom";


export default function LoginForm() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [compare, setCompare] = useState(null);

    useEffect(() => {
        handleSubmit();
        // eslint-disable-next-line
    }, [])

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "userName") {
            setUserName(value);
        }
        if (id === "password") {
            setPassword(value);
        }
    }
    async function handleSubmit() {
        console.log('UserName: ', userName)
        console.log('Password: ', password)

        const response = await fetch("http://localhost:3000/users")
        const json = await response.json();
        setCompare(json);
        compareUser();
    }
    function compareUser() {
        console.log('start comparing')
        console.log('compare', compare);

        const array = compare;
        console.log('array', array);
        for (let i = 0; i < 100; i++) {
            if (userName === array[i].name) {
                if (password === array[i].password) {
                    console.log('Login Successfull!!');
                    navigate("/home");
                } else {
                    console.log('Invalid User Name and Password!')
                }
            }
        }
    }
    return (
        <div className="container">
        <div className="form">
            <LoginHeader />
            <div className="form-body">
                <div className="username">
                    <label className="form__label" name="userName">User Name </label>
                    <input className="form__input" type="text" value={userName} onChange={(e) => handleInputChange(e)} id="userName" placeholder="User Name" />
                </div>
                <div className="password">
                    <label className="form__label" name="password">Password </label>
                    <input className="form__input" type="password" id="password" value={password} onChange={(e) => handleInputChange(e)} placeholder="Password" />
                </div>
            </div>
            <div className="footer">
                <button onClick={() => handleSubmit()} type="submit" className="btn">Login</button>
            </div>
            <div>
                <h5>Don't have an account? </h5>
                <Link to="/registration">Sign Up </Link>
            </div>
        </div>
        </div>
    )
}