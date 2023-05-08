# bytes32 in solidity and nodejs
## 在合约中定义bytes32数组
```solidity
bytes32[] public courseMap = [bytes32("Chinese"), "English", "Math", "Computer", "Music"];

function getCourses() view public returns (bytes32[] memory) {
        return courseMap;
}
```
## 在truffle console环境下调用函数
input:
```js
ins.getCourses()
```

output:
```js
[
  '0x4368696e65736500000000000000000000000000000000000000000000000000',
  '0x456e676c69736800000000000000000000000000000000000000000000000000',
  '0x4d61746800000000000000000000000000000000000000000000000000000000',
  '0x436f6d7075746572000000000000000000000000000000000000000000000000',
  '0x4d75736963000000000000000000000000000000000000000000000000000000'
]
```
## 在truffle console环境下如何将字符串转为bytes32
input:
```js
web3.utils.asciiToHex('Chinese')
```
output:
```js
'0x4368696e657365'
```

input:
```js
web3.utils.fromAscii('Chinese')
```
output:
```js
'0x4368696e657365'
```

