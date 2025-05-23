import { useState } from "react";
import './chat.css'
import Header from '../Header/Header';
import Footer from "../../Footer/Footer.jsx"

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setLoading(false);
  };

  return (
    <>
    <Header/>
    <div className="max-w-md mx-auto p-4 shadow-md chatbotcontainer">
        <h1 id='chathead'>CHATBOT</h1>
      <div className="h-80 overflow-y-auto border-b p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-lg ${msg.role === "user" ? "bg-blue-200 text-right" : "bg-gray-200"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-500">Chatbot is typing...</div>}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow p-2 border rounded-l-lg focus:outline-none"
          placeholder="Ask something..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
}
