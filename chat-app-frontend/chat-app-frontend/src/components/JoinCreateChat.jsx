import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRoomAPI, joinRoomAPI } from "../services/RoomService";
import { useNavigate } from "react-router";
import { useChatContext } from "../context/ChatContext";

function JoinCreateChat() {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: ""
  });

  const { roomId, setRoomId, currentUser, setCurrentUser, connected, setConnected } = useChatContext();
  const navigate = useNavigate();  

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    })
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("INVALID INPUT !!")
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      try {
        const response = await joinRoomAPI(detail.roomId);
        console.log(response);
        toast.success("ROOM JOINED !!!!!");
        setRoomId(response.roomId);
        setCurrentUser(detail.userName);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status === 400) {
          toast.error(error.response.data);
        } else {
          toast.error("ERROR IN JOINING ROOM !!!");
        }
        console.log(error)

      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      try {
        const response = await createRoomAPI(detail.roomId);
        console.log(response);
        toast.success("ROOM CREATED SUCCESSFULLY !!!!!")
        setRoomId(response.roomId)
        setCurrentUser(response.currentUser)
        setConnected(true)
        navigate("/chat")
        // joinChat();
      } catch (error) {
        console.log(error)
        if (error.status === 400) {
          toast.error("ROOM ALREADY EXISTS")
        } else {
          toast("ERROR IN CREATING ROOM")
        }
      }
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 w-full flex flex-col gap-3 dark:bg-gray-800 max-w-md shadow rounded-2xl">
        <h1 className="text-2xl font-semibold">Join Room / Create Room...</h1>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
          >
            Your Name
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            id="name"
            name="userName"
            placeholder="Enter your Name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="room"
            className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
          >
            Room ID / New Room ID
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.roomId}
            type="text"
            id="room"
            name="roomId"
            placeholder="Enter the Room Id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="flex justify-center mt-5">
          <button
            onClick={joinChat}
            type="button"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            type="button"
            className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinCreateChat;
