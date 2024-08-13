const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'image/png' })

  fs.createReadStream('../function require/image.png').pipe(res)
}).listen(3000)

console.log('Server running at http://localhost:3000')
