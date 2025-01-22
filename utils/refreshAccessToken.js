const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const refreshAccessToken = async function (tokenData) {
  const accessTokenDbId = (
    await prisma.config.findFirst({
      where: { key: 'YAHOO_ACCESS_TOKEN' },
    })
  ).id;
  await prisma.config.update({
    where: { id: accessTokenDbId },
    data: { value: tokenData.access_token },
  });
};

module.exports = refreshAccessToken;
