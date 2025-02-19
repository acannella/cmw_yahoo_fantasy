const { PrismaClient } = require('@prisma/client');
const leagueQueries = require('../src/queries/leagueQueries');

const prisma = new PrismaClient();

const updateStandingsRank = async function () {
  try {
    const { leagueKey } = await leagueQueries.getLeagueMetadata();
    const regularSeasonEnd = 14;
    for (let i = 1; i <= regularSeasonEnd; i++) {
      const leagueStandingsData = await prisma.league_standings.findMany({
        where: { league_key: leagueKey, week: i },
        select: {
          id: true,
        },
        orderBy: [{ wins: 'desc' }, { points_for: 'desc' }],
      });
      let rank = 1;
      for (const standing of leagueStandingsData) {
        await prisma.league_standings.update({
          where: { id: standing.id },
          data: { rank: rank },
        });
        rank += 1;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Update the change column of a standings row based on the difference in rank between the current week and previous week
 */

const updateStandingsChangeField = async function () {
  try {
    const { leagueKey } = await leagueQueries.getLeagueMetadata();
    const standingWeeks = await prisma.league_standings.findMany({
      where: { league_key: leagueKey },
      distinct: ['week'],
      select: { week: true },
      orderBy: { week: 'asc' },
    });
    const standingsMap = new Map();
    for (let i = 1; i <= standingWeeks.length; i++) {
      const leagueStandingsData = await prisma.league_standings.findMany({
        where: { league_key: leagueKey, week: i },
        select: {
          id: true,
          team_key: true,
          rank: true,
        },
        orderBy: [{ wins: 'desc' }, { points_for: 'desc' }],
      });
      //Update the change value by getting difference between the previous rank and current rank. Store the current rank for the next iteration
      if (i !== 1) {
        for (const standing of leagueStandingsData) {
          const rankChange =
            standingsMap.get(standing.team_key) - standing.rank;
          await prisma.league_standings.update({
            where: { id: standing.id },
            data: { change: rankChange },
          });
          standingsMap.set(standing.team_key, standing.rank);
        }
      } else {
        for (const standing of leagueStandingsData) {
          await prisma.league_standings.update({
            where: { id: standing.id },
            data: { change: 0 },
          });
          standingsMap.set(standing.team_key, standing.rank);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};
