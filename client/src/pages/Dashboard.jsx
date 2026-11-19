import { NavLink, useNavigate } from "react-router-dom";
import { useReadings } from "../context/ReadingContext.jsx";
import { useProfile } from "../context/ProfileContext.jsx";

export const Dashboard = () => {
    const { readings, loading } = useReadings();
    const { profile } = useProfile();
    const navigate = useNavigate();

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
                                    {reading.value}
                                </p>

                                <p className="reading-date">
                                    {reading.date.split('T')[0]}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};