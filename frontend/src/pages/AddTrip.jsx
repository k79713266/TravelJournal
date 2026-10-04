import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTrip() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [story, setStory] = useState("");
  const [expense, setExpense] = useState("");
  const [rating, setRating] = useState("");
  const [photos, setPhotos] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const generateAIStory = async () => {
  if (!destination || !startDate || !endDate || !story) {
    alert("Please fill destination, dates and your memory first!");
    return;
  }

  setAiLoading(true);

  try {
    const response = await fetch(
      "http://localhost:5000/api/ai/generate-story",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          story,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setStory(data.story);
      alert("✨ AI Travel Story Generated!");
    } else {
      alert(data.message || "AI story generate nahi ho paayi.");
    }
  } catch (error) {
    console.error(error);
    alert("AI server se connection nahi ho pa raha.");
  } finally {
    setAiLoading(false);
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first!");
    navigate("/login");
    return;
  }

  const formData = new FormData();

  formData.append("userId", user.id);
  formData.append("destination", destination);
  formData.append("startDate", startDate);
  formData.append("endDate", endDate);
  formData.append("story", story);
  formData.append("expense", expense);
  formData.append("rating", rating);

  photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  try {
    const response = await fetch(
      "http://localhost:5000/api/trips/add",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Trip and photos saved successfully! 🎉");
      navigate("/");
    } else {
      alert(data.message || "Failed to save trip");
    }
  } catch (error) {
    console.error(error);
    alert("Server se connection nahi ho pa raha.");
  }
};
  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-icon">✈️</div>

        <h1>Add New Trip</h1>
        <p>Save your travel memories</p>

        <form onSubmit={handleSubmit}>

          <label>Destination</label>
          <input
            type="text"
            placeholder="e.g. Manali"
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
          
            placeholder="Write about your trip..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows="5"
            required
          />
          <button
  type="button"
  onClick={generateAIStory}
  disabled={aiLoading}
>
  {aiLoading ? "✨ Generating..." : "✨ Generate AI Story"}
</button>

          <label>Expenses (₹)</label>
          <input
            type="number"
            placeholder="e.g. 5000"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
            min="0"
          />

          <label>Travel Photos</label>

<input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => setPhotos(Array.from(e.target.files))}
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

          <button type="submit">Save Trip</button>

        </form>

        <button onClick={() => navigate("/")}>
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

export default AddTrip;