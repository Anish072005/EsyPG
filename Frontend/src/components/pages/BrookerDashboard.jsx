// Frontend: src/pages/BrokerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronDown, LogOut, Trash2, Edit2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const BrokerDashboard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [pgs, setPgs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedPgBookings, setSelectedPgBookings] = useState([]);
  const [bookingsModalOpen, setBookingsModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  /* -------- Fetch broker profile -------- */
  const fetchProfile = async () => {
    if (!token) return navigate("/login");
    try {
      const res = await axios.get(`${API_BASE}/api/auth/me`, { headers });
      setProfile(res.data);
    } catch (err) {
      localStorage.clear();
      navigate("/login");
    }
  };

  /* -------- Fetch broker PGs -------- */
  const fetchPgs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/pgs/broker/my-pgs`, {
        headers,
      });
      setPgs(res.data);
    } catch (err) {
      console.error("Failed to fetch PGs", err);
    }
  };

  /* -------- Fetch bookings for broker -------- */
  const fetchBookings = async (brokerId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/bookings/broker/${brokerId}`,
        { headers }
      );
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      fetchPgs();
      fetchBookings(profile._id);
    }
  }, [profile]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDeletePg = async (pgId) => {
    if (!confirm("Delete this PG? This action cannot be undone.")) return;
    setLoadingDelete(pgId);

    try {
      await axios.delete(`${API_BASE}/api/pgs/${pgId}`, { headers });
      setPgs((prev) => prev.filter((p) => p._id !== pgId));
      setBookings((prev) => prev.filter((b) => b.pg?._id !== pgId));
    } catch (err) {
      alert("Delete failed");
    }

    setLoadingDelete(null);
  };

  const openBookingsForPg = (pgId) => {
    const list = bookings.filter((b) => b.pg && b.pg._id === pgId);
    setSelectedPgBookings(list);
    setBookingsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
         <div className="inline-flex items-center justify-center rounded-xl bg-indigo-700 text-white px-3 py-1 font-extrabold shadow">
            esy<span className="bg-white text-yellow-500 rounded-md px-1 ml-1">PG</span>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/add-pg")}>Add PG</Button>

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen((v) => !v)}
                className="flex items-center gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : "B"}
                </div>
                <span>{profile?.name || "Broker"}</span>
                <ChevronDown />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-xl p-2">
                  <p className="px-3 text-sm text-gray-500">Signed in as</p>
                  <p className="px-3 font-semibold truncate">
                    {profile?.email}
                  </p>
                  <div className="h-px bg-gray-200 my-1" />
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    <LogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* My PGs */}
        <Card className="p-6 shadow-lg rounded-xl bg-white">
          <h2 className="text-2xl font-bold mb-5">🏢 My PGs</h2>

          {pgs.length === 0 ? (
            <p className="text-gray-600">You have not added any PG yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pgs.map((pg) => (
                <Card
                  key={pg._id}
                  className="rounded-xl shadow-md overflow-hidden border bg-white"
                >
                  <img
                    src={
                      pg.images?.[0]
                        ? `${API_BASE}/${pg.images[0]}`
                        : "https://via.placeholder.com/300x200"
                    }
                    className="w-full h-48 object-cover"
                  />

                  <CardContent className="p-4 space-y-1">
                    <h4 className="font-semibold text-lg">{pg.name}</h4>
                    <p className="text-gray-600">{pg.city}</p>

                    <button
                      onClick={() => openBookingsForPg(pg._id)}
                      className="mt-3 text-indigo-700 font-medium"
                    >
                      View Bookings →
                    </button>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/edit-pg/${pg._id}`)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-300 hover:bg-yellow-400 text-yellow-900"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>

                      <button
                        onClick={() => handleDeletePg(pg._id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-200 hover:bg-red-300 text-red-800"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* All Bookings */}
        <Card className="p-6 shadow-lg rounded-xl bg-white">
          <h2 className="text-2xl font-bold mb-5">📑 All Bookings</h2>

          {bookings.length === 0 ? (
            <p className="text-gray-600">No bookings yet.</p>
          ) : (
            <ul className="space-y-4">
              {bookings.map((b) => (
                <li
                  key={b._id}
                  className="p-4 border rounded-xl shadow-sm bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold text-lg">
                      {b.pg?.name || "PG Deleted"}
                    </div>

                    {b.pg?.images?.length > 0 && (
                      <img
                        src={`${API_BASE}/${b.pg.images[0]}`}
                        className="w-28 h-20 object-cover rounded mt-2"
                      />
                    )}

                    <div className="text-gray-600 text-sm mt-1">
                      {b.user?.name} — {b.user?.email}
                    </div>
                  </div>

                  <div className="text-sm font-medium px-3 py-1 rounded bg-gray-200">
                    {b.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-between">
          <p>© {new Date().getFullYear()} EsyPG. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BrokerDashboard;
