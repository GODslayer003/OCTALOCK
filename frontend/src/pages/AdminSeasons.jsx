import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Archive, Trash2, Trophy, Lock, Unlock, X } from 'lucide-react';

const initialSeasons = [
  { id: 4, name: 'Season 4', year: '2026', status: 'ACTIVE', matches: 45, soloChamp: null, clubChamp: null },
  { id: 3, name: 'Season 3', year: '2025', status: 'LOCKED', matches: 120, soloChamp: 'Knight', clubChamp: 'JD Gaming' },
  { id: 2, name: 'Season 2', year: '2024', status: 'LOCKED', matches: 98, soloChamp: 'Faker', clubChamp: 'T1' },
  { id: 1, name: 'Season 1', year: '2024', status: 'LOCKED', matches: 80, soloChamp: 'Chovy', clubChamp: 'Gen.G' },
];

const AdminSeasons = () => {
  const [seasons, setSeasons] = useState(() => JSON.parse(localStorage.getItem('octalock_seasons')) || initialSeasons);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', year: '' });

  useEffect(() => { localStorage.setItem('octalock_seasons', JSON.stringify(seasons)) }, [seasons]);

  const handleCreate = () => {
    setSeasons(prev => [{ id: Date.now(), name: form.name, year: form.year, status: 'ACTIVE', matches: 0, soloChamp: null, clubChamp: null }, ...prev]);
    setShowModal(false);
    setForm({ name: '', year: '' });
  };

  const toggleLock = (id) => {
    setSeasons(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE' } : s));
  };

  const deleteSeason = (id) => setSeasons(prev => prev.filter(s => s.id !== id));

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Season Management</h1>
          <p className="text-textMuted mt-1">Create, archive, and manage tournament seasons</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-accent flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> New Season</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seasons.map(season => (
          <div key={season.id} className={`glass-panel p-6 ${season.status === 'ACTIVE' ? 'border-accent/30' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${season.status === 'ACTIVE' ? 'bg-accent/20' : 'bg-surface'}`}>
                  <Calendar className={`w-5 h-5 ${season.status === 'ACTIVE' ? 'text-accent' : 'text-textMuted'}`} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">{season.name}</h3>
                  <p className="text-xs text-textMuted">{season.year}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${season.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                {season.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-surface/30 p-3 rounded-lg text-center">
                <div className="text-textMuted text-xs mb-1">Matches</div>
                  <div className="font-bold text-lg text-white">{season.matches}</div>
              </div>
              <div className="bg-surface/30 p-3 rounded-lg text-center">
                <div className="text-textMuted text-xs mb-1">Solo Champ</div>
                <div className="font-bold text-sm text-white">{season.soloChamp || '—'}</div>
              </div>
              <div className="bg-surface/30 p-3 rounded-lg text-center">
                <div className="text-textMuted text-xs mb-1">Club Champ</div>
                <div className="font-bold text-sm text-white">{season.clubChamp || '—'}</div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-borderGray/30 pt-4">
              <button onClick={() => toggleLock(season.id)} className="flex-1 btn-ghost text-sm flex items-center justify-center gap-2">
                {season.status === 'ACTIVE' ? <><Lock className="w-4 h-4" /> Archive</> : <><Unlock className="w-4 h-4" /> Reopen</>}
              </button>
              <button onClick={() => deleteSeason(season.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md relative p-8">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-surface rounded-full text-white"><X className="w-5 h-5" /></button>
            <h2 className="text-2xl font-display font-bold mb-6 text-white">Create New Season</h2>
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Season Name</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Season 5" className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white" />
              </div>
              <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Year</label>
                <input type="text" value={form.year} onChange={e => setForm(p => ({...p, year: e.target.value}))} placeholder="2026" className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white" />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleCreate} className="btn-accent">Create Season</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeasons;
