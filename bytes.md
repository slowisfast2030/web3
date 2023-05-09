# Dynamically-sized byte array

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract BytesExample {
  
    function test() public pure returns (byte, byte){
        // 创建一个长度为200的bytes变量
        bytes memory b = new bytes(200);
        // 修改第一个元素为0x01
        b[0] = 0x01;
        b[1] = 0x02;
        // 直接返回第二个元素，不需要再创建变量x
        return (b[0], b[1]);
    }
}

```

调用test函数，返回：

```solidity
0:
bytes1: 0x01
1:
bytes1: 0x02
```


# Fixed-size byte arrays

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract BytesExample {
  
    function test() public pure returns (byte, byte){
        // 创建一个仅含两个元素的bytes变量
        bytes2 b;
        // 修改第一个元素为0x01，第二个元素为0x02
        b = hex"0102";
        // 直接返回前两个元素
        return (b[0], b[1]);
    }
}

```

调用test函数，返回

```solidity
0:
bytes1: 0x01
1:
bytes1: 0x02
```

# 使用场景

在solidity中，Dynamically-sized byte array和Fixed-size byte arrays的使用场景不同。

- 根据Solidity文档 ，一般来说，如果你需要存储任意长度的原始字节数据，可以使用bytes类型；如果你需要存储任意长度的字符串（UTF-8）数据，可以使用string类型；如果你可以限制数据的长度为一定的字节数，那么最好使用bytes1到bytes32之间的类型，因为它们更便宜。
- Fixed-size byte arrays（bytes1到bytes32）是值类型，它们可以进行位运算，例如按位与(&)，按位或(|)，按位异或(^)，按位取反(~)，左移(<<)和右移(>>)等。它们也可以进行比较和赋值等操作。Fixed-size byte arrays可以用来存储固定长度的哈希值或密钥等数据。
- Dynamically-sized byte array（bytes）是引用类型，它们不能进行位运算，只能进行长度(length)和索引([])操作。它们可以用来存储任意长度的二进制数据，例如图片或文件等。Dynamically-sized byte array可以在内存或存储中使用，但是在存储中使用时会占用更多的空间和gas。

举例来说，如果你想要实现一个函数来连接两个字节数组，你可以使用以下代码：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library BytesUtils {
    // Concatenates two bytes arrays in memory
    function concat(bytes memory a, bytes memory b) internal pure returns (bytes memory) {
        bytes memory result = new bytes(a.length + b.length);
        uint k = 0;
        for (uint i = 0; i < a.length; i++) {
            result[k++] = a[i];
        }
        for (uint i = 0; i < b.length; i++) {
            result[k++] = b[i];
        }
        return result;
    }
}
```

# bytes --> string

只有动态长度的字节数组（bytes类型）才能直接转换为字符串（string类型），而固定长度的字节数组（bytes1到bytes32类型）则需要先转换为动态长度的字节数组，然后再转换为字符串。

* 使用显式转换：string memory s = string (b);其中b是bytes类型的变量。
* 使用abi.encodePacked函数：string memory s = string (abi.encodePacked (b));其中b是任意字节数组类型的变量，该函数会将其打包为一个动态长度的字节数组，然后再转换为字符串。


# string --> bytes
