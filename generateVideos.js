// generateVideos.js
// This script fetches all video IDs from your YouTube playlists and creates videos.json

const fs = require("fs");
const fetch = require("node-fetch"); // Make sure to install node-fetch with npm

// ======= REPLACE THESE WITH YOUR DATA ======= //
const apiKey = "AIzaSyCQF4Xz6SGtuvv4PyiuNxZ0LvgEeZ4A_lc"; // <-- replace this with your actual API key
const playlistIds = [
  "PLOa3aoQF4MhzXYlRoIDqhi20KIM_UI6Rb",
  "PLOa3aoQF4MhzELdVUf4gxQ0X4fQoQX7no",
  "PLOa3aoQF4MhwGTn8mMkJmIbpOIEilnItt",
  "PLOa3aoQF4MhwUdcmkp8ZPe2E8woyQkAw6",
  "PLOa3aoQF4Mhwr3ALm0Wv3eTRXe9ZuRe1k"
];
// ============================================ //

async function fetchPlaylistVideos(playlistId) {
  let videos = [];
  let nextPageToken = "";

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${apiKey}`;
    
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) break;

    // Extract video IDs
    const videoIds = data.items.map(item => item.snippet.resourceId.videoId);
    videos.push(...videoIds);

    nextPageToken = data.nextPageToken || "";
  } while (nextPageToken);

  return videos;
}

(async () => {
  let allVideos = [];

  for (const playlistId of playlistIds) {
    console.log(`Fetching playlist: ${playlistId}`);
    const videos = await fetchPlaylistVideos(playlistId);
    console.log(`Found ${videos.length} videos`);
    allVideos.push(...videos);
  }

  // Remove duplicates
  allVideos = [...new Set(allVideos)];

  // Save to videos.json
  fs.writeFileSync("videos.json", JSON.stringify({ videos: allVideos }, null, 2));
  console.log(`Saved ${allVideos.length} videos to videos.json`);
})();
