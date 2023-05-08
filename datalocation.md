# storage vs memory

## example1

```solidity
pragma solidity ^0.8.0;

contract Example {
    uint[] public numbers; // state variable stored in storage
  
    function addNumber(uint num) public {
        numbers.push(num); // modify the storage array
        uint[] memory copy = numbers; // copy the storage array to memory
        copy[0] = 0; // modify the memory array
    }
  
    function getNumber(uint index) public view returns (uint) {
        return numbers[index]; // return the storage value
    }
}

```

解释：

> 在这个合约中，我们有一个状态变量numbers，它是一个uint类型的数组，存储在storage中。我们有一个函数addNumber，它接受一个uint类型的参数num，并将其添加到numbers数组中。然后我们创建了一个memory类型的数组copy，并将numbers数组复制到copy中。接着我们修改了copy数组的第一个元素为0。最后我们有一个函数getNumber，它接受一个uint类型的参数index，并返回numbers数组中对应索引的元素。

> 如果我们部署这个合约，并调用addNumber(1)，那么我们会在storage中添加一个元素1到numbers数组中，同时在memory中创建一个copy数组，并将numbers数组复制到copy中。然后我们修改了copy数组的第一个元素为0，但是这不会影响到storage中的numbers数组。所以如果我们调用getNumber(0)，我们会得到1而不是0。

## example2

```solidity
bytes8[] public schoolList = [bytes8("PKU"), "THU", "FUDAN", "SJTU", "ZJU"]; 

function getSchools() view public returns (bytes8[] memory) { 
    return schoolList; 
}
```

解释：

> schoolList是存储在storage中的，但这里为何返回的是memory呢？
>
> 这里存在一个隐性的复制：storage ---> memory

思考：

> 这里为何多此一举进行storage --> memory的复制呢？
>
> 如果你直接返回storage类型，那么你返回的是一个指向storage中数据的指针，而不是数据本身。这样的话，如果你在函数外部对返回值进行修改，就会影响到storage中的数据。而如果你返回memory类型，那么你返回的是一个在内存中创建的副本，对它进行修改不会影响到storage中的数据。这样可以保护storage中的数据不被意外修改，也可以节省gas消耗。
