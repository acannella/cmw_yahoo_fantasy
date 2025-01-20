const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');

const fantasyprosUrl =
  'https://www.fantasypros.com/nfl/reports/leaders/half-ppr.php?';

const writeTopScorersToFile = async function (fileName, dataToWrite) {
  fs.writeFile(
    path.join(
      __dirname,
      `../yahoo_fantasy_data_exports/top_scoring_players_exports/${fileName}`
    ),
    JSON.stringify(dataToWrite),
    (err) => {
      if (err) return console.log(err);
    }
  );
};

const getTopTenScoringPlayers = async function (year, start, end) {
  const $ = await cheerio.fromURL(
    `${fantasyprosUrl}year=${year}&start=${start}&end=${end}`
  );
  const fileName = `week_${start}_to_${end}_year_${year}_top_scorers.json`;

  //Select the first 10 rows in the table which represent the top scorers of the given year and week
  const $rows = $('tr[class*="mpb-player"]:nth-child(-n + 10)');

  const topScoringPlayerData = [];
  $rows.each((index, elem) => {
    const rank = $(elem).find('td.player-rank').text();
    const name = $(elem).find('td.player-label').text().trim();
    const points = $(elem).find('td:last-child').text();
    const playerScore = {
      rank,
      name,
      points,
    };
    topScoringPlayerData.push(playerScore);
  });
  const topScorersObject = {
    year,
    week_start: start,
    week_end: end,
    topScorers: topScoringPlayerData,
  };
  await writeTopScorersToFile(fileName, topScorersObject);
};

getTopTenScoringPlayers(2024, 17, 17);
