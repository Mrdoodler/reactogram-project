import React from 'react'
import "./navbar.css"
import logo from "../images/logo.PNG"
import { NavLink,  useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

const Navbar = () => {

  const disptach = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.userReducer)

  const logout = ()=>{
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  disptach({type:"LOGIN_ERROR"});
  navigate("/login");
}

  return (
    <nav className="navbar bg-light shadow">
  <div className="container-fluid">
    <NavLink className="navbar-brand ms-5" to='/'>
      <img alt="logo" src={logo} height="45px"/>
    </NavLink>
    <form className="d-flex me-md-5" role='search'>
      <input className="form-control me-2 textmuted searchbox" type="search" placeholder="Search" />
      
      <NavLink className="nav-link text-dark fs-5" to="/" >
      <i class="fa-solid fa-magnifying-glass search-icon"></i>
      </NavLink>
      
      <NavLink className="nav-link text-dark fs-5" to="/posts" >
      <i class="fa-solid fa-house"></i>
      </NavLink>
      {
      localStorage.getItem("token") != null ?
      <NavLink className="nav-link text-dark fs-5" to="/" >
      <i class="fa-regular fa-heart"></i>
      </NavLink>:""
      }
      <div className="dropdown ">
            {localStorage.getItem("token") != null ?<>
            <a
              className="btn "
              href="/"
              role="button"
              data-bs-toggle="dropdown"
            >
              <img alt="profile pic" className="navbar-profile-pic" src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ludGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" />
            </a>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <NavLink className="dropdown-item mt-0" to="/myprofile" >My Profile</NavLink>
              </li>
              <li>
                <a className="dropdown-item" href="/" onClick={()=>logout()}>
                Logout
                </a>
              </li>
            </ul></>:""
            }
          </div>

    </form>
  </div>
</nav>
  )
}

export default Navbar
