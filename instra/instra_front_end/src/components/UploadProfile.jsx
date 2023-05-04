import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const UploadProfile = () => {
  const [image, setImage] = useState(' ')
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getProfile();
}, [])

  const cookie = document.cookie;

  const navigate = useNavigate();

  async function getProfile() {
    const response = await fetch(`http://localhost:3000/auth/profile`, {
      headers: ({
        Authorization: 'Bearer ' +cookie
      })
    })
    const userProfile = await response.json();
    console.log('userProfile', userProfile);
    setUsers(userProfile);
  }

    async function handleSubmit() {
        const jsonData = {
            "name": image.name,
        }
        console.log('json:', jsonData)
        const formdata = new FormData()
        formdata.append("file", image, image.name);
        const url = `http://localhost:3000/profile/${users.picID}`

        let res = await axios.put(url, formdata);
        console.log('response', res);
        navigate("/user");

        // const res = await fetch(`http://localhost:3000/profile/${users.picID}`, {
        //     method: 'PUT',
        //     headers: ({
        //         // Authorization: 'Bearer ' +cookie,
        //         'Content-Type': 'application/json' 
        //       }),
        //     body: JSON.stringify(formdata ),
        // })
        // const data = await res.json();
        // console.log('data:', data);


    }

    return (
        <div>
        <form>
            <input type="file" name="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*"/>
            <h1 onClick={() => handleSubmit()} className="btn">Submit</h1>
        </form>
        </div>
    )
 
};

export default UploadProfile;