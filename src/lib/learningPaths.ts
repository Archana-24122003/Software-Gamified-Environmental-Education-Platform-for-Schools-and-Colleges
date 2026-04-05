export type SubjectKey = "maths" | "evs" | "english";

export type LearningGame = {
  slug: string;
  title: string;
};

export type LearningMilestone = {
  slug: string;
  title: string;
  summary: string;
  activity: string;
  activities: LearningGame[];
  duration: string;
};

export type LearningPath = {
  key: SubjectKey;
  slug: SubjectKey;
  label: string;
  accent: string;
  description: string;
  tagline: string;
  heroMetric: string;
  totalLessons: number;
  duration: string;
  milestones: LearningMilestone[];
};

export const learningPaths: LearningPath[] = [
  {
    key: "maths",
    slug: "maths",
    label: "Maths",
    accent: "#ffb37a",
    description: "Play with numbers, patterns, and quick brain-boosting challenges.",
    tagline: "Build confidence with steps that turn numbers into puzzles and wins.",
    heroMetric: "12 concept checkpoints",
    totalLessons: 4,
    duration: "3 weeks",
    milestones: [
      {
        slug: "warm-up-with-number-sense",
        title: "Warm Up With Number Sense",
        summary: "Start with counting patterns, place value, and quick number comparisons.",
        activity: "Flash-card race and visual number maze",
        activities: [
          { slug: "flash-card-race", title: "Flash-Card Race" },
          { slug: "visual-number-maze", title: "Visual Number Maze" },
        ],
        duration: "Week 1",
      },
      {
        slug: "crack-everyday-operations",
        title: "Crack Everyday Operations",
        summary: "Practice addition, subtraction, multiplication, and division through stories.",
        activity: "Game cards with mini score boosts",
        activities: [
          { slug: "challenge-cards", title: "Challenge Cards" },
          { slug: "score-boost-sprint", title: "Score Boost Sprint" },
        ],
        duration: "Week 1-2",
      },
      {
        slug: "spot-shapes-and-patterns",
        title: "Spot Shapes And Patterns",
        summary: "Recognize geometry in objects and decode repeating pattern clues.",
        activity: "Shape detective board",
        activities: [
          { slug: "shape-detective-board", title: "Shape Detective Board" },
          { slug: "pattern-clue-hunt", title: "Pattern Clue Hunt" },
        ],
        duration: "Week 2",
      },
      {
        slug: "level-up-with-problem-solving",
        title: "Level Up With Problem Solving",
        summary: "Use all your skills in timed challenges and step-by-step word problems.",
        activity: "Boss challenge with reward stars",
        activities: [
          { slug: "boss-challenge", title: "Boss Challenge" },
          { slug: "reward-star-quest", title: "Reward Star Quest" },
        ],
        duration: "Week 3",
      },
    ],
  },
  {
    key: "evs",
    slug: "evs",
    label: "EVS",
    accent: "#92d7a7",
    description: "Explore nature, sustainability, and the world around you.",
    tagline: "Travel through plants, people, water, and planet-friendly habits.",
    heroMetric: "9 eco action game levels",
    totalLessons: 4,
    duration: "3 weeks",
    milestones: [
      {
        slug: "meet-your-environment",
        title: "Meet Your Environment",
        summary: "Discover natural and human-made surroundings through familiar examples.",
        activity: "Neighborhood observation quest",
        activities: [
          { slug: "neighborhood-observation-quest", title: "Neighborhood Observation Quest" },
          { slug: "surroundings-sorter", title: "Surroundings Sorter" },
        ],
        duration: "Week 1",
      },
      {
        slug: "care-for-plants-and-animals",
        title: "Care For Plants And Animals",
        summary: "Learn how living things grow, survive, and depend on one another.",
        activity: "Food-chain puzzle trail",
        activities: [
          { slug: "food-chain-puzzle-trail", title: "Food-Chain Puzzle Trail" },
          { slug: "habitat-match-up", title: "Habitat Match-Up" },
        ],
        duration: "Week 1-2",
      },
      {
        slug: "save-water-and-resources",
        title: "Save Water And Resources",
        summary: "Understand conservation with simple daily actions and impact stories.",
        activity: "Eco habit checklist challenge",
        activities: [
          { slug: "eco-habit-checklist", title: "Eco Habit Checklist" },
          { slug: "water-saver-sprint", title: "Water Saver Sprint" },
        ],
        duration: "Week 2",
      },
      {
        slug: "become-a-green-champion",
        title: "Become A Green Champion",
        summary: "Finish with clean-energy ideas, waste sorting, and school impact game levels.",
        activity: "Campus cleanup capstone",
        activities: [
          { slug: "campus-cleanup-capstone", title: "Campus Cleanup Capstone" },
          { slug: "green-champion-badge-run", title: "Green Champion Badge Run" },
        ],
        duration: "Week 3",
      },
    ],
  },
  {
    key: "english",
    slug: "english",
    label: "English",
    accent: "#f6b0cf",
    description: "Read, write, and build confidence with fun language activities.",
    tagline: "Grow vocabulary, reading, and expression through playful story steps.",
    heroMetric: "15 speaking and reading boosts",
    totalLessons: 4,
    duration: "3 weeks",
    milestones: [
      {
        slug: "collect-new-words",
        title: "Collect New Words",
        summary: "Build vocabulary with picture clues, opposites, and matching games.",
        activity: "Word garden starter pack",
        activities: [
          { slug: "word-garden-starter-pack", title: "Word Garden Starter Pack" },
          { slug: "picture-clue-match", title: "Picture Clue Match" },
        ],
        duration: "Week 1",
      },
      {
        slug: "read-short-stories",
        title: "Read Short Stories",
        summary: "Practice reading with simple passages, questions, and expression prompts.",
        activity: "Story path with unlockable scenes",
        activities: [
          { slug: "story-path", title: "Story Path" },
          { slug: "reading-scene-unlock", title: "Reading Scene Unlock" },
        ],
        duration: "Week 1-2",
      },
      {
        slug: "write-with-confidence",
        title: "Write With Confidence",
        summary: "Form sentences, describe scenes, and arrange ideas in a clear order.",
        activity: "Sentence builder workshop",
        activities: [
          { slug: "sentence-builder-workshop", title: "Sentence Builder Workshop" },
          { slug: "describe-the-scene", title: "Describe The Scene" },
        ],
        duration: "Week 2",
      },
      {
        slug: "speak-and-share",
        title: "Speak And Share",
        summary: "Use speaking cues, role play, and short presentations to communicate clearly.",
        activity: "Class spotlight finale",
        activities: [
          { slug: "class-spotlight-finale", title: "Class Spotlight Finale" },
          { slug: "role-play-round", title: "Role-Play Round" },
        ],
        duration: "Week 3",
      },
    ],
  },
];

export function getLearningPath(subject: string) {
  return learningPaths.find((path) => path.slug === subject);
}

export function getMilestone(subject: string, milestoneSlug: string) {
  return getLearningPath(subject)?.milestones.find((milestone) => milestone.slug === milestoneSlug);
}

export function getMilestoneGame(subject: string, milestoneSlug: string, gameSlug: string) {
  return getMilestone(subject, milestoneSlug)?.activities.find((game) => game.slug === gameSlug);
}
