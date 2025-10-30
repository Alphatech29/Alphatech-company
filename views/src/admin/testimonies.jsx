import React, { useState, useMemo, useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { TextInput } from "flowbite-react";
import {
  getTestimonies,
  createTestimony,
  deleteTestimony,
} from "../utilities/testimonies";
import SweetAlert from "../utilities/sweetAlert";
import { formatDate } from "../utilities/formatDate";

const Testimonies = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [selectedTestimony, setSelectedTestimony] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newTestimony, setNewTestimony] = useState({
    name: "",
    position: "",
    message: "",
    rating: "",
  });

  // Fetch testimonies on mount
  useEffect(() => {
    const fetchTestimonies = async () => {
      setLoading(true);
      try {
        const response = await getTestimonies();
        if (response.success && Array.isArray(response.data)) {
          const sortedData = [...response.data].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setTestimonies(sortedData);
        } else {
          await SweetAlert.alert("Failed", response.message, "error");
        }
      } catch (err) {
        console.error(err);
        await SweetAlert.alert("Error", "Failed to fetch testimonies.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonies();
  }, []);

  // Filter by name or position
  const filteredTestimonies = useMemo(() => {
    return testimonies.filter(
      (t) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [testimonies, searchTerm]);

  // Add new testimony
  const handleAddTestimony = async () => {
    const { name, position, message, rating } = newTestimony;

    if (!name || !message) {
      await SweetAlert.alert(
        "Missing Fields",
        "Name and message are required.",
        "warning"
      );
      return;
    }

    if (rating && (rating < 1 || rating > 10)) {
      await SweetAlert.alert(
        "Invalid Rating",
        "Rating must be between 1 and 10.",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await createTestimony(newTestimony);
      if (response.success) {
        const newItem = {
          id: response.data?.id || Date.now(),
          created_at: new Date(),
          ...newTestimony,
        };

        setTestimonies((prev) =>
          [...prev, newItem].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );

        setModalOpen(false);
        setNewTestimony({ name: "", position: "", message: "", rating: "" });

        await SweetAlert.alert("Success", response.message, "success");
      } else {
        await SweetAlert.alert("Error", response.message, "error");
      }
    } catch (err) {
      console.error(err);
      await SweetAlert.alert(
        "Error",
        "Something went wrong while adding testimony.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete testimony
  const handleDeleteTestimony = async (id) => {

    const confirm = await SweetAlert.confirm(
      "Are you sure?",
      "This action will permanently delete the testimony.",
      "Yes"
    );

    if (!confirm) return;

    setLoading(true);
    try {
      const response = await deleteTestimony(id);

      if (response.success) {
        setTestimonies((prev) =>
          prev.filter((t) => t.id.toString() !== id.toString())
        );
        await SweetAlert.alert("Deleted!", "Testimony deleted successfully.", "success");
      } else {
        await SweetAlert.alert("Error", response.message, "error");
      }
    } catch (err) {
      console.error("Error deleting testimony:", err);
      await SweetAlert.alert("Error", "Failed to delete testimony.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-5 relative">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Testimonies Dashboard
          </h1>
        </div>

        <div className="flex mb-6 w-full">
          <TextInput
            id="search"
            placeholder="Search by name or position"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            sizing="md"
            color="white"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-xl font-medium">Loading...</p>
          </div>
        ) : filteredTestimonies.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-xl font-medium">No testimonies found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-3">
            {filteredTestimonies.map((t) => (
              <div
                key={t.id || t._id}
                className="bg-white/80 backdrop-blur-lg shadow-xl hover:shadow-2xl rounded-md p-8 border border-gray-100 relative"
              >
                <div className="flex flex-col space-y-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.position || "—"}</p>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-4">{t.message}</p>

                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(Number(t.rating) || 0)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                  {t.rating && (
                    <span className="text-gray-600 text-sm">({t.rating}/10)</span>
                  )}
                </div>

                <p className="text-xs text-gray-400 text-right">
                  {formatDate(t.created_at)}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setSelectedTestimony(t)}
                    className="px-5 py-2 text-sm rounded-xl bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteTestimony(t.id)}
                    className="px-5 py-2 text-sm rounded-xl bg-red-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-12 right-12 bg-purple-700 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform text-4xl"
      >
        <HiPlus />
      </button>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 md:p-8 animate-fadeIn">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6 text-center">
              Add New Testimony
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newTestimony.name}
                  onChange={(e) =>
                    setNewTestimony({ ...newTestimony, name: e.target.value })
                  }
                  placeholder="Enter name"
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Position</label>
                <input
                  type="text"
                  value={newTestimony.position}
                  onChange={(e) =>
                    setNewTestimony({ ...newTestimony, position: e.target.value })
                  }
                  placeholder="Enter position (optional)"
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Rating (1–10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newTestimony.rating}
                  onChange={(e) =>
                    setNewTestimony({ ...newTestimony, rating: e.target.value })
                  }
                  placeholder="Enter rating"
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  value={newTestimony.message}
                  onChange={(e) =>
                    setNewTestimony({ ...newTestimony, message: e.target.value })
                  }
                  placeholder="Write the testimony message"
                  rows={4}
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleAddTestimony}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 rounded-2xl hover:scale-105 transition-transform"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Testimony"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedTestimony && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative p-6 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedTestimony(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Testimony Details
            </h2>

            <div className="text-gray-700 space-y-4">
              <p>
                <strong>Name:</strong> {selectedTestimony.name}
              </p>
              <p>
                <strong>Position:</strong> {selectedTestimony.position || "—"}
              </p>
              <p>
                <strong>Message:</strong> {selectedTestimony.message}
              </p>
              {selectedTestimony.rating && (
                <p>
                  <strong>Rating:</strong> {selectedTestimony.rating}/10
                </p>
              )}
              <p className="text-xs text-gray-400 text-right">
                {formatDate(selectedTestimony.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonies;
