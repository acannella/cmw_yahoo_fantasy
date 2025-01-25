const { PrismaClient } = require('@prisma/client');
const initYahooFantasy = require('../../utils/initYahooFantasy');

const prisma = new PrismaClient();

//Get league related data that will be used for most queries: most recent leaguekey, gamekey, and teamkeys
const getLeagueMetadata = async function () {
  try {
    const gameKey = (
      await prisma.league_metadata.aggregate({
        _max: { game_key: true },
      })
    )._max.game_key;

    const leagueKey = (
      await prisma.league_metadata.findFirst({
        where: { game_key: gameKey },
      })
    ).league_key;

    const teamKeys = (
      await prisma.fantasy_teams.findMany({
        where: { league_key: leagueKey },
        where: { fantasy_team_key: { not: 'FA' } },
        select: { fantasy_team_key: true },
      })
    ).map((teamKeyObj) => teamKeyObj.fantasy_team_key);

    return { gameKey, leagueKey, teamKeys };
  } catch (err) {
    return console.log(err);
  }
};

const getAllFantasyRosters = async function () {
  const leagueMetadata = await getLeagueMetadata();
  const allFantasyRosters = [];
  for (const teamKey of leagueMetadata.teamKeys) {
    const teamRosterPlayerKeys = (
      await prisma.nfl_players.findMany({
        where: { team_key: teamKey, league_key: leagueMetadata.leagueKey },
        select: { player_key: true },
      })
    ).map((player) => player.player_key);
    const teamRoster = { teamKey, teamRosterPlayerKeys };
    allFantasyRosters.push(teamRoster);
  }
  return allFantasyRosters;
};

const updateFantasyRosters = async function () {
  try {
    const yf = await initYahooFantasy();
    const leagueMetadata = await getLeagueMetadata();
    //Loop through all teams for the leagueKey
    for (const teamKey of leagueMetadata.teamKeys) {
      const yahooRosterObj = await yf.team.roster(teamKey);
      //Get playerKeys from the response from yahoo this is the current roster for the teamKey
      const yahooRosterPlayers = yahooRosterObj.roster.map(
        (player) => player.player_key
      );
      //Get playerKeys for the players associated to the teamKey in the DB
      const rosterInDB = (
        await prisma.nfl_players.findMany({
          where: {
            league_key: leagueMetadata.league_key,
            team_key: teamKey,
          },
          select: { player_key: true },
        })
      ).map((playerKeyObj) => playerKeyObj.player_key);
      //If rosters in the db and yahoo are the same, move to the next team
      if (
        rosterInDB.length === yahooRosterPlayers.length &&
        rosterInDB.every((player) => yahooRosterPlayers.includes(player))
      ) {
        continue;
      }

      for (const playerKey of rosterInDB) {
        //If a playerKey in the DB is not in the data from yahoo, set the player record teamKey to 'FA' which removes them from the roster in the DB.
        if (!yahooRosterPlayers.includes(playerKey)) {
          const nflPlayerID = await prisma.nfl_players.findFirst({
            where: {
              player_key: playerKey,
              league_key: leagueMetadata.leagueKey,
            },
            select: { id: true },
          });
          await prisma.nfl_players.update({
            where: { id: nflPlayerID.id },
            data: { team_key: 'FA' },
          });
        }
      }
      //Get playerID from the yahoo roster, update the player in the DB to have the teamKey, adding them to the roster
      for (const player of yahooRosterPlayers) {
        const nflPlayerID = await prisma.nfl_players.findFirst({
          where: {
            player_key: player,
            league_key: leagueMetadata.leagueKey,
          },
          select: { id: true },
        });

        await prisma.nfl_players.update({
          where: { id: nflPlayerID.id },
          data: { team_key: teamKey },
        });
      }
    }
  } catch (err) {
    return console.log(err);
  }
};
