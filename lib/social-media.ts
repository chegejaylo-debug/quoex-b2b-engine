import { TwitterApi } from 'twitter-api-v2';

// Twitter/X Client
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export interface SocialPost {
  text: string;
  media?: string[];
  platforms: ('twitter' | 'facebook' | 'instagram')[];
}

// Post to Twitter/X
export async function postToTwitter(post: SocialPost) {
  try {
    const client = twitterClient.readWrite;
    
    if (post.media && post.media.length > 0) {
      // Upload media first
      const mediaIds = await Promise.all(
        post.media.map(async (mediaUrl) => {
          const response = await fetch(mediaUrl);
          const buffer = Buffer.from(await response.arrayBuffer());
          const mediaId = await client.v1.uploadMedia(buffer, { mimeType: 'image/png' });
          return mediaId;
        })
      );
      
      const tweet = await client.v2.tweet(post.text, { media: { media_ids: mediaIds } });
      return { success: true, tweetId: tweet.data.id, platform: 'twitter' };
    } else {
      const tweet = await client.v2.tweet(post.text);
      return { success: true, tweetId: tweet.data.id, platform: 'twitter' };
    }
  } catch (error) {
    console.error('Twitter error:', error);
    return { success: false, error: 'Failed to post to Twitter', platform: 'twitter' };
  }
}

// Post to Facebook (using Graph API)
export async function postToFacebook(post: SocialPost) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN!;
  const pageId = process.env.FACEBOOK_PAGE_ID!;

  try {
    const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
    const body = {
      message: post.text,
      access_token: accessToken,
    };

    if (post.media && post.media.length > 0) {
      // For Facebook, we need to upload photos first
      const photoUrl = `https://graph.facebook.com/v18.0/${pageId}/photos`;
      const photoBody = {
        url: post.media[0],
        caption: post.text,
        access_token: accessToken,
      };
      
      const response = await fetch(photoUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoBody),
      });
      
      const data = await response.json();
      return { success: true, postId: data.id, platform: 'facebook' };
    } else {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      return { success: true, postId: data.id, platform: 'facebook' };
    }
  } catch (error) {
    console.error('Facebook error:', error);
    return { success: false, error: 'Failed to post to Facebook', platform: 'facebook' };
  }
}

// Post to Instagram (using Graph API)
export async function postToInstagram(post: SocialPost) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN!;
  const instagramAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!;

  try {
    if (!post.media || post.media.length === 0) {
      return { success: false, error: 'Instagram requires media', platform: 'instagram' };
    }

    // Step 1: Create a container
    const containerUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media`;
    const containerBody = {
      image_url: post.media[0],
      caption: post.text,
      access_token: accessToken,
    };

    const containerResponse = await fetch(containerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(containerBody),
    });
    
    const containerData = await containerResponse.json();
    
    if (containerData.error) {
      throw new Error(containerData.error.message);
    }

    // Step 2: Publish the container
    const publishUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`;
    const publishBody = {
      creation_id: containerData.id,
      access_token: accessToken,
    };

    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publishBody),
    });
    
    const publishData = await publishResponse.json();
    
    return { success: true, postId: publishData.id, platform: 'instagram' };
  } catch (error) {
    console.error('Instagram error:', error);
    return { success: false, error: 'Failed to post to Instagram', platform: 'instagram' };
  }
}

// Post to multiple platforms
export async function postToSocialMedia(post: SocialPost) {
  const results = await Promise.allSettled([
    post.platforms.includes('twitter') ? postToTwitter(post) : Promise.resolve(null),
    post.platforms.includes('facebook') ? postToFacebook(post) : Promise.resolve(null),
    post.platforms.includes('instagram') ? postToInstagram(post) : Promise.resolve(null),
  ]);

  return results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled' && result.value !== null)
    .map((result) => result.value);
}
