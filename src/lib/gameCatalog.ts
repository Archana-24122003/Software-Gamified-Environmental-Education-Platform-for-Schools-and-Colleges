export type ChoiceRound = {
  prompt: string;
  options: Array<{
    label: string;
    correct: boolean;
  }>;
};

export type TapRound = {
  prompt: string;
  targets: Array<{
    label: string;
    correct: boolean;
  }>;
};

export type SortRound = {
  prompt: string;
  categories: string[];
  items: Array<{
    label: string;
    category: string;
  }>;
};

export type MemoryPair = {
  pairId: string;
  left: string;
  right: string;
};

export type MemoryRound = {
  prompt: string;
  pairs: MemoryPair[];
};

export type GameDefinition =
  | {
      slug: string;
      title: string;
      mode: "choice";
      theme: {
        primary: string;
        secondary: string;
        accent: string;
      };
      intro: string;
      instructions: string;
      timeLimit: number;
      rounds: ChoiceRound[];
    }
  | {
      slug: string;
      title: string;
      mode: "tap";
      theme: {
        primary: string;
        secondary: string;
        accent: string;
      };
      intro: string;
      instructions: string;
      timeLimit: number;
      rounds: TapRound[];
    }
  | {
      slug: string;
      title: string;
      mode: "sort";
      theme: {
        primary: string;
        secondary: string;
        accent: string;
      };
      intro: string;
      instructions: string;
      timeLimit: number;
      rounds: SortRound[];
    }
  | {
      slug: string;
      title: string;
      mode: "memory";
      theme: {
        primary: string;
        secondary: string;
        accent: string;
      };
      intro: string;
      instructions: string;
      timeLimit: number;
      rounds: MemoryRound[];
    };

const warmTheme = { primary: "#ffcf8b", secondary: "#fff3d8", accent: "#ff8e5c" };
const greenTheme = { primary: "#9be1b0", secondary: "#edfcef", accent: "#3ea76a" };
const storyTheme = { primary: "#f5b6d0", secondary: "#fff0f6", accent: "#d75b91" };
const skyTheme = { primary: "#91d4ff", secondary: "#edf8ff", accent: "#3487d9" };

function choiceGame(
  slug: string,
  title: string,
  intro: string,
  instructions: string,
  theme: GameDefinition["theme"],
  rounds: ChoiceRound[],
  timeLimit = 45,
): GameDefinition {
  return { slug, title, mode: "choice", intro, instructions, theme, rounds, timeLimit };
}

function tapGame(
  slug: string,
  title: string,
  intro: string,
  instructions: string,
  theme: GameDefinition["theme"],
  rounds: TapRound[],
  timeLimit = 45,
): GameDefinition {
  return { slug, title, mode: "tap", intro, instructions, theme, rounds, timeLimit };
}

function sortGame(
  slug: string,
  title: string,
  intro: string,
  instructions: string,
  theme: GameDefinition["theme"],
  rounds: SortRound[],
  timeLimit = 50,
): GameDefinition {
  return { slug, title, mode: "sort", intro, instructions, theme, rounds, timeLimit };
}

function memoryGame(
  slug: string,
  title: string,
  intro: string,
  instructions: string,
  theme: GameDefinition["theme"],
  rounds: MemoryRound[],
  timeLimit = 55,
): GameDefinition {
  return { slug, title, mode: "memory", intro, instructions, theme, rounds, timeLimit };
}

export const gameCatalog: Record<string, GameDefinition> = {
  "flash-card-race": tapGame(
    "flash-card-race",
    "Flash-Card Race",
    "Pop the number bubbles that match the clue before the timer runs out.",
    "Tap only the correct answers. Quick streaks give bonus stars.",
    warmTheme,
    [
      {
        prompt: "Tap all numbers greater than 5",
        targets: [
          { label: "2", correct: false },
          { label: "9", correct: true },
          { label: "6", correct: true },
          { label: "4", correct: false },
          { label: "8", correct: true },
          { label: "1", correct: false },
        ],
      },
      {
        prompt: "Tap all even numbers",
        targets: [
          { label: "3", correct: false },
          { label: "10", correct: true },
          { label: "7", correct: false },
          { label: "12", correct: true },
          { label: "5", correct: false },
          { label: "4", correct: true },
        ],
      },
    ],
  ),
  "visual-number-maze": choiceGame(
    "visual-number-maze",
    "Visual Number Maze",
    "Choose the correct gate to help the explorer move through the number maze.",
    "Pick the best answer on each turn to keep your path glowing.",
    skyTheme,
    [
      {
        prompt: "Which number is the greatest?",
        options: [
          { label: "34", correct: false },
          { label: "43", correct: true },
          { label: "24", correct: false },
        ],
      },
      {
        prompt: "Which number has 5 tens and 2 ones?",
        options: [
          { label: "25", correct: false },
          { label: "52", correct: true },
          { label: "502", correct: false },
        ],
      },
      {
        prompt: "Which number comes next: 18, 19, ?",
        options: [
          { label: "20", correct: true },
          { label: "17", correct: false },
          { label: "29", correct: false },
        ],
      },
    ],
  ),
  "challenge-cards": choiceGame(
    "challenge-cards",
    "Challenge Cards",
    "Solve each challenge card to power up your math meter.",
    "Answer correctly to stack combo points.",
    warmTheme,
    [
      {
        prompt: "12 + 8 = ?",
        options: [
          { label: "18", correct: false },
          { label: "20", correct: true },
          { label: "22", correct: false },
        ],
      },
      {
        prompt: "15 - 6 = ?",
        options: [
          { label: "9", correct: true },
          { label: "8", correct: false },
          { label: "10", correct: false },
        ],
      },
      {
        prompt: "3 x 4 = ?",
        options: [
          { label: "7", correct: false },
          { label: "12", correct: true },
          { label: "14", correct: false },
        ],
      },
    ],
  ),
  "score-boost-sprint": tapGame(
    "score-boost-sprint",
    "Score Boost Sprint",
    "Catch the cards with the correct answers to keep your boost bar full.",
    "Tap only correct answers. Wrong taps cost time.",
    skyTheme,
    [
      {
        prompt: "Tap answers equal to 9",
        targets: [
          { label: "4 + 5", correct: true },
          { label: "6 + 1", correct: false },
          { label: "3 + 6", correct: true },
          { label: "10 - 3", correct: false },
          { label: "18 - 9", correct: true },
          { label: "5 + 5", correct: false },
        ],
      },
      {
        prompt: "Tap answers equal to 12",
        targets: [
          { label: "6 + 6", correct: true },
          { label: "10 + 1", correct: false },
          { label: "3 x 4", correct: true },
          { label: "15 - 4", correct: false },
          { label: "9 + 3", correct: true },
          { label: "20 - 5", correct: false },
        ],
      },
    ],
  ),
  "shape-detective-board": tapGame(
    "shape-detective-board",
    "Shape Detective Board",
    "Tap the shape clues that match the detective's callout.",
    "Watch carefully and tap all matching shapes to solve each case.",
    warmTheme,
    [
      {
        prompt: "Tap all circles",
        targets: [
          { label: "Circle", correct: true },
          { label: "Triangle", correct: false },
          { label: "Circle", correct: true },
          { label: "Rectangle", correct: false },
          { label: "Circle", correct: true },
          { label: "Square", correct: false },
        ],
      },
      {
        prompt: "Tap all shapes with 4 sides",
        targets: [
          { label: "Square", correct: true },
          { label: "Triangle", correct: false },
          { label: "Rectangle", correct: true },
          { label: "Oval", correct: false },
          { label: "Rhombus", correct: true },
          { label: "Circle", correct: false },
        ],
      },
    ],
  ),
  "pattern-clue-hunt": choiceGame(
    "pattern-clue-hunt",
    "Pattern Clue Hunt",
    "Unlock the next clue by finding what comes next in each pattern.",
    "Choose the right pattern piece before the trail fades.",
    skyTheme,
    [
      {
        prompt: "What comes next: 2, 4, 6, ?",
        options: [
          { label: "7", correct: false },
          { label: "8", correct: true },
          { label: "10", correct: false },
        ],
      },
      {
        prompt: "What comes next: circle, square, circle, square, ?",
        options: [
          { label: "Circle", correct: true },
          { label: "Triangle", correct: false },
          { label: "Rectangle", correct: false },
        ],
      },
      {
        prompt: "What comes next: 5, 10, 15, ?",
        options: [
          { label: "25", correct: false },
          { label: "20", correct: true },
          { label: "18", correct: false },
        ],
      },
    ],
  ),
  "boss-challenge": choiceGame(
    "boss-challenge",
    "Boss Challenge",
    "Beat the final boss by clearing a mixed set of math questions.",
    "Every right answer charges your star shield.",
    warmTheme,
    [
      {
        prompt: "If you have 14 apples and give away 5, how many are left?",
        options: [
          { label: "9", correct: true },
          { label: "10", correct: false },
          { label: "8", correct: false },
        ],
      },
      {
        prompt: "Which shape has 3 sides?",
        options: [
          { label: "Triangle", correct: true },
          { label: "Circle", correct: false },
          { label: "Rectangle", correct: false },
        ],
      },
      {
        prompt: "Complete the pattern: 1, 3, 5, ?",
        options: [
          { label: "6", correct: false },
          { label: "7", correct: true },
          { label: "8", correct: false },
        ],
      },
    ],
  ),
  "reward-star-quest": tapGame(
    "reward-star-quest",
    "Reward Star Quest",
    "Collect only the star cards that show the target answer.",
    "Tap the glowing answer cards quickly for a bonus finish.",
    skyTheme,
    [
      {
        prompt: "Tap all answers equal to 15",
        targets: [
          { label: "7 + 8", correct: true },
          { label: "10 + 2", correct: false },
          { label: "20 - 5", correct: true },
          { label: "3 x 4", correct: false },
          { label: "9 + 6", correct: true },
          { label: "18 - 2", correct: false },
        ],
      },
      {
        prompt: "Tap all numbers with 2 tens",
        targets: [
          { label: "21", correct: true },
          { label: "13", correct: false },
          { label: "27", correct: true },
          { label: "8", correct: false },
          { label: "20", correct: true },
          { label: "31", correct: false },
        ],
      },
    ],
  ),
  "neighborhood-observation-quest": choiceGame(
    "neighborhood-observation-quest",
    "Neighborhood Observation Quest",
    "Explore the neighborhood and answer what you notice around you.",
    "Pick the best observation to earn explorer badges.",
    greenTheme,
    [
      {
        prompt: "Which is a natural thing you may see in a park?",
        options: [
          { label: "Tree", correct: true },
          { label: "Bus stop", correct: false },
          { label: "Street light", correct: false },
        ],
      },
      {
        prompt: "Which place is human-made?",
        options: [
          { label: "Pond", correct: false },
          { label: "Bridge", correct: true },
          { label: "Hill", correct: false },
        ],
      },
      {
        prompt: "What should you do while observing nature?",
        options: [
          { label: "Throw wrappers", correct: false },
          { label: "Notice carefully and stay gentle", correct: true },
          { label: "Pluck all flowers", correct: false },
        ],
      },
    ],
  ),
  "surroundings-sorter": sortGame(
    "surroundings-sorter",
    "Surroundings Sorter",
    "Drag each card into the correct environment group.",
    "Place every card in the right zone before time is up.",
    greenTheme,
    [
      {
        prompt: "Sort natural and human-made things",
        categories: ["Natural", "Human-made"],
        items: [
          { label: "Tree", category: "Natural" },
          { label: "Road", category: "Human-made" },
          { label: "River", category: "Natural" },
          { label: "Bench", category: "Human-made" },
        ],
      },
    ],
  ),
  "food-chain-puzzle-trail": choiceGame(
    "food-chain-puzzle-trail",
    "Food-Chain Puzzle Trail",
    "Follow the energy trail and choose the right food-chain links.",
    "Correct links light up the whole chain.",
    greenTheme,
    [
      {
        prompt: "Who makes food using sunlight?",
        options: [
          { label: "Plant", correct: true },
          { label: "Rabbit", correct: false },
          { label: "Eagle", correct: false },
        ],
      },
      {
        prompt: "Who may eat grass?",
        options: [
          { label: "Deer", correct: true },
          { label: "Tiger", correct: false },
          { label: "Owl", correct: false },
        ],
      },
      {
        prompt: "What could come after a rabbit in a food chain?",
        options: [
          { label: "Fox", correct: true },
          { label: "Leaf", correct: false },
          { label: "Flower pot", correct: false },
        ],
      },
    ],
  ),
  "habitat-match-up": memoryGame(
    "habitat-match-up",
    "Habitat Match-Up",
    "Flip cards and match each animal with its home.",
    "Find pairs quickly to keep the nature meter glowing.",
    greenTheme,
    [
      {
        prompt: "Match each animal to its habitat",
        pairs: [
          { pairId: "fish-pond", left: "Fish", right: "Pond" },
          { pairId: "camel-desert", left: "Camel", right: "Desert" },
          { pairId: "polar-arctic", left: "Polar Bear", right: "Arctic" },
          { pairId: "frog-wetland", left: "Frog", right: "Wetland" },
        ],
      },
    ],
  ),
  "eco-habit-checklist": choiceGame(
    "eco-habit-checklist",
    "Eco Habit Checklist",
    "Pick the best earth-friendly habit on each card.",
    "Smart eco choices earn bright green sparks.",
    greenTheme,
    [
      {
        prompt: "Which habit saves electricity?",
        options: [
          { label: "Leave lights on all day", correct: false },
          { label: "Turn off lights when leaving", correct: true },
          { label: "Open the fridge again and again", correct: false },
        ],
      },
      {
        prompt: "Which habit reduces plastic waste?",
        options: [
          { label: "Use a reusable bottle", correct: true },
          { label: "Throw bottles on the road", correct: false },
          { label: "Use many plastic bags", correct: false },
        ],
      },
      {
        prompt: "Which habit keeps school clean?",
        options: [
          { label: "Use bins properly", correct: true },
          { label: "Drop waste near the stairs", correct: false },
          { label: "Hide wrappers under desks", correct: false },
        ],
      },
    ],
  ),
  "water-saver-sprint": tapGame(
    "water-saver-sprint",
    "Water Saver Sprint",
    "Tap the water-saving habits and skip the wasteful ones.",
    "Fast and careful tapping gives the biggest score.",
    skyTheme,
    [
      {
        prompt: "Tap all actions that save water",
        targets: [
          { label: "Turn off tap", correct: true },
          { label: "Leave hose running", correct: false },
          { label: "Use a bucket", correct: true },
          { label: "Waste water in play", correct: false },
          { label: "Fix leaks", correct: true },
          { label: "Keep tap dripping", correct: false },
        ],
      },
    ],
  ),
  "campus-cleanup-capstone": sortGame(
    "campus-cleanup-capstone",
    "Campus Cleanup Capstone",
    "Sort each piece of school waste into the right bin.",
    "Drag quickly and neatly to finish the cleanup challenge.",
    greenTheme,
    [
      {
        prompt: "Sort waste into dry and wet bins",
        categories: ["Dry", "Wet"],
        items: [
          { label: "Paper", category: "Dry" },
          { label: "Banana Peel", category: "Wet" },
          { label: "Plastic Bottle", category: "Dry" },
          { label: "Leftover Food", category: "Wet" },
        ],
      },
    ],
  ),
  "green-champion-badge-run": choiceGame(
    "green-champion-badge-run",
    "Green Champion Badge Run",
    "Answer green action questions to unlock your champion badge.",
    "Each correct answer fills your badge meter.",
    greenTheme,
    [
      {
        prompt: "Which action helps reduce waste?",
        options: [
          { label: "Reuse notebooks", correct: true },
          { label: "Throw away half-used pages", correct: false },
          { label: "Litter after lunch", correct: false },
        ],
      },
      {
        prompt: "Which transport can be eco-friendlier for short distances?",
        options: [
          { label: "Walking", correct: true },
          { label: "Using a car for every step", correct: false },
          { label: "Burning waste", correct: false },
        ],
      },
      {
        prompt: "What should a green champion encourage?",
        options: [
          { label: "Saving resources", correct: true },
          { label: "Wasting paper", correct: false },
          { label: "Ignoring litter", correct: false },
        ],
      },
    ],
  ),
  "word-garden-starter-pack": tapGame(
    "word-garden-starter-pack",
    "Word Garden Starter Pack",
    "Tap the word petals that match the picture clue.",
    "Correct words make your garden bloom brighter.",
    storyTheme,
    [
      {
        prompt: "Tap the words that are colors",
        targets: [
          { label: "Blue", correct: true },
          { label: "Jump", correct: false },
          { label: "Green", correct: true },
          { label: "Table", correct: false },
          { label: "Yellow", correct: true },
          { label: "Run", correct: false },
        ],
      },
      {
        prompt: "Tap the animal words",
        targets: [
          { label: "Cat", correct: true },
          { label: "Book", correct: false },
          { label: "Bird", correct: true },
          { label: "Chair", correct: false },
          { label: "Fish", correct: true },
          { label: "Pencil", correct: false },
        ],
      },
    ],
  ),
  "picture-clue-match": memoryGame(
    "picture-clue-match",
    "Picture Clue Match",
    "Flip cards and match picture clues with the right words.",
    "Find every pair to fill the clue board with stars.",
    storyTheme,
    [
      {
        prompt: "Match each clue with its word",
        pairs: [
          { pairId: "sun", left: "Bright in the sky", right: "Sun" },
          { pairId: "apple", left: "A red fruit", right: "Apple" },
          { pairId: "book", left: "You read it", right: "Book" },
          { pairId: "shoe", left: "You wear it", right: "Shoe" },
        ],
      },
    ],
  ),
  "story-path": choiceGame(
    "story-path",
    "Story Path",
    "Choose the best answer to keep the story journey moving.",
    "Correct story choices unlock the next scene.",
    storyTheme,
    [
      {
        prompt: "Who is the main character in a story?",
        options: [
          { label: "The person or animal the story follows", correct: true },
          { label: "The page number", correct: false },
          { label: "The cover color", correct: false },
        ],
      },
      {
        prompt: "What do we do after reading a passage carefully?",
        options: [
          { label: "Answer questions from it", correct: true },
          { label: "Guess without reading", correct: false },
          { label: "Skip every line", correct: false },
        ],
      },
      {
        prompt: "Which helps you read with expression?",
        options: [
          { label: "Reading punctuation clues", correct: true },
          { label: "Ignoring every full stop", correct: false },
          { label: "Reading every sentence the same way", correct: false },
        ],
      },
    ],
  ),
  "reading-scene-unlock": choiceGame(
    "reading-scene-unlock",
    "Reading Scene Unlock",
    "Unlock each story scene by answering a reading clue.",
    "Collect three good answers to reveal the whole scene.",
    storyTheme,
    [
      {
        prompt: "If a character is smiling and jumping, how may they feel?",
        options: [
          { label: "Happy", correct: true },
          { label: "Sleepy", correct: false },
          { label: "Lost", correct: false },
        ],
      },
      {
        prompt: "Where do we usually find the title of a story?",
        options: [
          { label: "At the top or beginning", correct: true },
          { label: "Only at the end", correct: false },
          { label: "Inside the page number", correct: false },
        ],
      },
      {
        prompt: "What should you do when a sentence ends with a question mark?",
        options: [
          { label: "Read it like a question", correct: true },
          { label: "Skip it", correct: false },
          { label: "Shout the answer first", correct: false },
        ],
      },
    ],
  ),
  "sentence-builder-workshop": choiceGame(
    "sentence-builder-workshop",
    "Sentence Builder Workshop",
    "Choose the sentence that sounds complete and clear.",
    "Strong sentences give you a shiny builder badge.",
    storyTheme,
    [
      {
        prompt: "Which is a complete sentence?",
        options: [
          { label: "The cat sleeps on the mat.", correct: true },
          { label: "On the mat", correct: false },
          { label: "The cat on", correct: false },
        ],
      },
      {
        prompt: "Which sentence starts with a capital letter?",
        options: [
          { label: "we played outside.", correct: false },
          { label: "We played outside.", correct: true },
          { label: "played outside.", correct: false },
        ],
      },
      {
        prompt: "Which punctuation fits the end of a statement?",
        options: [
          { label: ".", correct: true },
          { label: "?", correct: false },
          { label: "!", correct: false },
        ],
      },
    ],
  ),
  "describe-the-scene": tapGame(
    "describe-the-scene",
    "Describe The Scene",
    "Tap the best describing words for the picture scene.",
    "Choose vivid describing words to paint the scene with color.",
    storyTheme,
    [
      {
        prompt: "Tap words that can describe a sunny garden",
        targets: [
          { label: "Bright", correct: true },
          { label: "Blooming", correct: true },
          { label: "Noisy", correct: false },
          { label: "Colorful", correct: true },
          { label: "Broken", correct: false },
          { label: "Rainy", correct: false },
        ],
      },
    ],
  ),
  "class-spotlight-finale": choiceGame(
    "class-spotlight-finale",
    "Class Spotlight Finale",
    "Prepare for the spotlight by choosing confident speaking moves.",
    "Good speaking choices earn applause stars.",
    storyTheme,
    [
      {
        prompt: "What helps when speaking to a class?",
        options: [
          { label: "Speak clearly", correct: true },
          { label: "Hide your voice", correct: false },
          { label: "Mumble into the floor", correct: false },
        ],
      },
      {
        prompt: "What should you do with your ideas before speaking?",
        options: [
          { label: "Organize them", correct: true },
          { label: "Forget them all", correct: false },
          { label: "Say random words", correct: false },
        ],
      },
      {
        prompt: "How can you show confidence?",
        options: [
          { label: "Stand tall and look ahead", correct: true },
          { label: "Turn away and whisper", correct: false },
          { label: "Rush every word", correct: false },
        ],
      },
    ],
  ),
  "role-play-round": choiceGame(
    "role-play-round",
    "Role-Play Round",
    "Pick the best response in each speaking situation.",
    "Kind and clear choices keep the role-play scene moving.",
    storyTheme,
    [
      {
        prompt: "A friend says hello. What is a polite response?",
        options: [
          { label: "Hello, how are you?", correct: true },
          { label: "Go away", correct: false },
          { label: "I will not answer", correct: false },
        ],
      },
      {
        prompt: "You want to ask for a pencil. What should you say?",
        options: [
          { label: "May I borrow your pencil, please?", correct: true },
          { label: "Give it now", correct: false },
          { label: "I will take it", correct: false },
        ],
      },
      {
        prompt: "Someone helps you. What do you say?",
        options: [
          { label: "Thank you", correct: true },
          { label: "Nothing at all", correct: false },
          { label: "That is your job", correct: false },
        ],
      },
    ],
  ),
};

export function getGameDefinition(gameSlug: string) {
  return gameCatalog[gameSlug];
}
