import * as assert from "assert";

const enum SectionType {
  Custom = 0,
  Type = 1,
  Import = 2,
  Function = 3,
  Table = 4,
  Memory = 5,
  Global = 6,
  Export = 7,
  Start = 8,
  Element = 9,
  Code = 10,
  Data = 11
}

const enum Type {
  i32 = -0x01,
  i64 = -0x02,
  f32 = -0x03,
  f64 = -0x04,
  anyfunc = -0x10,
  func = -0x20,
  void = -0x40,
};

const TypeNames = {
  [-0x01]: "i32",
  [-0x02]: "i64",
  [-0x03]: "f32",
  [-0x04]: "f64",
  [-0x10]: "anyfunc",
  [-0x20]: "func",
  [-0x40]: "void",
}

const enum ExternalKind {
  Function = 0,
  Table = 1,
  Memory = 2,
  Global = 3,
}

const ExternalKindNames = [
  "Function", "Table", "Memory", "Global"
]

export interface Signature {
  params: string[];
  return: string;
}

export interface Export {
  name: string;
  kind: string,
  index: number;
}

export interface FunctionImport {
  module: string,
  name: string;
  kind: "Function";
  signature: number;
}

export interface TableImport {
  module: string,
  name: string;
  kind: "Table";
  initial: number;
  maximum?: number;
}

export interface MemoryImport {
  module: string,
  name: string;
  kind: "Memory";
  initial: number;
  maximum?: number;
}

export interface GlobalImport {
  module: string,
  name: string;
  kind: "Global";
  type: string;
  mutable: boolean;
}

export type Import = FunctionImport | TableImport | MemoryImport | GlobalImport;

export interface Wasm {
  signatures: Signature[];
  imports: Import[];
  functions: number[];
  exports: Export[];
}

export default function read(bytes: Uint8Array) {
  const reader = {
    bytes,
    pos: 0,
  };
  assert.equal(readUint32LE(reader), 0x6d736100, "magic");
  assert.equal(readUint32LE(reader), 1, "version");

  const wasm: Wasm = {
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

function readSection(reader: Reader, wasm: Wasm) {
  const sectionType = readLEB128(reader) as SectionType;
  const sectionSize = readLEB128(reader);
  const sectionEnd = reader.pos + sectionSize;
  if (sectionType === SectionType.Type) {
    readTypeSection(reader, sectionEnd, wasm);
  } else if (sectionType === SectionType.Import) {
    readImportSection(reader, sectionEnd, wasm);
  } else if (sectionType === SectionType.Function) {
    readFunctionSection(reader, sectionEnd, wasm);
  } else if (sectionType === SectionType.Export) {
    readExportSection(reader, sectionEnd, wasm);
  } else {
    reader.pos = sectionEnd;
  }
}

function readExportSection(reader: Reader, end: number, wasm: Wasm) {
  const exportLength = readLEB128(reader);
  for (let exportIndex = 0; exportIndex < exportLength; exportIndex++) {
    const name = readString(reader);
    const kind = ExternalKindNames[readUint8(reader) as ExternalKind];
    const index = readLEB128(reader);
    wasm.exports.push({
      name,
      kind,
      index,
    });
  }
  reader.pos = end;
}

function readImportSection(reader: Reader, end: number, wasm: Wasm) {
  const importLength = readLEB128(reader);
  for (let importIndex = 0; importIndex < importLength; importIndex++) {
    const mod = readString(reader);
    const name = readString(reader);
    const kind = readUint8(reader) as ExternalKind;
    switch (kind) {
      case ExternalKind.Function:
        wasm.imports.push({
          module: mod,
          name,
          kind: "Function",
          signature: readLEB128(reader),
        });
        break;
      case ExternalKind.Global:
        wasm.imports.push({
          module: mod,
          name,
          kind: "Global",
          type: TypeNames[readSignedLEB128(reader) as Type],
          mutable: readUint8(reader) === 1,
        });
        break;
      case ExternalKind.Table:
        assert.equal(readSignedLEB128(reader), Type.anyfunc);
        // fallthrough
      case ExternalKind.Memory:
        const hasMax = readUint8(reader) === 1;
        const initial = readLEB128(reader);
        const entry: any = {
          module: mod,
          name,
          kind: ExternalKindNames[kind] as ("Table" | "Memory"),
          initial,
        };
        if (hasMax) {
          entry.maximum = readLEB128(reader);
        }
        wasm.imports.push(entry);
        break;
    }

  }
  reader.pos = end;
}

function readTypeSection(reader: Reader, end: number, wasm: Wasm) {
  const typeLength = readLEB128(reader);
  for (let typeIndex = 0; typeIndex < typeLength; typeIndex++) {
    const type: Signature = {
      params: [],
      return: TypeNames[Type.void],
    };
    wasm.signatures.push(type);

    assert.equal(readSignedLEB128(reader), Type.func);

    const paramLength = readLEB128(reader);
    for (let paramIndex = 0; paramIndex < paramLength; paramIndex++) {
      type.params.push(TypeNames[readSignedLEB128(reader) as Type]);
    }

    const resultLength = readLEB128(reader);
    if (resultLength > 0) {
      assert.equal(resultLength, 1);
      type.return = TypeNames[readSignedLEB128(reader) as Type];
    }
  }
  reader.pos = end;
}

function readFunctionSection(reader: Reader, end: number, wasm: Wasm) {
  const functionLength = readLEB128(reader);
  for (let functionIndex = 0; functionIndex < functionLength; functionIndex++) {
    wasm.functions.push(readLEB128(reader));
  }
  reader.pos = end;
}

function readString(reader: Reader): string {
  const length = readLEB128(reader);
  return readUTF8(reader, length);
}

function readUTF8(reader: Reader, length: number): string {
  let str = "";
  const end = reader.pos + length;
  while (reader.pos < end) {
    str += String.fromCodePoint(readUTF8CodePoint(reader));
  }
  return str;
}

function readUTF8CodePoint(reader: Reader) {
  let codepoint = readUint8(reader);
  if (codepoint < 0x80) {
    return codepoint;
  }
  let bytes = 0;
  do {
    codepoint = (codepoint << 1) & 0xff;
    bytes++;
  } while (codepoint & 0x80 && bytes < 5);
  codepoint = codepoint >> bytes;
  if (bytes === 1) {
    return 0xfffd;
  }
  while (--bytes) {
    let byte = readUint8(reader);
    if ((byte & 0xc0) !== 0x80) {
      return 0xfffd;
    }
    codepoint = (codepoint << 6) + (byte & 0x3f);
  }
  return codepoint;
}

function readUint32LE(reader: Reader): number {
  return (
    (readUint8(reader) | (readUint8(reader) << 8) | (readUint8(reader) << 16)) +
    readUint8(reader) * 0x1000000
  );
}

function readUint8(reader: Reader): number {
  return reader.bytes[reader.pos++];
}

// TODO this does not handle sign bit for uint32
function readLEB128(reader: Reader): number {
  let result = 0;
  let shift = 0;
  while(true) {
    let byte = readUint8(reader);
    result |= (byte & 0x7f) << shift;
    if ((byte & 0x80) == 0)
      break;
    shift += 7;
  }
  return result;
}

function readSignedLEB128(reader: Reader): number {
  let result = 0;
  let shift = 0;
  let byte;
  do {
    byte = readUint8(reader);
    result |= (byte & 0x7f) << shift;
    shift += 7;
  } while((byte & 0x80) != 0);

  if (shift < 32 && (0x40 & byte)) {
    result |= (~0 << shift);
  }

  return result;
}

interface Reader {
  bytes: Uint8Array;
  pos: number;
}
