import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const AddPG = () => {
  const [formData, setFormData] = useState({
    name: "",
    rent: "",
    price: "",
    location: "",
    city: "",
    seats: 1,
    ac: false,
    contact: "",
    description: "",
    amenities: [],
  });

  const [images, setImages] = useState([]); // <-- Stores File objects
  const [previewImages, setPreviewImages] = useState([]); // <-- Stores previews
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Handle input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle amenity
  const toggleAmenity = (item) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item],
    }));
  };

  // Handle multiple file upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Append new images without replacing
    setImages((prev) => [...prev, ...files]);

    // Create preview URLs
    const previewURLs = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previewURLs]);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        if (key === "amenities") {
          fd.append(key, JSON.stringify(formData[key]));
        } else {
          fd.append(key, formData[key]);
        }
      });

      // Append all images (multiple)
      images.forEach((file) => {
        fd.append("images", file);
      });

      const res = await axios.post(`${API_BASE}/api/pgs/add`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMsg("🎉 PG added successfully!");
      setImages([]);
      setPreviewImages([]);

      setFormData({
        name: "",
        rent: "",
        price: "",
        location: "",
        city: "",
        seats: 1,
        ac: false,
        contact: "",
        description: "",
        amenities: [],
      });
    } catch (err) {
      console.error(err);
      setMsg("❌ " + (err.response?.data?.error || "Failed to add PG"));
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-3xl font-extrabold mb-6 text-indigo-700">
        🏠 Add New PG
      </h2>

      {msg && (
        <p className="mb-4 p-3 rounded-lg text-center bg-indigo-100 text-indigo-700 font-semibold">
          {msg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* PG NAME */}
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="PG Name"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />

        {/* RENT */}
        <input
          type="number"
          name="rent"
          value={formData.rent}
          placeholder="Monthly Rent"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          value={formData.price}
          placeholder="Full Price"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* LOCATION */}
        <input
          type="text"
          name="location"
          value={formData.location}
          placeholder="Full Address / Landmark"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* CITY */}
        <input
          type="text"
          name="city"
          value={formData.city}
          placeholder="City"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* SEATS */}
        <input
          type="number"
          name="seats"
          value={formData.seats}
          placeholder="Total Seats"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* AC */}
        <label className="flex items-center gap-3 font-medium">
          <input
            type="checkbox"
            name="ac"
            checked={formData.ac}
            onChange={handleChange}
          />
          AC Available
        </label>

        {/* BROKER CONTACT */}
        <input
          type="text"
          name="contact"
          value={formData.contact}
          placeholder="Broker Contact Number"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={formData.description}
          placeholder="Describe the PG…"
          rows={3}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        ></textarea>

        {/* AMENITIES */}
        <div>
          <p className="font-semibold mb-2">Select Amenities</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["WiFi", "Parking", "Laundry", "Security", "Hot Water", "Food"].map(
              (item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(item)}
                    onChange={() => toggleAmenity(item)}
                  />
                  {item}
                </label>
              )
            )}
          </div>
        </div>

        {/* Multiple Image Upload */}
        <label className="block font-medium mt-4">Upload PG Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="w-full p-3 border rounded-lg"
        />

        {/* Image Preview Grid */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {previewImages.map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-full h-32 object-cover rounded-lg shadow-md border"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700"
        >
          {loading ? "Saving…" : "Add PG"}
        </button>
      </form>
    </div>
  );
};

export default AddPG;
