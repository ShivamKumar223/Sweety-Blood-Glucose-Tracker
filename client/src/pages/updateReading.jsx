import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useReadings } from "../context/ReadingContext";

export const UpdateReading =  () => {
    const { fetchReadings } = useReadings();
    const location = useLocation();
    // console.log(location);
    const [readingData, setReadingData] = useState({...location?.state, date:location?.state?.date.split('T')[0]});

    const handleSubmit = async (e) =>{
        e.preventDefault();
        console.log(readingData);
        try{
        const res = await API.put(`/user/reading/${location?.state?.id}`, {
            time_slot:readingData.time_slot, 
            date:readingData.date, 
            value: readingData.value===""?undefined:Number(readingData.value)
        });
        if(res.data?.success){
            fetchReadings();
            toast.success(res.data.message)
        }
        }
        catch(error){
            // console.log(error.response);
            console.log(readingData.date);
            toast.error(error?.response?.data?.message);
        }

    }
    return <div className="dashboard">
        <form onSubmit={handleSubmit}>
            <select className="select"
                value={readingData.time_slot}
                onChange={(e)=> setReadingData({...readingData, time_slot:e.target.value})}
            >
                <option value="">Select time slot</option>
                <option value="Morning">Morning</option>
                <option value="After breakfast">After breakfast</option>
                <option value="After lunch">After lunch</option>
                <option value="After dinner">After dinner</option>
            </select>
            <input 
                type="date" 
                placeholder="Select date"
                value={readingData.date}
                onChange={(e)=> setReadingData({...readingData, date:e.target.value})}
            />
            <input 
                type="number"  
                placeholder="Enter reading value"
                value={readingData.value}
                onChange={(e)=> setReadingData({...readingData, value:Number(e.target.value)})}
                min={40}
                max={600}
            /> <spam className="unit">mg/dl</spam>
            <button 
                className="button" 
                type="submit"
            >
                Update Reading
            </button>
        </form>
    </div>
}