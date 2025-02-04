import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css"
import 'react-toastify/dist/ReactToastify.css';
import Loadding from './chat/Loadding.jsx';
import ChatLogin from './chat/ChatLogin.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import AppAuthenticate from './utils/AppAuthenticate.jsx';
import PageNotFound from './pages/PageNotFound.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Loadding />}>
    <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatLogin />} />
          <Route path="/authenticate" element={<AppAuthenticate />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>,
)
