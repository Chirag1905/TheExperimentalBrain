import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FormStyles.css";

const AppAuthenticate = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const tokenFromUrl = urlParams.get("code");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tokenFromUrl = urlParams.get("code");

    if (!tokenFromUrl) {
      console.error("No authorization code found in URL.");
      setError("No authorization code found in URL.");
      return;
    }

    setLoading(true);

    const url = `http://192.46.208.144:8080/experimentalbrain/auth/getcode/${tokenFromUrl}`;

    axios.get(url)
      .then((response) => {
        if (!response.data.appUrl) {
          throw new Error("appUrl is missing in API response");
        }

        const updatedFormData = {
          client_id: response.data.clientId || "",
          redirect_uri: response.data.redirectUrl || "",
          response_type: "code",
        };

        setFormData(updatedFormData);

        // Redirect instead of sending a POST request
        const authURL = `${response.data.appUrl}/oauth/authorize/? client_id=${updatedFormData.client_id}&redirect_uri=${updatedFormData.redirect_uri}&response_type=103`;
        console.log(authURL, "authURL");

        axios.get("https://techveindemo.edvein.com/oauth/authorize/?client_id=37fc0732135685cbfaace63b15d98baae1475fbf869d93fb1fc24b92da60f145%20&redirect_uri=http://edveins.techvein.org/techcode.html%20&response_type=code").then((result)=>{
          console.log(result)
        })
        // Redirect to OAuth URL
        window.location.href = authURL;
      })
      .catch((error) => {
        console.error("Error fetching client details:", error);
        setError("Error fetching client details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="form-container">
      {loading && (
        <div className="animationload">
          <div className="osahanloading"></div>
        </div>
      )}
      <h1>{loading ? "Loading..." : `Authentication ${error ? "Failed" : "Completed"}`}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AppAuthenticate;
