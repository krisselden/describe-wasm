"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const assert = require("assert");
const index_1 = require("./index");
const wasm = index_1.default(fs.readFileSync("rust.wasm"));
assert.deepEqual(wasm, {
    "signatures": [
        {
            "params": [
                "i32",
                "i32"
            ],
            "return": "void"
        },
        {
            "params": [
                "i32"
            ],
            "return": "i32"
        },
        {
            "params": [
                "i32",
                "i32"
            ],
            "return": "i32"
        },
        {
            "params": [
                "i32"
            ],
            "return": "void"
        },
        {
            "params": [],
            "return": "i32"
        },
        {
            "params": [
                "i32",
                "i32",
                "i32"
            ],
            "return": "i32"
        },
        {
            "params": [
                "i32",
                "i32",
                "i32"
            ],
            "return": "void"
        },
        {
            "params": [],
            "return": "void"
        }
    ],
    "imports": [
        {
            "module": "env",
            "name": "low_level_vm_debug_after",
            "kind": "Function",
            "signature": 0
        },
        {
            "module": "env",
            "name": "low_level_vm_debug_before",
            "kind": "Function",
            "signature": 1
        },
        {
            "module": "env",
            "name": "low_level_vm_evaluate_syscall",
            "kind": "Function",
            "signature": 0
        },
        {
            "module": "env",
            "name": "low_level_vm_heap_get_addr",
            "kind": "Function",
            "signature": 2
        },
        {
            "module": "env",
            "name": "low_level_vm_heap_get_by_addr",
            "kind": "Function",
            "signature": 2
        },
        {
            "module": "env",
            "name": "low_level_vm_program_opcode",
            "kind": "Function",
            "signature": 2
        }
    ],
    "functions": [
        3,
        4,
        3,
        5,
        6,
        6,
        2,
        2,
        3,
        2,
        3,
        1,
        6,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        3,
        3,
        0,
        0,
        0,
        3,
        1,
        7
    ],
    "exports": [
        {
            "name": "memory",
            "kind": "Memory",
            "index": 0
        },
        {
            "name": "stack_new",
            "kind": "Function",
            "index": 7
        },
        {
            "name": "stack_free",
            "kind": "Function",
            "index": 8
        },
        {
            "name": "stack_copy",
            "kind": "Function",
            "index": 9
        },
        {
            "name": "stack_write_raw",
            "kind": "Function",
            "index": 10
        },
        {
            "name": "stack_write",
            "kind": "Function",
            "index": 11
        },
        {
            "name": "stack_read_raw",
            "kind": "Function",
            "index": 12
        },
        {
            "name": "stack_read",
            "kind": "Function",
            "index": 13
        },
        {
            "name": "stack_reset",
            "kind": "Function",
            "index": 14
        },
        {
            "name": "low_level_vm_new",
            "kind": "Function",
            "index": 15
        },
        {
            "name": "low_level_vm_free",
            "kind": "Function",
            "index": 16
        },
        {
            "name": "low_level_vm_next_statement",
            "kind": "Function",
            "index": 17
        },
        {
            "name": "low_level_vm_evaluate",
            "kind": "Function",
            "index": 18
        },
        {
            "name": "low_level_vm_current_op_size",
            "kind": "Function",
            "index": 19
        },
        {
            "name": "low_level_vm_pc",
            "kind": "Function",
            "index": 20
        },
        {
            "name": "low_level_vm_set_pc",
            "kind": "Function",
            "index": 21
        },
        {
            "name": "low_level_vm_ra",
            "kind": "Function",
            "index": 22
        },
        {
            "name": "low_level_vm_set_ra",
            "kind": "Function",
            "index": 23
        },
        {
            "name": "low_level_vm_fp",
            "kind": "Function",
            "index": 24
        },
        {
            "name": "low_level_vm_set_fp",
            "kind": "Function",
            "index": 25
        },
        {
            "name": "low_level_vm_sp",
            "kind": "Function",
            "index": 26
        },
        {
            "name": "low_level_vm_set_sp",
            "kind": "Function",
            "index": 27
        },
        {
            "name": "low_level_vm_push_frame",
            "kind": "Function",
            "index": 28
        },
        {
            "name": "low_level_vm_pop_frame",
            "kind": "Function",
            "index": 29
        },
        {
            "name": "low_level_vm_goto",
            "kind": "Function",
            "index": 30
        },
        {
            "name": "low_level_vm_call",
            "kind": "Function",
            "index": 31
        },
        {
            "name": "low_level_vm_return_to",
            "kind": "Function",
            "index": 32
        },
        {
            "name": "low_level_vm_return",
            "kind": "Function",
            "index": 33
        },
        {
            "name": "low_level_vm_stack",
            "kind": "Function",
            "index": 34
        },
        {
            "name": "rust_eh_personality",
            "kind": "Function",
            "index": 35
        }
    ]
});
//# sourceMappingURL=test.js.map