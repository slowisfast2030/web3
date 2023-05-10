# abi + bytecode = deploy

```js
const Web3 = require('web3');
const fs = require('fs');

// 读取合约字节码和ABI文件
const bytecode = fs.readFileSync('./contract.bin');
const abi = JSON.parse(fs.readFileSync('./contract.abi'));

// 创建一个Web3实例
const web3 = new Web3('https://mainnet.infura.io/v3/<your-infura-project-id>');

// 创建合约对象
const contract = new web3.eth.Contract(abi);

// 部署合约
contract.deploy({
    data: bytecode,
})
.send({
    from: '<your-sender-address>',
    gas: 2000000, // 指定gas限制
})
.on('error', function(error) {
    console.error(error);
})
.on('transactionHash', function(transactionHash) {
    console.log('Transaction hash:', transactionHash);
})
.on('receipt', function(receipt) {
    console.log('Contract address:', receipt.contractAddress);
})
.then(function(newContractInstance) {
    console.log('Contract deployed successfully!');
});

```

如何获取字节码和abi有很多途径

下面给出了获取字节码和abi的方法

# solcjs solc

solcjs是可执行命令

solc是js库

通过solcjs命令，可以获取字节码和abi

```sh
solcjs --abi contract.sol

solcjs --bin contract.sol
```

也可以在js文件中导入solc库，对合约进行编译

```js
// 读取合约源代码文件
let source = fs.readFileSync('HelloWorld.sol', 'utf8');

// 编译合约源代码，得到合约的字节码和接口
let compiledContract = solc.compile(source, 1);

// 获取合约abi和bytecode
let abi = compiledContract.contracts[':HelloWorld'].interface;
let bytecode = compiledContract.contracts[':HelloWorld'].bytecode;
```

# truffle猜想

我们拿到solc的编译结果后，可以进一步将编译结果保存到contracts.json文件，这份文件中有abi和bytecode。

打开truffle的build文件夹，会发现，这里也有对应的json文件。

可以发现，当我们执行truffle compile命令的时候，其实背后就是执行了solc.compile命令，生成了对应的json文件。

为了保证每次编译的结果都是最新的，在保存json文件之前，需要对保存路径进行clean up。truffle也实现了这个功能。

所以在bilibili讲了很几个视频片段的编译脚本，其实就是在告诉我们truffle compile底层原理。

truffle migrate
