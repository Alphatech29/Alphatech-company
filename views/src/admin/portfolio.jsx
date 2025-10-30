import React, { useState, useMemo, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";
import { TextInput } from "flowbite-react";
import { getPortfolioData, addPortfolioData } from "../utilities/portfolio";
import SweetAlert from "../utilities/sweetAlert";
import { formatDate } from "../utilities/formatDate";
import { formatAmount } from "../utilities/formatAmount";

export default function PortfolioDashboard() {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    description: "",
    category: "",
    owner: "",
    start_date: "",
    amount: "",
    image_url: null,
    project_url: "",
    date_completed: "",
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const response = await getPortfolioData();
        if (response.success) {
          const sortedData = [...response.data].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setPortfolios(sortedData);
        } else {
          await SweetAlert.alert("Failed", response.message, "error");
        }
      } catch (error) {
        await SweetAlert.alert("Error", "Failed to fetch portfolio data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const filteredPortfolios = useMemo(() => {
    return portfolios
      .filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [portfolios, searchTerm]);

  const handleAddPortfolio = async () => {
    const {
      title,
      description,
      category,
      owner,
      image_url,
      project_url,
      date_completed,
      start_date,
      amount,
    } = newPortfolio;

    if (
      !title ||
      !description ||
      !category ||
      !owner ||
      !image_url ||
      !start_date ||
      !date_completed ||
      !amount
    ) {
      await SweetAlert.alert(
        "Missing Fields",
        "Please fill in all required fields, including image.",
        "warning"
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("owner", owner);
      formData.append("project_url", project_url);
      formData.append("start_date", start_date);
      formData.append("amount", amount);
      formData.append("date_completed", date_completed);
      formData.append("image_url", image_url);

      const response = await addPortfolioData(formData);

      if (response.success) {
        const newPortfolioItem = { id: Date.now(), ...newPortfolio };
        setPortfolios((prev) =>
          [...prev, newPortfolioItem].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );

        setModalOpen(false);
        setNewPortfolio({
          title: "",
          description: "",
          category: "",
          owner: "",
          image_url: null,
          project_url: "",
          date_completed: "",
          start_date: "",
          amount: "",
        });

        await SweetAlert.alert(
          "Success",
          response.message || "New portfolio added successfully.",
          "success"
        );
      } else {
        await SweetAlert.alert(
          "Error",
          response.message || "Error adding portfolio.",
          "error"
        );
      }
    } catch (error) {
      await SweetAlert.alert("Error", "Something went wrong while adding portfolio.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-5 relative">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Portfolio Dashboard</h1>
        </div>

        <div className="flex mb-6 w-full">
          <TextInput
            id="search"
            placeholder="Search by title or category"
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
        ) : filteredPortfolios.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-xl font-medium">No data found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-3">
            {filteredPortfolios.map((p) => (
              <div
                key={p.id}
                className="bg-white/80 backdrop-blur-lg shadow-xl hover:shadow-2xl rounded-md p-8 border border-gray-100 relative overflow-clip"
              >
                <div className="flex absolute top-0 left-0 right-0 justify-between">
                  <span className="px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm bg-primary-200 text-primary-800">
                    {p.category}
                  </span>
                </div>

                <div className="flex items-center space-x-3 mb-6 mt-4">
                  <div className="bg-gradient-to-br from-primary-300 to-primary-700 text-white p-1 rounded-2xl shadow-md">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="rounded-2xl shadow-md w-12 h-12 object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-base text-gray-900">{p.title}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-1 text-gray-400" /> {formatDate(p.date_completed)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>CEO/MD:</strong> {p.owner}
                  </p>
                  <p>
                    <strong>Project Amount:</strong> {formatAmount(p.amount)}
                  </p>
                  <p>
                    <strong>Starting Date:</strong> {formatDate(p.start_date)}
                  </p>
                  <p>
                    <strong>Delivery Date:</strong> {formatDate(p.date_completed)}
                  </p>
                </div>

                <div className="flex items-end justify-end">
                  <button
                    onClick={() => setSelectedPortfolio(p)}
                    className="mt-4 px-6 py-2.5 text-sm rounded-xl bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-12 right-12 bg-purple-700 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform text-4xl"
      >
        <HiPlus />
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl sm:mt-72 md:mt-7 shadow-2xl w-full max-w-5xl p-4 md:p-8 animate-fadeIn">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6 text-center">
              Add New Portfolio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newPortfolio.title}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                  placeholder="Enter project title"
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Owner */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Owner Name</label>
                <input
                  type="text"
                  value={newPortfolio.owner}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, owner: e.target.value })}
                  placeholder="Enter owner's name"
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={newPortfolio.category}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                  placeholder="Enter project category"
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Project Amount</label>
                <input
                  type="text"
                  value={newPortfolio.amount}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, amount: e.target.value })}
                  placeholder="Enter project amount"
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Project URL */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Project URL</label>
                <input
                  type="text"
                  value={newPortfolio.project_url}
                  onChange={(e) =>
                    setNewPortfolio({ ...newPortfolio, project_url: e.target.value })
                  }
                  placeholder="Enter project URL"
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
                    if (!validTypes.includes(file.type)) {
                      SweetAlert.alert(
                        "Invalid File",
                        "Only PNG, JPEG, or JPG files are allowed.",
                        "warning"
                      );
                      return;
                    }

                    setNewPortfolio({ ...newPortfolio, image_url: file });
                  }}
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Dates */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Starting Date</label>
                <input
                  type="date"
                  value={newPortfolio.start_date}
                  onChange={(e) =>
                    setNewPortfolio({ ...newPortfolio, start_date: e.target.value })
                  }
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Date Completed</label>
                <input
                  type="date"
                  value={newPortfolio.date_completed}
                  onChange={(e) =>
                    setNewPortfolio({ ...newPortfolio, date_completed: e.target.value })
                  }
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  value={newPortfolio.description}
                  onChange={(e) =>
                    setNewPortfolio({ ...newPortfolio, description: e.target.value })
                  }
                  placeholder="Write a short project description"
                  className="border border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleAddPortfolio}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 rounded-2xl hover:scale-105 transition-transform"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Portfolio"}
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

      {/* Portfolio Details */}
      {selectedPortfolio && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-3xl relative overflow-y-auto max-h-[90vh] sm:max-h-[85vh]">
            <button
              onClick={() => setSelectedPortfolio(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ✕
            </button>

            <div className="p-6 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight text-center sm:text-left">
                Portfolio Overview
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-700 text-sm sm:text-base leading-relaxed">
                <p><strong>Title:</strong> {selectedPortfolio.title}</p>
                <p><strong>CEO/MD:</strong> {selectedPortfolio.owner}</p>
                <p><strong>Category:</strong> {selectedPortfolio.category}</p>
                <p><strong>Project Amount:</strong> {formatAmount(selectedPortfolio.amount)}</p>
                <p><strong>Starting Date:</strong> {formatDate(selectedPortfolio.start_date)}</p>
                <p><strong>Date Completed:</strong> {formatDate(selectedPortfolio.date_completed)}</p>

                <p className="col-span-2">
                  <strong>Description:</strong> {selectedPortfolio.description}
                </p>

                <p className="col-span-2">
                  <strong>Project URL:</strong>{" "}
                  <a
                    href={selectedPortfolio.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 underline break-words"
                  >
                    {selectedPortfolio.project_url}
                  </a>
                </p>

                <div className="col-span-2 flex justify-center sm:justify-start mt-6">
                  <img
                    src={selectedPortfolio.image_url || "/placeholder.png"}
                    alt={selectedPortfolio.title}
                    className="rounded-xl shadow-md w-full sm:w-64 h-auto max-h-72 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
