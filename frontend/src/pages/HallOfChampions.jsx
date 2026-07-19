import React from 'react';
import { Award, Calendar, ChevronRight } from 'lucide-react';

const mockSeasons = [
  {
    id: 3,
    name: 'Season 3',
    year: '2025',
    soloChampion: { name: 'Knight', club: 'JDG', points: 150 },
    clubChampion: { name: 'JD Gaming', points: 400 },
    status: 'LOCKED'
  },
  {
    id: 2,
    name: 'Season 2',
    year: '2024',
    soloChampion: { name: 'Faker', club: 'T1', points: 165 },
    clubChampion: { name: 'T1', points: 480 },
    status: 'LOCKED'
  },
  {
    id: 1,
    name: 'Season 1',
    year: '2024',
    soloChampion: { name: 'Chovy', club: 'GEN', points: 140 },
    clubChampion: { name: 'Gen.G', points: 420 },
    status: 'LOCKED'
  },
];

const HallOfChampions = () => {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-surface border border-borderGray rounded-full mb-4">
          <Award className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase mb-4 tracking-wide text-white">
          Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-600">Champions</span>
        </h1>
        <p className="text-textMuted max-w-xl mx-auto text-lg">
          The permanent legacy of those who conquered the Octa Lock Cup. History remembers the victors.
        </p>
      </div>

      <div className="relative border-l border-borderGray/50 ml-4 md:ml-0 md:border-none">
        {/* Desktop Central Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-borderGray to-transparent -translate-x-1/2" />

        <div className="flex flex-col gap-12">
          {mockSeasons.map((season, idx) => (
            <div key={season.id} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Timeline Dot */}
              <div className="absolute left-[-21px] md:left-1/2 top-8 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-background border-4 border-accent flex items-center justify-center shadow-[0_0_15px_rgba(245,185,66,0.3)] z-10">
                <span className="font-bold text-xs">{season.id}</span>
              </div>

              {/* Season Info Card */}
              <div className="flex-1 w-full pl-8 md:pl-0">
                <div className="glass-panel p-6 hover:shadow-[0_0_30px_rgba(245,185,66,0.15)] transition-shadow duration-500">
                  <div className="flex items-center justify-between border-b border-borderGray/50 pb-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-black font-display text-white">{season.name}</h2>
                      <div className="flex items-center gap-2 text-textMuted text-sm mt-1">
                        <Calendar className="w-4 h-4" /> {season.year}
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-md text-accent text-xs font-bold uppercase tracking-wider">
                      Legacy Sealed
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Solo Champ */}
                    <div className="bg-surface/30 p-4 rounded-xl border border-borderGray/30 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-150 transition-transform duration-500">
                        <Award className="w-16 h-16 text-accent" />
                      </div>
                      <div className="text-xs text-textMuted uppercase font-bold tracking-widest mb-3">Solo Champion</div>
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${season.soloChampion.name}&background=random`} className="w-12 h-12 rounded-full border border-borderGray" alt={season.soloChampion.name} />
                        <div>
                          <div className="font-bold text-lg text-white">{season.soloChampion.name}</div>
                          <div className="text-sm text-textMuted">{season.soloChampion.club} • {season.soloChampion.points} PTS</div>
                        </div>
                      </div>
                    </div>

                    {/* Club Champ */}
                    <div className="bg-surface/30 p-4 rounded-xl border border-borderGray/30 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-150 transition-transform duration-500">
                        <Award className="w-16 h-16 text-accent" />
                      </div>
                      <div className="text-xs text-textMuted uppercase font-bold tracking-widest mb-3">Club Champion</div>
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${season.clubChampion.name}&background=random`} className="w-12 h-12 rounded-lg border border-borderGray" alt={season.clubChampion.name} />
                        <div>
                          <div className="font-bold text-lg text-white">{season.clubChampion.name}</div>
                          <div className="text-sm text-textMuted">{season.clubChampion.points} PTS Total</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 border-t border-borderGray/50 text-sm font-semibold text-textMuted flex items-center justify-center gap-2 hover:text-white transition-colors group">
                    View Full Season Stats <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Empty Space for layout balance */}
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HallOfChampions;
