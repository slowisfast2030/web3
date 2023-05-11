# 基于callback、then和await的一些思考

思考

- 有了ai，不再需要去记很多的代码片段。以前看过一个说法，一个经验丰富的程序员，应该有很多可用的代码片段。以前在百度的时候，经常看见一句话：读码千万行行，下笔如有神！这两点都在强调代码量的重要性。
- 但是什么是程序员的核心竞争力？我觉得是基于问题生成解决方案的能力。假设一个问题的解决可以分解为10个小问题，那么代码片段就是解决这些小问题的方案或者部分方案。
- 以前雷军也保留了很多写过的代码。
- 在ai出现后，`读码千万行，下笔如有神`的逻辑就就会回退到 `基于问题生成解决方案的能力`。只要将大问题分解成一个个小问题，我们就可以针对这个小问题给出详细的描述，让ai给出对应的代码片段！这是解决问题的元能力，而不是去积累很多的代码片段。
- 这对学习提出了一个更高的要求：学习知识本质，而不是各种函数的调用。拿js的异步函数举例，我们知道一开始是有callback，后来引入了promise，基于promise又有了await。你不需要记住每一种写法，有的人以会默写为荣。只需要了解每一种解决方案的本质是什么，优缺点是什么，然后通过自然语言描述出来，表达你的需求就可以。
- 假设我们有了then的写法，你想改写成await的写法，不需要自己动手去改写，只需要将代码粘贴进chatgpt，


看prompt engineering有感：
1.看了吴恩达的提示词工程的课程，里面给出了使用chatgpt的两条指导原则：
one：write clear and specific instructions

two:  give the model time to “think”

第一条强调的是针对一个具体问题，我们要给出清楚且详细的指令；

第二条强调的是要将一个大问题分解，按步骤给出各个小问题的答案。

2.总结一下，我们就可以得出使用chatgpt的核心原则：将复杂问题分解成一系列简单问题，通过chatgpt去解决每一个简单问题。

3.下面给出了基于new bing生成的三棵树🌲，树是很明显的上窄下宽的正三角结构。

如果将树的底部看做是一个领域的基础知识，树的中间就是基础知识经过排列组合衍生出的高一级别的知识，树的顶部就是通过基础知识和高一级别的知识可以解决的问题。这就是中国教育的典型写照：所有的学习都是先打基础，然后解决问题。看上去确实没毛病，这也是它被这样设计出来的原因。

4.然而，真实世界的解决问题的能力，不论是创业、做研究还是写代码，都是先有问题。我们需要把这个终极问题，分解成很多层级的小问题，倒逼学习。这是典型的倒三角的能力结构。

5.总结一下，求学阶段的能力模型：知识-->高级别知识-->问题。现实世界的能力模型：问题-->小问题-->知识。

6.在搜索引擎时代，知道如何找到需要的知识，比记住每一个知识重要得多。随着ai时代的到来，不断地把遇到的问题分解成小问题，通过ai去解决一个个具体的小问题，这成为了ai时代的核心竞争力！




# callback、then、await

## callback

```javascript
// 使用回调函数的写法
accounts.forEach(function(account) { // 遍历账户数组
  web3.eth.getBalance(account, function(error, balance) { // 获取账户余额，传递一个回调函数作为第二个参数
    if (error) { // 处理错误
      console.error(error); // 打印错误信息
    } else { // 处理结果
      console.log(account + ": " + balance); // 打印账户和余额
    }
  });
});

```

## then

```javascript
// 使用then的语法
function printBalances(accounts) { // 定义一个普通函数
  accounts.forEach(account => { // 遍历账户数组
    web3.eth.getBalance(account) // 获取账户余额，返回一个Promise对象
    .then(balance => { // 处理Promise对象的结果
      console.log(`${account}: ${balance}`); // 使用模板字符串打印账户和余额
    })
    .catch(error => { // 处理错误
      console.error(error); // 打印错误信息
    });
  });
}

printBalances(accounts); // 调用普通函数

```

## async/await

```javascript
// 使用async/await语法
async function printBalances(accounts) { // 定义一个async函数
  for (let account of accounts) { // 遍历账户数组
    try {
      let balance = await web3.eth.getBalance(account); // 等待获取账户余额
      console.log(`${account}: ${balance}`); // 使用模板字符串打印账户和余额
    } catch (error) { // 处理错误
      console.error(error); // 打印错误信息
    }
  }
}

printBalances(accounts); // 调用async函数

```
