import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const ChatPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) {
      const fetchChat = async () => {
        try {
          const { data } = await api.get(`/chats/${id}`);
          const history = data.chat.history.flatMap((h) => [
            { type: "user", text: h.question },
            { type: "ai", text: h.answer, citations: h.citations },
          ]);
          setMessages(history);
        } catch (err) {
          console.error("Failed to load chat", err);
        }
      };
      fetchChat();
    } else {
      setMessages([]);
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const question = input;
    setInput("");

    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setIsLoading(true);

    try {
      let currentChatId = id;
      let isNewChat = false;

      if (!currentChatId) {
        const { data } = await api.post("/chats");
        currentChatId = data.chat._id;
        isNewChat = true;
      }

      const { data } = await api.post(`/chats/${currentChatId}/message`, {
        question,
      });

      const aiResponse = {
        type: "ai",
        text: data.message.answer,
        citations: data.message.citations,
      };
      setMessages((prev) => [...prev, aiResponse]);

      if (isNewChat) {
        navigate(`/chat/${currentChatId}`, { replace: true });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="p-4 border-b flex justify-between items-center bg-white shadow-sm z-10">
        <h2 className="text-xl font-semibold text-gray-800">
          {id ? "Conversation" : `Welcome, ${user?.username}`}
        </h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          Online
        </span>
      </header>

      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          // EMPTY STATE (Only show if no messages)
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-lg">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                How can I help you today?
              </h3>
              <p className="text-gray-500 mb-6">
                I can analyze your documents and answer questions.
              </p>
            </div>
          </div>
        ) : (
          // MESSAGE LIST
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Render Citations if AI has them */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs">
                      <p className="font-semibold text-gray-500 mb-1">
                        Sources:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cite, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200"
                            title={cite.snippet}
                          >
                            📄 {cite.docTitle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-4 rounded-lg rounded-bl-none shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            className="w-full p-4 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Ask a question about your documents..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-3 p-2 text-blue-600 hover:bg-blue-50 rounded disabled:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
