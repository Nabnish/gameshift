"use client";

interface AdminStatsProps {
  stats: {
    users: number;
    teams: number;
    games: number;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: "👥",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Teams",
      value: stats.teams,
      icon: "🏆",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Active Games",
      value: stats.games,
      icon: "🎮",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.color} p-6 rounded-lg border border-white/20 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{card.label}</p>
                <p className="text-4xl font-bold mt-2">{card.value}</p>
              </div>
              <div className="text-5xl opacity-80">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/20 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Platform Status</span>
              <span className="text-green-400 font-semibold">✓ Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Database Connection</span>
              <span className="text-green-400 font-semibold">✓ Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">API Status</span>
              <span className="text-green-400 font-semibold">✓ Active</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Last Updated</span>
              <span className="font-semibold">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Server Version</span>
              <span className="font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Admin Access</span>
              <span className="text-yellow-400 font-semibold">✓ Granted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
