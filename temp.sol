// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


contract A {
    uint x;
    function foo(address _b) public {
    // using call
    (bool success, bytes memory data) = _b.call(abi.encodeWithSignature("bar()"));
    require(success, "Call failed");
    
    // using delegatecall
    (success, data) = _b.delegatecall(abi.encodeWithSignature("bar()"));
    require(success, "Delegatecall failed");
}

}

contract B {
    uint x;
    function bar() public {
        x = 42;
    }
}

contract C {
    function baz(address _a, address _b) public {
        // invoke A's foo function
        A a = A(_a);
        a.foo(_b);
    }
}
