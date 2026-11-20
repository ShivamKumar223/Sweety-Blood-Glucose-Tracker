import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useReadings } from "../context/ReadingContext";

export const AddNewReading =  () => {
    const { fetchReadings } = useReadings();
    const [readingData, setReadingData] = useState({time_slot:"", date:null, value:""});

    const handleSubmit = async (e) =>{
        e.preventDefault();

        try{
        const res = await API.post("/user/reading", {
            time_slot:readingData.time_slot, 
            date:readingData.date, 
            value: readingData.value===""?undefined:readingData.value
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
                Add Reading
            </button>
        </form>
    </div>
}