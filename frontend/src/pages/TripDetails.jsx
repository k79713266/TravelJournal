import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function TripDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const trip = location.state?.trip;
    const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Travel Journal", 20, 20);

    doc.setFontSize(14);
    doc.text(`Destination: ${trip.destination}`, 20, 40);
    doc.text(`Start Date: ${trip.startDate.slice(0, 10)}`, 20, 50);
    doc.text(`End Date: ${trip.endDate.slice(0, 10)}`, 20, 60);
    doc.text(`Expense: Rs. ${trip.expense || 0}`, 20, 70);
    doc.text(`Rating: ${trip.rating || 0}/5`, 20, 80);

    doc.setFontSize(12);
    doc.text("Travel Story:", 20, 100);

    const storyLines = doc.splitTextToSize(
      trip.story || "No story available.",
      170
    );

    doc.text(storyLines, 20, 110);

    doc.save(`${trip.destination}-Travel-Journal.pdf`);
  };
  const getPhotoUrl = (photo) => {
  if (!photo) return "";

  if (photo.startsWith("http")) {
    return photo;
  }

  return "http://localhost:5000" + photo;
};

  if (!trip) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Trip Not Found</h1>

          <button onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-details-page">

      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <button
  className="back-button"
  onClick={exportPDF}
>
  📄 Export Trip as PDF
</button>

      <div className="trip-details-card">

        {/* Header */}
        <div className="trip-details-header">
          <p className="small-title">TRAVEL MEMORY</p>

          <h1>{trip.destination}</h1>

          <p className="trip-date">
            📅 {trip.startDate.slice(0, 10)} →{" "}
            {trip.endDate.slice(0, 10)}
          </p>
        </div>

        {/* Trip Information */}
        <div className="trip-info">

          <div className="info-box">
            <span>💰</span>
            <div>
              <small>Total Expense</small>
              <strong>₹{trip.expense || 0}</strong>
            </div>
          </div>

          <div className="info-box">
            <span>⭐</span>
            <div>
              <small>Rating</small>
              <strong>{trip.rating}/5</strong>
            </div>
          </div>

        </div>

        {/* Story */}
        <div className="story-section">

          <h2>📝 My Travel Story</h2>

          <p>{trip.story}</p>

        </div>

        {/* Photos */}
       <div className="details-photos">

  <h2>📸 Travel Photos</h2>

  {trip.photos && trip.photos.length > 0 ? (
    <div className="details-photo-grid">
      {trip.photos.map((photo, index) => (
        <img
          key={index}
         src={getPhotoUrl(photo)}
          alt={`Travel memory ${index + 1}`}
        />
      ))}
    </div>
  ) : (
    <p>No photos added.</p>
  )}

</div>

      </div>
    </div>
  );
}

export default TripDetails;