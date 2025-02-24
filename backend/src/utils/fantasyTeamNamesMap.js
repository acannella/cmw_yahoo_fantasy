const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fantasyTeamsNameMap = async function () {
  const fantasyTeams = new Map();
  const fantasyTeamsData = await prisma.fantasy_teams.findMany({
    where: { NOT: { fantasy_team_key: 'FA' } },
    select: { fantasy_team_key: true, name: true },
  });
  fantasyTeamsData.forEach((team) => {
    fantasyTeams.set(team.fantasy_team_key, team.name);
  });
  return fantasyTeams;
};

module.exports = fantasyTeamsNameMap;
