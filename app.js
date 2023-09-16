import express from 'express';
import bodyParser from 'body-parser';
import { main } from './gpt.js'; // Import the "main" function from index.js

const app = express();
const port = 3000;

const givenSample = `
# Sample 1
Context: "Kawhi Anthony Leonard (/kəˈwaɪ/, sinh ngày 29 tháng 6 năm 1991) là một cầu thủ bóng rổ chuyên nghiệp người Mỹ chơi cho Los Angeles Clippers tại Giải bóng rổ Nhà nghề Mỹ (NBA). Leonard đã chơi hai mùa bóng rổ đại học cho San Diego State Aztecs và được bầu chọn vào đội thứ hai All-American lúc là sinh viên năm hai. Indiana Pacers đã chọn anh với lượt chọn thứ 15 trong NBA draft 2011 nhưng đã được trao đổi với San Antonio Spurs ngay trong ngày draft."
Output:
\`\`\`
{
  "keywords": [
    {
      "keyword": "Kawhi Leonard",
      "ref_url": "https://vi.wikipedia.org/wiki/Kawhi_Leonard"
    },
    {
      "keyword": "Los Angeles Clippers",
      "ref_url": "https://vi.wikipedia.org/wiki/Los_Angeles_Clippers"
    },
    {
      "keyword": "Giải bóng rổ Nhà nghề Mỹ",
      "ref_url": "https://vi.wikipedia.org/wiki/Giải_bóng_rổ_Nhà_nghề_Mỹ"
    },
    {
      "keyword": "San Diego State Aztecs",
      "ref_url": "https://vi.wikipedia.org/wiki/San_Diego_State_Aztecs"
    }
  ],
  "name": "Kawhi Anthony Leonard",
  "ref_url": "https://vi.wikipedia.org/wiki/Kawhi_Leonard",
  "children": [
    {
      "name": "Thông tin cá nhân",
      "children": [
        { "name": "Ngày sinh: 29 tháng 6 năm 1991"},
        { "name": "Quốc tịch: Mỹ" }
      ]
    },
    {
      "name": "Sự nghiệp",
      "children": [
        { "name": "Vị trí: Cầu thủ bóng rổ chuyên nghiệp" },
        { "name": "Đội bóng: Los Angeles Clippers", "ref_url": "https://vi.wikipedia.org/wiki/Los_Angeles_Clippers" },
        { "name": "Giải đấu: Giải bóng rổ Nhà nghề Mỹ (NBA)", "ref_url": "https://vi.wikipedia.org/wiki/Giải_bóng_rổ_Nhà_nghề_Mỹ"}
      ]
    },
    {
      "name": "Sự nghiệp đại học",
      "children": [
        { "name": "Đại học: San Diego State Aztecs", "ref_url": "https://vi.wikipedia.org/wiki/San_Diego_State_Aztecs" },
        { "name": "Thời gian đại học: Hai mùa bóng rổ đại học" },
        { "name": "Thành tích đại học: Được bầu chọn vào đội thứ hai All-American lúc là sinh viên năm hai" }
      ]
    },
    {
      "name": "NBA Draft",
      "children": [
        { "name": "Năm draft: 2011" },
        { "name": "Lượt chọn: Lượt chọn thứ 15 trong NBA draft 2011" },
        { "name": "Trao đổi: Traded to San Antonio Spurs ngay trong ngày draft" }
      ]
    }
  ]
}
\`\`\`

# Sample 2
Context: "Kawhi Anthony Leonard (/kəˈwaɪ/, sinh ngày 29 tháng 6 năm 1991) là một cầu thủ bóng rổ chuyên nghiệp người Mỹ chơi cho Los Angeles Clippers tại Giải bóng rổ Nhà nghề Mỹ (NBA). Leonard đã chơi hai mùa bóng rổ đại học cho San Diego State Aztecs và được bầu chọn vào đội thứ hai All-American lúc là sinh viên năm hai. Indiana Pacers đã chọn anh với lượt chọn thứ 15 trong NBA draft 2011 nhưng đã được trao đổi với San Antonio Spurs ngay trong ngày draft."
Output:
\`\`\`
{
  "keywords": [
    {
      "keyword": "Leonardo da Vinci",
      "ref_url": "https://vi.wikipedia.org/wiki/Leonardo_da_Vinci"
    },
    {
      "keyword": "Mona Lisa",
      "ref_url": "https://vi.wikipedia.org/wiki/Mona_Lisa"
    },
    {
      "keyword": "Bữa ăn tối cuối cùng",
      "ref_url": "https://vi.wikipedia.org/wiki/B%E1%BB%AFa_%C4%83n_t%E1%BB%91i_cu%E1%BB%91i_c%C3%B9ng_(Leonardo_da_Vinci)"
    },
    {
      "keyword": "Máy bay trực thăng",
      "ref_url": "https://vi.wikipedia.org/wiki/M%C3%A1y_bay_tr%E1%BB%B1c_th%C3%A2ng"
    }
  ],
  "name": "Leonardo da Vinci",
  "ref_url": "https://vi.wikipedia.org/wiki/Leonardo_da_Vinci",
  "children": [
    {
      "name": "Thông tin cá nhân",
      "children": [
        { "name": "Ngày sinh: 15 tháng 4 năm 1452" },
        { "name": "Nơi sinh: Anchiano, Ý" },
        { "name": "Ngày mất: 2 tháng 5 năm 1519" },
        { "name": "Nơi mất: Amboise, Pháp" },
        { "name": "Tên khai sinh: Leonardo di ser Piero da Vinci" },
        { "name": "Quốc tịch: Ý" }
      ]
    },
    {
      "name": "Sự nghiệp",
      "children": [
        { "name": "Nghề nghiệp", 
          "children": [
            { "name": "Họa sĩ" }, 
            { "name": "nhà điêu khắc"},
            { "name": "kiến trúc sư"}
          ]
        },
        { "name": "Tác phẩm nổi tiếng",
          "children": [
            { "name": "Mona Lisa", "ref_url": "https://vi.wikipedia.org/wiki/Mona_Lisa" },
            { "name": "Bữa ăn tối cuối cùng", "ref_url": "https://vi.wikipedia.org/wiki/B%E1%BB%AFa_%C4%83n_t%E1%BB%91i_cu%E1%BB%91i_c%C3%B9ng_(Leonardo_da_Vinci)" }
          ]
        }
      ]
    },
    {
      "name": "Sáng chế và ý tưởng",
      "children": [
        { "name": "Ý tưởng nổi bật",
          "children": [ 
            { "name": "Máy bay trực thăng", "ref_url": "https://vi.wikipedia.org/wiki/M%C3%A1y_bay_tr%E1%BB%B1c_th%C3%A2ng" }
          ]
        }
      ]
    }
  ]}
\`\`\`
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

Generate a JSON tree structure from the provided text. Please identify and include any relevant reference links to external sources for additional information.
Sample:  
${givenSample}
!IMPORTANT: Please output only the json file. Otherwise, the result will be treated as incorrect.
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
      return res.status(400).json({ error: data });
    }
    return res.status(200).json({ result: JSON.parse(finalRes)});
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

// POST /v1/completions endpoint
app.post('/v1/completions', (req, res) => {
  const { outline } = req.body;
  const prompt = `
From the given json outline, generate a summary for the given outline.
Outline: ${outline}
  `;
  const response = main(prompt, accessToken);
  response.then((data) => {
    // Respond with the received note as text
    return res.status(200).json({ result: data });
  }).catch((err) => {
    console.log(err)
    return res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
