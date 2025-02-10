import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import '../chat/style/loadding.less';

const AppAuthenticate = () => {
  const [redirectedUrl, setRedirectedUrl] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("code");

    if (!tokenFromUrl) {
      console.error("No authorization code found in URL.");
      return;
    }

    axios
      .get(`http://192.46.208.144:8080/experimentalbrain/auth/getcode/${tokenFromUrl}`)
      .then((response) => {
        if (!response.data.appUrl) {
          console.error("appUrl is missing in API response");
          return;
        }

        localStorage.setItem("userCodeData", JSON.stringify(response.data));

        const authUrl = `${response.data.appUrl}/oauth/authorize/?client_id=${response.data.clientId}&redirect_uri=${encodeURIComponent(response.data.redirectUrl)}&response_type=code`;

        // Redirect the user in the same tab
        window.location.href = authUrl;
      })
      .catch((error) => {
        console.error("Error fetching client details:", error);
      });
  }, []);

  return (
    <div className="loading-container">
                <ReactLoading type="spin" color="#f35a2e" height={100} width={50} />
                <h2>Loading</h2>
            </div>
  );
};

export default AppAuthenticate;
