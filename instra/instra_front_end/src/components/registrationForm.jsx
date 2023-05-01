import React, { useState } from 'react';
import Header from './header';
import { useNavigate } from "react-router-dom";
import './style.css';
import {  Link } from "react-router-dom";


function RegistrationForm() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [password, setPassword] = useState(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "userName") {
            setUserName(value);
        }
        if (id === "phone") {
            setPhone(value);
        }
        if (id === "email") {
            setEmail(value);
        }
        if (id === "password") {
            setPassword(value);
        }
        if (id === "address") {
            setAddress(value);
        }
    }
    async function handleSubmit() {
        console.log(userName)
        console.log(email)
        console.log(phone)
        console.log(password)
        console.log(address);
        const jsonData = {
            "name": userName,
            "email": email,
            "phone": phone,
            "address": address,
            "password": password,
        }
        console.log('json:', jsonData)

        const res = await fetch("http://localhost:3000/users", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData),
        })
        // console.log('response:', res);
        const data = await res.json();
        console.log('data:', data);
        navigate("/login");
    }
    return (
        <div className="container">
        <div className="form">
      <Header/>
            <div className="form-body">
                <div className="username">
                    <label className="form__label" name="userName">User Name </label>
                    <input className="form__input" type="text" value={userName} onChange={(e) => handleInputChange(e)} id="userName" placeholder="Users Name" />
                </div>
                <div className="email">
                    <label className="form__label" name="email">Email </label>
                    <input type="text" name="" id="email" value={email} className="form__input" onChange={(e) => handleInputChange(e)} placeholder="Email" />
                </div>
                <div className="phone">
                    <label className="form__label" name="phone">Phone Number </label>
                    <input type="email" id="phone" className="form__input" value={phone} onChange={(e) => handleInputChange(e)} placeholder="Phone Number" />
                </div>
                <div className="address">
                    <label className="form__label" name="address"> Address </label>
                    <input className="form__input" type="address" id="address" value={address} onChange={(e) => handleInputChange(e)} placeholder="Address" />
                </div>
                <div className="password">
                    <label className="form__label" name="password">Password </label>
                    <input className="form__input" type="password" id="password" value={password} onChange={(e) => handleInputChange(e)} placeholder="Password" />
                </div>
            </div>
            <div className="footer">
                <button onClick={() => handleSubmit()} type="submit" className="btn">Sign Up</button>
            </div>
            <div>
                <h5>Already have an account? </h5>
                <Link to="/">Sign In </Link>
            </div>
        </div>
        </div>
    )
}
export default RegistrationForm;