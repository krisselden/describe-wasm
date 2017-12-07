# describe-wasm

Reads interface info from a wasm file for building type declaration file.

```js
import * as fs from "fs";
import describeWasm from "describe-wasm";

const wasmInfo = describeWasm(fs.readFileSync("mylib.wasm"));

console.log(wasmInfo.signatures[0]);
console.log(wasmInfo.imports[0]);
console.log(wasmInfo.functions[0]);
console.log(wasmInfo.exports[0]);
```
