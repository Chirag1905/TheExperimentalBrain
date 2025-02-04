import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FormStyles.css";

const AppAuthenticate = () => {
  const [formData, setFormData] = useState({
    client_id: "",
    redirect_uri: "",
    response_type: "",
  });

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tokenFromUrl = urlParams.get("code");

    if (!tokenFromUrl) {
      console.error("No authorization code found in URL.");
      return;
    }

    console.log(tokenFromUrl, "tokenFromUrl");

    const url = `http://192.46.208.144:8080/experimentalbrain/auth/getcode/${tokenFromUrl}`;

    axios.get(url)
      .then((response) => {
        console.log(response.data, "response.data");

        if (!response.data.appUrl) {
          console.error("appUrl is missing in API response");
          return;
        }

        const updatedFormData = {
          client_id: response.data.clientId || "",
          redirect_uri: response.data.redirectUrl || "",
          response_type: tokenFromUrl,
        };

        setFormData(updatedFormData);

        const authURL = response.data.appUrl + "oauth/authorize/";
        console.log(authURL, "authURL");

        axios.post(authURL, updatedFormData)
          .then((authResponse) => {
            console.log(authResponse.data, "response.data auth");
          })
          .catch((error) => {
            console.error("Authorization request failed:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching client details:", error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("https://your-api-endpoint.com", formData);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="form-container">
      <div className="animationload" style={{ display: "none" }}>
        <div className="osahanloading"></div>
      </div>
      <form id="frm1" name="frm1" onSubmit={handleSubmit}>
        <input type="hidden" name="client_id" value={formData.client_id} />
        <input type="hidden" name="redirect_uri" value={formData.redirect_uri} />
        <input type="hidden" name="response_type" value={formData.response_type} />
        <h1>Loading...</h1>
      </form>
    </div>
  );
};

export default AppAuthenticate;
