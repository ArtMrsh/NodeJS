const http = require('http');
const fs = require('fs');

const port = 3001;

let recievedBody = '';

function getParsedFile(chunk) {
  recievedBody = '';
  recievedBody += chunk.toString('utf8');
  recievedBody = JSON.parse(recievedBody);
}

function getFileExtension(file) {
  return file.substr(file.lastIndexOf('.') + 1);
}

function checkExisting(file) {
  return fs.existsSync(file);
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  switch (req.method) {

    case 'POST':
      req.on('data', (chunk) => {
        getParsedFile(chunk);
      })

      req.on('end', () => {
        let fileExtension = getFileExtension(recievedBody.file);

        if (checkExisting(`./${recievedBody.file}`)) {
          res.writeHead(409, { 'Content-Type': 'text/plain' });
          res.end(console.log('Conflict'));
        } else if (fileExtension == 'json' || fileExtension == 'csv') {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          fs.writeFileSync(`./${recievedBody.file}`, '');
          res.end();
        } else {
          res.writeHead(415, { 'Content-Type': 'text/plain' });
          res.end(console.log('Unsupported Media Type'));
        }
      })
      break;
    case 'GET':
      req.on('data', (chunk) => {
        getParsedFile(chunk);
      })

      req.on('end', () => {
        let fileExtension = getFileExtension(recievedBody.file);

        if (checkExisting(`./${recievedBody.file}`)) {

          if (fileExtension === 'json') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            let fileToRead = fs.readFileSync(`./${recievedBody.file}`);
            res.end(console.log(fileToRead.toString('utf8')))
          } else if (fileExtension === 'csv') {
            res.writeHead(200, { 'Content-Type': 'application/csv' });
            let fileToRead = fs.readFileSync(`./${recievedBody.file}`)
            res.end(console.log(fileToRead.toString('utf8')))
          }

        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end(console.log('Not found'));
        }

      })
      break;

    case 'PUT':
      req.on('data', (chunk) => {
        getParsedFile(chunk);
      })

      req.on('end', () => {
        let fileExtension = getFileExtension(recievedBody.file);

        if (checkExisting(`./${recievedBody.file}`)) {
          if (fileExtension == 'json' || fileExtension == 'csv') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            fs.writeFileSync(`./${recievedBody.file}`, `${recievedBody.text}`);
            res.end();
          }
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end(console.log('Not found'));
        }

      });
      break;
    case 'DELETE':
      req.on('data', (chunk) => {
        getParsedFile(chunk);
      })

      req.on('end', () => {
        let fileExtension = getFileExtension(recievedBody.file);

        if (checkExisting(`./${recievedBody.file}`)) {
          fs.unlink(`./${recievedBody.file}`, (err) => {
            if(err) return console.log(err);
            res.end(console.log('file deleted successfully'))
          })
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end(console.log('Not found'));
        }

      });
      break;

    default:
      res.end(console.log('Not found'));
  }
})

server.listen(port, () => console.log('server started'))