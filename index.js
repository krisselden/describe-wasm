"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
;
const TypeNames = {
    [-0x01]: "i32",
    [-0x02]: "i64",
    [-0x03]: "f32",
    [-0x04]: "f64",
    [-0x10]: "anyfunc",
    [-0x20]: "func",
    [-0x40]: "void",
};
const ExternalKindNames = [
    "Function", "Table", "Memory", "Global"
];
function read(bytes) {
    const reader = {
        bytes,
        pos: 0,
    };
    assert.equal(readUInt32LE(reader), 0x6d736100, "magic");
    assert.equal(readUInt32LE(reader), 1, "version");
    const wasm = {
        signatures: [],
        imports: [],
        functions: [],
        exports: [],
    };
    while (reader.pos < reader.bytes.length) {
        readSection(reader, wasm);
    }
    return wasm;
}
exports.default = read;
function readSection(reader, wasm) {
    const sectionType = readUnsignedLEB128(reader);
    const sectionSize = readUnsignedLEB128(reader);
    const sectionEnd = reader.pos + sectionSize;
    if (sectionType === 1 /* Type */) {
        readTypeSection(reader, sectionEnd, wasm);
    }
    else if (sectionType === 2 /* Import */) {
        readImportSection(reader, sectionEnd, wasm);
    }
    else if (sectionType === 3 /* Function */) {
        readFunctionSection(reader, sectionEnd, wasm);
    }
    else if (sectionType === 7 /* Export */) {
        readExportSection(reader, sectionEnd, wasm);
    }
    else {
        reader.pos = sectionEnd;
    }
}
function readExportSection(reader, end, wasm) {
    const exportLength = readUnsignedLEB128(reader);
    for (let exportIndex = 0; exportIndex < exportLength; exportIndex++) {
        const name = readString(reader);
        const kind = ExternalKindNames[reader.bytes[reader.pos++]];
        const index = readUnsignedLEB128(reader);
        wasm.exports.push({
            name,
            kind,
            index,
        });
    }
    reader.pos = end;
}
function readImportSection(reader, end, wasm) {
    const importLength = readUnsignedLEB128(reader);
    for (let importIndex = 0; importIndex < importLength; importIndex++) {
        const mod = readString(reader);
        const name = readString(reader);
        const kind = reader.bytes[reader.pos++];
        switch (kind) {
            case 0 /* Function */:
                wasm.imports.push({
                    module: mod,
                    name,
                    kind: "Function",
                    signature: readUnsignedLEB128(reader),
                });
                break;
            case 3 /* Global */:
                wasm.imports.push({
                    module: mod,
                    name,
                    kind: "Global",
                    type: TypeNames[readSignedLEB128(reader)],
                    mutable: readUInt8(reader) === 1,
                });
                break;
            case 1 /* Table */:
                assert.equal(readSignedLEB128(reader), -16 /* anyfunc */);
            // fallthrough
            case 2 /* Memory */:
                const hasMax = readUInt8(reader) === 1;
                const initial = readUnsignedLEB128(reader);
                const entry = {
                    module: mod,
                    name,
                    kind: ExternalKindNames[kind],
                    initial,
                };
                if (hasMax) {
                    entry.maximum = readUnsignedLEB128(reader);
                }
                wasm.imports.push(entry);
                break;
        }
    }
    reader.pos = end;
}
function readTypeSection(reader, end, wasm) {
    const typeLength = readUnsignedLEB128(reader);
    for (let typeIndex = 0; typeIndex < typeLength; typeIndex++) {
        const type = {
            params: [],
            return: TypeNames[-64 /* void */],
        };
        wasm.signatures.push(type);
        assert.equal(readSignedLEB128(reader), -32 /* func */);
        const paramLength = readUnsignedLEB128(reader);
        for (let paramIndex = 0; paramIndex < paramLength; paramIndex++) {
            type.params.push(TypeNames[readSignedLEB128(reader)]);
        }
        const resultLength = readUnsignedLEB128(reader);
        if (resultLength > 0) {
            assert.equal(resultLength, 1);
            type.return = TypeNames[readSignedLEB128(reader)];
        }
    }
    reader.pos = end;
}
function readFunctionSection(reader, end, wasm) {
    const functionLength = readUnsignedLEB128(reader);
    for (let functionIndex = 0; functionIndex < functionLength; functionIndex++) {
        wasm.functions.push(readUnsignedLEB128(reader));
    }
    reader.pos = end;
}
function readString(reader) {
    const length = readUnsignedLEB128(reader);
    const start = reader.pos;
    const end = start + length;
    reader.pos = end;
    return reader.bytes.toString("utf8", start, end);
}
function readUInt32LE(reader) {
    const res = reader.bytes.readUInt32LE(reader.pos);
    reader.pos += 4;
    return res;
}
function readUInt8(reader) {
    const res = reader.bytes.readUInt8(reader.pos);
    reader.pos++;
    return res;
}
function readUnsignedLEB128(reader) {
    let result = 0;
    let shift = 0;
    while (true) {
        let byte = reader.bytes[reader.pos++];
        result |= (byte & 0x7f) << shift;
        if ((byte & 0x80) == 0)
            break;
        shift += 7;
    }
    return result;
}
function readSignedLEB128(reader) {
    let result = 0;
    let shift = 0;
    let byte;
    do {
        byte = reader.bytes[reader.pos++];
        result |= (byte & 0x7f) << shift;
        shift += 7;
    } while ((byte & 0x80) != 0);
    if (shift < 32 && (0x40 & byte)) {
        result |= (~0 << shift);
    }
    return result;
}
//# sourceMappingURL=index.js.map