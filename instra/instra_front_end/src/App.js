import './App.css';
import LoginForm from './components/login';
import RegistrationForm from './components/registrationForm';
import Home from './components/home';
import User from './components/profile';
import LogOut from './components/userLogOut';
import UploadProfile from './components/UploadProfile';
import FileUpload from './components/userPost';
import UserBio from './components/UpdateBio';
import { Route, BrowserRouter as Router, Routes} from "react-router-dom";
import UsersProfile from './components/userProfile';


export default function App() {

  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/user" element={<User />} />
        <Route path="/userProfile" element={<UsersProfile />} />
        <Route path="/logOut" element={<LogOut />} />
        <Route path="/upload" element={<UploadProfile />} />
        <Route path="/updateBio" element={<UserBio />} />
        <Route path="/post" element={<FileUpload />} />
        {/* <Route path="/multipost" element={<FileUploadPage />} /> */}
      </Routes>
      </Router>
      
    </div>
  );
}
