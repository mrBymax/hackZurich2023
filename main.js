import SDKClient from './sdk/client.js';
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';


const initialData = {
  pluginId: 'logi_pomodoro',
  pluginCode: "123",
  pluginVersion: "1.2.3"
};

const clientApp = new SDKClient(initialData);
//clientApp.init();

clientApp.onTriggerAction = async ({ id, message }) => {
  if (message.actionId === 'start_pomodoro') {
  }
};

var currentState = {
  pomodoro: {
    state: 0, // 0 = stopped, 1 = running, 2 = results, 3 = paused
    mode: -1, // -1 = none, 0 = study, 1 = game
    time: 0, // in minutes
  },
}


const app = express();
const server = createServer(app);
const io = new Server(server);

function resetPomodoro() {
  currentState.pomodoro.state = 0;
  currentState.pomodoro.mode = -1;
  currentState.pomodoro.time = 0;
}

app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.text())
app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/', function (request, response) {
  console.log('GET /')
  var html = fs.readFileSync('index.html')
  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.end(html)
})


const countBy = (arr) =>
  arr.flat().map(val => val[0]).reduce((acc, val, i) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});


app.post('/', function (request, response) {
  currentState.pomodoro.state = 0;
  currentState.pomodoro.mode = -1;
  currentState.pomodoro.time = 0;
  console.log('POST /')
  if (request.body[0].includes(']][[')) {
    request.body[0] = request.body[0].replaceAll("]][[", ']],[[')
    request.body[0] = request.body[0].replaceAll("(", '[')
    request.body[0] = request.body[0].replaceAll(")", ']')
    request.body[0] = request.body[0].replaceAll("'", '"')
    console.dir(request.body)
    request.body = JSON.parse("[" + request.body[0] + "]")
  }
  var arr = countBy(request.body)
  console.dir(arr)
  console.dir(request.body.flat())
  io.emit('update', { focus: request.body.focus, time: request.body.time });
  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.end('thanks')
})

app.post('/start', function (request, response) {
  console.log('POST /start')
  console.dir(request.body)
  currentState.pomodoro.state = 1
  currentState.pomodoro.mode = request.body.mode
  currentState.pomodoro.time = request.body.time
  response.writeHead(200)
  response.end()
  io.emit('timer-start', { mode: request.body.mode });
})


app.post('/stop', function (request, response) {
  console.log('POST /stop')
  console.dir(request.body)
  currentState.pomodoro.state = 2
  response.writeHead(200)
  response.end()
  io.emit('timer-stop', { results: "Wow too unfocused" });
})

app.post('/reset', function (request, response) {
  console.log('POST /reset')
  console.dir(request.body)
  resetPomodoro()
  response.writeHead(200)
  response.end()
  io.emit('timer-reset');
})

app.get('/status', function (request, response) {
  console.log('GET /status')
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(currentState))
})

const port = 8327;
server.listen(port)
console.log(`Listening at http://localhost:${port}`)
