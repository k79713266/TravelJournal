import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import Weather from "../components/Weather";

function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [trips, setTrips] = useState([]);

  const [search, setSearch] = useState("");
const [ratingFilter, setRatingFilter] = useState("");
const filteredTrips = trips.filter((trip) => {
  const matchesSearch = trip.destination
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesRating =
    ratingFilter === "" ||
    trip.rating >= Number(ratingFilter);

  return matchesSearch && matchesRating;
});

  // Photo ka correct URL banane ke liye
 const getPhotoUrl = (photo) => {
  return "http://localhost:5000" + photo;
};

  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:5000/api/trips/" + user.id)
      .then((response) => response.json())
      .then((data) => {
        console.log("Trips from MongoDB:", data);
        setTrips(data);
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
      });
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <h2>🌍 Travel Journal</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          {user && <Link to="/dashboard">Dashboard</Link>}

          {user ? (
            <>
              <span>Hi, {user.name} 👋</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div>
          <p className="small-title">YOUR JOURNEY, YOUR STORY</p>

          <h1>
            Every journey has a
            <span> story to tell.</span>
          </h1>

          <p className="description">
            Save your travel memories, discover beautiful places,
            and create your own digital travel journal.
          </p>

          <Link to="/add-trip">
            <button className="start-btn">+ Add New Trip</button>
          </Link>
        </div>
      </section>
 
 <section className="map-section">
  <h2>🗺️ Explore Your Travel Map</h2>
  <MapView trips={trips} />
</section>
<section className="weather-section">
  <Weather />
</section>

      {/* Trips */}
      <section className="trips">
        <h2>Explore Your Journeys</h2>
        <div className="search-filter">

  <input
    type="text"
    placeholder="🔎 Search destination..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={ratingFilter}
    onChange={(e) => setRatingFilter(e.target.value)}
  >
    <option value="">All Ratings</option>
    <option value="5">⭐⭐⭐⭐⭐ 5</option>
    <option value="4">⭐⭐⭐⭐ 4+</option>
    <option value="3">⭐⭐⭐ 3+</option>
    <option value="2">⭐⭐ 2+</option>
    <option value="1">⭐ 1+</option>
  </select>

</div>

        <div className="trip-container">

          {trips.length === 0 ? (
  <p>No trips added yet.</p>
) : filteredTrips.length === 0 ? (
  <p>No trips found. 🔎</p>
) : (
  filteredTrips.map((trip) => (

              <div
  className="trip-card"
  key={trip._id}
  onClick={() => {
    navigate("/trip-details", {
      state: { trip },
    });
  }}
>

                {/* Cover Photo */}
                <div className="trip-image">
                  {trip.photos && trip.photos.length > 0 ? (
                    <img
                      src={getPhotoUrl(trip.photos[0])}
                      alt={trip.destination}
                    />
                  ) : (
                    "✈️"
                  )}
                </div>

                <div className="trip-content">

                  <h3>{trip.destination}</h3>

                  <p>
                    📅 {trip.startDate} → {trip.endDate}
                  </p>

                  <p>
                    💰 ₹{trip.expense || 0}
                  </p>

                  <p>
                    ⭐ {trip.rating}/5
                  </p>

                  <p>
                    {trip.story}
                  </p>

                  {/* Photo Gallery */}
                  {trip.photos && trip.photos.length > 0 && (
                    <div className="photo-gallery">

                      {trip.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={getPhotoUrl(photo)}
                          alt={`Travel ${index + 1}`}
                        />
                      ))}

                    </div>
                  )}

                  {/* Edit */}
                  <button
  onClick={(e) => {
    e.stopPropagation();

    navigate("/edit-trip", {
      state: { trip },
    });
  }}
>
                    ✏️ Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={async (e) => {
  e.stopPropagation();
                      try {
                        const response = await fetch(
                          "http://localhost:5000/api/trips/" + trip._id,
                          {
                            method: "DELETE",
                          }
                        );

                        const data = await response.json();

                        if (response.ok) {
                          alert("Trip deleted successfully! 🗑️");

                          setTrips(
                            trips.filter(
                              (item) => item._id !== trip._id
                            )
                          );
                        } else {
                          alert(
                            data.message ||
                            "Failed to delete trip"
                          );
                        }

                      } catch (error) {
                        console.error(error);
                        alert(
                          "Server se connection nahi ho pa raha."
                        );
                      }
                    }}
                  >
                    🗑️ Delete
                  </button>

                </div>
              </div>

            ))
          )}

        </div>
      </section>

    </div>
  );
}

export default Home;