const fs = require('fs');
const YahooFantasy = require('yahoo-fantasy');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../config.env') });

//This should be good for development, will probably need to be improved as the project evolves: store tokens in DB vs rewritting config file which seems sketchy long term
const refreshAccessToken = async function (tokenData) {
  fs.readFile(path.join(__dirname, '../config.env'), 'utf-8', (err, data) => {
    if (err) return console.log(err);
    configData = data.split('\r\n').filter((item) => {
      return !item.includes('YAHOO_ACCESS_TOKEN');
    });
    configData.push(`YAHOO_ACCESS_TOKEN=${tokenData.access_token}`);
    fs.writeFile(
      path.join(__dirname, '../config.env'),
      configData.join('\r\n'),
      (err) => {
        if (err) return console.log(err);
      }
    );
  });
};

const writeJSONToFile = async function (fileName, arrayToWrite) {
  fs.writeFile(
    path.join(__dirname, `../yahoo_fantasy_data_exports/${fileName}`),
    JSON.stringify(arrayToWrite),
    (err) => {
      if (err) return console.log(err);
    }
  );
};

const yf = new YahooFantasy(
  process.env.YAHOO_CONSUMER_KEY,
  process.env.YAHOO_CONSUMER_SECRET,
  refreshAccessToken,
  'oob'
);

yf.setRefreshToken(process.env.YAHOO_REFRESH_TOKEN);
yf.setUserToken(process.env.YAHOO_ACCESS_TOKEN);

const game_key = '449';
const league_num = '224437';
const leagueKey = `${game_key}.l.${league_num}`;
const teamKey = '449.l.224437.t.3';

const leagueTeamsToFile = async function (leagueKey) {
  try {
    const leagueTeams = await yf.league.teams(leagueKey);
    const leageTeamArray = [];

    leagueTeams.teams.forEach((team) => {
      const teamObject = {
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

const teamRostersToFile = async function (teamKeys) {
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

const leagueStandingsToFile = async function (leagueKey) {
  const leagueStandingsData = [];
  try {
    const leagueStandingsResponse = await yf.league.standings(leagueKey);
    leagueStandingsResponse.standings.forEach((team) => {
      const leagueStandingsObject = {
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

const transactionsToFile = async function (leagueKey) {
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

const gameWeeksToFile = async function (game_key) {
  try {
    const game_weeks = await yf.game.game_weeks(game_key);
    const gameData = [];
    game_weeks.weeks.forEach((week) => {
      const gameObj = {
        week_number: week.week,
        start: week.start,
        end: week.end,
      };
      gameData.push(gameObj);
    });
    writeJSONToFile('weeks.json', gameData);
  } catch (err) {
    return console.log(err);
  }
};

const matchupsToFile = async function (allTeamKeys) {
  try {
    const matchupsResponse = await yf.teams.fetch(allTeamKeys, 'matchups');
    const matchupData = [];

    matchupsResponse.forEach((yfMatchup) => {
      const teamMatchups = [];
      yfMatchup.matchups.forEach((aMatchup) => {
        const matchupObject = {
          week: aMatchup.week,
          week_start: aMatchup.week_start,
          week_end: aMatchup.week_end,
          winner_team_key: aMatchup.winner_team_key,
          winner_proj_points: aMatchup.teams[0].projected_points.total,
          winner_points: aMatchup.teams[0].points.total,
          loser_team_key: aMatchup.teams[1].team_key,
          loser_proj_points: aMatchup.teams[1].projected_points.total,
          loser_points: aMatchup.teams[1].points.total,
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
    writeJSONToFile('matchups.json', matchupData);
  } catch (err) {
    return console.log(err);
  }
};

/*
TODO: finish get player function: might have to use filters or iteration to get the entire list
*/
const fantasyNFLPlayersToFile = async function (leagueKey) {
  const data = await yf.players.leagues(leagueKey);
  writeJSONToFile('testPlayerResponse.json', data);
};

fantasyNFLPlayersToFile(leagueKey);
// matchUpsToFile(allTeamKeys);
// gameWeeksToFile(game_key);
// leagueTeamsToFile(leagueKey);
// transactionsToFile(leagueKey);
