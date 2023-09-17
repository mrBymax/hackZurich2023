const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const wss = socketio(server, {
  cors: {
    origin: '*',
  }
});


var currentState = {
  pomodoro: {
    state: -1, // 0 = stopped, 1 = running, 2 = results, 3 = paused
    mode: 0, // -1 = none, 0 = study, 1 = game
    time: 25, // in minutes
  },
}

function viewer(req, res, buf, encoding) {
  console.log(buf.toString());
}

// Middleware to parse JSON in POST requests
app.use(express.json({ verify: viewer }));

// Handle HTTP POST requests
app.post('/openbci', (req, res) => {
  console.log('POST /openbci');
  //console.log(req.body);
  // Broadcast the received message to all WebSocket clients
  console.log(currentState.pomodoro.state);
  if (currentState.pomodoro.state == 0) {
    wss.emit('rt-openbci', req.body["Focus Score"]);
  } else {
    wss.emit('openbci', req.body);
  }

  res.status(200).json({ success: true });
});

app.post('/mouse', (req, res) => {
  console.log('POST /mouse');
  const message = req.body;
  console.log(currentState.pomodoro.state);

  // Broadcast the received message to all WebSocket clients
  wss.emit('mouse', message);

  res.status(200).json({ success: true });
})

app.post('/gaze_mouse', (req, res) => {
  console.log('POST /gaze_mouse');
  const message = req.body;
  console.log(currentState.pomodoro.state);

  // Broadcast the received message to all WebSocket clients
  wss.emit('gaze_mouse', message);

  res.status(200).json({ success: true });
});

app.post('/activity', (req, res) => {
  console.log('POST /activity');
  //console.dir(req.body);

  //console.log(currentState.pomodoro.state);

  if (currentState.pomodoro.state == 0) {
    wss.emit('rt-activity', req.body);
  } else {
    req.body = req.body[0].replaceAll("][", '],[')
    req.body = JSON.parse("[" + req.body + "]")
    wss.emit('activity', req.body);
  }
  // Broadcast the received message to all WebSocket clients

  res.status(200).json({ success: true });
})

app.post('/gaze', (req, res) => {
  const message = req.body;
  console.log(currentState.pomodoro.state);

  // Broadcast the received message to all WebSocket clients
  wss.emit('gaze', message);

  res.status(200).json({ success: true });
});

app.get('/status', function (request, response) {
  //console.log('GET /status')
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(currentState))
})

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    if (message.cmd == "init")
      currentState.pomodoro.state = 0;
    else if (message.cmd == "stop")
      currentState.pomodoro.state = 1;
    else if (message.cmd == "reset")
      currentState.pomodoro.state = -1;
    console.log(`Received message: ${message}`);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

server.listen(8327, () => {
  console.log('Server is running on port 8327');
});
