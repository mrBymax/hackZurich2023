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
    state: 0, // 0 = stopped, 1 = running, 2 = paused
    mode: -1, // -1 = none, 0 = study, 1 = game
    time: 0, // in minutes
  },
}


const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'));

app.get('/', function (request, response) {
  console.log('GET /')
  var html = fs.readFileSync('index.html')
  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.end(html)
})

app.post('/', function (request, response) {
  console.log('POST /')
  console.dir(request.body)
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
  response.writeHead(302, { 'Location': 'http://localhost:8327/' })
  response.end()
})

const port = 8327;
server.listen(port)
console.log(`Listening at http://localhost:${port}`)
