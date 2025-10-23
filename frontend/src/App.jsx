import './App.css'
import { Route, Routes } from 'react-router-dom';

import Login from './components/common/Login'
import SidebarLayout from './components/layouts/sidebarLayout'
import OuterLayout from './components/layouts/OuterLayout';
import Register from './components/common/Register';
import ForgotPassword from './components/common/ForgotPassword';
import Users from './components/user/Users';
import { getSocket, setSocket } from './socket';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const socket = getSocket();
  socket.on("connect", () => {
    console.log("✅ Connected to socket:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
  });
  return (
    <>

      <ToastContainer position="top-right" />
      <Routes>

        {/* Routes, those both users and admin can access */}
        <Route path="/" element={<OuterLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/" element={<SidebarLayout />}>
          <Route path="/users" element={<Users />} />
        </Route>
        {/* Reset Password Page */}
        {/* <Route path="/reset-password" element={<ResetPassword />} />
        {/* Unauthorized Page - Rendered Independently */}
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  )
}

export default App