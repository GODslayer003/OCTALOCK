import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Edit, Download, X, Users, Camera } from 'lucide-react';

const STORAGE_KEY_CLUBS = 'octalock_clubs';

const loadClubs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CLUBS);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch { return null }
};

const initialClubs = [
  { id: 1, name: 'T1', captain: 'Faker', members: 8, wins: 150, draws: 20, losses: 30, goalsFor: 320, goalsAgainst: 120, logo: 'https://ui-avatars.com/api/?name=T1&background=random' },
  { id: 2, name: 'Gen.G', captain: 'Chovy', members: 7, wins: 140, draws: 30, losses: 30, goalsFor: 290, goalsAgainst: 110, logo: 'https://ui-avatars.com/api/?name=GenG&background=random' },
  { id: 3, name: 'JD Gaming', captain: 'Knight', members: 9, wins: 135, draws: 25, losses: 40, goalsFor: 270, goalsAgainst: 120, logo: 'https://ui-avatars.com/api/?name=JDG&background=random' },
  { id: 4, name: 'BLG', captain: 'Bin', members: 7, wins: 130, draws: 20, losses: 50, goalsFor: 250, goalsAgainst: 130, logo: 'https://ui-avatars.com/api/?name=BLG&background=random' },
  { id: 5, name: 'G2 Esports', captain: 'Caps', members: 6, wins: 120, draws: 30, losses: 50, goalsFor: 230, goalsAgainst: 140, logo: 'https://ui-avatars.com/api/?name=G2&background=random' },
];

const AdminClubs = () => {
  const [clubs, setClubs] = useState(() => loadClubs() ?? initialClubs);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [form, setForm] = useState({ name: '', captain: '', members: 0, logo: '', matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 });
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, logo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const m = Number(form.matches);
    const w = Number(form.wins);
    const d = Number(form.draws);
    if (m && w + d <= m) setForm(prev => ({ ...prev, losses: m - w - d }));
  }, [form.matches, form.wins, form.draws]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY_CLUBS, JSON.stringify(clubs)) }, [clubs]);

  const filtered = useMemo(() => clubs.filter(c => c.name.toLowerCase().includes(search.toLowerCase())), [search, clubs]);

  const openCreate = () => { setEditingClub(null); setForm({ name: '', captain: '', members: 0, logo: '', matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }); setShowModal(true); };
  const openEdit = (club) => {
    setEditingClub(club);
    setForm({
      name: club.name || '', captain: club.captain || '', members: club.members ?? 0, logo: club.logo || '',
      matches: club.matches ?? 0, wins: club.wins ?? 0, draws: club.draws ?? 0, losses: club.losses ?? 0,
      goalsFor: club.goalsFor ?? 0, goalsAgainst: club.goalsAgainst ?? 0
    });
    setShowModal(true);
  };
  const handleSave = () => {
    const payload = {
      ...form,
      members: Number(form.members),
      matches: Number(form.matches),
      wins: Number(form.wins),
      draws: Number(form.draws),
      losses: Number(form.losses),
      goalsFor: Number(form.goalsFor),
      goalsAgainst: Number(form.goalsAgainst),
    };
    if (editingClub) setClubs(prev => prev.map(c => c.id === editingClub.id ? { ...c, ...payload } : c));
    else setClubs(prev => [...prev, { id: Date.now(), ...payload, logo: payload.logo || `https://ui-avatars.com/api/?name=${form.name}&background=random` }]);
    setShowModal(false);
  };
  const deleteClub = (id) => setClubs(prev => prev.filter(c => c.id !== id));

  const pts = (c) => (c.wins || 0) * 3 + (c.draws || 0);

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Clubs Management</h1>
          <p className="text-textMuted mt-1">{clubs.length} clubs registered</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input type="text" placeholder="Search clubs..." value={search} onChange={e => setSearch(e.target.value)} className="bg-surface border border-borderGray rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-accent w-64 text-white" />
          </div>
          <button className="btn-ghost flex items-center gap-2 text-sm"><Download className="w-4 h-4" /> Export</button>
          <button onClick={openCreate} className="btn-accent flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Create Club</button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-surface/50 border-b border-borderGray text-xs uppercase tracking-wider text-textMuted">
              <th className="p-4">Club</th><th className="p-4">Captain</th><th className="p-4 text-center">Members</th>
              <th className="p-4 text-center">W</th><th className="p-4 text-center">D</th><th className="p-4 text-center">L</th>
              <th className="p-4 text-center text-accent">Points</th><th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(club => (
              <tr key={club.id} className="border-b border-borderGray/30 hover:bg-surface/30 transition-colors">
                <td className="p-4"><div className="flex items-center gap-3"><img src={club.logo} className="w-10 h-10 rounded-lg border border-borderGray" alt="" /><span className="font-bold text-white">{club.name}</span></div></td>
                <td className="p-4 text-white">{club.captain}</td>
                <td className="p-4 text-center text-white"><Users className="w-4 h-4 inline mr-1 text-textMuted" />{club.members}</td>
                <td className="p-4 text-center text-green-400 font-semibold">{club.wins ?? 0}</td>
                <td className="p-4 text-center text-gray-400">{club.draws ?? 0}</td>
                <td className="p-4 text-center text-red-400">{club.losses ?? 0}</td>
                <td className="p-4 text-center font-display font-black text-accent text-lg">{pts(club)}</td>
                <td className="p-4 text-right">
                  <button onClick={() => openEdit(club)} className="p-2 hover:bg-surface rounded-lg"><Edit className="w-4 h-4 text-textMuted" /></button>
                  <button onClick={() => deleteClub(club.id)} className="p-2 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-2xl relative p-8">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-surface rounded-full text-white"><X className="w-5 h-5" /></button>
            <h2 className="text-2xl font-display font-bold mb-6 text-white">{editingClub ? 'Edit Club' : 'Create Club'}</h2>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider mb-4">Club Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Name</label><input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white" /></div>
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Captain</label><input type="text" value={form.captain} onChange={e => setForm(p => ({...p, captain: e.target.value}))} className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white" /></div>
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Members</label><input type="number" min="0" value={form.members} onChange={e => setForm(p => ({...p, members: e.target.value}))} className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white" /></div>
                <div>
                  <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Logo</label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border-2 border-borderGray overflow-hidden bg-surface flex items-center justify-center">
                      {form.logo ? (
                        <img src={form.logo} className="w-full h-full object-cover" alt="logo preview" />
                      ) : (
                        <Camera className="w-5 h-5 text-textMuted" />
                      )}
                    </div>
                    <div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} hidden />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-ghost text-sm">Choose File</button>
                      {form.logo && <button type="button" onClick={() => setForm(p => ({...p, logo: ''}))} className="btn-ghost text-sm text-red-400 ml-2">Remove</button>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-borderGray/50 pt-6">
              <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider mb-4">Ranking Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Matches Played</label><input type="number" min="0" value={form.matches} onChange={e => setForm(p => ({...p, matches: e.target.value}))} className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white" /></div>
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Wins</label><input type="number" min="0" value={form.wins} onChange={e => setForm(p => ({...p, wins: e.target.value}))} className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white" /></div>
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Draws</label><input type="number" min="0" value={form.draws} onChange={e => setForm(p => ({...p, draws: e.target.value}))} className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white" /></div>
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Losses (auto)</label>
                  <div className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 text-red-400 font-bold">{Number(form.losses)}</div>
                </div>
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Goals For</label><input type="number" min="0" value={form.goalsFor} onChange={e => setForm(p => ({...p, goalsFor: e.target.value}))} className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white" /></div>
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Goals Against</label><input type="number" min="0" value={form.goalsAgainst} onChange={e => setForm(p => ({...p, goalsAgainst: e.target.value}))} className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white" /></div>
                <div><label className="text-xs font-bold text-textMuted uppercase tracking-wider">Points (auto)</label>
                  <div className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 text-accent font-bold">
                    {Number(form.wins) * 3 + Number(form.draws)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} className="btn-accent">{editingClub ? 'Save' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClubs;
