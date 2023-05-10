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
