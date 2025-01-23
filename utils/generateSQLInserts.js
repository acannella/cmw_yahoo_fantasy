const fs = require('fs');
const path = require('path');

const pathToJSON = path.join(
  __dirname,
  '../yahoo_fantasy_data_exports/yahoo_api_exports/'
);

const pathToWrite = path.join(__dirname, '../db_scripts/insert_scripts/');

const generateFantasyWeeksInsertStatements = function () {
  const readFile = `${pathToJSON}weeks.json`;
  const writeFile = `${pathToWrite}insertWeeksData.sql`;
  const statements = [];
  const weeksData = JSON.parse(fs.readFileSync(readFile, 'utf8'));
  weeksData.forEach((weekObject) => {
    const statement = `insert into fantasy_weeks(week_start,week_end,league_key,week_number) values('${weekObject.week_start}','${weekObject.week_end}','${weekObject.league_key}',${weekObject.week_number});`;
    statements.push(statement);
  });
  fs.writeFileSync(writeFile, statements.join('\r\n'));
};

//Single quotes need an additional quote added in order to generate the proper sql statement for that row
const generateFantasyTeamsInsertStatements = function () {
  const readFile = `${pathToJSON}teams.json`;
  const writeFile = `${pathToWrite}insertTeamsData.sql`;
  const statements = [];
  const teamsData = JSON.parse(fs.readFileSync(readFile, 'utf8'));
  teamsData.forEach((teamObject) => {
    const statement = `insert into fantasy_teams(fantasy_team_key,name,league_key,yahoo_fantasy_id,waiver_priority) values('${
      teamObject.team_key
    }','${teamObject.name.replaceAll(`'`, `''`)}','${
      teamObject.league_key
    }',${+teamObject.team_id},${+teamObject.waiver_priority});`;
    statements.push(statement);
  });

  fs.writeFileSync(writeFile, statements.join('\r\n'));
};

const generateFantasyStandingsInsertStatements = function () {
  const readFile = `${pathToJSON}leagueStandings.json`;
  const writeFile = `${pathToWrite}insertLeagueStandingsData.sql`;
  const statements = [];
  const standingsData = JSON.parse(fs.readFileSync(readFile, 'utf8'));
  standingsData.forEach((standingObject) => {
    const wins = +standingObject.standings.outcome_totals.wins;
    const losses = +standingObject.standings.outcome_totals.wins;
    const ties = +standingObject.standings.outcome_totals.wins;
    const rank = +standingObject.standings.rank;
    const playOffSeed = +standingObject.standings.playoff_seed;
    const pointsAgainst =
      Math.round(+standingObject.standings.points_against * 100) / 100;
    const pointsFor =
      Math.round(+standingObject.standings.points_for * 100) / 100;
    const statement = `insert into league_standings(league_key,team_key,wins,losses,ties,rank,playoff_seed,points_for,points_against) values('${standingObject.league_key}','${standingObject.team_key}',${wins},${losses},${ties},${rank},${playOffSeed},${pointsFor},${pointsAgainst});`;
    statements.push(statement);
  });

  fs.writeFileSync(writeFile, statements.join('\r\n'));
};

const generateFantasyMatchupsInsertStatements = function () {
  const readFile = `${pathToJSON}matchups.json`;
  const writeFile = `${pathToWrite}insertMatchupsData.sql`;
  const statements = [];
  const matchupsData = JSON.parse(fs.readFileSync(readFile, 'utf8'));
  matchupsData.forEach((teamMatchupsObject) => {
    teamMatchupsObject.matchups.forEach((matchup) => {
      const teamKey = teamMatchupsObject.team_key;
      //slice the .t.teamId off teamKey to get leagueKey
      const leagueKey = teamKey.slice(
        0,
        -(teamKey.length - (teamKey.indexOf('t') - 1))
      );
      const week = +matchup.week;
      const winnerTeamKey = matchup.winner_team_key;
      const loserTeamKey = matchup.loser_team_key;
      const winnerProjPoints =
        Math.round(+matchup.winner_proj_points * 100) / 100;
      const winnerPoints = Math.round(+matchup.winner_points * 100) / 100;
      const loserProjPoints =
        Math.round(+matchup.loser_proj_points * 100) / 100;
      const loserPoints = Math.round(+matchup.loser_points * 100) / 100;
      const statement = `insert into matchups(league_key,week,winner_team_key,winner_proj_points,winner_points,loser_team_key,loser_proj_points,loser_points,team_key) values('${leagueKey}',${week},'${winnerTeamKey}',${winnerProjPoints},${winnerPoints},'${loserTeamKey}',${loserProjPoints},${loserPoints},'${teamKey}');`;
      statements.push(statement);
    });
  });
  fs.writeFileSync(writeFile, statements.join('\r\n'));
};

const generateNflPlayersInsertStatements = function () {
  const readFile = `${pathToJSON}allPlayers.json`;
  const writeFile = `${pathToWrite}insertNflPlayersData.sql`;
  const statements = [];
  const nflPlayersData = JSON.parse(fs.readFileSync(readFile, 'utf8'));
  nflPlayersData.players.forEach((nflPlayerObject) => {
    const leagueKey = nflPlayersData.league_key;
    const playerKey = nflPlayerObject.player_key;
    const playerID = +nflPlayerObject.player_id;
    const playerName = nflPlayerObject.player_name.replaceAll(`'`, `''`);
    const nflTeamName = nflPlayerObject.nfl_team_name;
    const uniformNumber = +nflPlayerObject.uniform_number;
    const displayPosition = nflPlayerObject.display_position;
    const isUndroppable = nflPlayerObject.is_undroppable === '0' ? false : true;
    const eligiblePositions = nflPlayerObject.eligible_positions;
    const statement = `insert into nfl_players (player_key,league_key,player_name,nfl_team_name,uniform_number,display_position,is_undroppable,eligible_positions,player_id)
	values ('${playerKey}','${leagueKey}','${playerName}','${nflTeamName}',${uniformNumber},'${displayPosition}',${isUndroppable},'{${eligiblePositions}}',${playerID});`;
    statements.push(statement);
  });
  fs.writeFileSync(writeFile, statements.join('\r\n'));
};

// generateFantasyWeeksInsertStatements();
// generateFantasyTeamsInsertStatements();
// generateFantasyStandingsInsertStatements();
// generateFantasyMatchupsInsertStatements();
// generateNflPlayersInsertStatements();
