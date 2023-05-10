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
