import React, { useEffect, useRef, useState } from 'react'
import { useChatContext } from '../context/ChatContext';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { baseURL } from '../config/AxiosHelper';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { Paperclip, Send } from 'lucide-react'
import { getMessagesAPI } from '../services/RoomService';

function ChatPage() {

  const { roomId, currentUser, connected, setRoomId, setCurrentUser, setConnected } = useChatContext();
  // console.log(roomId);
  // console.log(currentUser);
  // console.log(connected);

  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate("/")
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([
    // {
    //   content: "Hello ?",
    //   sender: "Daksh"
    // }, {
    //   content: "Hello ?",
    //   sender: "Daksh"
    // }, {
    //   content: "Hello ?",
    //   sender: "Daks"
    // }, {
    //   content: "Hello ?",
    //   sender: "Daks"
    // }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null)
  // const [currentUser] = useState("Daksh");


  //Load Old Messages
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagesAPI(roomId);
        // console.log(messages);
        setMessages(messages);
      } catch (error) {

      }
    }
    loadMessages();
  }, [roomId])


  //Scroll Messages
  // useEffect(() => {
  //   if(chatBoxRef.current){
  //     chatBoxRef.current.scroll({
  //       top:chatBoxRef.current.scrollHeight,
  //       behavior:'smooth'
  //     })
  //   }

  // }, [messages])

  useEffect(() => {
    if (chatBoxRef.current) {
      const lastMessage = chatBoxRef.current.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);



  //Subscribe WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        // toast.success("CONNECTED");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        })
      })
    }

    if (connected) {
      connectWebSocket();
    }
  }, [roomId])


  //Send Message
  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      console.log(input);

      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId
      }

      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      setInput("");
    }
  }

  const handleLogOut = () => {
    setConnected(false);
    toast("LEFT ROOM !!");
    setRoomId('');
    setCurrentUser('');
  }

  return (
    <div>
      {/* <ChatHeader/> */}

      <div>


        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <span className="self-center text-md font-semibold whitespace-nowrap dark:text-white">Room: {roomId}</span>
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              {/* <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started</button> */}
              <button onClick={handleLogOut} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center  dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Leave</button>

            </div>
            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
              <span className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <h1 className="block py-2 px-3 text-gray-900 rounded-sm md:p-0 dark:text-white  dark:border-gray-700">User: {currentUser}</h1>
              </span>
            </div>
          </div>
        </nav>

      </div>

      {/* <ChatMessage/> */}

      <div ref={chatBoxRef} className='py-18 px-10' >
        {messages.map((message, index) => (
          <div key={index} className={`flex py-1 ${message.sender === currentUser ? 'justify-end' : 'justify-start'} `}>
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

      {/* <ChatSend/> */}

      <div className=" fixed rounded-full bottom-0 lg:px-20 w-full flex items-center p-4 bg-gray-100 dark:bg-gray-900">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevents newline in input
              sendMessage();
            }
          }}
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          <Paperclip size={20} />
        </button>
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          <Send size={20} />
        </button>
      </div>

    </div>
  )
}

export default ChatPage