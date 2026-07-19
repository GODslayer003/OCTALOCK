import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';

const ROWS_PER_PAGE = 10;

const SoloRankings = () => {
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [version, setVersion] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = () => setVersion(v => v + 1);
    window.addEventListener('storage', handler);
    window.addEventListener('focus', handler);
    return () => { window.removeEventListener('storage', handler); window.removeEventListener('focus', handler) };
  }, []);

  useEffect(() => { setPage(1) }, [search]);

  const players = useMemo(() => {
    let raw = [];
    try { const stored = localStorage.getItem('octalock_players'); if (stored) raw = JSON.parse(stored); if (!Array.isArray(raw)) raw = [] } catch { raw = [] }
    return raw
      .map(p => ({
        ...p,
        pts: (p.wins || 0) * 3 + (p.draws || 0),
        gd: (p.goalsFor || 0) - (p.goalsAgainst || 0),
      }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [version]);

  const filteredPlayers = useMemo(() => {
    return players.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, players]);

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / ROWS_PER_PAGE));
  const paginatedPlayers = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredPlayers.slice(start, start + ROWS_PER_PAGE);
  }, [filteredPlayers, page]);

  return (
    <div className="max-w-[90rem] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase mb-2 text-white">Solo Player Ranking</h1>
          <p className="text-textMuted">Season 4 Standings. Every point matters.</p>
        </div>

        <div className="flex items-center gap-4 mt-6 lg:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input
              type="text"
              placeholder="Search player..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface border border-borderGray rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-accent w-64 md:w-80 transition-all text-white"
            />
          </div>
          <button className="btn-ghost p-2"><Filter className="w-5 h-5" /></button>
          <button className="btn-ghost flex items-center gap-2"><Download className="w-4 h-4"/> Export</button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface/50 border-b border-borderGray text-xs uppercase tracking-wider text-textMuted">
                <th className="p-4 font-semibold">Rank</th>
                <th className="p-4 font-semibold">Player</th>
                <th className="p-4 font-semibold text-center">MP</th>
                <th className="p-4 font-semibold text-center">W</th>
                <th className="p-4 font-semibold text-center">D</th>
                <th className="p-4 font-semibold text-center">L</th>
                <th className="p-4 font-semibold text-center">Win %</th>
                <th className="p-4 font-semibold text-accent text-center">PTS</th>
                <th className="p-4 font-semibold text-center">Form (Last 5)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlayers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-textMuted">No players found.</td>
                </tr>
              ) : (
                paginatedPlayers.map((player) => (
                  <tr
                    key={player.id || player.name}
                    onClick={() => setSelectedPlayer(player)}
                    className={`border-b border-borderGray/50 hover:bg-surface/30 transition-colors cursor-pointer ${player.rank <= 3 ? 'bg-gradient-to-r from-accent/5 to-transparent' : ''}`}
                  >
                    <td className="p-4">
                      <span className={`font-display font-bold text-lg ${player.rank === 1 ? 'text-accent' : player.rank === 2 ? 'text-gray-300' : player.rank === 3 ? 'text-amber-600' : ''}`}>
                        #{player.rank}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <img src={player.photo || `https://ui-avatars.com/api/?name=${player.name}&background=random`} className="w-10 h-10 rounded-full border border-borderGray object-cover" alt={player.name} />
                      <div>
                        <div className="font-semibold text-white">{player.name}</div>
                        <div className="text-xs text-textMuted">{player.country}</div>
                      </div>
                    </td>
                    <td className="p-4 text-center">{player.matches || 0}</td>
                    <td className="p-4 text-center text-green-400">{player.wins || 0}</td>
                    <td className="p-4 text-center text-gray-400">{player.draws || 0}</td>
                    <td className="p-4 text-center text-red-400">{player.losses || 0}</td>
                    <td className="p-4 text-center font-semibold">
                      {player.matches ? `${((player.wins / player.matches) * 100).toFixed(1)}%` : '0.0%'}
                    </td>
                    <td className="p-4 text-center font-display font-bold text-accent text-lg">{player.pts}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold">
                        {player.streak
                          ? player.streak.split(' ').map((res, i) => (
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
              Showing {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filteredPlayers.length)} of {filteredPlayers.length}
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

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-2xl relative">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 p-2 bg-surface hover:bg-surfaceHover rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-6 border-b border-borderGray/50 pb-6 mb-6">
                <img src={selectedPlayer.photo || `https://ui-avatars.com/api/?name=${selectedPlayer.name}&background=random&size=128`} className="w-24 h-24 rounded-full border-2 border-accent shadow-[0_0_20px_rgba(245,185,66,0.3)] object-cover" alt={selectedPlayer.name} />
                <div>
                  <h2 className="text-3xl font-display font-bold text-white">{selectedPlayer.name}</h2>
                  <div className="text-accent font-semibold tracking-wider uppercase mt-1">{selectedPlayer.club} • {selectedPlayer.country}</div>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 bg-surface text-xs rounded border border-borderGray">Rank #{selectedPlayer.rank}</span>
                    <span className="px-2 py-1 bg-surface text-xs rounded border border-borderGray">{selectedPlayer.pts} PTS</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface/50 p-4 rounded-lg text-center">
                  <div className="text-textMuted text-sm mb-1">Win Rate</div>
                  <div className="text-xl font-bold">{selectedPlayer.matches ? `${((selectedPlayer.wins / selectedPlayer.matches) * 100).toFixed(1)}%` : '0.0%'}</div>
                </div>
                <div className="bg-surface/50 p-4 rounded-lg text-center">
                  <div className="text-textMuted text-sm mb-1">Wins</div>
                  <div className="text-xl font-bold text-green-400">{selectedPlayer.wins || 0}</div>
                </div>
                <div className="bg-surface/50 p-4 rounded-lg text-center">
                  <div className="text-textMuted text-sm mb-1">Draws</div>
                  <div className="text-xl font-bold text-gray-400">{selectedPlayer.draws || 0}</div>
                </div>
                <div className="bg-surface/50 p-4 rounded-lg text-center">
                  <div className="text-textMuted text-sm mb-1">Losses</div>
                  <div className="text-xl font-bold text-red-400">{selectedPlayer.losses || 0}</div>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-lg mb-4 text-white">Club History</h3>
                <div className="flex flex-wrap gap-3">
                  {[selectedPlayer.club].filter(Boolean).map((club, i) => (
                    <div key={i} className="flex items-center gap-2 bg-surface/50 px-4 py-2 rounded-full border border-borderGray">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="font-medium text-sm">{club}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoloRankings;
