import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
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
        console.error("Error fetching trips:", error);
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
      : "0.0";

  return (
    <div className="profile-page">

      <button
        className="profile-back-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <div className="profile-card">

        <div className="profile-avatar">
          👤
        </div>

        <h1>{user?.name}</h1>
        <p className="profile-email">{user?.email}</p>

        <div className="profile-stats">

          <div className="profile-stat">
            <span>✈️</span>
            <h2>{totalTrips}</h2>
            <p>Total Trips</p>
          </div>

          <div className="profile-stat">
            <span>💰</span>
            <h2>₹{totalExpense}</h2>
            <p>Total Expenses</p>
          </div>

          <div className="profile-stat">
            <span>⭐</span>
            <h2>{averageRating}/5</h2>
            <p>Average Rating</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;
