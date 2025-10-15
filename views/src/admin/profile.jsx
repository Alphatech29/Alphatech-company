import React, { useEffect, useState } from "react";
import { Spinner, Button } from "flowbite-react";
import SweetAlert from "../utilities/sweetAlert";
import {
  getWebsiteSettings,
  updateWebsiteSettings,
} from "../utilities/websiteSettings";

const Profile = () => {
  const [settings, setSettings] = useState({
    site_avatar: "",
  });
  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch settings on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getWebsiteSettings();
        if (res?.success && res.data?.length > 0) {
          const data = res.data[0];
          const profileData = {
            site_avatar: data.site_avatar || "",
          };
          setSettings(profileData);
          setOriginalSettings(profileData);
        } else {
          await SweetAlert.alert("Error", "No profile data found.", "warning");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        await SweetAlert.alert("Error", "Failed to load profile data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      Object.values(settings).forEach((value) => {
        if (value instanceof File) URL.revokeObjectURL(value);
      });
    };
  }, []);

  // ✅ Handle avatar file selection (no auto-save)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      await SweetAlert.alert(
        "Invalid File",
        "Only PNG, JPEG, or JPG files are allowed.",
        "warning"
      );
      return;
    }

    // Just update the preview and local state, no upload yet
    setSettings((prev) => ({ ...prev, site_avatar: file }));
    await SweetAlert.alert(
      "File Selected",
      "Your avatar has been updated locally. Click 'Save Changes' to upload.",
      "info"
    );
  };

  // ✅ Detect changed fields
  const getChangedFields = () => {
    const changed = {};
    for (const key in settings) {
      if (settings[key] !== originalSettings[key]) {
        changed[key] = settings[key];
      }
    }
    return changed;
  };

  // ✅ Save profile changes manually
  const handleSave = async () => {
    const changedFields = getChangedFields();

    if (Object.keys(changedFields).length === 0) {
      await SweetAlert.alert("No Changes", "No profile updates detected.", "info");
      return;
    }

    const confirm = await SweetAlert.confirm(
      "Confirm Update",
      "Do you want to save these profile changes?"
    );
    if (!confirm) return;

    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(changedFields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await updateWebsiteSettings(formData);

      if (response?.success) {
        await SweetAlert.alert("Success", "Profile updated successfully!", "success");
        setOriginalSettings(settings);
      } else {
        await SweetAlert.alert("Error", "Unable to update profile.", "error");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      await SweetAlert.alert("Error", "An error occurred while saving.", "error");
    } finally {
      setSaving(false);
    }
  };

  const getPreviewUrl = (value) => {
    if (value instanceof File) return URL.createObjectURL(value);
    return value;
  };

  return (
    <div className="min-h-screen py-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-start">
          Profile Settings
        </h2>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner aria-label="Loading profile..." size="xl" />
            </div>
          ) : (
            <>
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 shadow-sm">
                  {settings.site_avatar ? (
                    <img
                      key={settings.site_avatar?.name || settings.site_avatar}
                      src={getPreviewUrl(settings.site_avatar)}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                      No Avatar
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full cursor-pointer hover:bg-gray-700"
                    title="Upload Avatar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5v14" />
                    </svg>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-3 text-gray-500 text-sm">Upload your avatar</p>
              </div>

              {/* Save Button */}
              <div className="pt-8 flex justify-end items-end">
                <Button
                  className="bg-purple-700 hover:bg-purple-600"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
