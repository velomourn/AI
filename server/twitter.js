import { TwitterApi } from 'twitter-api-v2';

export function getTwitterClient(accessToken, accessSecret) {
  return new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken,
    accessSecret,
  });
}