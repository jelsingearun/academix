import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QueriesWritten = () => {
  // State to store queries and comments
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser')) } catch (_) { return null }
  })();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/queries');
        setQueries(data);
      } catch (e) {}
    };
    load();
  }, []);

  // Function to add or update a query
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newQuery.trim() === '' || !currentUser?.id) return;

    try {
      if (editingId) {
        const { data } = await axios.patch(`http://localhost:5000/api/queries/${editingId}`, { content: newQuery });
        setQueries(queries.map(q => q._id === editingId ? data : q));
        setEditingId(null);
      } else {
        const { data } = await axios.post('http://localhost:5000/api/queries', { authorId: currentUser.id, content: newQuery });
        setQueries([data, ...queries]);
      }
      setNewQuery('');
    } catch (_) {}
  };

  // Function to delete a query
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/queries/${id}`);
      setQueries(queries.filter(q => q._id !== id));
    } catch (_) {}
  };

  // Function to set query for editing
  const handleEdit = (q) => {
    setNewQuery(q.content);
    setEditingId(q._id);
  };

  // Function to add a comment to a query
  const handleAddComment = async (id) => {
    const value = (commentInputs[id] || '').trim();
    if (!value || !currentUser?.id) return;
    try {
      const { data } = await axios.post(`http://localhost:5000/api/queries/${id}/comments`, { authorId: currentUser.id, content: value });
      setQueries(queries.map(q => q._id === id ? data : q));
      setCommentInputs({ ...commentInputs, [id]: '' });
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-extrabold text-blue-700 text-center">Queries Hub</h2>
        <p className="text-center text-gray-500 mb-6">Submit, edit, and manage your queries.</p>

        {/* Form for submitting/updating queries */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <input
            type="text"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            placeholder="Write your query..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            type="submit"
            className={`w-full px-5 py-3 font-semibold rounded-xl transition shadow-md ${
              editingId !== null ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {editingId !== null ? 'Update Query' : 'Post Query'}
          </button>
        </form>

        {/* Display the list of queries */}
        <div className="mt-6 space-y-4">
          {queries.length > 0 ? (
            queries.map((query, index) => (
              <div
                key={index}
                className="p-4 bg-white border-l-4 border-blue-600 shadow-md rounded-lg"
              >
                {/* Query Section */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 flex-1">{query.content}</p>
                  <button
                    onClick={() => handleEdit(query)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(query._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    🗑 Delete
                  </button>
                </div>

                {/* Comments Section */}
                <div className="mt-4">
                  <h3 className="text-gray-700 font-semibold">💬 Answers:</h3>
                  <div className="space-y-2">
                    {query.comments?.length > 0 ? (
                      query.comments.map((c, ci) => (
                        <p key={ci} className="text-gray-600 bg-gray-100 p-2 rounded-md">
                          {c.content}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No answers yet. Be the first to reply!</p>
                    )}
                  </div>

                  {/* Comment Input */}
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write an answer..."
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={commentInputs[query._id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [query._id]: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(query._id) }}
                    />
                    <button
                      onClick={() => handleAddComment(query._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      ➕ Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-lg">
              No queries posted yet. Start the discussion!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueriesWritten;
