import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
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