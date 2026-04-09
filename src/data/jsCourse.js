const jsCourse = {
  id: 'js',
  title: 'JavaScript from Scratch',
  icon: '⚡',
  desc: 'Build a solid foundation in JavaScript — the language of the web. No experience needed.',
  modules: [

    // ──────────────────────────────────────────────────────────────────────────
    // MODULE 1: Variables & Data Types
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: 'mod1',
      title: 'Variables & Data Types',
      icon: '📦',
      lessons: [
        {
          id: 'js-1-1',
          title: 'Your First Variable',
          xp: 20,
          steps: [
            {
              type: 'info',
              heading: 'What is a Variable?',
              content: 'A variable is like a labeled box that stores a value. You can put something in the box, look inside it, or replace what\'s in it.\n\nIn JavaScript, you create (declare) a variable using `let` or `const`.',
              code: null,
              tip: null,
            },
            {
              type: 'info',
              heading: 'Declaring Variables with `let`',
              content: 'Use the `let` keyword, then a name, then `=`, then the value. The value can be a number, text, or more.',
              code: 'let age = 25;\nlet name = "Alice";\nlet isStudent = true;\n\nconsole.log(age);      // 25\nconsole.log(name);     // "Alice"\nconsole.log(isStudent); // true',
              tip: '💡 Variable names can use letters, digits, $ and _. They cannot start with a digit.',
            },
            {
              type: 'quiz',
              question: 'Which line correctly declares a variable named `score` with the value 100?',
              code: null,
              options: [
                'variable score = 100;',
                'let score = 100;',
                'let 100 = score;',
                'score := 100;',
              ],
              correct: 1,
              explanation: 'The syntax is: let [name] = [value]. The name comes first, the value goes after the = sign. JavaScript uses = for assignment, not :=.',
            },
            {
              type: 'info',
              heading: '`const` — for Values That Never Change',
              content: 'Use `const` when a value should never be reassigned. Trying to change a const throws an error.\n\nConvention: constants are often written in UPPER_CASE, but this is just style.',
              code: 'const PI = 3.14159;\nconst MAX_USERS = 100;\n\nPI = 3; // ❌ TypeError: Assignment to constant variable\n\n// Use const for things that should stay fixed\nconst APP_NAME = "Code Quest";',
              tip: null,
            },
            {
              type: 'quiz',
              question: 'When should you prefer `const` over `let`?',
              code: null,
              options: [
                'Always — const is faster',
                'Only when the value is a string',
                'When the value should never be reassigned',
                'Only for numbers',
              ],
              correct: 2,
              explanation: 'Use const when a value should not change (like config, IDs, math constants). Use let when you need to reassign the variable later. Prefer const by default — it makes code more predictable.',
            },
          ],
        },

        {
          id: 'js-1-2',
          title: 'Types of Data',
          xp: 25,
          steps: [
            {
              type: 'info',
              heading: 'JavaScript\'s Three Core Types',
              content: 'Every value in JavaScript has a type. The three most common are:\n\n• `string` — text, wrapped in quotes\n• `number` — any numeric value (integer or decimal)\n• `boolean` — either `true` or `false`',
              code: 'let name = "Alice";      // string\nlet age  = 25;           // number\nlet score = 98.5;        // number (decimals too)\nlet isOnline = true;     // boolean',
              tip: null,
            },
            {
              type: 'quiz',
              question: 'What does `typeof 42` return?',
              code: 'console.log(typeof 42);',
              options: ['"string"', '"number"', '"integer"', '"boolean"'],
              correct: 1,
              explanation: '42 is a number. JavaScript\'s typeof operator returns the type name as a string. All numeric values — integers and decimals — share the single "number" type.',
            },
            {
              type: 'info',
              heading: 'Strings in More Depth',
              content: 'Strings are sequences of characters. You can use single quotes, double quotes, or backticks (more on backticks soon).',
              code: 'let a = \'Hello\';\nlet b = "World";\n\n// Useful string properties and methods\nconsole.log("hello".length);          // 5\nconsole.log("hello"[0]);              // "h"\nconsole.log("hello".toUpperCase());   // "HELLO"\nconsole.log("  trim me  ".trim());    // "trim me"',
              tip: '💡 Strings are zero-indexed: the first character is at position 0.',
            },
            {
              type: 'quiz',
              question: 'What does `typeof true` return?',
              code: 'console.log(typeof true);',
              options: ['"true"', '"string"', '"boolean"', '"number"'],
              correct: 2,
              explanation: 'true and false are boolean values. typeof true returns the string "boolean". Booleans are essential for conditions and comparisons.',
            },
            {
              type: 'quiz',
              question: 'What does this output?',
              code: 'console.log("JavaScript".length);',
              options: ['9', '10', '11', 'undefined'],
              correct: 1,
              explanation: '"JavaScript" has 10 characters: J-a-v-a-S-c-r-i-p-t. The .length property counts every character including capitals.',
            },
          ],
        },

        {
          id: 'js-1-3',
          title: 'Template Literals',
          xp: 20,
          steps: [
            {
              type: 'info',
              heading: 'Combining Strings the Old Way',
              content: 'You can join strings with `+`, but it quickly becomes hard to read:',
              code: 'let name = "Alice";\nlet age  = 25;\n\n// Messy and error-prone\nlet msg = "My name is " + name + " and I am " + age + " years old.";\nconsole.log(msg);',
              tip: null,
            },
            {
              type: 'info',
              heading: 'Template Literals — The Clean Way',
              content: 'Template literals use backticks (`) and `${expression}` to embed values directly. You can put any expression inside `${}`.',
              code: 'let name = "Alice";\nlet age  = 25;\n\n// Clean and readable!\nlet msg = `My name is ${name} and I am ${age} years old.`;\nconsole.log(msg);\n// Output: "My name is Alice and I am 25 years old."\n\n// Expressions work too\nconsole.log(`2 + 2 = ${2 + 2}`); // "2 + 2 = 4"',
              tip: '💡 The backtick key (`) is usually top-left on your keyboard, next to the 1 key.',
            },
            {
              type: 'quiz',
              question: 'What does this output?',
              code: 'let city = "Tokyo";\nconsole.log(`I live in ${city}!`);',
              options: [
                '"I live in ${city}!"',
                '"I live in Tokyo!"',
                '"I live in city!"',
                'Error',
              ],
              correct: 1,
              explanation: 'Template literals replace ${variable} with the variable\'s current value. The result is the string "I live in Tokyo!".',
            },
            {
              type: 'quiz',
              question: 'What does this produce?',
              code: 'let x = 5;\nlet y = 3;\nconsole.log(`${x} + ${y} = ${x + y}`);',
              options: [
                '"x + y = x + y"',
                '"5 + 3 = x + y"',
                '"5 + 3 = 8"',
                'Error',
              ],
              correct: 2,
              explanation: 'Inside ${}, any JavaScript expression is valid. ${x + y} evaluates 5 + 3 = 8 and inserts the result. The output is "5 + 3 = 8".',
            },
          ],
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // MODULE 2: Operators
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: 'mod2',
      title: 'Operators',
      icon: '🔢',
      lessons: [
        {
          id: 'js-2-1',
          title: 'Arithmetic Operators',
          xp: 20,
          steps: [
            {
              type: 'info',
              heading: 'Math in JavaScript',
              content: 'JavaScript supports all standard arithmetic operations. The `%` (modulo) operator is especially useful — it gives the remainder after division.',
              code: 'console.log(5 + 3);   //  8  addition\nconsole.log(10 - 4);  //  6  subtraction\nconsole.log(6 * 7);   // 42  multiplication\nconsole.log(15 / 4);  // 3.75 division\nconsole.log(15 % 4);  //  3  remainder',
              tip: '💡 15 % 4 = 3 because 15 ÷ 4 = 3 remainder 3. Modulo is great for checking even/odd: n % 2 === 0 means even.',
            },
            {
              type: 'quiz',
              question: 'What does `17 % 5` evaluate to?',
              code: 'console.log(17 % 5);',
              options: ['2', '3', '3.4', '12'],
              correct: 0,
              explanation: '17 ÷ 5 = 3 with a remainder of 2. So 17 % 5 = 2. The result is always less than the divisor.',
            },
            {
              type: 'info',
              heading: 'Shorthand Assignment Operators',
              content: 'Instead of writing `x = x + 1`, use shorthand operators:',
              code: 'let x = 10;\n\nx += 5;  // x = x + 5  →  15\nx -= 3;  // x = x - 3  →  12\nx *= 2;  // x = x * 2  →  24\nx /= 4;  // x = x / 4  →   6\nx++;     // x = x + 1  →   7\nx--;     // x = x - 1  →   6',
              tip: null,
            },
            {
              type: 'quiz',
              question: 'What is the final value of `count`?',
              code: 'let count = 0;\ncount += 5;  // adds 5\ncount++;     // adds 1\ncount--;     // subtracts 1\nconsole.log(count);',
              options: ['4', '5', '6', '1'],
              correct: 1,
              explanation: '0 + 5 = 5, then ++ makes it 6, then -- makes it 5. Final value is 5.',
            },
          ],
        },

        {
          id: 'js-2-2',
          title: 'Comparisons & Logic',
          xp: 25,
          steps: [
            {
              type: 'info',
              heading: 'Comparison Operators',
              content: 'Comparisons always evaluate to `true` or `false`. Use `===` and `!==` (strict) in production — they check type as well as value.',
              code: 'console.log(5 > 3);    // true\nconsole.log(5 < 3);    // false\nconsole.log(5 >= 5);   // true\nconsole.log(4 <= 3);   // false\nconsole.log(5 === 5);  // true  (strict equal)\nconsole.log(5 !== 3);  // true  (strict not equal)\nconsole.log(5 == "5"); // true  (loose — avoid!)\nconsole.log(5 === "5");// false (strict — correct)',
              tip: null,
            },
            {
              type: 'quiz',
              question: 'What does `5 === "5"` return?',
              code: 'console.log(5 === "5");',
              options: ['true', 'false', 'TypeError', 'undefined'],
              correct: 1,
              explanation: '=== checks both value AND type. 5 is a number, "5" is a string — different types, so the result is false. Always prefer === over == to avoid unexpected coercion.',
            },
            {
              type: 'info',
              heading: 'Logical Operators: &&, ||, !',
              content: 'Combine conditions with logical operators:\n• `&&` (AND) — both must be true\n• `||` (OR) — at least one must be true\n• `!` (NOT) — flips the boolean',
              code: 'let age = 20;\nlet hasTicket = true;\n\nconsole.log(age >= 18 && hasTicket);  // true  (both true)\nconsole.log(age < 18 || hasTicket);   // true  (one true)\nconsole.log(!hasTicket);              // false (flipped)',
              tip: '💡 Think: && = "and", || = "or", ! = "not".',
            },
            {
              type: 'quiz',
              question: 'What does this evaluate to?',
              code: 'let isRaining = false;\nlet hasUmbrella = true;\n\nconsole.log(!isRaining || hasUmbrella);',
              options: ['false', 'true', 'undefined', 'Error'],
              correct: 1,
              explanation: '!isRaining = !false = true. With || (OR), if the LEFT side is true the whole expression is true — no need to even check the right side. Result: true.',
            },
            {
              type: 'quiz',
              question: 'What does this log?',
              code: 'let x = 10;\nconsole.log(x > 5 && x < 20);',
              options: ['false', 'true', '10', 'NaN'],
              correct: 1,
              explanation: 'x > 5 is true (10 > 5). x < 20 is true (10 < 20). Both sides of && are true, so the result is true.',
            },
          ],
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // MODULE 3: Control Flow
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: 'mod3',
      title: 'Control Flow',
      icon: '🔀',
      lessons: [
        {
          id: 'js-3-1',
          title: 'if / else',
          xp: 25,
          steps: [
            {
              type: 'info',
              heading: 'Making Decisions with `if`',
              content: 'The `if` statement runs a block of code only when a condition is `true`. If the condition is `false`, the block is skipped entirely.',
              code: 'let temperature = 30;\n\nif (temperature > 25) {\n  console.log("It\'s hot outside!");\n}\n\n// Output: "It\'s hot outside!" (because 30 > 25 is true)',
              tip: null,
            },
            {
              type: 'info',
              heading: '`else` and `else if`',
              content: 'Add `else` for when the condition is false. Chain multiple conditions with `else if`. Only the FIRST matching block runs.',
              code: 'let score = 82;\n\nif (score >= 90) {\n  console.log("Grade: A");\n} else if (score >= 80) {\n  console.log("Grade: B");  // ← this runs\n} else if (score >= 70) {\n  console.log("Grade: C");\n} else {\n  console.log("Grade: F");\n}\n// Output: "Grade: B"',
              tip: '💡 JavaScript checks conditions top to bottom and stops at the first true one.',
            },
            {
              type: 'quiz',
              question: 'What does this code log?',
              code: 'let score = 75;\n\nif (score >= 90) {\n  console.log("A");\n} else {\n  console.log("B");\n}',
              options: ['"A"', '"B"', '"A" and "B"', 'Nothing'],
              correct: 1,
              explanation: '75 >= 90 is false, so the if block is skipped and the else block runs, printing "B".',
            },
            {
              type: 'quiz',
              question: 'What is the output?',
              code: 'let n = 15;\n\nif (n > 20) {\n  console.log("big");\n} else if (n > 10) {\n  console.log("medium");\n} else {\n  console.log("small");\n}',
              options: ['"big"', '"medium"', '"small"', '"medium" and "small"'],
              correct: 1,
              explanation: 'n > 20 is false (15 > 20 is false). n > 10 is true (15 > 10), so "medium" is printed and the else is skipped.',
            },
            {
              type: 'quiz',
              question: 'What does this log?',
              code: 'let hour = 14;\n\nif (hour < 12) {\n  console.log("Good morning");\n} else if (hour < 18) {\n  console.log("Good afternoon");\n} else {\n  console.log("Good evening");\n}',
              options: ['"Good morning"', '"Good afternoon"', '"Good evening"', 'Nothing'],
              correct: 1,
              explanation: 'hour = 14. hour < 12 is false. hour < 18 is true (14 < 18), so "Good afternoon" is logged.',
            },
          ],
        },

        {
          id: 'js-3-2',
          title: 'for Loops',
          xp: 30,
          steps: [
            {
              type: 'info',
              heading: 'Repeating Code with a Loop',
              content: 'A `for` loop repeats a block of code a set number of times. It has three parts:\n1. `init` — runs once at the start\n2. `condition` — checked before each run\n3. `step` — runs after each iteration',
              code: '//  init       condition   step\nfor (let i = 0;  i < 5;    i++) {\n  console.log(i); // 0, 1, 2, 3, 4\n}\n\n// Without a loop (tedious!):\nconsole.log(0);\nconsole.log(1);\nconsole.log(2);  // ... etc',
              tip: '💡 `i` is just a convention. You can name it anything, but `i` (for "index") is standard.',
            },
            {
              type: 'quiz',
              question: 'How many times does this loop run?',
              code: 'for (let i = 0; i < 4; i++) {\n  console.log(i);\n}',
              options: ['3 times', '4 times', '5 times', 'Infinite'],
              correct: 1,
              explanation: 'i starts at 0 and runs while i < 4: iterations for i = 0, 1, 2, 3. That is 4 times total, printing 0, 1, 2, 3.',
            },
            {
              type: 'quiz',
              question: 'What is logged after this loop?',
              code: 'let total = 0;\nfor (let i = 1; i <= 5; i++) {\n  total += i;\n}\nconsole.log(total);',
              options: ['10', '15', '20', '5'],
              correct: 1,
              explanation: 'This sums 1+2+3+4+5 = 15. Each iteration adds i to total: 0→1→3→6→10→15.',
            },
            {
              type: 'quiz',
              question: 'What does this loop print?',
              code: 'for (let i = 10; i >= 8; i--) {\n  console.log(i);\n}',
              options: ['8, 9, 10', '10, 9, 8', '8, 9', '10, 9'],
              correct: 1,
              explanation: 'This loop counts DOWN. i starts at 10, runs while i >= 8, and decrements with i--. Prints: 10, then 9, then 8.',
            },
          ],
        },

        {
          id: 'js-3-3',
          title: 'while Loops',
          xp: 25,
          steps: [
            {
              type: 'info',
              heading: 'The `while` Loop',
              content: 'A `while` loop keeps running as long as its condition is `true`. Use it when you don\'t know in advance how many times to repeat.',
              code: 'let count = 1;\n\nwhile (count <= 5) {\n  console.log(count); // 1, 2, 3, 4, 5\n  count++;           // MUST update, or infinite loop!\n}',
              tip: '⚠️ Always ensure the condition will eventually become false, otherwise you get an infinite loop.',
            },
            {
              type: 'quiz',
              question: 'What does this loop output?',
              code: 'let n = 1;\nwhile (n <= 3) {\n  console.log(n * n);\n  n++;\n}',
              options: ['1, 2, 3', '1, 4, 9', '2, 4, 8', '1, 3, 9'],
              correct: 1,
              explanation: 'n=1: 1*1=1. n=2: 2*2=4. n=3: 3*3=9. n becomes 4, condition 4<=3 is false, loop ends. Output: 1, 4, 9.',
            },
            {
              type: 'quiz',
              question: 'Which best describes when to use `while` vs `for`?',
              code: null,
              options: [
                'for is faster; while is more readable',
                'for for numbers; while for strings',
                'for when you know the count; while when you don\'t',
                'They are completely interchangeable',
              ],
              correct: 2,
              explanation: 'Use for when you know iteration count upfront (e.g., "do this 10 times"). Use while when looping until a condition changes — like reading input or processing until done.',
            },
            {
              type: 'quiz',
              question: 'What is the output?',
              code: 'let x = 1;\nwhile (x < 20) {\n  x *= 3;\n}\nconsole.log(x);',
              options: ['18', '27', '9', '54'],
              correct: 1,
              explanation: 'x=1: 1*3=3. x=3: 3*3=9. x=9: 9*3=27. Now 27 < 20 is false, loop ends. x is 27.',
            },
          ],
        },

        {
          id: 'js-3-4',
          title: '🧩 Control Flow Challenges',
          xp: 40,
          steps: [
            {
              type: 'info',
              heading: 'Time to Problem Solve!',
              content: 'These challenges combine everything from this module. Read each carefully, trace through the code step by step, and think before you answer.\n\nTip: write out the value of each variable as you go.',
              code: null,
              tip: '🎯 Strategy: trace variable values line by line on paper or mentally.',
            },
            {
              type: 'quiz',
              question: 'What is the output? Trace carefully.',
              code: 'let x = 7;\nlet result = "";\n\nif (x % 2 === 0) {\n  result = "even";\n} else if (x % 3 === 0) {\n  result = "divisible by 3";\n} else {\n  result = "other";\n}\n\nconsole.log(result);',
              options: ['"even"', '"divisible by 3"', '"other"', 'Error'],
              correct: 2,
              explanation: '7 % 2 = 1, not 0 → skip first branch. 7 % 3 = 1, not 0 → skip second branch. Falls through to else: "other".',
            },
            {
              type: 'quiz',
              question: 'What does this output?',
              code: 'let sum = 0;\nfor (let i = 1; i <= 10; i++) {\n  if (i % 2 === 0) {\n    sum += i;\n  }\n}\nconsole.log(sum);',
              options: ['25', '30', '55', '20'],
              correct: 1,
              explanation: 'The loop runs i = 1 to 10. Only even numbers (i % 2 === 0) get added: 2+4+6+8+10 = 30.',
            },
            {
              type: 'quiz',
              question: 'How many times does "hello" get printed?',
              code: 'let i = 0;\nwhile (i < 5) {\n  if (i % 2 !== 0) {\n    console.log("hello");\n  }\n  i++;\n}',
              options: ['5 times', '3 times', '2 times', '0 times'],
              correct: 2,
              explanation: 'i goes 0,1,2,3,4. Only ODD values (i % 2 !== 0) print: i=1 and i=3. That is 2 times.',
            },
          ],
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // MODULE 4: Functions
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: 'mod4',
      title: 'Functions',
      icon: '⚙️',
      lessons: [
        {
          id: 'js-4-1',
          title: 'What is a Function?',
          xp: 20,
          steps: [
            {
              type: 'info',
              heading: 'Functions: Reusable Code Blocks',
              content: 'A function is a named block of code you can run anytime by "calling" it. Define once, use as many times as you want.',
              code: '// Define the function\nfunction greet() {\n  console.log("Hello, World!");\n}\n\n// Call it multiple times\ngreet(); // "Hello, World!"\ngreet(); // "Hello, World!"\ngreet(); // "Hello, World!"',
              tip: '💡 Defining a function does nothing on its own — you must call it to run it.',
            },
            {
              type: 'quiz',
              question: 'What is the output and in what order?',
              code: 'function sayHi() {\n  console.log("Hi!");\n}\n\nconsole.log("Before");\nsayHi();\nconsole.log("After");',
              options: [
                '"Hi!", "Before", "After"',
                '"Before", "Hi!", "After"',
                '"Before", "After"',
                'Error',
              ],
              correct: 1,
              explanation: 'Code runs top to bottom. "Before" logs first, then sayHi() is called (logs "Hi!"), then "After" logs. Functions run at the point they are called.',
            },
            {
              type: 'info',
              heading: 'Functions with Parameters',
              content: 'Parameters let you pass data into a function, making it flexible and reusable:',
              code: 'function greet(name) {\n  console.log(`Hello, ${name}!`);\n}\n\ngreet("Alice");  // "Hello, Alice!"\ngreet("Bob");    // "Hello, Bob!"\ngreet("Carol");  // "Hello, Carol!"',
              tip: '💡 Parameters are like variables local to the function. They receive their value when the function is called.',
            },
            {
              type: 'quiz',
              question: 'What does this output?',
              code: 'function double(x) {\n  console.log(x * 2);\n}\n\ndouble(7);',
              options: ['7', '14', '49', 'x * 2'],
              correct: 1,
              explanation: 'When double(7) is called, x = 7 inside the function. It logs 7 * 2 = 14.',
            },
          ],
        },

        {
          id: 'js-4-2',
          title: 'Parameters & Return',
          xp: 30,
          steps: [
            {
              type: 'info',
              heading: 'Sending Back a Value with `return`',
              content: 'A function can send a value back to the caller using `return`. This lets you use the result elsewhere. Once `return` runs, the function immediately stops.',
              code: 'function add(a, b) {\n  return a + b;  // sends back the sum\n}\n\nlet result = add(3, 7);\nconsole.log(result);       // 10\nconsole.log(add(100, 50)); // 150',
              tip: null,
            },
            {
              type: 'quiz',
              question: 'What does `multiply(4, 5)` log?',
              code: 'function multiply(a, b) {\n  return a * b;\n}\n\nconsole.log(multiply(4, 5));',
              options: ['9', '20', '45', 'undefined'],
              correct: 1,
              explanation: 'The function multiplies its parameters: 4 * 5 = 20. The return value 20 is passed directly to console.log.',
            },
            {
              type: 'quiz',
              question: 'What does `isEven(7)` return?',
              code: 'function isEven(n) {\n  return n % 2 === 0;\n}\n\nconsole.log(isEven(7));',
              options: ['7', '1', 'true', 'false'],
              correct: 3,
              explanation: '7 % 2 = 1, and 1 === 0 is false. The function returns false. This pattern (returning a boolean from a comparison) is very common.',
            },
            {
              type: 'quiz',
              question: 'What does this function output?',
              code: 'function max(a, b) {\n  if (a > b) return a;\n  return b;\n}\n\nconsole.log(max(8, 12));',
              options: ['8', '12', '20', 'undefined'],
              correct: 1,
              explanation: 'a=8, b=12. Is 8 > 12? No. The first return is skipped. The function returns b = 12.',
            },
            {
              type: 'quiz',
              question: 'What does this log?',
              code: 'function gradeLabel(score) {\n  if (score >= 90) return "A";\n  if (score >= 80) return "B";\n  if (score >= 70) return "C";\n  return "F";\n}\n\nconsole.log(gradeLabel(85));',
              options: ['"A"', '"B"', '"C"', '"F"'],
              correct: 1,
              explanation: 'score=85. 85 >= 90? No. 85 >= 80? Yes → return "B". The function exits immediately, skipping the rest.',
            },
          ],
        },

        {
          id: 'js-4-3',
          title: 'Arrow Functions',
          xp: 25,
          steps: [
            {
              type: 'info',
              heading: 'A Shorter Syntax for Functions',
              content: 'Arrow functions are a compact way to write functions, introduced in ES6. They\'re especially popular for short callbacks.',
              code: '// Traditional function\nfunction add(a, b) {\n  return a + b;\n}\n\n// Arrow function — same behaviour\nconst add = (a, b) => {\n  return a + b;\n};\n\nconsole.log(add(3, 4)); // 7',
              tip: null,
            },
            {
              type: 'info',
              heading: 'Implicit Return',
              content: 'When the body is a single expression, skip the braces and `return` — the value is returned automatically:',
              code: '// With braces (explicit return)\nconst square = (x) => { return x * x; };\n\n// Without braces (implicit return — shorter!)\nconst square = x => x * x;\n\nconsole.log(square(5)); // 25\n\n// More examples\nconst greet  = name => `Hello, ${name}!`;\nconst double = n => n * 2;',
              tip: '💡 Single parameter? You can drop the parentheses: x => x * x. Multiple parameters still need parens: (a, b) => a + b.',
            },
            {
              type: 'quiz',
              question: 'What does this arrow function return?',
              code: 'const cube = x => x * x * x;\nconsole.log(cube(3));',
              options: ['6', '9', '27', '3'],
              correct: 2,
              explanation: 'cube(3) = 3 * 3 * 3 = 27. The arrow function uses implicit return — no braces, no return keyword.',
            },
            {
              type: 'quiz',
              question: 'Which is the correct arrow function equivalent of `function double(n) { return n * 2; }`?',
              code: null,
              options: [
                'double => n * 2',
                'const double = n => n * 2;',
                'const double = n => { n * 2 };',
                'double(n) => n * 2;',
              ],
              correct: 1,
              explanation: 'const double = n => n * 2; is correct. Option C has braces but no return keyword — that returns undefined! With braces you must write return explicitly.',
            },
          ],
        },

        {
          id: 'js-4-4',
          title: '🧩 Functions Challenges',
          xp: 45,
          steps: [
            {
              type: 'info',
              heading: 'Function Problem Solving',
              content: 'These challenges test your ability to trace through functions with multiple paths. Take your time — work through each call step by step.',
              code: null,
              tip: '🎯 Strategy: substitute the argument values into the function body, then evaluate.',
            },
            {
              type: 'quiz',
              question: 'What does this log?',
              code: 'function mystery(n) {\n  if (n < 0) return "negative";\n  if (n === 0) return "zero";\n  return "positive";\n}\n\nconsole.log(mystery(-5));\nconsole.log(mystery(0));\nconsole.log(mystery(3));',
              options: [
                '"negative", "zero", "positive"',
                '"negative", "negative", "positive"',
                '"positive", "zero", "positive"',
                'Error',
              ],
              correct: 0,
              explanation: 'mystery(-5): -5 < 0 → "negative". mystery(0): 0 < 0 is false; 0 === 0 → "zero". mystery(3): neither condition → "positive".',
            },
            {
              type: 'quiz',
              question: 'What is the output?',
              code: 'const apply = (fn, value) => fn(value);\nconst triple = n => n * 3;\n\nconsole.log(apply(triple, 7));',
              options: ['7', '21', '3', 'Error'],
              correct: 1,
              explanation: 'apply receives the triple function and 7. It calls fn(value) = triple(7) = 7 * 3 = 21. Passing functions as arguments is called "higher-order" programming.',
            },
            {
              type: 'quiz',
              question: 'What does this return?',
              code: 'function makeAdder(x) {\n  return function(y) {\n    return x + y;\n  };\n}\n\nconst add5 = makeAdder(5);\nconsole.log(add5(10));',
              options: ['5', '10', '15', 'undefined'],
              correct: 2,
              explanation: 'makeAdder(5) returns a function that adds 5 to its argument. add5 = that function. add5(10) = 5 + 10 = 15. This is a closure — the inner function remembers x = 5.',
            },
          ],
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────────────
    // MODULE 5: Arrays
    // ──────────────────────────────────────────────────────────────────────────
    {
      id: 'mod5',
      title: 'Arrays',
      icon: '📚',
      lessons: [
        {
          id: 'js-5-1',
          title: 'Array Basics',
          xp: 25,
          steps: [
            {
              type: 'info',
              heading: 'What is an Array?',
              content: 'An array stores multiple values in a single variable, in order. Think of it as a numbered list. Items are separated by commas inside square brackets.',
              code: 'let fruits  = ["apple", "banana", "cherry"];\nlet numbers = [10, 20, 30, 40];\nlet mixed   = [1, "hello", true]; // can mix types\n\nconsole.log(fruits);   // ["apple", "banana", "cherry"]\nconsole.log(numbers);  // [10, 20, 30, 40]',
              tip: null,
            },
            {
              type: 'info',
              heading: 'Accessing Elements (Zero-Based Index)',
              content: 'Array positions start at **0**, not 1. Use square brackets with the index number to access an element.',
              code: 'let colors = ["red", "green", "blue"];\n//             [0]     [1]     [2]\n\nconsole.log(colors[0]); // "red"\nconsole.log(colors[1]); // "green"\nconsole.log(colors[2]); // "blue"\nconsole.log(colors[3]); // undefined',
              tip: '💡 Off-by-one is the most common array mistake. Always remember: first item = index 0.',
            },
            {
              type: 'quiz',
              question: 'What does this log?',
              code: 'let animals = ["cat", "dog", "bird"];\nconsole.log(animals[1]);',
              options: ['"cat"', '"dog"', '"bird"', 'undefined'],
              correct: 1,
              explanation: 'Index 1 is the second element. animals[0]="cat", animals[1]="dog", animals[2]="bird".',
            },
            {
              type: 'info',
              heading: '`.length` and Looping Arrays',
              content: 'Use `.length` to get the count. The last element is always at index `length - 1`. Use a for loop to process every element.',
              code: 'let nums = [5, 10, 15, 20];\n\nconsole.log(nums.length);           // 4\nconsole.log(nums[nums.length - 1]); // 20 (last item)\n\n// Loop through every element\nfor (let i = 0; i < nums.length; i++) {\n  console.log(nums[i]); // 5, 10, 15, 20\n}',
              tip: null,
            },
            {
              type: 'quiz',
              question: 'What does this output?',
              code: 'let arr = [3, 6, 9, 12];\nconsole.log(arr.length);',
              options: ['3', '4', '12', 'undefined'],
              correct: 1,
              explanation: 'The array has 4 elements. .length returns 4. Note: last index is 3, but length is 4 — length is always one more than the last index.',
            },
          ],
        },

        {
          id: 'js-5-2',
          title: 'Array Methods',
          xp: 35,
          steps: [
            {
              type: 'info',
              heading: 'Adding & Removing Elements',
              content: 'Arrays have built-in methods to add and remove items:\n• `push(val)` — add to END\n• `pop()` — remove from END\n• `unshift(val)` — add to START\n• `shift()` — remove from START',
              code: 'let arr = [1, 2, 3];\n\narr.push(4);    // [1, 2, 3, 4]\narr.pop();      // [1, 2, 3]   (removes 4)\narr.unshift(0); // [0, 1, 2, 3]\narr.shift();    // [1, 2, 3]   (removes 0)',
              tip: '💡 Memory trick: push/pop = END. shift/unshift = START.',
            },
            {
              type: 'quiz',
              question: 'What is `arr` after this code?',
              code: 'let arr = [10, 20, 30];\narr.push(40);\narr.shift();\nconsole.log(arr);',
              options: ['[10, 20, 30, 40]', '[20, 30, 40]', '[10, 20, 30]', '[20, 30]'],
              correct: 1,
              explanation: 'push(40) adds to end: [10,20,30,40]. shift() removes from start: [20,30,40].',
            },
            {
              type: 'info',
              heading: '`map()` — Transform Every Element',
              content: '`map()` creates a NEW array by applying a function to each element. The original array is never changed.',
              code: 'let nums = [1, 2, 3, 4];\n\nlet doubled = nums.map(n => n * 2);\nconsole.log(doubled); // [2, 4, 6, 8]\n\nlet words  = ["hi", "bye"];\nlet upper  = words.map(w => w.toUpperCase());\nconsole.log(upper);   // ["HI", "BYE"]\n\nconsole.log(nums);    // [1, 2, 3, 4]  ← unchanged',
              tip: '💡 map() always returns an array of the SAME LENGTH as the original.',
            },
            {
              type: 'quiz',
              question: 'What does this return?',
              code: 'let words = ["hi", "bye", "ok"];\nlet lengths = words.map(w => w.length);\nconsole.log(lengths);',
              options: ['["hi", "bye", "ok"]', '[2, 3, 2]', '[2, 3]', 'Error'],
              correct: 1,
              explanation: '"hi".length=2, "bye".length=3, "ok".length=2. map() creates [2, 3, 2].',
            },
            {
              type: 'info',
              heading: '`filter()` — Keep Only Matching Elements',
              content: '`filter()` creates a NEW array keeping only elements where the callback returns `true`.',
              code: 'let nums = [1, 2, 3, 4, 5, 6];\n\nlet evens = nums.filter(n => n % 2 === 0);\nconsole.log(evens); // [2, 4, 6]\n\nlet big   = nums.filter(n => n > 3);\nconsole.log(big);   // [4, 5, 6]',
              tip: '💡 filter() may return a shorter array. map() always returns the same length.',
            },
            {
              type: 'quiz',
              question: 'What does this output?',
              code: 'let scores = [45, 72, 88, 55, 91];\nlet passing = scores.filter(s => s >= 70);\nconsole.log(passing);',
              options: ['[45, 55]', '[72, 88, 91]', '[72, 88]', '[3]'],
              correct: 1,
              explanation: 'Only scores >= 70 pass: 72 ✓, 88 ✓, 91 ✓. 45 and 55 are removed. Result: [72, 88, 91].',
            },
          ],
        },

        {
          id: 'js-5-3',
          title: '🧩 Arrays Challenges',
          xp: 50,
          steps: [
            {
              type: 'info',
              heading: 'Array Problem Solving',
              content: 'These challenges combine loops, functions, and array methods. Read carefully and trace each operation in order.',
              code: null,
              tip: '🎯 Strategy: For chained methods, evaluate left to right — each result feeds the next.',
            },
            {
              type: 'quiz',
              question: 'What does this output?',
              code: 'let nums = [1, 2, 3, 4, 5];\nlet result = nums\n  .filter(n => n % 2 !== 0)\n  .map(n => n * n);\nconsole.log(result);',
              options: ['[1, 9, 25]', '[1, 4, 9, 16, 25]', '[1, 3, 5]', '[2, 4]'],
              correct: 0,
              explanation: 'filter keeps odd numbers: [1,3,5]. Then map squares each: [1,9,25]. Chained methods process left to right.',
            },
            {
              type: 'quiz',
              question: 'What is `total` after this runs?',
              code: 'let prices = [10, 25, 5, 30];\nlet total = 0;\n\nprices.forEach(p => {\n  total += p;\n});\n\nconsole.log(total);',
              options: ['40', '70', '25', '10'],
              correct: 1,
              explanation: 'forEach iterates every element. total accumulates: 0+10+25+5+30 = 70. forEach is like a for loop but cleaner for arrays.',
            },
            {
              type: 'quiz',
              question: 'What does this function return when called with `[3, 1, 4, 1, 5]`?',
              code: 'function biggestItem(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) {\n      max = arr[i];\n    }\n  }\n  return max;\n}\n\nconsole.log(biggestItem([3, 1, 4, 1, 5]));',
              options: ['3', '1', '4', '5'],
              correct: 3,
              explanation: 'max starts at 3. Loop: 1>3? No. 4>3? Yes, max=4. 1>4? No. 5>4? Yes, max=5. Returns 5. This is a classic "find maximum" algorithm.',
            },
          ],
        },
      ],
    },
  ],
}

export default jsCourse
