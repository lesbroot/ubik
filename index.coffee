express = require('express')
app = express()
http = require('http').Server(app)
io = require('socket.io')(http)
nunjucks = require('nunjucks')
range = require('lodash/utility/range')


colors = [
  '000000'
  'ffffff'
  'ff0000'
  '00ff00'
  '0000ff'
  '00ffff'
  'ffff00'
]

anims = 
  'fg': range(6)
  'bg': range(5)
  'color': colors

app.set 'port', process.env.PORT or 5000
app.use express.static(__dirname + '/public')

nunjucks.configure 'templates',
  autoescape: true
  express: app

app.get '/', (req, res) ->
  res.render 'index.html', anims: anims

app.get '/ubik', (req, res) ->
  res.render 'ubik.html'

io.on 'connection', (socket) ->
  console.log 'connection'
  socket.on 'anim request', (msg) ->
    console.log msg
    io.emit 'anim response', msg
  socket.on 'disconnect', ->
    console.log 'disconnected'

http.listen app.get('port'), ->
  console.log 'listening on *:' + app.get('port')
