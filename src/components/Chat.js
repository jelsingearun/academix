import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientId, setRecipientId] = useState(""); 
  const [messageView, setMessageView] = useState("received"); 
  const [allUsers, setAllUsers] = useState([]); 
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users");
        setAllUsers(
          data.map((u) => ({
            id: u._id || u.id,
            displayName: u.displayName || u.name,
          }))
        );
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !recipientId) return;
    const fetchMessages = async () => {
      try {
        const selfId = currentUser.id || currentUser._id;
        const { data } = await axios.get(
          `http://localhost:5000/api/messages?a=${selfId}&b=${recipientId}`
        );
        setMessages(data.map((m) => ({ id: m._id, ...m })));
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [recipientId, currentUser]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !recipientId.trim() || !currentUser) return;

    try {
      const selfId = currentUser.id || currentUser._id;
      const messageData = {
        text: newMessage,
        senderId: selfId,
        recipientId,
        createdAt: new Date().toISOString()
      };
      
      await axios.post("http://localhost:5000/api/messages", messageData);
      
      // Clear input immediately
      setNewMessage("");
      
      // Add message to local state immediately for instant feedback
      const newMsg = {
        id: Date.now(), // temporary ID
        ...messageData,
        _id: Date.now()
      };
      setMessages(prev => [...prev, newMsg]);
      
      // Scroll to bottom
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
      // Refresh messages from server
      const { data } = await axios.get(
        `http://localhost:5000/api/messages?a=${selfId}&b=${recipientId}`
      );
      setMessages(data.map((m) => ({ id: m._id, ...m })));
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the temporary message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== Date.now()));
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col h-full">
  

      {!currentUser ? (
        <p className="text-center text-gray-400">Loading chat...</p>
      ) : (
        <>
          {/* Select Recipient */}
          <div className="mb-2">
            <label className="block text-xs text-gray-300 mb-1">
              Select a user to chat with:
            </label>
            <select
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full p-2 text-sm rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Choose a user...</option>
              {allUsers
                .filter(
                  (user) =>
                    user.id !== (currentUser.id || currentUser._id)
                )
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName || "Anonymous"} ({user.id})
                  </option>
                ))}
            </select>
          </div>

          {/* Toggle Sent/Received Messages */}
          <div className="flex justify-center mb-2">
            <div className="inline-flex rounded-full bg-gray-700 p-1 shadow-inner">
              <button
                onClick={() => setMessageView("received")}
                className={`px-4 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  messageView === "received"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-gray-600"
                }`}
              >
                Received
              </button>
              <button
                onClick={() => setMessageView("sent")}
                className={`px-4 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  messageView === "sent"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-gray-600"
                }`}
              >
                Sent
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="overflow-y-auto flex flex-col space-y-1 mb-2 p-2 bg-gray-900 rounded-lg flex-grow min-h-[100px] max-h-[400px] chat-scrollbar">
            {recipientId ? (
              (() => {
                const filteredMessages = messages.filter((msg) =>
                  messageView === "sent"
                    ? String(msg.senderId) === String(currentUser.id || currentUser._id) &&
                      String(msg.recipientId) === String(recipientId)
                    : String(msg.senderId) === String(recipientId) &&
                      String(msg.recipientId) === String(currentUser.id || currentUser._id)
                );
                
                return filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 text-sm max-w-[80%] rounded-lg ${
                        String(msg.senderId) === String(currentUser.id || currentUser._id)
                          ? "ml-auto bg-blue-500 text-white text-right"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm">No messages yet. Start the conversation!</p>
                  </div>
                );
              })()
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm">Select a user to start chatting</p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input Field */}
          <div className="border-t border-gray-600 pt-3 flex-shrink-0 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  recipientId
                    ? "Type your message here..."
                    : "Select a user first to start chatting"
                }
                disabled={!recipientId}
                className="flex-grow p-3 text-sm border-2 border-blue-500 rounded-lg bg-gray-700 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-600"
              />
              <button
                onClick={sendMessage}
                disabled={!recipientId || !newMessage.trim()}
                className="bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
              >
                Send
              </button>
            </div>
            {!recipientId && (
              <p className="text-xs text-gray-400 mt-2 text-center">
                Please select a user from the dropdown above to start chatting
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
