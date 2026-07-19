import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Trophy, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      });

      gsap.from('.hero-element', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative">

      <div className="hero-element inline-flex items-center gap-2 bg-surface border border-borderGray px-4 py-2 rounded-full mb-8 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-semibold tracking-widest text-textMuted uppercase">Season 7 is Live</span>
      </div>

      <h1 ref={titleRef} className="text-6xl md:text-8xl font-black mb-6 leading-tight uppercase font-display">
        The Pinnacle of <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-600">
          Competitive Gaming
        </span>
      </h1>

      <p className="hero-element text-lg md:text-xl text-textMuted max-w-2xl mb-12 font-light">
        OCTA LOCK CUP is the definitive tournament and ranking management platform.
        Track solo standings, club dominance, and ascend to the Hall of Champions.
      </p>

      <div className="hero-element flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
        <Link to="/solo-cup" className="btn-accent flex items-center justify-center gap-3 py-4 text-lg">
          View Rankings <ArrowRight className="w-5 h-5" />
        </Link>
        <Link to="/hall-of-champions" className="btn-ghost flex items-center justify-center gap-3 py-4 text-lg">
          <Trophy className="w-5 h-5 text-accent" /> Hall of Fame
        </Link>
      </div>

      {/* Decorative Grid or Match preview can go here */}
      <div className="hero-element mt-16 md:mt-24 w-full max-w-5xl glass-panel p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-xl md:text-2xl font-bold font-display mb-1 text-white">Latest Match</h3>
          <p className="text-textMuted text-sm">Season 4 • Group Stage</p>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-center">
            <img src="https://ui-avatars.com/api/?name=Faker&background=random" className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-borderGray" alt="Faker" />
            <span className="mt-1 md:mt-2 font-semibold text-white text-sm md:text-base">Faker</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-accent">3 - 1</div>
          <div className="flex flex-col items-center">
            <img src="https://ui-avatars.com/api/?name=Chovy&background=random" className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-borderGray" alt="Chovy" />
            <span className="mt-1 md:mt-2 font-semibold text-white text-sm md:text-base">Chovy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
