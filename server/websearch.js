import axios from 'axios';

export async function webSearch(query) {
  const apiKey = process.env.SERPAPI_KEY;
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}`;
  try {
    const response = await axios.get(url);
    const results = response.data.organic_results?.slice(0, 3) || [];
    return results.map(r => `Title: ${r.title}\nLink: ${r.link}\nSnippet: ${r.snippet}\n`).join('\n');
  } catch (e) {
    return `Web search error: ${e.message}`;
  }
}