var fs = require('fs');

// rs是一个eventEmitter对象
// 当文件打开后，会emit一个open事件
// 当文件读完后，会emit一个end事件
var rs = fs.createReadStream('./temp.ipynb');

// 为open事件绑定一个回调函数
rs.on('open', function () {
  console.log('The file is open');
});
// 为end事件绑定一个回调函数
rs.on('data', function () {
    console.log('The file data is received');
});

rs.on('hello', function () {
    console.log('The file hello!');
});
rs.emit('hello');

/**
上面的代码要注意一下执行顺序。
var rs = fs.createReadStream('./demofile.txt');是一个异步函数，rs对象会立即返回。
然后为rs对象绑定事件处理函数。
当文件打开后，会触发open事件，执行回调函数。
当文件读完后，会触发end事件，执行回调函数。


 */



// // Import the events module
// const events = require('events');

// // Create an event emitter object
// const eventEmitter = new events.EventEmitter();

// // Create an event handler function
// const myEventHandler = function () {
//   console.log('I hear a scream!');
// }

// // Assign the event handler to an event
// eventEmitter.on('scream', myEventHandler);

// // Fire the 'scream' event
// eventEmitter.emit('scream');
