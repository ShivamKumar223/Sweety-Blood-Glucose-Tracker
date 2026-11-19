
import { useState } from "react";
import { useReadings } from "../context/ReadingContext";

export const Reports = () => {
    const { readings, loading } = useReadings();
    const [intendedReadings, setIntendedReading] = useState([]);
    const [reportType, setReportType] = useState("daily");
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().slice(0, 7);
    });

    const [report, setReport] = useState(null);
    const [error, setError] = useState("");

    const getDateRange = () => {
        if (reportType === "daily") {
            return {
                startDate: selectedDate,
                endDate: selectedDate
            };
        }

        if (reportType === "mtd") {
            const year = selectedDate.slice(0, 4);
            const month = selectedDate.slice(5, 7);

            return {
                startDate: `${year}-${month}-01`,
                endDate: selectedDate
            };
        }

        if (reportType === "monthly") {
            const [year, month] = selectedMonth.split("-").map(Number);

            const startDate = `${selectedMonth}-01`;

            // Last day of selected month
            const lastDay = new Date(year, month, 0).getDate();

            const endDate = `${selectedMonth}-${String(lastDay).padStart(2, "0")}`;

            return { startDate, endDate };
        }
    };

    const handleViewReport = async () => {
        setError("");
        setReport(null);
        
        const { startDate, endDate } = getDateRange();
            if (intendedReadings.length === 0) {
                setReport({
                    intendedReadings: [],
                    total: 0,
                    highest: null,
                    lowest: null,
                    average: null,
                    startDate,
                    endDate
                });
                return;
            }
            if(reportType == "daily")
            {
                
            }

            const values = intendedReadings.map(r => Number(r.value));

            const total = values.length;
            const highest = Math.max(...values);
            const lowest = Math.min(...values);
            const average = values.reduce((sum, val) => sum + val, 0) / total;

            setReport({
                intendedReadings,
                total,
                highest,
                lowest,
                average,
                startDate,
                endDate
            });
    };

    return (
        <div className="reports-page">
            <h1>Reports</h1>
            <p>View and analyze your glucose readings.</p>

            {/* Report Type */}
            <div className="report-controls">
                <div className="form-group">
                    <label>Report Type</label>

                    <select
                        value={reportType}
                        onChange={(e) => {
                            setReportType(e.target.value);
                            setReport(null);
                        }}
                    >
                        <option value="daily">Daily Report</option>
                        <option value="mtd">Month-to-Date Report</option>
                        <option value="monthly">Monthly Report</option>
                    </select>
                </div>

                {/* Daily and MTD date */}
                {(reportType === "daily" || reportType === "mtd") && (
                    <div className="form-group">
                        <label>Select Date</label>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setReport(null);
                            }}
                        />
                    </div>
                )}

                {/* Monthly selection */}
                {reportType === "monthly" && (
                    <div className="form-group">
                        <label>Select Month</label>

                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value);
                                setReport(null);
                            }}
                        />
                    </div>
                )}

                <button
                    onClick={handleViewReport}
                    disabled={loading}
                    className="view-report-btn"
                >
                    {loading ? "Loading..." : "View Report"}
                </button>
            </div>

            {/* Error */}
            {error && <p className="error-message">{error}</p>}

            {/* Report Result */}
            {report && (
                <div className="report-result">

                    <h2>
                        {reportType === "daily"
                            ? "Daily Report"
                            : reportType === "mtd"
                            ? "Month-to-Date Report"
                            : "Monthly Report"}
                    </h2>

                    <p>
                        {report.startDate} to {report.endDate}
                    </p>

                    {/* Summary Cards */}
                    <div className="report-summary">

                        <div className="report-card">
                            <h3>Total Readings</h3>
                            <p>{report.total}</p>
                        </div>

                        <div className="report-card">
                            <h3>Highest</h3>
                            <p>
                                {report.highest ?? "--"} mg/dL
                            </p>
                        </div>

                        <div className="report-card">
                            <h3>Lowest</h3>
                            <p>
                                {report.lowest ?? "--"} mg/dL
                            </p>
                        </div>

                        <div className="report-card">
                            <h3>Average</h3>
                            <p>
                                {report.average !== null
                                    ? report.average.toFixed(1)
                                    : "--"} mg/dL
                            </p>
                        </div>

                    </div>

                    {/* Individual readings: Daily report only */}
                    {reportType === "daily" && (
                        <div className="daily-Readings">
                            <h3>Daily Readings</h3>

                            {report.intendedReadings.length === 0 ? (
                                <p>No readings found for this date.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Time Slot</th>
                                            <th>Reading</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {report.intendedReadings.map((reading) => (
                                            <tr key={reading.id}>
                                                <td>{reading.time_slot}</td>
                                                <td>
                                                    {reading.value} mg/dL
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
