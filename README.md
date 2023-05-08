# web3.js

我们与区块链进行通信的方式是通过RPC。

web3.js是一个JavaScript库，它抽象出了所有的RPC调用，以便于你可以通过JavaScript与区块链进行交互。另一个好处是，web3.js能够让你使用你最喜欢的JavaScript框架构建非常棒的web应用。

# 如何通过函数选择器进行函数调用

## 如何获取函数选择器

```js
truffle console> web3.utils.keccak256('voteForCandidate(bytes32)').slice(0,10)
```

返回

```js
'0xcc9ab267'
```

## 发起函数调用的交易

```javascript
web3.eth.sendTransaction({
    from: '0x0d432780D47bc46F84068e2cF83916B6289C0FdD'
    to: '0xbE3Be9BD3fB55509ee0205356F6201c19EE15F5D'
    data: '0xcc9ab2675678000000000000000000000000000000000000000000000000000000000000'
    })
```

## 更加简单的获取data字段的方法呢

```js
truffle console> ins.voteForCandidate.request('0x5678')
```

返回

```js
{
  from: '0x0d432780D47bc46F84068e2cF83916B6289C0FdD',
  to: '0xbE3Be9BD3fB55509ee0205356F6201c19EE15F5D'，
  data: '0xcc9ab2675678000000000000000000000000000000000000000000000000000000000000'
}
```

# data location

## example

```solidity
   pragma solidity ^0.8.0;

   contract Example {
       struct Data {
           uint x;
           uint y;
       }

       Data[] public data;
   }

   // 我们可以定义不同类型和不同data location的函数来操作这个数组，比如：

   // external函数，参数使用calldata
   function addData (Data calldata _data) external {
       data.push(_data); // 将参数复制到存储中的数组
   }

   // public函数，参数使用memory
   function updateData (uint _index, Data memory _data) public {
       data[_index] = _data; // 将参数复制到存储中的数组元素
   }

   // internal函数，参数使用storage
   function swapData (uint _i, uint _j) internal {
       Data storage temp = data[_i]; // 创建一个指向存储中数组元素的引用
       data[_i] = data[_j]; // 将数组元素交换
       data[_j] = temp;
   }

   // private函数，参数使用memory
   function compareData (Data memory _a, Data memory _b) private pure returns (bool) {
       return _a.x + _a.y > _b.x + _b.y; // 比较两个参数的和
   }

```

## 规则

值类型不需要指定data location
引用类型需要指定data location

# truffle console

## 数组遍历

```js
// 在truffle console环境下，遍历accounts，返回balance
web3.eth.getAccounts (function (err, accounts) {
    if (err) console.error (err);
    else {
      accounts.forEach (function (account) {
        web3.eth.getBalance (account, function (err, balance) {
          if (err) console.error (err);
          else console.log (account + ": " + balance);
        });
      });
    }
  });

// js遍历数组

// 使用for...of循环
const numbers = [1, 2, 3, 4, 5];
for (let num of numbers) {
  console.log(num); // 依次打印1, 2, 3, 4, 5
}

// 使用forEach方法
const numbers2 = [1, 2, 3, 4, 5];
numbers2.forEach(function (num) {
  console.log(num); // 依次打印1, 2, 3, 4, 5
});
```

## await报错

```js
/**
accounts.forEach(function(account){balance = await web3.eth.getBalance(account)})
SyntaxError: await is only valid in async functions and the top level bodies of modules

这个错误的原因是你在一个普通的函数中使用了await关键字，
而await只能在异步函数（async function）或者模块的顶层中使用。
await关键字用于等待一个Promise对象的结果，而web3.eth.getBalance是一个返回Promise对象的异步函数。
 */

// 要解决这个错误，你有两种方法：
// 一种方法是把forEach的回调函数改成异步函数，即在function前面加上async关键字，例如：
accounts.forEach(async function(account) {
    balance = await web3.eth.getBalance(account);
    // do something with balance
  });

// 另一种方法是不使用await关键字，而是使用then方法来处理Promise对象的结果，例如：
accounts.forEach(function(account) {
    web3.eth.getBalance(account).then(function(balance) {
      // do something with balance
    });
  });

// 改为回调函数
accounts.forEach(function(account) {
    web3.eth.getBalance(account, function(err, balance) {
      if (err) {
        console.error(err); // 处理错误
      } else {
        // do something with balance
      }
    });
  });
```

## trick

命令

```js
truffle(Voting)> ins.methods
```

返回

```
{
  'candidateList(uint256)': [Function (anonymous)] {
    call: [Function (anonymous)],
    sendTransaction: [Function (anonymous)],
    estimateGas: [Function (anonymous)],
    request: [Function (anonymous)]
  },
  'votesReceived(bytes32)': [Function (anonymous)] {
    call: [Function (anonymous)],
    sendTransaction: [Function (anonymous)],
    estimateGas: [Function (anonymous)],
    request: [Function (anonymous)]
  },
  'totalVotesFor(bytes32)': [Function (anonymous)] {
    call: [Function (anonymous)],
    sendTransaction: [Function (anonymous)],
    estimateGas: [Function (anonymous)],
    request: [Function (anonymous)]
  },
  'voteForCandidate(bytes32)': [Function (anonymous)] {
    call: [Function (anonymous)],
    sendTransaction: [Function (anonymous)],
    estimateGas: [Function (anonymous)],
    request: [Function (anonymous)]
  },
  'validCandidate(bytes32)': [Function (anonymous)] {
    call: [Function (anonymous)],
    sendTransaction: [Function (anonymous)],
    estimateGas: [Function (anonymous)],
    request: [Function (anonymous)]
  }
}
```

命令

```js
truffle(Voting)> ins.methods['candidateList(uint256)']
```

返回

```
[Function (anonymous)] {
  call: [Function (anonymous)],
  sendTransaction: [Function (anonymous)],
  estimateGas: [Function (anonymous)],
  request: [Function (anonymous)]
}
```

命令

```js
truffle(Voting)> ins.candidateList
```

返回

```
[Function (anonymous)] {
  call: [Function (anonymous)],
  sendTransaction: [Function (anonymous)],
  estimateGas: [Function (anonymous)],
  request: [Function (anonymous)]
}
```

## 函数结果的遍历

```js
function printVotes() view public returns (bytes32[] memory, uint8[] memory) {
        uint len = candidateList.length;
        bytes32[] memory names = new bytes32[](len);
        uint8[] memory votes = new uint8[](len);
      
        for (uint i = 0; i < len; i++) {
            names[i] = candidateList[i];
            votes[i] = votesReceived[candidateList[i]];
        }
        return (names, votes);
    }
```

在truffle console环境下有三种方法打印结果

```js
// 回调函数
ins.printVotes(function(err, res){console.log(res)})
```

```js
// promise
ins.printVotes().then(function(res){console.log(res)})
```

```js
// await
res = await ins.printVotes()
console.log(res)
```
