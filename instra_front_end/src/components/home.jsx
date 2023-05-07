import React, { useState, useEffect } from "react";
import NavBar from './NavBar/NavBar';
import './style.css';
import {  Link } from "react-router-dom";
// import HandleLike from "./HandleLike";


const Home = () => {
    const [photos, setPhotos] = useState([]);
    const [like, setLike] = useState('');

    const cookie = document.cookie;


    useEffect(() => {
        getData();
    }, [like])

    async function getData() {
        const response = await fetch("http://localhost:3000/auth")
        const json = await response.json();
        setPhotos(json);
    }
    async function handleLike(id, liked) {

      const jsonData = {
        "like": liked,
      }
      const res = await fetch(`http://localhost:3000/photos/${id}`, {
            method: 'PUT',
            headers: ({ 'Content-Type': 'application/json',
            Authorization: 'Bearer ' +cookie
           }),
            body: JSON.stringify(jsonData), 
        })
        const data = await res.json();
        setLike(data)
    }
    return (
      <div className="container">
          <NavBar />
          <br />
          <h1>Users Uploaded Photos </h1>
      <div className='row'>
        {photos.length > 0 && (
        <ul>
        {photos.map((photo) => (
          <div className='column' key={photo.id}>
            <img src={`http://localhost:3000/${photo.name}`} height= '300' width='300' alt='img' />
            <div className="footer">
                <button onClick={() => handleLike(photo.id, photo.like)} > like </button>
            </div>
            <p>{photo.like}  {"Likes"}</p>
            <p>Caption: {photo.description}</p>
            {/* <p>User: {photo.user.id}</p> */}
            <Link to="/userProfile" state = {{name: photo.user.name}}>User: {photo.user.name}</Link>
          </div>
        ))}
        </ul>
        )}
      </div>
      </div>
    );
};

export default Home;