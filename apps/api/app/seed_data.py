from sqlalchemy.orm import Session
from sqlalchemy import select
from .models import Lesson, PracticeProblem, TestCase

LESSONS_DATA = [
    {
        "order_index": 1,
        "title": "Introduction to Programming",
        "category": "Foundations",
        "difficulty": "Beginner",
        "estimated_minutes": 10,
        "definition": "Programming is the art and science of giving precise instructions to a computer to solve problems and automate tasks.",
        "analogy": "Writing a program is like writing a culinary recipe. If you tell a chef 'Bake cookies', they need exact ingredients, measurements, and baking temperatures in order.",
        "visual_diagram": "Human Thought ──> Programming Language ──> Binary Code (0s & 1s) ──> Computer Action",
        "syntax_explanation": "Every programming language has grammatical rules called syntax that determine how words and symbols are arranged.",
        "example_codes": {
            "python": "# Your very first program\nprint('Hello, Codeverse!')",
            "javascript": "// Your very first program\nconsole.log('Hello, Codeverse!');",
            "c": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, Codeverse!\\n\");\n    return 0;\n}"
        },
        "line_by_line": {
            "1": "Calls the output command to display human-readable text on the screen."
        },
        "common_mistakes": [
            {"mistake": "Forgetting quotation marks around text", "fix": "Always enclose strings in matching quotes like 'text' or \"text\"."}
        ],
        "quiz": {
            "question": "What is the primary purpose of a computer program?",
            "options": [
                "To give specific instructions to hardware to complete a task",
                "To physically accelerate the computer's CPU clock",
                "To connect cables inside the motherboard",
                "To turn off the computer monitor"
            ],
            "correct_index": 0,
            "explanation": "A computer program is a sequence of structured instructions that directs a computer's processor to perform a desired task."
        }
    },
    {
        "order_index": 2,
        "title": "What is a Programming Language?",
        "category": "Foundations",
        "difficulty": "Beginner",
        "estimated_minutes": 10,
        "definition": "A programming language is a formal system of notation designed to communicate instructions to a computer in human-readable terms.",
        "analogy": "Computers only speak electricity (high or low voltage, represented as 1 and 0). A programming language is the universal translator between human logic and electrical transistors.",
        "visual_diagram": "English / Human Logic ──[Code]──> Compiler / Runtime ──[Machine Code]──> CPU",
        "syntax_explanation": "High-level languages like Python, JavaScript, and C provide readable vocabulary and arithmetic expressions.",
        "example_codes": {
            "python": "message = 'Programming is communication'\nprint(message)",
            "javascript": "const message = 'Programming is communication';\nconsole.log(message);"
        },
        "line_by_line": {
            "1": "Stores textual data inside a named container called message.",
            "2": "Prints the stored message to stdout."
        },
        "common_mistakes": [
            {"mistake": "Confusing programming languages with markup languages like HTML", "fix": "HTML describes page layout; programming languages perform computational logic."}
        ],
        "quiz": {
            "question": "Why do humans write code in high-level languages instead of binary 0s and 1s?",
            "options": [
                "Binary numbers take up too much physical desk space",
                "High-level languages are human-readable, easier to reason about, and reduce errors",
                "Computers can only parse high-level languages",
                "Binary cannot perform math"
            ],
            "correct_index": 1,
            "explanation": "High-level languages allow engineers to express complex logic intuitively; compilers automatically translate this into binary machine instructions."
        }
    },
    {
        "order_index": 3,
        "title": "How Computers Execute Code",
        "category": "Foundations",
        "difficulty": "Beginner",
        "estimated_minutes": 12,
        "definition": "Code execution is the hardware cycle where the Central Processing Unit (CPU) retrieves instructions from RAM, decodes them, and carries out the calculation.",
        "analogy": "Imagine an assembly line: The worker fetches a blueprint from the shelf (Fetch), reads the step (Decode), welds the part (Execute), and records the result in the ledger (Store).",
        "visual_diagram": "[ RAM Memory ] <──> [ Instruction Fetch ] ──> [ Decode ] ──> [ ALU Execute ] ──> [ Registers ]",
        "syntax_explanation": "Code statements are evaluated sequentially line by line from top to bottom unless branching conditions change the flow.",
        "example_codes": {
            "python": "step1 = 10\nstep2 = 20\nresult = step1 + step2\nprint(result)",
            "javascript": "let step1 = 10;\nlet step2 = 20;\nlet result = step1 + step2;\nconsole.log(result);"
        },
        "line_by_line": {
            "1": "Loads integer 10 into variable step1 in memory.",
            "2": "Loads integer 20 into variable step2.",
            "3": "CPU adds the two numbers and saves 30 into result.",
            "4": "Displays 30."
        },
        "common_mistakes": [
            {"mistake": "Expecting the computer to know what a variable means before it is assigned", "fix": "Code runs sequentially; always define values before reading them."}
        ],
        "quiz": {
            "question": "What is the four-stage cycle that a CPU repeats billions of times per second?",
            "options": [
                "Fetch, Decode, Execute, Store",
                "Compile, Link, Deploy, Delete",
                "Read, Write, Format, Refresh",
                "Boot, Login, Browse, Shutdown"
            ],
            "correct_index": 0,
            "explanation": "The fundamental CPU instruction cycle consists of Fetching the instruction from memory, Decoding it, Executing it in arithmetic logic, and Storing results."
        }
    },
    {
        "order_index": 4,
        "title": "Source Code and Machine Code",
        "category": "Architecture",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "Source code is human-readable text written in a programming language; machine code consists of native binary instructions directly executed by the CPU.",
        "analogy": "Source code is an architectural blueprint drawn in English; machine code is the actual crane moving steel beams on the construction site.",
        "visual_diagram": "Source Code (.py / .c / .js) ──[Translation Tool]──> Machine Code (10110001 00000001...)",
        "syntax_explanation": "Files are plain text documents containing code statements saved with language extensions (.py, .c, .cpp, .js).",
        "example_codes": {
            "python": "x = 42\nprint(f'The answer is {x}')",
            "c": "#include <stdio.h>\nint main() {\n    int x = 42;\n    printf(\"The answer is %d\\n\", x);\n    return 0;\n}"
        },
        "line_by_line": {
            "1": "Assigns literal number 42 to variable x.",
            "2": "Formats and prints string containing x."
        },
        "common_mistakes": [
            {"mistake": "Opening a compiled .exe file in a text editor", "fix": "Executable binaries contain compiled machine instructions and look like garbled symbols in text editors."}
        ],
        "quiz": {
            "question": "What is machine code?",
            "options": [
                "Binary instructions consisting of 0s and 1s that the CPU directly understands",
                "Source code written with comments",
                "HTML code that formats web buttons",
                "Python scripts running inside a web browser"
            ],
            "correct_index": 0,
            "explanation": "Machine code is the native representation of computer instructions in binary that the microarchitecture of the CPU physically processes."
        }
    },
    {
        "order_index": 5,
        "title": "Compiler vs Interpreter",
        "category": "Architecture",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "A compiler translates the entire source program into machine code beforehand (e.g. C, C++, Rust); an interpreter translates and executes code line by line at runtime (e.g. Python, Ruby).",
        "analogy": "A compiler is like translating an entire book into Spanish and printing 10,000 copies for readers. An interpreter is like a live translator whispering line by line in an ambassador's ear.",
        "visual_diagram": "Compiled: Source ──> [Compiler] ──> [Binary Executable] ──> Instant Execution\nInterpreted: Source ──> [Interpreter Reads Line] ──> Executes Line Directly",
        "syntax_explanation": "Compiled languages catch syntax and type errors during build time before any code runs; interpreted languages catch errors as they hit each line.",
        "example_codes": {
            "python": "# Interpreted at runtime line-by-line\nimport sys\nprint('Running under Python:', sys.version.split()[0])",
            "c": "// Compiled with GCC into machine binary\n#include <stdio.h>\nint main() {\n    puts(\"Compiled directly to native CPU code.\");\n    return 0;\n}"
        },
        "line_by_line": {
            "1": "Imports system library module.",
            "2": "Prints the active interpreter version."
        },
        "common_mistakes": [
            {"mistake": "Thinking interpreted languages don't check syntax at all", "fix": "Interpreters do parse bytecode, but execution halts dynamically upon runtime error."}
        ],
        "quiz": {
            "question": "Which of the following is typically a compiled language?",
            "options": [
                "C",
                "Python",
                "Bash",
                "PHP"
            ],
            "correct_index": 0,
            "explanation": "C is a compiled language; compilers like GCC or Clang compile source code directly into native machine code binaries before execution."
        }
    },
    {
        "order_index": 6,
        "title": "Variables",
        "category": "Core Elements",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "A variable is a named storage location in computer memory that holds a value that can be read or modified during program execution.",
        "analogy": "A variable is like a labeled storage cubby. Label it 'score', put the number 10 inside. When you earn points, you replace the 10 with 15.",
        "visual_diagram": "[ RAM Memory Address: 0x7FFE ] ──> Label: 'player_score' ──> Content: [ 100 ]",
        "syntax_explanation": "In Python, assign with = : variable_name = value. In C/Java, specify type first: int score = 100;",
        "example_codes": {
            "python": "player_name = 'Alex'\nscore = 150\nprint(player_name, 'has score:', score)\n# Update variable\nscore = score + 50\nprint('New score:', score)",
            "javascript": "let playerName = 'Alex';\nlet score = 150;\nconsole.log(playerName, 'has score:', score);\nscore += 50;\nconsole.log('New score:', score);"
        },
        "line_by_line": {
            "1": "Creates variable player_name with string 'Alex'.",
            "2": "Creates variable score with number 150.",
            "4": "Reads current score (150), adds 50, and updates score to 200."
        },
        "common_mistakes": [
            {"mistake": "Confusing assignment (=) with equality comparison (==)", "fix": "= puts a value into a variable; == tests if two values are equal."}
        ],
        "quiz": {
            "question": "What happens when you write 'score = score + 10'?",
            "options": [
                "The computer creates a syntax error because score cannot equal score + 10 in math",
                "The computer reads current value of score, adds 10, and writes the new sum back into score",
                "The computer permanently multiplies score by 10",
                "The variable score is deleted"
            ],
            "correct_index": 1,
            "explanation": "Assignment evaluates the right-hand side first (reads current score + 10) and then stores that calculated result into the variable on the left."
        }
    },
    {
        "order_index": 7,
        "title": "Constants",
        "category": "Core Elements",
        "difficulty": "Beginner",
        "estimated_minutes": 10,
        "definition": "A constant is an identifier whose associated value cannot be altered by the program during normal execution.",
        "analogy": "A constant is like engraving your date of birth onto an identity plaque. Once set, it cannot change.",
        "visual_diagram": "Variable: [ Box with open lid ] (Modifiable)\nConstant: [ Sealed Safe ] (Immutable)",
        "syntax_explanation": "JavaScript uses const PI = 3.14159;. Python conventionally uses UPPERCASE names like MAX_CONNECTIONS = 100.",
        "example_codes": {
            "python": "PI = 3.14159\nradius = 5\narea = PI * (radius ** 2)\nprint('Area of circle:', area)",
            "javascript": "const PI = 3.14159;\nlet radius = 5;\nlet area = PI * (radius ** 2);\nconsole.log('Area of circle:', area);"
        },
        "line_by_line": {
            "1": "Defines constant PI as 3.14159.",
            "3": "Calculates circle area using the immutable constant."
        },
        "common_mistakes": [
            {"mistake": "Attempting to reassign a const variable in JavaScript", "fix": "Reassigning a const throws a TypeError. Use let if the value must change."}
        ],
        "quiz": {
            "question": "Why do engineers use constants instead of standard variables for values like PI or tax rates?",
            "options": [
                "To prevent accidental changes to critical values throughout the codebase",
                "Because constants consume zero bytes of RAM",
                "Because variables are illegal in production code",
                "To make code compile 100 times faster"
            ],
            "correct_index": 0,
            "explanation": "Constants safeguard your program against accidental reassignment and make your code's business rules clear to other engineers."
        }
    },
    {
        "order_index": 8,
        "title": "Data Types",
        "category": "Core Elements",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "A data type tells the computer what kind of value a variable holds (integer, floating-point number, string, boolean) and what operations can be performed on it.",
        "analogy": "Think of containers in a kitchen: you don't store soup in an envelope or mail a letter in a saucepan. Data types ensure the right operations happen on the right data.",
        "visual_diagram": "Data Types:\n ├── Integers (int): -5, 0, 42\n ├── Floats (float): 3.14, -0.01\n ├── Strings (str): 'Hello', '123'\n └── Booleans (bool): True, False",
        "syntax_explanation": "Python checks types dynamically; languages like C and Java require explicit declarations: int age = 20; float gpa = 3.8;",
        "example_codes": {
            "python": "age = 21            # int\ngpa = 3.85          # float\nname = 'Sinan'      # str\nis_student = True   # bool\n\nprint(type(age), type(gpa), type(name), type(is_student))",
            "c": "#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n    int age = 21;\n    float gpa = 3.85f;\n    char name[] = \"Sinan\";\n    bool is_student = true;\n    printf(\"%s is %d with GPA %.2f\\n\", name, age, gpa);\n    return 0;\n}"
        },
        "line_by_line": {
            "1": "Assigns integer value 21.",
            "2": "Assigns fractional floating-point value 3.85.",
            "3": "Assigns string textual value.",
            "4": "Assigns logical boolean truth value."
        },
        "common_mistakes": [
            {"mistake": "Adding a string '10' and an integer 5 without conversion", "fix": "In Python '10' + 5 causes TypeError. Convert with int('10') + 5."}
        ],
        "quiz": {
            "question": "What is the data type of the value True or False?",
            "options": [
                "Boolean",
                "Integer",
                "Character",
                "Double"
            ],
            "correct_index": 0,
            "explanation": "Boolean data types represent one of two truth values: True or False, named after mathematician George Boole."
        }
    },
    {
        "order_index": 9,
        "title": "Operators",
        "category": "Core Elements",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "Operators are special symbols that perform mathematical, relational, or logical computations on operands.",
        "analogy": "If operands are ingredients, operators are kitchen actions like slicing (+), blending (*), or checking if two dishes weigh the same (==).",
        "visual_diagram": "Arithmetic: + - * / // % **\nComparison: == != < > <= >=\nLogical: and, or, not (&&, ||, !)",
        "syntax_explanation": "Operators follow precedence rules (PEMDAS). Use parentheses to make operation order explicit.",
        "example_codes": {
            "python": "a = 15\nb = 4\nprint('Sum:', a + b)\nprint('Floor Div:', a // b)  # 3\nprint('Modulo (Remainder):', a % b) # 3\nprint('Is a greater than b?', a > b) # True",
            "javascript": "let a = 15;\nlet b = 4;\nconsole.log('Sum:', a + b);\nconsole.log('Quotient:', Math.floor(a / b));\nconsole.log('Remainder:', a % b);\nconsole.log('Is a > b?', a > b);"
        },
        "line_by_line": {
            "3": "Performs addition.",
            "4": "Performs integer floor division.",
            "5": "Calculates remainder using modulo operator %.",
            "6": "Compares relational inequality."
        },
        "common_mistakes": [
            {"mistake": "Confusing the remainder operator % with percentage", "fix": "15 % 4 calculates 15 divided by 4 which gives quotient 3 with remainder 3."}
        ],
        "quiz": {
            "question": "What does 17 % 5 evaluate to?",
            "options": [
                "2",
                "3.4",
                "3",
                "0"
            ],
            "correct_index": 0,
            "explanation": "5 divides into 17 three times (15) with a remainder of 2. Modulo (%) returns the remainder: 2."
        }
    },
    {
        "order_index": 10,
        "title": "Input and Output",
        "category": "Interaction",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "Input allows a program to receive data from users or external streams; output allows a program to send formatted results back to the user or console.",
        "analogy": "Input is speaking into a microphone; output is hearing the amplified voice through speakers.",
        "visual_diagram": "[ Keyboard / Stdin ] ──> Program Processing ──> [ Display Terminal / Stdout ]",
        "syntax_explanation": "In Python, input() reads a string from standard input, and print() outputs to standard output. In C, scanf() and printf() are used.",
        "example_codes": {
            "python": "# Read input (simulated in runner)\nuser_name = 'Learner'\nprint(f'Welcome to Codeverse, {user_name}!')",
            "c": "#include <stdio.h>\n\nint main() {\n    char name[50] = \"Learner\";\n    printf(\"Welcome to Codeverse, %s!\\n\", name);\n    return 0;\n}"
        },
        "line_by_line": {
            "2": "Stores string value.",
            "3": "Formats and transmits output to stdout stream."
        },
        "common_mistakes": [
            {"mistake": "Forgetting that input() in Python returns a string", "fix": "If reading a number, wrap it in int(): age = int(input())."}
        ],
        "quiz": {
            "question": "In standard computing, what is the default output stream called?",
            "options": [
                "stdout (standard output)",
                "stdin (standard input)",
                "stderr (standard error)",
                "stdnet (standard network)"
            ],
            "correct_index": 0,
            "explanation": "Standard output (stdout) is the default destination stream for normal program printing, typically routed to the console terminal."
        }
    },
    {
        "order_index": 11,
        "title": "Conditional Statements",
        "category": "Control Flow",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "Conditionals allow a program to make decisions and execute different blocks of code depending on whether a boolean expression is True or False.",
        "analogy": "Like a traffic light: IF the light is green, proceed. ELSE IF the light is yellow, slow down. ELSE (it's red), stop.",
        "visual_diagram": "       [ Condition Check ]\n          /           \\\n     (True)          (False)\n      /                 \\\n [ Block A ]        [ Block B ]",
        "syntax_explanation": "Uses keywords if, elif (else if), and else followed by indented code blocks.",
        "example_codes": {
            "python": "score = 85\n\nif score >= 90:\n    print('Grade: A')\nelif score >= 80:\n    print('Grade: B')\nelse:\n    print('Grade: C or below')",
            "javascript": "let score = 85;\nif (score >= 90) {\n    console.log('Grade: A');\n} else if (score >= 80) {\n    console.log('Grade: B');\n} else {\n    console.log('Grade: C or below');\n}"
        },
        "line_by_line": {
            "3": "Checks if score is at least 90 (False).",
            "5": "Checks next condition if score is at least 80 (True).",
            "6": "Executes this branch and outputs 'Grade: B'."
        },
        "common_mistakes": [
            {"mistake": "Using single = inside an if condition", "fix": "if score = 90 causes a SyntaxError. Comparison must use double =="}
        ],
        "quiz": {
            "question": "If x = 15, what will this code print: 'if x > 20: print(1) elif x > 10: print(2) else: print(3)'?",
            "options": [
                "2",
                "1",
                "3",
                "Both 2 and 3"
            ],
            "correct_index": 0,
            "explanation": "15 > 20 is False. The elif condition 15 > 10 is True, so it executes and prints 2, then skips the rest of the conditional."
        }
    },
    {
        "order_index": 12,
        "title": "Loops",
        "category": "Control Flow",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "A loop repeatedly executes a block of statements as long as a specified condition remains true or for each item in a collection.",
        "analogy": "Running laps around a track: Lap 1, Lap 2, Lap 3... until you complete your 5-lap goal.",
        "visual_diagram": "──> [ Check Condition ] ──(True)──> [ Execute Loop Body ] ───┐\n          │                                                 │\n       (False) <────────────────────────────────────────────┘\n          └──> [ Exit Loop ]",
        "syntax_explanation": "For loops iterate over sequences: for item in list:. While loops repeat while a condition holds: while count < 5:.",
        "example_codes": {
            "python": "# For loop over range\nfor i in range(1, 6):\n    print('Lap', i)\n\n# While loop\ncount = 3\nwhile count > 0:\n    print('Countdown:', count)\n    count -= 1\nprint('Blast off!')",
            "javascript": "for (let i = 1; i <= 5; i++) {\n    console.log('Lap', i);\n}"
        },
        "line_by_line": {
            "2": "Sets loop variable i from 1 to 5.",
            "3": "Executes body 5 times with changing i.",
            "8": "Decrements count to prevent an infinite loop."
        },
        "common_mistakes": [
            {"mistake": "Creating an infinite loop in a while loop by forgetting to update the counter", "fix": "Always ensure the while loop condition will eventually evaluate to False."}
        ],
        "quiz": {
            "question": "What is an infinite loop?",
            "options": [
                "A loop whose condition never becomes False, freezing or hanging the program",
                "A loop that executes exactly 1,000 times",
                "A loop that counts backwards",
                "A loop written inside a database"
            ],
            "correct_index": 0,
            "explanation": "An infinite loop occurs when the loop condition never changes to False, consuming CPU resources indefinitely until interrupted."
        }
    },
    {
        "order_index": 13,
        "title": "Nested Loops",
        "category": "Control Flow",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "A nested loop is a loop situated inside the body of another loop. The inner loop executes completely for every single iteration of the outer loop.",
        "analogy": "Think of a digital clock: for every single hour (outer loop), the minute counter (inner loop) must tick through all 60 minutes.",
        "visual_diagram": "Outer Loop (Row 1 to 3)\n └── Inner Loop (Col 1 to 3)\n      └── Action: Print (Row, Col)",
        "syntax_explanation": "Indentation determines nesting level. Watch out for time complexity (two nested loops running N times takes N² operations).",
        "example_codes": {
            "python": "# Multiplication grid snippet\nfor row in range(1, 4):\n    for col in range(1, 4):\n        print(f'{row * col:2}', end=' ')\n    print() # New line after row",
            "javascript": "for (let r = 1; r <= 3; r++) {\n    let line = '';\n    for (let c = 1; c <= 3; c++) {\n        line += (r * c) + ' ';\n    }\n    console.log(line);\n}"
        },
        "line_by_line": {
            "2": "Outer loop iterates rows 1, 2, 3.",
            "3": "Inner loop iterates cols 1, 2, 3 for each row.",
            "4": "Prints multiplication cell."
        },
        "common_mistakes": [
            {"mistake": "Accidentally using the same variable name for both outer and inner loops", "fix": "Always use distinct variable names (e.g. i and j, or row and col)."}
        ],
        "quiz": {
            "question": "If an outer loop runs 4 times and an inner loop runs 5 times, how many total times does the inner loop body execute?",
            "options": [
                "20 times",
                "9 times",
                "4 times",
                "5 times"
            ],
            "correct_index": 0,
            "explanation": "The inner loop runs 5 times for each of the 4 outer iterations: 4 * 5 = 20 total executions."
        }
    },
    {
        "order_index": 14,
        "title": "Functions",
        "category": "Modular Code",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "A function is a named, organized, reusable block of code used to perform a single, related action.",
        "analogy": "A function is like a coffee machine: you press the 'Espresso' button, it executes the internal grinding and brewing steps, and hands you a cup.",
        "visual_diagram": "[ Arguments / Input ] ──> [ Function Box (Logic) ] ──> [ Return Value / Output ]",
        "syntax_explanation": "Defined using the def keyword in Python, function in JavaScript, or return type in C: def greet(name):",
        "example_codes": {
            "python": "def calculate_tax(price, rate=0.08):\n    \"\"\"Calculates total tax for a given price.\"\"\"\n    return price * rate\n\nlaptop_tax = calculate_tax(1200)\nprint('Tax on laptop:', laptop_tax)",
            "javascript": "function calculateTax(price, rate = 0.08) {\n    return price * rate;\n}\nconsole.log('Tax on laptop:', calculateTax(1200));"
        },
        "line_by_line": {
            "1": "Declares function calculate_tax with parameters price and default rate.",
            "3": "Multiplies inputs and returns calculated output.",
            "5": "Calls function with argument 1200."
        },
        "common_mistakes": [
            {"mistake": "Defining a function but forgetting to call it", "fix": "Defining def f(): does not execute the code; you must invoke it with f()."}
        ],
        "quiz": {
            "question": "Why are functions essential in software development?",
            "options": [
                "They promote DRY (Don't Repeat Yourself) code reuse and modularity",
                "They prevent computer monitors from overheating",
                "They are required by internet browsers to load images",
                "They convert Python into C automatically"
            ],
            "correct_index": 0,
            "explanation": "Functions prevent code duplication, make debugging easier, and allow large systems to be decomposed into small testable units."
        }
    },
    {
        "order_index": 15,
        "title": "Parameters and Return Values",
        "category": "Modular Code",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "Parameters are variables listed inside the function definition parentheses; return values are the data results transmitted back to the caller.",
        "analogy": "Parameters are raw fruit you drop into a blender; the return value is the delicious smoothie poured out.",
        "visual_diagram": "Caller Code: x = add(5, 7)  ───> Function: def add(a, b): return a + b ───> Returns 12 into x",
        "syntax_explanation": "The return keyword immediately terminates function execution and sends the value back to the caller.",
        "example_codes": {
            "python": "def is_even(number):\n    return number % 2 == 0\n\nprint('Is 8 even?', is_even(8))\nprint('Is 15 even?', is_even(15))",
            "javascript": "function isEven(number) {\n    return number % 2 === 0;\n}\nconsole.log('Is 8 even?', isEven(8));"
        },
        "line_by_line": {
            "1": "Accepts parameter number.",
            "2": "Evaluates boolean expression and returns True or False.",
            "4": "Prints result of calling is_even(8)."
        },
        "common_mistakes": [
            {"mistake": "Writing code below a return statement inside a function", "fix": "Any code placed directly after a return statement in the same block is unreachable dead code."}
        ],
        "quiz": {
            "question": "What happens if a Python function finishes without an explicit return statement?",
            "options": [
                "It implicitly returns None",
                "It causes a fatal crash",
                "It returns 0",
                "It deletes the calling script"
            ],
            "correct_index": 0,
            "explanation": "In Python, functions that reach the end without an explicit return statement automatically return the special value None."
        }
    },
    {
        "order_index": 16,
        "title": "Arrays & Lists",
        "category": "Data Structures",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "An array (or list) is a linear data structure that stores a collection of elements identified by index numbers starting from 0.",
        "analogy": "An egg carton: each slot holds an item, numbered slot 0, slot 1, slot 2... slot 11.",
        "visual_diagram": "Index:     [ 0 ]   [ 1 ]   [ 2 ]   [ 3 ]\nElements: [ 10 ]  [ 25 ]  [ 42 ]  [ 99 ]",
        "syntax_explanation": "Zero-indexed: array[0] accesses the very first element. array[len - 1] accesses the last element.",
        "example_codes": {
            "python": "scores = [92, 85, 99, 78]\nprint('First score:', scores[0])\nprint('Number of scores:', len(scores))\nscores.append(100)\nprint('Updated scores:', scores)",
            "javascript": "let scores = [92, 85, 99, 78];\nconsole.log('First score:', scores[0]);\nscores.push(100);\nconsole.log('Updated:', scores);"
        },
        "line_by_line": {
            "1": "Instantiates list with 4 integers.",
            "2": "Reads first element at index 0 (92).",
            "4": "Appends new element 100 to the end of the list."
        },
        "common_mistakes": [
            {"mistake": "Accessing list[len(list)] and getting IndexError", "fix": "Indices range from 0 to len - 1. The last index of a 4-item list is 3, not 4."}
        ],
        "quiz": {
            "question": "If items = ['apple', 'banana', 'cherry'], what is items[1]?",
            "options": [
                "banana",
                "apple",
                "cherry",
                "IndexError"
            ],
            "correct_index": 0,
            "explanation": "Because array indexing starts at 0, items[0] is 'apple' and items[1] is 'banana'."
        }
    },
    {
        "order_index": 17,
        "title": "Strings",
        "category": "Data Structures",
        "difficulty": "Beginner",
        "estimated_minutes": 15,
        "definition": "A string is an immutable sequence of characters used to represent text.",
        "analogy": "A bead necklace where each bead is a letter: C - O - D - E - V - E - R - S - E.",
        "visual_diagram": "String: 'CODE'\nIndex:  [0]='C', [1]='O', [2]='D', [3]='E'",
        "syntax_explanation": "Strings support slicing string[start:stop], concatenation with +, and formatting methods.",
        "example_codes": {
            "python": "text = 'Codeverse Lab'\nprint('Length:', len(text))\nprint('Uppercase:', text.upper())\nprint('Slice (first 4 chars):', text[:4])\nprint('Reversed:', text[::-1])",
            "javascript": "let text = 'Codeverse Lab';\nconsole.log('Length:', text.length);\nconsole.log('Upper:', text.toUpperCase());\nconsole.log('Slice:', text.slice(0, 4));"
        },
        "line_by_line": {
            "1": "Assigns string literal.",
            "3": "Invokes string method upper() returning uppercase copy.",
            "4": "Slices characters from index 0 to 4 (excluding 4) -> 'Code'."
        },
        "common_mistakes": [
            {"mistake": "Trying to modify a string character directly like s[0] = 'K'", "fix": "Strings are immutable in Python; create a new string instead: 'K' + s[1:]."}
        ],
        "quiz": {
            "question": "What does the operation 'Hello' + ' ' + 'World' do?",
            "options": [
                "Concatenates the strings into 'Hello World'",
                "Calculates the word count of the sentence",
                "Throws a mathematical operator error",
                "Translates text into binary"
            ],
            "correct_index": 0,
            "explanation": "The + operator on strings performs concatenation, gluing text fragments together in sequence."
        }
    },
    {
        "order_index": 18,
        "title": "Pointers & References",
        "category": "Memory Architecture",
        "difficulty": "Intermediate",
        "estimated_minutes": 18,
        "definition": "A pointer is a variable that stores the raw memory address of another variable rather than storing the actual direct data value.",
        "analogy": "A pointer is not a house; it is a scrap of paper with the house's street address written on it. Following the address brings you to the house.",
        "visual_diagram": "Variable a = 42 (At RAM address 0x1000)\nPointer ptr = 0x1000 ───points to───> [ 0x1000: 42 ]",
        "syntax_explanation": "In C: int *ptr = &a; where & gets the address, and * dereferences (reads or writes) the value at that address.",
        "example_codes": {
            "c": "#include <stdio.h>\n\nint main() {\n    int score = 100;\n    int *ptr = &score; // ptr holds memory address of score\n    printf(\"Score: %d\\n\", score);\n    printf(\"Address of score: %p\\n\", (void*)ptr);\n    *ptr = 150; // Modify score via pointer dereference\n    printf(\"Modified Score: %d\\n\", score);\n    return 0;\n}",
            "python": "# In Python, variables are object references:\na = [1, 2, 3]\nb = a  # b references the same underlying list object\nb.append(4)\nprint('Original a:', a) # [1, 2, 3, 4]"
        },
        "line_by_line": {
            "5": "Stores address of score into pointer ptr.",
            "8": "Dereferences ptr and changes value in that memory address to 150."
        },
        "common_mistakes": [
            {"mistake": "Dereferencing a NULL or uninitialized pointer (causes Segmentation Fault)", "fix": "Always initialize pointers to NULL or a valid memory address before dereferencing."}
        ],
        "quiz": {
            "question": "In C programming, what does the dereference operator '*' do when used on a pointer variable like *ptr = 5?",
            "options": [
                "It accesses or modifies the value at the memory address the pointer points to",
                "It multiplies the pointer by 5",
                "It prints the pointer's memory location",
                "It frees memory from the heap"
            ],
            "correct_index": 0,
            "explanation": "Dereferencing (*ptr) follows the pointer address to the target memory cell to read or overwrite the stored value."
        }
    },
    {
        "order_index": 19,
        "title": "Memory Management",
        "category": "Memory Architecture",
        "difficulty": "Intermediate",
        "estimated_minutes": 18,
        "definition": "Memory management is how a programming language allocates RAM for variables, manages the Stack and the Heap, and deallocates memory when no longer needed.",
        "analogy": "Stack is like a stack of cafeteria plates (fast, automatic, fixed size). Heap is a giant warehouse floor (huge, flexible, but you must keep track of what you put there).",
        "visual_diagram": "[ Stack Memory ] (Fast, auto-freed on function return, local variables)\n[ Heap Memory  ] (Dynamic allocation, malloc/free, garbage-collected)",
        "syntax_explanation": "C uses malloc() and free(). Python and JavaScript use an automated Garbage Collector (GC) that tracks references and frees unreferenced memory.",
        "example_codes": {
            "c": "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = (int*)malloc(3 * sizeof(int));\n    if (arr == NULL) return 1;\n    arr[0] = 10; arr[1] = 20; arr[2] = 30;\n    printf(\"Middle element: %d\\n\", arr[1]);\n    free(arr); // Clean up heap memory\n    return 0;\n}",
            "python": "# Python manages heap and garbage collection automatically\nimport gc\nprint('Garbage collector enabled:', gc.isenabled())"
        },
        "line_by_line": {
            "5": "Allocates block of memory on Heap for 3 integers.",
            "9": "Frees the allocated heap memory to prevent memory leaks."
        },
        "common_mistakes": [
            {"mistake": "Memory leak: allocating memory on the heap and never freeing it", "fix": "In manual memory languages, always pair every malloc() with a free()."}
        ],
        "quiz": {
            "question": "What is a memory leak?",
            "options": [
                "Allocated memory that is no longer needed but never released, gradually consuming all available RAM",
                "Physical water leaking onto the motherboard",
                "A computer virus reading encrypted passwords",
                "A fast CPU caching instruction"
            ],
            "correct_index": 0,
            "explanation": "A memory leak happens when dynamically allocated heap memory is never returned to the operating system, degrading performance over time."
        }
    },
    {
        "order_index": 20,
        "title": "Structures & Classes",
        "category": "Data Modeling",
        "difficulty": "Intermediate",
        "estimated_minutes": 18,
        "definition": "Structures (structs) and Classes allow developers to bundle multiple related variables and functions into a single cohesive custom data type.",
        "analogy": "A student profile card: instead of managing loose variables for name, age, gpa, and email, you create a Student blueprint that holds all four together.",
        "visual_diagram": "Blueprint (Class Student) ──> Instance 1: { name: 'Alice', gpa: 3.9 }\n                            └──> Instance 2: { name: 'Bob', gpa: 3.4 }",
        "syntax_explanation": "In Python: class Student:. In C: struct Student { char name[50]; float gpa; };",
        "example_codes": {
            "python": "class Student:\n    def __init__(self, name, gpa):\n        self.name = name\n        self.gpa = gpa\n\n    def is_honor_roll(self):\n        return self.gpa >= 3.8\n\nalice = Student('Alice', 3.92)\nprint(alice.name, 'Honor roll?', alice.is_honor_roll())",
            "c": "#include <stdio.h>\n\nstruct Student {\n    char name[20];\n    float gpa;\n};\n\nint main() {\n    struct Student s1 = {\"Sinan\", 3.95};\n    printf(\"%s has GPA: %.2f\\n\", s1.name, s1.gpa);\n    return 0;\n}"
        },
        "line_by_line": {
            "1": "Defines custom class Student.",
            "2": "Constructor __init__ initializes object properties.",
            "9": "Creates student instance alice."
        },
        "common_mistakes": [
            {"mistake": "Confusing the class (the blueprint) with the instance (the created object)", "fix": "The class is the cookie cutter; the object is the actual cookie."}
        ],
        "quiz": {
            "question": "What is an instance of a class?",
            "options": [
                "A specific, concrete object created in memory based on the class blueprint",
                "A syntax error in object-oriented code",
                "The text file containing the class code",
                "The compiler process"
            ],
            "correct_index": 0,
            "explanation": "An instance is an individual realization of the class blueprint holding its own unique state in computer memory."
        }
    },
    {
        "order_index": 21,
        "title": "Recursion",
        "category": "Algorithms",
        "difficulty": "Intermediate",
        "estimated_minutes": 20,
        "definition": "Recursion is a programming technique where a function calls itself directly or indirectly to solve a smaller subproblem of the original problem.",
        "analogy": "Russian nesting dolls (Matryoshka): You open a big doll, find an identical smaller doll inside, until you hit the tiny solid wooden doll in the center (Base Case).",
        "visual_diagram": "factorial(3)\n └── 3 * factorial(2)\n          └── 2 * factorial(1)\n                   └── 1 (Base Case reached, unwinding values)",
        "syntax_explanation": "Every recursive function must have two components: 1) A Base Case that stops recursion, and 2) A Recursive Step that moves closer to the base case.",
        "example_codes": {
            "python": "def factorial(n):\n    # 1. Base case\n    if n <= 1:\n        return 1\n    # 2. Recursive step\n    return n * factorial(n - 1)\n\nprint('Factorial of 5 is:', factorial(5))",
            "javascript": "function factorial(n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\nconsole.log('Factorial of 5:', factorial(5));"
        },
        "line_by_line": {
            "3": "Checks base case: if n is 1 or less, returns 1 without calling itself.",
            "6": "Multiplies n by recursive call factorial(n - 1)."
        },
        "common_mistakes": [
            {"mistake": "Forgetting the base case, causing maximum recursion depth / stack overflow", "fix": "Always write and test your base case condition first."}
        ],
        "quiz": {
            "question": "What happens if a recursive function does not have a working base case?",
            "options": [
                "It calls itself until call stack memory is exhausted, throwing a Stack Overflow error",
                "It immediately converts into a while loop",
                "The function returns 0",
                "The code refuses to compile"
            ],
            "correct_index": 0,
            "explanation": "Without a base case, recursion never halts, filling the call stack until memory is exhausted and a stack overflow occurs."
        }
    },
    {
        "order_index": 22,
        "title": "File Handling",
        "category": "I/O Systems",
        "difficulty": "Intermediate",
        "estimated_minutes": 15,
        "definition": "File handling allows a program to store data permanently on storage drives by creating, reading, updating, and closing files on the filesystem.",
        "analogy": "Writing variables in RAM is like scribbling on a dry-erase whiteboard (lost when power turns off). Writing to a file is like carving text into a stone tablet.",
        "visual_diagram": "Program in RAM ──[Write stream]──> Permanent Storage Disk (.txt / .csv / .json)\nProgram in RAM <──[Read stream]─── Permanent Storage Disk",
        "syntax_explanation": "Always close files after opening them, or use context managers like with open('file.txt', 'w') as f:.",
        "example_codes": {
            "python": "# Write and read a file safely\nwith open('notes.txt', 'w') as f:\n    f.write('Codeverse Lab is awesome!\\n')\n\nwith open('notes.txt', 'r') as f:\n    content = f.read()\n    print('Read from disk:', content.strip())",
            "javascript": "// Node.js fs module\nconst fs = require('fs');\nfs.writeFileSync('notes.txt', 'Codeverse Lab!');\nconsole.log('Read:', fs.readFileSync('notes.txt', 'utf8'));"
        },
        "line_by_line": {
            "2": "Opens file in write mode ('w') using with context manager.",
            "3": "Writes string buffer to disk and automatically closes file."
        },
        "common_mistakes": [
            {"mistake": "Opening a file in write mode ('w') when you wanted to append ('a')", "fix": "Mode 'w' truncates (erases) existing file contents. Use 'a' to preserve and append."}
        ],
        "quiz": {
            "question": "Why is the 'with' statement recommended in Python for opening files?",
            "options": [
                "It automatically closes the file even if exceptions occur, preventing resource leaks",
                "It encrypts the file with a password",
                "It speeds up reading by 500%",
                "It is required by the operating system"
            ],
            "correct_index": 0,
            "explanation": "Context managers ('with open(...)') ensure that file descriptors are cleanly released and flushed even if runtime errors occur."
        }
    },
    {
        "order_index": 23,
        "title": "Error Handling",
        "category": "Robust Software",
        "difficulty": "Intermediate",
        "estimated_minutes": 15,
        "definition": "Error handling is the practice of anticipating and responding to exceptional runtime conditions so that programs handle errors gracefully instead of crashing.",
        "analogy": "A safety net under an acrobat: if the acrobat slips, the safety net catches them safely so the circus show doesn't end in disaster.",
        "visual_diagram": "try { Risky operation (e.g. division, file open) }\n └── except / catch { Handle error calmly & notify user }",
        "syntax_explanation": "Structured exception handling uses try, except (or catch), and optional finally blocks.",
        "example_codes": {
            "python": "def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        print('Error: Cannot divide by zero!')\n        return 0\n\nprint('Result 10/2 =', safe_divide(10, 2))\nprint('Result 10/0 =', safe_divide(10, 0))",
            "javascript": "function safeDivide(a, b) {\n    try {\n        if (b === 0) throw new Error('Divide by zero');\n        return a / b;\n    } catch (e) {\n        console.error('Caught:', e.message);\n        return 0;\n    }\n}"
        },
        "line_by_line": {
            "2": "Enters guarded try block.",
            "4": "Catches specific ZeroDivisionError without terminating the program."
        },
        "common_mistakes": [
            {"mistake": "Using a bare 'except:' that catches everything including system exits", "fix": "Catch specific exception types like except ValueError: or except KeyError:."}
        ],
        "quiz": {
            "question": "What is the purpose of the 'finally' block in exception handling?",
            "options": [
                "It executes cleanup code regardless of whether an exception occurred or not",
                "It only runs if an error occurred",
                "It stops all CPU execution permanently",
                "It deletes temporary files"
            ],
            "correct_index": 0,
            "explanation": "Code inside a finally block is guaranteed to execute whether an exception was raised, caught, or not raised at all."
        }
    },
    {
        "order_index": 24,
        "title": "Object-Oriented Programming (OOP)",
        "category": "Software Architecture",
        "difficulty": "Intermediate",
        "estimated_minutes": 20,
        "definition": "OOP is a programming paradigm based on the concept of 'objects' which contain data (attributes) and code (methods), built on four pillars: Encapsulation, Abstraction, Inheritance, and Polymorphism.",
        "analogy": "Think of vehicles: A general 'Vehicle' class has an engine and wheels. A 'Car' inherits from Vehicle and adds air conditioning; an 'Airplane' inherits from Vehicle and adds wings.",
        "visual_diagram": "Parent Class: BankAccount (balance, deposit, withdraw)\n    ├── Child Class: SavingsAccount (adds interest_rate)\n    └── Child Class: CheckingAccount (adds overdraft_limit)",
        "syntax_explanation": "Inheritance syntax: class SavingsAccount(BankAccount):. Methods use super() to invoke parent constructor.",
        "example_codes": {
            "python": "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self._balance = balance # Encapsulated\n\n    def deposit(self, amount):\n        self._balance += amount\n        return self._balance\n\n    def get_balance(self):\n        return self._balance\n\naccount = BankAccount('Sinan', 500)\naccount.deposit(250)\nprint(account.owner, 'Balance: $', account.get_balance())"
        },
        "line_by_line": {
            "1": "Declares base class BankAccount.",
            "4": "Encapsulates balance attribute.",
            "6": "Provides public method deposit to safely alter state."
        },
        "common_mistakes": [
            {"mistake": "Overusing deep inheritance hierarchies when composition would be cleaner", "fix": "Favor composition ('has-a') over inheritance ('is-a') for flexible architectures."}
        ],
        "quiz": {
            "question": "Which OOP pillar refers to bundling data and the methods that operate on that data while restricting direct access to internal details?",
            "options": [
                "Encapsulation",
                "Inheritance",
                "Polymorphism",
                "Compilation"
            ],
            "correct_index": 0,
            "explanation": "Encapsulation hides internal object state from unauthorized outside modification, exposing only clean public methods."
        }
    },
    {
        "order_index": 25,
        "title": "Modular Programming & Packages",
        "category": "Software Architecture",
        "difficulty": "Intermediate",
        "estimated_minutes": 20,
        "definition": "Modular programming divides an entire software application into separate, independent subprograms or modules that can be developed, tested, and imported independently.",
        "analogy": "Lego bricks: Instead of carving a whole spaceship out of a single giant block of plastic, you assemble standardized, interchangeable bricks.",
        "visual_diagram": "Project Root\n ├── auth_module.py\n ├── runner_module.py\n ├── database_module.py\n └── main.py (imports and connects modules)",
        "syntax_explanation": "Use import module_name or from module_name import specific_function to organize clean namespaces.",
        "example_codes": {
            "python": "import math\nfrom datetime import datetime\n\nprint('Current year:', datetime.now().year)\nprint('Square root of 144:', math.sqrt(144))\nprint('Sine of pi/2:', math.sin(math.pi / 2))"
        },
        "line_by_line": {
            "1": "Imports math standard library module.",
            "2": "Imports datetime class from datetime package.",
            "5": "Calls modular library function math.sqrt()."
        },
        "common_mistakes": [
            {"mistake": "Circular imports (module A imports B while B imports A)", "fix": "Structure dependencies cleanly in a hierarchical or dependency-inversion flow."}
        ],
        "quiz": {
            "question": "What is the primary benefit of dividing software into distinct modules?",
            "options": [
                "Maintainability, separation of concerns, and ease of collaborative team engineering",
                "It makes source code files 10 times larger",
                "It bypasses operating system security permissions",
                "It eliminates the need for testing"
            ],
            "correct_index": 0,
            "explanation": "Modular design allows engineers to maintain, test, and refactor separate components independently without risking collateral damage to unrelated code."
        }
    }
]

PRACTICE_PROBLEMS_DATA = [
    {
        "title": "Sum of Two Numbers",
        "category": "Fundamentals",
        "difficulty": "Easy",
        "description": "Given two space-separated integers a and b from standard input, calculate and print their sum.",
        "input_format": "A single line containing two integers a and b separated by a space.",
        "output_format": "Print the sum of a and b.",
        "constraints": "-10^6 <= a, b <= 10^6",
        "sample_input": "5 7",
        "sample_output": "12",
        "sample_explanation": "5 + 7 = 12",
        "time_limit_sec": 2.0,
        "starter_codes": {
            "python": "import sys\n\ndef solve():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    a = int(data[0])\n    b = int(data[1])\n    print(a + b)\n\nif __name__ == '__main__':\n    solve()",
            "javascript": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (input.length >= 2) {\n    const a = parseInt(input[0], 10);\n    const b = parseInt(input[1], 10);\n    console.log(a + b);\n}"
        },
        "test_cases": [
            {"input_data": "5 7", "expected_output": "12", "is_hidden": False, "explanation": "Sample test 1"},
            {"input_data": "100 250", "expected_output": "350", "is_hidden": False, "explanation": "Sample test 2"},
            {"input_data": "-10 15", "expected_output": "5", "is_hidden": True, "explanation": "Negative numbers"},
            {"input_data": "0 0", "expected_output": "0", "is_hidden": True, "explanation": "Zeros test"}
        ]
    },
    {
        "title": "Find the Maximum Element",
        "category": "Arrays",
        "difficulty": "Easy",
        "description": "Given a list of N space-separated integers, find and print the maximum value.",
        "input_format": "Line 1: An integer N representing number of elements.\nLine 2: N space-separated integers.",
        "output_format": "A single integer representing the maximum value.",
        "constraints": "1 <= N <= 10^5, -10^9 <= array[i] <= 10^9",
        "sample_input": "5\n3 9 1 7 4",
        "sample_output": "9",
        "sample_explanation": "Among [3, 9, 1, 7, 4], 9 is the greatest element.",
        "time_limit_sec": 2.0,
        "starter_codes": {
            "python": "import sys\n\ndef solve():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    print(max(nums))\n\nif __name__ == '__main__':\n    solve()",
            "javascript": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nconst n = parseInt(input[0]);\nlet maxVal = -Infinity;\nfor (let i = 1; i <= n; i++) {\n    const num = parseInt(input[i]);\n    if (num > maxVal) maxVal = num;\n}\nconsole.log(maxVal);"
        },
        "test_cases": [
            {"input_data": "5\n3 9 1 7 4", "expected_output": "9", "is_hidden": False, "explanation": "Standard case"},
            {"input_data": "4\n-10 -5 -2 -8", "expected_output": "-2", "is_hidden": True, "explanation": "All negative elements"},
            {"input_data": "1\n42", "expected_output": "42", "is_hidden": True, "explanation": "Single element array"}
        ]
    },
    {
        "title": "Reverse a String",
        "category": "Strings",
        "difficulty": "Easy",
        "description": "Read a string from standard input and print the string reversed.",
        "input_format": "A single line containing a string.",
        "output_format": "Print the reversed string.",
        "constraints": "Length of string <= 1000",
        "sample_input": "codelab",
        "sample_output": "baledoc",
        "sample_explanation": "Reversing 'codelab' produces 'baledoc'.",
        "time_limit_sec": 2.0,
        "starter_codes": {
            "python": "import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    print(s[::-1])\n\nif __name__ == '__main__':\n    solve()",
            "javascript": "const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nconsole.log(s.split('').reverse().join(''));"
        },
        "test_cases": [
            {"input_data": "codelab", "expected_output": "baledoc", "is_hidden": False, "explanation": "Sample word"},
            {"input_data": "racecar", "expected_output": "racecar", "is_hidden": True, "explanation": "Palindrome word"},
            {"input_data": "hello world", "expected_output": "dlrow olleh", "is_hidden": True, "explanation": "Phrase with spaces"}
        ]
    },
    {
        "title": "Fibonacci Number",
        "category": "Recursion & DP",
        "difficulty": "Medium",
        "description": "Calculate the N-th Fibonacci number where F(0) = 0, F(1) = 1, and F(N) = F(N-1) + F(N-2).",
        "input_format": "A single integer N.",
        "output_format": "Print F(N).",
        "constraints": "0 <= N <= 35",
        "sample_input": "7",
        "sample_output": "13",
        "sample_explanation": "Sequence: 0, 1, 1, 2, 3, 5, 8, 13",
        "time_limit_sec": 2.0,
        "starter_codes": {
            "python": "import sys\n\ndef fib(n):\n    if n <= 0:\n        return 0\n    if n == 1:\n        return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nif __name__ == '__main__':\n    data = sys.stdin.read().strip()\n    if data:\n        print(fib(int(data)))"
        },
        "test_cases": [
            {"input_data": "7", "expected_output": "13", "is_hidden": False, "explanation": "Sample 7"},
            {"input_data": "0", "expected_output": "0", "is_hidden": True, "explanation": "Zero base case"},
            {"input_data": "10", "expected_output": "55", "is_hidden": True, "explanation": "10th fibonacci"}
        ]
    },
    {
        "title": "Two Sum Target Indices",
        "category": "Arrays",
        "difficulty": "Easy",
        "description": "Given an array of integers and an integer target, return the 0-based indices of the two numbers such that they add up to target.",
        "input_format": "Line 1: Target integer T.\nLine 2: Array elements separated by spaces.",
        "output_format": "Print the two indices separated by space in ascending order.",
        "constraints": "2 <= nums.length <= 10^4",
        "sample_input": "9\n2 7 11 15",
        "sample_output": "0 1",
        "sample_explanation": "nums[0] + nums[1] = 2 + 7 = 9.",
        "time_limit_sec": 2.0,
        "starter_codes": {
            "python": "import sys\n\ndef solve():\n    lines = sys.stdin.read().strip().split('\\n')\n    if len(lines) < 2: return\n    target = int(lines[0].strip())\n    nums = [int(x) for x in lines[1].split()]\n    lookup = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in lookup:\n            print(f\"{lookup[diff]} {i}\")\n            return\n        lookup[num] = i\n\nif __name__ == '__main__':\n    solve()",
            "javascript": "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nif (lines.length >= 2) {\n    const target = parseInt(lines[0].trim(), 10);\n    const nums = lines[1].trim().split(/\\s+/).map(Number);\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) {\n            console.log(`${map.get(diff)} ${i}`);\n            break;\n        }\n        map.set(nums[i], i);\n    }\n}"
        },
        "test_cases": [
            {"input_data": "9\n2 7 11 15", "expected_output": "0 1", "is_hidden": False, "explanation": "2 + 7 = 9"},
            {"input_data": "6\n3 2 4", "expected_output": "1 2", "is_hidden": False, "explanation": "2 + 4 = 6"},
            {"input_data": "10\n1 5 3 7 9", "expected_output": "2 3", "is_hidden": True, "explanation": "3 + 7 = 10"}
        ]
    },
    {
        "title": "Valid Parentheses",
        "category": "Stacks & Queues",
        "difficulty": "Easy",
        "description": "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type and in correct order.",
        "input_format": "A single line containing brackets string.",
        "output_format": "Print 'true' or 'false'.",
        "constraints": "1 <= s.length <= 10^4",
        "sample_input": "()[]{}",
        "sample_output": "true",
        "sample_explanation": "All bracket pairs are properly closed.",
        "time_limit_sec": 2.0,
        "starter_codes": {
            "python": "import sys\n\ndef is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: return False\n        else:\n            stack.append(char)\n    return len(stack) == 0\n\nif __name__ == '__main__':\n    s = sys.stdin.read().strip()\n    print('true' if is_valid(s) else 'false')",
            "javascript": "const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nconst stack = [];\nconst map = { ')': '(', '}': '{', ']': '[' };\nlet valid = true;\nfor (const ch of s) {\n    if (map[ch]) {\n        if (stack.pop() !== map[ch]) { valid = false; break; }\n    } else { stack.push(ch); }\n}\nconsole.log(valid && stack.length === 0 ? 'true' : 'false');"
        },
        "test_cases": [
            {"input_data": "()[]{}", "expected_output": "true", "is_hidden": False, "explanation": "Balanced pairs"},
            {"input_data": "(]", "expected_output": "false", "is_hidden": False, "explanation": "Mismatched closing"},
            {"input_data": "{[()]}", "expected_output": "true", "is_hidden": True, "explanation": "Nested brackets"},
            {"input_data": "((", "expected_output": "false", "is_hidden": True, "explanation": "Unclosed brackets"}
        ]
    },
    {
        "title": "Maximum Subarray Sum (Kadane)",
        "category": "Dynamic Programming",
        "difficulty": "Medium",
        "description": "Given an integer array, find the contiguous subarray (containing at least one number) which has the largest sum and print its sum.",
        "input_format": "A single line of space-separated integers.",
        "output_format": "Print the maximum contiguous subarray sum.",
        "constraints": "1 <= nums.length <= 10^5",
        "sample_input": "-2 1 -3 4 -1 2 1 -5 4",
        "sample_output": "6",
        "sample_explanation": "Subarray [4, -1, 2, 1] has the largest sum = 6.",
        "time_limit_sec": 2.0,
        "starter_codes": {
            "python": "import sys\n\ndef max_sub_array(nums):\n    max_sum = nums[0]\n    cur_sum = nums[0]\n    for x in nums[1:]:\n        cur_sum = max(x, cur_sum + x)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum\n\nif __name__ == '__main__':\n    data = sys.stdin.read().split()\n    if data:\n        nums = [int(x) for x in data]\n        print(max_sub_array(nums))"
        },
        "test_cases": [
            {"input_data": "-2 1 -3 4 -1 2 1 -5 4", "expected_output": "6", "is_hidden": False, "explanation": "Standard case"},
            {"input_data": "1", "expected_output": "1", "is_hidden": False, "explanation": "Single item"},
            {"input_data": "5 4 -1 7 8", "expected_output": "23", "is_hidden": True, "explanation": "Positive dominant"},
            {"input_data": "-5 -2 -8", "expected_output": "-2", "is_hidden": True, "explanation": "All negative"}
        ]
    },
    {
        "title": "Climbing Stairs",
        "category": "Dynamic Programming",
        "difficulty": "Easy",
        "description": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        "input_format": "A single integer n.",
        "output_format": "Print the number of distinct ways.",
        "constraints": "1 <= n <= 45",
        "sample_input": "3",
        "sample_output": "3",
        "sample_explanation": "Ways: (1+1+1), (1+2), (2+1).",
        "time_limit_sec": 2.0,
        "starter_codes": {
            "python": "import sys\n\ndef climb(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b\n\nif __name__ == '__main__':\n    d = sys.stdin.read().strip()\n    if d: print(climb(int(d)))"
        },
        "test_cases": [
            {"input_data": "3", "expected_output": "3", "is_hidden": False, "explanation": "3 stairs"},
            {"input_data": "2", "expected_output": "2", "is_hidden": False, "explanation": "2 stairs"},
            {"input_data": "5", "expected_output": "8", "is_hidden": True, "explanation": "5 stairs"}
        ]
    },
    {
        "title": "Power of Two",
        "category": "Mathematics",
        "difficulty": "Easy",
        "description": "Given an integer n, print 'true' if it is a power of two, otherwise print 'false'.",
        "input_format": "A single integer n.",
        "output_format": "Print 'true' or 'false'.",
        "constraints": "-2^31 <= n <= 2^31 - 1",
        "sample_input": "16",
        "sample_output": "true",
        "sample_explanation": "2^4 = 16.",
        "time_limit_sec": 2.0,
        "starter_codes": {
            "python": "import sys\n\ndef is_power_of_two(n):\n    return n > 0 and (n & (n - 1)) == 0\n\nif __name__ == '__main__':\n    d = sys.stdin.read().strip()\n    if d:\n        print('true' if is_power_of_two(int(d)) else 'false')"
        },
        "test_cases": [
            {"input_data": "16", "expected_output": "true", "is_hidden": False, "explanation": "16 is 2^4"},
            {"input_data": "3", "expected_output": "false", "is_hidden": False, "explanation": "3 is not power of 2"},
            {"input_data": "1", "expected_output": "true", "is_hidden": True, "explanation": "2^0 = 1"},
            {"input_data": "0", "expected_output": "false", "is_hidden": True, "explanation": "0 is not"}
        ]
    }
]


def seed_database(db: Session):
    # Check if lessons exist
    existing_lessons = db.scalar(select(Lesson.id).limit(1))
    if not existing_lessons:
        for item in LESSONS_DATA:
            lesson = Lesson(
                order_index=item["order_index"],
                title=item["title"],
                category=item["category"],
                difficulty=item["difficulty"],
                estimated_minutes=item["estimated_minutes"],
                definition=item["definition"],
                analogy=item["analogy"],
                visual_diagram=item["visual_diagram"],
                syntax_explanation=item["syntax_explanation"],
                example_codes=item["example_codes"],
                line_by_line=item["line_by_line"],
                common_mistakes=item["common_mistakes"],
                quiz=item["quiz"]
            )
            db.add(lesson)
        db.commit()

    # Seed practice problems if missing
    for p in PRACTICE_PROBLEMS_DATA:
        existing = db.scalar(select(PracticeProblem.id).where(PracticeProblem.title == p["title"]))
        if not existing:
            prob = PracticeProblem(
                title=p["title"],
                category=p["category"],
                difficulty=p["difficulty"],
                description=p["description"],
                input_format=p["input_format"],
                output_format=p["output_format"],
                constraints=p["constraints"],
                sample_input=p["sample_input"],
                sample_output=p["sample_output"],
                sample_explanation=p["sample_explanation"],
                time_limit_sec=p["time_limit_sec"],
                starter_codes=p["starter_codes"]
            )
            db.add(prob)
            db.flush()

            for tc in p["test_cases"]:
                case = TestCase(
                    problem_id=prob.id,
                    input_data=tc["input_data"],
                    expected_output=tc["expected_output"],
                    is_hidden=tc["is_hidden"],
                    explanation=tc["explanation"]
                )
                db.add(case)
    db.commit()

