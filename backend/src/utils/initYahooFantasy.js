const YahooFantasy = require('yahoo-fantasy');
const { PrismaClient } = require('@prisma/client');

const refreshAccessToken = require('./refreshAccessToken');

const prisma = new PrismaClient();

const initYahooFantasy = async function () {
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

module.exports = initYahooFantasy;
