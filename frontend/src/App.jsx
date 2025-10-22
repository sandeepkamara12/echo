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
  // const socket = getSocket();
  // console.log(socket, 'socket');
  // socket.on("connect", () => {
  //   console.log("✅ Connected to socket:", socket.id);
  // });

  // socket.on("connect_error", (err) => {
  //   console.error("❌ Connection error:", err.message);
  // });
  return (
    <>

      <ToastContainer position="top-right" />
      <Routes>

        {/* Routes, those both users and admin can access */}
        <Route path="/" element={<OuterLayout />}>
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/users" element={<Users />} />
          {/* <Route path="/user-agreement" element={<UserAgreement />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
        </Route>
        <Route path="/" element={<SidebarLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        {/* Reset Password Page */}
        {/* <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/good-bye" element={<GoodBye />} /> */}

        {/* Unauthorized Page - Rendered Independently */}
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}


        {/* Routes, those users can access */}
        {/* <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/" element={<Layout />}>
          <Route path="bookmarks" element={<MyBookmarks />} />
          <Route path="result" element={<GoogleCustomSearch />} />
          <Route path="import" element={<ImportBookmarks />} />
        </Route>
      </Route> */}

        {/* <Route path="/admin/login" element={<NonProtectedAdminRoutes><AdminLogin /></NonProtectedAdminRoutes>} /> */}

        {/* Routes, those admin can access */}
        {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="category" element={<Category />} />
          <Route path="user" element={<User />} />
          <Route path="admin-bookmarks" element={<AdminBookmarks />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="update-user" element={<UpdateAdmin />} />
          <Route path="import" element={<Import />} />
        </Route>
      </Route> */}

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
    // <SidebarLayout>
    //   <div className='px-3 py-4 h-[calc(100vh-100px)]'>
    //     <div></div>
    //     <Login />
    //   </div>
    // </SidebarLayout>
  )
}

export default App