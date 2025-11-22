import { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Building2,
  GraduationCap,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [seatFilters, setSeatFilters] = useState([]);
  const [acFilters, setAcFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPGImages, setSelectedPGImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const POPULAR_CITIES = ["Delhi", "Bengaluru", "Mumbai", "Pune", "Hyderabad", "Chennai"];
  const POPULAR_UNIS = ["IIT Delhi", "IISc", "Mumbai University", "Symbiosis", "Osmania", "Anna University"];

  const token = localStorage.getItem("token");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const toggleFromArray = (arrSetter) => (value) =>
    arrSetter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const toggleCity = toggleFromArray(setSelectedCities);
  const toggleUni = toggleFromArray(setSelectedUniversities);
  const toggleSeat = toggleFromArray(setSeatFilters);
  const toggleAc = toggleFromArray(setAcFilters);

  // =================== FETCH PROFILE ===================
  const fetchProfile = async () => {
    if (!token) return navigate("/login");
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { headers });
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.error(e);
      navigate("/login");
    }
  };

  // =============== FIXED: FETCH PGs (NO HEADERS) ===============
  const fetchPGs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/pgs`);
      const data = await res.json();

      console.log("PGs from backend →", data);

      setPgs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch PGs", e);
    } finally {
      setLoading(false);
    }
  };

  // =================== USE EFFECT ===================
  useEffect(() => {
    fetchProfile();
    fetchPGs();
  }, []);

  // =================== FIXED FILTER LOGIC ===================
const filteredPGs =
  selectedCities.length === 0 &&
  selectedUniversities.length === 0 &&
  seatFilters.length === 0 &&
  acFilters.length === 0 &&
  query.trim() === ""
    ? pgs
    : pgs.filter((pg) => {
        const seatMatch =
          seatFilters.length === 0 ||
          (pg.seats && seatFilters.includes(pg.seats.toString()));

        const acMatch =
          acFilters.length === 0 ||
          (pg.ac !== undefined && acFilters.includes(pg.ac ? "AC" : "Non-AC"));

        const cityMatch =
          selectedCities.length === 0 ||
          (pg.city &&
            selectedCities.some((c) =>
              pg.city.toLowerCase().includes(c.toLowerCase())
            ));

        const uniMatch =
          selectedUniversities.length === 0 ||
          (pg.university &&
            selectedUniversities.some((u) =>
              pg.university.toLowerCase().includes(u.toLowerCase())
            ));

        const priceMatch = !pg.price || pg.price <= priceRange[1];

        const queryMatch =
          query === "" ||
          (pg.name &&
            pg.name.toLowerCase().includes(query.toLowerCase())) ||
          (pg.city &&
            pg.city.toLowerCase().includes(query.toLowerCase()));

        return (
          seatMatch &&
          acMatch &&
          cityMatch &&
          uniMatch &&
          priceMatch &&
          queryMatch
        );
      });


  // =================== GALLERY ===================
  const openGallery = (images) => {
    const fullImages = images.map((img) => `${API_BASE}/${img}`);
    setSelectedPGImages(fullImages);
    setModalOpen(true);
  };

  const closeGallery = () => {
    setSelectedPGImages([]);
    setModalOpen(false);
  };

  // =================== BOOK NOW ===================
  const handleBookNow = async (pgId) => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pgId }),
      });

      if (!res.ok) throw new Error("Booking failed");

      alert("Booking successful!");
      navigate("/my-bookings");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* -------------------------------- NAVBAR -------------------------------- */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="inline-flex items-center justify-center rounded-xl bg-indigo-700 text-white px-3 py-1 font-extrabold shadow">
            esy<span className="bg-white text-yellow-500 rounded-md px-1 ml-1">PG</span>
          </div>

          <ul className="hidden md:flex items-center gap-8 text-gray-700">
            <li className="hover:text-indigo-700 cursor-pointer">Popular Cities</li>
            <li className="hover:text-indigo-700 cursor-pointer">Universities</li>
            <li className="hover:text-indigo-700 cursor-pointer">Recommendations</li>
          </ul>

          <div className="flex items-center gap-4">
            <Link to="/my-bookings" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              My Bookings
            </Link>

            <div className="relative">
              <button onClick={() => setProfileMenuOpen((v) => !v)} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:block font-medium text-gray-900">{profile?.name || "User"}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border shadow-lg rounded-xl p-2">
                  <div className="px-3 py-2">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-semibold truncate">{profile?.email || "-"}</p>
                  </div>
                  <div className="h-px bg-gray-200 my-1" />
                  <button onClick={logout} className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600">
                    <LogOut className="inline w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* -------------------------------- HERO SECTION -------------------------------- */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-5xl font-extrabold"
          >
            Find Verified PGs near Universities & Offices
          </motion.h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            Students and professionals—discover comfortable, affordable stays with real photos and direct broker contact.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-6 bg-white rounded-2xl p-2 shadow flex items-center gap-2">
            <MapPin className="text-gray-500 w-5 h-5 ml-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-3 outline-none text-gray-800"
              placeholder="Search by city, university or area"
            />
            <button onClick={fetchPGs} className="px-5 py-3 bg-indigo-600 rounded-xl text-white">
              <Search className="w-4 h-4 inline" /> Search
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------- PG LISTINGS -------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 px-6">
        {filteredPGs.map((pg) => (
          <motion.div
            key={pg._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-4 shadow-lg"
          >
            <img
              src={
                pg.images?.[0]
                  ? `${API_BASE}/${pg.images[0]}`
                  : "https://via.placeholder.com/400x200"
              }
              onClick={() => openGallery(pg.images)}
              className="w-full h-32 object-cover rounded cursor-pointer"
            />

            <h4 className="font-bold text-lg mt-2">{pg.name}</h4>
            <p className="text-gray-600">{pg.city}</p>
            <p className="text-sm text-gray-500">
              {pg.seats} Seater • {pg.ac ? "AC" : "Non-AC"}
            </p>
            <p className="mt-2 font-semibold text-indigo-700">₹{pg.price}/month</p>

            {/* WHATSAPP */}
            <a
              href={`https://wa.me/${pg.contact}?text=${encodeURIComponent(
                `Hi, I am interested in your PG ${pg.name}`
              )}`}
              className="mt-3 block text-center bg-green-500 hover:bg-green-600 text-white rounded-lg py-2"
              target="_blank"
            >
              Chat on WhatsApp
            </a>

            <button
              onClick={() => handleBookNow(pg._id)}
              className="px-4 py-2 bg-indigo-600 mt-2 text-white rounded-lg w-full"
            >
              Book Now
            </button>
          </motion.div>
        ))}
      </div>

      {/* -------------------------------- GALLERY MODAL -------------------------------- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-4 max-w-3xl relative">
            <button
              onClick={closeGallery}
              className="absolute top-3 right-3 text-gray-700 text-xl"
            >
              ×
            </button>

            <Slider
              dots={true}
              arrows={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
            >
              {selectedPGImages.map((img, i) => (
                <div key={i}>
                  <img
                    src={img}
                    className="rounded-3xl w-full h-72 object-contain"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

      {/* -------------------------------- FOOTER -------------------------------- */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} esyPG. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
