const { PrismaClient } = require('@prisma/client');
const initYahooFantasy = require('./initYahooFantasy');
const leagueQueries = require('../src/queries/leagueQueries');

const prisma = new PrismaClient();

/**
 * Update rosters in the DB to match the rosters in Yahoo
 */

const updateFantasyRosters = async function () {
  try {
    const yf = await initYahooFantasy();
    const { teamKeys } = await leagueQueries.getLeagueMetadata();
    for (const teamKey of teamKeys) {
      //Step 1: Null the player_name column of all records for the team to set roster to an 'empty' state
      const recordIDs = await prisma.rosters.findMany({
        where: { team_key: teamKey },
        select: { id: true },
      });
      for (const record of recordIDs) {
        await prisma.rosters.update({
          where: { id: record.id },
          data: { player_name: null },
        });
      }
      //Step 2: Update the team's roster records with data from yahoo to put them both in sync
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
      }
    }
  } catch (err) {
    return console.log(err);
  }
};
