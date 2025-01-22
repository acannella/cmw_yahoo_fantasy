const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const refreshAccessToken = async function (tokenData) {
  const accessTokenDbId = (
    await prisma.config.findFirst({
      where: { key: 'YAHOO_ACCESS_TOKEN' },
    })
  ).config_id;
  await prisma.config.update({
    where: { config_id: accessTokenDbId },
    data: { value: tokenData.access_token },
  });
};

module.exports = refreshAccessToken;
