import React, { useState, useEffect } from "react";
import NavBar from './NavBar';
import './style.css';
import {  Link } from "react-router-dom";



function Home() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        getData();
    }, [])

    async function getData() {
        const response = await fetch("http://localhost:3000/auth")
        const json = await response.json();
        setPhotos(json);
    }
    async function handleSubmit(id, liked) {
       console.log('id:', id);
       console.log('liked:', liked);

      const jsonData = {
        "like": liked+1,
      }
      const res = await fetch(`http://localhost:3000/photos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData), 
        })
        const data = await res.json();
        console.log('Updated data:', data);
    }
    return (
      <div className="container">
          <NavBar />
          <h1>Users Uploaded Photos </h1>
      <div className='row'>
        {photos.length > 0 && (
        <ul>
        {photos.map((photo) => (
          <div className='column' key={photo.id}>
            <img src={`http://localhost:3000/${photo.name}`} height= '300' width='300' alt='img' />
            <div className="footer">
                <button onClick={() => handleSubmit(photo.id, photo.like)} > Like </button>
            </div>
            <p>{photo.like}  {"Likes"}</p>
            <p>Caption: {photo.description}</p>
            {/* <p>User: {photo.user.id}</p> */}
            {/* <Link to="/user">User: {photo.user.name}</Link> */}
          </div>
        ))}
        </ul>
        )}
      </div>
      </div>
    );
};

export default Home;