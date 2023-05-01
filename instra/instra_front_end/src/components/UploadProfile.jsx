import React, {useEffect, useState} from "react";

const UploadProfile = () => {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState(null);
  const [image, setImage] = useState(' ')
  console.log('image', image);


//   useEffect(() => {
//     getProfile();
//     }, [])

    // const handleInputChange = (e) => {
    //     const { id, value } = e.target;
    //     if (id === "userName") {
    //         console.log('value:', value)
    //         setUserName(value);
    //     }
    // }

    async function handleSubmit() {
        // console.log('UserName: ', userName)

        // const jsonData = {
        //     "name": userName,
        // }
        // console.log('json:', jsonData)

        const res = await fetch(`http://localhost:3000/profile/13`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(image),
        })
        // console.log('response:', res);
        const data = await res.json();
        console.log('data:', data);
    }

    // const UserId = 9;

    // async function getProfile() {
    //     const response = await fetch(`http://localhost:3000/users/${UserId}`)
    //     const json = await response.json();
    //     console.log('json', json);
    //     setUsers(json);
    // }
    return (
        <div>
        {/* <form action="/user"> */}
        <form>
            {/* <label id="img"name="userName" >Select profile:</label> */}
            <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*"/>
            {/* <input onClick={() => handleSubmit()} type="submit"/> */}
            <h1 onClick={() => handleSubmit()} type="submit" className="btn">Submit</h1>
        </form>
        </div>
    )

};

export default UploadProfile;