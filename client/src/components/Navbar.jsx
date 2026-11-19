import { NavLink } from "react-router-dom"

export const Navbar = () =>{

    return <div className="navbar">
          <h2 className="sweety-logo">Sweety</h2>
          <div className="navlinks-container">
                <NavLink to="/dashboard">Home</NavLink>
                <NavLink to="/reports">Reports</NavLink>
          </div>
          
    </div>
}