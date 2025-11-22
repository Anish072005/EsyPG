import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MapPin, Users, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <div className="inline-flex items-center justify-center rounded-xl bg-indigo-700 text-white px-3 py-1 font-extrabold tracking-wide shadow">
      esy
      <span className="bg-white text-yellow-500 rounded-md px-1 ml-1">PG</span>
    </div>


          <nav className="space-x-6 font-medium">
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#stats" className="hover:text-indigo-600">Stats</a>
            <a href="#about" className="hover:text-indigo-600">About</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-6 relative z-10"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find Your Perfect <span className="text-yellow-300">PG</span> With Ease
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Connecting users with verified PGs & brokers.  
            Search by location, filter by budget, and move in stress-free.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/login?role=user"
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:bg-gray-100 transition"
            >
              Login as User
            </Link>
            <Link
              to="/login?role=broker"
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:bg-yellow-500 transition"
            >
              Login as Broker
            </Link>
          </div>
        </motion.div>

        {/* Animated Background Circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute bg-white/10 w-72 h-72 rounded-full -top-20 -left-20 animate-pulse"></div>
          <div className="absolute bg-white/10 w-96 h-96 rounded-full bottom-0 right-0 animate-ping"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 container mx-auto px-6">
        <h3 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Why Choose <span className="text-indigo-600">EsyPG?</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {[
            { icon: <MapPin size={36} />, title: "Location Based Search", desc: "Find PGs nearest to your university, office or location." },
            { icon: <Home size={36} />, title: "Easy PG Listing", desc: "Brokers can upload PGs with images, pricing & facilities." },
            { icon: <Users size={36} />, title: "Smart Filters", desc: "Sort PGs by sharing type, budget, and amenities." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center"
            >
              <div className="text-indigo-600 mb-4">{item.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="bg-indigo-50 py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          {[
            { number: "500+", label: "Registered PGs" },
            { number: "1200+", label: "Happy Users" },
            { number: "200+", label: "Active Brokers" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h4 className="text-4xl font-bold text-indigo-600 mb-2">{stat.number}</h4>
              <p className="text-gray-700">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 container mx-auto px-6 text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-6">About EsyPG</h3>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          EsyPG is a modern platform designed to make PG hunting easy & stress-free.
          Whether you are a student or employee, EsyPG helps you discover the best
          PGs around your location with verified listings and transparent information.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white text-center py-6 mt-auto">
        <p>© {new Date().getFullYear()} EsyPG. All rights reserved.</p>
      </footer>
    </div>
  );
}
