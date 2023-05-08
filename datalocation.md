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