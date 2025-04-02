import { Paperclip, Send } from 'lucide-react'
import React from 'react'



function ChatSend() {
    return (
        <div className=" fixed rounded-full bottom-0 lg:px-20 w-full flex items-center p-4 bg-gray-100 dark:bg-gray-900">
            <input
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
                className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
                <Send size={20} />
            </button>
        </div>
    )
}

export default ChatSend