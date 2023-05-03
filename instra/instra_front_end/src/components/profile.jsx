import React, {useEffect, useState} from "react";
import NavBar from './NavBar';
import { Link } from "react-router-dom";


const User = () => {
  const [users, setUsers] = useState([]);
  const [photos, setPhotos] = useState([]);

  const cookie = document.cookie;

  useEffect(() => {
    getProfile();
    getUploads();
}, [])

  async function getProfile() {
    const response = await fetch(`http://localhost:3000/auth/profile`, {
      headers: ({
        Authorization: 'Bearer ' +cookie
      })
    })
    const json = await response.json();
    console.log('json', json);
    setUsers(json);
  }
  async function getUploads() {
    const response = await fetch(`http://localhost:3000/photos/user`, {
      headers: ({
        Authorization: 'Bearer ' +cookie
      })
    })
    const json = await response.json();
    // console.log('user uploaded photos:', json);
    // console.log('user uploaded photos:', json[0]);
    setPhotos(json);
  }
  return (
    <div className="container">
      <NavBar />
      <br/>

      <h2>Welcome to {users.name}'s' Profile</h2>
      <br/>
      <div>
      <ul>
          <h2>Name: {users.name}</h2>
          <img src={`http://localhost:3000/profile/${users.pic}`} height= '300' width='300' alt='img' />
          <Link to="/upload">Upload Profile </Link>
          <h1>Email: {users.email}</h1>
          <h1>Phone: {users.phone}</h1>
      </ul>
      </div>
      <Link to="/updateBio">Update Info </Link>
      <Link to="/post">New Post</Link>
      <br/>
      <div>
        <h1>Uploaded Users All Photos !!</h1>
        {photos.length > 0 && (
        <ul>
        {photos.map((photo) => (
          <div className='column' key={photo.photo_id}>
            <img src={`http://localhost:3000/${photo.photo_name}`} height= '300' width='300' alt='img' />
            <p>Like: {photo.photo_like}</p>
            <p>Caption: {photo.photo_description}</p>
          </div>
        ))}
        </ul>
        )}
      </div>

    </div>
  );
};

export default User;