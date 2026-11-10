from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from ..algorithm_data import ALGORITHM_MULTI_LANGUAGE_CODES

router = APIRouter(prefix="/api/algorithms", tags=["Algorithms"])

ALGORITHMS_REGISTRY: List[Dict[str, Any]] = [
    {
        "id": "bubble-sort",
        "title": "Bubble Sort",
        "category": "Sorting",
        "difficulty": "Easy",
        "time_complexity": {"best": "O(N)", "average": "O(N²)", "worst": "O(N²)"},
        "space_complexity": "O(1)",
        "stable": True,
        "description": "Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
        "real_world": "Used in graphics engines when sorting small lists of polygons or as a beginner conceptual model for comparison sorting.",
        "pseudocode": (
            "procedure bubbleSort(A : list of sortable items)\n"
            "    n := length(A)\n"
            "    repeat\n"
            "        swapped := false\n"
            "        for i := 1 to n - 1 inclusive do\n"
            "            if A[i - 1] > A[i] then\n"
            "                swap(A[i - 1], A[i])\n"
            "                swapped := true\n"
            "            end if\n"
            "        end for\n"
            "        n := n - 1\n"
            "    until not swapped\n"
            "end procedure"
        ),
        "code_implementations": {
            "python": "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr\n\n# Test\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))",
            "javascript": "function bubbleSort(arr) {\n    let n = arr.length;\n    let swapped;\n    do {\n        swapped = false;\n        for (let i = 0; i < n - 1; i++) {\n            if (arr[i] > arr[i + 1]) {\n                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];\n                swapped = true;\n            }\n        }\n        n--;\n    } while (swapped);\n    return arr;\n}\nconsole.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));",
            "c": "#include <stdio.h>\n\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n}\n\nint main() {\n    int data[] = {64, 34, 25, 12, 22, 11, 90};\n    bubbleSort(data, 7);\n    for(int i = 0; i < 7; i++) printf(\"%d \", data[i]);\n    return 0;\n}"
        },
        "default_array": [45, 12, 89, 34, 22, 7, 56, 19]
    },
    {
        "id": "selection-sort",
        "title": "Selection Sort",
        "category": "Sorting",
        "difficulty": "Easy",
        "time_complexity": {"best": "O(N²)", "average": "O(N²)", "worst": "O(N²)"},
        "space_complexity": "O(1)",
        "stable": False,
        "description": "Selection Sort divides the input list into two parts: a sorted sublist built up from left to right and an unsorted sublist. In each pass, it finds the smallest element from the unsorted part and swaps it with the first unsorted position.",
        "real_world": "Useful when memory writes are significantly more expensive than reads, as it performs at most O(N) swaps.",
        "pseudocode": (
            "procedure selectionSort(A : list)\n"
            "    n := length(A)\n"
            "    for i := 0 to n - 2 do\n"
            "        minIdx := i\n"
            "        for j := i + 1 to n - 1 do\n"
            "            if A[j] < A[minIdx] then minIdx := j\n"
            "        if minIdx != i then swap(A[i], A[minIdx])\n"
            "    end for\n"
            "end procedure"
        ),
        "code_implementations": {
            "python": "def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\nprint(selection_sort([29, 10, 14, 37, 13]))"
        },
        "default_array": [29, 10, 14, 37, 13, 8, 42, 20]
    },
    {
        "id": "insertion-sort",
        "title": "Insertion Sort",
        "category": "Sorting",
        "difficulty": "Easy",
        "time_complexity": {"best": "O(N)", "average": "O(N²)", "worst": "O(N²)"},
        "space_complexity": "O(1)",
        "stable": True,
        "description": "Insertion Sort works the way people sort a hand of playing cards: it takes elements one by one from the unsorted segment and inserts them into their correct sorted position on the left.",
        "real_world": "High efficiency for small datasets (N <= 16); used as the base case in hybrid algorithms like Timsort (used in Python and Java).",
        "pseudocode": (
            "procedure insertionSort(A : list)\n"
            "    for i := 1 to length(A) - 1 do\n"
            "        key := A[i]\n"
            "        j := i - 1\n"
            "        while j >= 0 and A[j] > key do\n"
            "            A[j + 1] := A[j]\n"
            "            j := j - 1\n"
            "        end while\n"
            "        A[j + 1] := key\n"
            "    end for\n"
            "end procedure"
        ),
        "code_implementations": {
            "python": "def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr\n\nprint(insertion_sort([12, 11, 13, 5, 6]))"
        },
        "default_array": [35, 18, 52, 9, 24, 40, 15]
    },
    {
        "id": "merge-sort",
        "title": "Merge Sort",
        "category": "Sorting",
        "difficulty": "Medium",
        "time_complexity": {"best": "O(N log N)", "average": "O(N log N)", "worst": "O(N log N)"},
        "space_complexity": "O(N)",
        "stable": True,
        "description": "Merge Sort is a divide-and-conquer algorithm that recursively splits an array in half until single elements remain, and then merges the sorted halves back together.",
        "real_world": "Standard for external sorting on disk files, linked lists, and systems requiring guaranteed O(N log N) upper bounds.",
        "pseudocode": (
            "function mergeSort(A : list)\n"
            "    if length(A) <= 1 then return A\n"
            "    mid := length(A) / 2\n"
            "    left := mergeSort(A[0..mid-1])\n"
            "    right := mergeSort(A[mid..end])\n"
            "    return merge(left, right)\n"
            "end function"
        ),
        "code_implementations": {
            "python": "def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    \n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nprint(merge_sort([38, 27, 43, 3, 9, 82, 10]))"
        },
        "default_array": [38, 27, 43, 3, 9, 82, 10, 19]
    },
    {
        "id": "quick-sort",
        "title": "Quick Sort",
        "category": "Sorting",
        "difficulty": "Medium",
        "time_complexity": {"best": "O(N log N)", "average": "O(N log N)", "worst": "O(N²)"},
        "space_complexity": "O(log N)",
        "stable": False,
        "description": "Quick Sort picks an element as a 'pivot' and partitions the array around the pivot such that smaller elements move to the left and larger elements move to the right, then recurses on subarrays.",
        "real_world": "Default standard sorting implementation in standard C qsort, C++ std::sort, and V8 engine.",
        "pseudocode": (
            "procedure quickSort(A, low, high)\n"
            "    if low < high then\n"
            "        p := partition(A, low, high)\n"
            "        quickSort(A, low, p - 1)\n"
            "        quickSort(A, p + 1, high)\n"
            "    end if\n"
            "end procedure"
        ),
        "code_implementations": {
            "python": "def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)\n\nprint(quick_sort([10, 80, 30, 90, 40, 50, 70]))"
        },
        "default_array": [50, 23, 9, 18, 61, 32, 85, 4]
    },
    {
        "id": "heap-sort",
        "title": "Heap Sort",
        "category": "Sorting",
        "difficulty": "Medium",
        "time_complexity": {"best": "O(N log N)", "average": "O(N log N)", "worst": "O(N log N)"},
        "space_complexity": "O(1)",
        "stable": False,
        "description": "Heap Sort converts the array into a Binary Max-Heap, then repeatedly extracts the maximum root element and swaps it to the end of the array, rebuilding the heap.",
        "real_world": "Embedded systems and real-time flight controllers where worst-case memory O(1) and worst-case time O(N log N) are strictly required.",
        "pseudocode": (
            "procedure heapSort(A)\n"
            "    buildMaxHeap(A)\n"
            "    for i := length(A) - 1 downto 1 do\n"
            "        swap(A[0], A[i])\n"
            "        heapify(A, 0, i)\n"
            "    end for\n"
            "end procedure"
        ),
        "code_implementations": {
            "python": "def heapify(arr, n, i):\n    largest = i\n    l = 2 * i + 1\n    r = 2 * i + 2\n    if l < n and arr[l] > arr[largest]:\n        largest = l\n    if r < n and arr[r] > arr[largest]:\n        largest = r\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)\n\ndef heap_sort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[i], arr[0] = arr[0], arr[i]\n        heapify(arr, i, 0)\n    return arr"
        },
        "default_array": [48, 12, 75, 33, 90, 21, 64]
    },
    {
        "id": "shell-sort",
        "title": "Shell Sort",
        "category": "Sorting",
        "difficulty": "Medium",
        "time_complexity": {"best": "O(N log N)", "average": "O(N^(3/2))", "worst": "O(N²)"},
        "space_complexity": "O(1)",
        "stable": False,
        "description": "Shell Sort is a generalization of insertion sort that sorts pairs of elements far apart from each other, progressively reducing the gap between elements to be compared.",
        "real_world": "Used in the Linux kernel for lightweight embedded sorting where call-stack overhead of recursion must be avoided.",
        "pseudocode": (
            "procedure shellSort(A)\n"
            "    n := length(A)\n"
            "    gap := floor(n / 2)\n"
            "    while gap > 0 do\n"
            "        for i := gap to n - 1 do\n"
            "            temp := A[i]\n"
            "            j := i\n"
            "            while j >= gap and A[j - gap] > temp do\n"
            "                A[j] := A[j - gap]\n"
            "                j := j - gap\n"
            "            end while\n"
            "            A[j] := temp\n"
            "        end for\n"
            "        gap := floor(gap / 2)\n"
            "    end while\n"
            "end procedure"
        ),
        "code_implementations": {
            "python": "def shell_sort(arr):\n    n = len(arr)\n    gap = n // 2\n    while gap > 0:\n        for i in range(gap, n):\n            temp = arr[i]\n            j = i\n            while j >= gap and arr[j - gap] > temp:\n                arr[j] = arr[j - gap]\n                j -= gap\n            arr[j] = temp\n        gap //= 2\n    return arr"
        },
        "default_array": [62, 14, 88, 30, 45, 9, 73, 27]
    },
    {
        "id": "counting-sort",
        "title": "Counting Sort",
        "category": "Sorting",
        "difficulty": "Medium",
        "time_complexity": {"best": "O(N + K)", "average": "O(N + K)", "worst": "O(N + K)"},
        "space_complexity": "O(K)",
        "stable": True,
        "description": "Counting Sort is a non-comparison integer sorting algorithm that counts the occurrences of each unique value and calculates their positions using prefix sums.",
        "real_world": "Subroutine in Radix Sort, sorting demographic age distributions, and fixed range byte keys.",
        "pseudocode": (
            "procedure countingSort(A, maxVal)\n"
            "    count := array of zeros of size maxVal + 1\n"
            "    for each x in A: count[x] := count[x] + 1\n"
            "    total := 0\n"
            "    for i := 0 to maxVal do\n"
            "        oldCount := count[i]\n"
            "        count[i] := total\n"
            "        total := total + oldCount\n"
            "    end for\n"
            "    for each x in A do\n"
            "        output[count[x]] := x\n"
            "        count[x] := count[x] + 1\n"
            "    end for\n"
            "end procedure"
        ),
        "code_implementations": {
            "python": "def counting_sort(arr):\n    if not arr:\n        return arr\n    max_val = max(arr)\n    count = [0] * (max_val + 1)\n    for num in arr:\n        count[num] += 1\n    sorted_arr = []\n    for i, c in enumerate(count):\n        sorted_arr.extend([i] * c)\n    return sorted_arr"
        },
        "default_array": [4, 2, 7, 2, 1, 4, 6, 3]
    },
    {
        "id": "radix-sort",
        "title": "Radix Sort",
        "category": "Sorting",
        "difficulty": "Medium",
        "time_complexity": {"best": "O(D * (N + B))", "average": "O(D * (N + B))", "worst": "O(D * (N + B))"},
        "space_complexity": "O(N + B)",
        "stable": True,
        "description": "Radix Sort sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value, from least significant digit (LSD) to most significant digit (MSD).",
        "real_world": "Card sorting machines, parallel GPU suffix array construction, large integer sorting.",
        "pseudocode": (
            "procedure radixSort(A)\n"
            "    maxVal := max(A)\n"
            "    exp := 1\n"
            "    while maxVal / exp > 0 do\n"
            "        countingSortByDigit(A, exp)\n"
            "        exp := exp * 10\n"
            "    end while\n"
            "end procedure"
        ),
        "code_implementations": {
            "python": "def radix_sort(arr):\n    if not arr: return arr\n    max_val = max(arr)\n    exp = 1\n    while max_val // exp > 0:\n        buckets = [[] for _ in range(10)]\n        for num in arr:\n            digit = (num // exp) % 10\n            buckets[digit].append(num)\n        arr = [num for bucket in buckets for num in bucket]\n        exp *= 10\n    return arr"
        },
        "default_array": [170, 45, 75, 90, 802, 24, 2, 66]
    },
    {
        "id": "linear-search",
        "title": "Linear Search",
        "category": "Searching",
        "difficulty": "Easy",
        "time_complexity": {"best": "O(1)", "average": "O(N)", "worst": "O(N)"},
        "space_complexity": "O(1)",
        "stable": True,
        "description": "Linear Search sequentially checks each element of the list in order until a match is found or the whole list has been searched.",
        "real_world": "Searching unsorted arrays, small lists, or linear hardware streams.",
        "pseudocode": (
            "function linearSearch(A, target)\n"
            "    for i := 0 to length(A) - 1 do\n"
            "        if A[i] == target then return i\n"
            "    end for\n"
            "    return -1\n"
            "end function"
        ),
        "code_implementations": {
            "python": "def linear_search(arr, target):\n    for idx, val in enumerate(arr):\n        if val == target:\n            return idx\n    return -1\n\nprint(linear_search([4, 2, 7, 1, 9, 3], 7)) # 2"
        },
        "default_array": [14, 52, 33, 89, 41, 75, 26, 68]
    },
    {
        "id": "binary-search",
        "title": "Binary Search",
        "category": "Searching",
        "difficulty": "Easy",
        "time_complexity": {"best": "O(1)", "average": "O(log N)", "worst": "O(log N)"},
        "space_complexity": "O(1)",
        "stable": True,
        "description": "Binary Search works on sorted arrays by repeatedly dividing the search interval in half. If the target value is less than the middle element, it narrows the interval to the lower half; otherwise, to the upper half.",
        "real_world": "Database index lookups, dictionary lookups, Git bisect, debugging binary space partitioning.",
        "pseudocode": (
            "function binarySearch(A, target)\n"
            "    low := 0, high := length(A) - 1\n"
            "    while low <= high do\n"
            "        mid := low + (high - low) / 2\n"
            "        if A[mid] == target then return mid\n"
            "        else if A[mid] < target then low := mid + 1\n"
            "        else high := mid - 1\n"
            "    end while\n"
            "    return -1\n"
            "end function"
        ),
        "code_implementations": {
            "python": "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(binary_search([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23))"
        },
        "default_array": [5, 12, 19, 27, 34, 48, 59, 71, 86, 94]
    },
    {
        "id": "bfs",
        "title": "Breadth-First Search (BFS)",
        "category": "Graph",
        "difficulty": "Medium",
        "time_complexity": {"best": "O(V + E)", "average": "O(V + E)", "worst": "O(V + E)"},
        "space_complexity": "O(V)",
        "stable": True,
        "description": "Breadth-First Search traverses a tree or graph level by level using a Queue (FIFO), exploring all neighbor nodes before moving to the next depth tier.",
        "real_world": "Social network connection distance (e.g. 1st/2nd degree friends), shortest path on unweighted graphs, peer-to-peer torrent discovery.",
        "pseudocode": (
            "procedure BFS(G, start_v)\n"
            "    let Q be a queue\n"
            "    label start_v as discovered\n"
            "    Q.enqueue(start_v)\n"
            "    while Q is not empty do\n"
            "        v := Q.dequeue()\n"
            "        for all edges from v to w in G.adjacentEdges(v) do\n"
            "            if w is not labeled as discovered then\n"
            "                label w as discovered\n"
            "                Q.enqueue(w)\n"
            "            end if\n"
            "        end for\n"
            "    end while\n"
            "end procedure"
        ),
        "code_implementations": {
            "python": "from collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    while queue:\n        vertex = queue.popleft()\n        order.append(vertex)\n        for neighbor in graph[vertex]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order"
        },
        "default_array": [1, 2, 3, 4, 5, 6]
    },
    {
        "id": "dfs",
        "title": "Depth-First Search (DFS)",
        "category": "Graph",
        "difficulty": "Medium",
        "time_complexity": {"best": "O(V + E)", "average": "O(V + E)", "worst": "O(V + E)"},
        "space_complexity": "O(V)",
        "stable": True,
        "description": "Depth-First Search explores as deep as possible along each branch before backtracking, utilizing recursion or a Stack (LIFO).",
        "real_world": "Maze solving, topological sorting in build systems, finding strongly connected components, detecting cycles.",
        "pseudocode": (
            "procedure DFS(G, v)\n"
            "    label v as discovered\n"
            "    for all directed edges from v to w that are in G.adjacentEdges(v) do\n"
            "        if vertex w is not labeled as discovered then\n"
            "            recursively call DFS(G, w)\n"
            "        end if\n"
            "    end for\n"
            "end procedure"
        ),
        "code_implementations": {
            "python": "def dfs(graph, start, visited=None):\n    if visited is None: visited = set()\n    visited.add(start)\n    order = [start]\n    for next_node in graph[start]:\n        if next_node not in visited:\n            order.extend(dfs(graph, next_node, visited))\n    return order"
        },
        "default_array": [1, 2, 3, 4, 5, 6]
    },
    {
        "id": "dijkstra",
        "title": "Dijkstra's Shortest Path",
        "category": "Graph",
        "difficulty": "Hard",
        "time_complexity": {"best": "O((V + E) log V)", "average": "O((V + E) log V)", "worst": "O((V + E) log V)"},
        "space_complexity": "O(V)",
        "stable": True,
        "description": "Dijkstra's Algorithm finds the shortest paths from a single source node to all other nodes in a weighted graph with non-negative edge weights.",
        "real_world": "Google Maps GPS navigation, OSPF internet network routing protocols, IP routing.",
        "pseudocode": (
            "function Dijkstra(Graph, source)\n"
            "    dist[source] := 0\n"
            "    create priority queue Q\n"
            "    for each vertex v: dist[v] := infinity, Q.add(v)\n"
            "    while Q is not empty:\n"
            "        u := vertex in Q with min dist[u]\n"
            "        remove u from Q\n"
            "        for each neighbor v of u:\n"
            "            alt := dist[u] + length(u, v)\n"
            "            if alt < dist[v] then dist[v] := alt\n"
            "end function"
        ),
        "code_implementations": {
            "python": "import heapq\n\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n    \n    while pq:\n        current_dist, u = heapq.heappop(pq)\n        if current_dist > distances[u]: continue\n        for v, weight in graph[u].items():\n            d = current_dist + weight\n            if d < distances[v]:\n                distances[v] = d\n                heapq.heappush(pq, (d, v))\n    return distances"
        },
        "default_array": [0, 4, 2, 7, 3, 6]
    }
]

# Hydrate all registered algorithms with complete multi-language implementations
for algo in ALGORITHMS_REGISTRY:
    algo_id = algo.get("id")
    if algo_id in ALGORITHM_MULTI_LANGUAGE_CODES:
        algo["code_implementations"] = ALGORITHM_MULTI_LANGUAGE_CODES[algo_id]

@router.get("", response_model=List[Dict[str, Any]])
def list_algorithms():
    return ALGORITHMS_REGISTRY

@router.get("/{algo_id}")
def get_algorithm(algo_id: str):
    for a in ALGORITHMS_REGISTRY:
        if a["id"] == algo_id:
            return a
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Algorithm not found")
