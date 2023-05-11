# async/await

`async/await`是JavaScript中处理异步操作的一种更简洁的方式。

在JavaScript中，通常使用回调函数来处理异步操作，而这会导致回调嵌套层级过深、代码可读性差和难以调试等问题。`async/await`可以让我们写出更易读、更清晰的异步代码。

通过在函数前面加上 `async`关键字，该函数就成了一个异步函数，它会返回一个Promise对象。在异步函数中，可以使用 `await`关键字等待其他异步操作完成，而不需要使用回调函数。

```js
async function fetchData() {
  const response = await fetch('https://example.com/data');
  const data = await response.json();
  return data;
}
```

在上面的例子中，`fetchData`是一个异步函数，它等待从 `https://example.com/data`获取数据并将其解析为JSON格式。在异步函数内部，我们没有使用任何回调函数，而是使用了 `await`关键字等待异步操作结果。

总之，`async/await`是一种可以使异步代码看起来更像同步代码的方式。

# 思考

一个函数之所以是异步，是因为函数内部有异步操作，说得更直白一点，就是有读取数据类似的操作。

因为申明了异步，所以异步函数的定义内部可以使用await关键字。

> fetchData是异步函数，返回的是Promise对象。
>
> 可以猜想：fetch函数的实现方式也是通过async定义的。

# 调用

异步函数返回的是一个Promise对象。

两种调用方式：

```js
// 方法一
fetchData().then(data => console.log(data));

// 方法二
(async()=>{
    let data = await fetchData();
    console.log(data);
})();
```

# 备注

在 node 交互窗口中，可以直接使用 `await` 是因为该窗口实际上是一个 Read-Eval-Print-Loop (REPL) 环境。

当你输入代码并按下回车键时，该代码会被立即评估和执行，而不需要将其包装在异步函数或 Promise 中。

因此，您可以直接使用 `await` 关键字来暂停和等待异步操作的完成，这只适用于 REPL 环境，如果您在文件中使用 `await`，则必须将其放在异步函数中或者使用 `.then()` 方法获取 Promise 的结果。


# 注意

async定义了一个异步函数，异步函数返回的是一个Promise

可以进一步思考下，为什么async定义的函数内部可以用await操作？

以上面的函数为例

```js
async function fetchData() {
  const response = await fetch('https://example.com/data');
  const data = await response.json();
  return data;
}

// 方法一
fetchData().then(data => console.log(data));

// 方法二
(async()=>{
    let data = await fetchData();
    console.log(data);
})();
```

在定义fetchData函数的过程中，如果不使用await，该如何写呢？

有其他的写法，但总是没有使用await优雅！


> async函数内部有一个异步函数操作，Promise初始化的代码也有一个异步函数操作。
>
> 如果async函数返回的是一个Promise对象，Promise初始化代码返回的也是一个Promise对象，
>
> 可不可以说async是Promise初始化代码的一个简写形式？

下面的例子可以看出使用await的简洁

假设我们有一个异步函数fetch，它用来发送网络请求，并返回一个Promise对象。我们想要依次发送两个请求，并打印出结果。我们可以用Promise初始化代码来实现，也可以用async函数来实现。

Promise初始化代码的写法是这样的：

```javascript
// Promise初始化代码
fetch('http://aaa.com') // 发送第一个请求
.then(responseA => { // 处理第一个请求的结果
  console.log(responseA); // 打印第一个请求的结果
  return fetch('http://bbb.com'); // 发送第二个请求
})
.then(responseB => { // 处理第二个请求的结果
  console.log(responseB); // 打印第二个请求的结果
})
.catch(error => { // 处理任何错误
  console.error(error); // 打印错误信息
});
```

async函数的写法是这样的：

```javascript
// async函数
async function fetchTwo() { // 定义一个async函数
  try {
    const responseA = await fetch('http://aaa.com'); // 等待第一个请求的结果
    console.log(responseA); // 打印第一个请求的结果
    const responseB = await fetch('http://bbb.com'); // 等待第二个请求的结果
    console.log(responseB); // 打印第二个请求的结果
  } catch (error) { // 处理任何错误
    console.error(error); // 打印错误信息
  }
}

fetchTwo(); // 调用async函数
```


# 回调、then、await

js相对于python，最主要的区别就是每一个函数从同步变成了异步。

异步函数执行有3种方法，回调、then和await

* [ ] await方法是最简洁的！！！
