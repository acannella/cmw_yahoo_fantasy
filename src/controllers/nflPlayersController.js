const { PrismaClient } = require('@prisma/client');
const initYahooFantasy = require('../../utils/initYahooFantasy');
const getTopTenScoringPlayers = require('../../utils/weeklyTopScoringPlayers');
const getLeagueMetadata = require('../../utils/getLeagueMetadata');

const prisma = new PrismaClient();

/**
 * Get all player keys for each team in the league
 * @returns {[object]} Array of objects containing the teamKey and an array of playerKeys for that team
 */
const getAllFantasyRosters = async function () {
  try {
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
  } catch (err) {
    return console.log(err);
  }
};

/**
 *
 * @param {number} year - Four digit year that you want to get the data for
 * @param {number} weekStart - First week you want to pull data for
 * @param {number} weekEnd - Last week you want to pull data for
 * @returns {[object]} Array of objects containing playerRank,playerName,points scored, and manager name for the supplied year and weeks
 */
const getTopTenScoringPlayersAndOwnership = async function (
  year,
  weekStart,
  weekEnd
) {
  try {
    const topScoringPlayersWithOwners = [];
    const leagueMetadata = await getLeagueMetadata();
    const topScoringPlayers = await getTopTenScoringPlayers(
      year,
      weekStart,
      weekEnd
    );
    for (const player of topScoringPlayers) {
      const suffixes = ['Jr.', 'Sr.', 'II'];
      let managerTeamKey;
      /*
      If a player has a suffix in their name in fantasy pros, there's a chance the name doesn't have a suffix in yahoo.
      In that scenario, we try to SELECT on the name with the suffix and wihout
      */
      if (suffixes.some((suffix) => player.name.includes(suffix))) {
        for (const suffix of suffixes) {
          if (player.name.includes(suffix)) {
            const nameNoSuffix = player.name
              .slice(0, player.name.indexOf(suffix))
              .trim();
            managerTeamKey = (
              await prisma.nfl_players.findFirst({
                where: {
                  OR: [
                    {
                      player_name: player.name,
                      league_key: leagueMetadata.leagueKey,
                    },
                    {
                      player_name: nameNoSuffix,
                      league_key: leagueMetadata.leagueKey,
                    },
                  ],
                },
                select: { team_key: true },
              })
            ).team_key;
            break;
          }
        }
      } else {
        managerTeamKey = (
          await prisma.nfl_players.findFirst({
            where: {
              player_name: player.name,
              league_key: leagueMetadata.leagueKey,
            },
            select: { team_key: true },
          })
        ).team_key;
      }
      const managerTeamName = (
        await prisma.fantasy_teams.findFirst({
          where: {
            fantasy_team_key: managerTeamKey,
            league_key: leagueMetadata.leagueKey,
          },
          select: { name: true },
        })
      ).name;
      topScoringPlayersWithOwners.push({
        playerRank: player.rank,
        playerName: player.name,
        points: player.points,
        managerTeamName,
      });
    }
    return topScoringPlayersWithOwners;
  } catch (err) {
    return console.log(err);
  }
};

/**
 * Loop through each team in the league, get the rosters from yahoo and the database, and compare them.
 * If the rosters are the same, move on to the next team. If they are not, treat yahoo's roster as the source of truth.
 * Set the teamKey to FA if a player is in the rosterDB that is not in yahoo.
 * Set the player teamKeys in yahoo's roster to the current teamKey, so the two rosters are back in sync.
 */
const updateFantasyRosters = async function () {
  try {
    const yf = await initYahooFantasy();
    const leagueMetadata = await getLeagueMetadata();
    //Loop through all teams for the leagueKey
    for (const teamKey of leagueMetadata.teamKeys) {
      //Get playerKeys from the response from yahoo this is the current roster for the teamKey
      const yahooRosterPlayers = (await yf.team.roster(teamKey)).roster.map(
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
