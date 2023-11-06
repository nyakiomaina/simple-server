const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 9500;
const cidsDirectory = path.join(__dirname, 'cids');

if (!fs.existsSync(cidsDirectory)) {
  fs.mkdirSync(cidsDirectory, { recursive: true });
}

app.use(bodyParser.raw({ type: '*/*' }));

app.get('/get/:cid', (req, res) => {
  const cid = req.params.cid;
  const filePath = path.join(cidsDirectory, cid);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log(`CID not found: ${cid}`);
    res.status(404).send('CID not found');
  }
});

app.put('/put/:cid', (req, res) => {
  const cid = req.params.cid;
  const filePath = path.join(cidsDirectory, cid);
  console.log(`Received PUT request for CID: ${cid}`);

  fs.writeFile(filePath, req.body, (err) => {
    if (err) {
      console.error(`Error writing file for CID: ${cid}`, err);
      res.status(500).send('Error writing file');
    } else {
      console.log(`File stored successfully for CID: ${cid}`);
      res.status(200).send('File stored successfully');
    }
  });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Server listening at http://127.0.0.1:${port}`);
});
