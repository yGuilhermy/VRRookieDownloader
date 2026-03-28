import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchGameImage(fullTitle: string, postImageUrl?: string): Promise<string | null> {
  // 1. Prioritize image from the forum post
  if (postImageUrl && (postImageUrl.startsWith('http') || postImageUrl.startsWith('//'))) {
    return postImageUrl.startsWith('//') ? `https:${postImageUrl}` : postImageUrl;
  }

  // Strip anything between [ ] and trim for external APIs
  const cleanTitle = fullTitle.replace(/\[.*?\]/g, '').trim();
  
  try {
    // 2. SteamGridDB
    const apiKey = process.env.STEAMGRIDDB_API_KEY;
    if (apiKey) {
      const searchRes = await axios.get(`https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(cleanTitle)}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      if (searchRes.data?.data?.[0]) {
        const gameId = searchRes.data.data[0].id;
        const gridRes = await axios.get(`https://www.steamgriddb.com/api/v2/grids/game/${gameId}`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (gridRes.data?.data?.[0]?.url) {
          return gridRes.data.data[0].url;
        }
      }
    }
    
    // 3. Fallback: Steam web search
    const searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(cleanTitle)}`;
    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);
    
    const firstResultImg = $('#search_resultsRows a:first-child .search_capsule img').attr('src');
    if (firstResultImg) {
      return firstResultImg.split('?')[0];
    }
    
    return null;
  } catch (err) {
    console.error('Failed to fetch image for', cleanTitle, err);
    return null;
  }
}
