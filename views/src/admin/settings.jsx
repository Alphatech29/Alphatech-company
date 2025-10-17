import React, { useEffect, useState } from "react";
import { Label, TextInput, Button, Spinner } from "flowbite-react";
import {
  getWebsiteSettings,
  updateWebsiteSettings,
} from "../utilities/websiteSettings.jsx";
import SweetAlert from "../utilities/sweetAlert";

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const EXCLUDED_FIELDS = ["id", "created_at", "updated_at", "logo_url", "avatar"];

  // Fetch website settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getWebsiteSettings();
        if (res?.success && res.data?.length > 0) {
          const data = res.data[0];
          const filteredData = Object.fromEntries(
            Object.entries(data).filter(([key]) => !EXCLUDED_FIELDS.includes(key))
          );
          setSettings(filteredData);
          setOriginalSettings(filteredData);
        } else {
          SweetAlert.alert("Error", "No settings found.", "warning");
        }
      } catch (error) {
        console.error("Error fetching website settings:", error);
        SweetAlert.alert("Error", "Failed to load settings.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Compare and extract only changed fields
  const getChangedFields = () => {
    const changed = {};
    for (const key in settings) {
      if (settings[key] !== originalSettings[key]) {
        changed[key] = settings[key];
      }
    }
    return changed;
  };

  // Handle save with SweetAlert confirmation
  const handleSave = async () => {
    const changedFields = getChangedFields();

    if (Object.keys(changedFields).length === 0) {
      SweetAlert.alert("No Changes", "No settings were modified.", "info");
      return;
    }

    const confirm = await SweetAlert.confirm(
      "Confirm Update",
      "Do you want to save these changes?"
    );

    if (!confirm) return;

    setSaving(true);

    try {
      const response = await updateWebsiteSettings(changedFields);
      if (response?.success) {
        SweetAlert.alert("Success", "Settings updated successfully!", "success");
        setOriginalSettings(settings);
      } else {
        SweetAlert.alert("Failed", "Unable to update settings.", "error");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      SweetAlert.alert("Error", "An error occurred while saving.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-start">
          Website Settings
        </h2>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner aria-label="Loading settings..." size="xl" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(settings).map((key) => (
                  <div key={key}>
                    <Label htmlFor={key} className="text-gray-700 capitalize">
                      {key.replace(/_/g, " ")}
                    </Label>
                    <TextInput
                      id={key}
                      type="text"
                      value={settings[key] ?? ""}
                      onChange={(e) =>
                        setSettings({ ...settings, [key]: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6 flex justify-end items-end">
                <Button
                  className="bg-purple-700 hover:bg-primary-400"
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

export default Settings;
