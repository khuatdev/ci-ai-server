import express from 'express';
import bodyParser from 'body-parser';
import { main } from './gpt.js'; // Import the "main" function from index.js

const app = express();
const port = 3000;

const givenSample = `
# Sample 1
{
  "name": "Kawhi Anthony Leonard",
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
        { "name": "Đội bóng: Los Angeles Clippers" },
        { "name": "Giải đấu: Giải bóng rổ Nhà nghề Mỹ (NBA)" }
      ]
    },
    {
      "name": "Sự nghiệp đại học",
      "children": [
        { "name": "Đại học: San Diego State Aztecs" },
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

# Sample 2
{
  "name": "Leonardo da Vinci",
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
            { "name": "Mona Lisa" },
            { "name": "Bữa ăn tối cuối cùng" }
          ]
        }
      ]
    },
    {
      "name": "Sáng chế và ý tưởng",
      "children": [
        { "name": "Ý tưởng nổi bật",
          "children": [ 
            { "name": "Máy bay trực thăng" }
          ]
        }
      ]
    }
  ]
}

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

Sumarize context then output as Tree Json Format like samples below:
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
