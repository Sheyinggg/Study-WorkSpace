const fs = require('fs')
const http = require('http')
const mime = require('mime')
const path = require('path')

const cache = {}

function send404(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.write('Error 404: resource not found.')
  response.end()
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(200, {
    'Content-Type': mime.lookup(path.basename(filePath))
  })
  response.end(fileContents)
}

/**
 * 提供静态文件服务
 * @param {*} response 响应
 * @param {*} cache 内存
 * @param {*} absPath 绝对路径
 */
function serverStatic(response, cache, absPath) {
  if (cache[absPath]) {
    // 有缓存，从缓存中返回文件
    sendFile(response, absPath, cache[absPath])
  } else {
    const exists = fs.existsSync(absPath)
    if (exists) {
      fs.readFile(absPath, (err, data) => {
        if (err) {
          send404(response)
        } else {
          cache[absPath] = data
          sendFile(response, absPath, data)
        }
      })
    } else {
      send404(response)
    }
  }
}

const server = http.createServer((request, response) => {
  let filePath = false

  if (request.url === '/') {
    filePath = 'client/index.html'
  } else {
    filePath = 'client' + request.url
  }

  const absPath = './' + filePath

  serverStatic(response, cache, absPath)
})

server.listen(3000, () => {
  console.log('Server listening on port 3000.')
})
