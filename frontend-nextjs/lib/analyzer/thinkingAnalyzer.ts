export interface AnalyzerInput {
  code: string;
  runCount: number;
  timeSpent: number; // seconds
  score: number; // 0 - 100
  challenge: {
    id: string;
    title: string;
    tags: string[];
    expectedPatterns?: string[];
    commonMistakes?: string[];
  };
}

export interface AnalyzerResult {
  insight: string;
  pattern: string;
  strengths: string[];
  gaps: string[];
  nextHint: string;
  complexity: {
    time: string;
    space: string;
  };
  progress: {
    exploration: number;
    optimization: number;
    completion: number;
  };
}

export function analyzeThinking(input: AnalyzerInput): AnalyzerResult {
  const { code, runCount, timeSpent, score, challenge } = input;

  let insight = "";
  let pattern = "Unknown";

  const strengths: string[] = [];
  const gaps: string[] = [];

  const hasFor = code.includes("for");
  const hasNestedLoop = hasFor && code.split("for").length > 2;
  const hasWhile = code.includes("while");
  const hasPush = code.includes("push");
  const hasPop = code.includes("pop");
  const hasMap =
    code.includes("Map(") ||
    code.includes("new Map") ||
    code.includes("{}") ||
    code.includes("Object");
  const hasLeftRight =
    code.includes("left") && code.includes("right");

  // Pattern detection
  if (hasNestedLoop) {
    pattern = "Brute Force";
    insight = "Nested loops detected. This may lead to inefficient performance.";
  } else if (challenge.tags.includes("stack") && (hasPush || hasPop || code.includes("stack"))) {
    pattern = "Stack-Based Thinking";
    insight = "You appear to be using a stack-oriented approach.";
    strengths.push("Your code structure suggests stack usage.");
  } else if (challenge.tags.includes("two-pointers") && hasLeftRight) {
    pattern = "Two-Pointer Thinking";
    insight = "You seem to be using a two-pointer strategy.";
    strengths.push("Your variable structure suggests paired pointer movement.");
  } else if (challenge.tags.includes("hashmap") && hasMap) {
    pattern = "Hashmap Thinking";
    insight = "You appear to be using a lookup-based approach.";
    strengths.push("Your solution likely benefits from constant-time lookups.");
  } else if (hasWhile || hasFor) {
    pattern = "Iterative Approach";
    insight = "You are using an iterative approach.";
    strengths.push("Your code is progressing through controlled iteration.");
  } else {
    pattern = "Optimized Thinking";
    insight = "Your solution structure looks efficient.";
  }

  // Basic gap detection
  if (challenge.tags.includes("stack") && hasPop && !code.includes("length")) {
    gaps.push("You may not be checking for an empty stack before popping.");
  }

  if (hasNestedLoop && score < 50) {
    gaps.push("Your current logic may be doing extra repeated work.");
  }

  if (!hasFor && !hasWhile && score < 30) {
    gaps.push("Your solution structure is still too incomplete to identify a strong approach.");
  }

  // Complexity estimate
  let timeComplexity = "O(n)";
  let spaceComplexity = "O(1)";

  if (hasNestedLoop) {
    timeComplexity = "O(n²)";
  }

  if (pattern === "Stack-Based Thinking") {
    spaceComplexity = "O(n)";
  }

  if (pattern === "Hashmap Thinking") {
    spaceComplexity = "O(n)";
  }

  // Progress estimation
  const exploration = Math.min(runCount * 10, 60);
  const optimization = score > 50 ? 30 : 10;
  const completion = Math.min(score, 100);

  const nextHint =
    gaps.length > 0
      ? gaps[0]
      : strengths.length > 0
      ? "Your approach looks promising. Refine edge cases next."
      : "Keep building your solution so the analyzer can detect your strategy more clearly.";

  return {
    insight,
    pattern,
    strengths,
    gaps,
    nextHint,
    complexity: {
      time: timeComplexity,
      space: spaceComplexity,
    },
    progress: {
      exploration,
      optimization,
      completion,
    },
  };
}