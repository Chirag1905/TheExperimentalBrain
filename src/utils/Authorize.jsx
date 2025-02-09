import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const Authorize = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("code");

        if (!tokenFromUrl) {
            console.error("No authorization code found in URL.");
            return;
        }

        const storedData = localStorage.getItem("userCodeData");
        if (!storedData) {
            console.error("No userCodeData found in localStorage.");
            return;
        }

        const codeData = JSON.parse(storedData);

        axios.post(`http://192.46.208.144:8080/experimentalbrain/auth/fedauthenticate?client_id=${codeData.clientId}&client_secret=${codeData.clientServer}&grant_type=authorization_code&redirect_uri=${codeData.redirectUrl}&code=${tokenFromUrl}&appUrl=${codeData.appUrl}`)
        .then(async (response) => {
            console.log("API Response:", response.data);

            if (!response.data || !response.data.user_info) {
                console.error("Invalid API response:", response.data);
                return;
            }

            const userData = {
                id: response.data.user_info.id,
                email: response.data.user_info.email,
                role: response.data.user_info.type,
                token: response.data.token,
                expiresAt: Date.now() + response.data.expiresIn,
            };

            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.removeItem("userCodeData");

            // Check if session exists
            try {
                const existingSessionsResponse = await axios.get(`${apiUrl}/sessions`, {
                    headers: { "Content-Type": "application/json" }
                });

                const existingSessions = existingSessionsResponse?.data;

                if (!existingSessions.some(session => session.id === userData.id)) {
                    // Create a new session
                    await axios.post(`${apiUrl}/sessions`, {
                        id: userData.id,
                        chat: [],
                        chats: [],
                        conversation: [],
                        current: 0,
                        currentChat: 0,
                        is: {
                            ChatInstitution: false,
                            ChatApi: false,
                            ChatRegister: false,
                            apps: true,
                            config: false,
                            fullScreen: true,
                            inputing: false,
                            sidebar: true,
                            thinking: false,
                            typeing: false,
                        },
                        options: {
                            account: {
                                name: "CHAT——AI",
                                avatar: ""
                            },
                            general: {
                                command: "ENTER",
                                language: "English",
                                size: "normal",
                                theme: "light"
                            },
                            openai: {
                                apiKey: "",
                                baseUrl: "",
                                max_tokens: 2048,
                                model: "gpt-4-turbo",
                                n: 1,
                                organizationId: "",
                                stream: true,
                                temperature: 1,
                            }
                        },
                        search_text: "",
                        selected_attachment: "",
                        selected_grade: "",
                        typeingMessage: {},
                        version: "0.1.0",
                    }, {
                        headers: { "Content-Type": "application/json" }
                    });

                    toast.success("Session created successfully");
                } else {
                    toast.info("Session already exists");
                }

            } catch (sessionError) {
                console.error("Error handling session:", sessionError);
                toast.error("Session handling failed");
            }

            // Redirect after login
            navigate("/");
        })
        .catch(error => {
            console.error("Error during authentication:", error);
            toast.error("Authentication failed.");
        });
    }, []);

    return <div>Authorizing...</div>;
};

export default Authorize;
