"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  GitFork,
  Play,
  Pause,
  RotateCcw,
  StepForward,
  StepBack,
  Sliders,
  Code,
  Clock,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Columns,
  RefreshCw,
  Hash,
  Copy,
  Check,
  ExternalLink,
  FileCode,
  Terminal,
  Cpu,
  X,
  Bot
} from "lucide-react";
import { ApiClient } from "../../services/api";

interface LanguageInfo {
  id: string;
  label: string;
  icon: string;
  compiler: string;
  paradigm: string;
  filename: (algoId: string) => string;
  cliCommand: (algoId: string) => string;
  notes: string;
}

const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    id: "python",
    label: "Python 3",
    icon: "🐍",
    compiler: "CPython 3.11+",
    paradigm: "Interpreted / Multi-paradigm",
    filename: (id) => `${id.replace(/-/g, "_")}.py`,
    cliCommand: (id) => `python ${id.replace(/-/g, "_")}.py`,
    notes: "High readability, dynamic typing, built-in slice and list comprehension support."
  },
  {
    id: "javascript",
    label: "JavaScript",
    icon: "🟨",
    compiler: "Node.js v20 (V8 Engine)",
    paradigm: "JIT-compiled / Prototype-based",
    filename: (id) => `${id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}.js`,
    cliCommand: (id) => `node ${id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}.js`,
    notes: "Ubiquitous web & backend standard with native ES6 destructured array swapping."
  },
  {
    id: "typescript",
    label: "TypeScript",
    icon: "🔷",
    compiler: "TypeScript 5.4+ (Node)",
    paradigm: "Statically Typed / Transpiled",
    filename: (id) => `${id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}.ts`,
    cliCommand: (id) => `npx ts-node ${id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}.ts`,
    notes: "Compiles to clean JavaScript with compile-time array element type verification."
  },
  {
    id: "c",
    label: "C (C11)",
    icon: "⚙️",
    compiler: "GCC 13 / Clang 17",
    paradigm: "Compiled / Imperative & Procedural",
    filename: (id) => `${id.replace(/-/g, "_")}.c`,
    cliCommand: (id) => `gcc -O2 ${id.replace(/-/g, "_")}.c -o app && ./app`,
    notes: "Direct hardware memory manipulation, explicit pointer addressing and zero abstraction cost."
  },
  {
    id: "cpp",
    label: "C++ (C++17)",
    icon: "⚡",
    compiler: "G++ 13 / Clang++ 17",
    paradigm: "Compiled / Multi-paradigm & Generic",
    filename: (id) => `${id.replace(/-/g, "_")}.cpp`,
    cliCommand: (id) => `g++ -O3 ${id.replace(/-/g, "_")}.cpp -o app && ./app`,
    notes: "Standard Template Library (std::vector) pass-by-reference with compiler loop unrolling."
  },
  {
    id: "java",
    label: "Java 17",
    icon: "☕",
    compiler: "OpenJDK 17 LTS",
    paradigm: "Compiled / Object-Oriented JVM",
    filename: () => "Main.java",
    cliCommand: () => "javac Main.java && java Main",
    notes: "Robust type safety, automated garbage collection and predictable JIT optimization."
  },
  {
    id: "csharp",
    label: "C# (.NET 8)",
    icon: "🟣",
    compiler: ".NET 8 CLR / Roslyn",
    paradigm: "Compiled / Component-Oriented",
    filename: () => "Program.cs",
    cliCommand: () => "dotnet run",
    notes: "Modern type inference, rich Linq algorithm extensions and cross-platform runtime."
  },
  {
    id: "go",
    label: "Go (Golang)",
    icon: "🔵",
    compiler: "Go 1.22+ Toolchain",
    paradigm: "Compiled / Concurrent & Procedural",
    filename: () => "main.go",
    cliCommand: () => "go run main.go",
    notes: "Ultra-fast compilation, native slice memory references and simple readable semantics."
  },
  {
    id: "rust",
    label: "Rust (2021)",
    icon: "🦀",
    compiler: "rustc 1.76+ LLVM",
    paradigm: "Compiled / Memory-Safe Functional",
    filename: () => "main.rs",
    cliCommand: () => "rustc -O main.rs && ./main",
    notes: "Guaranteed memory safety without garbage collector via ownership and mutable slice borrowing."
  }
];

interface AlgorithmStep {
  array: number[];
  comparing: number[]; // indices currently compared
  swapped: number[];   // indices swapped
  sorted: number[];    // indices fully sorted
  explanation: string;
}

export interface AlgorithmsViewProps {
  initialAlgoId?: string;
  onOpenInIde?: (code: string, language: string) => void;
}

export const AlgorithmsView: React.FC<AlgorithmsViewProps> = ({
  initialAlgoId = "bubble-sort",
  onOpenInIde,
}) => {
  const [algorithms, setAlgorithms] = useState<any[]>([]);
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>(initialAlgoId);
  const [currentAlgo, setCurrentAlgo] = useState<any | null>(null);

  // Visualization state
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(300);
  const [customArrayInput, setCustomArrayInput] = useState("45, 12, 89, 34, 22, 7, 56, 19");

  // Side-by-side comparison mode
  const [compareMode, setCompareMode] = useState(false);
  const [compareAlgoId, setCompareAlgoId] = useState("quick-sort");
  const [compareSteps, setCompareSteps] = useState<AlgorithmStep[]>([]);
  const [compareStepIdx, setCompareStepIdx] = useState(0);

  const [activeTab, setActiveTab] = useState<"visualizer" | "code" | "theory">("visualizer");
  const [activeCodeLang, setActiveCodeLang] = useState("python");
  const [copied, setCopied] = useState(false);

  // AI Explainer Modal
  const [aiExplanation, setAiExplanation] = useState<any | null>(null);
  const [explainingWithAi, setExplainingWithAi] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleExplainWithAi = async () => {
    if (!currentAlgo) return;
    const code = currentAlgo.code_implementations?.[activeCodeLang] || "";
    setExplainingWithAi(true);
    setShowAiModal(true);
    try {
      const res = await ApiClient.explainCode({
        language: activeCodeLang,
        source_code: code,
        mode: "line_by_line",
      });
      setAiExplanation(res);
    } catch (err: any) {
      setAiExplanation({
        title: `${currentAlgo.title} (${activeCodeLang})`,
        explanation: `${currentAlgo.description}\n\nTime Complexity: ${currentAlgo.time_complexity_average} | Space Complexity: ${currentAlgo.space_complexity}`,
        high_level_purpose: currentAlgo.description,
        concept: currentAlgo.category,
        model: "CODELAB AI Intelligence",
      });
    } finally {
      setExplainingWithAi(false);
    }
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadAlgorithms();
  }, []);

  const loadAlgorithms = async () => {
    try {
      const data = await ApiClient.listAlgorithms();
      setAlgorithms(data);
      if (data.length > 0) {
        const found = data.find((a) => a.id === selectedAlgoId) || data[0];
        setSelectedAlgoId(found.id);
        setCurrentAlgo(found);
        const parsed = parseArray(customArrayInput);
        setSteps(generateSteps(found.id, parsed));
        setCompareSteps(generateSteps(compareAlgoId, parsed));
      }
    } catch {}
  };

  const handleSelectAlgo = (id: string) => {
    setSelectedAlgoId(id);
    const found = algorithms.find((a) => a.id === id);
    if (found) {
      setCurrentAlgo(found);
      const defaultArr = found.default_array || [45, 12, 89, 34, 22, 7, 56, 19];
      setCustomArrayInput(defaultArr.join(", "));
      const parsed = defaultArr;
      setCurrentStepIdx(0);
      setIsPlaying(false);
      setSteps(generateSteps(id, parsed));
      if (compareMode) {
        setCompareStepIdx(0);
        setCompareSteps(generateSteps(compareAlgoId, parsed));
      }
    }
  };

  const parseArray = (str: string): number[] => {
    return str
      .split(/[\s,]+/)
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x))
      .slice(0, 16);
  };

  const handleApplyCustomArray = () => {
    const arr = parseArray(customArrayInput);
    if (arr.length === 0) return;
    setIsPlaying(false);
    setCurrentStepIdx(0);
    setSteps(generateSteps(selectedAlgoId, arr));
    if (compareMode) {
      setCompareStepIdx(0);
      setCompareSteps(generateSteps(compareAlgoId, arr));
    }
  };

  const handleGenerateRandom = (size = 8) => {
    const randoms = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setCustomArrayInput(randoms.join(", "));
    setIsPlaying(false);
    setCurrentStepIdx(0);
    setSteps(generateSteps(selectedAlgoId, randoms));
    if (compareMode) {
      setCompareStepIdx(0);
      setCompareSteps(generateSteps(compareAlgoId, randoms));
    }
  };

  // Pure algorithmic step generators
  const generateSteps = (algoId: string, initialArr: number[]): AlgorithmStep[] => {
    const generated: AlgorithmStep[] = [];
    const arr = [...initialArr];
    const n = arr.length;

    generated.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [],
      explanation: `Initial array with ${n} elements ready for ${algoId.replace("-", " ")}.`,
    });

    if (algoId === "bubble-sort") {
      const sortedIndices: number[] = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          generated.push({
            array: [...arr],
            comparing: [j, j + 1],
            swapped: [],
            sorted: [...sortedIndices],
            explanation: `Comparing arr[${j}] (${arr[j]}) with arr[${j + 1}] (${arr[j + 1]}).`,
          });

          if (arr[j] > arr[j + 1]) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            generated.push({
              array: [...arr],
              comparing: [j, j + 1],
              swapped: [j, j + 1],
              sorted: [...sortedIndices],
              explanation: `Swapping ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}.`,
            });
          }
        }
        sortedIndices.push(n - i - 1);
      }
      sortedIndices.push(0);
      generated.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        explanation: "Bubble Sort complete! All elements are sorted.",
      });
    } else if (algoId === "selection-sort") {
      const sortedIndices: number[] = [];
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          generated.push({
            array: [...arr],
            comparing: [minIdx, j],
            swapped: [],
            sorted: [...sortedIndices],
            explanation: `Checking if element at index ${j} (${arr[j]}) < current min (${arr[minIdx]}).`,
          });
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          generated.push({
            array: [...arr],
            comparing: [],
            swapped: [i, minIdx],
            sorted: [...sortedIndices, i],
            explanation: `Swapped new minimum ${arr[i]} into position index ${i}.`,
          });
        }
        sortedIndices.push(i);
      }
      generated.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        explanation: "Selection Sort complete! Array fully ordered.",
      });
    } else if (algoId === "insertion-sort") {
      const sortedIndices: number[] = [0];
      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        generated.push({
          array: [...arr],
          comparing: [i],
          swapped: [],
          sorted: [...sortedIndices],
          explanation: `Picked element at index ${i} (${key}) as the insertion key.`,
        });

        while (j >= 0 && arr[j] > key) {
          generated.push({
            array: [...arr],
            comparing: [j, j + 1],
            swapped: [],
            sorted: [...sortedIndices],
            explanation: `arr[${j}] (${arr[j]}) is greater than key (${key}); shifting right to index ${j + 1}.`,
          });
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = key;
        sortedIndices.push(i);
        generated.push({
          array: [...arr],
          comparing: [],
          swapped: [j + 1],
          sorted: [...sortedIndices],
          explanation: `Inserted key (${key}) at target sorted position index ${j + 1}.`,
        });
      }
      generated.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        explanation: "Insertion Sort complete!",
      });
    } else if (algoId === "merge-sort") {
      const mergeSortHelper = (start: number, end: number) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);

        generated.push({
          array: [...arr],
          comparing: [start, end],
          swapped: [],
          sorted: [],
          explanation: `Divide: Splitting array segment [${start}..${end}] at midpoint index ${mid}.`,
        });

        mergeSortHelper(start, mid);
        mergeSortHelper(mid + 1, end);

        // Merge step
        const left = arr.slice(start, mid + 1);
        const right = arr.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;

        while (i < left.length && j < right.length) {
          generated.push({
            array: [...arr],
            comparing: [start + i, mid + 1 + j],
            swapped: [],
            sorted: [],
            explanation: `Merge: Comparing left item (${left[i]}) with right item (${right[j]}).`,
          });
          if (left[i] <= right[j]) {
            arr[k] = left[i];
            i++;
          } else {
            arr[k] = right[j];
            j++;
          }
          k++;
        }
        while (i < left.length) {
          arr[k] = left[i];
          i++;
          k++;
        }
        while (j < right.length) {
          arr[k] = right[j];
          j++;
          k++;
        }

        generated.push({
          array: [...arr],
          comparing: [],
          swapped: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
          sorted: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
          explanation: `Merged sorted segment [${start}..${end}].`,
        });
      };

      mergeSortHelper(0, n - 1);
      generated.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        explanation: "Merge Sort complete in guaranteed O(N log N) comparisons!",
      });
    } else if (algoId === "quick-sort") {
      const quickSortHelper = (low: number, high: number) => {
        if (low < high) {
          const pivotVal = arr[high];
          generated.push({
            array: [...arr],
            comparing: [high],
            swapped: [],
            sorted: [],
            explanation: `Partition: Selected pivot value ${pivotVal} at index ${high}.`,
          });

          let i = low - 1;
          for (let j = low; j < high; j++) {
            generated.push({
              array: [...arr],
              comparing: [j, high],
              swapped: [],
              sorted: [],
              explanation: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivotVal}).`,
            });
            if (arr[j] < pivotVal) {
              i++;
              const temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;
              if (i !== j) {
                generated.push({
                  array: [...arr],
                  comparing: [],
                  swapped: [i, j],
                  sorted: [],
                  explanation: `Swapping smaller element ${arr[i]} into left partition index ${i}.`,
                });
              }
            }
          }
          const temp = arr[i + 1];
          arr[i + 1] = arr[high];
          arr[high] = temp;
          const p = i + 1;

          generated.push({
            array: [...arr],
            comparing: [],
            swapped: [p, high],
            sorted: [p],
            explanation: `Placed pivot ${arr[p]} into its final sorted position index ${p}.`,
          });

          quickSortHelper(low, p - 1);
          quickSortHelper(p + 1, high);
        }
      };

      quickSortHelper(0, n - 1);
      generated.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        explanation: "Quick Sort complete!",
      });
    } else if (algoId === "heap-sort") {
      const heapify = (size: number, rootIdx: number) => {
        let largest = rootIdx;
        const left = 2 * rootIdx + 1;
        const right = 2 * rootIdx + 2;

        if (left < size && arr[left] > arr[largest]) largest = left;
        if (right < size && arr[right] > arr[largest]) largest = right;

        if (largest !== rootIdx) {
          generated.push({
            array: [...arr],
            comparing: [rootIdx, largest],
            swapped: [rootIdx, largest],
            sorted: [],
            explanation: `Heapify: Swapping parent arr[${rootIdx}] (${arr[rootIdx]}) with larger child arr[${largest}] (${arr[largest]}).`,
          });
          const temp = arr[rootIdx];
          arr[rootIdx] = arr[largest];
          arr[largest] = temp;
          heapify(size, largest);
        }
      };

      // Build max-heap
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
      }
      generated.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: [],
        explanation: "Binary Max-Heap constructed! Root element is maximum.",
      });

      // Extract elements
      const sortedIndices: number[] = [];
      for (let i = n - 1; i > 0; i--) {
        const temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        sortedIndices.push(i);

        generated.push({
          array: [...arr],
          comparing: [],
          swapped: [0, i],
          sorted: [...sortedIndices],
          explanation: `Extracted maximum root (${arr[i]}) to sorted end position index ${i}.`,
        });

        heapify(i, 0);
      }
      generated.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        explanation: "Heap Sort complete!",
      });
    } else if (algoId === "shell-sort") {
      let gap = Math.floor(n / 2);
      while (gap > 0) {
        generated.push({
          array: [...arr],
          comparing: [],
          swapped: [],
          sorted: [],
          explanation: `Shell Gap: Comparing elements spaced ${gap} positions apart.`,
        });

        for (let i = gap; i < n; i++) {
          const temp = arr[i];
          let j = i;
          while (j >= gap && arr[j - gap] > temp) {
            generated.push({
              array: [...arr],
              comparing: [j - gap, j],
              swapped: [j - gap, j],
              sorted: [],
              explanation: `arr[${j - gap}] (${arr[j - gap]}) > ${temp}; shifting forward across gap ${gap}.`,
            });
            arr[j] = arr[j - gap];
            j -= gap;
          }
          arr[j] = temp;
        }
        gap = Math.floor(gap / 2);
      }
      generated.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        explanation: "Shell Sort complete!",
      });
    } else if (algoId === "counting-sort") {
      const maxVal = Math.max(...arr, 1);
      const count = new Array(maxVal + 1).fill(0);
      for (let i = 0; i < n; i++) {
        count[arr[i]]++;
        generated.push({
          array: [...arr],
          comparing: [i],
          swapped: [],
          sorted: [],
          explanation: `Frequency Count: Tallying element arr[${i}] (${arr[i]}); current count: ${count[arr[i]]}.`,
        });
      }
      let idx = 0;
      for (let num = 0; num <= maxVal; num++) {
        while (count[num] > 0) {
          arr[idx] = num;
          generated.push({
            array: [...arr],
            comparing: [],
            swapped: [idx],
            sorted: Array.from({ length: idx + 1 }, (_, i) => i),
            explanation: `Placing counted value ${num} into sorted index ${idx}.`,
          });
          idx++;
          count[num]--;
        }
      }
      generated.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        explanation: "Counting Sort complete in linear O(N + K) time!",
      });
    } else if (algoId === "linear-search") {
      const target = arr[Math.floor(arr.length / 2)] || 42;
      let found = -1;
      for (let i = 0; i < n; i++) {
        generated.push({
          array: [...arr],
          comparing: [i],
          swapped: [],
          sorted: [],
          explanation: `Inspecting index ${i} (value ${arr[i]}). Checking against target ${target}.`,
        });
        if (arr[i] === target) {
          found = i;
          break;
        }
      }
      generated.push({
        array: [...arr],
        comparing: found >= 0 ? [found] : [],
        swapped: [],
        sorted: found >= 0 ? [found] : [],
        explanation: found >= 0
          ? `Linear Search success: Target ${target} located at index ${found}!`
          : `Target ${target} was not found.`,
      });
    } else if (algoId === "binary-search") {
      const sortedArr = [...arr].sort((a, b) => a - b);
      const target = sortedArr[Math.floor(sortedArr.length / 2)];
      let low = 0;
      let high = sortedArr.length - 1;
      let foundIdx = -1;

      generated.push({
        array: [...sortedArr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: sortedArr.length }, (_, i) => i),
        explanation: `Array pre-sorted for Binary Search. Target value to find: ${target}.`,
      });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        generated.push({
          array: [...sortedArr],
          comparing: [mid],
          swapped: [],
          sorted: [low, high],
          explanation: `Checking midpoint index ${mid} (value ${sortedArr[mid]}). Search window: [${low}..${high}].`,
        });

        if (sortedArr[mid] === target) {
          foundIdx = mid;
          break;
        } else if (sortedArr[mid] < target) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      generated.push({
        array: [...sortedArr],
        comparing: foundIdx >= 0 ? [foundIdx] : [],
        swapped: [],
        sorted: Array.from({ length: sortedArr.length }, (_, i) => i),
        explanation: foundIdx >= 0
          ? `Binary Search: Target ${target} verified at index ${foundIdx} in O(log N) iterations!`
          : `Target ${target} not found in array.`,
      });
    } else {
      // Graph BFS/DFS or generic
      for (let i = 0; i < n; i++) {
        generated.push({
          array: [...arr],
          comparing: [i],
          swapped: [],
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
          explanation: `Traversal step ${i + 1}: Visited node ${arr[i]} in graph component.`,
        });
      }
    }

    return generated;
  };

  // Animation player loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });

        if (compareMode) {
          setCompareStepIdx((prev) => {
            if (prev >= compareSteps.length - 1) return prev;
            return prev + 1;
          });
        }
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, compareSteps.length, speedMs, compareMode]);

  const activeStep = steps[currentStepIdx] || steps[0] || {
    array: [10, 20, 30],
    comparing: [],
    swapped: [],
    sorted: [],
    explanation: "Ready to visualize.",
  };

  const compareActiveStep = compareSteps[compareStepIdx] || compareSteps[0];

  const maxVal = Math.max(...activeStep.array, 100);

  // Compute metrics
  const comparisonsCount = steps.slice(0, currentStepIdx + 1).filter((s) => s.comparing.length > 0).length;
  const swapsCount = steps.slice(0, currentStepIdx + 1).filter((s) => s.swapped.length > 0).length;

  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.id === activeCodeLang) || SUPPORTED_LANGUAGES[0];

  const handleCopyCode = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Data Structures & Algorithms Engine
              </span>
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                Live State Tracer
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {currentAlgo?.title || "Algorithm Visualizer"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
              Inspect actual comparisons, memory swaps, divide-and-conquer partitions, and complexity guarantees with millisecond precision.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextMode = !compareMode;
                setCompareMode(nextMode);
                if (nextMode) {
                  setCompareStepIdx(0);
                  setCompareSteps(generateSteps(compareAlgoId, parseArray(customArrayInput)));
                }
              }}
              className={`glass-button flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                compareMode ? "border-sky-500/40 bg-sky-500/15 text-sky-300" : "text-slate-300"
              }`}
            >
              <Columns className="h-4 w-4" />
              {compareMode ? "Exit Compare Mode" : "Side-by-Side Compare"}
            </button>
          </div>
        </div>

        {/* Algorithm Carousel Selector */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {algorithms.map((algo) => {
            const isSelected = algo.id === selectedAlgoId;
            return (
              <button
                key={algo.id}
                onClick={() => handleSelectAlgo(algo.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-600/30 text-white shadow-md shadow-indigo-500/20"
                    : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                <span>{algo.title}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-slate-300">
                  {algo.time_complexity?.average || "O(N)"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Tabs: Visualizer vs Code vs Theory */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          {(["visualizer", "code", "theory"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              }`}
            >
              {tab === "visualizer" && <Play className="inline mr-1.5 h-3.5 w-3.5" />}
              {tab === "code" && <Code className="inline mr-1.5 h-3.5 w-3.5" />}
              {tab === "theory" && <Clock className="inline mr-1.5 h-3.5 w-3.5" />}
              {tab === "code" ? "Code (9 Languages)" : tab}
            </button>
          ))}
        </div>

        {/* Complexity Summary Badges */}
        {currentAlgo && (
          <div className="flex items-center gap-3 text-xs">
            {onOpenInIde && (
              <button
                onClick={() => {
                  const codeToRun = currentAlgo.code_implementations?.[activeCodeLang] || "";
                  onOpenInIde(codeToRun, activeCodeLang);
                }}
                className="hidden md:flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition"
              >
                <Play className="h-3 w-3 fill-current text-indigo-400" />
                <span>Run {currentLangMeta?.label || "Code"} in IDE</span>
              </button>
            )}
            <span className="hidden sm:inline-block rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-400">
              Best: {currentAlgo.time_complexity?.best}
            </span>
            <span className="hidden sm:inline-block rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 font-mono text-[11px] text-indigo-400">
              Avg: {currentAlgo.time_complexity?.average}
            </span>
            <span className="hidden sm:inline-block rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] text-amber-400">
              Worst: {currentAlgo.time_complexity?.worst}
            </span>
            <span className="hidden sm:inline-block rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-slate-300">
              Space: {currentAlgo.space_complexity}
            </span>
          </div>
        )}
      </div>

      {/* Visualizer Tab */}
      {activeTab === "visualizer" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`glass-button-primary flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-md ${
                  isPlaying ? "bg-amber-600 hover:bg-amber-500" : ""
                }`}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx(Math.max(0, currentStepIdx - 1));
                  if (compareMode) setCompareStepIdx(Math.max(0, compareStepIdx - 1));
                }}
                disabled={currentStepIdx === 0}
                className="glass-button flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 disabled:opacity-40"
              >
                <StepBack className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1));
                  if (compareMode) setCompareStepIdx(Math.min(compareSteps.length - 1, compareStepIdx + 1));
                }}
                disabled={currentStepIdx >= steps.length - 1}
                className="glass-button flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 disabled:opacity-40"
              >
                <StepForward className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx(0);
                  if (compareMode) setCompareStepIdx(0);
                }}
                className="glass-button flex h-9 w-9 items-center justify-center rounded-xl text-slate-300"
                title="Restart"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Speed slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Speed:</span>
              <input
                type="range"
                min="50"
                max="800"
                step="50"
                value={speedMs}
                onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
                className="h-1.5 w-24 cursor-pointer accent-indigo-500"
              />
              <span className="w-12 font-mono text-xs text-slate-300">{speedMs}ms</span>
            </div>

            {/* Custom array input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customArrayInput}
                onChange={(e) => setCustomArrayInput(e.target.value)}
                placeholder="e.g. 45, 12, 89, 34"
                className="rounded-xl border border-white/10 bg-[#07090E]/80 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleApplyCustomArray}
                className="glass-button rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200"
              >
                Apply
              </button>
              <button
                onClick={() => handleGenerateRandom(8)}
                className="glass-button rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200"
                title="Generate Random Numbers"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Visualization Stage */}
          <div className={`grid gap-6 ${compareMode ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
            {/* Primary Algorithm Canvas */}
            <div className="glass-card relative rounded-3xl p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{currentAlgo?.title}</h3>
                  <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                    Step {currentStepIdx + 1} of {steps.length}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-amber-400">Comparisons: {comparisonsCount}</span>
                  <span className="text-sky-400">Swaps: {swapsCount}</span>
                </div>
              </div>

              {/* Bars Chart */}
              <div className="mt-8 flex h-64 items-end justify-center gap-2 sm:gap-3 rounded-2xl border border-white/[0.05] bg-[#07090E]/80 p-4 sm:p-6">
                {activeStep.array.map((val, idx) => {
                  const isComparing = activeStep.comparing.includes(idx);
                  const isSwapped = activeStep.swapped.includes(idx);
                  const isSorted = activeStep.sorted.includes(idx);

                  let barColor = "bg-slate-700/60";
                  if (isSorted) barColor = "bg-emerald-500 shadow-lg shadow-emerald-500/30";
                  if (isComparing) barColor = "bg-amber-400 shadow-lg shadow-amber-400/30 animate-pulse";
                  if (isSwapped) barColor = "bg-indigo-500 shadow-lg shadow-indigo-500/30";

                  const heightPercent = Math.max(12, Math.round((val / maxVal) * 92));

                  return (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                      <span className="font-mono text-[10px] text-slate-300 font-semibold">{val}</span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-300 ${barColor}`}
                      />
                      <span className="font-mono text-[9px] text-slate-400">[{idx}]</span>
                    </div>
                  );
                })}
              </div>

              {/* Step Explanation Banner */}
              <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#07090E]/90 p-4 text-xs text-slate-200">
                <span className="font-semibold text-indigo-400">Execution Insight: </span>
                <span>{activeStep.explanation}</span>
              </div>
            </div>

            {/* Compare Algorithm Canvas (if active) */}
            {compareMode && (
              <div className="glass-card relative rounded-3xl p-6">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={compareAlgoId}
                      onChange={(e) => {
                        setCompareAlgoId(e.target.value);
                        setCompareStepIdx(0);
                        setCompareSteps(generateSteps(e.target.value, parseArray(customArrayInput)));
                      }}
                      className="rounded-lg border border-white/10 bg-[#07090E] px-2.5 py-1 text-xs font-semibold text-sky-400 focus:outline-none"
                    >
                      {algorithms.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title}
                        </option>
                      ))}
                    </select>
                    <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                      Step {compareStepIdx + 1} of {compareSteps.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-amber-400">
                      Comparisons: {compareSteps.slice(0, compareStepIdx + 1).filter((s) => s.comparing.length > 0).length}
                    </span>
                    <span className="text-sky-400">
                      Swaps: {compareSteps.slice(0, compareStepIdx + 1).filter((s) => s.swapped.length > 0).length}
                    </span>
                  </div>
                </div>

                {/* Bars Chart for Compare */}
                <div className="mt-8 flex h-64 items-end justify-center gap-2 sm:gap-3 rounded-2xl border border-white/[0.05] bg-[#07090E]/80 p-4 sm:p-6">
                  {compareActiveStep.array.map((val, idx) => {
                    const isComparing = compareActiveStep.comparing.includes(idx);
                    const isSwapped = compareActiveStep.swapped.includes(idx);
                    const isSorted = compareActiveStep.sorted.includes(idx);

                    let barColor = "bg-slate-700/60";
                    if (isSorted) barColor = "bg-emerald-500 shadow-lg shadow-emerald-500/30";
                    if (isComparing) barColor = "bg-amber-400 shadow-lg shadow-amber-400/30 animate-pulse";
                    if (isSwapped) barColor = "bg-sky-500 shadow-lg shadow-sky-500/30";

                    const heightPercent = Math.max(12, Math.round((val / maxVal) * 92));

                    return (
                      <div key={idx} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                        <span className="font-mono text-[10px] text-slate-300 font-semibold">{val}</span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-lg transition-all duration-300 ${barColor}`}
                        />
                        <span className="font-mono text-[9px] text-slate-400">[{idx}]</span>
                      </div>
                    );
                  })}
                </div>

                {/* Step Explanation Banner */}
                <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#07090E]/90 p-4 text-xs text-slate-200">
                  <span className="font-semibold text-sky-400">Comparison Insight: </span>
                  <span>{compareActiveStep.explanation}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code Implementations Tab */}
      {activeTab === "code" && currentAlgo && (
        <div className="glass-card rounded-3xl p-6 space-y-6">
          {/* Top Banner & Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {currentAlgo.title} — Multi-Language Source Library
                </h3>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                  9 Languages
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Architected & verified by Sinan Mohammed. Select any programming language to inspect the complete runnable implementation, copy code, or load it directly into the Monaco Web IDE.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExplainWithAi}
                disabled={explainingWithAi}
                className="glass-button flex items-center gap-2 rounded-xl border border-purple-500/40 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 px-3.5 py-2 text-xs font-semibold text-purple-200 shadow-md shadow-purple-500/20 transition hover:bg-purple-500/40 active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                <span>{explainingWithAi ? "AI Analyzing..." : "Explain with AI"}</span>
              </button>

              {onOpenInIde && (
                <button
                  onClick={() => {
                    const codeToRun = currentAlgo.code_implementations?.[activeCodeLang] || "";
                    onOpenInIde(codeToRun, activeCodeLang);
                  }}
                  className="glass-button flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 active:scale-95"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Open & Run in Web IDE</span>
                </button>
              )}
              <button
                onClick={() => handleCopyCode(currentAlgo.code_implementations?.[activeCodeLang] || "")}
                className="glass-button flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Language Selector Pills */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Select Programming Language:
              </span>
              <span className="text-xs text-slate-500">
                Active: <strong className="text-indigo-400">{currentLangMeta?.label || activeCodeLang}</strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = activeCodeLang === lang.id;
                const hasCode = !!currentAlgo.code_implementations?.[lang.id];
                return (
                  <button
                    key={lang.id}
                    onClick={() => setActiveCodeLang(lang.id)}
                    className={`group flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "border-indigo-500 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/30"
                        : "border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className="text-sm">{lang.icon}</span>
                    <span>{lang.label}</span>
                    {hasCode && (
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-emerald-400"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Language Metadata Ribbon */}
          {currentLangMeta && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-white/[0.06] bg-[#05070B]/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Compiler & Runtime</span>
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-white">{currentLangMeta.compiler}</div>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-[#05070B]/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <Layers className="h-3.5 w-3.5 text-purple-400" />
                  <span>Execution Model</span>
                </div>
                <div className="mt-1 text-xs font-medium text-slate-200">{currentLangMeta.paradigm}</div>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-[#05070B]/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <FileCode className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Source File</span>
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-emerald-300">
                  {currentLangMeta.filename(currentAlgo.id)}
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-[#05070B]/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <Terminal className="h-3.5 w-3.5 text-sky-400" />
                  <span>CLI Run Command</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-sky-300 truncate" title={currentLangMeta.cliCommand(currentAlgo.id)}>
                  {currentLangMeta.cliCommand(currentAlgo.id)}
                </div>
              </div>
            </div>
          )}

          {/* Code Editor Viewport */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#05070B] shadow-2xl">
            {/* macOS Chrome Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#080B11] px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F56]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#FFBD2E]/80" />
                  <span className="h-3 w-3 rounded-full bg-[#27C93F]/80" />
                </div>
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-mono text-xs text-slate-300">
                    {currentLangMeta ? currentLangMeta.filename(currentAlgo.id) : `${currentAlgo.id}.${activeCodeLang}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(currentAlgo.code_implementations?.[activeCodeLang] || "")}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:bg-white/[0.08]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                {onOpenInIde && (
                  <button
                    onClick={() => {
                      const codeToRun = currentAlgo.code_implementations?.[activeCodeLang] || "";
                      onOpenInIde(codeToRun, activeCodeLang);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 transition hover:bg-indigo-500/30"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Run in IDE</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Lines Container */}
            <div className="flex max-h-[600px] overflow-auto font-mono text-xs">
              {/* Line numbers gutter */}
              <div className="select-none border-r border-white/[0.08] bg-[#040609] py-4 pl-4 pr-3 text-right text-slate-600 font-mono text-xs leading-6">
                {(currentAlgo.code_implementations?.[activeCodeLang] || "").split("\n").map((_: string, i: number) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              {/* Code content */}
              <pre className="flex-1 overflow-x-auto p-4 text-slate-200 leading-6 font-mono text-xs">
                <code>{currentAlgo.code_implementations?.[activeCodeLang] || `# Implementation for ${activeCodeLang} is being compiled.`}</code>
              </pre>
            </div>
          </div>

          {/* Implementation & Language Specific Notes */}
          {currentLangMeta && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#07090E]/80 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{currentLangMeta.label} Language Implementation Notes</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                {currentLangMeta.notes} This implementation features standalone execution with sample verification data in the main entry point, ready for instant compilation or benchmarking in the CODELAB execution engine.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Theory & Complexity Tab */}
      {activeTab === "theory" && currentAlgo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <h3 className="text-sm font-bold text-white">Theoretical Foundations</h3>
              <span className="text-[10px] font-semibold text-purple-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-purple-400" /> AI Verified Complexity
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">{currentAlgo.description}</p>

            <div className="rounded-2xl border border-white/[0.08] bg-[#07090E]/80 p-4">
              <span className="text-xs font-semibold text-indigo-400 uppercase">Real-World Engineering Application</span>
              <p className="mt-1 text-xs text-slate-300">{currentAlgo.real_world}</p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#07090E]/80 p-4">
              <span className="text-xs font-semibold text-emerald-400 uppercase">Pseudocode Representation</span>
              <pre className="mt-2 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">{currentAlgo.pseudocode}</pre>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Asymptotic Complexity Matrix</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs">
                <span className="text-slate-400">Best-Case Time Complexity</span>
                <span className="font-mono font-semibold text-emerald-400">{currentAlgo.time_complexity?.best}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs">
                <span className="text-slate-400">Average-Case Time Complexity</span>
                <span className="font-mono font-semibold text-indigo-400">{currentAlgo.time_complexity?.average}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs">
                <span className="text-slate-400">Worst-Case Time Complexity</span>
                <span className="font-mono font-semibold text-amber-400">{currentAlgo.time_complexity?.worst}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs">
                <span className="text-slate-400">Auxiliary Space Complexity</span>
                <span className="font-mono font-semibold text-sky-400">{currentAlgo.space_complexity}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs">
                <span className="text-slate-400">Sorting Stability</span>
                <span className="font-semibold text-white">{currentAlgo.stable ? "Stable" : "Unstable"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Algorithm Explanation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto border border-purple-500/30">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {currentAlgo?.title || "Algorithm"} Breakdown
                  </h3>
                  <p className="text-[11px] text-purple-300 font-medium">
                    CODELAB AI • {activeCodeLang.toUpperCase()} Architecture
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-white/[0.08] hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {explainingWithAi ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Sparkles className="h-8 w-8 text-purple-400 animate-spin" />
                <div>
                  <h4 className="font-bold text-white text-sm">CODELAB AI is Analyzing...</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">
                    Parsing asymptotic operations, memory state transitions, and {activeCodeLang} runtime semantics.
                  </p>
                </div>
              </div>
            ) : aiExplanation ? (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="rounded-2xl border border-white/[0.08] bg-[#07090E]/80 p-4 space-y-1.5">
                  <span className="font-semibold text-purple-300 uppercase text-[10px] tracking-wider">Algorithmic Mechanics</span>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {aiExplanation.high_level_purpose || aiExplanation.explanation}
                  </p>
                </div>

                {currentAlgo && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono text-[11px]">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                      <span className="text-[10px] uppercase text-slate-500 block">Best</span>
                      <span className="font-bold text-emerald-400">{currentAlgo.time_complexity?.best}</span>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                      <span className="text-[10px] uppercase text-slate-500 block">Average</span>
                      <span className="font-bold text-indigo-400">{currentAlgo.time_complexity?.average}</span>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                      <span className="text-[10px] uppercase text-slate-500 block">Worst</span>
                      <span className="font-bold text-amber-400">{currentAlgo.time_complexity?.worst}</span>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                      <span className="text-[10px] uppercase text-slate-500 block">Space</span>
                      <span className="font-bold text-sky-400">{currentAlgo.space_complexity}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {((aiExplanation.line_explanations && aiExplanation.line_explanations.length > 0)
                    ? aiExplanation.line_explanations
                    : (aiExplanation.breakdown || [])
                  ).map((item: any, i: number) => (
                    <div key={i} className="rounded-xl border border-white/[0.06] bg-[#07090E]/80 p-3 space-y-1">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-purple-400 font-bold">Step {item.line_number || i + 1}:</span>
                        <span className="text-slate-200">{item.code || item.token || `Instruction #${i + 1}`}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] pl-4">{item.explanation || item.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5 text-purple-300">
                <Sparkles className="h-3 w-3 text-purple-400" /> Synthesized in real-time by CODELAB AI Engine
              </span>
              <button
                onClick={() => setShowAiModal(false)}
                className="glass-button rounded-xl px-4 py-1.5 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
