import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const periods = [
  { start: "09:20", end: "09:55", period: 1 },
  { start: "10:20", end: "10:55", period: 2 },
  { start: "11:20", end: "11:55", period: 3 },
  { start: "13:00", end: "13:30", period: 4 },
  { start: "14:10", end: "14:30", period: 5 },
  { start: "15:10", end: "15:30", period: 6 },
  { start: "16:00", end: "16:25", period: 7 }
];

const SingleStudentAttendance = ({ rollNumber }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`/api/attendance/attendance/${rollNumber}`);
        setAttendanceData(response.data);
        setFilteredData(response.data); // Initialize with all data
      } catch (error) {
        if (error.response) {
          setError(`${error.response.data.message || error.response.data}`);
        } else {
          setError('Error fetching attendance data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [rollNumber]);

  const handleFilter = () => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const filtered = attendanceData.filter(({ date }) => {
      const recordDate = new Date(date);
      return recordDate >= from && recordDate <= to;
    });
    setFilteredData(filtered);
  };

  const groupedData = filteredData.reduce((acc, curr) => {
    const { date, dayOfWeek, period, status } = curr;

    if (!acc[date]) {
      acc[date] = { dayOfWeek, periods: Array(7).fill('N/A') }; // Default to 'N/A'
    }

    const normalizedStatus = (status || 'N/A').trim().toUpperCase();
    acc[date].periods[period - 1] = normalizedStatus;
    return acc;
  }, {});

  const dates = Object.keys(groupedData);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleDownloadPDF = () => {
    // Use the filteredData (filtered attendance data based on date range)
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text(`Attendance Report for Roll Number ${rollNumber}`, 14, 20);
  
    const headers = ['Date and Day', 'Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Exit'];
  
    // Group the filtered data based on the same logic used for rendering the table
    const groupedFilteredData = filteredData.reduce((acc, curr) => {
      const { date, dayOfWeek, period, status } = curr;
  
      if (!acc[date]) {
        acc[date] = { dayOfWeek, periods: Array(7).fill('N/A') }; // Default to 'N/A'
      }
  
      const normalizedStatus = (status || 'N/A').trim().toUpperCase();
      acc[date].periods[period - 1] = normalizedStatus;
      return acc;
    }, {});
  
    const dates = Object.keys(groupedFilteredData);

    const tableData = dates.map((date) => {
      const { dayOfWeek, periods } = groupedFilteredData[date];
      return [`${date} (${dayOfWeek})`, ...periods];
    });
  
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      margin: { horizontal: 14 },
      theme: 'striped',
    });
  
    doc.save(`attendance_${rollNumber}.pdf`);
  };
  

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Attendance for Roll Number {rollNumber}</h2>
      <div className="d-flex justify-content mb-3">
        <div>
          <label>From Date:</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label>To Date:</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="align-self-end">
          <button className="btn btn-primary" onClick={handleFilter}>
            Filter
          </button>
        </div>
      </div>
      <button className="btn btn-primary mb-3" onClick={handleDownloadPDF}>
        Download Attendance as PDF
      </button>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Date and Day</th>
            <th>Period 1</th>
            <th>Period 2</th>
            <th>Period 3</th>
            <th>Period 4</th>
            <th>Period 5</th>
            <th>Period 6</th>
            <th>Exit</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((date) => {
            const { dayOfWeek, periods } = groupedData[date];
            return (
              <tr key={date}>
                <td>{`${date} (${dayOfWeek})`}</td>
                {periods.map((status, periodIndex) => {
                  const normalizedStatus = (status || 'N/A').trim().toUpperCase();

                  let color = 'blue'; 
                  if (normalizedStatus === 'PRESENT') color = 'green';
                  if (normalizedStatus === 'ABSENT') color = 'red';

                  return (
                    <td key={periodIndex} style={{ color }}>
                      {status}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        
      </table>
    </div>
  );
};

export default SingleStudentAttendance;
