import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Filter, X, Trophy, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const ROWS_PER_PAGE = 10;

const ClubRankings = () => {
  const [search, setSearch] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  const [version, setVersion] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = () => setVersion(v => v + 1);
    window.addEventListener('storage', handler);
    window.addEventListener('focus', handler);
    return () => { window.removeEventListener('storage', handler); window.removeEventListener('focus', handler) };
  }, []);

  useEffect(() => { setPage(1) }, [search]);

  const clubs = useMemo(() => {
    let raw = [];
    try { const stored = localStorage.getItem('octalock_clubs'); if (stored) raw = JSON.parse(stored); if (!Array.isArray(raw)) raw = [] } catch { raw = [] }
    return raw
      .map(c => ({
        ...c,
        pts: (c.wins || 0) * 3 + (c.draws || 0),
        gd: (c.goalsFor || 0) - (c.goalsAgainst || 0),
      }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd)
      .map((c, i) => ({ ...c, rank: i + 1 }));
  }, [version]);

  const filteredClubs = useMemo(() => {
    return clubs.filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, clubs]);

  const totalPages = Math.max(1, Math.ceil(filteredClubs.length / ROWS_PER_PAGE));
  const paginatedClubs = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredClubs.slice(start, start + ROWS_PER_PAGE);
  }, [filteredClubs, page]);

  return (
    <div className="max-w-[90rem] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase mb-2 text-white">Club Rankings</h1>
          <p className="text-textMuted">Season 4 Club Standings. Glory awaits the bold.</p>
        </div>

        <div className="flex items-center gap-4 mt-6 lg:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input
              type="text"
              placeholder="Search club..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-surface border border-borderGray rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-accent w-64 md:w-80 transition-all text-white"
            />
          </div>
          <button className="btn-ghost p-2"><Filter className="w-5 h-5" /></button>
          <button className="btn-ghost flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface/50 border-b border-borderGray text-xs uppercase tracking-wider text-textMuted">
                <th className="p-4 font-semibold">#</th>
                <th className="p-4 font-semibold">Club</th>
                <th className="p-4 font-semibold">Captain</th>
                <th className="p-4 font-semibold text-center">Members</th>
                <th className="p-4 font-semibold text-center">MP</th>
                <th className="p-4 font-semibold text-center">W</th>
                <th className="p-4 font-semibold text-center">D</th>
                <th className="p-4 font-semibold text-center">L</th>
                <th className="p-4 font-semibold text-center">Win %</th>
                <th className="p-4 font-semibold text-accent text-center">PTS</th>
                <th className="p-4 font-semibold text-center">Streak</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClubs.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-textMuted">No clubs found.</td>
                </tr>
              ) : (
                paginatedClubs.map(club => (
                  <tr
                    key={club.id || club.name}
                    onClick={() => setSelectedClub(club)}
                    className={`border-b border-borderGray/50 hover:bg-surface/30 transition-colors cursor-pointer ${club.rank <= 3 ? 'bg-gradient-to-r from-accent/5 to-transparent' : ''}`}
                  >
                    <td className="p-4">
                      <span className={`font-display font-bold text-lg ${club.rank === 1 ? 'text-accent' : club.rank === 2 ? 'text-gray-300' : club.rank === 3 ? 'text-amber-600' : ''}`}>
                        #{club.rank}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <img src={club.logo || `https://ui-avatars.com/api/?name=${club.name}&background=random`} className="w-10 h-10 rounded-lg border border-borderGray" alt={club.name} />
                      <span className="font-bold text-white">{club.name}</span>
                    </td>
                    <td className="p-4 text-white">{club.captain}</td>
                    <td className="p-4 text-center"><Users className="w-4 h-4 inline mr-1 text-textMuted" />{club.members}</td>
                    <td className="p-4 text-center">{club.matches || 0}</td>
                    <td className="p-4 text-center text-green-400">{club.wins || 0}</td>
                    <td className="p-4 text-center text-gray-400">{club.draws || 0}</td>
                    <td className="p-4 text-center text-red-400">{club.losses || 0}</td>
                    <td className="p-4 text-center font-semibold">
                      {club.matches ? `${((club.wins / club.matches) * 100).toFixed(1)}%` : '0.0%'}
                    </td>
                    <td className="p-4 text-center font-display font-bold text-accent text-lg">{club.pts}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold">
                        {club.streak
                          ? club.streak.split(' ').map((res, i) => (
                              <span key={i} className={`w-5 h-5 rounded-sm flex items-center justify-center ${res === 'W' ? 'bg-green-500/20 text-green-500' : res === 'L' ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-400'}`}>
                                {res}
                              </span>
                            ))
                          : <span className="text-textMuted text-xs">—</span>
                        }
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-borderGray/50">
            <span className="text-sm text-textMuted">
              Showing {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filteredClubs.length)} of {filteredClubs.length}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${p === page ? 'bg-accent text-background' : 'hover:bg-surface text-textMuted'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-2xl relative">
            <button
              onClick={() => setSelectedClub(null)}
              className="absolute top-4 right-4 p-2 bg-surface hover:bg-surfaceHover rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-6 border-b border-borderGray/50 pb-6 mb-6">
                <img src={selectedClub.logo || `https://ui-avatars.com/api/?name=${selectedClub.name}&background=random&size=128`} className="w-24 h-24 rounded-xl border-2 border-accent shadow-[0_0_20px_rgba(245,185,66,0.3)]" alt={selectedClub.name} />
                <div>
                  <h2 className="text-3xl font-display font-bold text-white">{selectedClub.name}</h2>
                  <div className="text-accent font-semibold tracking-wider uppercase mt-1">Captain: {selectedClub.captain}</div>
                  <div className="mt-2 flex gap-2">
                    <span className="px-3 py-1 bg-surface text-xs rounded border border-borderGray flex items-center gap-1"><Users className="w-3 h-3" /> {selectedClub.members} Members</span>
                    <span className="px-3 py-1 bg-surface text-xs rounded border border-borderGray">{selectedClub.pts} PTS</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface/50 p-4 rounded-lg text-center">
                  <div className="text-textMuted text-sm mb-1">Win Rate</div>
                  <div className="text-xl font-bold">{selectedClub.matches ? `${((selectedClub.wins / selectedClub.matches) * 100).toFixed(1)}%` : '0.0%'}</div>
                </div>
                <div className="bg-surface/50 p-4 rounded-lg text-center">
                  <div className="text-textMuted text-sm mb-1">Wins</div>
                  <div className="text-xl font-bold text-green-400">{selectedClub.wins || 0}</div>
                </div>
                <div className="bg-surface/50 p-4 rounded-lg text-center">
                  <div className="text-textMuted text-sm mb-1">Draws</div>
                  <div className="text-xl font-bold text-gray-400">{selectedClub.draws || 0}</div>
                </div>
                <div className="bg-surface/50 p-4 rounded-lg text-center">
                  <div className="text-textMuted text-sm mb-1">Losses</div>
                  <div className="text-xl font-bold text-red-400">{selectedClub.losses || 0}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface/50 p-4 rounded-lg text-center">
                  <div className="text-textMuted text-sm mb-1">Goals For</div>
                  <div className="text-xl font-bold">{selectedClub.goalsFor || 0}</div>
                </div>
                <div className="bg-surface/50 p-4 rounded-lg text-center">
                  <div className="text-textMuted text-sm mb-1">Goals Against</div>
                  <div className="text-xl font-bold">{selectedClub.goalsAgainst || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubRankings;
