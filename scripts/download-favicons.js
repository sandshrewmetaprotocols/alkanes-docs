const https = require('https');
const fs = require('fs');
const path = require('path');

const files = [
  {
    url: 'https://www.oyl.io/favicon.ico',
    dest: '../static/img/favicon.ico',
  },
  {
    url: 'https://www.oyl.io/favicon-16x16.png',
    dest: '../static/img/favicon-16x16.png',
  },
  {
    url: 'https://www.oyl.io/favicon-32x32.png',
    dest: '../static/img/favicon-32x32.png',
  },
  {
    url: 'https://www.oyl.io/apple-touch-icon.png',
    dest: '../static/img/apple-touch-icon.png',
  },
];

files.forEach(file => {
  https
    .get(file.url, res => {
      const filePath = path.join(__dirname, file.dest);
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${file.url}`);
      });
    })
    .on('error', err => {
      console.error(`Error downloading ${file.url}: ${err.message}`);
    });
});
