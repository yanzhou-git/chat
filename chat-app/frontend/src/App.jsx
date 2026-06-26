import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// 建议将单例 socket 放在组件外或用 useMemo 保证唯一
const socket = io("http://127.0.0.1:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); 
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    // 监听历史消息
    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    // 监听新消息
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // 【重要优化】组件卸载或重载时，移除监听器，防止重复绑定和内存泄漏
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

    // 【重要优化】发送后自动清空输入框
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
          // 如果后端返回的 m.id 有时不存在，建议用 index 作为兜底，防止 React 报错
          <div key={m.id || index} style={{ marginBottom: 8 }}>
            <strong>{m.username}: </strong>
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()} // 顺手加个回车发送，体验更好
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} style={{ marginLeft: 5 }}>Send</button>
    </div>
  );
}

export default App;