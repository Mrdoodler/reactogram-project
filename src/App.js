import './App.css';
import Login from './pages/login';
import Signup from './pages/signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Postoverview from './pages/postoverview';
import Profile from './pages/profile';
import { NavLink,  useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';

function App() {

  function DynnamicRouting(){

    const disptach = useDispatch();
    const navigate = useNavigate();
  
    const user = useSelector(state => state.userReducer)
  
    useEffect(()=>{
  
      const userData =JSON.parse(localStorage.getItem("user"))
      if(userData){
        disptach({type: "LOGIN_SUCCESS", payload: userData})
        navigate("/posts");
      }
      else{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        disptach({type:"LOGIN_ERROR"});
        navigate("/login");
      }
    },[])
  
  return (
    <div className="app-bg">
    
      <Routes>
        <Route exact path="/" element={<Postoverview />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/posts" element={<Postoverview />} />
        <Route exact path="/myprofile" element={<Profile />} />
      </Routes>
    </div>
    )
  }
    return (
      <div className="app-bg">
      <Router>
        <Navbar />
        < DynnamicRouting />
      </Router>
      </div>
      );
  
}

export default App;
