// src/Chat.js
import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const Chat = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [from, setFrom] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/chat");
    const client = Stomp.over(socket);

    client.onConnect = () => {
      client.subscribe("/topic/messages", (messageOutput) => {
        const message = JSON.parse(messageOutput.body);
        console.log("msg", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      const message = { from, text };
      stompClient.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(message),
      });
      setText("");
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Your name"
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.from}: {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
