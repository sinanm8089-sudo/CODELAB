"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Search,
  RotateCcw,
  Clock,
  ArrowRight,
  Sparkles,
  GitCommit,
  Hash,
  Database,
  GitBranch,
  GitFork,
  Split,
  ChevronRight,
  Info
} from "lucide-react";

export const DataStructuresView: React.FC = () => {
  const [activeDs, setActiveDs] = useState<
    "array" | "stack" | "queue" | "deque" | "linked-list" | "hash-table" | "bst" | "heap" | "trie" | "dsu"
  >("stack");

  // State for Array
  const [arrayItems, setArrayItems] = useState<number[]>([15, 32, 47, 88, 23]);
  const [arrayValInput, setArrayValInput] = useState("");
  const [arrayIdxInput, setArrayIdxInput] = useState("0");

  // State for Stack
  const [stackItems, setStackItems] = useState<number[]>([10, 25, 42]);
  const [stackInput, setStackInput] = useState("");

  // State for Queue
  const [queueItems, setQueueItems] = useState<number[]>([5, 12, 19, 31]);
  const [queueInput, setQueueInput] = useState("");

  // State for Deque
  const [dequeItems, setDequeItems] = useState<number[]>([100, 200, 300]);
  const [dequeInput, setDequeInput] = useState("");

  // State for Linked List
  const [llNodes, setLlNodes] = useState<number[]>([100, 200, 300]);
  const [llInput, setLlInput] = useState("");

  // State for Hash Table
  const [hashBuckets, setHashBuckets] = useState<Array<Array<{ key: string; value: string }>>>([
    [{ key: "apple", value: "red" }],
    [],
    [{ key: "banana", value: "yellow" }, { key: "blueberry", value: "blue" }],
    [{ key: "grape", value: "purple" }],
    []
  ]);
  const [hashKeyInput, setHashKeyInput] = useState("");
  const [hashValInput, setHashValInput] = useState("");

  // State for BST
  const [bstNodes, setBstNodes] = useState<number[]>([50, 30, 70, 20, 40, 60, 80]);
  const [bstInput, setBstInput] = useState("");

  // State for Heap
  const [heapItems, setHeapItems] = useState<number[]>([90, 65, 70, 35, 40, 55, 60]);
  const [heapInput, setHeapInput] = useState("");

  // State for Trie
  const [trieWords, setTrieWords] = useState<string[]>(["code", "coder", "coding", "data", "deep"]);
  const [trieInput, setTrieInput] = useState("");
  const [triePrefixSearch, setTriePrefixSearch] = useState("");

  // State for DSU
  const [dsuParents, setDsuParents] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [dsuRanks, setDsuRanks] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [dsuUInput, setDsuUInput] = useState("0");
  const [dsuVInput, setDsuVInput] = useState("1");

  const [message, setMessage] = useState("Select a data structure and execute operations to inspect live memory transformations.");

  // Array Handlers
  const handleArrayInsert = () => {
    const val = parseInt(arrayValInput.trim(), 10);
    const idx = parseInt(arrayIdxInput.trim(), 10);
    if (isNaN(val) || isNaN(idx)) return;
    if (idx < 0 || idx > arrayItems.length) {
      setMessage(`IndexOutOfBounds: Index ${idx} is outside bounds [0..${arrayItems.length}].`);
      return;
    }
    const next = [...arrayItems];
    next.splice(idx, 0, val);
    setArrayItems(next);
    setArrayValInput("");
    setMessage(`Inserted ${val} at index ${idx}. Elements right of ${idx} shifted in O(N) time.`);
  };

  const handleArrayDelete = (idx: number) => {
    const deleted = arrayItems[idx];
    const next = arrayItems.filter((_, i) => i !== idx);
    setArrayItems(next);
    setMessage(`Deleted element ${deleted} at index ${idx}. Elements shifted left in O(N) time.`);
  };

  // Stack Handlers
  const handlePushStack = () => {
    const val = parseInt(stackInput.trim(), 10);
    if (isNaN(val)) return;
    if (stackItems.length >= 8) {
      setMessage("Stack Overflow warning: maximum display capacity reached.");
      return;
    }
    setStackItems([...stackItems, val]);
    setStackInput("");
    setMessage(`Pushed element ${val} onto top of Stack (LIFO). Time: O(1).`);
  };

  const handlePopStack = () => {
    if (stackItems.length === 0) {
      setMessage("Stack Underflow warning: Stack is empty.");
      return;
    }
    const popped = stackItems[stackItems.length - 1];
    setStackItems(stackItems.slice(0, -1));
    setMessage(`Popped element ${popped} from top of Stack. Time: O(1).`);
  };

  // Queue Handlers
  const handleEnqueue = () => {
    const val = parseInt(queueInput.trim(), 10);
    if (isNaN(val)) return;
    if (queueItems.length >= 8) {
      setMessage("Queue Full: capacity reached.");
      return;
    }
    setQueueItems([...queueItems, val]);
    setQueueInput("");
    setMessage(`Enqueued element ${val} at the REAR of the Queue (FIFO). Time: O(1).`);
  };

  const handleDequeue = () => {
    if (queueItems.length === 0) {
      setMessage("Queue is empty: cannot dequeue.");
      return;
    }
    const dequeued = queueItems[0];
    setQueueItems(queueItems.slice(1));
    setMessage(`Dequeued element ${dequeued} from FRONT of the Queue. Time: O(1).`);
  };

  // Deque Handlers
  const handleDequeAddFront = () => {
    const val = parseInt(dequeInput.trim(), 10);
    if (isNaN(val)) return;
    setDequeItems([val, ...dequeItems]);
    setDequeInput("");
    setMessage(`Added ${val} at FRONT of Deque. Time: O(1).`);
  };

  const handleDequeAddRear = () => {
    const val = parseInt(dequeInput.trim(), 10);
    if (isNaN(val)) return;
    setDequeItems([...dequeItems, val]);
    setDequeInput("");
    setMessage(`Added ${val} at REAR of Deque. Time: O(1).`);
  };

  const handleDequePopFront = () => {
    if (dequeItems.length === 0) return;
    const val = dequeItems[0];
    setDequeItems(dequeItems.slice(1));
    setMessage(`Removed ${val} from FRONT of Deque. Time: O(1).`);
  };

  const handleDequePopRear = () => {
    if (dequeItems.length === 0) return;
    const val = dequeItems[dequeItems.length - 1];
    setDequeItems(dequeItems.slice(0, -1));
    setMessage(`Removed ${val} from REAR of Deque. Time: O(1).`);
  };

  // Linked List Handlers
  const handleInsertHead = () => {
    const val = parseInt(llInput.trim(), 10);
    if (isNaN(val)) return;
    setLlNodes([val, ...llNodes]);
    setLlInput("");
    setMessage(`Inserted node ${val} at HEAD of Linked List. Time: O(1).`);
  };

  const handleInsertTail = () => {
    const val = parseInt(llInput.trim(), 10);
    if (isNaN(val)) return;
    setLlNodes([...llNodes, val]);
    setLlInput("");
    setMessage(`Appended node ${val} at TAIL of Linked List. Time: O(1).`);
  };

  const handleDeleteNode = () => {
    if (llNodes.length === 0) return;
    const removed = llNodes[0];
    setLlNodes(llNodes.slice(1));
    setMessage(`Deleted HEAD node (${removed}). Next node is now the new HEAD. Time: O(1).`);
  };

  // Hash Table Handlers
  const hashFunction = (key: string, capacity: number): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i) * 31) % capacity;
    }
    return hash;
  };

  const handleHashInsert = () => {
    if (!hashKeyInput.trim() || !hashValInput.trim()) return;
    const bucketIdx = hashFunction(hashKeyInput.trim(), hashBuckets.length);
    const updated = hashBuckets.map((b) => [...b]);
    const existing = updated[bucketIdx].find((pair) => pair.key === hashKeyInput.trim());
    if (existing) {
      existing.value = hashValInput.trim();
      setMessage(`Updated key "${hashKeyInput.trim()}" in bucket [${bucketIdx}]. Time: O(1) avg.`);
    } else {
      updated[bucketIdx].push({ key: hashKeyInput.trim(), value: hashValInput.trim() });
      setMessage(`Inserted ("${hashKeyInput.trim()}" -> "${hashValInput.trim()}") into bucket [${bucketIdx}] via chaining. Time: O(1) avg.`);
    }
    setHashBuckets(updated);
    setHashKeyInput("");
    setHashValInput("");
  };

  // BST Handlers
  const handleInsertBst = () => {
    const val = parseInt(bstInput.trim(), 10);
    if (isNaN(val)) return;
    if (bstNodes.includes(val)) {
      setMessage(`Value ${val} already exists in BST (no duplicates).`);
      return;
    }
    setBstNodes([...bstNodes, val]);
    setBstInput("");
    setMessage(`Inserted ${val} into BST. Traversed left/right children in O(log N) time.`);
  };

  // Heap Handlers
  const handleHeapInsert = () => {
    const val = parseInt(heapInput.trim(), 10);
    if (isNaN(val)) return;
    const next = [...heapItems, val];
    // Heapify up
    let idx = next.length - 1;
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (next[idx] > next[parentIdx]) {
        const tmp = next[idx];
        next[idx] = next[parentIdx];
        next[parentIdx] = tmp;
        idx = parentIdx;
      } else {
        break;
      }
    }
    setHeapItems(next);
    setHeapInput("");
    setMessage(`Inserted ${val} and performed Heapify-Up in O(log N) time.`);
  };

  const handleHeapExtractMax = () => {
    if (heapItems.length === 0) return;
    const maxVal = heapItems[0];
    const next = [...heapItems];
    const last = next.pop()!;
    if (next.length > 0) {
      next[0] = last;
      // Heapify down
      let idx = 0;
      while (true) {
        let largest = idx;
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        if (left < next.length && next[left] > next[largest]) largest = left;
        if (right < next.length && next[right] > next[largest]) largest = right;
        if (largest !== idx) {
          const tmp = next[idx];
          next[idx] = next[largest];
          next[largest] = tmp;
          idx = largest;
        } else {
          break;
        }
      }
    }
    setHeapItems(next);
    setMessage(`Extracted Maximum element (${maxVal}) from Heap Root in O(log N) time.`);
  };

  // Trie Handlers
  const handleTrieInsert = () => {
    const word = trieInput.trim().toLowerCase();
    if (!word || trieWords.includes(word)) return;
    setTrieWords([...trieWords, word]);
    setTrieInput("");
    setMessage(`Inserted word "${word}" character-by-character into Prefix Trie. Time: O(L).`);
  };

  // DSU Handlers
  const dsuFind = (i: number): number => {
    if (dsuParents[i] === i) return i;
    return dsuFind(dsuParents[i]);
  };

  const handleDsuUnion = () => {
    const u = parseInt(dsuUInput, 10);
    const v = parseInt(dsuVInput, 10);
    if (isNaN(u) || isNaN(v)) return;
    const rootU = dsuFind(u);
    const rootV = dsuFind(v);
    if (rootU === rootV) {
      setMessage(`Elements ${u} and ${v} already belong to the same disjoint set (Root: ${rootU}).`);
      return;
    }
    const nextParents = [...dsuParents];
    nextParents[rootU] = rootV;
    setDsuParents(nextParents);
    setMessage(`Executed Union(${u}, ${v}): Linked root ${rootU} to root ${rootV} in near O(1) alpha(N) time.`);
  };

  const dsList = [
    { id: "array", label: "Array", icon: Database },
    { id: "linked-list", label: "Linked List", icon: GitCommit },
    { id: "stack", label: "Stack (LIFO)", icon: Layers },
    { id: "queue", label: "Queue (FIFO)", icon: ArrowRight },
    { id: "deque", label: "Deque", icon: Split },
    { id: "hash-table", label: "Hash Table", icon: Hash },
    { id: "bst", label: "BST / Tree", icon: GitBranch },
    { id: "heap", label: "Max-Heap", icon: Layers },
    { id: "trie", label: "Prefix Trie", icon: Search },
    { id: "dsu", label: "Disjoint Set (DSU)", icon: GitFork }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Interactive Memory Playground
              </span>
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                10 Core Structures
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Data Structure Laboratory
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              Perform real memory operations, observe state mutations, inspect pointer transitions, and verify theoretical complexity guarantees.
            </p>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-transparent p-3 text-xs text-purple-200 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
              <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-xs">CODELAB AI Intelligence</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[10px] text-purple-300">Memory &amp; Pointer Semantics Engine</p>
            </div>
          </div>
        </div>

        {/* Carousel selector */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {dsList.map((ds) => {
            const Icon = ds.icon;
            const isSelected = activeDs === ds.id;
            return (
              <button
                key={ds.id}
                onClick={() => {
                  setActiveDs(ds.id as any);
                  setMessage(`Switched to ${ds.label}. Ready to perform operations.`);
                }}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-600/30 text-white shadow-md shadow-indigo-500/20"
                    : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5 text-indigo-400" />
                <span>{ds.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operation Notice */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#07090E]/90 p-4 text-xs text-slate-300 flex items-center gap-2.5">
        <Info className="h-4 w-4 text-indigo-400 shrink-0" />
        <span>{message}</span>
      </div>

      {/* Main Canvas according to Active Structure */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        {/* 1. ARRAY */}
        {activeDs === "array" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Contiguous Memory Array</h3>
                <p className="text-xs text-slate-400">Fixed/dynamic indexed allocation with O(1) random access.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Val"
                  value={arrayValInput}
                  onChange={(e) => setArrayValInput(e.target.value)}
                  className="w-16 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Idx"
                  value={arrayIdxInput}
                  onChange={(e) => setArrayIdxInput(e.target.value)}
                  className="w-16 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handleArrayInsert}
                  className="glass-button-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Insert at Index
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-4">
              {arrayItems.map((val, idx) => (
                <div key={idx} className="group relative flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 font-mono text-base font-bold text-white shadow-md">
                    {val}
                  </div>
                  <span className="mt-1 font-mono text-[10px] text-slate-400">[{idx}]</span>
                  <button
                    onClick={() => handleArrayDelete(idx)}
                    className="absolute -top-1.5 -right-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white group-hover:flex"
                    title="Delete item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. STACK */}
        {activeDs === "stack" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Stack (Last-In, First-Out)</h3>
                <p className="text-xs text-slate-400">Push and pop operations performed strictly at the TOP.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Value"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  className="w-24 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <button onClick={handlePushStack} className="glass-button-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-white">
                  Push
                </button>
                <button onClick={handlePopStack} className="glass-button rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10">
                  Pop
                </button>
              </div>
            </div>

            <div className="flex flex-col-reverse items-center gap-2 pt-4">
              {stackItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex h-12 w-48 items-center justify-between rounded-xl border px-4 font-mono text-sm font-semibold shadow-md transition-all ${
                    idx === stackItems.length - 1
                      ? "border-indigo-500 bg-indigo-600/30 text-white shadow-indigo-500/20"
                      : "border-white/10 bg-white/[0.03] text-slate-300"
                  }`}
                >
                  <span>{item}</span>
                  {idx === stackItems.length - 1 && (
                    <span className="rounded bg-indigo-500/30 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300">
                      TOP
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. QUEUE */}
        {activeDs === "queue" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Queue (First-In, First-Out)</h3>
                <p className="text-xs text-slate-400">Enqueue at REAR, Dequeue from FRONT.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Value"
                  value={queueInput}
                  onChange={(e) => setQueueInput(e.target.value)}
                  className="w-24 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <button onClick={handleEnqueue} className="glass-button-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-white">
                  Enqueue (Rear)
                </button>
                <button onClick={handleDequeue} className="glass-button rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10">
                  Dequeue (Front)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto py-6">
              {queueItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`flex h-16 w-20 flex-col items-center justify-center rounded-2xl border font-mono text-sm font-bold shadow-md ${
                      idx === 0
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                        : idx === queueItems.length - 1
                        ? "border-sky-500/40 bg-sky-500/15 text-sky-300"
                        : "border-white/10 bg-white/[0.03] text-slate-200"
                    }`}
                  >
                    <span>{item}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">
                      {idx === 0 ? "FRONT" : idx === queueItems.length - 1 ? "REAR" : `[${idx}]`}
                    </span>
                  </div>
                  {idx < queueItems.length - 1 && <ArrowRight className="h-4 w-4 text-slate-500" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. DEQUE */}
        {activeDs === "deque" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Double-Ended Queue (Deque)</h3>
                <p className="text-xs text-slate-400">Push and pop operations supported at both Front and Rear endpoints in O(1).</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  placeholder="Value"
                  value={dequeInput}
                  onChange={(e) => setDequeInput(e.target.value)}
                  className="w-20 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <button onClick={handleDequeAddFront} className="glass-button rounded-xl px-2.5 py-1.5 text-xs font-semibold text-sky-400">
                  + Add Front
                </button>
                <button onClick={handleDequeAddRear} className="glass-button rounded-xl px-2.5 py-1.5 text-xs font-semibold text-indigo-400">
                  + Add Rear
                </button>
                <button onClick={handleDequePopFront} className="glass-button rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-400">
                  - Pop Front
                </button>
                <button onClick={handleDequePopRear} className="glass-button rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-400">
                  - Pop Rear
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 py-6">
              {dequeItems.map((item, idx) => (
                <div key={idx} className="flex h-16 w-20 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] font-mono text-sm font-bold text-white shadow-md">
                  <span>{item}</span>
                  <span className="text-[9px] text-slate-400">{idx === 0 ? "FRONT" : idx === dequeItems.length - 1 ? "REAR" : `[${idx}]`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. LINKED LIST */}
        {activeDs === "linked-list" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Singly Linked List</h3>
                <p className="text-xs text-slate-400">Dynamic node allocation connected by forward pointers.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Val"
                  value={llInput}
                  onChange={(e) => setLlInput(e.target.value)}
                  className="w-20 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <button onClick={handleInsertHead} className="glass-button rounded-xl px-2.5 py-1.5 text-xs font-semibold text-sky-400">
                  Insert Head
                </button>
                <button onClick={handleInsertTail} className="glass-button rounded-xl px-2.5 py-1.5 text-xs font-semibold text-indigo-400">
                  Insert Tail
                </button>
                <button onClick={handleDeleteNode} className="glass-button rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-400">
                  Delete Head
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto py-6">
              {llNodes.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex items-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 shadow-md">
                    <div className="px-4 py-3 font-mono text-sm font-bold text-white">{val}</div>
                    <div className="border-l border-indigo-500/30 px-3 py-3 text-[10px] font-mono text-indigo-300">
                      *next
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-indigo-400" />
                </div>
              ))}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-mono text-slate-500">
                NULL
              </div>
            </div>
          </div>
        )}

        {/* 6. HASH TABLE */}
        {activeDs === "hash-table" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Hash Table with Collision Chaining</h3>
                <p className="text-xs text-slate-400">Modulo bucket hashing with linked lists resolving collisions.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={hashKeyInput}
                  onChange={(e) => setHashKeyInput(e.target.value)}
                  className="w-20 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={hashValInput}
                  onChange={(e) => setHashValInput(e.target.value)}
                  className="w-24 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <button onClick={handleHashInsert} className="glass-button-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-white">
                  Set Key-Value
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {hashBuckets.map((bucket, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex h-10 w-24 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] font-mono text-xs font-semibold text-slate-300">
                    Bucket [{idx}]
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <div className="flex flex-wrap items-center gap-2">
                    {bucket.length === 0 ? (
                      <span className="text-[11px] font-mono text-slate-600">Empty</span>
                    ) : (
                      bucket.map((pair, pIdx) => (
                        <div key={pIdx} className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-mono shadow-sm">
                          <span className="text-indigo-300 font-semibold">{pair.key}</span>
                          <span className="text-slate-400">: </span>
                          <span className="text-emerald-400">{pair.value}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. BST */}
        {activeDs === "bst" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Binary Search Tree (BST)</h3>
                <p className="text-xs text-slate-400">Left child &lt; Parent &le; Right child property.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Node Val"
                  value={bstInput}
                  onChange={(e) => setBstInput(e.target.value)}
                  className="w-24 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <button onClick={handleInsertBst} className="glass-button-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-white">
                  Insert Node
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 py-6">
              {bstNodes.map((val, idx) => (
                <div key={idx} className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-500/40 bg-sky-500/15 font-mono text-sm font-bold text-sky-200 shadow-md">
                  {val}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#07090E]/80 p-3 font-mono text-xs text-slate-300">
              <span className="text-indigo-400">Inorder Traversal: </span>
              {[...bstNodes].sort((a, b) => a - b).join(" -> ")}
            </div>
          </div>
        )}

        {/* 8. HEAP */}
        {activeDs === "heap" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Binary Max-Heap Priority Queue</h3>
                <p className="text-xs text-slate-400">Complete binary tree where parent is always &ge; its children.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Value"
                  value={heapInput}
                  onChange={(e) => setHeapInput(e.target.value)}
                  className="w-24 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <button onClick={handleHeapInsert} className="glass-button-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-white">
                  Insert (Heapify Up)
                </button>
                <button onClick={handleHeapExtractMax} className="glass-button rounded-xl px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/10">
                  Extract Max
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 py-6">
              {heapItems.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border font-mono text-sm font-bold shadow-md ${
                    idx === 0 ? "border-amber-500/40 bg-amber-500/15 text-amber-300" : "border-indigo-500/30 bg-indigo-500/10 text-white"
                  }`}>
                    {val}
                  </div>
                  <span className="mt-1 font-mono text-[9px] text-slate-400">
                    {idx === 0 ? "ROOT" : `[${idx}]`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. TRIE */}
        {activeDs === "trie" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Prefix Trie (Retrieval Tree)</h3>
                <p className="text-xs text-slate-400">Tree-structured dictionary for O(L) prefix searching and autocomplete.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add word"
                  value={trieInput}
                  onChange={(e) => setTrieInput(e.target.value)}
                  className="w-28 rounded-xl border border-white/10 bg-[#07090E] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <button onClick={handleTrieInsert} className="glass-button-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-white">
                  Add Word
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Test prefix search (e.g. cod, de)..."
                  value={triePrefixSearch}
                  onChange={(e) => setTriePrefixSearch(e.target.value)}
                  className="w-64 rounded-xl border border-white/10 bg-[#07090E] px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {trieWords.map((word) => {
                  const matches = triePrefixSearch && word.startsWith(triePrefixSearch.toLowerCase());
                  return (
                    <div
                      key={word}
                      className={`rounded-xl border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                        matches
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/20"
                          : "border-white/10 bg-white/[0.03] text-slate-300"
                      }`}
                    >
                      {word}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 10. DSU */}
        {activeDs === "dsu" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Disjoint Set Union (DSU / Union-Find)</h3>
                <p className="text-xs text-slate-400">Partition elements into disjoint connected components in near O(1) time.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="U"
                  value={dsuUInput}
                  onChange={(e) => setDsuUInput(e.target.value)}
                  className="w-14 rounded-xl border border-white/10 bg-[#07090E] px-2 py-1.5 text-xs text-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="V"
                  value={dsuVInput}
                  onChange={(e) => setDsuVInput(e.target.value)}
                  className="w-14 rounded-xl border border-white/10 bg-[#07090E] px-2 py-1.5 text-xs text-white focus:outline-none"
                />
                <button onClick={handleDsuUnion} className="glass-button-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-white">
                  Union(U, V)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 py-4">
              {dsuParents.map((parent, node) => (
                <div key={node} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center">
                  <p className="text-base font-bold font-mono text-white">Node {node}</p>
                  <p className="text-xs font-mono text-indigo-400 mt-1">Parent → {parent}</p>
                  <span className="mt-1 inline-block text-[10px] text-slate-500">
                    {parent === node ? "Root Component" : "Subordinate"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
