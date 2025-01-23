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

// generateFantasyWeeksInsertStatements();
generateFantasyTeamsInsertStatements();
