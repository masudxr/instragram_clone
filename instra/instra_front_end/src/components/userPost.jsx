import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const FileUpload = () => {
  const [users, setUsers] = useState([]);
  const [photo, setPhoto] = useState(' ');
  const [description, setDescrption] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    getProfile();
}, [])

const cookie = document.cookie;

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

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "description") {
            console.log('get 2nd id', id);
            setDescrption(value);
        }
    }

    async function uploadFile() {
        console.log('photoName: ', photo)
        console.log('photo: ', description)
        console.log('user name: ', users.name)
        const formdata = new FormData ();
        formdata.append('file', photo, photo.name);
        formdata.append('body', description)

        const url = `http://localhost:3000/photos`

        let res = await axios.post(url, formdata, {
          headers: ({
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' +cookie
        })
        });
        console.log('response', res.data);
        navigate("/user");
    }

    return (
        <div>
        <h2>Post New Photos</h2>
        <form>
            <label name="photo" >Choose Photos:</label>
            <input type="file" name="file" onChange={(e) => setPhoto(e.target.files[0])} accept="image/*"/>
            <br/>
            <label name="description">Photo Decriptions </label>
            <input type="text" name="description" value={description} onChange={(e) => handleInputChange(e)} id="description" placeholder="Photo Description" />
            <br/>
            <div className="footer">
            <h3 onClick={() => uploadFile()} type="submit" className="btn">Submit</h3>
            </div>
        </form>
        </div>
    )

};

export default FileUpload;