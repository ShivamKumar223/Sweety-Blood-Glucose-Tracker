import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"
import API from "../api/axios.js";
import { toast } from "react-toastify";

export const LoginPage = () => {
    const [data, setData] = useState({email:"", password:""});
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();

        for(let key in data)
        {
            if(data[key].trim() === "")
            {
                toast.warning("All fields are required");
                return;
            }
        }

    try{
        const res = await API.post("/auth/login", {
            email: data.email,
            password: data.password
        });

        if(res.data?.success){
            toast.success(res.data.message);
            navigate("/dashboard");
        }
        
    }
    catch(error)
    {
        // console.log("Error:", error);
        // console.log("Response:", error.response?.data);
        // console.log("Status:", error.response?.status);

        toast.error(error.response?.data?.message || "Login failed");
    }
    }

    return <div className="container flex-center">
          <form onSubmit={ handleSubmit }>
            <h1>Log-in</h1>
            <input 
                type="email" 
                placeholder="Enter email"
                required
                value={data.email}
                onChange={(e)=>setData({...data, email:e.target.value})}
            />
            <input 
                type="password" 
                placeholder="Enter password"
                required
                value={data.password}
                onChange={(e)=>setData({...data, password:e.target.value})}
            />
            <button className="button" type="submit">
                log in
            </button>

            <p className="small-text">Haven't an account? <NavLink to="/signup">Create an account</NavLink></p>
          </form>
    </div>
}