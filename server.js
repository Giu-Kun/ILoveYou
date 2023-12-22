const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

let lastDisplayedTime = new Date().getTime();

io.on('connection', (socket) => {
  // Send the current state to the newly connected client
  socket.emit('updateCountdown', calculateRemainingTime());

  // Listen for events from clients
  socket.on('loveDisplayed', () => {
    // Update the last displayed time when a love message is displayed
    lastDisplayedTime = new Date().getTime();
    // Broadcast the updated state to all clients
    io.emit('updateCountdown', calculateRemainingTime());
  });
});

function calculateRemainingTime() {
  const elapsedTime = (new Date().getTime() - lastDisplayedTime) / 1000;
  const remainingTime = Math.max(0, 60 - elapsedTime); // Assuming a 60-second countdown
  return Math.floor(remainingTime);
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
