import React, {
  useRef,
  useEffect,
  useReducer,
  useContext,
  createContext,
} from "react";
import action from "./action";
import reducer from "./reducer";
import { initState } from "./initState";
import axios from "axios";

export const ChatContext = createContext(null);
export const MessagesContext = createContext(null);

const userRole = localStorage.getItem('userData');
let userInfo = userRole ? JSON.parse(userRole) : {};
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const SERVER_URL = userInfo.id ? `${apiUrl}/sessions/${userInfo.id}` : null;


export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const actionList = action(state, dispatch);
  const latestState = useRef(state);

  useEffect(() => {
    latestState.current = state;
  }, [state]);

  useEffect(() => {
    const fetchData = async () => {
      if (!SERVER_URL) return;

      try {
        const response = await axios.get(SERVER_URL);
        dispatch({ type: "SET_STATE", payload: response.data });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [SERVER_URL]);

  useEffect(() => {
    const saveData = async () => {
      if (!SERVER_URL) return;

      try {
        await axios.put(SERVER_URL, latestState.current, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    saveData();
  }, [state]); // Only trigger on state changes

  return (
    <ChatContext.Provider value={{ ...state, ...actionList }}>
      <MessagesContext.Provider value={dispatch}>
        {children}
      </MessagesContext.Provider>
    </ChatContext.Provider>
  );
};

export const useGlobal = () => useContext(ChatContext);
export const useMessages = () => useContext(MessagesContext);


// import React, { useRef, useEffect, useReducer, useContext, createContext } from "react";
// import action from "./action";
// import reducer from "./reducer";
// import { initState } from "./initState";

// export const ChatContext = createContext(null);
// export const MessagesContext = createContext(null);

// const SERVER_URL = `http://localhost:8000/sessions`;

// export const ChatProvider = ({ children }) => {
//   const userRole = localStorage.getItem('userData');
//   let userInfo = JSON.parse(userRole);

//   const init = initState;
//   const [state, dispatch] = useReducer(reducer, init);
//   const actionList = action(state, dispatch);
//   const latestState = useRef(state);

//   useEffect(() => {
//     latestState.current = state;
//   }, [state]);

//   useEffect(() => {
//     const fetchSession = async () => {
//       try {
//         const response = await fetch(`${SERVER_URL}/${userInfo.id}`);
//         if (response.ok) {
//           const savedState = await response.json();
//           dispatch({ type: "SET_STATE", payload: savedState });
//         }
//       } catch (error) {
//         console.error("Failed to fetch session", error);
//       }
//     };

//     if (userInfo && userInfo.id) {
//       fetchSession();
//     }
//   }, [userInfo]);

//   useEffect(() => {
//     const saveSession = async () => {
//       try {
//         await fetch(`${SERVER_URL}/${userInfo.id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(latestState.current),
//         });
//       } catch (error) {
//         console.error("Failed to save session", error);
//       }
//     };

//     if (userInfo && userInfo.id) {
//       saveSession();
//     }
//   }, [latestState.current, userInfo]);

//   const logout = async () => {
//     try {
//       await fetch(`${SERVER_URL}/${userInfo.id}`, {
//         method: "DELETE",
//       });
//     } catch (error) {
//       console.error("Failed to delete session", error);
//     }
//     localStorage.removeItem("SESSIONS");
//     localStorage.removeItem("userData");
//     dispatch({ type: "RESET_STATE" });
//     location.reload();
//   };

//   return (
//     <ChatContext.Provider value={{ ...state, ...actionList, logout }}>
//       <MessagesContext.Provider value={dispatch}>
//         {children}
//       </MessagesContext.Provider>
//     </ChatContext.Provider>
//   );
// };

// export const useGlobal = () => useContext(ChatContext);
// export const useMessages = () => useContext(MessagesContext);
