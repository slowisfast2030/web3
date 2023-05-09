# new contract

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract C {
    uint public data = 42;
}

contract Caller {
    C c = new C();

    function f() public view returns (uint) {
        return c.data();
    }
}
```

当把这份文件粘贴进remix编译后，部署的时候会有两份合约选项：C和Caller。

> 现象：如果只部署合约Caller，会发生什么？调用函数f，返回42。

> 思考：说明 `C c = new C()`这一步会自动将合约C部署，合约C的地址存储在变量c中。
>
> 只不过合约c的地址不对外公开，只有合约Caller能够使用。

# 如何将new后的地址公开？

方法一：先部署合约C

方法二：在合约Caller中添加一个公开的函数

```solidity

// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract C {
    uint public data = 42;
}

contract Caller {
    C c = new C();

    function getCAddress() public view returns (C) {
        return c;
    }

    function f() public view returns (uint) {
        return c.data();
    }
}

contract LastCaller {
    C c;
  
    constructor(address _c) public {
        c = C(_c);
    }

    function f() public view returns (uint) {
        return c.data();
    }

}
```

将这份文件粘贴进remix进行编译，部署的时候会有3份合约可以选。

- step 1：部署合约Caller。调用函数f，返回42。调用函数getCAddress，返回 `0xAb78299A888637aD0DFd92A6bF9Faaf79D4075C4`
- step 2：部署合约LastCaller。部署的时候需要为构造函数传入地址，地址如上。调用函数f，返回42。

这个例子特别好的说明了，通过new关键字，确实部署了合约实例，只不过这个合约地址并不是直接对外开放，需要通过一些简单的方法，将这个合约地址暴露出来。拿到合约地址后，就可以在新的合约里使用。
