import React, {useState} from "react";
// import { useNavigate } from "react-router-dom";


const FileUpload = () => {
//   const [users, setUsers] = useState([]);
  const [photoName, setPhotoName] = useState(null);
  const [photo, setPhoto] = useState(null);
//   const navigate = useNavigate();


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "photoName") {
            setPhotoName(value);
        }
        if (id === "photo") {
            setPhoto(value);
        }
    }
    // const USERID = 9;

    async function uploadFile() {
        console.log('photoName: ', photoName)
        console.log('photo: ', photo)
        const jsonData = {
            "name": photoName,
            "description": photo,
            "like": 0,
        }
        console.log('json:', jsonData)

        const res = await fetch("http://localhost:3000/photos", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData),
        })
        // console.log('response:', res);
        const data = await res.json();
        console.log('data:', data);
        // navigate("/user");
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
        <h2>Post New Photos</h2>
        <form>
            <label name="photoName" >Choose Photos:</label>
            <input type="file" value={photoName} onChange={(e) => handleInputChange(e)} multiple id="photoName" accept="image/*"/>
            <br/>
            <label name="photo">Photo Decriptions </label>
            <input type="text" value={photo} onChange={(e) => handleInputChange(e)} id="photo" placeholder="Photo Description" />
            <br/>
            <div className="footer">
            <button onClick={() => uploadFile()} type="submit" className="btn">Submit</button>
            </div>
        </form>
        </div>
    )

};

export default FileUpload;