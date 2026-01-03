import { useEffect, useState } from "react"; // Add hooks
import {
  Outlet,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios"; // Import API

const AppLayout = () => {
  const { logout, user } = useAuth();
  const [chats, setChats] = useState([]);
  const { id } = useParams(); // To highlight active chat
  const location = useLocation(); // To trigger refresh on nav

  // Fetch Chats when the component loads (or URL changes)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get("/chats");
        setChats(data.chats);
      } catch (err) {
        console.error("Failed to load sidebar", err);
      }
    };

    if (user) fetchChats();
  }, [user, location.pathname]); // Refresh list when path changes (e.g. new chat created)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">
            Querry.
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Main Actions */}
          <Link
            to="/chat"
            className="flex items-center p-3 hover:bg-gray-800 rounded-lg transition-colors border border-gray-700 mb-4"
          >
            <span className="text-lg mr-3">+</span> New Chat
          </Link>
          <Link
            to="/documents"
            className="flex items-center p-3 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="text-lg mr-3">📂</span> Knowledge Base
          </Link>

          {/* History Section */}
          <div className="pt-4 mt-4 border-t border-gray-800">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Recent Chats
            </h3>
            <div className="space-y-1">
              {chats.map((chat) => (
                <Link
                  key={chat._id}
                  to={`/chat/${chat._id}`}
                  className={`block p-2 text-sm rounded transition-colors truncate ${
                    location.pathname.includes(chat._id)
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {chat.title || "Untitled Conversation"}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <div className="text-sm text-gray-400 mb-2 truncate">
            Logged in as {user?.username}
          </div>
          <button
            onClick={logout}
            className="w-full text-left text-red-400 hover:text-red-300 text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto relative w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
