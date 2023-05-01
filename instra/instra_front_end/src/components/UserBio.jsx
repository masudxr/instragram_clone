import React, { useState, useEffect } from 'react';
import BioHeader from './BioHeader';
import { useNavigate } from "react-router-dom";
import './style.css';


function UserBio() {
    const navigate = useNavigate();

    let [userName, setUserName] = useState(null);
    let [email, setEmail] = useState(null);
    let [phone, setPhone] = useState(null);
    let [address, setAddress] = useState(null);
    let [password, setPassword] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getProfile();
    }, [])


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
    const USERID = 9;
    async function getProfile() {
        const response = await fetch(`http://localhost:3000/users/${USERID}`)
        const json = await response.json();
        console.log('json', json);
        console.log('User ID:', USERID)
        setUsers(json);
    }
    async function handleSubmit() {
        console.log(userName)
        console.log(email)
        console.log(phone)
        console.log(password)
        console.log(address);
        if (userName == null) {
            userName = users.name
        }
        if (email == null) {
            email = users.email
        }        
        if (phone == null) {
            phone = users.phone
        }        
        if (password == null) {
            password = users.password
        }        
        if (address == null) {
            address = users.address
        }        
        const jsonData = {
            "name": userName,
            "email": email,
            "phone": phone,
            "address": address,
            "password": password,
        }
        console.log('json:', jsonData)

       const res = await fetch(`http://localhost:3000/users/${USERID}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(jsonData),
        })
        const data = await res.json();
        console.log('data:', data);
        navigate("/user");
    }
    return (
        <div className="container">
        <div className="form">
      <BioHeader/>
            <div className="form-body">
                <div className="username">
                    <label className="form__label" name="userName">User Name </label>
                    <input className="form__input" type="text" value={userName} onChange={(e) => handleInputChange(e)} id="userName" placeholder={users.name} />
                </div>
                <div className="email">
                    <label className="form__label" name="email">Email </label>
                    <input type="text" name="" id="email" value={email} className="form__input" onChange={(e) => handleInputChange(e)} placeholder={users.email} />
                </div>
                <div className="phone">
                    <label className="form__label" name="phone">Phone Number </label>
                    <input type="email" id="phone" className="form__input" value={phone} onChange={(e) => handleInputChange(e)} placeholder={users.phone} />
                </div>
                <div className="address">
                    <label className="form__label" name="address"> Address </label>
                    <input className="form__input" type="address" id="address" value={address} onChange={(e) => handleInputChange(e)} placeholder={users.address} />
                </div>
                <div className="password">
                    <label className="form__label" name="password">Password </label>
                    <input className="form__input" type="password" id="password" value={password} onChange={(e) => handleInputChange(e)} placeholder={users.password} />
                </div>
            </div>
            <div className="footer">
                <button onClick={() => handleSubmit()} type="submit" className="btn">Update Profile</button>
            </div>
        </div>
        </div>
    )
}
export default UserBio;