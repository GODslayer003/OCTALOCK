import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Users, Shield, Calendar, Swords, Trophy, Activity, Server, Database, ImageIcon } from 'lucide-react';

const stats = [
  { label: 'Total Players', value: 1248, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Total Clubs', value: 84, icon: Shield, color: 'text-green-400', bg: 'bg-green-400/10' },
  { label: 'Matches Played', value: 342, icon: Swords, color: 'text-red-400', bg: 'bg-red-400/10' },
  { label: 'Total Seasons', value: 4, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

const AdminDashboard = () => {
  const counterRefs = useRef([]);

  useEffect(() => {
    // Animate counters
    counterRefs.current.forEach((el, index) => {
      if (!el) return;
      const target = stats[index].value;
      gsap.to(el, {
        innerHTML: target,
        duration: 2,
        ease: 'power3.out',
        snap: { innerHTML: 1 },
        onUpdate: function () {
          el.innerHTML = Math.round(el.innerHTML).toLocaleString();
        }
      });
    });

    // Animate cards staggering
    gsap.from('.stat-card', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, []);

  return (
    <div className="animate-in fade-in duration-500">

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card glass-panel p-6 border-l-4 border-l-borderGray hover:border-l-accent transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">{stat.label}</div>
                  <div
                    ref={el => counterRefs.current[idx] = el}
                    className="text-4xl font-display font-black text-white"
                  >
                    0
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">

          <div className="glass-panel p-6 stat-card">
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-white">
              <Swords className="w-5 h-5 text-accent" /> Recent Activity
            </h3>

            <div className="space-y-4">
              {[
                { action: 'Match Recorded', detail: 'T1 vs GEN (3-1)', time: '10 mins ago', type: 'match' },
                { action: 'Player Transferred', detail: 'Faker transferred to T1', time: '1 hour ago', type: 'transfer' },
                { action: 'New Registration', detail: 'Player "Zeus" created', time: '3 hours ago', type: 'player' },
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface/30 rounded-lg border border-borderGray/30 hover:bg-surfaceHover transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div>
                      <div className="font-semibold text-white">{act.action}</div>
                      <div className="text-sm text-white/60">{act.detail}</div>
                    </div>
                  </div>
                  <div className="text-xs text-white/60 font-medium">{act.time}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - System Health */}
        <div className="space-y-8">
          <div className="glass-panel p-6 stat-card">
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-accent" /> System Health
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70 flex items-center gap-2"><Server className="w-4 h-4" /> Server Status</span>
                  <span className="text-green-400 font-bold">ONLINE</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70 flex items-center gap-2"><Database className="w-4 h-4" /> Database Health</span>
                  <span className="text-green-400 font-bold">OPTIMAL</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Cloudinary Storage</span>
                  <span className="text-amber-400 font-bold">45%</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[45%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 stat-card bg-accent/5 border-accent/20">
            <h3 className="text-xl font-display font-bold mb-2 flex items-center gap-2 text-accent">
              <Trophy className="w-5 h-5" /> Current Season
            </h3>
            <p className="text-sm text-white/70 mb-4">Season 7 is currently active.</p>
            <button className="w-full py-2 bg-accent/20 text-accent font-bold rounded border border-accent/30 hover:bg-accent hover:text-background transition-colors">
              Manage Season
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
