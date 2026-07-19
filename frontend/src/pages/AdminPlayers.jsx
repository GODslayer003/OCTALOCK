import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Edit, UserCheck, UserX, ArrowRightLeft, Download, Upload, X, Camera } from 'lucide-react';

const STORAGE_KEY = 'octalock_players';

const loadPlayers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch { return null }
};

const initialPlayers = [
  { id: 1, name: 'Faker', nickname: 'Faker', country: 'KR', club: 'T1', email: 'faker@t1.gg', phone: '+82-10-1234', status: 'active', photo: 'https://ui-avatars.com/api/?name=Faker&background=random', matches: 45, wins: 38, draws: 2, losses: 5, goalsFor: 95, goalsAgainst: 55, streak: 'W W W W W' },
  { id: 2, name: 'Chovy', nickname: 'Chovy', country: 'KR', club: 'GEN', email: 'chovy@gen.gg', phone: '+82-10-5678', status: 'active', photo: 'https://ui-avatars.com/api/?name=Chovy&background=random', matches: 45, wins: 35, draws: 4, losses: 6, goalsFor: 88, goalsAgainst: 53, streak: 'W L W W D' },
  { id: 3, name: 'ShowMaker', nickname: 'ShowMaker', country: 'KR', club: 'DK', email: 'showmaker@dk.gg', phone: '+82-10-9012', status: 'active', photo: 'https://ui-avatars.com/api/?name=ShowMaker&background=random', matches: 45, wins: 30, draws: 5, losses: 10, goalsFor: 72, goalsAgainst: 57, streak: 'L W D W L' },
  { id: 4, name: 'Knight', nickname: 'Knight', country: 'CN', club: 'JDG', email: 'knight@jdg.cn', phone: '+86-130-1234', status: 'active', photo: 'https://ui-avatars.com/api/?name=Knight&background=random', matches: 45, wins: 28, draws: 8, losses: 9, goalsFor: 75, goalsAgainst: 55, streak: 'W W D W W' },
  { id: 5, name: 'Ruler', nickname: 'Ruler', country: 'KR', club: 'JDG', email: 'ruler@jdg.cn', phone: '+82-10-3456', status: 'suspended', photo: 'https://ui-avatars.com/api/?name=Ruler&background=random', matches: 45, wins: 26, draws: 10, losses: 9, goalsFor: 70, goalsAgainst: 52, streak: 'D D W W L' },
  { id: 6, name: 'Bin', nickname: 'Bin', country: 'CN', club: 'BLG', email: 'bin@blg.cn', phone: '+86-130-5678', status: 'active', photo: 'https://ui-avatars.com/api/?name=Bin&background=random', matches: 45, wins: 25, draws: 8, losses: 12, goalsFor: 65, goalsAgainst: 55, streak: 'L L W D W' },
];

const AdminPlayers = () => {
  const [players, setPlayers] = useState(() => loadPlayers() ?? initialPlayers);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [form, setForm] = useState({ name: '', nickname: '', country: '', club: '', email: '', phone: '', bio: '', photo: '', matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, streak: '' });
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const m = Number(form.matches);
    const w = Number(form.wins);
    const d = Number(form.draws);
    if (m && w + d <= m) setForm(prev => ({ ...prev, losses: m - w - d }));
  }, [form.matches, form.wins, form.draws]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(players)) }, [players]);

  const filtered = useMemo(() => {
    return players.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.club.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, players]);

  const openCreate = () => {
    setEditingPlayer(null);
    setForm({ name: '', nickname: '', country: '', club: '', email: '', phone: '', bio: '', photo: '', matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, streak: '' });
    setShowModal(true);
  };

  const openEdit = (player) => {
    setEditingPlayer(player);
    setForm({
      name: player.name || '', nickname: player.nickname || '', country: player.country || '', club: player.club || '',
      email: player.email || '', phone: player.phone || '', bio: player.bio || '', photo: player.photo || '',
      matches: player.matches ?? 0, wins: player.wins ?? 0, draws: player.draws ?? 0, losses: player.losses ?? 0,
      goalsFor: player.goalsFor ?? 0, goalsAgainst: player.goalsAgainst ?? 0, streak: player.streak || ''
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const payload = {
      ...form,
      matches: Number(form.matches),
      wins: Number(form.wins),
      draws: Number(form.draws),
      losses: Number(form.losses),
      goalsFor: Number(form.goalsFor),
      goalsAgainst: Number(form.goalsAgainst),
    };
    if (editingPlayer) {
      setPlayers(prev => prev.map(p => p.id === editingPlayer.id ? { ...p, ...payload } : p));
    } else {
      setPlayers(prev => [...prev, { id: Date.now(), ...payload, status: 'active', photo: payload.photo || `https://ui-avatars.com/api/?name=${form.name}&background=random` }]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'suspended' : 'active' } : p));
  };

  const deletePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const pts = (p) => (p.wins || 0) * 3 + (p.draws || 0);

  const textInputs = [
    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Lee Sang-hyeok' },
    { label: 'Nickname', key: 'nickname', type: 'text', placeholder: 'Faker' },
    { label: 'Country', key: 'country', type: 'text', placeholder: 'KR' },
    { label: 'Current Club', key: 'club', type: 'text', placeholder: 'T1' },
    { label: 'Email', key: 'email', type: 'email', placeholder: 'player@club.gg' },
    { label: 'Phone', key: 'phone', type: 'text', placeholder: '+82-10-0000' },
  ];

  const statInputs = [
    { label: 'Matches Played', key: 'matches', type: 'number' },
    { label: 'Wins', key: 'wins', type: 'number' },
    { label: 'Draws', key: 'draws', type: 'number' },
    { label: 'Goals For', key: 'goalsFor', type: 'number' },
    { label: 'Goals Against', key: 'goalsAgainst', type: 'number' },
  ];

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Players Management</h1>
          <p className="text-textMuted mt-1">{players.length} players registered</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input
              type="text"
              placeholder="Search players..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-surface border border-borderGray rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-accent w-64 text-white"
            />
          </div>
          <button className="btn-ghost flex items-center gap-2 text-sm"><Upload className="w-4 h-4" /> Import CSV</button>
          <button className="btn-ghost flex items-center gap-2 text-sm"><Download className="w-4 h-4" /> Export</button>
          <button onClick={openCreate} className="btn-accent flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add Player</button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface/50 border-b border-borderGray text-xs uppercase tracking-wider text-textMuted">
                <th className="p-4 font-semibold">Player</th>
                <th className="p-4 font-semibold">Country</th>
                <th className="p-4 font-semibold">Club</th>
                <th className="p-4 font-semibold text-center">W</th>
                <th className="p-4 font-semibold text-center">D</th>
                <th className="p-4 font-semibold text-center">L</th>
                <th className="p-4 font-semibold text-center text-accent">PTS</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="9" className="p-8 text-center text-textMuted">No players found.</td></tr>
              ) : (
                filtered.map(player => (
                  <tr key={player.id} className="border-b border-borderGray/30 hover:bg-surface/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={player.photo} className="w-10 h-10 rounded-full border border-borderGray" alt={player.name} />
                        <div>
                          <div className="font-semibold text-white">{player.name}</div>
                          <div className="text-xs text-textMuted">{player.nickname}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white">{player.country}</td>
                    <td className="p-4 text-white font-medium">{player.club}</td>
                    <td className="p-4 text-center text-green-400 font-semibold">{player.wins ?? 0}</td>
                    <td className="p-4 text-center text-gray-400">{player.draws ?? 0}</td>
                    <td className="p-4 text-center text-red-400">{player.losses ?? 0}</td>
                    <td className="p-4 text-center font-display font-bold text-accent">{pts(player)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${player.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {player.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(player)} className="p-2 rounded-lg hover:bg-surface transition-colors" title="Edit"><Edit className="w-4 h-4 text-textMuted hover:text-white" /></button>
                        <button onClick={() => toggleStatus(player.id)} className="p-2 rounded-lg hover:bg-surface transition-colors" title={player.status === 'active' ? 'Suspend' : 'Activate'}>
                          {player.status === 'active' ? <UserX className="w-4 h-4 text-amber-400" /> : <UserCheck className="w-4 h-4 text-green-400" />}
                        </button>
                        <button className="p-2 rounded-lg hover:bg-surface transition-colors" title="Transfer"><ArrowRightLeft className="w-4 h-4 text-blue-400" /></button>
                        <button onClick={() => deletePlayer(player.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-surface hover:bg-surfaceHover rounded-full transition-colors text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-display font-bold mb-6 text-white">{editingPlayer ? 'Edit Player' : 'Create Player'}</h2>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider mb-4">Profile Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {textInputs.map(field => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-xs font-bold text-textMuted uppercase tracking-wider">{field.label}</label>
                      <input
                        type={field.type}
                        value={form[field.key]}
                        onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white"
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Profile Photo</label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full border-2 border-borderGray overflow-hidden bg-surface flex items-center justify-center">
                        {form.photo ? (
                          <img src={form.photo} className="w-full h-full object-cover" alt="preview" />
                        ) : (
                          <Camera className="w-6 h-6 text-textMuted" />
                        )}
                      </div>
                      <div>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-ghost text-sm">Choose File</button>
                        {form.photo && <button type="button" onClick={() => setForm(prev => ({ ...prev, photo: '' }))} className="btn-ghost text-sm text-red-400 ml-2">Remove</button>}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Player biography..."
                      rows={2}
                      className="w-full bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-borderGray/50 pt-6 mb-6">
                <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider mb-4">Ranking Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {statInputs.map(field => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-xs font-bold text-textMuted uppercase tracking-wider">{field.label}</label>
                      <input
                        type={field.type}
                        min="0"
                        value={form[field.key]}
                        onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white"
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Losses (auto)</label>
                    <div className="w-full bg-background/50 border border-borderGray rounded-xl px-4 py-3 text-red-400 font-bold">
                      {Number(form.losses)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Points (auto)</label>
                    <div className="w-full bg-background/50 border border-borderGray rounded-xl px-4 py-3 text-accent font-bold">
                      {Number(form.wins) * 3 + Number(form.draws)}
                    </div>
                  </div>

                </div>
                <div className="mt-4">
                  <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Recent Form (e.g. W W L D W)</label>
                  <input
                    type="text"
                    value={form.streak}
                    onChange={e => setForm(prev => ({ ...prev, streak: e.target.value }))}
                    placeholder="W W W L D"
                    className="w-full mt-2 bg-background/50 border border-borderGray rounded-xl px-4 py-3 focus:outline-none focus:border-accent text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
                <button onClick={handleSave} className="btn-accent">{editingPlayer ? 'Save Changes' : 'Create Player'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlayers;
