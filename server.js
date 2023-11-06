const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 9500;
const cidsDirectory = path.join(__dirname, 'cids');

if (!fs.existsSync(cidsDirectory)) {
  fs.mkdirSync(cidsDirectory, { recursive: true });
}

app.use((req, res, next) => {
  if (req.is('application/octet-stream')) {
    let data = [];
    req.on('data', chunk => {
      data.push(chunk);
    });
    req.on('end', () => {
      req.body = Buffer.concat(data);
      next();
    });
  } else {
    next();
  }
});

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
    console.log(`Received PUT request for CID: ${cid} with Content-Type: ${req.headers['content-type']}`);
  
    if (!(req.body instanceof Buffer)) {
      console.error(`Expected request body to be a buffer, but got: ${typeof req.body}`);
      return res.status(400).send('Bad request body');
    }
  
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
