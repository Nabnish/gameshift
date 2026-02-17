"use client";

import { useEffect, useState } from "react";

interface Game {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  path: string;
  usersPlaying: number;
}

const AVAILABLE_GAMES = [
  {
    id: "battleship",
    name: "Battleship",
    description: "Classic naval combat strategy game",
    path: "/battleship",
  },
  {
    id: "wordle",
    name: "Wordle",
    description: "Guess the word in 6 attempts",
    path: "/wordle",
  },
];

export default function GameManagement() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/games");
      if (response.ok) {
        const data = await response.json();
        setGames(data);
        setError("");
      } else {
        // Initialize with default games if API fails
        setGames(
          AVAILABLE_GAMES.map((game) => ({
            ...game,
            isActive: true,
            usersPlaying: 0,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      // Fallback to default games
      setGames(
        AVAILABLE_GAMES.map((game) => ({
          ...game,
          isActive: true,
          usersPlaying: 0,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleGameStatus = async (gameId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (response.ok) {
        setGames(
          games.map((g) =>
            g.id === gameId ? { ...g, isActive: !currentStatus } : g
          )
        );
        setError("");
      } else {
        setError("Failed to update game status");
      }
    } catch (error) {
      console.error("Error updating game status:", error);
      setError("Error updating game status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">Loading games...</div>
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
          <h2 className="text-2xl font-bold">Game Management</h2>
          <p className="text-white/60">
            Total Games: {games.length} | Active: {games.filter((g) => g.isActive).length}
          </p>
        </div>
        <button
          onClick={fetchGames}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`border rounded-lg p-6 transition-all ${
              game.isActive
                ? "bg-white/5 border-white/20"
                : "bg-red-500/5 border-red-500/30"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{game.name}</h3>
                <p className="text-white/60 text-sm">{game.description}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  game.isActive
                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                    : "bg-red-500/20 text-red-400 border-red-500/50"
                }`}
              >
                {game.isActive ? "✓ Active" : "✗ Inactive"}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Game Path:</span>
                <code className="bg-black/40 px-2 py-1 rounded text-yellow-400 font-mono">
                  {game.path}
                </code>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Players Active:</span>
                <span className="text-white font-semibold">{game.usersPlaying}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Status:</span>
                <span className="text-white">
                  {game.isActive ? "Available" : "Under Maintenance"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleGameStatus(game.id, game.isActive)}
                className={`flex-1 px-4 py-2 rounded border transition-colors text-sm font-semibold ${
                  game.isActive
                    ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/50"
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50"
                }`}
              >
                {game.isActive ? "Take Offline" : "Go Online"}
              </button>
              <a
                href={game.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/50 rounded transition-colors text-sm font-semibold text-center"
              >
                Test Game
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3 text-blue-300">ℹ️ Game Management Info</h3>
        <ul className="space-y-2 text-sm text-white/80">
          <li>• <strong>Active:</strong> Users can access and play the game</li>
          <li>• <strong>Inactive:</strong> Game is under maintenance or disabled</li>
          <li>• <strong>Players Active:</strong> Current number of users playing the game</li>
          <li>• <strong>Test Game:</strong> Opens the game in a new window to test functionality</li>
        </ul>
      </div>
    </div>
  );
}
