'use strict'
var arr = new Array(100).fill(0).map((e, i) => i)
var res = 0

function myFor (arr) {
  for (let j = 0; j < 10_000_000; j++) {
    var tempSum = 0
    for (let index = 0; index < arr.length; index++) {
      tempSum += arr[index]
    }
    res += tempSum
  }
}

for (let c = 0; c < 5; c++) {
  console.time('for')
  myFor(arr)
  console.timeEnd('for') // ~625ms
}

console.log(res)