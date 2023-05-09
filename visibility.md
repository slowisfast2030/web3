# State Variable Visibility

## public

公共状态变量与内部变量的区别仅在于编译器会自动生成getter函数，使其他合约能够读取它们的值。

在同一合约中使用时，外部访问（例如 `this.x` ）调用getter，而内部访问（例如 `x` ）直接从存储中获取变量值。

## internal

内部状态变量只能从定义它们的合约及其派生合约中访问，无法从外部访问。

**这是状态变量的默认可见性级别。**

## private

私有状态变量类似于内部变量，但在派生合约中不可见。


# Function Visibility

## external

## public

## internal

## private
