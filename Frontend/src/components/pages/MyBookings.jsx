import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function MyBookings() {
  const token = localStorage.getItem("token");
  const [bookings, setBookings] = useState([]);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBookings(data);
    } catch (e) {
      console.log("Failed to load bookings:", e);
    }
  };

  // DELETE BOOKING FUNCTION
  const deleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      // Remove from UI
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));

      alert("Booking deleted successfully!");
    } catch (e) {
      console.log("Delete error:", e);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You have no bookings yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <motion.div
              key={b._id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white rounded-xl shadow-md"
            >
              <img
                src={
                  b.image
                    ? `${API_BASE}/${b.image}`
                    : "https://via.placeholder.com/400x200"
                }
                className="w-full h-40 object-cover rounded-lg"
              />

              <h2 className="text-xl font-bold mt-3">{b.name}</h2>
              <p className="text-gray-600">₹{b.price}/month</p>

              <p className="text-sm text-gray-500 mt-1">
                Booked on{" "}
                {new Date(b.bookedAt).toLocaleDateString()}
              </p>

              {/* Delete Button */}
              <button
                onClick={() => deleteBooking(b._id)}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Delete Booking
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
