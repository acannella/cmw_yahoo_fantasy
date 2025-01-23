const fs = require('fs');
const YahooFantasy = require('yahoo-fantasy');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const refreshAccessToken = require('./refreshAccessToken.js');

const initYahooFantasy = async function () {
  const prisma = new PrismaClient();

  const yahooConsumerKey = (
    await prisma.config.findFirst({
      where: { key: 'YAHOO_CONSUMER_KEY' },
    })
  ).value;

  const yahooConsumerSecret = (
    await prisma.config.findFirst({
      where: { key: 'YAHOO_CONSUMER_SECRET' },
    })
  ).value;

  const yahooRefreshToken = (
    await prisma.config.findFirst({
      where: { key: 'YAHOO_REFRESH_TOKEN' },
    })
  ).value;

  const yahooAccessToken = (
    await prisma.config.findFirst({
      where: { key: 'YAHOO_ACCESS_TOKEN' },
    })
  ).value;

  //Per yahoo's api, use oob when there isn't a redirect uri
  const redirectURI = 'oob';

  const yf = new YahooFantasy(
    yahooConsumerKey,
    yahooConsumerSecret,
    refreshAccessToken,
    redirectURI
  );

  yf.setRefreshToken(yahooRefreshToken);
  yf.setUserToken(yahooAccessToken);

  return yf;
};

const writeJSONToFile = async function (fileName, dataToWrite) {
  const writePath = path.join(
    __dirname,
    `../yahoo_fantasy_data_exports/yahoo_api_exports/${fileName}`
  );
  fs.writeFile(writePath, JSON.stringify(dataToWrite), (err) => {
    if (err) return console.log(err);
  });
};

const leagueTeamsToFile = async function (yf, leagueKey) {
  try {
    const leagueTeams = await yf.league.teams(leagueKey);
    const leageTeamArray = [];

    leagueTeams.teams.forEach((team) => {
      const teamObject = {
        league_key: leagueKey,
        team_key: team.team_key,
        team_id: team.team_id,
        name: team.name,
        waiver_priority: team.waiver_priority,
      };
      leageTeamArray.push(teamObject);
    });

    await writeJSONToFile('teams.json', leageTeamArray);
  } catch (e) {
    return console.log(e);
  }
};

const teamRostersToFile = async function (yf, teamKeys) {
  const prunedRosterData = [];
  try {
    for (const teamKey of teamKeys) {
      const fullRosterData = await yf.team.roster(teamKey);
      const trimmedTeamRoster = [];
      fullRosterData.roster.forEach((player) => {
        const playerObject = {
          player_key: player.player_key,
          player_id: player.player_id,
          full_name: player.name.full,
          nfl_team_name: player.editorial_team_full_name,
          uniform_number: player.uniform_number,
          display_position: player.display_position,
          is_undroppable: player.is_undroppable,
          position_type: player.position_type,
          eligible_positions: player.eligible_positions,
        };
        trimmedTeamRoster.push(playerObject);
      });
      const teamRosterObject = {
        team_key: fullRosterData.team_key,
        team_id: fullRosterData.team_id,
        fantasy_team_name: fullRosterData.name,
        trimmedTeamRoster,
      };
      prunedRosterData.push(teamRosterObject);
    }
    await writeJSONToFile('teamRosters.json', prunedRosterData);
  } catch (e) {
    return console.log(e);
  }
};

const leagueStandingsToFile = async function (yf, leagueKey) {
  const leagueStandingsData = [];
  try {
    const leagueStandingsResponse = await yf.league.standings(leagueKey);
    leagueStandingsResponse.standings.forEach((team) => {
      const leagueStandingsObject = {
        league_key: leagueStandingsResponse.league_key,
        team_key: team.team_key,
        team_id: team.team_id,
        team_name: team.name,
        standings: team.standings,
      };
      leagueStandingsData.push(leagueStandingsObject);
    });

    await writeJSONToFile('leagueStandings.json', leagueStandingsData);
  } catch (e) {
    return console.log(e);
  }
};

const transactionsToFile = async function (yf, leagueKey) {
  try {
    const transactionsResponse = await yf.league.transactions(leagueKey);
    const prunedTransactions = [];
    const transactionsData = [];

    transactionsResponse.transactions.forEach((transactionEntry) => {
      //There are a few transactions in the response without players for some reason, skip those.
      if (transactionEntry.players.length === 0) {
        return;
      }
      const transactionPlayers = [];
      transactionEntry.players.forEach((player) => {
        const playerObject = {
          player_key: player.player_key,
          player_id: player.player_id,
          player_name: player.name.full,
          display_position: player.display_position,
          action: player.transaction.type,
          source_type: player.transaction.source_type,
          source_team_key: player.transaction.source_team_key,
          source_team_name: player.transaction.source_team_name,
          destination_type: player.transaction.destination_type,
          destination_team_key: player.transaction.destination_team_key,
          destination_team_name: player.transaction.destination_team_name,
        };
        transactionPlayers.push(playerObject);
      });
      const prunedTransactionObject = {
        transaction_key: transactionEntry.transaction_key,
        transaction_id: transactionEntry.transaction_id,
        type: transactionEntry.type,
        timestamp: transactionEntry.timestamp,
        players_in_transaction: transactionPlayers,
      };
      prunedTransactions.push(prunedTransactionObject);
    });
    const transactionsObject = {
      league_key: transactionsResponse.league_key,
      league_id: transactionsResponse.league_id,
      league_transactions: prunedTransactions,
    };

    transactionsData.push(transactionsObject);
    await writeJSONToFile('allTransactions.json', transactionsData);
  } catch (err) {
    return console.log(err);
  }
};

const gameWeeksToFile = async function (yf, leagueKey) {
  try {
    const gameKey = leagueKey.split('.')[0];
    const game_weeks = await yf.game.game_weeks(gameKey);
    const gameData = [];
    game_weeks.weeks.forEach((week) => {
      const gameObj = {
        league_key: leagueKey,
        week_number: week.week,
        week_start: week.start,
        week_end: week.end,
      };
      gameData.push(gameObj);
    });
    await writeJSONToFile('weeks.json', gameData);
  } catch (err) {
    return console.log(err);
  }
};

const matchupsToFile = async function (yf, allTeamKeys) {
  try {
    const matchupsResponse = await yf.teams.fetch(allTeamKeys, 'matchups');
    const matchupData = [];

    matchupsResponse.forEach((yfMatchup) => {
      const teamMatchups = [];
      yfMatchup.matchups.forEach((aMatchup) => {
        const winnerIndex =
          aMatchup.winner_team_key === yfMatchup.team_key ? 0 : 1;
        const loserIndex = winnerIndex === 0 ? 1 : 0;
        const matchupObject = {
          week: aMatchup.week,
          week_start: aMatchup.week_start,
          week_end: aMatchup.week_end,
          winner_team_key: aMatchup.winner_team_key,
          winner_proj_points:
            aMatchup.teams[winnerIndex].projected_points.total,
          winner_points: aMatchup.teams[winnerIndex].points.total,
          loser_team_key: aMatchup.teams[loserIndex].team_key,
          loser_proj_points: aMatchup.teams[loserIndex].projected_points.total,
          loser_points: aMatchup.teams[loserIndex].points.total,
        };
        teamMatchups.push(matchupObject);
      });
      const fullMatchupObject = {
        team_key: yfMatchup.team_key,
        team_id: yfMatchup.team_id,
        name: yfMatchup.name,
        matchups: teamMatchups,
      };
      matchupData.push(fullMatchupObject);
    });
    await writeJSONToFile('matchups.json', matchupData);
  } catch (err) {
    return console.log(err);
  }
};

//Players get pulled in increments of 25. Will loop until all players are written to file
const fantasyNflPlayersToFile = async function (yf, leagueKey) {
  const playersArray = [];
  let allPlayersPulled = false;
  let startAt = 0;
  const nflPlayerLeagueRosterObject = {
    league_key: '',
    players: playersArray,
  };

  while (!allPlayersPulled) {
    const yfPlayerResponse = (
      await yf.players.leagues(leagueKey, { start: startAt })
    )[0]; //Json is in the first array index since it came from the collection
    if (yfPlayerResponse.players.length === 0) {
      nflPlayerLeagueRosterObject.league_key = yfPlayerResponse.league_key;
      allPlayersPulled = true;
      continue;
    }
    yfPlayerResponse.players.forEach((player) => {
      const playerObject = {
        player_key: player.player_key,
        player_id: player.player_id,
        player_name: player.name.full,
        nfl_team_name: player.editorial_team_full_name,
        display_position: player.display_position,
        is_undroppable: player.is_undroppable,
        eligible_positions: player.eligible_positions,
      };
      playersArray.push(playerObject);
    });
    startAt += 25;
  }

  await writeJSONToFile('allPlayers.json', nflPlayerLeagueRosterObject);
};

const main = async function () {
  const allTeamKeys = [
    '449.l.224437.t.1',
    '449.l.224437.t.2',
    '449.l.224437.t.3',
    '449.l.224437.t.4',
    '449.l.224437.t.5',
    '449.l.224437.t.6',
    '449.l.224437.t.7',
    '449.l.224437.t.8',
    '449.l.224437.t.9',
    '449.l.224437.t.10',
    '449.l.224437.t.11',
    '449.l.224437.t.12',
  ];
  const game_key = '449';
  const league_num = '224437';
  const leagueKey = `${game_key}.l.${league_num}`;
  const teamKey = '449.l.224437.t.3';
  yf = await initYahooFantasy();

  await fantasyNflPlayersToFile(yf, leagueKey);
  // await matchupsToFile(yf, allTeamKeys);
  // await gameWeeksToFile(yf, leagueKey);
  // await leagueTeamsToFile(yf, leagueKey);
  // await transactionsToFile(yf, leagueKey);
  // await leagueStandingsToFile(yf, leagueKey);
};

main().then((res) => {
  console.log(res);
});
