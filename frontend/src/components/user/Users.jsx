// import React, { useEffect, useState } from 'react'
// import axiosInstance from '../../axiosInstance';

const Users = () => {
  // const [users, setUsers] = useState(null);
  // const [error, setError] = useState(null);
  // useEffect(()=>{
  //   const controller = new AbortController();
  //   const getAllUsers = async () => {
  //     try {
  //       const response = await axiosInstance.get(`${import.meta.env.VITE_BA_URL}/users?limit=10`);
  //       console.log(response?.data?.users);
  //       if(response?.status === 200) {
  //         setUsers(response?.data?.users);
  //       }
  //     } catch (error) {
  //        if (error.name === "CanceledError") {
  //           console.log("Request canceled:", error.message);
  //         } else {
  //           setError("Failed to fetch users");
  //         }
  //     }
  //   }
  //   getAllUsers();
  //   return ()=> controller.abort();
  // },[]);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {
          // users?.length>0 && users.map(user=><li key={user?._id}>{user?.firstName}</li>)
        }
      </ul>
      {
        // <h2>{error}</h2>
      }
    </div>
  )
}

export default Users
