import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // 👈 user or broker
  const navigate = useNavigate();

  // 🔹 Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        role === "broker"
          ? "http://localhost:8080/api/auth/login-broker"
          : "http://localhost:8080/api/auth/login-user";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Save token + role separately
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);

      // ✅ Redirect based on role
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            if (data.role === "broker") {
              navigate("/broker-dashboard");
            } else {
              navigate("/user-dashboard");
            }
          },
          (err) => {
            console.error("Location access denied:", err);
            alert("Please allow location access for better results.");
            if (data.role === "broker") {
              navigate("/broker-dashboard");
            } else {
              navigate("/user-dashboard");
            }
          }
        );
      } else {
        if (data.role === "broker") {
          navigate("/broker-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Login to EsyPG
        </h2>

        {/* Role Selector */}
        <div className="flex justify-center gap-6 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            User
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="broker"
              checked={role === "broker"}
              onChange={() => setRole("broker")}
            />
            Broker
          </label>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
