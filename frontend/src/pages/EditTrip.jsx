import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function EditTrip() {
  const location = useLocation();
  const navigate = useNavigate();

  const trip = location.state?.trip;

  const [destination, setDestination] = useState(trip?.destination || "");
  const [startDate, setStartDate] = useState(
    trip?.startDate?.slice(0, 10) || ""
  );
  const [endDate, setEndDate] = useState(
    trip?.endDate?.slice(0, 10) || ""
  );
  const [story, setStory] = useState(trip?.story || "");
  const [expense, setExpense] = useState(trip?.expense || "");
  const [rating, setRating] = useState(trip?.rating || "");

  if (!trip) {
    return <p>Trip not found.</p>;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedTrip = {
      destination,
      startDate,
      endDate,
      story,
      expense,
      rating,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/trips/" + trip._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTrip),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Trip updated successfully! ✏️");
        navigate("/");
      } else {
        alert(data.message || "Failed to update trip");
      }
    } catch (error) {
      console.error(error);
      alert("Server se connection nahi ho pa raha.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-icon">✏️</div>

        <h1>Edit Trip</h1>
        <p>Update your travel memories</p>

        <form onSubmit={handleUpdate}>

          <label>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />

          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <label>Travel Story</label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows="5"
            required
          />

          <label>Expenses (₹)</label>
          <input
            type="number"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
            min="0"
          />

          <label>Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">Select rating</option>
            <option value="1">⭐ 1</option>
            <option value="2">⭐⭐ 2</option>
            <option value="3">⭐⭐⭐ 3</option>
            <option value="4">⭐⭐⭐⭐ 4</option>
            <option value="5">⭐⭐⭐⭐⭐ 5</option>
          </select>

          <button type="submit">Update Trip</button>

        </form>

        <button onClick={() => navigate("/")}>
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

export default EditTrip;