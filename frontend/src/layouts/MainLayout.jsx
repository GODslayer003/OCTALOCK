import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Trophy, Users, Shield, Award, LogIn, Menu, X } from 'lucide-react';

const MainLayout = () => {
  const [navOpen, setNavOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: null },
    { to: '/solo-cup', label: 'Solo Cup', icon: Users },
    { to: '/club-cup', label: 'Clubs Cup', icon: Shield },
    { to: '/hall-of-champions', label: 'Hall of Champions', icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Abstract Background Elements for Premium Feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="glass-panel mx-3 md:mx-4 mt-3 md:mt-6 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between z-50 sticky top-3 md:top-6">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setNavOpen(false)}>
          <div className="w-9 h-9 md:w-10 md:h-10 bg-accent rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300">
            <Trophy className="text-background w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="font-display font-bold text-xl md:text-2xl tracking-wider uppercase text-white">
            Octa<span className="text-accent">Lock</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide text-white">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <Link to="/solo-cup" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Users className="w-4 h-4" /> Solo Cup
          </Link>
          <Link to="/club-cup" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Shield className="w-4 h-4" /> Clubs Cup
          </Link>
          <Link to="/hall-of-champions" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Award className="w-4 h-4" /> Hall of Champions
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/login" className="hidden sm:flex btn-ghost items-center gap-2 text-sm">
            <LogIn className="w-4 h-4" /> Admin
          </Link>
          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 text-white hover:text-accent transition-colors">
            {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav dropdown */}
      {navOpen && (
        <div className="md:hidden glass-panel mx-3 mt-2 px-4 py-4 z-50 flex flex-col gap-2">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.to} to={link.to} onClick={() => setNavOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium hover:bg-surface/50 transition-colors"
              >
                {Icon && <Icon className="w-5 h-5 text-accent" />}
                {link.label}
              </Link>
            );
          })}
          <Link to="/admin/login" onClick={() => setNavOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-accent font-medium border border-accent/20 mt-2 hover:bg-accent/10 transition-colors"
          >
            <LogIn className="w-5 h-5" /> Admin Login
          </Link>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow z-10 p-3 md:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-borderGray py-8 mt-auto z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-textMuted">
          <p>© {new Date().getFullYear()} OCTA LOCK CUP. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
