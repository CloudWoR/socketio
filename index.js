import Koa from 'koa'
import http from 'http'
import Socket from 'socket.io'
import Router from 'koa-router'
import fs from 'fs'
const app = new Koa();
const server = http.Server(app.callback())
const io = Socket(server)
const router = new Router()

app.use(router.routes()).use(router.allowedMethods())

router.get('/', async(ctx, next) => {
  const htmlFile = await (new Promise((resolve, reject) => {
    fs.readFile('index.html', (err, data) => {
      err && reject(err)
      resolve(data)
    })
  }))
  ctx.type = 'html'
  ctx.body = htmlFile
})

io.on('connection', socket => {
  console.log('初始化成功！下面可以用socket绑定事件和触发事件了')
  socket.on('disconnect', () => {
    console.log('user disconnectd')
  })
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg)
    io.emit('chat message', `${msg} to server`)
  })
})

server.listen(3000, () => {
  console.log('listen to: http://127.0.0.1:3000')
})