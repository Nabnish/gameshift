"use client";

import { useEffect, useState } from "react";

interface Team {
  _id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  members: Array<{ userId: string; username: string }>;
  createdAt: string;
  inviteCode: string;
}

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/teams");
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
        setError("");
      } else {
        setError("Failed to fetch teams");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      setError("Error fetching teams");
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTeams(teams.filter((t) => t._id !== teamId));
        setConfirmDelete(null);
        setError("");
      } else {
        setError("Failed to delete team");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      setError("Error deleting team");
    }
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.leaderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">Loading teams...</div>
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
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-white/60">Total Teams: {teams.length}</p>
        </div>
        <button
          onClick={fetchTeams}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="bg-white/5 border border-white/20 rounded-lg p-4">
        <input
          type="text"
          placeholder="Search by team name or leader..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeams.map((team) => (
          <div
            key={team._id}
            className="bg-white/5 border border-white/20 rounded-lg p-6 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{team.name}</h3>
                <p className="text-white/60 text-sm">
                  Leader: <span className="text-white">{team.leaderName}</span>
                </p>
              </div>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-semibold border border-purple-500/50">
                {team.members.length} members
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Invite Code:</span>
                <code className="bg-black/40 px-2 py-1 rounded text-yellow-400 font-mono">
                  {team.inviteCode}
                </code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Created:</span>
                <span className="text-white">
                  {new Date(team.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm Font-semibold mb-2 text-white/70">Members:</p>
              <div className="space-y-1">
                {team.members.slice(0, 5).map((member) => (
                  <div key={member.userId} className="text-sm text-white/80 ml-2">
                    • {member.username}
                  </div>
                ))}
                {team.members.length > 5 && (
                  <div className="text-sm text-white/60 ml-2">
                    + {team.members.length - 5} more
                  </div>
                )}
              </div>
            </div>

            {confirmDelete === team._id ? (
              <div className="flex gap-2">
                <button
                  onClick={() => deleteTeam(team._id)}
                  className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 border border-red-600 transition-colors"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-3 py-2 text-sm bg-white/10 text-white rounded hover:bg-white/20 border border-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(team._id)}
                className="w-full px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 border border-red-500/50 transition-colors"
              >
                Delete Team
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-8 text-white/60">
          No teams found matching your search.
        </div>
      )}
    </div>
  );
}
