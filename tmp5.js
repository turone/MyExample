'use strict'
var arr = new Array(100).fill(0).map((e, i) => i)
var res = 0

function myFor(arr) {
    var temp = 0
    for (let index of arr) {
        var tempSum = 0;
        for (let j = 0; j < 10_000_000; j++) {
            tempSum += arr[index]
        }
        temp += tempSum
    }
    res += temp
}

for (let c = 0; c < 5; c++) {
    console.time('for')
    myFor(arr)
    console.timeEnd('for') // ~490ms
}

console.log(res)