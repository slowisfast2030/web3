# abi + bytecode = deploy

```js
const Web3 = require('web3');
const fs = require('fs');

// 连接到以太坊节点
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// 读取合约的字节码和 ABI
const bytecode = fs.readFileSync('contract.bin').toString();
const abi = JSON.parse(fs.readFileSync('contract.abi').toString());

// 创建一个合约对象
const MyContract = new web3.eth.Contract(abi);

// 构造合约部署参数
const deployParams = {
  data: bytecode,
  arguments: [/* 合约构造函数参数 */]
};

// 获取部署账户
const account = web3.eth.accounts.privateKeyToAccount('0x你的私钥');

// 发送部署交易
MyContract.deploy(deployParams)
  .send({
    from: account.address,
    gas: 2000000, // 设置 gas 上限
    gasPrice: '1000000000' // 设置 gas 价格
  })
  .on('error', (error) => {
    console.error('部署合约出错：', error);
  })
  .on('transactionHash', (transactionHash) => {
    console.log('交易哈希：', transactionHash);
  })
  .on('receipt', (receipt) => {
    console.log('合约部署成功：', receipt.contractAddress);
  });

```

如何获取字节码和abi有很多途径
