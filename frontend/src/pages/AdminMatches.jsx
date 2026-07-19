import React, { useState, useEffect, useCallback } from 'react';
import { Swords, Save, Search, Trash2, Download, X, Calendar } from 'lucide-react';
import { api } from '../api';

const clubs = ['T1', 'Gen.G', 'JD Gaming', 'BLG', 'G2 Esports', 'DK'];
const playersByClub = {
  'T1': ['Faker', 'Zeus', 'Oner', 'Gumayusi', 'Keria'],
  'Gen.G': ['Chovy', 'Doran', 'Peanut', 'Peyz', 'Lehends'],
  'JD Gaming': ['Knight', 'Ruler', '369', 'Kanavi', 'Missing'],
  'BLG': ['Bin', 'Elk', 'ON', 'Wei', 'Crisp'],
  'G2 Esports': ['Caps', 'BrokenBlade', 'Yike', 'Hans Sama', 'Mikyx'],
  'DK': ['ShowMaker', 'Kingen', 'Canyon', 'Aiming', 'Kellin'],
};
const seasons = ['Season 4', 'Season 3', 'Season 2', 'Season 1'];

const initialMatches = [
  { id: 1, season: 'Season 4', clubA: 'T1', clubB: 'Gen.G', playerA: 'Faker', playerB: 'Chovy', winner: 'Faker', goalsA: 3, goalsB: 1, mvp: 'Faker', date: '2026-07-18', notes: 'Grand Final' },
  { id: 2, season: 'Season 4', clubA: 'JD Gaming', clubB: 'BLG', playerA: 'Knight', playerB: 'Bin', winner: 'Knight', goalsA: 2, goalsB: 0, mvp: 'Knight', date: '2026-07-17', notes: '' },
];

const AdminMatches = () => {
  const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem('octalock_matches')) || initialMatches);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    season: 'Season 4', clubA: '', clubB: '', playerA: '', playerB: '',
    winner: '', goalsA: 0, goalsB: 0, mvp: '', date: '', notes: ''
  });

  useEffect(() => {
    api.matches.list().then(data => {
      if (data && data.length) setMatches(data);
    }).catch(() => {});
  }, []);

  useEffect(() => { localStorage.setItem('octalock_matches', JSON.stringify(matches)) }, [matches]);

  const sync = useCallback((action) => { action().catch(() => {}) }, []);

  const playersA = form.clubA ? (playersByClub[form.clubA] || []) : [];
  const playersB = form.clubB ? (playersByClub[form.clubB] || []) : [];

  const handleSave = () => {
    const newMatch = { ...form, id: Date.now(), goalsA: Number(form.goalsA), goalsB: Number(form.goalsB) };
    setMatches(prev => [newMatch, ...prev]);
    sync(() => api.matches.create(newMatch));
    setShowForm(false);
    setForm({ season: 'Season 4', clubA: '', clubB: '', playerA: '', playerB: '', winner: '', goalsA: 0, goalsB: 0, mvp: '', date: '', notes: '' });
  };

  const deleteMatch = (id) => {
    setMatches(prev => prev.filter(m => (m._id || m.id) !== id));
    sync(() => api.matches.delete(id));
  };

  const filtered = matches.filter(m =>
    (m.playerA || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.playerB || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.clubA || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.clubB || '').toLowerCase().includes(search.toLowerCase())
  );

  const selectClass = "w-full bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white appearance-none";
  const inputClass = "w-full bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white";

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Match Management</h1>
          <p className="text-textMuted mt-1">Record and manage all match results</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input type="text" placeholder="Search matches..." value={search} onChange={e => setSearch(e.target.value)} className="bg-surface border border-borderGray rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-accent w-64 text-white" />
          </div>
          <button className="btn-ghost flex items-center gap-2 text-sm"><Download className="w-4 h-4" /> Export</button>
          <button onClick={() => setShowForm(true)} className="btn-accent flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Record Match</button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-2 bg-surface rounded-full text-white"><X className="w-5 h-5" /></button>
            <div className="p-8">
              <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2 text-white"><Swords className="w-6 h-6 text-accent" /> Record New Match</h2>
              <p className="text-textMuted text-sm mb-8">Stats will update automatically after saving.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Season</label>
                    <select value={form.season} onChange={e => setForm(p => ({...p, season: e.target.value}))} className={selectClass + " mt-2"}>
                      {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} className={inputClass + " mt-2"} />
                  </div>
                </div>

                <div className="glass-card p-5 space-y-4">
                  <div className="text-xs font-bold text-accent uppercase tracking-widest">Team A</div>
                  <div><label className="text-xs text-textMuted">Club</label>
                    <select value={form.clubA} onChange={e => setForm(p => ({...p, clubA: e.target.value, playerA: ''}))} className={selectClass + " mt-1"}>
                      <option value="">Select Club</option>
                      {clubs.filter(c => c !== form.clubB).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-textMuted">Player</label>
                    <select value={form.playerA} onChange={e => setForm(p => ({...p, playerA: e.target.value}))} className={selectClass + " mt-1"} disabled={!form.clubA}>
                      <option value="">Select Player</option>
                      {playersA.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-textMuted">Goals</label>
                    <input type="number" min="0" value={form.goalsA} onChange={e => setForm(p => ({...p, goalsA: e.target.value}))} className={inputClass + " mt-1"} />
                  </div>
                </div>

                <div className="glass-card p-5 space-y-4">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-widest">Team B</div>
                  <div><label className="text-xs text-textMuted">Club</label>
                    <select value={form.clubB} onChange={e => setForm(p => ({...p, clubB: e.target.value, playerB: ''}))} className={selectClass + " mt-1"}>
                      <option value="">Select Club</option>
                      {clubs.filter(c => c !== form.clubA).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-textMuted">Player</label>
                    <select value={form.playerB} onChange={e => setForm(p => ({...p, playerB: e.target.value}))} className={selectClass + " mt-1"} disabled={!form.clubB}>
                      <option value="">Select Player</option>
                      {playersB.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-textMuted">Goals</label>
                    <input type="number" min="0" value={form.goalsB} onChange={e => setForm(p => ({...p, goalsB: e.target.value}))} className={inputClass + " mt-1"} />
                  </div>
                </div>

                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Winner</label>
                  <select value={form.winner} onChange={e => setForm(p => ({...p, winner: e.target.value}))} className={selectClass + " mt-2"}>
                    <option value="">Select Winner</option>
                    {form.playerA && <option value={form.playerA}>{form.playerA} (Team A)</option>}
                    {form.playerB && <option value={form.playerB}>{form.playerB} (Team B)</option>}
                    <option value="draw">Draw</option>
                  </select>
                </div>
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">MVP</label>
                  <select value={form.mvp} onChange={e => setForm(p => ({...p, mvp: e.target.value}))} className={selectClass + " mt-2"}>
                    <option value="">Select MVP</option>
                    {form.playerA && <option value={form.playerA}>{form.playerA}</option>}
                    {form.playerB && <option value={form.playerB}>{form.playerB}</option>}
                  </select>
                </div>
                <div className="md:col-span-2"><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Notes</label>
                  <input type="text" value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} placeholder="Optional notes..." className={inputClass + " mt-2"} />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 border-t border-borderGray/50 pt-6">
                <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                <button onClick={handleSave} className="btn-accent flex items-center gap-2"><Save className="w-4 h-4" /> Save Match</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-surface/50 border-b border-borderGray text-xs uppercase tracking-wider text-textMuted">
              <th className="p-4">Date</th><th className="p-4">Season</th><th className="p-4">Match</th>
              <th className="p-4 text-center">Score</th><th className="p-4">Winner</th><th className="p-4">MVP</th><th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" className="p-8 text-center text-textMuted">No matches found.</td></tr>
            ) : filtered.map(m => (
              <tr key={m._id || m.id} className="border-b border-borderGray/30 hover:bg-surface/30 transition-colors">
                <td className="p-4 text-textMuted text-sm flex items-center gap-2"><Calendar className="w-4 h-4" />{m.date}</td>
                <td className="p-4 text-sm text-white">{m.season}</td>
                <td className="p-4 font-semibold text-white">{m.playerA} <span className="text-textMuted mx-2">vs</span> {m.playerB}</td>
                <td className="p-4 text-center font-display font-bold text-white">{m.goalsA} - {m.goalsB}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${m.winner === 'draw' ? 'bg-gray-500/20 text-gray-400' : 'bg-green-500/20 text-green-400'}`}>{m.winner === 'draw' ? 'DRAW' : m.winner}</span></td>
                <td className="p-4 text-accent font-semibold text-sm">{m.mvp || '—'}</td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteMatch(m._id || m.id)} className="p-2 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Plus = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;

export default AdminMatches;
