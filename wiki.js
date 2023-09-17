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

export const additonalData = async (jsonString) => {
  const json = JSON.parse(jsonString);
  const listChildren = json.children;
  const newChildren = [];
  for (let i = 0; i < listChildren.length; i++) {
    const child = listChildren[i];
    if (child.ref_url == '' || child.ref_url == "#") {
      const url = await searchWikipedia(child.name);
      if (url.error) {
        console.log(url.error);
        child.ref_url = "#";
      } else {
        child.ref_url = url;
      }
    }
    if (child.children) {
      const res = await additonalData(JSON.stringify(child));
      if (res.error) {
        console.log(res.error);
      }
    }
    newChildren.push(child);
  }
  json.children = newChildren;
  return json;
}

// Example usage:
const sampleJson= `
  {
    "keywords": [
      {
        "keyword": "orthogonalization in machine learning",
        "ref_url": ""
      },
      {
        "keyword": "hyperparameters",
        "ref_url": ""
      },
      {
        "keyword": "tuned",
        "ref_url": ""
      },
      {
        "keyword": "model",
        "ref_url": ""
      },
      {
        "keyword": "performance",
        "ref_url": ""
      }
    ],
    "name": "Orthogonalization in Machine Learning",
    "children": [
      {
        "name": "Process",
        "children": [
          {
            "name": "Identification of Hyperparameters",
            "children": [
              {
                "name": "Definition",
                "children": [
                  {
                    "name": "Hyperparameters",
                    "ref_url": ""
                  },
                  {
                    "name": "Effect",
                    "ref_url": ""
                  }
                ]
              },
              {
                "name": "Tuning",
                "children": [
                  {
                    "name": "Purpose",
                    "ref_url": ""
                  }
                ]
              }
            ]
          },
          {
            "name": "Clear and Interpretable Functions",
            "children": [
              {
                "name": "Importance",
                "children": [
                  {
                    "name": "Easier Model Tuning",
                    "ref_url": ""
                  },
                  {
                    "name": "Desired Performance",
                    "ref_url": ""
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
`;// Replace with your desired keyword
additonalData(sampleJson).then((data) => {
  console.log(JSON.stringify(data, null, 4));
}).catch((err) => {
  console.log(err);
})

