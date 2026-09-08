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

const MAX_LEVEL = 5
const QUESTIONS_PER_GAME = 5
const PICTURE_TIME = 3

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

  localStorage.setItem(
    LEVEL_STORAGE_KEY,
    JSON.stringify(levels)
  )

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
  const names = {
    1: 'Beginner',
    2: 'Easy',
    3: 'Medium',
    4: 'Hard',
    5: 'Expert',
  }

  return names[level] || 'Beginner'
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
      ? Math.round(
          (correctAnswers / totalQuestions) * 100
        )
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

  return array[
    Math.floor(Math.random() * array.length)
  ]
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
   REAL UNSPLASH IMAGES
========================================================= */

const GAME_IMAGES = {
  /* =========================
     FRUITS
  ========================= */

  Apple:
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=85',

  Banana:
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=85',

  Orange:
    'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=85',

  Grapes:
    'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=700&q=85',

  Strawberry:
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=85',

  Watermelon:
    'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=700&q=85',

  Lemon:
    'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=700&q=85',

  Pineapple:
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=700&q=85',

  Mango:
    'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=85',

  Peach:
    'https://images.unsplash.com/photo-1629828874514-dc4c3e0e6e6b?auto=format&fit=crop&w=700&q=85',

  Pear:
    'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=700&q=85',

  Coconut:
    'https://images.unsplash.com/photo-1444498253794-5c7f57f4b3c0?auto=format&fit=crop&w=700&q=85',

  /* =========================
     VEGETABLES
  ========================= */

  Tomato:
    'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=85',

  Carrot:
    'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=85',

  Potato:
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85',

  Broccoli:
    'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=700&q=85',

  Corn:
    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=85',

  Onion:
    'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=700&q=85',

  Pepper:
    'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=700&q=85',

  Cucumber:
    'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=700&q=85',

  /* =========================
     ANIMALS
  ========================= */

  Dog:
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=85',

  Cat:
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=700&q=85',

  Rabbit:
    'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=700&q=85',

  Fox:
    'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=700&q=85',

  Horse:
    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=700&q=85',

  Cow:
    'https://images.unsplash.com/photo-1546447147-3fc2b8181a1c?auto=format&fit=crop&w=700&q=85',

  Elephant:
    'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=700&q=85',

  Lion:
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=700&q=85',

  Tiger:
    'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=700&q=85',

  Deer:
    'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=700&q=85',

  Monkey:
    'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=700&q=85',

  Panda:
    'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=700&q=85',

  Penguin:
    'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?auto=format&fit=crop&w=700&q=85',

  Bear:
    'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=700&q=85',

  Giraffe:
    'https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=700&q=85',

  Zebra:
    'https://images.unsplash.com/photo-1501706362039-c6e80948e7d7?auto=format&fit=crop&w=700&q=85',

  Parrot:
    'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=700&q=85',

  Eagle:
    'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=700&q=85',

  Butterfly:
    'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=700&q=85',

  Fish:
    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=700&q=85',

  /* =========================
     FLOWERS / NATURE
  ========================= */

  Flower:
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=85',

  Rose:
    'https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=700&q=85',

  Sunflower:
    'https://images.unsplash.com/photo-1597848212624-e19e7e7c3f2f?auto=format&fit=crop&w=700&q=85',

  Tulip:
    'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=700&q=85',

  Tree:
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=85',

  Leaf:
    'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=700&q=85',

  Plant:
    'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=700&q=85',

  Mountain:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=85',

  Beach:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=85',

  Lake:
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=85',

  PlantPot:
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=85',

  /* =========================
     VEHICLES
  ========================= */

  Car:
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=700&q=85',

  Bus:
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=85',

  Bicycle:
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=700&q=85',

  Truck:
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d8?auto=format&fit=crop&w=700&q=85',

  Van:
    'https://images.unsplash.com/photo-1568844293986-8c3d1c0e9b1b?auto=format&fit=crop&w=700&q=85',

  Motorcycle:
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=85',

  Train:
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=700&q=85',

  Airplane:
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=85',

  Boat:
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=85',

  Scooter:
    'https://images.unsplash.com/photo-1558980394-0c2f7e6a5b1a?auto=format&fit=crop&w=700&q=85',

  /* =========================
     HOUSEHOLD
  ========================= */

  Cup:
    'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85',

  Mug:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85',

  Glass:
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=85',

  Bottle:
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85',

  Plate:
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=85',

  Spoon:
    'https://images.unsplash.com/photo-1581656756711-7c7b7f3b7d9e?auto=format&fit=crop&w=700&q=85',

  Fork:
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=700&q=85',

  Chair:
    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=700&q=85',

  Table:
    'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=700&q=85',

  Lamp:
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85',

  Clock:
    'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=700&q=85',

  Mirror:
    'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=85',

  Pillow:
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=85',

  Candle:
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85',

  Vase:
    'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=700&q=85',

  Key:
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=700&q=85',

  Umbrella:
    'https://images.unsplash.com/photo-1515694346937-94d85e41e620?auto=format&fit=crop&w=700&q=85',

  /* =========================
     BOOKS / SCHOOL
  ========================= */

  Book:
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85',

  Notebook:
    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=85',

  Magazine:
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=700&q=85',

  Newspaper:
    'https://images.unsplash.com/photo-1504711331083-9c6a7c5c7e3e?auto=format&fit=crop&w=700&q=85',

  Pen:
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=700&q=85',

  Pencil:
    'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=85',

  Scissors:
    'https://images.unsplash.com/photo-1585670149963-0c6f2f3b8a3f?auto=format&fit=crop&w=700&q=85',

  Backpack:
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85',

  /* =========================
     CLOTHING
  ========================= */

  Shoe:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85',

  Sock:
    'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=700&q=85',

  Slipper:
    'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=700&q=85',

  Boot:
    'https://images.unsplash.com/photo-1542840410-3092f6a0b6a8?auto=format&fit=crop&w=700&q=85',

  Hat:
    'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=700&q=85',

  Shirt:
    'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=85',

  Jacket:
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85',

  Scarf:
    'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=700&q=85',

  /* =========================
     SPORTS / MUSIC
  ========================= */

  Ball:
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=700&q=85',

  Football:
    'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=700&q=85',

  Basketball:
    'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=700&q=85',

  Tennis:
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=700&q=85',

  Baseball:
    'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=700&q=85',

  Guitar:
    'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=700&q=85',

  Piano:
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=700&q=85',

  /* =========================
     TECHNOLOGY
  ========================= */

  Phone:
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85',

  Laptop:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85',

  Keyboard:
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=85',

  Camera:
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85',

  Headphones:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85',

  Television:
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=700&q=85',

  /* =========================
     PERSONAL
  ========================= */

  Comb:
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&q=85',

  Toothbrush:
    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=700&q=85',

  Soap:
    'https://images.unsplash.com/photo-1607006483225-8b3d3f6f1e47?auto=format&fit=crop&w=700&q=85',

  Towel:
    'https://images.unsplash.com/photo-1583845112203-454c1b6e9c2d?auto=format&fit=crop&w=700&q=85',

  Basket:
    'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=700&q=85',

  Suitcase:
    'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=700&q=85',

  Wallet:
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=85',

  Sunglasses:
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85',

  Watch:
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85',

  Ring:
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85',

  /* =========================
     HOME
  ========================= */

  House:
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=700&q=85',

  Sofa:
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85',

  Bed:
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=85',

  Door:
    'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?auto=format&fit=crop&w=700&q=85',

  Window:
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=700&q=85',

  Carpet:
    'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=700&q=85',

  /* =========================
     KITCHEN
  ========================= */

  Kettle:
    'https://images.unsplash.com/photo-1594213114663-d94db9b171c8?auto=format&fit=crop&w=700&q=85',

  Pan:
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=700&q=85',

  Pot:
    'https://images.unsplash.com/photo-1584990347449-ae2c1e8a2d9b?auto=format&fit=crop&w=700&q=85',

  Bowl:
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=85',

  Coffee:
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=85',

  /* =========================
     TOOLS
  ========================= */

  Hammer:
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=700&q=85',

  Toolbox:
    'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=700&q=85',
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

/* =========================================================
   OBJECT BANK
========================================================= */

const ALL_OBJECTS = Object.keys(GAME_IMAGES)

/* =========================================================
   CATEGORY LOOKUP
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
   FIND OBJECT QUESTION STYLES
========================================================= */

const OBJECT_QUESTION_STYLES = {
  1: [
    (name) =>
      `Which picture shows the ${name.toLowerCase()}?`,

    (name) =>
      `Can you find the ${name.toLowerCase()}?`,

    (name) =>
      `Where is the ${name.toLowerCase()}?`,

    (name) =>
      `Tap the ${name.toLowerCase()}.`,

    (name) =>
      `Find the ${name.toLowerCase()}.`,
  ],

  2: [
    (name) =>
      `Which image is the ${name.toLowerCase()}?`,

    (name) =>
      `Can you spot the ${name.toLowerCase()}?`,

    (name) =>
      `Look carefully and find the ${name.toLowerCase()}.`,

    (name) =>
      `Choose the picture of the ${name.toLowerCase()}.`,

    (name) =>
      `Which picture belongs to the name ${name.toLowerCase()}?`,
  ],

  3: [
    (name, category) =>
      `Which picture shows the ${name.toLowerCase()}?`,

    (name, category) =>
      `Can you recognize this ${category} item: ${name.toLowerCase()}?`,

    (name, category) =>
      `Which image matches the ${category} called ${name.toLowerCase()}?`,

    (name, category) =>
      `Identify the ${category}: ${name.toLowerCase()}.`,

    (name, category) =>
      `Which picture correctly represents ${name.toLowerCase()}?`,
  ],

  4: [
    (name, category) =>
      `Look carefully. Which picture represents the ${category} item ${name.toLowerCase()}?`,

    (name, category) =>
      `Among these pictures, can you identify the ${name.toLowerCase()}?`,

    (name, category) =>
      `Which image correctly matches ${name.toLowerCase()}?`,

    (name, category) =>
      `Observe all four pictures. Find the ${name.toLowerCase()}.`,

    (name, category) =>
      `Which picture should be selected for ${name.toLowerCase()}?`,
  ],

  5: [
    (name) =>
      `Use your memory and identify the ${name.toLowerCase()}.`,

    (name) =>
      `Look at all four pictures carefully. Which one is the ${name.toLowerCase()}?`,

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

/* =========================================================
   CREATE ONE OBJECT QUESTION
========================================================= */

function createObjectQuestion(level, usedObjects = []) {
  const availableTargets = ALL_OBJECTS.filter(
    (name) => !usedObjects.includes(name)
  )

  const objectName =
    randomItem(availableTargets) ||
    randomItem(ALL_OBJECTS)

  const category = getObjectCategory(objectName)

  const styles =
    OBJECT_QUESTION_STYLES[level] ||
    OBJECT_QUESTION_STYLES[1]

  const questionGenerator = randomItem(styles)

  const question = questionGenerator(
    objectName,
    category
  )

  let distractorPool

  if (level >= 4) {
    const sameCategory =
      OBJECT_CATEGORIES[category] || []

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
  ).slice(0, 3)

  if (distractors.length < 3) {
    const backup = ALL_OBJECTS.filter(
      (name) =>
        name !== objectName &&
        !distractors.includes(name)
    )

    distractors = [
      ...distractors,
      ...shuffleArray(backup).slice(
        0,
        3 - distractors.length
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

/* =========================================================
   CREATE 5 UNIQUE FIND OBJECT QUESTIONS
========================================================= */

function createObjectGameQuestions(level) {
  const questions = []
  const usedObjects = []

  let attempts = 0

  while (
    questions.length < QUESTIONS_PER_GAME &&
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
   PICTURE MEMORY
========================================================= */

const PICTURE_MEMORY_LEVELS = {
  1: [
    ['Apple', 'Banana', 'Orange', 'Grapes'],
    ['Flower', 'Rose', 'Sunflower', 'Tulip'],
    ['Dog', 'Cat', 'Rabbit', 'Fox'],
    ['Car', 'Bus', 'Bicycle', 'Truck'],
    ['House', 'Tree', 'Book', 'Car'],
  ],

  2: [
    ['Banana', 'Apple', 'Orange', 'Grapes'],
    ['Rose', 'Flower', 'Sunflower', 'Tulip'],
    ['Cat', 'Dog', 'Rabbit', 'Fox'],
    ['Bus', 'Car', 'Bicycle', 'Truck'],
    ['Tree', 'House', 'Book', 'Flower'],
  ],

  3: [
    ['Orange', 'Apple', 'Banana', 'Grapes'],
    ['Sunflower', 'Rose', 'Flower', 'Tulip'],
    ['Rabbit', 'Dog', 'Cat', 'Fox'],
    ['Bicycle', 'Car', 'Bus', 'Truck'],
    ['Book', 'House', 'Tree', 'Coffee'],
  ],

  4: [
    ['Grapes', 'Apple', 'Banana', 'Orange'],
    ['Tulip', 'Rose', 'Sunflower', 'Flower'],
    ['Fox', 'Dog', 'Cat', 'Rabbit'],
    ['Bicycle', 'Car', 'Bus', 'Truck'],
    ['Coffee', 'Book', 'House', 'Tree'],
  ],

  5: [
    ['Apple', 'Grapes', 'Orange', 'Banana'],
    ['Sunflower', 'Tulip', 'Rose', 'Flower'],
    ['Fox', 'Rabbit', 'Cat', 'Dog'],
    ['Car', 'Bus', 'Bicycle', 'Truck'],
    ['Book', 'Coffee', 'Tree', 'House'],
  ],
}

function getPictureQuestions(level) {
  const raw =
    PICTURE_MEMORY_LEVELS[level] ||
    PICTURE_MEMORY_LEVELS[1]

  return raw.map(
    (options, index) => {
      const answer = options[0]

      let question =
        'What picture did you see?'

      if (index === 1) {
        question =
          'Which flower did you see?'
      }

      if (index === 2) {
        question =
          'Which animal did you see?'
      }

      if (index === 3) {
        question =
          'Which vehicle did you see?'
      }

      return {
        image: GAME_IMAGES[answer],
        answer,
        question,
        options,
      }
    }
  )
}

/* =========================================================
   NUMBER MEMORY
========================================================= */

const NUMBER_LEVELS = {
  1: [
    {
      question: '2, 4, 6, 8, ?',
      options: ['9', '10', '11', '12'],
      answer: '10',
    },
    {
      question: '5, 10, 15, 20, ?',
      options: ['22', '24', '25', '30'],
      answer: '25',
    },
    {
      question: '10, 9, 8, 7, ?',
      options: ['5', '6', '7', '8'],
      answer: '6',
    },
    {
      question: '3, 6, 9, 12, ?',
      options: ['14', '15', '16', '18'],
      answer: '15',
    },
    {
      question: '20, 18, 16, 14, ?',
      options: ['10', '11', '12', '13'],
      answer: '12',
    },
  ],

  2: [
    {
      question: '3, 6, 9, 12, 15, ?',
      options: ['16', '17', '18', '20'],
      answer: '18',
    },
    {
      question: '4, 8, 12, 16, ?',
      options: ['18', '20', '22', '24'],
      answer: '20',
    },
    {
      question: '30, 25, 20, 15, ?',
      options: ['5', '10', '12', '15'],
      answer: '10',
    },
    {
      question: '2, 5, 8, 11, ?',
      options: ['12', '13', '14', '15'],
      answer: '14',
    },
    {
      question: '50, 45, 40, 35, ?',
      options: ['25', '30', '32', '40'],
      answer: '30',
    },
  ],

  3: [
    {
      question: '2, 4, 8, 16, ?',
      options: ['24', '30', '32', '36'],
      answer: '32',
    },
    {
      question: '3, 6, 12, 24, ?',
      options: ['36', '42', '48', '50'],
      answer: '48',
    },
    {
      question: '5, 10, 20, 40, ?',
      options: ['60', '70', '80', '90'],
      answer: '80',
    },
    {
      question: '100, 90, 80, 70, ?',
      options: ['50', '55', '60', '65'],
      answer: '60',
    },
    {
      question: '1, 4, 9, 16, ?',
      options: ['20', '24', '25', '30'],
      answer: '25',
    },
  ],

  4: [
    {
      question: '2, 6, 12, 20, 30, ?',
      options: ['36', '40', '42', '44'],
      answer: '42',
    },
    {
      question: '1, 3, 6, 10, 15, ?',
      options: ['18', '20', '21', '25'],
      answer: '21',
    },
    {
      question: '81, 27, 9, 3, ?',
      options: ['0', '1', '2', '3'],
      answer: '1',
    },
    {
      question: '2, 5, 11, 23, ?',
      options: ['35', '45', '47', '50'],
      answer: '47',
    },
    {
      question: '4, 7, 13, 25, ?',
      options: ['37', '45', '49', '51'],
      answer: '49',
    },
  ],

  5: [
    {
      question: '1, 2, 6, 24, 120, ?',
      options: ['240', '360', '720', '840'],
      answer: '720',
    },
    {
      question: '2, 3, 5, 8, 13, ?',
      options: ['18', '20', '21', '22'],
      answer: '21',
    },
    {
      question: '3, 7, 15, 31, 63, ?',
      options: ['95', '111', '127', '135'],
      answer: '127',
    },
    {
      question: '2, 4, 12, 48, 240, ?',
      options: ['720', '960', '1200', '1440'],
      answer: '1440',
    },
    {
      question: '1, 5, 14, 30, 55, ?',
      options: ['80', '85', '91', '95'],
      answer: '91',
    },
  ],
}

/* =========================================================
   ICON MAP
========================================================= */

const ICON_MAP = {
  picture: ImageIcon,
  number: Hash,
  object: Search,
  memory: Brain,
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

function RealMemoryMatch({
  game,
  navigate,
}) {
  const level = getGameLevel(game.id)

  const pairsByLevel = {
    1: [
      'Apple',
      'Cup',
      'Dog',
      'Car',
    ],

    2: [
      'Apple',
      'Cup',
      'Dog',
      'Car',
      'Book',
      'Flower',
    ],

    3: [
      'Apple',
      'Cup',
      'Dog',
      'Car',
      'Book',
      'Flower',
      'Bicycle',
      'Tree',
    ],

    4: [
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
    ],

    5: [
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
    ],
  }

  const pairNames =
    pairsByLevel[level] ||
    pairsByLevel[1]

  const createCards = () => {
    const cards = pairNames.flatMap(
      (name, index) => [
        {
          id: `${name}-1-${index}`,
          name,
          image: GAME_IMAGES[name],
        },
        {
          id: `${name}-2-${index}`,
          name,
          image: GAME_IMAGES[name],
        },
      ]
    )

    return shuffleArray(cards)
  }

  const [cards, setCards] = useState(
    createCards
  )

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

  useEffect(() => {
    if (matched.length === cards.length) {
      setHasFinished(true)
    }
  }, [matched, cards.length])

  const handleCardClick = (cardId) => {
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
      (previous) => previous + 1
    )

    const first = cards.find(
      (card) =>
        card.id === newFlipped[0]
    )

    const second = cards.find(
      (card) =>
        card.id === newFlipped[1]
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

    navigate('/user/result', {
      state: result,
    })
  }

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
            Find the matching pictures.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
              Moves: {moves}
            </span>

            <span className="rounded-full bg-[#e8f4f2] px-4 py-2 text-sm font-bold text-[#2f8f92]">
              Pairs: {matched.length / 2}/
              {pairNames.length}
            </span>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-4 gap-3 sm:grid-cols-6">
          {cards.map((card) => {
            const isFlipped =
              flipped.includes(card.id)

            const isMatched =
              matched.includes(card.id)

            const showImage =
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
                  <img
                    src={card.image}
                    alt="Memory card"
                    className="h-full w-full object-cover"
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
  const level = getGameLevel(game.id)

  const questions = useMemo(
    () => getPictureQuestions(level),
    [level]
  )

  const [currentQuestion, setCurrentQuestion] =
    useState(0)

  const [isMemorizing, setIsMemorizing] =
    useState(true)

  const [countdown, setCountdown] =
    useState(PICTURE_TIME)

  const [selectedAnswer, setSelectedAnswer] =
    useState(null)

  const [showFeedback, setShowFeedback] =
    useState(false)

  const [score, setScore] =
    useState(0)

  const [showSuccessEffect, setShowSuccessEffect] =
    useState(false)

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

    setCountdown(PICTURE_TIME)

    const timer = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          clearInterval(timer)
          setIsMemorizing(false)
          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [
    currentQuestion,
    isMemorizing,
  ])

  useEffect(() => {
    return () => {
      setShowSuccessEffect(false)
    }
  }, [])

  const handleAnswer = (answer) => {
    if (showFeedback) return

    const correct =
      answer === question.answer

    setSelectedAnswer(answer)
    setShowFeedback(true)

    if (correct) {
      setScore(
        (previous) => previous + 1
      )

      setShowSuccessEffect(true)
    }
  }

  const nextQuestion = () => {
    const last =
      currentQuestion ===
      questions.length - 1

    const lastCorrect =
      selectedAnswer ===
      question.answer

    const finalCorrect =
      score +
      (lastCorrect ? 1 : 0)

    if (!last) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      )

      setSelectedAnswer(null)
      setShowFeedback(false)
      setShowSuccessEffect(false)
      setIsMemorizing(true)
      setCountdown(PICTURE_TIME)

      return
    }

    const finalScore =
      Math.round(
        (finalCorrect /
          questions.length) *
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
          finalCorrect,
        totalQuestions:
          questions.length,
        playedLevel: level,
        nextLevel,
      })

    saveGameResult(result)

    navigate('/user/result', {
      state: result,
    })
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
            Look at the picture and remember it.
          </p>

          <div className="mt-3 text-sm font-bold text-[#2f8f92]">
            Question {currentQuestion + 1} / 5
          </div>
        </div>

        <div className="mt-8 text-center">
          {isMemorizing ? (
            <div>
              <div className="flex items-center justify-center gap-2 text-lg font-black text-[#2f8f92]">
                <Eye size={22} />
                Remember this picture
              </div>

              <img
                src={question.image}
                alt="Remember this picture"
                className="mx-auto mt-5 h-72 w-full max-w-md rounded-3xl object-cover shadow-lg"
              />

              <div className="mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff4df] text-3xl font-black text-[#a96f1c] shadow-md">
                {countdown}
              </div>

              <p className="mt-3 text-lg font-bold text-slate-500">
                Remember it...
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

                    if (showFeedback) {
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
                        <img
                          src={
                            GAME_IMAGES[
                              option
                            ]
                          }
                          alt={option}
                          className="h-44 w-full object-cover"
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
   FIND OBJECT + NUMBER MEMORY
========================================================= */

function QuestionGame({
  game,
  navigate,
}) {
  const level = getGameLevel(game.id)

  const isObjectGame =
    game.type === 'object'

  /*
   * New seed on every page visit.
   * The seed is deliberately created only once
   * when this component mounts.
   */
  const [visitSeed] =
    useState(() => Math.random())

  /*
   * This creates a completely new question set
   * whenever the user enters the Find Object page.
   */
  const objectQuestions = useMemo(
    () =>
      isObjectGame
        ? createObjectGameQuestions(level)
        : [],
    [
      isObjectGame,
      level,
      visitSeed,
    ]
  )

  const numberQuestions =
    NUMBER_LEVELS[level] ||
    NUMBER_LEVELS[1]

  const [currentQuestion, setCurrentQuestion] =
    useState(0)

  const [selectedAnswer, setSelectedAnswer] =
    useState(null)

  const [showFeedback, setShowFeedback] =
    useState(false)

  const [score, setScore] =
    useState(0)

  const [showSuccessEffect, setShowSuccessEffect] =
    useState(false)

  const question = isObjectGame
    ? objectQuestions[currentQuestion]
    : numberQuestions[currentQuestion]

  const options =
    question?.options || []

  const objectOptions =
    isObjectGame
      ? options.map((name) => ({
          name,
          image: GAME_IMAGES[name],
        }))
      : []

  const handleAnswer = (option) => {
    if (showFeedback) return

    const answer = isObjectGame
      ? option.name
      : option

    const correct =
      answer === question.answer

    setSelectedAnswer(answer)
    setShowFeedback(true)

    if (correct) {
      setScore(
        (previous) => previous + 1
      )

      setShowSuccessEffect(true)
    }
  }

  const nextQuestion = () => {
    const totalQuestions =
      isObjectGame
        ? QUESTIONS_PER_GAME
        : numberQuestions.length

    const last =
      currentQuestion ===
      totalQuestions - 1

    const lastCorrect =
      selectedAnswer ===
      question.answer

    const finalCorrect =
      score +
      (lastCorrect ? 1 : 0)

    if (!last) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      )

      setSelectedAnswer(null)
      setShowFeedback(false)
      setShowSuccessEffect(false)

      return
    }

    const finalScore =
      Math.round(
        (finalCorrect /
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
          finalCorrect,
        totalQuestions,
        playedLevel: level,
        nextLevel,
      })

    saveGameResult(result)

    navigate('/user/result', {
      state: result,
    })
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
              : 'Number Memory'}
          </p>

          <div className="mx-auto mt-3 flex max-w-3xl items-start justify-center gap-3">
            {isObjectGame && (
              <Search
                size={28}
                className="mt-1 shrink-0 text-[#2f8f92]"
              />
            )}

            <h1 className="text-2xl font-black leading-relaxed text-[#17345f] sm:text-3xl">
              {question.question}
            </h1>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-[#e8f4f2] px-4 py-2 text-sm font-bold text-[#2f8f92]">
              Level {level}
            </span>

            <span className="rounded-full bg-[#fff4df] px-4 py-2 text-sm font-bold text-[#a96f1c]">
              Question {currentQuestion + 1} /{' '}
              {isObjectGame
                ? QUESTIONS_PER_GAME
                : numberQuestions.length}
            </span>

            {isObjectGame && (
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold capitalize text-slate-600">
                {question.category}
              </span>
            )}
          </div>

          {isObjectGame ? (
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
              Take your time. Look carefully at each picture and choose the object you are looking for.
            </p>
          ) : (
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
              Look at the pattern and choose the number that comes next.
            </p>
          )}
        </div>

        {isObjectGame ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {objectOptions.map(
              (option, index) => {
                const isCorrect =
                  option.name ===
                  question.answer

                const isSelected =
                  option.name ===
                  selectedAnswer

                let optionClass =
                  'border-slate-200 bg-white hover:border-[#2f8f92] hover:shadow-lg'

                if (showFeedback) {
                  if (isCorrect) {
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
                    className={`relative min-h-[220px] overflow-hidden rounded-3xl border-4 transition-all duration-300 sm:min-h-[270px] ${optionClass} ${
                      showSuccessEffect &&
                      isCorrect
                        ? 'scale-[1.02] shadow-2xl ring-4 ring-green-200'
                        : ''
                    }`}
                  >
                    <img
                      src={option.image}
                      alt="Object choice"
                      className={`block h-60 w-full object-cover sm:h-72 ${
                        showSuccessEffect &&
                        isCorrect
                          ? 'animate-pulse'
                          : ''
                      }`}
                    />

                    {showFeedback &&
                      isCorrect && (
                        <div className="absolute right-3 top-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl">
                          <CheckCircle2
                            size={34}
                          />
                        </div>
                      )}

                    {showFeedback &&
                      isSelected &&
                      !isCorrect && (
                        <div className="absolute right-3 top-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-2xl font-black text-white shadow-xl">
                          ✕
                        </div>
                      )}

                    {showSuccessEffect &&
                      isCorrect && (
                        <>
                          <div className="absolute left-3 top-3 text-3xl">
                            ✨
                          </div>

                          <div className="absolute bottom-3 left-5 text-2xl">
                            ⭐
                          </div>

                          <div className="absolute bottom-3 right-5 text-2xl">
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
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {options.map(
              (option) => {
                const isCorrect =
                  option ===
                  question.answer

                const isSelected =
                  option ===
                  selectedAnswer

                let optionClass =
                  'border-slate-200 bg-white hover:border-[#2f8f92] hover:shadow-md'

                if (showFeedback) {
                  if (isCorrect) {
                    optionClass =
                      'border-green-400 bg-green-50'
                  } else if (
                    isSelected
                  ) {
                    optionClass =
                      'border-red-400 bg-red-50'
                  } else {
                    optionClass =
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
                    className={`flex min-h-[90px] items-center justify-between rounded-3xl border-2 p-6 transition-all duration-300 ${optionClass} ${
                      showSuccessEffect &&
                      isCorrect
                        ? 'scale-[1.02] shadow-xl ring-4 ring-green-200'
                        : ''
                    }`}
                  >
                    <span className="text-3xl font-black text-[#17345f]">
                      {option}
                    </span>

                    {showFeedback &&
                      isCorrect && (
                        <CheckCircle2
                          size={32}
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
                  </button>
                )
              }
            )}
          </div>
        )}

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
                <CheckCircle2 size={24} />
                Correct! Well done.
              </div>
            ) : (
              <div className="rounded-2xl bg-red-50 p-5 text-center text-lg font-bold text-red-700">
                Not quite.

                <span className="ml-1 text-green-700">
                  Correct answer:{' '}
                  {question.answer}
                </span>
              </div>
            )}

            <Button
              className="mt-4 w-full"
              onClick={nextQuestion}
            >
              {currentQuestion ===
              (isObjectGame
                ? QUESTIONS_PER_GAME
                : numberQuestions.length) -
                1
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

        <LevelBadge level={level} />
      </div>
    </div>
  )
}
