import express from 'express';
import bodyParser from 'body-parser';
import { main } from './gpt.js'; // Import the "main" function from index.js

const app = express();
const port = 3000;

const givenSample = `
graph TB
  A[Root]
  B[Branch 1]
  C[Branch 2]
  
  A --> B
  A --> C
`
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

let accessToken = null;

// POST /v1/completions endpoint
app.post('/v1/generate', (req, res) => {
  const { note } = req.body;

  if (!note) {
    return res.status(400).json({ error: 'Note is required in the request body' });
  }
  const prompt = `
context: "${note}"
---
title: MainContent
---

convert context to sample mermaid :
${givenSample}
`;
  const response = main(prompt, accessToken);
  response.then((data) => {
    // Respond with the received note as text
    let finalRes = '';
    const listText = data.split('\n');
    for (let i = 0; i < listText.length; i++) {
      const text = listText[i];
      if (text.trim().startsWith('`')) {
        i++;
        let nextText = listText[i];
        while (!nextText.trim().startsWith('`') && i < listText.length) {
          finalRes += nextText + '\n';
          i++;
          nextText = listText[i];
        }
        break;
      }
    }
    if (finalRes == '') {
      return res.status(200).json({ error: 'response not in format of mermaid' });
    }
    return res.status(200).json({ result: finalRes});
  }).catch((err) => {
    console.log(err)
    return res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  })
});

// POST /v1/config endpoint
app.post('/v1/config', (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required in the request body' });
  }
  accessToken = access_token;

  // Respond with only the status code (200 OK)
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
