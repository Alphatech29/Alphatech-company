import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import SweetAlert from "../utilities/sweetAlert";

export default function FounderSection() {
  const [loading, setLoading] = useState(true);
  const [founder, setFounder] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Fetch founder data once
  useEffect(() => {
    const fetchFounder = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/ceo-bio");
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          const founderData = data.data[0];
          console.log("Founder loaded:", founderData);

          setFounder(founderData);
          setFullName(founderData.full_name || "");
          setEmail(founderData.email || "");
          setRole(founderData.role || "");
          setBio(founderData.bio || "");
          setAvatarPreview(founderData.avatar || null);
        } else {
          SweetAlert.alert("Error", "Founder data could not be loaded", "error");
        }
      } catch (error) {
        console.error(error);
        SweetAlert.alert("Network Error", "Unable to fetch founder information", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchFounder();

    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const founderId = founder?.id;
    if (!founderId) {
      SweetAlert.alert("Error", "Founder ID not available", "error");
      return;
    }

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("bio", bio);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await fetch(`/api/update-founder/${founderId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      console.log("Update response:", result);

      if (result.success) {
        SweetAlert.alert("Success", "Founder updated successfully", "success");

        setFounder({
          ...founder,
          full_name: fullName,
          email,
          role,
          bio,
          avatar: avatarPreview,
        });

        setAvatar(null);
      } else {
        SweetAlert.alert("Error", result.message || "Update failed", "error");
      }
    } catch (error) {
      console.error(error);
      SweetAlert.alert("Network Error", "Could not update founder information", "error");
    }
  };

  // Quill Modules
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
    table: true,
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true,
    },
  };

  if (loading) {
    return (
      <p className="text-center py-6 text-gray-500">
        Loading founder information...
      </p>
    );
  }

  return (
    <div className="bg-gray-50 p-6 sm:p-8 my-10 rounded-2xl shadow-xl ">
      <h2 className="text-2xl font-extrabold mb-8 text-gray-900 text-center">
        Founder Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <label className="block mb-2 text-gray-700 font-medium">Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>

          {avatarPreview && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-400 shadow-lg">
              <img
                src={avatarPreview}
                alt={fullName || "Founder Avatar"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
            required
          />

          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
            required
          />
        </div>

        {/* Biography */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Biography</label>
          <style>{`
            .ql-toolbar {
              position: sticky;
              top: 0;
              z-index: 10;
              background: white;
              border-bottom: 1px solid #ddd;
            }
            .ql-container {
              min-height: 400px;
              border: none !important;
            }
          `}</style>

          <ReactQuill
            theme="snow"
            modules={modules}
            placeholder="Edit your bio content..."
            className="h-[400px] rounded-xl border border-gray-300"
            value={bio}
            onChange={setBio}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-700 to-purple-400 text-white w-full py-2 rounded-xl font-semibold shadow-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
