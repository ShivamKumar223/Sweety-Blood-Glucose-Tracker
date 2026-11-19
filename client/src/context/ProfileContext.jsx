import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios.js";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/user/profile");

            if (res.data.success) {
                setProfile(res.data.data);
            }
        }
        catch (error) {
            console.log("Profile fetch error:", error.response?.data || error.message);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, setProfile, loading, fetchProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);