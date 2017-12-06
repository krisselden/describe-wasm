/// <reference types="node" />
export interface Signature {
    params: string[];
    return: string;
}
export interface Export {
    name: string;
    kind: string;
    index: number;
}
export interface FunctionImport {
    module: string;
    name: string;
    kind: "Function";
    signature: number;
}
export interface TableImport {
    module: string;
    name: string;
    kind: "Table";
    initial: number;
    maximum?: number;
}
export interface MemoryImport {
    module: string;
    name: string;
    kind: "Memory";
    initial: number;
    maximum?: number;
}
export interface GlobalImport {
    module: string;
    name: string;
    kind: "Global";
    type: string;
    mutable: boolean;
}
export declare type Import = FunctionImport | TableImport | MemoryImport | GlobalImport;
export interface Wasm {
    signatures: Signature[];
    imports: Import[];
    functions: number[];
    exports: Export[];
}
export default function read(bytes: Buffer): Wasm;
