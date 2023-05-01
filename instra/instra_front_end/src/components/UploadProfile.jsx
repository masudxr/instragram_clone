import React, {useState} from "react";
import { useNavigate } from "react-router-dom";


const UploadProfile = () => {
  const [image, setImage] = useState(' ')

  const navigate = useNavigate();
  const photoId = 14;

    async function handleSubmit() {
        const jsonData = {
            "name": image.name,
        }
        console.log('json:', jsonData)

        await fetch(`http://localhost:3000/profile/${photoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData ),
        })
        // const data = await res.json();
        // console.log('data:', data);
        // navigate("/user");

    }

    return (
        <div>
        <form>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*"/>
            <h1 onClick={() => handleSubmit()} className="btn">Submit</h1>
        </form>
        </div>
    )
 
};

export default UploadProfile;