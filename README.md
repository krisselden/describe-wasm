# describe-wasm

Reads the interface info (imports, exports, and their signatures) from a wasm file.

Useful for generating type declarations.

```ts
function describeWasm(wasmbuffer: Uint8Array): WasmInfo;
```

## Example
```js
import * as fs from "fs";
import describeWasm from "describe-wasm";

const wasmInfo = describeWasm(fs.readFileSync("mylib.wasm"));

console.log(JSON.stringify(wasmInfo, null, 2));
```
