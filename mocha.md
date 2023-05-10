# 一

在编写合约时，我们可以利用remix部署后的页面调用合约函数，进行单元测试；还可以将合约部署到私链，用geth控制台或者node命令进行交互测试。但这有很大的随意性，并不能形成标准化测试流程；而且手动一步步操作，比较繁琐，不易 保证重复一致。

于是我们想到，是否可以利用现成的前端技术栈实现合约的自动化测试呢？当然是可以的，mocha就是这样一个JavaScript测试框架。

## 1 安装依赖

开始编写测试脚本之前，我们首先需要安装依赖：测试框架mocha。当然，作为对合约的测试，模拟节点ganache荷web3.js库都是不可缺少的。

```sh
npm install -g mocha
```

进行单元测试，比较重要的一点是保证测试的独立性和隔离性，所以我们并不需要测试网络这种有复杂交互环境，甚至不需要本地私链保存测试历史。而ganahce基于内存模拟以太坊节点行为，每次启动都是一个干净的空白环境，所以非常适合我们做开发时单元测试。

## 2 mocha简介

mocha是JavaScript的一个单元测试框架，既可以在浏览器环境中运行，也可以在node.js环境下运行。我们只需要编写测试用例，mocha会将测试自动运行并给出测试结果。
mocha的主要特点有：

- 既可以测试简单的JavaScript函数，又可以测试异步代码；
- 可以自动运行所有测试，也可以只运行特定的测试；
- 可以支持before、after、beforeEach和afterEach来编写初始化代码。

## 3 测试脚本示例

函数脚本sum.js

```js
module.exports = function (...rest){
	var sum = 0;
	for (let n of rest) {
	    sum += n; 
	}
    return sum;
}
```

测试脚本testSum.js

```js
const assert = require('assert');
const sum = require('./sum.js');

assert.strictEqual( sum(), 0);
assert.strictEqual( sum(1), 1);
assert.strictEqual( sum(1,2), 3);
assert.strictEqual( sum(1,2,3), 6);

console.log('all assert passed');

```

执行

```sh
node testSum.js
```

返回

```sh
all assert passed
```

assert模块非常简单，它断言一个表达式为true。如果断言失败，就抛出Error。
**单独写一个test.js的缺点是没法自动运行测试，而且，如果第一个assert报错，后面的测试也执行不了了。**
如果有很多测试需要运行，就必须把这些测试全部组织起来，然后统一执行，并且得到执行结果。这就是我们为什么要用mocha来编写并运行测试。

## 4 基于mocha的测试脚本

测试脚本mochaSum.js

```js
const assert = require('assert');
const sum = require('./sum.js');

describe('#sum()', () => {
  it('should return 0', () => {
    assert.strictEqual(sum(), 0);
  });
  it('should return 1', () => {
    assert.strictEqual(sum(1), 1);
  });
  it('should return 3', () => {
    assert.strictEqual(sum(1, 2), 3);
  });
  it('should return 6', () => {
    assert.strictEqual(sum(1, 2, 3), 6);
  });
});
```

执行

```sh
mocha mochaSum.js
```

返回

```sh
#sum()
    ✔ should return 0
    ✔ should return 1
    ✔ should return 3
    ✔ should return 6


  4 passing (3ms)
```

如果有一个用例测试失败，不会影响后面用例的测试

```sh
#sum()
    ✔ should return 0
    ✔ should return 1
    1) should return 4
    ✔ should return 6


  3 passing (3ms)
  1 failing
```

# 二

测试时我们通常会把每次测试运行的环境隔离开，以保证互不影响。对应到合约测试，我们每次测试都需要部署新的合约实例，然后针对新的实例做功能测试。

## 合约Car.sol

```solidity
pragma solidity ^0.4.22; 
contract Car { 
	string public brand; 
	constructor(string initialBrand) public { 
		brand = initialBrand; 
	} 
	function setBrand(string newBrand) public {
		brand = newBrand; 
	}
}
```

Car 合约的功能比较简单，我们只要设计2个测试用例：

* 合约部署时传入的 brand 属性被正确存储
* 调用 setBrand 之后合约的 brand 属性被正确更新

## 测试文件cat.spec.js

```js
const assert = require('assert');
const path = require('path');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const contractPath = path.resolve(__dirname, './compiled/Car.json');
const {interface, bytecode} = require(contractPath);

let contract;
let accounts;
const initialBrand = 'BMW';

describe('#contract', ()=>{
        // 整个测试过程开始前执行
        before(()=>{
                console.log('测试开始！');
        });

        // 每一个测试用例执行前都会执行
        beforeEach(async ()=>{
        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(JSON.parse(interface))
                                .deploy({data:bytecode, arguments:[initialBrand]})
                                .send({from:accounts[0], gas:3000000});
        console.log('合约已部署！');
        });

        // 整个测试过程结束后执行
        after(()=>{
                console.log('测试结束！');
        });

        // 每一个测试用例执行后都会执行
        afterEach(()=>{
                console.log('当前测试已完成！');
        });

        // 测试用例1
        it('deployed contract sucessfully', ()=>{
                assert.ok(contract.options.address);
        });

        // 测试用例2
        it('should has a initial brand', async ()=>{
                let brand = await contract.methods.brand().call();
                assert.equal(brand, initialBrand);
        });

        // 测试用例3
        it('should set a new brand', async ()=>{
                const newBrand = 'Audi';
                await contract.methods.setBrand(newBrand)
                        .send({from:accounts[0]});
                let brand = await contract.methods.brand().call();
        assert.equal(brand, newBrand);
        });
        });

```

执行

```sh
mocha car.spec.js
```

返回

```sh
#contract
测试开始！

合约已部署
	deployed contract sucessfully
当前测试已完成！

合约已部署
	should has a initial brand
当前测试已完成！

合约已部署
	should set a new brand
当前测试已完成！

测试结束！
```

## 注意

上面的测试脚本中，在每一个测试用例之前都重新部署了一遍合约。

不得不说，使用mocha框架真的很方便！
