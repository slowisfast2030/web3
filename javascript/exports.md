# exports vs module.exports

## module

每一个文件都自带一个变量 `module`，创建一个文件run.js

```js
console.log(module)
```

执行 `node run.js`，返回

```sh
Module {
  id: '.',
  path: '/Users/linus/Desktop/prompt-engineering-for-developers/js_learn',
  exports: {},
  filename: '/Users/linus/Desktop/prompt-engineering-for-developers/js_learn/run.js',
  loaded: false,
  children: [],
  paths: [
    '/Users/linus/Desktop/prompt-engineering-for-developers/js_learn/node_modules',
    '/Users/linus/Desktop/prompt-engineering-for-developers/node_modules',
    '/Users/linus/Desktop/node_modules',
    '/Users/linus/node_modules',
    '/Users/node_modules',
    '/node_modules'
  ]
}
```

## exports

编辑run.js

```js
exports.a = 'A';
exports.b = 'B';
console.log(module);
```

再次执行，返回

```sh
Module {
  id: '.',
  path: '/Users/linus/Desktop/prompt-engineering-for-developers/js_learn',
  exports: { a: 'A', b: 'B' },
  filename: '/Users/linus/Desktop/prompt-engineering-for-developers/js_learn/run.js',
  loaded: false,
  children: [],
  paths: [
    '/Users/linus/Desktop/prompt-engineering-for-developers/js_learn/node_modules',
    '/Users/linus/Desktop/prompt-engineering-for-developers/node_modules',
    '/Users/linus/Desktop/node_modules',
    '/Users/linus/node_modules',
    '/Users/node_modules',
    '/node_modules'
  ]
}
```

可以看到，分配给 `exports`的属性被分配给了 `module.exports`
原因：`exports`是对 `module.exports`的引用

# exports vs module.exports

可以通过下面的代码确认上面的结论

```js
exports.a = 'A';
console.log(exports == module.exports);
console.log(module.exports);
```

执行后返回

```sh
true
{ a: 'A' }
```

结论：
如果你想从模块中导出一个对象，给exports对象赋值是一个简洁的捷径。

## using exports

```js
exports.greet = function (name) {
  console.log(`Hi ${name}!`);
}

exports.farewell = function() {
  console.log('Bye!');
}
```

## using module.exports

```js
module.exports = {
  greet: function (name) {
    console.log(`Hi ${name}!`);
  },

  farewell: function() {
    console.log('Bye!');
  }
}
```

# not all the time

> If you assign anything to module.exports, exports is not no longer a reference to it, and exports loses all its power.

```js
module.exports = {a: 'A'};
exports.b = 'B';
console.log(exports === module.exports);
console.log(module)
```

执行后返回

```sh
false
Module {
  id: '.',
  path: '/Users/linus/Desktop/prompt-engineering-for-developers/js_learn',
  exports: { a: 'A' },
  filename: '/Users/linus/Desktop/prompt-engineering-for-developers/js_learn/run.js',
  loaded: false,
  children: [],
  paths: [
    '/Users/linus/Desktop/prompt-engineering-for-developers/js_learn/node_modules',
    '/Users/linus/Desktop/prompt-engineering-for-developers/node_modules',
    '/Users/linus/Desktop/node_modules',
    '/Users/linus/node_modules',
    '/Users/node_modules',
    '/node_modules'
  ]
}
```

# 备注

在node环境下，有两种方法可以在一个模块中输出变量

方法一：对module.exports赋值
```js
// hello.js

function hello() {
    console.log('Hello, world!');
}

function greet(name) {
    console.log('Hello, ' + name + '!');
}

module.exports = {
    hello: hello,
    greet: greet
};
```
方法二：直接使用exports：

```js
// hello.js

function hello() {
    console.log('Hello, world!');
}

function greet(name) {
    console.log('Hello, ' + name + '!');
}

exports.hello = hello;
exports.greet = greet;
```
但是，不可以直接对exports赋值
```js
// 代码可以执行，但是模块并没有输出任何变量:
exports = {
    hello: hello,
    greet: greet
};
```

