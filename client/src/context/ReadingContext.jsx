import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios.js";

const ReadingContext = createContext();

export const ReadingProvider = ({ children }) => {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReadings = async () => {
        try {
            const res = await API.get("/user/readings");

            if (res.data.success) {
                setReadings(res.data.data);
            }
        } catch (error) {
            console.log("Error fetching readings:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReadings();
    }, []);

    return (
        <ReadingContext.Provider value={{ readings, loading, fetchReadings }}>
            {children}
        </ReadingContext.Provider>
    );
};

export const useReadings = () => useContext(ReadingContext);