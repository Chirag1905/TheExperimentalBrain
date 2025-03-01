import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import ReactLoading from "react-loading";
import '../chat/style/loadding.less';

const Authorize = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const handleSession = async () => {
        try {
            const userRole = localStorage.getItem('userData');
            if (!userRole) {
                toast.error("No user data found");
                return;
            }

            let userInfo;
            try {
                userInfo = JSON.parse(userRole);
            } catch (error) {
                toast.error("Error parsing user data");
                return;
            }

            // Fetch existing sessions
            const existingSessionsResponse = await axios.get(`${apiUrl}/sessions`, {
                headers: { "Content-Type": "application/json" }
            });

            const existingSessions = existingSessionsResponse?.data;

            // Check if a session with the same userInfo.id already exists
            if (existingSessions?.some(session => session.id === userInfo.id)) {
                toast.warn("Session Already Exists");
                return;
            }

            // Create a new session
            const sessionResponse = await axios.post(`${apiUrl}/sessions`, {
                "id": userInfo.id,
                "chat": [],
                "chats": [
                    {
                        "title": "Generate useLocalStorage",
                        "id": 321123123,
                        "ct": "2023-12-12",
                        "messages": [
                            {
                                "content": "Hello, I'm The Experimental Brain! Ask me anything!",
                                "id": 123,
                                "role": "user",
                                "sentTime": "1682827639323"
                            }
                        ]
                    },
                    {
                        "title": "Generate a React hooks useLocalStorage",
                        "ct": "2023-12-12",
                        "id": 92839,
                        "messages": [
                            {
                                "id": 1682511616366,
                                "sentTime": "1682827639313",
                                "role": "user",
                                "content": "Write a Modal component in React\n"
                            },
                            {
                                "id": 1682511616366,
                                "sentTime": "1681827632313",
                                "role": "assistant",
                                "content": "Write a Modal component in React：\n\n```jsx\nimport React, { useState } from 'react';\n\nconst Modal = ({ isOpen, onClose, children }) => {\n  const [isModalOpen, setIsModalOpen] = useState(isOpen);\n\n  const handleClose = () => {\n    setIsModalOpen(false);\n    onClose();\n  };\n\n  return (\n    <>\n      {isModalOpen && (\n        <div className=\"modal\">\n          <div className=\"modal-content\">\n            <span className=\"close\" onClick={handleClose}>\n              &times;\n            </span>\n            {children}\n          </div>\n        </div>\n      )}\n    </>\n  );\n};\n\nexport default Modal;\n```\n\nIn this component, we use the useState hook to track whether the modal is open. When the isOpen prop changes, we update the state to reflect the new value. \n\nWe also define a function called handleClose, which will close the modal and call the onClose callback function (if there is one). \n\nFinally, we return a div element containing the content of the modal box, and decide whether to render the element based on the isModalOpen state."
                            }
                        ]
                    },
                    {
                        "ct": "2032-12-23",
                        "id": 2381923,
                        "messages": [],
                        "title": "ex"
                    }
                ],
                "conversation": [],
                "cotent": "",
                "current": 0,
                "currentChat": 0,
                "is": {
                    "ChatInstitution": false,
                    "ChatApi": false,
                    "ChatRegister": false,
                    "apps": true,
                    "config": false,
                    "fullScreen": true,
                    "inputing": false,
                    "sidebar": true,
                    "thinking": false,
                    "typeing": false,
                },
                "options": {
                    "account": {
                        "name": "CHAT——AI",
                        "avatar": ""
                    },
                    "general": {
                        "command": "ENTER",
                        "language": "English",
                        "size": "normal",
                        "theme": "light"
                    },
                    "openai": {
                        "apiKey": "",
                        "baseUrl": "",
                        "max_tokens": 2048,
                        "model": "gpt-4-turbo",
                        "n": 1,
                        "organizationId": "",
                        "stream": true,
                        "temperature": 1,
                    }
                },
                "search_text": "",
                "selected_attachment": "",
                "selected_grade": "",
                "typeingMessage": {},
                "version": "0.1.0",
            }, {
                headers: { "Content-Type": "application/json" }
            });

            if (sessionResponse?.status === 201 || sessionResponse?.status === 200) {
                toast.success("Session Added successfully");
            } else {
                throw new Error("Failed to add Session");
            }
        } catch (error) {
            toast.error("Session error");
        } finally {
            window.location.reload();
        }
    };

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
                if (!response.data || !response.data.user_info) {
                    console.error("Invalid API response:", response.data);
                    return;
                }
                const userData = {
                    id: response?.data?.user_info?.username + response?.data?.techveinClientId,
                    email: response?.data?.user_info?.full_name,
                    token: response?.data?.token,
                    role: "User",
                };
                localStorage.setItem("userData", JSON.stringify(userData));
                localStorage.removeItem("userCodeData");
                await handleSession();
                // navigate("/");
                window.location.href = "/teb/"
            })
            .catch(error => {
                console.error("Error during authentication:", error);
                toast.error("Authentication failed.");
            });
    }, []);

    return <div className="loading-container">
        <ReactLoading type="spin" color="#f35a2e" height={100} width={50} />
        <h2>Loading</h2>
    </div>
};

export default Authorize;
