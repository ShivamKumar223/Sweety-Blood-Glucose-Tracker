import { NavLink, useNavigate } from "react-router-dom";
import { useReadings } from "../context/ReadingContext.jsx";
import { useProfile } from "../context/ProfileContext.jsx";

import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import API from "../api/axios.js";
import { toast } from "react-toastify";

export const Dashboard = () => {
    const { readings, fetchReadings, loading } = useReadings();
    const { profile } = useProfile();
    const navigate = useNavigate();

    const handleEdit = (data)=>{
        navigate("/updateReading",{
            state: {...data}
        })
    }

    const handleDelete = async (id) =>{
        try{
            const res = await API.delete(`/user/reading/${id}`);
            if(res.data?.success)
            {
                fetchReadings();
                toast.success(res.data?.message);
            }

        }catch(error){
            toast.error(error?.response?.data?.message || "Delete failed");
        }
    }

    return (
        <div className="dashboard">

            {/* Welcome Section */}
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, {profile?.name || "User"}</h1>
                    <p>Here is an overview of your readings.</p>
                </div>
                <NavLink className="reading-button" to="/addNewReading"> + New Reading </NavLink>
            </div>

            {/* Readings Section */}
            <div className="readings-section">
                <h2 className="readings-heading">Your Readings</h2>

                {loading ? (
                    <p>Loading readings...</p>
                ) : readings?.length === 0 ? (
                    <p>No readings found.</p>
                ) : (
                    <div className="readings-flex">
                        {readings.map((reading) => (
                            <div className="reading-card" key={reading.id}>
                                <h3>{reading.time_slot}</h3>

                                <p className="reading-value">
                                    {reading.value} mg/dl
                                </p>

                                <p className="reading-date">
                                    {reading.date.split('T')[0]}
                                </p>
                                <div className="reading-card-edit-delete-container">
                                    <div onClick={() => handleEdit(reading)} className="edit"><FaRegEdit/></div>
                                    <div onClick={()=>handleDelete(reading.id)} className="delete"><MdOutlineDeleteOutline/></div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};