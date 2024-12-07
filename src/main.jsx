import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css"
import 'react-toastify/dist/ReactToastify.css';
import Loadding from './chat/Loadding.jsx';
import ChatLogin from './chat/ChatLogin.jsx';
import { toast, ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Loadding />}>
    <ToastContainer />
      <ChatLogin />
    </Suspense>
  </React.StrictMode>,
)
