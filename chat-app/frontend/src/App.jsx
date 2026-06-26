import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); 
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat-history");
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    socket.emit("send-message", {
      username,
      text: trimmedMessage,
    });

    setMessage(""); 
  };

  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Join Chat</h1>
        <input
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={() => {
            if (username.trim()) {
              setJoined(true);
            }
          }}
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat App (User: {username})</h1>

      <div style={{ height: 300, overflowY: "auto", border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
        {messages.map((m, index) => (
          <div key={m.id || index} style={{ marginBottom: 8 }}>
            <strong>{m.username}: </strong>
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} style={{ marginLeft: 5 }}>Send</button>
    </div>
  );
}

export default App;