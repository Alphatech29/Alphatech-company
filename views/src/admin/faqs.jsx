import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  getFaqsData,
  addFaqData,
  updateFaqDataById,
  deleteFaqDataById,
} from "../utilities/faqs";
import SweetAlert from "../utilities/sweetAlert";

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({ id: null, question: "", answer: "" });

  // Fetch FAQs on mount
  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const response = await getFaqsData();
        if (response.success) {
          setFaqs(response.data);
        } else {
          await SweetAlert.alert("Error", response.message, "error");
        }
      } catch (error) {
        await SweetAlert.alert("Error", "Failed to load FAQs.", "error");
      }
      setLoading(false);
    };

    fetchFaqs();
  }, []);

  const handleAdd = () => {
    setCurrentFaq({ id: null, question: "", answer: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (faq) => {
    setCurrentFaq(faq);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await SweetAlert.confirm(
      "Delete FAQ?",
      "Are you sure you want to delete this FAQ?"
    );
    if (confirmed) {
      try {
        const response = await deleteFaqDataById(id);
        if (response.success) {
          setFaqs(faqs.filter((faq) => faq.id !== id));
          await SweetAlert.alert("Deleted!", "FAQ deleted successfully", "success");
        } else {
          await SweetAlert.alert("Error", response.message || "Failed to delete FAQ", "error");
        }
      } catch (error) {
        await SweetAlert.alert("Error", "Failed to delete FAQ", "error");
      }
    }
  };

  const handleSave = async () => {
    if (!currentFaq.question || !currentFaq.answer) {
      return SweetAlert.alert("Warning", "Please enter both question and answer", "warning");
    }

    if (isEditing) {
      try {
        const response = await updateFaqDataById(currentFaq.id, currentFaq.question, currentFaq.answer);
        if (response.success) {
          setFaqs(faqs.map((faq) => (faq.id === currentFaq.id ? response.data : faq)));
          await SweetAlert.alert("Success", "FAQ updated successfully", "success");
          setShowModal(false);
        } else {
          await SweetAlert.alert("Error", response.message || "Failed to update FAQ", "error");
        }
      } catch (error) {
        await SweetAlert.alert("Error", "Failed to update FAQ", "error");
      }
    } else {
      try {
        const response = await addFaqData(currentFaq.question, currentFaq.answer);
        if (response.success) {
          setFaqs([...faqs, response.data]);
          await SweetAlert.alert("Success", "FAQ added successfully", "success");
          setShowModal(false);
        } else {
          await SweetAlert.alert("Error", response.message || "Failed to add FAQ", "error");
        }
      } catch (error) {
        await SweetAlert.alert("Error", "Failed to add FAQ", "error");
      }
    }
  };

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">FAQs Dashboard</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-200 to-primary-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
        >
          <FaPlus className="text-sm" /> Add FAQ
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Loading FAQs...</p>}

      {/* FAQ Cards */}
      {!loading && faqs.length === 0 && <p>No FAQs available.</p>}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="group relative bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary-200 to-primary-700 text-white p-4">
              <h2 className="text-base font-semibold">
                {index + 1}. {faq.question}
              </h2>
            </div>

            <div className="p-5">
              <p className="text-gray-700 text-sm leading-relaxed mb-6">{faq.answer}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(faq)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
                >
                  <FaEdit className="text-xs" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
                >
                  <FaTrash className="text-xs" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white w-full mx-3 max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-primary-200 to-primary-700 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{isEditing ? "Edit FAQ" : "Add New FAQ"}</h2>
              <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200 text-xl">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  value={currentFaq.question}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                  placeholder="Enter question"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                  value={currentFaq.answer}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                  placeholder="Enter answer"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg shadow-md hover:opacity-90 transition-all duration-300"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faqs;
