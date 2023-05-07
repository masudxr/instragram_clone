import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import LoginHeader from './LoginHeader';
import '../style.css';
import {  Link } from "react-router-dom";


export default function LoginForm(props) {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);

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
        const json = {
            name: userName,
            password: password
        }
        const res = await fetch("http://localhost:3000/auth/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json),
        })
        const token = await res.json()
        if(token.token) {
            navigate('/')
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