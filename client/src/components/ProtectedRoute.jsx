import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import API from "../api/axios";

export const ProtectedRoute = ()=>{
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

        // User verification function
    const verifyUser = async ()=>{
        try{
            const res = await API.get("/user/verify");

        }catch(error)
        {
            console.log("Error:", error);
            console.log("Response:", error.response?.data);
            console.log("Status:", error.response?.status);
            navigate("/");
        }
        finally{
            setLoading(false);
        }
    }
    // check user is verified?
    useEffect(()=>{
        verifyUser()
    },[]);

    if(loading) return <p>Checking authentication...</p>;
    return <Outlet />
}