const { PrismaClient } = require('@prisma/client');
const initYahooFantasy = require('./initYahooFantasy');
const leagueQueries = require('../src/queries/leagueQueries');

const prisma = new PrismaClient();

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

const _updateFantasyRosters = async function () {
  try {
    const yf = await initYahooFantasy();
    const { teamKeys } = await leagueQueries.getLeagueMetadata();
    for (const teamKey of teamKeys) {
      const teamRoster = (await yf.roster.fetch(teamKey)).roster;
      for (let i = 0; i < teamRoster.length; i++) {
        const playerName =
          teamRoster[i].display_position === 'DEF'
            ? teamRoster[i].editorial_team_full_name
            : teamRoster[i].name.full;
        const updateData = {
          player_key: teamRoster[i].player_key,
          name: playerName,
          team: teamRoster[i].editorial_team_abbr,
          bye_week: teamRoster[i].bye_weeks.week,
          pos: teamRoster[i].selected_position,
        };
        const recordID = (
          await prisma.rosters.findFirst({
            where: { team_key: teamKey, display_number: i + 1 },
          })
        ).id;
        await prisma.rosters.update({
          where: { id: recordID },
          data: {
            roster_position: updateData.pos,
            player_name: updateData.name,
            nfl_team: updateData.team,
            bye_week: +updateData.bye_week,
            display_number: i + 1,
            player_key: updateData.player_key,
          },
        });
        //Now you need logic to null out any roster records that exist in the Db but are not in yahoo
        //As an example, if I had a full roster, then dropped all my players, this update function would not fix that
      }
    }
  } catch (err) {
    return console.log(err);
  }
};

_updateFantasyRosters();
