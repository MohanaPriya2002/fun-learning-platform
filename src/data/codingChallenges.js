export const CODING_CHALLENGES = [
  {
    id: 'sum-array',
    level: 'basic',
    title: 'Sum An Array',
    topic: 'Arrays and loops',
    summary: 'Practice reading values one by one and building a running total.',
    prompt:
      'Write a function named `sumArray` that returns the total of all numbers in an array. If the array is empty, return `0`.',
    starterCode: `function sumArray(numbers) {
  let total = 0;

  for (const number of numbers) {
    // add each number to total
  }

  return total;
}`,
    solution: `function sumArray(numbers) {
  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  return total;
}`,
    approach: [
      'Create a variable to store the running total.',
      'Loop through every number in the array.',
      'Add the current number to the total.',
      'Return the final total after the loop ends.',
    ],
    theory: [
      'A loop lets you repeat the same action for every item in a collection.',
      'Accumulation means building one result step by step, like a total or count.',
      'An empty array should still return a valid default result.',
    ],
    hints: [
      'You already have `total = 0`; the missing step belongs inside the loop.',
      'Use `total += number` to add the current value.',
      'Do not return from inside the loop or you will stop too early.',
    ],
    tests: [
      'sumArray([1, 2, 3, 4]) -> 10',
      'sumArray([5]) -> 5',
      'sumArray([]) -> 0',
    ],
    edgeCases: ['Empty arrays', 'Negative numbers', 'Single-item arrays'],
  },
  {
    id: 'count-vowels',
    level: 'basic',
    title: 'Count Vowels',
    topic: 'Strings and conditionals',
    summary: 'Learn how to scan text and count only the characters you care about.',
    prompt:
      'Write a function named `countVowels` that returns how many vowels appear in a string. Treat `a`, `e`, `i`, `o`, and `u` as vowels, and ignore uppercase vs lowercase.',
    starterCode: `function countVowels(text) {
  const vowels = 'aeiou';
  let count = 0;

  for (const char of text.toLowerCase()) {
    // increase count when char is a vowel
  }

  return count;
}`,
    solution: `function countVowels(text) {
  const vowels = 'aeiou';
  let count = 0;

  for (const char of text.toLowerCase()) {
    if (vowels.includes(char)) {
      count += 1;
    }
  }

  return count;
}`,
    approach: [
      'Convert the text to lowercase so you only check one letter format.',
      'Loop through each character.',
      'Check whether the current character exists in the vowel list.',
      'Increase the count only when the condition is true.',
    ],
    theory: [
      'Strings can be iterated one character at a time with `for...of`.',
      'A conditional keeps your count from increasing for every character.',
      'Normalizing data first, like calling `toLowerCase()`, often simplifies logic.',
    ],
    hints: [
      'The condition belongs inside the loop.',
      'Use `vowels.includes(char)` to check if a character is a vowel.',
      'Only increment `count` when the condition passes.',
    ],
    tests: [
      'countVowels("hello") -> 2',
      'countVowels("ApplE") -> 2',
      'countVowels("rhythm") -> 0',
    ],
    edgeCases: ['Uppercase letters', 'Empty strings', 'Strings with spaces or punctuation'],
  },
  {
    id: 'title-case',
    level: 'medium',
    title: 'Title Case A Sentence',
    topic: 'Array transforms',
    summary: 'Split data, transform each piece, then join it back together.',
    prompt:
      'Write a function named `titleCase` that turns a sentence into title case. The first letter of each word should be uppercase and the rest lowercase.',
    starterCode: `function titleCase(sentence) {
  return sentence
    .split(' ')
    .map((word) => {
      // return the formatted version of each word
    })
    .join(' ');
}`,
    solution: `function titleCase(sentence) {
  return sentence
    .split(' ')
    .map((word) => {
      if (!word) return word;
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}`,
    approach: [
      'Split the sentence into an array of words.',
      'Transform every word with `map`.',
      'Uppercase the first letter and lowercase the rest.',
      'Join the transformed words back into one string.',
    ],
    theory: [
      '`map` creates a new array by transforming each item from an existing array.',
      '`slice(1)` gives you the rest of a string after the first character.',
      'Guard clauses like `if (!word) return word` help handle repeated spaces safely.',
    ],
    hints: [
      'Inside `map`, return a brand new string for each word.',
      'You can combine `word[0].toUpperCase()` with `word.slice(1).toLowerCase()`.',
      'Think about what happens if there are two spaces in a row.',
    ],
    tests: [
      'titleCase("javaScript is FUN") -> "Javascript Is Fun"',
      'titleCase("hello world") -> "Hello World"',
      'titleCase("two  spaces") -> "Two  Spaces"',
    ],
    edgeCases: ['Repeated spaces', 'Single-letter words', 'Mixed capitalization'],
  },
  {
    id: 'missing-number',
    level: 'medium',
    title: 'Find The Missing Number',
    topic: 'Patterns and arithmetic',
    summary: 'Use a math shortcut instead of comparing every possible number manually.',
    prompt:
      'Write a function named `findMissingNumber` that receives an array containing unique numbers from `1` to `n`, with exactly one number missing. Return the missing number.',
    starterCode: `function findMissingNumber(numbers, n) {
  const expectedTotal = (n * (n + 1)) / 2;
  let actualTotal = 0;

  for (const number of numbers) {
    // build the real total
  }

  return expectedTotal - actualTotal;
}`,
    solution: `function findMissingNumber(numbers, n) {
  const expectedTotal = (n * (n + 1)) / 2;
  let actualTotal = 0;

  for (const number of numbers) {
    actualTotal += number;
  }

  return expectedTotal - actualTotal;
}`,
    approach: [
      'Calculate the sum from 1 through n using the arithmetic formula.',
      'Calculate the sum of the numbers that actually exist in the array.',
      'Subtract the actual total from the expected total.',
      'The difference is the missing value.',
    ],
    theory: [
      'Recognizing a pattern can turn a longer solution into a simpler one.',
      'The sum from 1 to n is `(n * (n + 1)) / 2`.',
      'This approach avoids nested loops and stays efficient.',
    ],
    hints: [
      'You already know the ideal total from 1 to n.',
      'The loop should add every array value into `actualTotal`.',
      'The final subtraction gives you the missing number directly.',
    ],
    tests: [
      'findMissingNumber([1, 2, 4, 5], 5) -> 3',
      'findMissingNumber([2, 3, 1, 5], 5) -> 4',
      'findMissingNumber([1], 2) -> 2',
    ],
    edgeCases: ['Missing first number', 'Missing last number', 'Array with only one present value'],
  },
  {
    id: 'group-anagrams',
    level: 'hard',
    title: 'Group Anagrams',
    topic: 'Objects and hashing',
    summary: 'Create a stable key so words with the same letters land in the same bucket.',
    prompt:
      'Write a function named `groupAnagrams` that groups together words made from the same letters. Return an array of grouped arrays.',
    starterCode: `function groupAnagrams(words) {
  const groups = {};

  for (const word of words) {
    const key = word.toLowerCase().split('').sort().join('');

    if (!groups[key]) {
      groups[key] = [];
    }

    // push the word into the correct group
  }

  return Object.values(groups);
}`,
    solution: `function groupAnagrams(words) {
  const groups = {};

  for (const word of words) {
    const key = word.toLowerCase().split('').sort().join('');

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(word);
  }

  return Object.values(groups);
}`,
    approach: [
      'Build a key that looks identical for all anagrams.',
      'Sort the letters of each word and use the sorted result as the key.',
      'Store grouped words inside an object.',
      'Return the grouped arrays at the end.',
    ],
    theory: [
      'A hash map or plain object is useful when you need to group related items quickly.',
      'Different words like `eat`, `tea`, and `ate` all become the same sorted key: `aet`.',
      'Turning a hard comparison problem into a key-lookup problem is a common interview pattern.',
    ],
    hints: [
      'The sorted letters are the important grouping key here.',
      'Every key should point to an array of matching words.',
      'After creating the bucket, add the current word with `.push(word)`.',
    ],
    tests: [
      'groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]) -> [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]',
      'groupAnagrams(["arc", "car"]) -> [["arc", "car"]]',
      'groupAnagrams(["solo"]) -> [["solo"]]',
    ],
    edgeCases: ['Single-word input', 'Uppercase vs lowercase', 'Repeated words'],
  },
  {
    id: 'flatten-array',
    level: 'hard',
    title: 'Flatten A Nested Array',
    topic: 'Recursion',
    summary: 'Break a big problem into smaller versions of the same problem.',
    prompt:
      'Write a function named `flattenArray` that takes a nested array and returns a new flat array containing every value in order.',
    starterCode: `function flattenArray(items) {
  const result = [];

  for (const item of items) {
    if (Array.isArray(item)) {
      // flatten nested arrays and add their values
    } else {
      result.push(item);
    }
  }

  return result;
}`,
    solution: `function flattenArray(items) {
  const result = [];

  for (const item of items) {
    if (Array.isArray(item)) {
      result.push(...flattenArray(item));
    } else {
      result.push(item);
    }
  }

  return result;
}`,
    approach: [
      'Create an empty result array.',
      'Loop through each item.',
      'If the item is another array, flatten it by calling the same function again.',
      'If the item is a normal value, push it into the result.',
    ],
    theory: [
      'Recursion means a function solves a problem by calling itself on a smaller version of that problem.',
      'Every recursive solution needs a stopping condition, also called a base case.',
      'The spread operator helps merge returned arrays into the current result.',
    ],
    hints: [
      'When the item is an array, do not push the array itself.',
      'Call `flattenArray(item)` to solve the smaller nested piece.',
      'Use `result.push(...flattenArray(item))` to merge the returned values.',
    ],
    tests: [
      'flattenArray([1, [2, 3], 4]) -> [1, 2, 3, 4]',
      'flattenArray([[1], [2, [3, 4]], 5]) -> [1, 2, 3, 4, 5]',
      'flattenArray([]) -> []',
    ],
    edgeCases: ['Empty arrays', 'Deep nesting', 'Already flat input'],
  },
];

export const LEVEL_ORDER = ['basic', 'medium', 'hard'];

export const LEVEL_META = {
  basic: {
    label: 'Basic',
    description: 'Start with loops, conditionals, and core JavaScript building blocks.',
  },
  medium: {
    label: 'Medium',
    description: 'Practice transformations, patterns, and cleaner problem-solving strategies.',
  },
  hard: {
    label: 'Hard',
    description: 'Work through interview-style problems that require stronger decomposition.',
  },
};
