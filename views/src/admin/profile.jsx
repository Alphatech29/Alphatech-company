import React, { useState, useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import SweetAlert from "../utilities/sweetAlert";
import { getWebsiteSettings } from "../utilities/websiteSettings";

export default function WebsiteProfile() {
  const [settings, setSettings] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getWebsiteSettings();
        setSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch website settings:", error);
        await SweetAlert.alert(
          "Error",
          "Failed to fetch website settings.",
          "error"
        );
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!selectedFile) {
      await SweetAlert.alert("Error", "No avatar selected.", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const response = await fetch("/api/settings-profile", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {

        setSettings((prev) =>
          prev.map((item) => ({
            ...item,
            avatar: result.data?.avatar || URL.createObjectURL(selectedFile),
          }))
        );

        const alertType = result.success ? "success" : "error";

        await SweetAlert.alert(
          result.success ? "Success" : "Error",
          result.message || "Avatar updated successfully.",
          alertType
        );

        setSelectedFile(null);
      } else {
        await SweetAlert.alert(
          "Error",
          result.message || "Failed to update avatar.",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      await SweetAlert.alert(
        "Error",
        "Something went wrong while updating the avatar.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-5">
      <div className=" bg-white shadow-xl rounded-3xl p-8 sm:p-12">
        {/* Render settings */}
        {Array.isArray(settings) &&
          settings.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10"
            >
              {/* Avatar */}
              <div className="relative w-32 h-32">
                {item.avatar ? (
                  <img
                    src={
                      typeof item.avatar === "string"
                        ? item.avatar
                        : URL.createObjectURL(item.avatar)
                    }
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-purple-400"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 text-4xl font-bold shadow-inner">
                    {item.site_name?.charAt(0)}
                  </div>
                )}

                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300">
                  <HiPlus className="text-white text-xl" />
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Site Name */}
              <div className="text-center sm:text-left w-full">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-wide">
                  {item.site_name}
                </h1>
              </div>
            </div>
          ))}

        {/* Save button at bottom */}
        <div className="text-center mt-6">
          <button
            onClick={handleSave}
            disabled={loading || !selectedFile}
            className="bg-gradient-to-r from-primary-200 to-primary-700 text-white px-6 py-3 rounded-full shadow-lg  transition-colors duration-300"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
