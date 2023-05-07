import React from 'react';
import {  Link } from "react-router-dom";

function NavBar() {
  return (
    <div className='nav'>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/user">User Profile</Link>
    </li>
    <li>
      <Link to="/logOut">Log Out</Link>
    </li>
  </div>
  );
}

export default NavBar;