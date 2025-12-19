import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../App.css";

const Location = () => {
  const [ip] = useState("8.8.8.8");
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getGeoLocationData = useCallback(async () => {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      setGeoData(response.data);
    } catch (error) {
      console.error("Error fetching geolocation data:", error.message);
    } finally {
      setLoading(false);
    }
  }, [ip]); // الدالة تعتمد على ip

  useEffect(() => {
    getGeoLocationData();
  }, [getGeoLocationData]); // الآن التحذير اختفى

  return (
    <div className="location-card">
      <h3>Location Information</h3>
      {loading ? (
        <p>Loading location data...</p>
      ) : geoData ? (
        <div>
          <p>
            <strong>IP Address:</strong> {ip}
          </p>
          <p>
            <strong>Country:</strong> {geoData.country}
          </p>
          <p>
            <strong>Region:</strong> {geoData.regionName}
          </p>
          <p>
            <strong>City:</strong> {geoData.city}
          </p>
        </div>
      ) : (
        <p>Could not fetch geolocation data.</p>
      )}
    </div>
  );
};

export default Location;
