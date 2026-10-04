import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/trips/" + user.id)
      .then((response) => response.json())
      .then((data) => {
        setTrips(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const totalTrips = trips.length;

  const totalExpense = trips.reduce(
    (total, trip) => total + Number(trip.expense || 0),
    0
  );

  const averageRating =
    totalTrips > 0
      ? (
          trips.reduce(
            (total, trip) => total + Number(trip.rating || 0),
            0
          ) / totalTrips
        ).toFixed(1)
      : 0;

  return (
    <div className="dashboard-page">

      <button onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className="dashboard-header">
        <p className="small-title">YOUR TRAVEL DASHBOARD</p>

        <h1>Welcome, {user?.name} 👋</h1>

        <p>Here's a summary of your travel journey.</p>
      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <span>✈️</span>
          <h2>{totalTrips}</h2>
          <p>Total Trips</p>
        </div>

        <div className="dashboard-card">
          <span>💰</span>
          <h2>₹{totalExpense}</h2>
          <p>Total Expenses</p>
        </div>

        <div className="dashboard-card">
          <span>⭐</span>
          <h2>{averageRating}/5</h2>
          <p>Average Rating</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;