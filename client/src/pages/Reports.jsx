
import { useState } from "react";
import { useReadings } from "../context/ReadingContext";

export const Reports = () => {
    const { readings, loading } = useReadings();

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

    // Get date range according to report type
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

            // Get last day of the selected month
            const lastDay = new Date(year, month, 0).getDate();

            const endDate = `${selectedMonth}-${String(lastDay).padStart(2, "0")}`;

            return {
                startDate,
                endDate
            };
        }
    };

    // Generate report
    const handleViewReport = () => {
        setError("");
        setReport(null);

        const { startDate, endDate } = getDateRange();

        // Filter readings according to selected date range
        const intendedReadings = readings.filter((reading) => {
            const readingDate = new Date(reading.date)
                .toLocaleDateString("en-CA");

            if (reportType === "daily") {
                return readingDate === selectedDate;
            }

            return readingDate >= startDate && readingDate <= endDate;
        });

        // If no readings are found
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

        // Extract reading values
        const values = intendedReadings.map((reading) =>
            Number(reading.value)
        );

        // Calculate report statistics
        const total = values.length;
        const highest = Math.max(...values);
        const lowest = Math.min(...values);

        const average =
            values.reduce((sum, value) => sum + value, 0) / total;

        // Store final report
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

            {/* Report Controls */}
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

                {/* Daily and MTD Date */}
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

                {/* Monthly Selection */}
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

                    
                </div>
            )}
        </div>
    );
};
