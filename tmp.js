'use strict';
let arr = new Array(100).fill(0).map((e, i) => i);
let res = 0

function myFor(arr) {
  let r2=res;
    for (let j = 0; j < 10_000_000; j++) {
        r2=cycle(r2);
    }
    res =r2; 
}

for (let c = 0; c < 5; c++) {
    console.time('for')
    myFor(arr)
    console.timeEnd('for') // ~1000ms
}
function cycle (rw) {
    let r=rw;
    for (let index = 0; index < arr.length; index++) {
    r += arr[index];
    }
    return r;
}
console.log(res);