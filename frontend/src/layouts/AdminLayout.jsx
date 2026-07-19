import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, Swords, Calendar, Trophy, 
  Award, ArrowRightLeft, ImageIcon, LineChart, Settings, 
  FileText, Database, LogOut, ChevronRight
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Players', path: '/admin/players', icon: Users },
    { name: 'Clubs', path: '/admin/clubs', icon: Shield },
    { name: 'Matches', path: '/admin/matches', icon: Swords },
    { name: 'Seasons', path: '/admin/seasons', icon: Calendar },
    { name: 'Rankings', path: '/admin/rankings', icon: Trophy },
    { name: 'Hall of Champions', path: '/admin/champions', icon: Award },
    { name: 'Transfers', path: '/admin/transfers', icon: ArrowRightLeft },
    { name: 'Media', path: '/admin/media', icon: ImageIcon },
    { name: 'Analytics', path: '/admin/analytics', icon: LineChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Logs', path: '/admin/logs', icon: FileText },
    { name: 'Backup', path: '/admin/backup', icon: Database },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-white font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-borderGray flex flex-col h-full flex-shrink-0 relative z-20">
        <div className="p-6 border-b border-borderGray/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <Trophy className="w-5 h-5 text-background" />
            </div>
            <span className="font-display font-bold text-lg uppercase tracking-widest text-white">
              OCTA<span className="text-accent">ADMIN</span>
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <div className="text-xs font-bold text-textMuted uppercase tracking-wider mb-4 px-3">Management</div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-accent/10 text-accent font-semibold border border-accent/20' 
                    : 'text-textMuted hover:bg-surfaceHover hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-textMuted group-hover:text-white'}`} />
                  <span className="text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-borderGray/50">
          <Link to="/admin/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors w-full text-sm font-medium">
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative bg-[#0a0a0a]">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-borderGray/50 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-white capitalize">
              {location.pathname.split('/').pop() || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs px-3 py-1 bg-green-500/20 text-green-500 border border-green-500/30 rounded-full font-bold tracking-widest uppercase">
              SUPER_ADMIN
            </div>
            <div className="w-10 h-10 rounded-full bg-surface border border-borderGray overflow-hidden flex items-center justify-center">
              <span className="text-accent font-bold font-display text-sm">OA</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
