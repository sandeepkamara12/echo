import { useEffect, useState } from 'react'
import axiosInstance from '../../axiosInstance';
import { toast } from 'react-toastify';
import { getSocket } from '../../socket';
import { useAuth } from '../../hooks/useAuth';
import { useRef } from 'react';
import axios from 'axios';
import Peer from 'peerjs';
import { v4 as uuidV4 } from 'uuid';

const Users = () => {
  const { user, accessToken } = useAuth();
  const socket = getSocket();

  const [users, setUsers] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [stream, setStream] = useState(null);
  const [image, setImage] = useState("");

  const [me, setMe] = useState('');
  const [callFrom, setCallFrom] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const [peerId, setPeerId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const [connected, setConnected] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const currentCallRef = useRef(null);


   // Initialize PeerJS
  useEffect(() => {
    const backendHost = import.meta.env.VITE_BA_URL.replace(/^https?:\/\//, ""); 
const peer = new Peer(uuidV4(), {
  host: backendHost,
  path: "/",
  secure: true,
});

    peer.on('open', (id) => {
      console.log('My peer ID is:', id);
      setPeerId(id);
    });

    // Handle incoming calls
    peer.on('call', async (call) => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play();

      call.answer(stream);
      currentCallRef.current = call;

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
        setConnected(true);
      });
    });

    peerRef.current = peer;

    return () => {
      peer.disconnect();
      peer.destroy();
    };
  }, []);

 const callPeer = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    localVideoRef.current.play();

    const call = peerRef.current.call(remoteId, stream);
    currentCallRef.current = call;

    call.on('stream', (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play();
      setConnected(true);
    });
  };

  const hangUp = () => {
    if (currentCallRef.current) {
      currentCallRef.current.close();
      setConnected(false);
    }
  };
  
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   console.log(formData, 'accessToken')

  //   // Upload file via HTTP to your Node backend
  //   let res = await axios.post('http://localhost:4000/api/upload', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       Authorization: `Bearer ${accessToken}`
  //     }
  //   });
  //   console.log(res?.data?.url, 'file upload response');

  //   // Send file URL through Socket.IO
  //   socket.emit('chatMessage', {
  //     type: 'file',
  //     url: res?.data?.url,
  //     Authorization: `Bearer ${accessToken}`
  //   });
  // };

  // useEffect(() => {
  //   socket.on('chatMessage', (msg) => {
  //     console.log('Received chat message:', msg);
  //     setImage(msg.url);
  //   });
  // }, [socket]);

  useEffect(() => {
    if (user) {
      socket.emit('LOGGEDIN_USER', user)
    }
    socket.on("ONLINE_USERS", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    });
    socket.on("ME", (id) => {
      console.log("My socket ID:", id);
      setMe(id);
    });

    // socket.on('CALL_RECEIVED', ({ from, signal }) => {
    //   setCallFrom({ from, signal });
    // });
    return () => {
      socket.off("ONLINE_USERS");
      socket.off("ME");
    }
  }, [socket, user]);



  const isUserOnline = (userId) => {
    return onlineUsers.length > 0 ? onlineUsers.some(user => user._id === userId) : [];
  }

  const callUser = (anotherUserId) => {
    console.log("Calling user...", anotherUserId);
    
    // var peer = new Peer();
    // const peer = new Peer({
    //   initiator: true,
    //   trickle: false, 
    //   stream: stream, 
    // });
 

    // peer.on("signal", (data) => {
    //   console.log("Signal data:", data);
    //   socket.emit("CallToUser", {
    //     callToUserId: anotherUserId,
    //     signalData: data,
    //     from: me,
    //     name: user.name,
    //   });
    // });
    // connectionRef.current = peer;

    // peer.on('stream', (currentStream) => {
    //   if (userVideo.current) userVideo.current.srcObject = currentStream;
    // });
    // socket.on("CALL_ACCEPTED", (signal) => {
    //   console.log("Call accepted!");
    //   peer.signal(signal);
    // });
  }


  //  const answerCall = () => {
  //   setCallAccepted(true);
  //   const peer = new Peer({ initiator: false, trickle: false, stream });
  //   peer.on('signal', (data) => {
  //     socket.emit('ANSWER_CALL', { signal: data, to: callFrom.from });
  //   });

  //   peer.signal(callFrom.signal);
  //   connectionRef.current = peer;
  // };


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
      {/* <input type="file" name="image" id="image" onChange={handleFileUpload} /> */}
      {/* <img src={image} alt="Received" style={{ width: '200px', height: '200px' }} /> */}
      <input
          type="text"
          placeholder="Enter remote peer ID"
          value={remoteId}
          onChange={(e) => setRemoteId(e.target.value)}
        />
        <button onClick={callPeer}>Call</button>
        <button onClick={hangUp} disabled={!connected}>Hang Up</button>
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <video ref={localVideoRef} muted style={{ width: '45%', border: '1px solid black' }} />
        <video ref={remoteVideoRef} style={{ width: '45%', border: '1px solid black' }} />
      </div>
      <ul>
        {
          users?.length > 0 && users.map(user => {
            return (
              <li key={user?._id}
              onClick={() => callUser(user?._id)}
              >
                {user?.name}
                {isUserOnline(user?._id) ? <span style={{"width":"10px", "height":"10px", "backgroundColor":"green", "borderRadius":"20px", "display":"inline-block"}}></span> : <span style={{"width":"10px", "height":"10px", "backgroundColor":"red", "borderRadius":"20px", "display":"inline-block"}}></span>}
              </li>
            );
          })
        }
      </ul>
      <h2>local video</h2>
      <video src="" id="local-video" ref={myVideo => { if (myVideo && stream) { myVideo.srcObject = stream; } }}
        autoPlay muted
      >

      </video>
      {/* {callFrom && !callAccepted && (
        <h1>hi</h1>
        <button onClick={answerCall}>Answer Call</button>
      )} */}
    </div>
  )
}

export default Users
