# 例子1

如何在一个目录结构寻找一个特定后缀的文件：
- 使用`tree`命令打印出目录树
- 把目录树直接粘贴进chatgpt
- 用---分割后，直接提问

如果是我要解决这个问题：
- 我问的问题会更加抽象化：在文件夹下如何找到的带有特定后缀的文件，请使用python代码实现。我会不自觉对自己遇到的问题做一层抽象。
- 这里给了一个使用chatgpt的重大启示：
  - 搜索引擎并不理解你输入的string，AI是真的理解你输入的string。比如你问new bing有关python的问题，new bing确实会参考一些有关文档，但也是为了使回答的结果更加准确。new bing确实懂你输入的string。
  - 因为AI确实懂你输入的string，所以输入格式和输出格式都可以规定。
  - 之前一直不会一比一还原的问AI一个问题，本质上是会AI的智能理解不够深刻。
  - 以后可以尝试问一些一比一还原的问题。比如：程序的报错。


# 用列表将需求拆分成子任务

# 提问时增加关键词

- step by step
- in great details

you are javascript master. what is the difference between promise and callback in javascript?

- explain in great detail
- explain step by step
- give code snippet
- give insightful summary


you are javascript master. give the code examples to process the file, including

- callback
- promise
- async/await
- event emitter

explain one by one.

-----answer

Sure, I can help you with that. Here are some code examples to process a file in Node.js using different approaches:

- **Callback**: This is the traditional way of handling asynchronous operations in Node.js. You pass a function as an argument to another function that performs some task, and then call the function when the task is done or when an error occurs. For example:

```js
// Import the fs module
var fs = require('fs');

// Define a callback function
function callback(err, data) {
  if (err) {
    // Handle the error
    console.error(err);
  } else {
    // Do something with the data
    console.log(data);
  }
}

// Read a file using the callback function
fs.readFile('example.txt', 'utf8', callback);
```

- **Promise**: This is a newer way of handling asynchronous operations in Node.js. A promise is an object that represents a future value or a potential error. You can use the `then` method to register a function that will be called when the promise is fulfilled or rejected. For example:

```javascript
// Import the fs module
var fs = require('fs');

// Use the promise-based API of fs
var fsp = fs.promises;

// Read a file using a promise
fsp.readFile('example.txt', 'utf8')
  .then(data => {
    // Do something with the data
    console.log(data);
  })
  .catch(err => {
    // Handle the error
    console.error(err);
  });
```

- **Async/await**: This is a syntactic sugar for working with promises in Node.js. You can use the `async` keyword to declare a function that returns a promise, and use the `await` keyword to pause the execution until the promise is resolved or rejected. For example:

```javascript
// Import the fs module
var fs = require('fs');

// Use the promise-based API of fs
var fsp = fs.promises;

// Declare an async function
async function readFile() {
  try {
    // Await for the promise to resolve
    var data = await fsp.readFile('example.txt', 'utf8');
    // Do something with the data
    console.log(data);
  } catch (err) {
    // Handle the error
    console.error(err);
  }
}

// Call the async function
readFile();
```

- **Event emitter**: This is a pattern for emitting and listening to events in Node.js. You can use the `EventEmitter` class to create an object that can emit named events and register listeners for them. For example:

```javascript
// Import the events module
var events = require('events');

// Create an event emitter object
var emitter = new events.EventEmitter();

// Define a listener function
function listener(data) {
  // Do something with the data
  console.log(data);
}

// Register the listener for the 'data' event
emitter.on('data', listener);

// Import the fs module
var fs = require('fs');

// Create a read stream from a file
var stream = fs.createReadStream('example.txt', 'utf8');

// Emit the 'data' event when data is available from the stream
stream.on('data', chunk => {
  emitter.emit('data', chunk);
});
```

I hope this helps you understand how to process files in Node.js using different techniques.😊

Source: Conversation with Bing, 2023/5/14
(1) A Basic Guide to Manipulating the File System in Node.js - MUO. https://www.makeuseof.com/nodejs-filesystem-basic-guide/.
(2) File processing in Node.js: A comprehensive guide. https://blog.logrocket.com/file-processing-node-js-comprehensive-guide/.
(3) node.js - Nodejs - read line by line from file, perform async action .... https://stackoverflow.com/questions/28009848/nodejs-read-line-by-line-from-file-perform-async-action-for-each-line-and-res.
(4) Node.js Examples – Basic Examples, Module Examples, Advanced Examples. https://www.tutorialkart.com/nodejs/node-js-examples/.
(5) Node.js File System - GeeksforGeeks. https://www.geeksforgeeks.org/node-js-file-system/.
(6) Node.js Examples - GeeksforGeeks. https://www.geeksforgeeks.org/node-js-examples/.

# 用---或者%等符号来分割问题

当需要对很长的文本进行答疑解惑的时候，可以用---分割文本和问题

# 先给出问题，再给出文本

# 输出给定格式要求

# 代码问题

每当遇见代码问题的时候，可以直接把报错粘贴进chatgpt，最多补充一个运行环境。

- 编译问题可以直接输入prompt
- runtime问题可以增加运行环境提示

# 设定你的角色

# 设定chatgpt的角色

you are javascript master. what is the difference between promise and callback in javascript?

# 在提示词中使用splaceholders
