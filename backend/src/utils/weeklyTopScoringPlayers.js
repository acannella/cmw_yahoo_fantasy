const fs = require('fs');
const path = require('path');
const fantasyTeamNamesMap = require('./fantasyTeamNamesMap');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const cheerio = require('cheerio');

const fantasyprosUrl =
  'https://www.fantasypros.com/nfl/reports/leaders/half-ppr.php?';

const writeTopScorersToFile = async function (year) {
  try {
    const pathToWrite = path.join(__dirname, '../db_scripts/insert_scripts/');
    const writeFile = `${pathToWrite}insertTopScoringPlayersData.sql`;
    const topScoringPlayersWithOwners = [];
    const fantasyTeams = await fantasyTeamNamesMap();
    for (let i = 1; i <= 17; i++) {
      const topScoringPlayers = await getTopTenScoringPlayers(year, i, i);
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
                await prisma.rosters.findFirst({
                  where: {
                    OR: [
                      {
                        player_name: player.name,
                      },
                      {
                        player_name: nameNoSuffix,
                      },
                    ],
                  },
                  select: { team_key: true },
                })
              )?.team_key;
              break;
            }
          }
        } else {
          managerTeamKey = (
            await prisma.rosters.findFirst({
              where: {
                player_name: player.name,
              },
              select: { team_key: true },
            })
          )?.team_key;
        }
        const managerTeamName =
          managerTeamKey === undefined
            ? 'Free Agent'
            : fantasyTeams.get(managerTeamKey);
        topScoringPlayersWithOwners.push({
          playerRank: player.rank,
          playerName: player.name,
          points: player.points,
          managerTeamName,
          week: i,
        });
      }
    }
    const statements = [];
    topScoringPlayersWithOwners.forEach((player) => {
      const statement = `insert into top_scoring_players(rank,player_name,points,manager,week) values(${+player.playerRank},'${player.playerName.replaceAll(
        `'`,
        `''`
      )}',${+player.points},'${player.managerTeamName.replaceAll(
        `'`,
        `''`
      )}',${+player.week});`;
      statements.push(statement);
    });
    fs.writeFileSync(writeFile, statements.join('\r\n'));
  } catch (err) {
    return console.log(err);
  }
};

writeTopScorersToFile();

const getTopTenScoringPlayers = async function (year, start, end) {
  const $ = await cheerio.fromURL(
    `${fantasyprosUrl}year=${year}&start=${start}&end=${end}`
  );

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
  return topScoringPlayerData;
};

module.exports = getTopTenScoringPlayers;
