const { PrismaClient } = require('@prisma/client');
const initYahooFantasy = require('../../utils/initYahooFantasy');

const prisma = new PrismaClient();

const getAllFantasyRosters = async function () {};

//This needs to be documented and potentially refactored
const updateFantasyRosters = async function () {
  try {
    const yf = await initYahooFantasy();

    const gameKey = await prisma.league_metadata.aggregate({
      _max: { game_key: true },
    });

    const leagueKey = await prisma.league_metadata.findFirst({
      where: { game_key: gameKey._max.game_key },
    });
    const teamKeys = await prisma.fantasy_teams.findMany({
      where: { league_key: leagueKey.league_key },
      where: { fantasy_team_key: { not: 'FA' } },
      select: { fantasy_team_key: true },
    });

    for (const teamKey of teamKeys) {
      const teamRosterObj = await yf.team.roster(teamKey.fantasy_team_key);
      const rosterPlayers = [];
      teamRosterObj.roster.forEach((player) => {
        rosterPlayers.push(player.player_key);
      });
      const rosterInDB = await prisma.nfl_players.findMany({
        where: {
          league_key: leagueKey.league_key,
          team_key: teamKey.fantasy_team_key,
        },
        select: { player_key: true },
      });

      const playerKeysInDB = rosterInDB.map(
        (playerKeyObj) => playerKeyObj.player_key
      );
      for (const playerKeyObj of playerKeysInDB) {
        if (!rosterPlayers.includes(playerKeyObj)) {
          const nflPlayerID = await prisma.nfl_players.findFirst({
            where: {
              player_key: playerKeyObj,
              league_key: leagueKey.league_key,
            },
            select: { id: true },
          });
          await prisma.nfl_players.update({
            where: { id: nflPlayerID.id },
            data: { team_key: 'FA' },
          });
        }
      }
      for (const player of rosterPlayers) {
        const nflPlayerID = await prisma.nfl_players.findFirst({
          where: {
            player_key: player,
            league_key: leagueKey.league_key,
          },
          select: { id: true },
        });

        await prisma.nfl_players.update({
          where: { id: nflPlayerID.id },
          data: { team_key: teamKey.fantasy_team_key },
        });
      }
    }
  } catch (err) {
    return console.log(err);
  }
};

updateFantasyRosters();
