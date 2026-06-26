import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

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
    if (!message.trim()) return; 
    socket.emit("send-message", message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1>💬 MigraCode Live Chat</h1>

      <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc", padding: 10, marginBottom: 10, borderRadius: 5 }}>
        {messages.map((m, index) => (
          
          <div key={m.id || index} style={{ marginBottom: 8, padding: "4px 8px", background: "#f3f4f6", borderRadius: 4 }}>
            {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          style={{ flex: 1, padding: 8 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} 
          placeholder="Type a message..."
        />
        <button style={{ padding: "8px 16px" }} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;