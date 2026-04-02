export type StarterCodeMap = {
  javascript?: string;
  python?: string;
  go?: string;
};

export type ChallengeExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  duration: number;
  tags: string[];
  examples?: ChallengeExample[];
  starterCode?: string | StarterCodeMap;
  constraints?: string[];
};