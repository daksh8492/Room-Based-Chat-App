package com.chat.chat_app_backend.controllers;

import com.chat.chat_app_backend.entities.Message;
import com.chat.chat_app_backend.entities.Room;
import com.chat.chat_app_backend.playload.MessageRequest;
import com.chat.chat_app_backend.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {

    @Autowired
    private RoomRepository roomRepository;

    //for sending and recieving messages

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequest messageRequest){
        Room room = roomRepository.findByRoomId(roomId);
        Message message = new Message();
        message.setContent(messageRequest.getContent());
        message.setSender(messageRequest.getSender());
        message.setTimeStamp(LocalDateTime.now());
        if (room != null){
            room.getMessages().add(message);
            roomRepository.save(room);
        }else {
            throw new RuntimeException("Room not found");
        }
        return message;
    }

}
