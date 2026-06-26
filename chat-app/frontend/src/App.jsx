import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(window.location.hostname === "localhost" 
  ? "http://localhost:3001" 
  : window.location.origin.replace("5173", "3001").replace("5174", "3001")
);

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
  const handleHistory = (history) => {
    setMessages(history);
  };

  const handleReceive = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  socket.on("chat-history", handleHistory);
  socket.on("receive-message", handleReceive);

  return () => {
    socket.off("chat-history", handleHistory);
    socket.off("receive-message", handleReceive);
  };
}, []);

  const sendMessage = () => {
    if (!message) return;
    socket.emit("send-message", message);
    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat App</h1>

      <div style={{ height: 300, overflow: "auto", border: "1px solid #ccc" }}>
        {messages.map((m) => (
          <div key={m.id}>{m.text}</div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;