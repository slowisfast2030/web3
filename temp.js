var fs = require('fs');
var rs = fs.createReadStream('./demofile.txt');

// 
rs.on('open', function () {
  console.log('The file is open');
});



// Import the events module
const events = require('events');

// Create an event emitter object
const eventEmitter = new events.EventEmitter();

// Create an event handler function
const myEventHandler = function () {
  console.log('I hear a scream!');
}

// Assign the event handler to an event
eventEmitter.on('scream', myEventHandler);

// Fire the 'scream' event
eventEmitter.emit('scream');
