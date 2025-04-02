import React, { useEffect, useRef, useState } from 'react'
import { useChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { baseURL } from '../config/AxiosHelper';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';

function ChatMessage() {
  const {roomId,currentUser,connected} = useChatContext();
  console.log(roomId);
  console.log(currentUser);
  console.log(connected);

  const navigate = useNavigate();

  useEffect(() => {
    if(!connected){
      navigate("/")
    }
  }, [connected,roomId,currentUser]);

  const [messages, setMessages] = useState([
    {
      content: "Hello ?",
      sender: "Daksh"
    }, {
      content: "Hello ?",
      sender: "Daksh"
    }, {
      content: "Hello ?",
      sender: "Daks"
    }, {
      content: "Hello ?",
      sender: "Daks"
    }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null)
  // const [currentUser] = useState("Daksh");

  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({},()=>{
        setStompClient(client);
        toast.success("CONNECTED");

        client.subscribe(`/topic/room/${roomId}`,(message)=>{
          console.log(message);
          const newMessage = JSON.parse(message.body);
          setMessages((prev)=>[...prev,newMessage]);
        })
      })
    }
  
    connectWebSocket();
  }, [roomId])
  

  return (
    <div className='py-18 px-10' >
      {messages.map((message, index) => (
        <div key={index} className={ `flex py-1 ${message.sender===currentUser? 'justify-end' : 'justify-start'} `}>
          <div className='p-2 bg-blue-600 max-w-xs rounded-2xl'>
            <div className='flex flex-row gap-2'>
              <img src="https://avatar.iran.liara.run/public/48" className='h-10 w-10' alt="" />
              <div className=''>
                <p className='text-sm font-bold'>{message.sender}</p>
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatMessage