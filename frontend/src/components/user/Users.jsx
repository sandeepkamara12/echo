import { useEffect, useState } from 'react'
import axiosInstance from '../../axiosInstance';
import { toast } from 'react-toastify';
import { getSocket } from '../../socket';
import { useAuth } from '../../hooks/useAuth';
import { useRef } from 'react';

const Users = () => {
  const {user} = useAuth();
  const socket = getSocket();
  const [users, setUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const[stream, setStream] = useState(null);
  const myVideo = useRef();

  useEffect(()=>{
    if(user) {
      socket.emit('LOGGEDIN_USER', user)
    }
    socket.on("ONLINE_USERS", (onlineUsers)=>{
      setOnlineUsers(onlineUsers);
    });
    navigator.mediaDevices.getUserMedia({video:true, audio:true}).then(stream=>{
      setStream(stream);
      if(myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    });
    // Clean up socket 
    return ()=> {
      socket.off("ONLINE_USERS");
    }
  },[socket, user]);

  const isUserOnline = (userId) => {
    return onlineUsers.length > 0 ? onlineUsers.some(user=>user._id === userId) : [];
  }

  useEffect(() => {
    const controller = new AbortController();
    const getAllOtherUsers = async () => {
      try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_BA_URL}/api/get-all-other-users`);
        if (response.data.success) {
          setUsers(response.data.users)
        }
      } catch (error) {
        if (error.name === "CanceledError") {
          toast.error(error.message);
          console.log("Request canceled:", error.message);
        } else {
          toast.error(error.message || "Failed to fetch users");
        }
      }
    }
    getAllOtherUsers();
    return () => controller.abort();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {
          users?.length > 0 && users.map(user => {
            return (
              <li key={user?._id}>
                {user?.name}
                {isUserOnline(user?._id) ? <span>online</span> : <span>offline</span> }
              </li>
            );
          })
        }
      </ul>
      <h2>local video</h2>
      <video src="" id="local-video" ref={myVideo => {if(myVideo && stream) {myVideo.srcObject = stream; }}}
      autoPlay muted
        >

      </video>
    </div>
  )
}

export default Users
