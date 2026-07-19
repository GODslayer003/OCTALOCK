const mongoose = require('mongoose');
const Match = require('../models/Match');
const PlayerSeasonStat = require('../models/PlayerSeasonStat');
const ClubSeasonStat = require('../models/ClubSeasonStat');
const Player = require('../models/Player');
const Season = require('../models/Season');

exports.recordMatch = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { season, playerA, playerB, scoreA = 0, scoreB = 0, winner, date } = req.body;
    
    if (playerA === playerB) {
      throw new Error("Players must be different");
    }
    
    const seasonDoc = await Season.findById(season).session(session);
    if (!seasonDoc || seasonDoc.status !== 'ACTIVE') {
       throw new Error("Season is not active or does not exist");
    }

    const pA = await Player.findById(playerA).session(session);
    const pB = await Player.findById(playerB).session(session);
    
    if (!pA || !pB) throw new Error("Players not found");

    const match = new Match({
      season, 
      playerA, 
      playerB, 
      clubA: pA.club, 
      clubB: pB.club, 
      scoreA, 
      scoreB, 
      winner: winner || null,
      date: date || Date.now()
    });
    
    await match.save({ session });
    
    const updatePlayerStat = async (playerId, clubId, isWinner, isDraw, goalsFor, goalsAgainst) => {
       const points = isWinner ? 3 : (isDraw ? 1 : 0);
       const wins = isWinner ? 1 : 0;
       const draws = isDraw ? 1 : 0;
       const losses = (!isWinner && !isDraw) ? 1 : 0;
       const gd = goalsFor - goalsAgainst;
       
       const stat = await PlayerSeasonStat.findOneAndUpdate(
         { season, player: playerId },
         {
           $set: { club: clubId }, // Reflect current club
           $inc: { 
             matchesPlayed: 1, wins, draws, losses, goalsFor, goalsAgainst, goalDifference: gd, points 
           }
         },
         { upsert: true, new: true, session }
       );

       // Recalculate win rate
       stat.winRate = stat.matchesPlayed > 0 ? ((stat.wins / stat.matchesPlayed) * 100).toFixed(2) : 0;
       await stat.save({ session });
       
       if (clubId) {
         const clubStat = await ClubSeasonStat.findOneAndUpdate(
           { season, club: clubId },
           {
             $inc: {
               matchesPlayed: 1, wins, draws, losses, goalsFor, goalsAgainst, goalDifference: gd, points
             }
           },
           { upsert: true, new: true, session }
         );
         clubStat.winRate = clubStat.matchesPlayed > 0 ? ((clubStat.wins / clubStat.matchesPlayed) * 100).toFixed(2) : 0;
         await clubStat.save({ session });
       }
    };

    const isDraw = !winner;
    const pAWinner = String(winner) === String(playerA);
    const pBWinner = String(winner) === String(playerB);

    await updatePlayerStat(playerA, pA.club, pAWinner, isDraw, scoreA, scoreB);
    await updatePlayerStat(playerB, pB.club, pBWinner, isDraw, scoreB, scoreA);

    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({ success: true, match });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: err.message });
  }
};
