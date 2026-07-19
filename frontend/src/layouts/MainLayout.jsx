import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Trophy, Users, Shield, Award, LogIn } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Abstract Background Elements for Premium Feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="glass-panel mx-4 mt-6 px-8 py-4 flex items-center justify-between z-50 sticky top-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300">
            <Trophy className="text-background w-6 h-6" />
          </div>
          <span className="font-display font-bold text-2xl tracking-wider uppercase text-white">
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

        <Link to="/admin/login" className="btn-ghost flex items-center gap-2 text-sm">
          <LogIn className="w-4 h-4" /> Admin Login
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-grow z-10 p-4 md:p-8">
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
