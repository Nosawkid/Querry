import { useState, useEffect } from "react";
import api from "../api/axios";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get("/documents");
      setDocuments(data.documents);
    } catch (err) {
      console.error("Failed to fetch docs", err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError("");

    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // Helper to pick badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Ready
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            Failed
          </span>
        );
      default: // pending
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Processing
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Knowledge Base</h1>
        <p className="text-gray-500 mt-1">
          Manage documents for your AI context.
        </p>
      </header>

      {/* Upload Area */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Upload Document
        </h2>
        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>
        )}

        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>
          {uploading && (
            <span className="text-blue-600 font-medium animate-pulse">
              Processing...
            </span>
          )}
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">
          Your Documents ({documents.length})
        </div>

        {documents.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No documents found.
          </div>
        ) : (
          <ul>
            {documents.map((doc) => (
              <li
                key={doc._id}
                className="border-b last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{doc.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {/* STATUS BADGE */}
                        {getStatusBadge(doc.processing)}
                        <span className="text-xs text-gray-400">
                          {new Date(
                            doc.createdAt || doc.uploadedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* VIEW BUTTON (Only if file exists) */}
                    {doc.filePath && (
                      <a
                        href={`http://localhost:8080/uploads/${doc.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="View PDF"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                          <path
                            fillRule="evenodd"
                            d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    )}
                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.49 1.478l-.565 9.064a3 3 0 01-2.991 2.77H7.669a3 3 0 01-2.991-2.77L4.113 6.695a.75.75 0 01-.491-1.478 48.818 48.818 0 013.878-.512V4.478C7.5 2.91 8.79 1.625 10.375 1.625h3.25c1.585 0 2.875 1.285 2.875 2.853zM10.005 8.25a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0v-5.25a.75.75 0 01.75-.75zm4 0a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0v-5.25a.75.75 0 01.75-.75z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
