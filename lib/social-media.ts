import { TwitterApi } from 'twitter-api-v2';

function getTwitterClient() {
  const appKey = process.env.TWITTER_API_KEY;
  const appSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    throw new Error('Missing Twitter API credentials');
  }

  return new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  });
}

export interface SocialPost {
  text: string;
  media?: string[];
  platforms: ('twitter' | 'facebook' | 'instagram')[];
}


// --------------------
// TWITTER / X
// --------------------
export async function postToTwitter(post: SocialPost) {
  try {
    const client = getTwitterClient().readWrite;

    if (post.media && post.media.length > 0) {
      const mediaIds = await Promise.all(
        post.media.map(async (mediaUrl) => {
          const response = await fetch(mediaUrl);
          const buffer = Buffer.from(await response.arrayBuffer());

          const mediaId = await client.v1.uploadMedia(buffer, {
            mimeType: 'image/png',
          });

          return mediaId;
        })
      );

      const tweet = await client.v2.tweet(post.text, {
        media: {
          media_ids: mediaIds.slice(0, 4) as any,
        },
      });

      return {
        success: true,
        tweetId: tweet.data.id,
        platform: 'twitter',
      };
    } else {
      const tweet = await client.v2.tweet(post.text);

      return {
        success: true,
        tweetId: tweet.data.id,
        platform: 'twitter',
      };
    }
  } catch (error) {
    console.error('Twitter error:', error);

    return {
      success: false,
      error: 'Failed to post to Twitter',
      platform: 'twitter',
    };
  }
}


// --------------------
// FACEBOOK
// --------------------
export async function postToFacebook(post: SocialPost) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!accessToken || !pageId) {
    return {
      success: false,
      error: 'Missing Facebook credentials',
      platform: 'facebook',
    };
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;

    if (post.media && post.media.length > 0) {
      const photoUrl = `https://graph.facebook.com/v18.0/${pageId}/photos`;

      const response = await fetch(photoUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: post.media[0],
          caption: post.text,
          access_token: accessToken,
        }),
      });

      const data = await response.json();

      return {
        success: true,
        postId: data.id,
        platform: 'facebook',
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: post.text,
        access_token: accessToken,
      }),
    });

    const data = await response.json();

    return {
      success: true,
      postId: data.id,
      platform: 'facebook',
    };
  } catch (error) {
    console.error('Facebook error:', error);

    return {
      success: false,
      error: 'Failed to post to Facebook',
      platform: 'facebook',
    };
  }
}


// --------------------
// INSTAGRAM
// --------------------
export async function postToInstagram(post: SocialPost) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const instagramAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !instagramAccountId) {
    return {
      success: false,
      error: 'Missing Instagram credentials',
      platform: 'instagram',
    };
  }

  try {
    if (!post.media || post.media.length === 0) {
      return {
        success: false,
        error: 'Instagram requires media',
        platform: 'instagram',
      };
    }

    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: post.media[0],
          caption: post.text,
          access_token: accessToken,
        }),
      }
    );

    const containerData = await containerResponse.json();

    if (containerData.error) {
      throw new Error(containerData.error.message);
    }

    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishResponse.json();

    return {
      success: true,
      postId: publishData.id,
      platform: 'instagram',
    };
  } catch (error) {
    console.error('Instagram error:', error);

    return {
      success: false,
      error: 'Failed to post to Instagram',
      platform: 'instagram',
    };
  }
}


// --------------------
// MULTI-PLATFORM POSTING (FIXED)
// --------------------
export async function postToSocialMedia(post: SocialPost) {
  const results = await Promise.allSettled([
    post.platforms.includes('twitter')
      ? postToTwitter(post)
      : Promise.resolve(null),

    post.platforms.includes('facebook')
      ? postToFacebook(post)
      : Promise.resolve(null),

    post.platforms.includes('instagram')
      ? postToInstagram(post)
      : Promise.resolve(null),
  ]);

  return results
    .filter(
      (result) =>
        result.status === 'fulfilled' &&
        result.value !== null
    )
    .map((result) =>
      result.status === 'fulfilled' ? result.value : null
    )
    .filter(Boolean);
}