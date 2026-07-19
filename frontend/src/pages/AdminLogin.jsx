import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Hardcoded credentials for now as per requirements
    if (email !== 'octalock@octa.com' || password !== 'OctaLock0032527!') {
      setError('Invalid admin credentials.');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="glass-panel w-full max-w-md p-8 relative z-10 border-t border-t-accent/30 shadow-[0_10px_40px_rgba(245,185,66,0.1)]">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-borderGray rounded-2xl mb-4 transform rotate-3">
            <Lock className="w-8 h-8 text-accent transform -rotate-3" />
          </div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-wide text-white">
            Admin <span className="text-accent">Access</span>
          </h1>
          <p className="text-textMuted mt-2 text-sm">Secure authorization required.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="octalock@octa.com"
                required
                className="w-full bg-background/50 border border-borderGray rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-background/50 border border-borderGray rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-white"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-accent py-4 mt-4 flex items-center justify-center gap-2 font-bold text-lg group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                Authorize <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-textMuted border-t border-borderGray/50 pt-6">
          <p>Protected by OCTA Security Protocols</p>
          <p className="mt-1">Unauthorized access is strictly prohibited.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
