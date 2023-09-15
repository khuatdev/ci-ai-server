import fetch from 'node-fetch';

async function searchWikipedia(keyword) {
  try {
    // Encode the keyword for the URL
    const encodedKeyword = encodeURIComponent(keyword);

    // Wikipedia API endpoint for searching
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodedKeyword}&utf8=1`;

    // Make the request to Wikipedia API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Get the first search result
    const firstResult = data.query.search[0];

    if (firstResult) {
      // Extract title and pageid of the first result
      const title = firstResult.title;
      const pageid = firstResult.pageid;

      // Generate the URL based on the pageid
      const url = `https://en.wikipedia.org/wiki?curid=${pageid}`;

      // Return the URL
      return url;
    } else {
      return { error: 'No results found' };
    }
  } catch (error) {
    return { error: error.message };
  }
}

// Example usage:
const keyword = 'Node.js'; // Replace with your desired keyword
searchWikipedia(keyword)
  .then((result) => {
    if (result.error) {
      console.error(`Error: ${result.error}`);
    } else {
      console.log(`URL of the first search result: ${result}`);
    }
  })
  .catch((error) => {
    console.error(`Error: ${error}`);
  });
