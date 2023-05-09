# node console

当ganache在本地起了一条私链后，这条私链就会自动开放rpc接口，方便我们查询区块链的数据。

web3.js就是实现查询功能的函数库。

启动node console

```js
Web3 = require('web3')
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))

accounts = await web3.eth.getAccounts()
accounts.forEach(async function(account){
	balance = await web3.eth.getBalance(account);
	console.log(account+':'+balance)})

```

returns

```js
0x0d432780D47bc46F84068e2cF83916B6289C0FdD:99885387880000000000
0xAE612df98813BE3525a74aE028b9A2046bd8bE15:100000000000000000000
0x449deF8a9Dda24BC384dc47958487cBD24E55E1f:100000000000000000000
0xB4055d6c601C19E713c5C89BeC863b3bcF13EDE3:100000000000000000000
0x3fa4d9654A4134f94BAbDd4d5C8A4786500af834:100000000000000000000
0x6FC4F5ba6Dfde6FE3d80676C871008dCB778B30a:100000000000000000000
0x20fba088C345Be0336329d33FD17Ca93fc2f83ed:100000000000000000000
0x213f99cA2867A2c737da0AF4c1DE72b85912ACE5:100000000000000000000
0x41b8e98d75f6A1602ea6E00afDEA54d6B7f8Ac90:100000000000000000000
0xCc3315d59D261b0517798606dCE558332D23A7f5:100000000000000000000
```

```js
for (let account of accounts) {
  let balance = await web3.eth.getBalance(account);
  console.log(account + ':' + balance);
}
```

```js
let balances = await Promise.all(accounts.map(account => web3.eth.getBalance(account)));
balances.forEach((balance, i) => console.log(accounts[i] + ':' + balance));
```

这两种做法也可以！
