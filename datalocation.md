# 疑问

每一个引用类型都会有data location，可以是storage、memory和calldata。

比如说，一个mapping，存储在storage区域。

```solidity
mapping(bytes32 => uint8) public votesReceived;
```

我们知道votesReceived是指向storage的引用，那么这个引用本身存储在哪里呢？

个人猜测：引用本身和值类型一样的存储。

# storage variable作为函数参数

```solidity
contract StorageExample {
    struct S {string a; uint b;}
    S s = S("storage", 1); // 状态变量，默认为storage

    function storageToMemory(S storage x) internal {
        S memory tmp = x; // 从storage拷贝到memory
        tmp.a = "Test"; // 不影响storage
    }

    function memoryToStorage(S memory tmp) internal {
        s = tmp; // 从memory拷贝到storage
        tmp.a = "Test"; // 不影响storage
    }

    function storageToStorage(S storage x) internal {
        S storage tmp = x; // 引用传递
        tmp.a = "Test"; // 影响storage
    }
}
```

storage variable可以作为函数参数的，但函数的类型必须为internal或者private。

# storage memory code

```solidity
contract PokemonContract {
    struct Pokemon {
        string name;
        uint power;
        uint stamina;
        uint level;
    }

    Pokemon[] pokemonCollection;

    function levelUp(uint _index) public {
        // 将此变量声明为`storage`意味着它实际上是一个指针
        // 指向pokemonCollection [_index]
        Pokemon storage selectedPokemon = pokemonCollection[_index];
        // 因此更新它将导致
        // 在区块链上更改pokemonCollection [_index]。
        selectedPokemon.level += 1;

        // 使用`memory`变量将是数据的副本
        Pokemon memory anotherPokemon = pokemonCollection[_index + 1];
        // 更新它不会修改存储在区块链中的数据
        anotherPokemon.level += 1;
        // 并且变量将在函数执行结束后丢失
    }
}

```

```solidity
contract Example {
    uint256[] public numbers; // storage variable

    function foo() public {
        numbers.push(1); // numbers = [1]
        uint256[] storage localNumbers = numbers; // create a reference to numbers
        localNumbers.push(2); // numbers = [1, 2], localNumbers = [1, 2]
        uint256[] memory memoryNumbers = new uint256[](2); // create a new memory array
        memoryNumbers[0] = 3; // memoryNumbers = [3, 0]
        memoryNumbers[1] = 4; // memoryNumbers = [3, 4]
        uint256[] memory anotherMemoryNumbers = memoryNumbers; // create a reference to memoryNumbers
        anotherMemoryNumbers[0] = 5; // memoryNumbers = [5, 4], anotherMemoryNumbers = [5, 4]
    }
}
```

```solidity
contract Example {
    uint256[] public numbers; // storage variable

    function foo() public {
        numbers.push(1); // numbers = [1]
        uint256[] memory memoryNumbers = numbers; // create a copy of numbers in memory
        memoryNumbers.push(2); // numbers = [1], memoryNumbers = [1, 2]
        numbers = memoryNumbers; // create a copy of memoryNumbers in storage
        numbers.push(3); // numbers = [1, 2, 3], memoryNumbers = [1, 2]
    }
}
```

```solidity
contract Example {
    struct Person {
        string name;
        uint256 age;
    }

    Person[] public people; // storage variable

    function foo() public {
        people.push(Person("Alice", 20)); // people = [{name: "Alice", age: 20}]
        Person memory memoryPerson = Person("Bob", 30); // create a new memory struct
        memoryPerson.age = 40; // memoryPerson = {name: "Bob", age: 40}
        people.push(memoryPerson); // create a copy of memoryPerson in storage
        people[1].age = 50; // people = [{name: "Alice", age: 20}, {name: "Bob", age: 50}], memoryPerson = {name: "Bob", age: 40}
        Person storage storagePerson = people[0]; // create a reference to people[0]
        storagePerson.age = 25; // people = [{name: "Alice", age: 25}, {name: "Bob", age: 50}], storagePerson = {name: "Alice", age: 25}
        Person memory anotherMemoryPerson = storagePerson; // create a copy of storagePerson in memory
        anotherMemoryPerson.age = 35; // people = [{name: "Alice", age: 25}, {name: "Bob", age: 50}], storagePerson = {name: "Alice", age: 25}, anotherMemoryPerson = {name: "Alice", age: 35}
    }
}

```

```solidity
contract Example {
    uint256[] public numbers; // storage variable

    function foo(uint256[] calldata input) external {
        uint256[] memory memoryNumbers = input; // create a copy of input in memory
        memoryNumbers.push(1); // input = [], memoryNumbers = [1]
        numbers = input; // create a copy of input in storage
        numbers.push(2); // input = [], numbers = [2]
    }
}
```

# storage vs memory

## example1 数据复制：storage --> memory

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

## example2 数据复制：storage --> memory

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

注：

> 返回memory类型，返回的也是内存中数据的指针。

## example3 直接返回storage中的数据

思考：

> 上一个示例已经知道，storage类型的数据一般不作为返回值类型，主要是当心外部调用者获得storage数据的指针后，会恶意修改。基于此，如果是内部函数呢？不就可以返回storage类型了吗？事实确实如此！
>
> 如果你想直接返回storage中的数据，你可以使用storage类型的返回值，但是这只能在internal函数中使用，因为public和external函数不能返回storage引用。

```solidity
pragma solidity ^0.8.0;

contract Example {
    uint[] public numbers; // state variable stored in storage
  
    function getNumbers() internal view returns (uint[] storage) {
        return numbers; // return the storage reference
    }
  
    function addNumber(uint num) public {
        uint[] storage array = getNumbers(); // get the storage reference
        array.push(num); // modify the storage array
    }
}
```

解释：

> 在这个例子中，我们有一个internal函数getNumbers，它返回一个storage类型的数组，就是numbers状态变量。我们有一个public函数addNumber，它调用getNumbers函数，并得到一个storage类型的数组array，它指向numbers状态变量。然后我们修改array数组，这也会修改numbers状态变量。

总结：

> public和external函数不能返回storage引用是因为这样会暴露合约的内部状态给外部调用者，可能会造成安全风险。storage引用只能在internal和private函数中使用，因为它们只能被同一个合约或者继承的合约调用。如果你想让public或external函数返回storage中的数据，你可以使用memory类型的返回值，这样会在memory中创建一个storage数据的副本，并返回给调用者。

## example4

```solidity
contract PokemonContract {
    struct Pokemon {
        string name;
        uint power;
        uint stamina;
        uint level;
    }

    Pokemon[] pokemonCollection;

    function levelUp(uint _index) public {
        // Declaring this variable as`storage` means it'll actually a pointer
        // to pokemonCollection [_index]
        Pokemon storage selectedPokemon = pokemonCollection[_index];
        // so updating it will cause that it will change
        // pokemonCollection [_index] on the blockchain.
        selectedPokemon.level += 1;

    	// Using`memory` the variable will be a copy of the data
        Pokemon memory anotherPokemon = pokemonCollection[_index + 1];
        // updating it will not modify the data stored in the blockchain
        anotherPokemon.level += 1;
        // and the variable will be lost once the function execution ends
    }
}
```

# memory vs calldata

## example1

```solidity
pragma solidity 0.8.10;

contract Test {
    string stringTest;

    // This function uses memory for the parameter and the return value
    function memoryTest(string memory _exampleString) public returns (string memory) {
        _exampleString = "example"; // You can modify memory
        string memory newString = _exampleString; // You can use memory within a function's logic
        return newString; // You can return memory
    }

    // This function uses calldata for the parameter and memory for the return value
    function calldataTest(string calldata _exampleString) external returns (string memory) {
        // _exampleString = "example"; // You cannot modify calldata
        // string calldata newString = _exampleString; // You cannot use calldata within a function's logic
        return _exampleString; // You can return calldata as memory
    }
}
```

解释：

- Memory is used to hold temporary variables during function execution, while calldata is used to hold function arguments passed in from an external caller.
- Memory is mutable and can be modified within a function, while calldata is immutable and cannot be changed. Memory can be used for both function declaration parameters and within the function logic, while calldata can only be used for function declaration parameters.
- Memory must be used for dynamic parameters of an internal or public function, while calldata must be used for dynamic parameters of an external function.

# public vs external

## example1

```solidity
pragma solidity ^0.8.0;

contract Test {
    // A public function that can be called externally or internally
    function add(uint[] memory _arr) public pure returns (uint) {
        uint sum = 0;
        for (uint i = 0; i < _arr.length; i++) {
            sum += _arr[i];
        }
        return sum;
    }

    // An external function that can only be called externally
    function mul(uint[] calldata _arr) external pure returns (uint) {
        uint product = 1;
        for (uint i = 0; i < _arr.length; i++) {
            product *= _arr[i];
        }
        return product;
    }
}
```

思考：

> 可以有如下近似等式
>
> public = external + internal

总结：

- Public and external functions are both callable from outside the contract, but they differ in how they handle arguments and how they can be called internally.
- Public functions can be called either externally or internally, meaning from within the contract or from another contract.
- When a public function is called externally, Solidity copies the arguments to memory, which can be expensive if the arguments are large arrays of data. When a public function is called internally, it uses pointers to memory locations, which is cheaper and faster. 这句话感觉非常奇怪！！！这就涉及到一个根本问题：arguments一开始在哪里？从前文表述来看，arguments像是一开始就在内存中。被外部调用的时候，会被复制一遍；被内部调用的时候，直接使用指针。暂时默认参数一开始在calldata中！
- External functions read the arguments directly from calldata, which is a special data location that contains the function arguments. Reading from calldata is cheaper than copying to memory, so external functions can save gas when dealing with large arrays of data.

## example2

Q：

> 当一个 public 函数被外部调用时，Solidity 会将参数复制到内存中，这样才能在函数内部使用它们。将参数复制到内存中，那么参数一开始在哪里？

A:

> 当一个 public 函数被外部调用时，参数一开始在 calldata 中。calldata 是一种特殊的数据位置，它包含了外部函数调用的参数。calldata 是只读的，不能被修改。Solidity 会将参数从 calldata 复制到内存中，这样才能在函数内部使用它们。复制到内存中会消耗一些 gas，所以如果参数是大型数组的话，可能会比较昂贵。

## example3 本质思考

```solidity
pragma solidity^0.4.12;

contract Test {
    function test(uint[20] a) public returns (uint){
         return a[10]*2;
    }

    function test2(uint[20] a) external returns (uint){
         return a[10]*2;
    }
}
```

Calling each function, we can see that the `public` function uses 496 gas, while the `external` function uses only 261.

public函数会比external函数更加消耗gas！

The difference is because in public functions, Solidity immediately copies array arguments to memory, while external functions can read directly from calldata. Memory allocation is expensive, whereas reading from calldata is cheap.

这句话的潜台词：对于外部调用，参数会从calldata --> memory。

延伸出一个进阶的问题：为什么piublic函数的参数不从calldata读取呢？

The reason that `public` functions need to write all of the arguments to memory is that public functions may be called internally, which is actually an entirely different process than external calls. Internal calls are executed via jumps in the code, and array arguments are passed internally by pointers to memory.

Thus, when the compiler generates the code for an internal function, that function expects its arguments to be located in memory.这句话的潜台词就是public函数可能在合约内部被调用，这种可能性拖累了public函数，使得多出了拷贝至内存的操作！

For external functions, the compiler doesn't need to allow internal calls, and so it allows arguments to be read directly from calldata, saving the copying step.

external函数直接读取calldata内容，省去了复制操作！

总结：

当一个函数可以被设计成仅被外部调用，又传入大量参数，那么选择external！

# new bing解释data location change

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.0 <0.9.0;

contract StorageLocation {
    Person[] public persons;

    struct Person {
        string name;
        uint age;
        address personAddress;
    }

    constructor() {
       // 在构造函数中，newperson和personTwo都是memory类型的Person结构体，它们是在内存中创建的临时变量。
       Person memory newperson = Person({
           name: "Jamie",
           age: 33,
           personAddress: msg.sender
       });

       Person memory personTwo = Person({
           name: "Bones Man",
           age: 33,
           personAddress: msg.sender
       });
       // 当把newperson和personTwo推入persons数组时，它们会被复制到storage类型的数组中，
       // 因为persons是一个状态变量，默认存储在区块链上。
       persons.push(newperson);
       persons.push(personTwo);
    }

    // 在loadPerson函数中，返回值是一个memory类型的Person数组，它是一个persons数组的副本，存储在内存中。
    function loadPerson() public view returns ( Person[] memory ){
        return persons;
    }
 
    // 在changeDataone函数中，person是一个memory类型的Person结构体，它是从persons数组中复制出来的一个元素。
    // 当修改person.age时，并不会影响persons数组中的数据。
    function changeDataone() public view {
        Person memory person = persons[0];
        person.age = 56;
    }
  
    // 在changeDataTwo函数中，person是一个storage类型的Person结构体，它是一个指向persons数组中第一个元素的引用。
    // 当修改person.age时，会直接改变persons数组中的数据。
    function changeDataTwo() public {
        Person storage person = persons[0];
        person.age = 76;
    }

    // 在receiveAsCallData函数中，参数a是一个calldata类型的uint256数组，它是不可修改的，并且只能用于外部函数。
    function receiveAsCallData(uint256[] calldata a) public {
        //you can not modify a
    }
}

```

# public external internel private

- **public -** all can access public
- **external -** Cannot be accessed internally, only externally
- **internal -** only this contract and contracts deriving from it can access
- **private -** can be accessed only from this contract

# 函数参数的复制问题

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract C {
    // The data location of x is storage.
    // This is the only place where the
    // data location can be omitted.
    uint[] x;

    // The data location of memoryArray is memory.
    function f(uint[] memory memoryArray) public {
        x = memoryArray; // works, copies the whole array to storage
        uint[] storage y = x; // works, assigns a pointer, data location of y is storage
        y[7]; // fine, returns the 8th element
        y.pop(); // fine, modifies x through y
        delete x; // fine, clears the array, also modifies y
        // The following does not work; it would need to create a new temporary /
        // unnamed array in storage, but storage is "statically" allocated:
        // y = memoryArray;
        // Similarly, "delete y" is not valid, as assignments to local variables
        // referencing storage objects can only be made from existing storage objects.
        // It would "reset" the pointer, but there is no sensible location it could point to.
        // For more details see the documentation of the "delete" operator.
        // delete y;
        g(x); // calls g, handing over a reference to x
        h(x); // calls h and creates an independent, temporary copy in memory
    }

    function g(uint[] storage _x) internal pure {}
    function h(uint[] memory _x) public pure {}
}
```

以前一直对于 `function h(uint[] memory) public pure{}`

感到很疑惑，即函数参数是memory类型。经常看到的表述是，当函数类型是public的时候，函数参数会复制到内存中。

当时一直很疑惑的点，复制的源头在哪里呢？

在这个例子中，h函数的参数源头是状态变量。





# 参考文献

[Solidity Fundamentals](https://medium.com/coinmonks/solidity-fundamentals-a71bf54c0b98)
