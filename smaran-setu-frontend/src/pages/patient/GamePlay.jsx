
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  Clock3,
  Eye,
  Hash,
  Image as ImageIcon,
  Search,
  Trophy,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

import { games } from '../../data/games'
import Button from '../../components/common/Button'

/* =========================================================
   SETTINGS
========================================================= */

const LEVEL_STORAGE_KEY = 'gameLevels'
const RESULTS_STORAGE_KEY = 'gameResults'

const MAX_LEVEL = 20
const QUESTIONS_PER_GAME = 5

/* =========================================================
   LEVEL HELPERS
========================================================= */

function getGameLevels() {
  try {
    const saved = localStorage.getItem(LEVEL_STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function getGameLevel(gameId) {
  const levels = getGameLevels()
  const level = Number(levels[gameId])

  if (!Number.isFinite(level)) {
    return 1
  }

  return Math.min(MAX_LEVEL, Math.max(1, level))
}

function saveGameLevel(gameId, level) {
  const levels = getGameLevels()

  levels[gameId] = Math.min(
    MAX_LEVEL,
    Math.max(1, Number(level) || 1)
  )

  localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(levels))

  return levels[gameId]
}

function calculateNextLevel(level, score) {
  if (score >= 80) {
    return Math.min(MAX_LEVEL, level + 1)
  }

  if (score < 50) {
    return Math.max(1, level - 1)
  }

  return level
}

function updatePlayerLevel(gameId, level, score) {
  const nextLevel = calculateNextLevel(level, score)

  saveGameLevel(gameId, nextLevel)

  return nextLevel
}

function getLevelName(level) {
  if (level <= 3) return 'Beginner'
  if (level <= 6) return 'Easy'
  if (level <= 10) return 'Medium'
  if (level <= 14) return 'Hard'
  if (level <= 17) return 'Expert'
  return 'Master'
}

/* =========================================================
   RESULT HELPERS
========================================================= */

function getStoredResults() {
  try {
    const saved = localStorage.getItem(RESULTS_STORAGE_KEY)

    if (!saved) {
      return []
    }

    const parsed = JSON.parse(saved)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveGameResult(result) {
  const results = getStoredResults()

  results.unshift(result)

  localStorage.setItem(
    RESULTS_STORAGE_KEY,
    JSON.stringify(results)
  )
}

function createQuestionGameResult({
  game,
  correctAnswers,
  totalQuestions,
  playedLevel,
  nextLevel,
}) {
  const score =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0

  return {
    gameId: game.id,
    game: game.title,
    gameType: game.type,
    correctAnswers,
    totalQuestions,
    score,
    level: playedLevel,
    levelName: getLevelName(playedLevel),
    nextLevel,
    nextLevelName: getLevelName(nextLevel),
    levelUp: nextLevel > playedLevel,
    levelDown: nextLevel < playedLevel,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
  }
}

/* =========================================================
   RANDOM HELPERS
========================================================= */

function shuffleArray(array) {
  const copy = [...array]

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

function randomItem(array) {
  if (!array || array.length === 0) {
    return null
  }

  return array[Math.floor(Math.random() * array.length)]
}

/* =========================================================
   LEVEL BADGE
========================================================= */

function LevelBadge({ level }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#fff4df] px-4 py-2 text-sm font-black text-[#a96f1c]">
      <Trophy size={16} />
      Level {level} · {getLevelName(level)}
    </div>
  )
}

/* =========================================================
   OBJECT TILE
========================================================= */

function ObjectTile({
  emoji,
  label,
  className = '',
}) {
  return (
    <div
      role="img"
      aria-label={label || 'picture'}
      className={`flex items-center justify-center bg-gradient-to-br from-[#e8f4f2] to-[#fff4df] ${className}`}
    >
      <span
        className="select-none leading-none"
        style={{
          fontSize: 'clamp(2rem, 18vw, 4.5rem)',
        }}
      >
        {emoji || '🖼️'}
      </span>
    </div>
  )
}

/* =========================================================
   EMOJI BANK
========================================================= */

const GAME_EMOJI = {
  Apple: '🍎',
  Banana: '🍌',
  Orange: '🍊',
  Grapes: '🍇',
  Strawberry: '🍓',
  Watermelon: '🍉',
  Lemon: '🍋',
  Pineapple: '🍍',
  Mango: '🥭',
  Peach: '🍑',
  Pear: '🍐',
  Coconut: '🥥',

  Tomato: '🍅',
  Carrot: '🥕',
  Potato: '🥔',
  Broccoli: '🥦',
  Corn: '🌽',
  Onion: '🧅',
  Pepper: '🌶️',
  Cucumber: '🥒',

  Dog: '🐶',
  Cat: '🐱',
  Rabbit: '🐰',
  Fox: '🦊',
  Horse: '🐴',
  Cow: '🐄',
  Elephant: '🐘',
  Lion: '🦁',
  Tiger: '🐯',
  Deer: '🦌',
  Monkey: '🐵',
  Panda: '🐼',
  Penguin: '🐧',
  Bear: '🐻',
  Giraffe: '🦒',
  Zebra: '🦓',
  Parrot: '🦜',
  Eagle: '🦅',
  Butterfly: '🦋',
  Fish: '🐟',

  Flower: '🌸',
  Rose: '🌹',
  Sunflower: '🌻',
  Tulip: '🌷',
  Tree: '🌳',
  Leaf: '🍃',
  Plant: '🪴',
  Mountain: '⛰️',
  Beach: '🏖️',
  Lake: '🏞️',
  PlantPot: '🪴',

  Car: '🚗',
  Bus: '🚌',
  Bicycle: '🚲',
  Truck: '🚚',
  Van: '🚐',
  Motorcycle: '🏍️',
  Train: '🚆',
  Airplane: '✈️',
  Boat: '⛵',
  Scooter: '🛵',

  Cup: '🥤',
  Mug: '☕',
  Glass: '🥛',
  Bottle: '🍼',
  Plate: '🍽️',
  Spoon: '🥄',
  Fork: '🍴',
  Chair: '🪑',
  Table: '🛋️',
  Lamp: '💡',
  Clock: '🕐',
  Mirror: '🪞',
  Pillow: '💤',
  Candle: '🕯️',
  Vase: '🏺',
  Key: '🔑',
  Umbrella: '☂️',

  Book: '📖',
  Notebook: '📓',
  Magazine: '📔',
  Newspaper: '📰',
  Pen: '🖊️',
  Pencil: '✏️',
  Scissors: '✂️',
  Backpack: '🎒',

  Shoe: '👟',
  Sock: '🧦',
  Slipper: '🥿',
  Boot: '🥾',
  Hat: '🎩',
  Shirt: '👕',
  Jacket: '🧥',
  Scarf: '🧣',

  Ball: '🏐',
  Football: '🏈',
  Basketball: '🏀',
  Tennis: '🎾',
  Baseball: '⚾',
  Guitar: '🎸',
  Piano: '🎹',

  Phone: '📱',
  Laptop: '💻',
  Keyboard: '⌨️',
  Camera: '📷',
  Headphones: '🎧',
  Television: '📺',

  Comb: '🪮',
  Toothbrush: '🪥',
  Soap: '🧼',
  Towel: '🧖',
  Basket: '🧺',
  Suitcase: '🧳',
  Wallet: '👛',
  Sunglasses: '🕶️',
  Watch: '⌚',
  Ring: '💍',

  House: '🏠',
  Sofa: '🛋️',
  Bed: '🛏️',
  Door: '🚪',
  Window: '🪟',
  Carpet: '🟫',

  Kettle: '🫖',
  Pan: '🍳',
  Pot: '🍲',
  Bowl: '🥣',
  Coffee: '☕',

  Hammer: '🔨',
  Toolbox: '🧰',

  Toothpaste: '🦷',
  Milk: '🥛',
  Bread: '🍞',
  Butter: '🧈',
  Salt: '🧂',
  PepperShaker: '🫙',
  Lock: '🔒',
  Chain: '⛓️',
  Needle: '🪡',
  Thread: '🧵',
  Brush: '🖌️',
  Paint: '🎨',
}

/* =========================================================
   OBJECT CATEGORIES
========================================================= */

const OBJECT_CATEGORIES = {
  fruit: [
    'Apple',
    'Banana',
    'Orange',
    'Grapes',
    'Strawberry',
    'Watermelon',
    'Lemon',
    'Pineapple',
    'Mango',
    'Peach',
    'Pear',
    'Coconut',
  ],

  vegetable: [
    'Tomato',
    'Carrot',
    'Potato',
    'Broccoli',
    'Corn',
    'Onion',
    'Pepper',
    'Cucumber',
  ],

  animal: [
    'Dog',
    'Cat',
    'Rabbit',
    'Fox',
    'Horse',
    'Cow',
    'Elephant',
    'Lion',
    'Tiger',
    'Deer',
    'Monkey',
    'Panda',
    'Penguin',
    'Bear',
    'Giraffe',
    'Zebra',
    'Parrot',
    'Eagle',
    'Butterfly',
    'Fish',
  ],

  vehicle: [
    'Car',
    'Bus',
    'Bicycle',
    'Truck',
    'Van',
    'Motorcycle',
    'Train',
    'Airplane',
    'Boat',
    'Scooter',
  ],

  household: [
    'Cup',
    'Mug',
    'Glass',
    'Bottle',
    'Plate',
    'Spoon',
    'Fork',
    'Chair',
    'Table',
    'Lamp',
    'Clock',
    'Mirror',
    'Pillow',
    'Candle',
    'Vase',
    'Key',
    'Umbrella',
  ],

  school: [
    'Book',
    'Notebook',
    'Magazine',
    'Newspaper',
    'Pen',
    'Pencil',
    'Scissors',
    'Backpack',
  ],

  clothing: [
    'Shoe',
    'Sock',
    'Slipper',
    'Boot',
    'Hat',
    'Shirt',
    'Jacket',
    'Scarf',
  ],

  sports: [
    'Ball',
    'Football',
    'Basketball',
    'Tennis',
    'Baseball',
    'Guitar',
    'Piano',
  ],

  technology: [
    'Phone',
    'Laptop',
    'Keyboard',
    'Camera',
    'Headphones',
    'Television',
  ],

  personal: [
    'Comb',
    'Toothbrush',
    'Soap',
    'Towel',
    'Basket',
    'Suitcase',
    'Wallet',
    'Sunglasses',
    'Watch',
    'Ring',
  ],

  home: [
    'House',
    'Sofa',
    'Bed',
    'Door',
    'Window',
    'Carpet',
  ],

  kitchen: [
    'Kettle',
    'Pan',
    'Pot',
    'Bowl',
    'Coffee',
  ],

  tools: [
    'Hammer',
    'Toolbox',
  ],

  nature: [
    'Flower',
    'Rose',
    'Sunflower',
    'Tulip',
    'Tree',
    'Leaf',
    'Plant',
    'Mountain',
    'Beach',
    'Lake',
    'PlantPot',
  ],
}

const ALL_OBJECTS = Object.keys(GAME_EMOJI)

/* =========================================================
   OBJECT HELPERS
========================================================= */

function getObjectCategory(objectName) {
  for (const [category, objects] of Object.entries(
    OBJECT_CATEGORIES
  )) {
    if (objects.includes(objectName)) {
      return category
    }
  }

  return 'object'
}

/* =========================================================
   RIDDLE QUESTIONS
========================================================= */

const OBJECT_RIDDLES = {
  Mango:
    "Which fruit is famously called the 'king of fruits'?",

  Pineapple:
    'Which fruit wears a spiky crown and has tough, bumpy skin?',

  Watermelon:
    'Which fruit is mostly water, with a green rind and pink flesh inside?',

  Lemon:
    'Which sour yellow fruit is often squeezed to make a refreshing drink?',

  Coconut:
    'Which fruit grows on tall palm trees and hides milk inside a hard brown shell?',

  Elephant:
    'Which is the largest land animal, known for its long trunk?',

  Lion:
    "Which animal is known as the 'king of the jungle'?",

  Tiger:
    'Which big cat has orange fur with black stripes?',

  Giraffe:
    'Which animal has the longest neck of any land animal?',

  Zebra:
    'Which animal looks like a horse but has black and white stripes?',

  Penguin:
    'Which bird cannot fly but is an excellent swimmer in cold places?',

  Eagle:
    'Which bird is famous for its sharp eyesight and powerful flight?',

  Butterfly:
    'Which insect starts life as a caterpillar and grows colorful wings?',

  Fox:
    'Which clever animal has a bushy tail and is known for outsmarting others?',

  Panda:
    'Which black-and-white animal spends most of its day eating bamboo?',

  Rabbit:
    'Which animal has long ears and loves to hop around?',

  Rose:
    'Which flower is a symbol of love but has thorns on its stem?',

  Sunflower:
    'Which tall yellow flower turns to follow the sun?',

  Tulip:
    'Which cup-shaped flower blooms in spring and is famous in the Netherlands?',

  Airplane:
    'Which vehicle flies through the sky on long journeys?',

  Train:
    'Which vehicle runs on tracks and can pull many carriages?',

  Bicycle:
    'Which two-wheeled vehicle needs pedaling to move?',

  Umbrella:
    'Which object keeps you dry when it rains?',

  Clock:
    'Which object has hands and tells you the time?',

  Key:
    'Which small object is used to lock and unlock a door?',

  Guitar:
    'Which musical instrument has strings and is played by strumming?',

  Piano:
    'Which musical instrument has black and white keys?',

  Camera:
    'Which device is used to take pictures?',

  Headphones:
    'Which device do you wear on your ears to listen to music?',

  Toothbrush:
    'Which object do you use every morning and night to clean your teeth?',

  Backpack:
    'Which item do you carry on your back, filled with books, to school?',

  Scissors:
    'Which tool has two blades and is used to cut paper?',

  Hammer:
    'Which tool is used to hit nails into wood?',
}

const OBJECT_QUESTION_STYLES = {
  1: [
    (name) => `Which picture shows the ${name.toLowerCase()}?`,
    (name) => `Can you find the ${name.toLowerCase()}?`,
    (name) => `Where is the ${name.toLowerCase()}?`,
    (name) => `Tap the ${name.toLowerCase()}.`,
    (name) => `Find the ${name.toLowerCase()}.`,
  ],

  2: [
    (name) => `Which image is the ${name.toLowerCase()}?`,
    (name) => `Can you spot the ${name.toLowerCase()}?`,
    (name) =>
      `Look carefully and find the ${name.toLowerCase()}.`,
    (name) =>
      `Choose the picture of the ${name.toLowerCase()}.`,
    (name) =>
      `Which picture belongs to the name ${name.toLowerCase()}?`,
  ],

  3: [
    (name) => `Which picture shows the ${name.toLowerCase()}?`,
    (name, category) =>
      `Can you recognize this ${category} item: ${name.toLowerCase()}?`,
    (name, category) =>
      `Which image matches the ${category} called ${name.toLowerCase()}?`,
    (name, category) =>
      `Identify the ${category}: ${name.toLowerCase()}.`,
    (name) =>
      `Which picture correctly represents ${name.toLowerCase()}?`,
  ],

  4: [
    (name, category) =>
      `Look carefully. Which picture represents the ${category} item ${name.toLowerCase()}?`,
    (name) =>
      `Among these pictures, can you identify the ${name.toLowerCase()}?`,
    (name) =>
      `Which image correctly matches ${name.toLowerCase()}?`,
    (name) =>
      `Observe all the pictures. Find the ${name.toLowerCase()}.`,
    (name) =>
      `Which picture should be selected for ${name.toLowerCase()}?`,
  ],

  5: [
    (name) =>
      `Use your memory and identify the ${name.toLowerCase()}.`,
    (name) =>
      `Look at all the pictures carefully. Which one is the ${name.toLowerCase()}?`,
    (name) =>
      `Which image correctly represents the object named ${name.toLowerCase()}?`,
    (name) =>
      `Take your time. Can you recognize the ${name.toLowerCase()}?`,
    (name) =>
      `Which picture best matches ${name.toLowerCase()}?`,
    (name) =>
      `Can you distinguish the ${name.toLowerCase()} from the other pictures?`,
  ],
}

const RIDDLE_CHANCE_BY_LEVEL = (level) => {
  if (level <= 3) return 0
  if (level <= 6) return 0.2
  if (level <= 9) return 0.4
  if (level <= 12) return 0.6
  if (level <= 16) return 0.8

  return 1
}

function getObjectOptionCount(level) {
  if (level <= 3) return 4
  if (level <= 7) return 5
  if (level <= 12) return 6
  if (level <= 16) return 7

  return 8
}

function createObjectQuestion(level, usedObjects = []) {
  const availableTargets = ALL_OBJECTS.filter(
    (name) => !usedObjects.includes(name)
  )

  const objectName =
    randomItem(availableTargets) ||
    randomItem(ALL_OBJECTS)

  const category = getObjectCategory(objectName)

  const riddle = OBJECT_RIDDLES[objectName]

  const riddleChance =
    RIDDLE_CHANCE_BY_LEVEL(level)

  const useRiddle =
    Boolean(riddle) &&
    Math.random() < riddleChance

  let question

  if (useRiddle) {
    question = riddle
  } else {
    const styleKey = Math.min(
      5,
      Math.ceil(level / 4)
    )

    const styles =
      OBJECT_QUESTION_STYLES[styleKey] ||
      OBJECT_QUESTION_STYLES[1]

    const questionGenerator =
      randomItem(styles)

    question =
      questionGenerator(
        objectName,
        category
      )
  }

  const optionCount =
    getObjectOptionCount(level)

  const distractorCount =
    optionCount - 1

  const sameCategory =
    OBJECT_CATEGORIES[category] || []

  let distractorPool

  if (level >= 12) {
    distractorPool = [
      ...sameCategory,
      ...sameCategory,
      ...sameCategory,
      ...ALL_OBJECTS,
    ]
  } else if (level >= 8) {
    distractorPool = [
      ...sameCategory,
      ...sameCategory,
      ...ALL_OBJECTS,
    ]
  } else if (level >= 4) {
    distractorPool = [
      ...sameCategory,
      ...ALL_OBJECTS,
    ]
  } else {
    distractorPool = [...ALL_OBJECTS]
  }

  const uniquePool = [
    ...new Set(
      distractorPool.filter(
        (name) => name !== objectName
      )
    ),
  ]

  let distractors = shuffleArray(
    uniquePool
  ).slice(0, distractorCount)

  if (
    distractors.length <
    distractorCount
  ) {
    const backup =
      ALL_OBJECTS.filter(
        (name) =>
          name !== objectName &&
          !distractors.includes(name)
      )

    distractors = [
      ...distractors,
      ...shuffleArray(
        backup
      ).slice(
        0,
        distractorCount -
          distractors.length
      ),
    ]
  }

  const options = shuffleArray([
    objectName,
    ...distractors,
  ])

  return {
    objectName,
    category,
    question,
    answer: objectName,
    options,
  }
}

function createObjectGameQuestions(level) {
  const questions = []
  const usedObjects = []

  let attempts = 0

  while (
    questions.length <
      QUESTIONS_PER_GAME &&
    attempts < 100
  ) {
    attempts += 1

    const question =
      createObjectQuestion(
        level,
        usedObjects
      )

    if (
      !usedObjects.includes(
        question.objectName
      )
    ) {
      usedObjects.push(
        question.objectName
      )

      questions.push(question)
    }
  }

  return questions
}

/* =========================================================
   PICTURE RECALL
========================================================= */

function getPictureCount(level) {
  if (level <= 2) return 1
  if (level <= 4) return 2
  if (level <= 7) return 3
  if (level <= 10) return 4
  if (level <= 13) return 5
  if (level <= 16) return 6
  if (level <= 18) return 7

  return 8
}

function getPictureMemorizeTime(level) {
  if (level <= 3) return 6
  if (level <= 6) return 5
  if (level <= 10) return 4
  if (level <= 14) return 3
  if (level <= 17) return 2.5

  return 2
}

function getPictureOptionCount(level) {
  if (level <= 5) return 4
  if (level <= 11) return 5
  if (level <= 16) return 6

  return 7
}

const PICTURE_POOL = [
  'Apple',
  'Banana',
  'Orange',
  'Grapes',
  'Strawberry',
  'Watermelon',
  'Lemon',
  'Pineapple',
  'Mango',
  'Peach',
  'Dog',
  'Cat',
  'Rabbit',
  'Fox',
  'Horse',
  'Cow',
  'Elephant',
  'Lion',
  'Tiger',
  'Deer',
  'Monkey',
  'Panda',
  'Penguin',
  'Bear',
  'Giraffe',
  'Zebra',
  'Car',
  'Bus',
  'Bicycle',
  'Truck',
  'Train',
  'Airplane',
  'Boat',
  'Flower',
  'Rose',
  'Sunflower',
  'Tulip',
  'Tree',
  'House',
  'Book',
  'Cup',
  'Chair',
  'Shoe',
  'Hat',
  'Ball',
  'Phone',
  'Laptop',
  'Camera',
  'Key',
  'Clock',
  'Umbrella',
]

function createPictureRecallQuestions(level) {
  const pictureCount =
    getPictureCount(level)

  const optionCount =
    getPictureOptionCount(level)

  const questions = []

  const usedSets = new Set()

  for (
    let q = 0;
    q < QUESTIONS_PER_GAME;
    q += 1
  ) {
    let attempts = 0
    let shown = []
    let key = ''

    while (attempts < 50) {
      attempts += 1

      const pool =
        shuffleArray(
          PICTURE_POOL
        )

      shown =
        pool.slice(
          0,
          pictureCount
        )

      key =
        shown
          .slice()
          .sort()
          .join('|')

      if (
        !usedSets.has(key)
      ) {
        break
      }
    }

    usedSets.add(key)

    const answer =
      randomItem(shown)

    const distractorPool =
      PICTURE_POOL.filter(
        (name) =>
          !shown.includes(name)
      )

    const distractorCount =
      optionCount - 1

    const distractors =
      shuffleArray(
        distractorPool
      ).slice(0, distractorCount)

    const options =
      shuffleArray([
        answer,
        ...distractors,
      ])

    let questionText =
      'Which picture did you see?'

    if (pictureCount > 1) {
      questionText =
        `Which of these pictures was among the ${pictureCount} you just saw?`
    }

    questions.push({
      shown,
      answer,
      question: questionText,
      options,
      emojis: shown.map(
        (name) =>
          GAME_EMOJI[name]
      ),
    })
  }

  return questions
}

/* =========================================================
   VISUAL MEMORY PATTERN RECOGNITION
========================================================= */

const MEMORY_PATTERNS = [
  /* -------------------------
     EASY AB PATTERNS
  ------------------------- */

  {
    sequence: ['Apple', 'Banana', 'Apple'],
    answer: 'Banana',
    distractors: [
      'Orange',
      'Grapes',
      'Lemon',
    ],
    rule: 'AB pattern',
  },

  {
    sequence: ['Dog', 'Ball', 'Dog'],
    answer: 'Ball',
    distractors: [
      'Cat',
      'Shoe',
      'Hat',
    ],
    rule: 'AB pattern',
  },

  {
    sequence: ['Cat', 'Fish', 'Cat'],
    answer: 'Fish',
    distractors: [
      'Dog',
      'Rabbit',
      'Bird',
    ],
    rule: 'AB pattern',
  },

  {
    sequence: [
      'Sunflower',
      'Butterfly',
      'Sunflower',
    ],
    answer: 'Butterfly',
    distractors: [
      'Rose',
      'Tree',
      'Flower',
    ],
    rule: 'AB pattern',
  },

  {
    sequence: ['Car', 'Key', 'Car'],
    answer: 'Key',
    distractors: [
      'Wheel',
      'Bus',
      'Door',
    ],
    rule: 'AB pattern',
  },

  {
    sequence: ['Shoe', 'Sock', 'Shoe'],
    answer: 'Sock',
    distractors: [
      'Hat',
      'Boot',
      'Shirt',
    ],
    rule: 'AB pattern',
  },

  {
    sequence: ['Cup', 'Spoon', 'Cup'],
    answer: 'Spoon',
    distractors: [
      'Plate',
      'Fork',
      'Bowl',
    ],
    rule: 'AB pattern',
  },

  {
    sequence: ['Book', 'Pen', 'Book'],
    answer: 'Pen',
    distractors: [
      'Pencil',
      'Paper',
      'Notebook',
    ],
    rule: 'AB pattern',
  },

  {
    sequence: ['Flower', 'Vase', 'Flower'],
    answer: 'Vase',
    distractors: [
      'Tree',
      'Pot',
      'Rose',
    ],
    rule: 'AB pattern',
  },

  {
    sequence: ['Phone', 'Laptop', 'Phone'],
    answer: 'Laptop',
    distractors: [
      'Camera',
      'Television',
      'Keyboard',
    ],
    rule: 'AB pattern',
  },

  /* -------------------------
     ABC PATTERNS
  ------------------------- */

  {
    sequence: [
      'Apple',
      'Banana',
      'Orange',
      'Apple',
    ],
    answer: 'Banana',
    distractors: [
      'Grapes',
      'Lemon',
      'Mango',
    ],
    rule: 'ABC repeating pattern',
  },

  {
    sequence: [
      'Dog',
      'Cat',
      'Rabbit',
      'Dog',
    ],
    answer: 'Cat',
    distractors: [
      'Fox',
      'Horse',
      'Fish',
    ],
    rule: 'ABC repeating pattern',
  },

  {
    sequence: [
      'Car',
      'Bus',
      'Train',
      'Car',
    ],
    answer: 'Bus',
    distractors: [
      'Truck',
      'Bicycle',
      'Airplane',
    ],
    rule: 'ABC repeating pattern',
  },

  {
    sequence: [
      'Rose',
      'Tulip',
      'Sunflower',
      'Rose',
    ],
    answer: 'Tulip',
    distractors: [
      'Flower',
      'Tree',
      'Leaf',
    ],
    rule: 'ABC repeating pattern',
  },

  {
    sequence: [
      'Book',
      'Pen',
      'Pencil',
      'Book',
    ],
    answer: 'Pen',
    distractors: [
      'Paper',
      'Scissors',
      'Notebook',
    ],
    rule: 'ABC repeating pattern',
  },

  {
    sequence: [
      'Apple',
      'Banana',
      'Orange',
      'Banana',
      'Apple',
    ],
    answer: 'Banana',
    distractors: [
      'Grapes',
      'Mango',
      'Lemon',
    ],
    rule: 'Mirror pattern',
  },

  {
    sequence: [
      'Dog',
      'Cat',
      'Rabbit',
      'Cat',
      'Dog',
    ],
    answer: 'Cat',
    distractors: [
      'Fox',
      'Fish',
      'Horse',
    ],
    rule: 'Mirror pattern',
  },

  {
    sequence: [
      'Car',
      'Bus',
      'Train',
      'Bus',
      'Car',
    ],
    answer: 'Bus',
    distractors: [
      'Truck',
      'Bicycle',
      'Airplane',
    ],
    rule: 'Mirror pattern',
  },

  /* -------------------------
     REPEATING PATTERNS
  ------------------------- */

  {
    sequence: [
      'Apple',
      'Banana',
      'Apple',
      'Banana',
      'Apple',
    ],
    answer: 'Banana',
    distractors: [
      'Orange',
      'Grapes',
      'Mango',
    ],
    rule: 'Repeating pattern',
  },

  {
    sequence: [
      'Dog',
      'Cat',
      'Dog',
      'Cat',
      'Dog',
    ],
    answer: 'Cat',
    distractors: [
      'Rabbit',
      'Fox',
      'Horse',
    ],
    rule: 'Repeating pattern',
  },

  {
    sequence: [
      'Car',
      'Bus',
      'Car',
      'Bus',
      'Car',
    ],
    answer: 'Bus',
    distractors: [
      'Train',
      'Truck',
      'Bicycle',
    ],
    rule: 'Repeating pattern',
  },

  {
    sequence: [
      'Book',
      'Pen',
      'Book',
      'Pen',
      'Book',
    ],
    answer: 'Pen',
    distractors: [
      'Pencil',
      'Paper',
      'Notebook',
    ],
    rule: 'Repeating pattern',
  },

  {
    sequence: [
      'Shoe',
      'Sock',
      'Shoe',
      'Sock',
      'Shoe',
    ],
    answer: 'Sock',
    distractors: [
      'Hat',
      'Boot',
      'Shirt',
    ],
    rule: 'Repeating pattern',
  },

  {
    sequence: [
      'Cup',
      'Spoon',
      'Cup',
      'Spoon',
      'Cup',
    ],
    answer: 'Spoon',
    distractors: [
      'Plate',
      'Fork',
      'Bowl',
    ],
    rule: 'Repeating pattern',
  },
]

function getPatternDifficulty(level) {
  if (level <= 4) {
    return 'easy'
  }

  if (level <= 8) {
    return 'medium'
  }

  if (level <= 14) {
    return 'hard'
  }

  return 'expert'
}

function getPatternOptionCount(level) {
  if (level <= 6) return 4
  if (level <= 12) return 5
  if (level <= 17) return 6

  return 7
}

function createPatternQuestions(level) {
  const questions = []

  const difficulty =
    getPatternDifficulty(level)

  const optionCount =
    getPatternOptionCount(level)

  let patternPool = MEMORY_PATTERNS

  /* Beginner: Short visual patterns only */
  if (difficulty === 'easy') {
    patternPool =
      MEMORY_PATTERNS.filter(
        (pattern) =>
          pattern.sequence.length <= 3
      )
  }

  /* Medium: Short + medium patterns */
  if (difficulty === 'medium') {
    patternPool =
      MEMORY_PATTERNS.filter(
        (pattern) =>
          pattern.sequence.length <= 4
      )
  }

  /* Hard: Prefer medium+long patterns */
  if (difficulty === 'hard') {
    patternPool =
      MEMORY_PATTERNS.filter(
        (pattern) =>
          pattern.sequence.length >= 3
      )
  }

  /* Expert: Prefer longest / most complex patterns */
  if (difficulty === 'expert') {
    patternPool =
      MEMORY_PATTERNS.filter(
        (pattern) =>
          pattern.sequence.length >= 4
      )

    // Fallback if filter is too strict
    if (patternPool.length < 5) {
      patternPool = MEMORY_PATTERNS
    }
  }

  const usedPatterns = new Set()

  let attempts = 0

  while (
    questions.length <
      QUESTIONS_PER_GAME &&
    attempts < 100
  ) {
    attempts += 1

    const available =
      patternPool.filter(
        (pattern) =>
          !usedPatterns.has(
            pattern.sequence.join('-')
          )
      )

    const pool =
      available.length > 0
        ? available
        : patternPool

    const item =
      randomItem(pool)

    if (!item) {
      break
    }

    const patternKey =
      item.sequence.join('-')

    if (
      usedPatterns.has(patternKey)
    ) {
      continue
    }

    usedPatterns.add(patternKey)

    // Build options: start with answer + given distractors, then add extra similar items if needed for higher levels
    let options = [
      item.answer,
      ...item.distractors,
    ]

    if (options.length < optionCount) {
      const extraPool = ALL_OBJECTS.filter(
        (name) =>
          name !== item.answer &&
          !options.includes(name)
      )

      const needed =
        optionCount - options.length

      options = [
        ...options,
        ...shuffleArray(extraPool).slice(0, needed),
      ]
    }

    // Cap to the desired option count and shuffle
    options = shuffleArray(
      options.slice(0, optionCount)
    )

    questions.push({
      type: 'memory-pattern',
      sequence: item.sequence,
      answer: item.answer,
      options,
      rule: item.rule,
    })
  }

  return questions
}

/* =========================================================
   QUESTION TIMER
========================================================= */

function getQuestionTime(level) {
  if (level <= 3) return 25
  if (level <= 6) return 20
  if (level <= 9) return 16
  if (level <= 12) return 13
  if (level <= 15) return 11
  if (level <= 18) return 9

  return 7
}

/* =========================================================
   ICON MAP
========================================================= */

const ICON_MAP = {
  picture: ImageIcon,
  number: Brain,
  object: Search,
  memory: Brain,
  pattern: Brain,
}

/* =========================================================
   MAIN GAME PLAY
========================================================= */

export default function GamePlay() {
  const { gameId } = useParams()
  const navigate = useNavigate()

  const game = games.find(
    (item) => item.id === gameId
  )

  if (!game) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <h1 className="text-3xl font-black text-[#17345f]">
          Game not found
        </h1>

        <Button
          className="mt-6"
          onClick={() =>
            navigate('/user/games')
          }
        >
          Back to games
        </Button>
      </div>
    )
  }

  if (game.type === 'memory') {
    return (
      <RealMemoryMatch
        game={game}
        navigate={navigate}
      />
    )
  }

  if (game.type === 'picture') {
    return (
      <PictureRecall
        game={game}
        navigate={navigate}
      />
    )
  }

  return (
    <QuestionGame
      game={game}
      navigate={navigate}
    />
  )
}

/* =========================================================
   MEMORY MATCH
========================================================= */

function getMemoryPairCount(level) {
  if (level <= 2) return 4
  if (level <= 4) return 5
  if (level <= 6) return 6
  if (level <= 8) return 7
  if (level <= 10) return 8
  if (level <= 12) return 9
  if (level <= 14) return 10
  if (level <= 16) return 11
  if (level <= 18) return 12

  return 13
}

function getMemoryPreviewTime(level) {
  if (level <= 3) return 5
  if (level <= 6) return 4
  if (level <= 9) return 3.5
  if (level <= 12) return 3
  if (level <= 15) return 2.5
  if (level <= 18) return 2

  return 1.5
}

const MEMORY_CARD_POOL = [
  'Apple',
  'Cup',
  'Dog',
  'Car',
  'Book',
  'Flower',
  'Bicycle',
  'Tree',
  'Banana',
  'Shoe',
  'Bottle',
  'Ball',
  'Cat',
  'Chair',
  'Key',
  'Clock',
  'Orange',
  'Hat',
  'Phone',
  'Lamp',
  'Grapes',
  'Rabbit',
  'Train',
  'Rose',
]

function RealMemoryMatch({
  game,
  navigate,
}) {
  const level =
    getGameLevel(game.id)

  const pairCount =
    getMemoryPairCount(level)

  const previewTime =
    getMemoryPreviewTime(level)

  const pairNames = useMemo(() => {
    return shuffleArray(
      MEMORY_CARD_POOL
    ).slice(
      0,
      pairCount
    )
  }, [level, pairCount])

  const createCards = () => {
    const cards =
      pairNames.flatMap(
        (name, index) => [
          {
            id: `${name}-1-${index}`,
            name,
            emoji:
              GAME_EMOJI[name],
          },

          {
            id: `${name}-2-${index}`,
            name,
            emoji:
              GAME_EMOJI[name],
          },
        ]
      )

    return shuffleArray(cards)
  }

  const [cards, setCards] =
    useState(createCards)

  const [flipped, setFlipped] =
    useState([])

  const [matched, setMatched] =
    useState([])

  const [moves, setMoves] =
    useState(0)

  const [processing, setProcessing] =
    useState(false)

  const [hasFinished, setHasFinished] =
    useState(false)

  const [isPreviewing, setIsPreviewing] =
    useState(true)

  const [previewCountdown, setPreviewCountdown] =
    useState(
      Math.ceil(previewTime)
    )

  useEffect(() => {
    setCards(createCards())
    setFlipped([])
    setMatched([])
    setMoves(0)
    setProcessing(false)
    setHasFinished(false)
    setIsPreviewing(true)
    setPreviewCountdown(
      Math.ceil(previewTime)
    )
  }, [level])

  useEffect(() => {
    if (!isPreviewing) {
      return undefined
    }

    if (previewCountdown <= 0) {
      setIsPreviewing(false)

      return undefined
    }

    const timer = setTimeout(() => {
      setPreviewCountdown(
        (previous) =>
          previous - 1
      )
    }, 1000)

    return () =>
      clearTimeout(timer)
  }, [
    isPreviewing,
    previewCountdown,
  ])

  useEffect(() => {
    if (
      matched.length ===
        cards.length &&
      cards.length > 0
    ) {
      setHasFinished(true)
    }
  }, [
    matched,
    cards.length,
  ])

  const handleCardClick = (
    cardId
  ) => {
    if (isPreviewing) return
    if (processing) return
    if (flipped.length >= 2) return
    if (flipped.includes(cardId)) return
    if (matched.includes(cardId)) return

    const newFlipped = [
      ...flipped,
      cardId,
    ]

    setFlipped(newFlipped)

    if (newFlipped.length !== 2) {
      return
    }

    setProcessing(true)

    setMoves(
      (previous) =>
        previous + 1
    )

    const first =
      cards.find(
        (card) =>
          card.id ===
          newFlipped[0]
      )

    const second =
      cards.find(
        (card) =>
          card.id ===
          newFlipped[1]
      )

    if (
      first &&
      second &&
      first.name === second.name
    ) {
      setTimeout(() => {
        setMatched(
          (previous) => [
            ...previous,
            first.id,
            second.id,
          ]
        )

        setFlipped([])
        setProcessing(false)
      }, 500)
    } else {
      setTimeout(() => {
        setFlipped([])
        setProcessing(false)
      }, 900)
    }
  }

  const restartGame = () => {
    setCards(createCards())
    setFlipped([])
    setMatched([])
    setMoves(0)
    setProcessing(false)
    setHasFinished(false)
    setIsPreviewing(true)
    setPreviewCountdown(
      Math.ceil(previewTime)
    )
  }

  const score = hasFinished
    ? Math.min(
        100,
        Math.round(
          (pairNames.length /
            Math.max(
              moves,
              pairNames.length
            )) *
            100
        )
      )
    : 0

  const finishGame = () => {
    const nextLevel =
      updatePlayerLevel(
        game.id,
        level,
        score
      )

    const result = {
      gameId: game.id,
      game: game.title,
      gameType: game.type,
      score,
      moves,
      totalPairs:
        pairNames.length,
      level,
      levelName:
        getLevelName(level),
      nextLevel,
      nextLevelName:
        getLevelName(nextLevel),
      levelUp:
        nextLevel > level,
      levelDown:
        nextLevel < level,
      date:
        new Date().toLocaleDateString(),
      timestamp: Date.now(),
    }

    saveGameResult(result)

    navigate(
      '/user/result',
      {
        state: result,
      }
    )
  }

  const gridCols =
    cards.length <= 8
      ? 'grid-cols-4'
      : cards.length <= 12
        ? 'grid-cols-4 sm:grid-cols-6'
        : cards.length <= 16
          ? 'grid-cols-4 sm:grid-cols-6'
          : 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8'

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <GameHeader
        game={game}
        level={level}
        navigate={navigate}
        icon={Brain}
      />

      <div className="card p-6 sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f4f2] text-[#2f8f92]">
            <Brain size={28} />
          </div>

          <h1 className="mt-4 text-2xl font-black text-[#17345f]">
            {game.title}
          </h1>

          <p className="mt-2 text-lg text-slate-500">
            {isPreviewing
              ? 'Memorize the cards!'
              : 'Find the matching pictures.'}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {isPreviewing ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4df] px-4 py-2 text-sm font-black text-[#a96f1c]">
                <Clock3 size={16} />
                {previewCountdown}s to memorize
              </span>
            ) : (
              <>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                  Moves: {moves}
                </span>

                <span className="rounded-full bg-[#e8f4f2] px-4 py-2 text-sm font-bold text-[#2f8f92]">
                  Pairs: {matched.length / 2}/
                  {pairNames.length}
                </span>
              </>
            )}
          </div>
        </div>

        <div
          className={`mx-auto mt-8 grid max-w-4xl gap-3 ${gridCols}`}
        >
          {cards.map((card) => {
            const isFlipped =
              flipped.includes(
                card.id
              )

            const isMatched =
              matched.includes(
                card.id
              )

            const showImage =
              isPreviewing ||
              isFlipped ||
              isMatched

            return (
              <button
                key={card.id}
                type="button"
                aria-label={
                  showImage
                    ? 'Memory card'
                    : 'Hidden memory card'
                }
                onClick={() =>
                  handleCardClick(
                    card.id
                  )
                }
                disabled={
                  isPreviewing ||
                  processing ||
                  isMatched
                }
                className={`aspect-square overflow-hidden rounded-2xl border-2 transition ${
                  isMatched
                    ? 'border-green-400 bg-green-50'
                    : showImage
                      ? 'border-[#2f8f92] bg-white'
                      : 'border-slate-200 bg-[#e8f4f2] hover:border-[#2f8f92]'
                }`}
              >
                {showImage ? (
                  <ObjectTile
                    emoji={card.emoji}
                    label={card.name}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Brain
                      size={32}
                      className="text-[#2f8f92]"
                    />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {hasFinished ? (
          <div className="mt-8 rounded-3xl bg-green-50 p-6 text-center">
            <CheckCircle2
              size={44}
              className="mx-auto text-green-600"
            />

            <h2 className="mt-3 text-2xl font-black text-green-700">
              Excellent!
            </h2>

            <p className="mt-2 text-lg font-medium text-green-700">
              You matched all the pictures.
            </p>

            <p className="mt-2 text-xl font-black text-green-700">
              Score: {score}%
            </p>

            <Button
              className="mt-5"
              onClick={finishGame}
            >
              Finish game
            </Button>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={restartGame}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-lg font-bold text-slate-500 hover:bg-slate-100"
            >
              <RotateCcw size={20} />
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   PICTURE RECALL
========================================================= */

function PictureRecall({
  game,
  navigate,
}) {
  const level =
    getGameLevel(game.id)

  const memorizeTime =
    getPictureMemorizeTime(level)

  const pictureCount =
    getPictureCount(level)

  const questions = useMemo(
    () =>
      createPictureRecallQuestions(
        level
      ),
    [level]
  )

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0)

  const [
    isMemorizing,
    setIsMemorizing,
  ] = useState(true)

  const [countdown, setCountdown] =
    useState(
      Math.ceil(memorizeTime)
    )

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState(null)

  const [
    showFeedback,
    setShowFeedback,
  ] = useState(false)

  const [score, setScore] =
    useState(0)

  const [
    showSuccessEffect,
    setShowSuccessEffect,
  ] = useState(false)

  const question =
    questions[currentQuestion]

  const options = useMemo(
    () =>
      shuffleArray(
        question?.options || []
      ),
    [question]
  )

  useEffect(() => {
    if (!isMemorizing) {
      return undefined
    }

    setCountdown(
      Math.ceil(memorizeTime)
    )

    const timer = setInterval(() => {
      setCountdown(
        (previous) => {
          if (previous <= 1) {
            clearInterval(timer)
            setIsMemorizing(false)

            return 0
          }

          return previous - 1
        }
      )
    }, 1000)

    return () =>
      clearInterval(timer)
  }, [
    currentQuestion,
    isMemorizing,
    memorizeTime,
  ])

  const handleAnswer = (
    answer
  ) => {
    if (showFeedback) {
      return
    }

    const correct =
      answer === question.answer

    setSelectedAnswer(answer)
    setShowFeedback(true)

    if (correct) {
      setScore(
        (previous) =>
          previous + 1
      )

      setShowSuccessEffect(true)
    }
  }

  const nextQuestion = () => {
    const last =
      currentQuestion ===
      questions.length - 1

    const finalCorrect =
      score

    if (!last) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      )

      setSelectedAnswer(null)
      setShowFeedback(false)
      setShowSuccessEffect(false)
      setIsMemorizing(true)

      setCountdown(
        Math.ceil(memorizeTime)
      )

      return
    }

    const finalScore =
      Math.round(
        (finalCorrect /
          questions.length) *
          100
      )
    localStorage.setItem(
      'gameResults',
      JSON.stringify([
        ...previousResults,
        result,
      ])
    )
    window.dispatchEvent(
  new Event('smaran-activity-updated')
)

    const nextLevel =
      updatePlayerLevel(
        game.id,
        level,
        finalScore
      )

    const result =
      createQuestionGameResult({
        game,
        correctAnswers:
          finalCorrect,
        totalQuestions:
          questions.length,
        playedLevel: level,
        nextLevel,
      })

    saveGameResult(result)

    navigate(
      '/user/result',
      {
        state: result,
      }
    )
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <h2 className="text-2xl font-black text-[#17345f]">
          Unable to load this game.
        </h2>

        <Button
          className="mt-5"
          onClick={() =>
            navigate('/user/games')
          }
        >
          Back to games
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <GameHeader
        game={game}
        level={level}
        navigate={navigate}
        icon={ImageIcon}
      />

      <div className="card p-6 sm:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#17345f]">
            Picture Recall
          </h2>

          <p className="mt-2 text-lg text-slate-500">
            {pictureCount === 1
              ? 'Look at the picture and remember it.'
              : `Look at all ${pictureCount} pictures and remember them.`}
          </p>

          <div className="mt-3 text-sm font-bold text-[#2f8f92]">
            Question {currentQuestion + 1} /{' '}
            {questions.length}
          </div>
        </div>

        <div className="mt-8 text-center">
          {isMemorizing ? (
            <div>
              <div className="flex items-center justify-center gap-2 text-lg font-black text-[#2f8f92]">
                <Eye size={22} />

                Remember{' '}
                {pictureCount === 1
                  ? 'this picture'
                  : 'these pictures'}
              </div>

              <div
                className={`mx-auto mt-5 grid gap-3 ${
                  pictureCount === 1
                    ? 'max-w-md grid-cols-1'
                    : pictureCount === 2
                      ? 'max-w-lg grid-cols-2'
                      : pictureCount <= 4
                        ? 'max-w-2xl grid-cols-2 sm:grid-cols-2'
                        : pictureCount <= 6
                          ? 'max-w-3xl grid-cols-2 sm:grid-cols-3'
                          : 'max-w-4xl grid-cols-2 sm:grid-cols-4'
                }`}
              >
                {question.shown.map(
                  (name) => (
                    <ObjectTile
                      key={name}
                      emoji={
                        GAME_EMOJI[name]
                      }
                      label={name}
                      className="h-40 w-full rounded-3xl shadow-lg sm:h-48"
                    />
                  )
                )}
              </div>

              <div className="mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff4df] text-3xl font-black text-[#a96f1c] shadow-md">
                {countdown}
              </div>

              <p className="mt-3 text-lg font-bold text-slate-500">
                Remember them...
              </p>
            </div>
          ) : (
            <div>
              <p className="font-black uppercase tracking-wide text-[#2f8f92]">
                Memory question
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#17345f]">
                {question.question}
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {options.map(
                  (option) => {
                    const correct =
                      option ===
                      question.answer

                    const selected =
                      option ===
                      selectedAnswer

                    let className =
                      'border-slate-200 bg-white hover:border-[#2f8f92]'

                    if (
                      showFeedback
                    ) {
                      if (correct) {
                        className =
                          'border-green-400 bg-green-50'
                      } else if (
                        selected
                      ) {
                        className =
                          'border-red-400 bg-red-50'
                      } else {
                        className =
                          'border-slate-200 opacity-50'
                      }
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={
                          showFeedback
                        }
                        onClick={() =>
                          handleAnswer(
                            option
                          )
                        }
                        className={`overflow-hidden rounded-3xl border-2 text-left transition-all duration-300 ${className}`}
                      >
                        <ObjectTile
                          emoji={
                            GAME_EMOJI[
                              option
                            ]
                          }
                          label={option}
                          className="h-44 w-full"
                        />

                        <div className="flex items-center justify-between p-4">
                          <span className="text-lg font-black text-[#17345f]">
                            {option}
                          </span>

                          {showFeedback &&
                            correct && (
                              <CheckCircle2
                                size={28}
                                className="text-green-600"
                              />
                            )}

                          {showFeedback &&
                            selected &&
                            !correct && (
                              <span className="text-2xl font-black text-red-600">
                                ✕
                              </span>
                            )}
                        </div>
                      </button>
                    )
                  }
                )}
              </div>

              {showFeedback && (
                <div className="mt-6">
                  {selectedAnswer ===
                    question.answer &&
                    showSuccessEffect && (
                      <div className="mb-5 rounded-3xl border-2 border-green-200 bg-green-50 p-6 text-center shadow-lg">
                        <div className="flex items-center justify-center gap-3">
                          <Sparkles
                            size={30}
                            className="text-yellow-500"
                          />

                          <span className="text-5xl">
                            🎉
                          </span>

                          <Sparkles
                            size={30}
                            className="text-yellow-500"
                          />
                        </div>

                        <h3 className="mt-2 text-2xl font-black text-green-700">
                          Excellent!
                        </h3>

                        <p className="mt-1 text-lg font-bold text-green-600">
                          That's correct!
                        </p>
                      </div>
                    )}

                  {selectedAnswer ===
                  question.answer ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl bg-green-50 p-4 text-lg font-bold text-green-700">
                      <CheckCircle2 size={22} />
                      Correct! Well done.
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-red-50 p-4 text-center text-lg font-bold text-red-700">
                      Not quite.
                      <span className="ml-1 text-green-700">
                        Correct answer:{' '}
                        {question.answer}
                      </span>
                    </div>
                  )}

                  <Button
                    className="mt-4 w-full"
                    onClick={
                      nextQuestion
                    }
                  >
                    {currentQuestion ===
                    questions.length - 1
                      ? 'Finish game'
                      : 'Next question'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   FIND OBJECT + PATTERN RECOGNITION
========================================================= */

function QuestionGame({
  game,
  navigate,
}) {
  const level =
    getGameLevel(game.id)

  const isObjectGame =
    game.type === 'object'

  /*
    IMPORTANT:
    Pattern Recognition is now ONLY:
    game.type === 'pattern'

    The old number-sequence game is removed.
  */
  const isPatternGame =
    game.type === 'pattern'

  const timeLimit =
    getQuestionTime(level)

  const [visitSeed] =
    useState(
      () => Math.random()
    )

  const objectQuestions =
    useMemo(
      () =>
        isObjectGame
          ? createObjectGameQuestions(
              level
            )
          : [],
      [
        isObjectGame,
        level,
        visitSeed,
      ]
    )

  const patternQuestions =
    useMemo(
      () =>
        isPatternGame
          ? createPatternQuestions(
              level
            )
          : [],
      [
        isPatternGame,
        level,
        visitSeed,
      ]
    )

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0)

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState(null)

  const [
    showFeedback,
    setShowFeedback,
  ] = useState(false)

  const [score, setScore] =
    useState(0)

  const [
    showSuccessEffect,
    setShowSuccessEffect,
  ] = useState(false)

  const [timeLeft, setTimeLeft] =
    useState(timeLimit)

  const [timedOut, setTimedOut] =
    useState(false)

  const questions =
    isObjectGame
      ? objectQuestions
      : patternQuestions

  const question =
    questions[currentQuestion]

  const options =
    question?.options || []

  const objectOptions =
    isObjectGame
      ? options.map((name) => ({
          name,
          emoji:
            GAME_EMOJI[name] ||
            '🖼️',
        }))
      : []

  useEffect(() => {
    setTimeLeft(timeLimit)
  }, [
    currentQuestion,
    timeLimit,
  ])

  useEffect(() => {
    if (showFeedback) {
      return undefined
    }

    if (timeLeft <= 0) {
      setSelectedAnswer(null)
      setTimedOut(true)
      setShowFeedback(true)

      return undefined
    }

    const timer = setTimeout(() => {
      setTimeLeft(
        (previous) =>
          previous - 1
      )
    }, 1000)

    return () =>
      clearTimeout(timer)
  }, [
    timeLeft,
    showFeedback,
  ])

  const handleAnswer = (
    option
  ) => {
    if (showFeedback) {
      return
    }

    const answer =
      isObjectGame
        ? option.name
        : option

    const correct =
      answer ===
      question.answer

    setSelectedAnswer(answer)
    setTimedOut(false)
    setShowFeedback(true)

    if (correct) {
      setScore(
        (previous) =>
          previous + 1
      )

      setShowSuccessEffect(true)
    }
  }

  const nextQuestion = () => {
    const totalQuestions =
      questions.length

    const last =
      currentQuestion ===
      totalQuestions - 1

    /*
      Because React state updates are asynchronous,
      score already contains the previous answers.
    */
    const finalCorrect =
      score

    if (!last) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      )

      setSelectedAnswer(null)
      setShowFeedback(false)
      setShowSuccessEffect(false)
      setTimedOut(false)

      return
    }

    /*
      Add the current answer when finishing.
      This fixes the common issue where the
      last correct answer is not included.
    */
    const currentAnswerCorrect =
      selectedAnswer ===
      question.answer

    const totalCorrect =
      finalCorrect +
      (currentAnswerCorrect
        ? 1
        : 0)

    const finalScore =
      Math.round(
        (totalCorrect /
          totalQuestions) *
          100
      )

    const nextLevel =
      updatePlayerLevel(
        game.id,
        level,
        finalScore
      )

    const result =
      createQuestionGameResult({
        game,
        correctAnswers:
          totalCorrect,
        totalQuestions,
        playedLevel: level,
        nextLevel,
      })

    saveGameResult(result)

    navigate(
      '/user/result',
      {
        state: result,
      }
    )
  }

  const Icon =
    ICON_MAP[game.type] ||
    Brain

  if (!question) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <h2 className="text-2xl font-black text-[#17345f]">
          Unable to load this game.
        </h2>

        <Button
          className="mt-5"
          onClick={() =>
            navigate('/user/games')
          }
        >
          Back to games
        </Button>
      </div>
    )
  }

  const optionGridClass =
    isObjectGame &&
    options.length > 4
      ? 'mt-8 grid gap-4 sm:grid-cols-3'
      : isObjectGame
        ? 'mt-8 grid gap-5 sm:grid-cols-2'
        : 'mt-8 grid gap-4 sm:grid-cols-2'

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <GameHeader
        game={game}
        level={level}
        navigate={navigate}
        icon={Icon}
      />

      <div className="card p-6 sm:p-8">
        <div className="text-center">
          <p className="font-black uppercase tracking-wide text-[#2f8f92]">
            {isObjectGame
              ? 'Find the Object'
              : 'Pattern Recognition'}
          </p>

          {!isObjectGame && (
            <div className="mx-auto mt-3 flex items-center justify-center gap-3">
              <Brain
                size={28}
                className="text-[#2f8f92]"
              />

              <h1 className="text-2xl font-black text-[#17345f] sm:text-3xl">
                Visual Memory Pattern
              </h1>
            </div>
          )}

          {isObjectGame && (
            <div className="mx-auto mt-3 flex max-w-3xl items-start justify-center gap-3">
              <Search
                size={28}
                className="mt-1 shrink-0 text-[#2f8f92]"
              />

              <h1 className="text-2xl font-black leading-relaxed text-[#17345f] sm:text-3xl">
                {question.question}
              </h1>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-[#e8f4f2] px-4 py-2 text-sm font-bold text-[#2f8f92]">
              Level {level}
            </span>

            <span className="rounded-full bg-[#fff4df] px-4 py-2 text-sm font-bold text-[#a96f1c]">
              Question{' '}
              {currentQuestion + 1}{' '}
              / {questions.length}
            </span>

            {!showFeedback && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold ${
                  timeLeft <= 5
                    ? 'bg-red-50 text-red-600'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Clock3 size={16} />
                {timeLeft}s
              </span>
            )}

            {isObjectGame && (
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold capitalize text-slate-600">
                {question.category}
              </span>
            )}
          </div>

          {isObjectGame ? (
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
              Take your time. Look carefully at
              each picture and choose the object
              you are looking for.
            </p>
          ) : (
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
              Look carefully, remember the order
              of the pictures, and choose the
              picture that completes the pattern.
            </p>
          )}
        </div>

        {/* =================================================
            FIND OBJECT
        ================================================= */}

        {isObjectGame ? (
          <div
            className={
              optionGridClass
            }
          >
            {objectOptions.map(
              (
                option,
                index
              ) => {
                const isCorrect =
                  option.name ===
                  question.answer

                const isSelected =
                  option.name ===
                  selectedAnswer

                let optionClass =
                  'border-slate-200 bg-white hover:border-[#2f8f92] hover:shadow-lg'

                if (
                  showFeedback
                ) {
                  if (
                    isCorrect
                  ) {
                    optionClass =
                      'border-green-500 bg-green-50 shadow-xl'
                  } else if (
                    isSelected
                  ) {
                    optionClass =
                      'border-red-500 bg-red-50 shadow-xl'
                  } else {
                    optionClass =
                      'border-slate-200 bg-white opacity-40'
                  }
                }

                return (
                  <button
                    key={`${option.name}-${index}`}
                    type="button"
                    aria-label={`Choose ${option.name}`}
                    disabled={
                      showFeedback
                    }
                    onClick={() =>
                      handleAnswer(
                        option
                      )
                    }
                    className={`relative min-h-[180px] overflow-hidden rounded-3xl border-4 transition-all duration-300 sm:min-h-[220px] ${optionClass} ${
                      showSuccessEffect &&
                      isCorrect
                        ? 'scale-[1.02] shadow-2xl ring-4 ring-green-200'
                        : ''
                    }`}
                  >
                    <ObjectTile
                      emoji={
                        option.emoji
                      }
                      label={
                        option.name
                      }
                      className={`h-48 w-full sm:h-56 ${
                        showSuccessEffect &&
                        isCorrect
                          ? 'animate-pulse'
                          : ''
                      }`}
                    />

                    {showFeedback &&
                      isCorrect && (
                        <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-xl">
                          <CheckCircle2
                            size={28}
                          />
                        </div>
                      )}

                    {showFeedback &&
                      isSelected &&
                      !isCorrect && (
                        <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-xl font-black text-white shadow-xl">
                          ✕
                        </div>
                      )}

                    {showSuccessEffect &&
                      isCorrect && (
                        <>
                          <div className="absolute left-3 top-3 text-2xl">
                            ✨
                          </div>

                          <div className="absolute bottom-3 left-5 text-xl">
                            ⭐
                          </div>

                          <div className="absolute bottom-3 right-5 text-xl">
                            ✨
                          </div>
                        </>
                      )}
                  </button>
                )
              }
            )}
          </div>
        ) : (
          /* =================================================
             VISUAL MEMORY PATTERN
          ================================================= */

          <div className="mt-8">
            <div className="rounded-3xl border-2 border-[#e8f4f2] bg-[#f8fbfa] p-5 sm:p-8">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f4f2] px-4 py-2 text-sm font-black text-[#2f8f92]">
                  <Brain size={18} />
                  Memory Pattern
                </div>

                <p className="mt-3 text-lg font-bold text-[#17345f]">
                  Remember the order of the pictures
                </p>

                <p className="mt-1 text-slate-500">
                  Which picture should come next?
                </p>
              </div>

              {/* VISUAL SEQUENCE */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {question.sequence.map(
                  (item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative">
                        <ObjectTile
                          emoji={
                            GAME_EMOJI[
                              item
                            ] ||
                            '🖼️'
                          }
                          label={item}
                          className="h-24 w-24 rounded-2xl border-2 border-white shadow-md sm:h-28 sm:w-28"
                        />

                        <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#2f8f92] text-xs font-black text-white">
                          {index + 1}
                        </span>
                      </div>

                      {index <
                        question
                          .sequence
                          .length -
                          1 && (
                        <span className="text-2xl font-black text-[#2f8f92]">
                          →
                        </span>
                      )}
                    </div>
                  )
                )}

                {/* MISSING ITEM */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#2f8f92]">
                    →
                  </span>

                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-dashed border-[#a96f1c] bg-[#fff4df] text-5xl font-black text-[#a96f1c] shadow-md sm:h-28 sm:w-28">
                    ?
                  </div>
                </div>
              </div>
            </div>

            {/* ANSWER OPTIONS */}
            <div className="mt-7">
              <p className="mb-5 text-center text-xl font-black text-[#17345f]">
                What comes next?
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {options.map(
                  (option) => {
                    const isCorrect =
                      option ===
                      question.answer

                    const isSelected =
                      option ===
                      selectedAnswer

                    let optionClass =
                      'border-slate-200 bg-white hover:border-[#2f8f92] hover:shadow-lg'

                    if (
                      showFeedback
                    ) {
                      if (
                        isCorrect
                      ) {
                        optionClass =
                          'border-green-500 bg-green-50 shadow-xl'
                      } else if (
                        isSelected
                      ) {
                        optionClass =
                          'border-red-500 bg-red-50 shadow-xl'
                      } else {
                        optionClass =
                          'border-slate-200 bg-white opacity-40'
                      }
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={
                          showFeedback
                        }
                        onClick={() =>
                          handleAnswer(
                            option
                          )
                        }
                        className={`overflow-hidden rounded-3xl border-4 transition-all duration-300 ${optionClass} ${
                          showSuccessEffect &&
                          isCorrect
                            ? 'scale-[1.02] shadow-2xl ring-4 ring-green-200'
                            : ''
                        }`}
                      >
                        <ObjectTile
                          emoji={
                            GAME_EMOJI[
                              option
                            ] ||
                            '🖼️'
                          }
                          label={option}
                          className="h-40 w-full sm:h-44"
                        />

                        <div className="flex items-center justify-between p-4">
                          <span className="text-xl font-black text-[#17345f]">
                            {option}
                          </span>

                          {showFeedback &&
                            isCorrect && (
                              <CheckCircle2
                                size={30}
                                className="text-green-600"
                              />
                            )}

                          {showFeedback &&
                            isSelected &&
                            !isCorrect && (
                              <span className="text-2xl font-black text-red-600">
                                ✕
                              </span>
                            )}
                        </div>
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            FEEDBACK
        ================================================= */}

        {showFeedback && (
          <div className="mt-7">
            {selectedAnswer ===
              question.answer &&
              showSuccessEffect && (
                <div className="mb-5 rounded-3xl border-2 border-green-200 bg-green-50 p-6 text-center shadow-lg">
                  <div className="flex items-center justify-center gap-3">
                    <Sparkles
                      size={30}
                      className="text-yellow-500"
                    />

                    <span className="text-5xl">
                      🎉
                    </span>

                    <Sparkles
                      size={30}
                      className="text-yellow-500"
                    />
                  </div>

                  <h2 className="mt-2 text-3xl font-black text-green-700">
                    Excellent!
                  </h2>

                  <p className="mt-1 text-lg font-bold text-green-600">
                    That's correct!
                  </p>
                </div>
              )}

            {selectedAnswer ===
            question.answer ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-green-50 p-5 text-lg font-bold text-green-700">
                <CheckCircle2
                  size={24}
                />

                Correct! Well done.
              </div>
            ) : (
              <div className="rounded-2xl bg-red-50 p-5 text-center text-lg font-bold text-red-700">
                {timedOut
                  ? "⏰ Time's up!"
                  : 'Not quite.'}

                <span className="ml-1 text-green-700">
                  Correct answer:{' '}
                  {question.answer}
                </span>
              </div>
            )}

            <Button
              className="mt-4 w-full"
              onClick={
                nextQuestion
              }
            >
              {currentQuestion ===
              questions.length - 1
                ? 'Finish game'
                : 'Next question'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   GAME HEADER
========================================================= */

function GameHeader({
  game,
  level,
  navigate,
  icon: Icon,
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={() =>
          navigate('/user/games')
        }
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-lg font-bold text-slate-600 transition hover:bg-white hover:text-[#2f8f92]"
      >
        <ArrowLeft size={21} />
        Back
      </button>

      <div className="flex items-center gap-3">
        <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f2] text-[#2f8f92] sm:flex">
          <Icon size={21} />
        </div>

        <LevelBadge
          level={level}
        />
      </div>
    </div>
  )
}

