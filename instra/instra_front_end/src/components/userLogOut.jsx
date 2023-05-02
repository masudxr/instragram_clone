async function LogOut () {

await fetch(`http://localhost:3000/photos/auth/logout`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      return 'LogOut Successful !!'

};

export default LogOut;
