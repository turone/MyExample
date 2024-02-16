'use strict';
class cl {
    constructor() {
        this.arr = new Array(100).fill(0).map((e, i) => i);
        this.res = 0;
    }
    myFor(arr) {
        for (let index of arr) {
            for (let j = 0; j < 10000000; j++) {
                this.res += arr[index];
            }
        }
    }
}

const t = new cl();
for (let c = 0; c < 5; c++) {
    console.time('for')
    t.myFor(t.arr);
    console.timeEnd('for') // ~3500ms
}

console.log(t.res);