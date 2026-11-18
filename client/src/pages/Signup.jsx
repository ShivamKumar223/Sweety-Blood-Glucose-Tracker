import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import API from "../api/axios.js";

export const SignupPage = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({ name: "", email: "", password: "", tempPassword: "" });

    const handleSubmit = async (e)=>{
        e.preventDefault();

        // check if any empty field exist?
        for(let p in data)
        {
            if(data[p].trim() === "")
            {
                toast.warning("All field is required");
                return;
            }
        }

        // check both password are same?
        if(data.password !== data.tempPassword)
        {
            toast.warning("Ensure both passwords are same");
            return;
        }

        try{
        const res = await API.post("/auth/signup",{
            name : data.name,
            email : data.email,
            password : data.password
         });

         if(res.data?.success)
         {
            toast.success(res.data.message);
            navigate("/");
         }
         else{ 
            toast.warning(res.data?.message);
         }

         console.log("Sign-up : ", res);
        }
        catch(error){
            toast.error("Registration failed");
        }
        
    }

    return <div className="container flex-center">
        <form onSubmit={handleSubmit}>
            <h1>Sign-up</h1>
            <input
                type="text"
                placeholder="Enter name"
                required
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <input
                type="email"
                placeholder="Enter email"
                required
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Enter password"
                required
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <input
                type="password"
                placeholder="Re-enter password"
                required
                value={data.tempPassword}
                onChange={(e) => setData({ ...data, tempPassword: e.target.value })}
            />
            <button type="submit">
                sign up
            </button>

            <p className="small-text">Already have an account? <NavLink to="/">Log in</NavLink></p>
        </form>
    </div>
}