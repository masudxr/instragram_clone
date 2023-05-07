import React, {useEffect, useState} from "react";
import NavBar from './NavBar/NavBar';
import {useLocation} from 'react-router-dom';


const UsersProfile = () => {
  const [users, setUsers] = useState([]);
  const [photos, setPhotos] = useState([]);

  const cookie = document.cookie;
const location = useLocation()
const Name = location.state.name

  useEffect(() => {
    getProfile();
}, )


  async function getProfile() {
    const response = await fetch(`http://localhost:3000/users/profile/${Name}`)
    const userProfile = await response.json();
    setUsers(userProfile);
    getUploads()
  }

  async function getUploads() {
    const id = users.id;
    const response = await fetch(`http://localhost:3000/photos/uploaded/${id}`, {
      headers: ({
        Authorization: 'Bearer ' +cookie
      })
    })
    const json = await response.json();
    setPhotos(json);

  }
  return (
    <div className="container">
      <NavBar />
      <br/>

      <h2>Welcome to {users.name}'s Profile</h2>
      <br/>
      <div>
      <ul>
          <h2>User Name: {users.name}</h2>
          {/* <img src={`http://localhost:3000/profile/${users.profile.name}`} height= '300' width='300' alt='img' /> */}
          <h1>Contact: {users.email}</h1>
      </ul>
      </div>
      <br/>
      <div>
        <h1>Uploaded {users.name}'s More Photos !!</h1>
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

export default UsersProfile;