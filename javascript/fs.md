# fs

node.js内置的fs模块负责读写文件

> 和其他所与javascript模块不同，fs模块同时提供了异步和同步的方法

> 同步操作的好处是代码简单，缺点是程序将等待IO操作，在等待时间内，无法响应其它任何事件。而异步读取不用等待IO操作，但代码较麻烦。

# 读文件

## 异步

```js
var fs = require('fs');

fs.readFile('sample.txt', 'utf-8', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});
```

## 同步

```js
var fs = require('fs');

try {
    var data = fs.readFileSync('sample.txt', 'utf-8');
    console.log(data);
} catch (err) {
    console.log(err);
}
```

# 写文件

## 异步

```js
var fs = require('fs');

var data = 'Hello, Node.js';
fs.writeFile('output.txt', data, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('ok.');
    }
});
```

## 同步

```js
var fs = require('fs');

var data = 'Hello, Node.js';
try {
    fs.writeFileSync('output.txt', data);
    console.log(data);
} catch (err) {
    console.log(err);
}
```

# 异步还是同步

> 在fs模块中，提供同步方法是为了方便使用。那我们到底是应该用异步方法还是同步方法呢？

> 由于Node环境执行的JavaScript代码是服务器端代码，所以，绝大部分需要在服务器运行期反复执行业务逻辑的代码，必须使用异步代码，否则，同步代码在执行时期，服务器将停止响应，因为JavaScript只有一个执行线程。

> 服务器启动时如果需要读取配置文件，或者结束时需要写入到状态文件时，可以使用同步代码，因为这些代码只在启动和结束时执行一次，不影响服务器正常运行时的异步执行。
