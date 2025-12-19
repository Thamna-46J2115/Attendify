import React, { useState } from "react";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div className="page-container">
      <h2 className="page-title">Settings</h2>

      <div className="settings-card">
        <div className="setting-item">
          <span>Enable Notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>

        <div className="setting-item">
          <span>Language</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </div>

        <div className="setting-item">
          <span>Theme</span>
          <span>Controlled from header 🌙</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
