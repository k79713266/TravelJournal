import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch(API_URL + "/api/trips/" + user.id)
      .then((response) => response.json())
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Profile error:", error);
        setLoading(false);
      });
  }, [navigate, user]);

  const totalExpenses = trips.reduce(
    (total, trip) => total + Number(trip.expense || 0),
    0
  );

  const averageRating =
    trips.length > 0
      ? (
          trips.reduce(
            (total, trip) => total + Number(trip.rating || 0),
            0
          ) / trips.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <div className="dashboard-header">
        <p className="small-title">MY PROFILE</p>

        <h1>{user?.name || "Traveler"}</h1>

        <p>{user?.email}</p>
      </div>

      <div className="dashboard-stats">

        <div className="stat-card">
          <span>🧳</span>
          <h2>{trips.length}</h2>
          <p>Total Trips</p>
        </div>

        <div className="stat-card">
          <span>💰</span>
          <h2>₹{totalExpenses}</h2>
          <p>Total Expenses</p>
        </div>

        <div className="stat-card">
          <span>⭐</span>
          <h2>{averageRating}</h2>
          <p>Average Rating</p>
        </div>

      </div>

      <div className="trip-details-card">

        <h2>🌍 Travel Profile</h2>

        <p>
          Welcome, <strong>{user?.name}</strong>! Keep exploring new
          destinations and creating beautiful travel memories.
        </p>

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          View My Trips →
        </button>

      </div>

    </div>
  );
}

export default Profile;