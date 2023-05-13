var fs = require('fs');

// rs是一个eventEmitter对象
// 当文件打开后，会emit一个open事件
// 当文件读完后，会emit一个end事件
var rs = fs.createReadStream('./demofile.txt');

// 为open事件绑定一个回调函数
rs.on('open', function () {
  console.log('The file is open');
});
// 为end事件绑定一个回调函数
rs.on('end', function () {
    console.log('The file is end');
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
