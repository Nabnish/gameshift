"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setError("");
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        setConfirmDelete(null);
        setError("");
      } else {
        setError("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user");
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      });
      if (response.ok) {
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, isAdmin: !currentStatus } : u
          )
        );
        setError("");
      } else {
        setError("Failed to update admin status");
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
      setError("Error updating admin status");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-white/60">Total Users: {users.length}</p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="bg-white/5 border border-white/20 rounded-lg p-4">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
        />
      </div>

      <div className="overflow-x-auto bg-white/5 border border-white/20 rounded-lg">
        <table className="w-full">
          <thead className="border-b border-white/20 bg-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Username</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b border-white/10 hover:bg-white/5">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-verse-light/40 rounded-full flex items-center justify-center text-sm">
                      {user.username[0].toUpperCase()}
                    </div>
                    {user.username}
                  </div>
                </td>
                <td className="px-6 py-3 text-white/80">{user.email}</td>
                <td className="px-6 py-3">
                  {user.isAdmin ? (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold border border-yellow-500/50">
                      ⭐ Admin
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-semibold">
                      User
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-white/60 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAdminStatus(user._id, user.isAdmin || false)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        user.isAdmin
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50"
                          : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50"
                      }`}
                    >
                      {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                    </button>
                    {confirmDelete === user._id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 border border-red-600"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-3 py-1 text-xs bg-white/10 text-white rounded hover:bg-white/20 border border-white/20"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(user._id)}
                        className="px-3 py-1 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-white/60">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
