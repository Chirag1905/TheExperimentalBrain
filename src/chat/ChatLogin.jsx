import { Suspense, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import ChatApp from "./ChatApp";
import axios from "axios";
import experimental_brain_logo from "../assets/images/avatar.png"
import Loadding from "./Loadding";
import './style/chatlogin.less'
import { jwtDecode } from "jwt-decode";

export default function ChatLogin() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [showChat, setShowChat] = useState(localStorage.getItem("userData") ? localStorage.getItem("userData") : false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error("Invalid Token", error);
            return null;
        }
    };

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
                console.log("🚀 ~ handleSession ~ userInfo:", userInfo)
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
                console.log("Session Already Exists");
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
                console.log("Session Create successfully");
            } else {
                throw new Error("Failed to add Session");
            }
        } catch (error) {
            toast.error("Session error");
        } finally {
            window.location.reload();
        }
    };

    // const updateUser = async (userId, updatedData) => {
    //     try {
    //         const response = await fetch(`${apiUrl}/users/${userId}`, {
    //             method: "PATCH", // Use "PUT" if you want to replace the entire user object
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(updatedData),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to update user");
    //         }

    //         const result = await response.json();
    //         console.log("User updated:", result);
    //     } catch (error) {
    //         console.error("Error updating user:", error);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // First API call
            const firstApiResponse = await axios.post(
                "http://192.46.208.144:8080/experimentalbrain/auth/login",
                {
                    userName: email,
                    password: password,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // Check if the first API call was successful
            if (firstApiResponse?.data?.status === 200) {
                const userData = {
                    id: firstApiResponse?.data?.techveinClientId,
                    email: firstApiResponse?.data?.user_info?.full_name,
                    token: firstApiResponse?.data?.token,
                    role: "Admin",
                };
                localStorage.setItem("userData", JSON.stringify(userData));
                await handleSession();
                setShowChat(true);
                toast.success("Login Successful via First API", {
                    theme: 'colored',
                    autoClose: 1000,
                });
                return;
            } else if (firstApiResponse?.data?.status === 401) {
                try {
                    const response = await axios.get(`${apiUrl}/users`, {
                        headers: { "Content-Type": "application/json" },
                    });

                    if (!response.data || response?.status !== 200) {
                        throw new Error("Failed to fetch user data");
                    }
                    const users = response.data;
                    const user = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
                    if (!user) {
                        toast.warn("User not found");
                        return;
                    }
                    if (user.password !== password) {
                        toast.error("Incorrect password");
                        return;
                    }
                    const userData = {
                        id: user?.id,
                        email: user?.email,
                        role: user?.role,
                    };
                    localStorage.setItem("userData", JSON.stringify(userData));
                    await handleSession();
                    setShowChat(true);
                    toast.success("Login Successful via Second API", {
                        theme: 'colored',
                        autoClose: 1000,
                    });
                } catch (error) {
                    console.log(`API login error: ${error.message}`);
                    toast.error("Login failed. Please try again.");
                }
            }
        } catch (error) {
            console.warn("First API failed, trying second API...");
        }
    };


    // const checkLogin = async (e) => {
    //     e.preventDefault();

    //     // First API login attempt
    //     try {
    //         const firstApiResponse = await axios.post(
    //             "http://192.46.208.144:8080/experimentalbrain/auth/login",
    //             {
    //                 userName: email,
    //                 password,
    //             },
    //             {
    //                 headers: { "Content-Type": "application/json" },
    //             }
    //         );

    //         const myToken = decodeToken(firstApiResponse.data.token);
    //         console.log(myToken, "token data")

    //         const newUserID = Date.now().toString();

    //         // Check response for success
    //         if (firstApiResponse?.data?.status === 200 && firstApiResponse?.data?.token) {
    //             const response = await fetch(`${apiUrl}/users`, {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({ email, password, role: "Admin", id: newUserID }), // Unique ID
    //             });

    //             if (!response.ok) {
    //                 throw new Error("Failed to create user");
    //             }

    //             const data = await response.json();
    //             console.log("User created successfully:", data);
    //             const userData = {
    //                 id: newUserID,
    //                 email: myToken.sub,
    //                 role: "Admin",
    //                 token: firstApiResponse.data.token,
    //                 expiresAt: Date.now() + firstApiResponse.data.expiresIn,
    //             };
    //             localStorage.setItem("userData", JSON.stringify(userData));
    //             toast.success("Login Successful");
    //             setShowChat(true);
    //             await handleSession();
    //             console.log("Login successful via first API");
    //             return;
    //         }

    //         // If no token or unexpected structure, treat as failure
    //         const errorDescription = firstApiResponse?.data?.properties?.description || "Login failed: Invalid response structure";
    //         toast.error(errorDescription);
    //         console.warn("Login failed via first API");
    //     } catch (error) {
    //         // Handle error cases
    //         if (error.response) {
    //             const errorDescription = error.response.data?.properties?.description || "An error occurred";
    //             toast.error(`Login failed: ${errorDescription}`);
    //             console.error("First API Login Error:", errorDescription);
    //         } else {
    //             // Network or unexpected errors
    //             console.error("First API Login Error:", error.message);
    //             toast.error("An error occurred while trying to log in.");
    //         }
    //     } finally {
    //         window.location.reload();
    //     }
    // }


    // const checkAndUpdate = async (userID, userEmail, userRole, userPassword) => {
    //     // e.preventDefault();

    //     // First API login attempt
    //     try {
    //         const firstApiResponse = await axios.post(
    //             "http://192.46.208.144:8080/experimentalbrain/auth/login",
    //             {
    //                 userName: email,
    //                 password,
    //             },
    //             {
    //                 headers: { "Content-Type": "application/json" },
    //             }
    //         );

    //         // Check response for success
    //         if (firstApiResponse?.data?.status === 200 && firstApiResponse?.data?.token) {
    //             updateUser(userID, {
    //                 email: userEmail,
    //                 password: userPassword,
    //             })
    //             const userData = {
    //                 id: userID,
    //                 email: userEmail,
    //                 role: 'Admin',
    //             };
    //             localStorage.setItem("userData", JSON.stringify(userData));
    //             toast.success("Login Successful");
    //             setShowChat(true);
    //             await handleSession();
    //             console.log("Login successful via first API");
    //             return;
    //         }

    //         // If no token or unexpected structure, treat as failure
    //         const errorDescription = firstApiResponse?.data?.properties?.description || "Login failed: Invalid response structure";
    //         toast.error(errorDescription);
    //         console.warn("Login failed via first API");
    //     } catch (error) {
    //         // Handle error cases
    //         if (error.response) {
    //             const errorDescription = error.response.data?.properties?.description || "An error occurred";
    //             toast.error(`Login failed: ${errorDescription}`);
    //             console.error("First API Login Error:", errorDescription);
    //         } else {
    //             // Network or unexpected errors
    //             console.error("First API Login Error:", error.message);
    //             toast.error("An error occurred while trying to log in.");
    //         }
    //     } finally {
    //         window.location.reload();
    //     }
    // }

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Secondary API login attempt
    //     try {
    //         const response = await axios.get(`${apiUrl}/users`, {
    //             headers: { "Content-Type": "application/json" },
    //         });

    //         if (response?.status !== 200) {
    //             throw new Error("Failed to fetch user data from secondary API");
    //         }

    //         const users = response.data;
    //         const user = users.find((user) => user.email === email);

    //         if (!user) {
    //             checkLogin()
    //             toast.warn("User not found");
    //             return;
    //         }

    //         if (user.password === null) {
    //             checkAndUpdate(user.id, user.email, user.role, user.password)
    //         }

    //         if (user.password !== password) {
    //             toast.error("Incorrect password");
    //             return;
    //         }

    //         // Valid user, proceed with login
    //         delete user.password;
    //         localStorage.setItem("userData", JSON.stringify(user));
    //         toast.success("Login Successful");
    //         console.log("Login successful via second API");
    //         await handleSession();
    //         setShowChat(true);
    //     } catch (error) {
    //         console.error("Second API Login Error:", error.message);
    //         toast.error(`Login error: ${error.message}`);
    //     }
    // };


    useEffect(() => {
        const checkTokenExpiration = () => {
            const userDataString = localStorage.getItem("userData");
            if (userDataString) {
                try {
                    const userData = JSON.parse(userDataString);
                    const token = userData?.token;

                    if (!token) return;

                    const decodedToken = jwtDecode(token);

                    const currentTime = Date.now() / 1000;
                    // console.log(decodedToken.exp, "decode exp", currentTime, "current time stam");
                    if (decodedToken.exp < currentTime) {
                        localStorage.removeItem("userData");
                        toast.error("Session expired. Please log in again.", { position: "top-right" });

                        setTimeout(() => {
                            // window.location.href = "/";
                            setShowChat(false);
                        }, 3000);
                    }
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            }
        };

        checkTokenExpiration();
    }, []);

    useEffect(() => {
        if(localStorage.getItem("stop")){
            localStorage.setItem("stop", false)
        }
    },[])

    return (
        <Suspense fallback={<Loadding />}>
            <ToastContainer draggable theme="colored" />
            {showChat ? (
                <ChatApp />
            ) : (
                <>
                    <div className="body">
                        <div className="main">
                            <input type="checkbox" id="chk" aria-hidden="true" />

                            <div className="signup">
                                <form onSubmit={handleSubmit}>
                                    <img className="image" src={experimental_brain_logo} alt="experimental_brain_logo" />
                                    <label htmlFor="chk" aria-label="" className="login-label-sign-in">Login</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        className="input-class"
                                    />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="input-class"
                                    />
                                    <button type="submit" className="login-button">Sign In</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Suspense>
    );
}