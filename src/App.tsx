import { useMemo, useState } from "react";
import "./App.css";

type GameKind = "Icebreaker" | "Group Game";
type PlannerTab = "games" | "food";
type Language = "en" | "pt";

type Game = {
  name: string;
  kind: GameKind;
  time: string;
  players: string;
  tags: string[];
  source?: string;
  materials: string[];
  steps: string[];
  tips: string[];
};

const tags = [
  "All",
  "Low prep",
  "High energy",
  "Discussion",
  "Teamwork",
  "Printable",
  "Indoor",
  "Outdoor",
  "Strategy",
  "No supplies",
];

const copy = {
  en: {
    title: "Event Planner",
    subtitle: "Plan games, icebreakers, and practical details for youth events and church gatherings.",
    eventSetup: "Event Setup",
    date: "Date",
    people: "People",
    totalMinutes: "Total Minutes",
    theme: "Theme",
    themePlaceholder: "Friendship, service, trust...",
    summaryTheme: "Theme",
    getNewGames: "Get New Games",
    printPlan: "Print Plan Sheet",
    games: "Games",
    foodSetup: "Food Setup",
    sourceNotePrefix: "Game library note:",
    sourceNote: "This library now mixes starter activities with sourced titles from your PDF books. We can keep expanding and refining each sourced game with full instructions.",
    sourceLabel: "Source",
    gameFilters: "Game Filters",
    icebreakers: "icebreakers",
    groupGames: "group games",
    materials: "Materials",
    leaderTip: "Leader tip",
    printableHelpers: "Printable Helpers",
    mafia8: "Mafia Role Cards (8)",
    mafia12: "Mafia Role Cards (12)",
    buffer: "Includes a 10% buffer",
    slicesPerPerson: "Slices Per Person",
    slicesPerPizza: "Slices Per Pizza",
    sodaPerPerson: "Soda Servings Per Person",
    waterPerPerson: "Water Bottles Per Person",
    chipServings: "Chip Servings Per Bag",
    dessertServings: "Dessert Servings Per Package",
    planningCount: "Planning Count",
    pizzas: "Pizzas",
    sodas: "2-Liter Sodas",
    water: "Water Bottles",
    chips: "Chip Bags",
    desserts: "Dessert Packs",
    shoppingList: "Shopping List",
    pizzaItem: "pizzas",
    sodaItem: "two-liter sodas",
    waterItem: "water bottles",
    chipItem: "bags of chips",
    dessertItem: "dessert packages",
    icebreakerKind: "Icebreaker",
    groupGameKind: "Group Game",
    all: "All",
  },
  pt: {
    title: "Planejador de Eventos",
    subtitle: "Planeje jogos, quebra-gelos e detalhes práticos para eventos de jovens e reuniões da igreja.",
    eventSetup: "Configuração do Evento",
    date: "Data",
    people: "Pessoas",
    totalMinutes: "Minutos Totais",
    theme: "Tema",
    themePlaceholder: "Amizade, serviço, confiança...",
    summaryTheme: "Tema",
    getNewGames: "Novos Jogos",
    printPlan: "Imprimir Plano",
    games: "Jogos",
    foodSetup: "Comida",
    sourceNotePrefix: "Nota sobre os jogos:",
    sourceNote: "Esta biblioteca agora mistura jogos iniciais com titulos extraidos dos seus PDFs. Podemos continuar ampliando e refinando cada jogo com instrucoes completas.",
    sourceLabel: "Fonte",
    gameFilters: "Filtros de Jogos",
    icebreakers: "quebra-gelos",
    groupGames: "jogos em grupo",
    materials: "Materiais",
    leaderTip: "Dica para o líder",
    printableHelpers: "Materiais para Imprimir",
    mafia8: "Cartas de Máfia (8)",
    mafia12: "Cartas de Máfia (12)",
    buffer: "Inclui uma margem de 10%",
    slicesPerPerson: "Fatias por Pessoa",
    slicesPerPizza: "Fatias por Pizza",
    sodaPerPerson: "Porções de Refrigerante por Pessoa",
    waterPerPerson: "Garrafas de Água por Pessoa",
    chipServings: "Porções por Pacote de Salgadinhos",
    dessertServings: "Porções por Pacote de Sobremesa",
    planningCount: "Contagem com Margem",
    pizzas: "Pizzas",
    sodas: "Refrigerantes 2L",
    water: "Garrafas de Água",
    chips: "Pacotes de Salgadinhos",
    desserts: "Pacotes de Sobremesa",
    shoppingList: "Lista de Compras",
    pizzaItem: "pizzas",
    sodaItem: "refrigerantes de 2 litros",
    waterItem: "garrafas de água",
    chipItem: "pacotes de salgadinhos",
    dessertItem: "pacotes de sobremesa",
    icebreakerKind: "Quebra-gelo",
    groupGameKind: "Jogo em Grupo",
    all: "Todos",
  },
} as const;

const tagLabels: Record<Language, Record<string, string>> = {
  en: {
    All: "All",
    "Low prep": "Low prep",
    "High energy": "High energy",
    Discussion: "Discussion",
    Teamwork: "Teamwork",
    Printable: "Printable",
    Indoor: "Indoor",
    Outdoor: "Outdoor",
    Strategy: "Strategy",
    "No supplies": "No supplies",
  },
  pt: {
    All: "Todos",
    "Low prep": "Pouco preparo",
    "High energy": "Alta energia",
    Discussion: "Discussão",
    Teamwork: "Trabalho em equipe",
    Printable: "Imprimível",
    Indoor: "Dentro",
    Outdoor: "Fora",
    Strategy: "Estratégia",
    "No supplies": "Sem materiais",
  },
};

const starterIcebreakers: Game[] = [
  ["Two Truths and a Lie", ["Low prep", "Discussion", "Indoor", "No supplies"]],
  ["Speed Friending", ["High energy", "Discussion", "Indoor", "No supplies"]],
  ["Would You Rather Corners", ["High energy", "Discussion", "Indoor", "No supplies"]],
  ["Human Bingo", ["Printable", "Discussion", "Indoor"]],
  ["Name That Tune", ["High energy", "Indoor"]],
  ["Desert Island Pick", ["Low prep", "Discussion", "Indoor", "No supplies"]],
  ["One Word Story", ["Low prep", "Teamwork", "Indoor", "No supplies"]],
  ["Memory Lane", ["Discussion", "Indoor", "No supplies"]],
  ["Hot Seat", ["Discussion", "Indoor", "No supplies"]],
  ["Categories Challenge", ["High energy", "Indoor", "No supplies"]],
  ["Personal Trivia", ["Printable", "Discussion", "Indoor"]],
  ["Telephone Pictionary", ["Teamwork", "Indoor"]],
  ["Human Rock Paper Scissors", ["High energy", "Teamwork", "Indoor", "No supplies"]],
  ["Signature Hunt", ["Printable", "High energy", "Indoor"]],
  ["Rhythm Name Game", ["High energy", "Indoor", "No supplies"]],
  ["Life Map", ["Discussion", "Indoor"]],
  ["Mystery Box", ["Low prep", "Indoor"]],
  ["If I Were", ["Discussion", "Indoor", "No supplies"]],
  ["Silent Line-Up", ["Teamwork", "Indoor", "No supplies"]],
  ["Emoji Check-In", ["Low prep", "Discussion", "Indoor"]],
  ["This or That Corners", ["High energy", "Discussion", "Indoor", "No supplies"]],
  ["Common Ground Sprint", ["High energy", "Teamwork", "Indoor", "No supplies"]],
  ["Compliment Circle", ["Low prep", "Discussion", "Indoor", "No supplies"]],
  ["Rapid Fire Q&A", ["High energy", "Discussion", "Indoor", "No supplies"]],
  ["Show and Tell", ["Discussion", "Indoor"]],
  ["Pass the Clap", ["High energy", "Teamwork", "No supplies"]],
  ["Story Cubes", ["Low prep", "Discussion", "Indoor"]],
  ["Find Someone Who", ["Printable", "High energy", "Indoor"]],
  ["Question Ball Toss", ["High energy", "Discussion", "Indoor"]],
  ["Four Corners", ["High energy", "Discussion", "Indoor", "No supplies"]],
].map(([name, gameTags]) => ({
  name: name as string,
  kind: "Icebreaker",
  source: "Starter library",
  time: "8-15 min",
  players: "6-30",
  tags: gameTags as string[],
  materials: (gameTags as string[]).includes("Printable") ? ["Printed sheets", "Pens"] : ["Open space", "Optional timer"],
  steps: [
    "Explain the prompt and model one quick example.",
    "Run one short practice round so everyone understands the rhythm.",
    "Play 2-4 rounds, changing partners or groups between rounds.",
    "Close with one quick reflection or favorite answer.",
  ],
  tips: ["Keep the first round easy.", "Move on before the energy dips."],
}));

const sourcedIcebreakers: Game[] = [
  "Birds of a Feather Flock Together",
  "Emotional Communication",
  "Frozen T-Shirts",
  "Meet Your Colleagues",
  "Name That Flower",
  "Race for the Runts",
  "Simon Says",
  "Splash Balls",
].map((name) => ({
  name,
  kind: "Icebreaker",
  source: "Warm ups, mixers, crowd breakers.pdf",
  time: "8-15 min",
  players: "6-30",
  tags: ["Discussion", "Indoor", "Low prep"],
  materials: ["Open space", "Optional prompt cards"],
  steps: [
    "Introduce the activity and give one example.",
    "Invite participants to respond, move, or partner up based on the prompt.",
    "Keep the pace quick so the whole room stays involved.",
    "Close with one short connection question.",
  ],
  tips: ["Use these early in the meeting to warm up the room.", "Choose volunteers who will enjoy being up front when needed."],
}));

const icebreakers: Game[] = [...starterIcebreakers, ...sourcedIcebreakers];

const sourcedGroupGames: Game[] = [
  "Battle Ball With a Twist",
  "Black Light Hockey",
  "Dash",
  "Dive In",
  "Donkey Dodgeball",
  "Double Trouble",
  "Extreme Elimination",
  "Fake Out",
  "Gotcha",
  "Hockey Encounter",
  "Hot Potato Tag",
  "Huddle Up",
  "Marshmallow Drop",
  "The Noodle Game",
  "Pillow Fight",
  "Shuffle Your Buns",
  "Silly String Elimination",
  "Silly String War",
  "Slime Dodgeball",
  "Stuff It",
  "Toilet Paper Chaos",
  "Toilet Paper Slam",
  "Total Elimination",
  "The Tower Competition",
  "Tube Duel",
  "Tunnel Vision",
  "Ultimate Dodgeball",
  "Whipped",
].map((name) => ({
  name,
  kind: "Group Game",
  source: "28-Just-for-Fun-Youth-Group-Games.pdf",
  time: "20-40 min",
  players: "10-35",
  tags: ["High energy", "Teamwork", "Indoor"],
  materials: ["See source PDF", "Open play space", "Timer"],
  steps: [
    "Review the source PDF before the event for full setup and safety notes.",
    "Prepare the play area and supplies before students arrive.",
    "Explain boundaries, scoring, and stop signal before starting.",
    "Run short rounds and reset teams between rounds.",
  ],
  tips: ["Use extra leaders for high-energy games.", "Choose a lower-contact game when space is tight."],
}));

const sourcedIndoorGames: Game[] = [
  "Broom Barrel Ball",
  "Crazy Croquet",
  "Dodge 'em Pit",
  "Human Boggle",
  "Large Group Battleship",
  "Playdoughnary",
  "Tag-a-Lot",
  "Tic-Tac-Challenge",
  "Tongue Twister Challenge",
  "Video Concentration",
].map((name) => ({
  name,
  kind: "Group Game",
  source: "Indoor games and activities.pdf",
  time: "20-35 min",
  players: "8-30",
  tags: ["Indoor", "Teamwork", "Low prep"],
  materials: ["See source PDF", "Room setup", "Timer"],
  steps: [
    "Review the source page for exact rules and setup.",
    "Set the room layout and explain objectives clearly.",
    "Run short rounds and rotate participants.",
    "Debrief with one key takeaway.",
  ],
  tips: ["Use this set when weather or space keeps you indoors."],
}));

const sourcedOutdoorGames: Game[] = [
  "Hula-Hoop Group Relay",
  "One-Pitch Softball",
  "Wethead",
  "Rain in the Face Relay",
  "Spider Relay",
  "Frisbee Relay",
  "Bible Scavenger Hunt",
  "Tube Tug",
  "Centipede Relay",
  "Team Dodgeball",
  "Blindfold Football",
  "Fireman's Fun Relay",
  "Greedy Ball",
].map((name) => ({
  name,
  kind: "Group Game",
  source: "Outdoor games and activities.pdf",
  time: "20-40 min",
  players: "10-35",
  tags: ["Outdoor", "High energy", "Teamwork"],
  materials: ["See source PDF", "Field setup", "Safety boundary markers"],
  steps: [
    "Read the source game page and prep all required equipment.",
    "Walk players through boundaries, safety, and win conditions.",
    "Run timed rounds and rotate teams.",
    "Record scores and announce results.",
  ],
  tips: ["Prioritize hydration and clear stop signals for outdoor rounds."],
}));

const sourcedYouthGroupGames: Game[] = [
  "Fireman vs. Police",
  "Paper Plate Shuffle",
  "Line It Up",
  "Spider Fight",
  "Ninja",
  "Lettuce Bowling",
  "Mine Field",
  "Longest Line",
  "Clothes Pin Tag",
  "Triangle Tag",
  "Toe Fencing",
  "Human Battleship",
  "Quick Draw",
].map((name) => ({
  name,
  kind: "Group Game",
  source: "Youth Group Fun and Games.pdf",
  time: "15-30 min",
  players: "8-30",
  tags: ["Indoor", "High energy", "Teamwork"],
  materials: ["See source PDF", "Simple props"],
  steps: [
    "Use the source index and page references to choose your game.",
    "Set clear rules and one visible stop signal.",
    "Play multiple short rounds to keep pace high.",
    "Close with a quick reflection or celebration.",
  ],
  tips: ["Great for weekly variety when you want fast setup and rotation."],
}));

const groupGames: Game[] = [
  {
    name: "Mafia/Werewolf",
    kind: "Group Game",
    source: "Starter library",
    time: "25-40 min",
    players: "8-20",
    tags: ["Printable", "Strategy", "Indoor", "Discussion"],
    materials: ["Printable role cards", "Timer", "Moderator script"],
    steps: [
      "Assign a moderator and hand out roles secretly.",
      "Run night phase with eyes closed and role actions.",
      "Run day phase with discussion, defense, and one group vote.",
      "Repeat until villagers identify the werewolves or werewolves take over.",
    ],
    tips: ["Use a 2-minute day timer.", "Start with simple role sets for new players."],
  },
  {
    name: "Escape Room Challenge",
    kind: "Group Game",
    source: "Starter library",
    time: "35-50 min",
    players: "8-24",
    tags: ["Teamwork", "Strategy", "Printable", "Indoor"],
    materials: ["4 clue stations", "Envelopes", "Code sheet", "Final puzzle"],
    steps: [
      "Split into teams of 4-6 and assign each a starting clue.",
      "Each solved clue gives one key for the final code.",
      "Allow one hint every 8 minutes.",
      "First team to solve the final code wins.",
    ],
    tips: ["Dry-run clues once before meeting.", "Prepare one backup hint if teams stall."],
  },
  {
    name: "Minute to Win It",
    kind: "Group Game",
    source: "Starter library",
    time: "20-35 min",
    players: "10-30",
    tags: ["High energy", "Low prep", "Indoor", "Teamwork"],
    materials: ["Cups", "Ping pong balls", "Tape", "Timer"],
    steps: [
      "Set up 4 one-minute challenge stations.",
      "Players rotate by round as teams or individuals.",
      "Score each round and keep a visible leaderboard.",
      "Highest total points wins.",
    ],
    tips: ["Use easy reset stations.", "Play music between rounds."],
  },
  {
    name: "Capture the Flag Mini",
    kind: "Group Game",
    source: "Starter library",
    time: "25-40 min",
    players: "10-30",
    tags: ["High energy", "Teamwork", "Outdoor"],
    materials: ["Two flags", "Boundary markers"],
    steps: ["Mark two bases and a center boundary.", "Split into teams and explain jail/freeing rules.", "Play 8-minute rounds.", "Switch sides and play best of three."],
    tips: ["Keep boundaries clear.", "Use soft markers instead of hidden flags for younger groups."],
  },
  {
    name: "Blindfold Obstacle Relay",
    kind: "Group Game",
    source: "Starter library",
    time: "20-30 min",
    players: "8-24",
    tags: ["Teamwork", "Indoor", "High energy"],
    materials: ["Blindfolds", "Soft obstacles", "Timer"],
    steps: ["Create a safe obstacle path.", "Pair each blindfolded player with a guide.", "Guides direct without touching.", "Fastest safe completion wins."],
    tips: ["Use soft obstacles only.", "Reward communication more than speed."],
  },
  {
    name: "Balloon Keep-Up",
    kind: "Group Game",
    source: "Starter library",
    time: "15-25 min",
    players: "8-30",
    tags: ["High energy", "Low prep", "Indoor", "Teamwork"],
    materials: ["Balloons", "Timer"],
    steps: ["Split into teams.", "Add one balloon every 30 seconds.", "No player can hit twice in a row.", "Team with the longest streak wins."],
    tips: ["Use several smaller teams for large groups.", "Have extra balloons ready."],
  },
  {
    name: "Mission Impossible Laser Maze",
    kind: "Group Game",
    source: "Starter library",
    time: "25-40 min",
    players: "8-24",
    tags: ["High energy", "Teamwork", "Indoor"],
    materials: ["String or crepe paper", "Tape", "Timer"],
    steps: ["Tape string across a hallway or room.", "Teams cross without touching lasers.", "Add a penalty for every touch.", "Lowest score wins."],
    tips: ["Keep paths safe and visible.", "Let teams plan before the clock starts."],
  },
  {
    name: "Collaborative Drawing Relay",
    kind: "Group Game",
    source: "Starter library",
    time: "20-30 min",
    players: "8-28",
    tags: ["Teamwork", "Indoor", "Low prep"],
    materials: ["Paper", "Markers", "Prompt cards"],
    steps: ["Give each team the same drawing prompt.", "One player draws for 20 seconds, then passes.", "No talking while drawing.", "Teams guess the final image."],
    tips: ["Use funny prompts.", "Let every player draw at least once."],
  },
  {
    name: "Trust Walk",
    kind: "Group Game",
    source: "Starter library",
    time: "20-30 min",
    players: "8-24",
    tags: ["Teamwork", "Discussion", "Indoor"],
    materials: ["Blindfolds", "Open space"],
    steps: ["Pair players.", "One guide leads one blindfolded partner through a simple path.", "Switch roles.", "Debrief what made trust easier or harder."],
    tips: ["Keep the course simple.", "Frame it as communication practice."],
  },
  {
    name: "Silent Speed Stacking",
    kind: "Group Game",
    source: "Starter library",
    time: "15-25 min",
    players: "8-30",
    tags: ["Teamwork", "Indoor", "Low prep"],
    materials: ["Plastic cups", "Timer"],
    steps: ["Give each team equal cups.", "Teams build the tallest tower without talking.", "Restart if it falls.", "Measure after 3 minutes."],
    tips: ["Add a second round where talking is allowed.", "Compare what changed."],
  },
  {
    name: "Human Knot",
    kind: "Group Game",
    source: "Starter library",
    time: "15-25 min",
    players: "8-20",
    tags: ["Teamwork", "Indoor", "No supplies"],
    materials: ["Open space"],
    steps: ["Stand in a tight circle.", "Each person grabs two different hands.", "Untangle without letting go.", "Celebrate the best time."],
    tips: ["Use groups of 8-10.", "Pause if arms get uncomfortable."],
  },
  {
    name: "Survival Ranking",
    kind: "Group Game",
    source: "Starter library",
    time: "25-35 min",
    players: "8-30",
    tags: ["Discussion", "Strategy", "Teamwork", "Printable"],
    materials: ["Scenario sheets", "Pens"],
    steps: ["Give teams the same survival scenario.", "Rank items individually first.", "Rank again as a team.", "Compare how group decisions changed the answers."],
    tips: ["Choose age-appropriate scenarios.", "Debrief listening and compromise."],
  },
  ...sourcedGroupGames,
  ...sourcedIndoorGames,
  ...sourcedOutdoorGames,
  ...sourcedYouthGroupGames,
];

function pickOne<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function roleSet(playerCount: number) {
  if (playerCount <= 8) {
    return ["Werewolf", "Werewolf", "Seer", "Doctor", "Villager", "Villager", "Villager", "Villager"];
  }
  return [
    "Werewolf",
    "Werewolf",
    "Werewolf",
    "Seer",
    "Doctor",
    "Bodyguard",
    "Villager",
    "Villager",
    "Villager",
    "Villager",
    "Villager",
    "Villager",
  ];
}

function filterByTag(games: Game[], selectedTag: string) {
  return selectedTag === "All" ? games : games.filter((game) => game.tags.includes(selectedTag));
}

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<PlannerTab>("games");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendeeCount, setAttendeeCount] = useState(14);
  const [duration, setDuration] = useState(75);
  const [theme, setTheme] = useState("");
  const [slicesPerPerson, setSlicesPerPerson] = useState(3);
  const [slicesPerPizza, setSlicesPerPizza] = useState(8);
  const [sodaServingsPerPerson, setSodaServingsPerPerson] = useState(2);
  const [waterPerPerson, setWaterPerPerson] = useState(1);
  const [chipServingsPerBag, setChipServingsPerBag] = useState(10);
  const [dessertServingsPerPackage, setDessertServingsPerPackage] = useState(12);
  const [selectedTag, setSelectedTag] = useState("All");
  const [icebreaker, setIcebreaker] = useState<Game>(() => pickOne(icebreakers));
  const [groupGame, setGroupGame] = useState<Game>(() => pickOne(groupGames));
  const text = copy[language];

  const filteredIcebreakers = useMemo(() => filterByTag(icebreakers, selectedTag), [selectedTag]);
  const filteredGroupGames = useMemo(() => filterByTag(groupGames, selectedTag), [selectedTag]);

  const meetingSummary = useMemo(
    () => `${date} | ${text.people}: ${attendeeCount} | ${text.totalMinutes}: ${duration} | ${text.summaryTheme}: ${theme || "General"}`,
    [attendeeCount, date, duration, text.people, text.summaryTheme, text.totalMinutes, theme],
  );

  const foodEstimate = useMemo(() => {
    const safeAttendeeCount = Math.max(0, attendeeCount || 0);
    const safeSlicesPerPerson = Math.max(0, slicesPerPerson || 0);
    const safeSlicesPerPizza = Math.max(1, slicesPerPizza || 1);
    const safeSodaServingsPerPerson = Math.max(0, sodaServingsPerPerson || 0);
    const safeWaterPerPerson = Math.max(0, waterPerPerson || 0);
    const safeChipServingsPerBag = Math.max(1, chipServingsPerBag || 1);
    const safeDessertServingsPerPackage = Math.max(1, dessertServingsPerPackage || 1);
    const peopleWithBuffer = Math.ceil(safeAttendeeCount * 1.1);
    const pizzaCount = Math.ceil((peopleWithBuffer * safeSlicesPerPerson) / safeSlicesPerPizza);
    const twoLiterSodas = Math.ceil((peopleWithBuffer * safeSodaServingsPerPerson) / 5.6);
    const waterBottles = Math.ceil(peopleWithBuffer * safeWaterPerPerson);
    const chipBags = Math.ceil(peopleWithBuffer / safeChipServingsPerBag);
    const dessertPackages = Math.ceil(peopleWithBuffer / safeDessertServingsPerPackage);

    return {
      peopleWithBuffer,
      pizzaCount,
      twoLiterSodas,
      waterBottles,
      chipBags,
      dessertPackages,
    };
  }, [
    attendeeCount,
    chipServingsPerBag,
    dessertServingsPerPackage,
    slicesPerPerson,
    slicesPerPizza,
    sodaServingsPerPerson,
    waterPerPerson,
  ]);

  function getNewGames(tag = selectedTag) {
    const icePool = filterByTag(icebreakers, tag);
    const groupPool = filterByTag(groupGames, tag);
    setIcebreaker(pickOne(icePool.length ? icePool : icebreakers));
    setGroupGame(pickOne(groupPool.length ? groupPool : groupGames));
  }

  function selectTag(tag: string) {
    setSelectedTag(tag);
    getNewGames(tag);
  }

  function printPlan() {
    window.print();
  }

  function printMafiaCards(size: 8 | 12) {
    const cards = roleSet(size);
    const html = `
      <html><head><title>Mafia Cards</title><style>
      body{font-family:Arial,sans-serif;padding:18px}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .card{border:1px dashed #222;border-radius:8px;padding:10px;min-height:150px}
      </style></head><body>
      <h1>Mafia/Werewolf Role Cards (${size} Players)</h1>
      <p>Cut and distribute face-down.</p>
      <div class="grid">
      ${cards.map((role, i) => `<div class="card"><h3>Card ${i + 1}</h3><h2>${role}</h2></div>`).join("")}
      </div></body></html>
    `;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }

  function renderGame(game: Game) {
    const kindLabel = game.kind === "Icebreaker" ? text.icebreakerKind : text.groupGameKind;

    return (
      <>
        <div className="card-header">
          <div>
            <p className="eyebrow">{kindLabel}</p>
            <h3>{game.name}</h3>
          </div>
          <span className="time-chip">{game.time}</span>
        </div>
        <p className="meta">{game.players}</p>
        {game.source ? <p className="source-meta"><strong>{text.sourceLabel}:</strong> {game.source}</p> : null}
        <div className="tag-row compact">
          {game.tags.map((tag) => (
            <span className="tag-label" key={tag}>{tagLabels[language][tag]}</span>
          ))}
        </div>
        <p><strong>{text.materials}:</strong> {game.materials.join(", ")}</p>
        <ol>{game.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p className="tip"><strong>{text.leaderTip}:</strong> {game.tips[0]}</p>
      </>
    );
  }

  return (
    <main className="app">
      <div className="top-controls">
        <div className="language-toggle" aria-label="Language switcher">
          <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} type="button">EN</button>
          <button className={language === "pt" ? "active" : ""} onClick={() => setLanguage("pt")} type="button">PT</button>
        </div>
        <div className="version-badge">v1</div>
      </div>

      <section className="hero">
        <h1>{text.title}</h1>
        <p>{text.subtitle}</p>
      </section>

      <section className="panel">
        <h2>{text.eventSetup}</h2>
        <div className="grid">
          <label>
            {text.date}
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label>
            {text.people}
            <input type="number" min={4} value={attendeeCount} onChange={(event) => setAttendeeCount(Number(event.target.value))} />
          </label>
          <label>
            {text.totalMinutes}
            <input type="number" min={30} value={duration} onChange={(event) => setDuration(Number(event.target.value))} />
          </label>
          <label className="wide">
            {text.theme}
            <input placeholder={text.themePlaceholder} value={theme} onChange={(event) => setTheme(event.target.value)} />
          </label>
        </div>
        <p className="summary">{meetingSummary}</p>
        <div className="row">
          <button onClick={() => getNewGames()}>{text.getNewGames}</button>
          <button className="secondary" onClick={printPlan}>{text.printPlan}</button>
        </div>
      </section>

      <nav className="tabs" aria-label="Planner sections">
        <button className={activeTab === "games" ? "tab active" : "tab"} onClick={() => setActiveTab("games")} type="button">
          {text.games}
        </button>
        <button className={activeTab === "food" ? "tab active" : "tab"} onClick={() => setActiveTab("food")} type="button">
          {text.foodSetup}
        </button>
      </nav>

      {activeTab === "games" ? (
        <>
          <section className="panel source-note">
            <strong>{text.sourceNotePrefix}</strong> {text.sourceNote}
          </section>

          <section className="panel">
            <div className="filter-heading">
              <h2>{text.gameFilters}</h2>
              <p>{filteredIcebreakers.length} {text.icebreakers} | {filteredGroupGames.length} {text.groupGames}</p>
            </div>
            <div className="tag-row">
              {tags.map((tag) => (
                <button
                  className={tag === selectedTag ? "tag active" : "tag"}
                  key={tag}
                  onClick={() => selectTag(tag)}
                  type="button"
                >
                  {tagLabels[language][tag]}
                </button>
              ))}
            </div>
          </section>

          <section className="cards">
            <article className="panel game-card">{renderGame(icebreaker)}</article>
            <article className="panel game-card">{renderGame(groupGame)}</article>
          </section>

          <section className="panel">
            <h2>{text.printableHelpers}</h2>
            <div className="row">
              <button onClick={() => printMafiaCards(8)}>{text.mafia8}</button>
              <button onClick={() => printMafiaCards(12)}>{text.mafia12}</button>
            </div>
          </section>
        </>
      ) : (
        <section className="panel">
          <div className="filter-heading">
            <h2>{text.foodSetup}</h2>
            <p>{text.buffer}</p>
          </div>

          <div className="grid">
            <label>
              {text.slicesPerPerson}
              <input type="number" min={1} step={0.5} value={slicesPerPerson} onChange={(event) => setSlicesPerPerson(Number(event.target.value))} />
            </label>
            <label>
              {text.slicesPerPizza}
              <input type="number" min={4} value={slicesPerPizza} onChange={(event) => setSlicesPerPizza(Number(event.target.value))} />
            </label>
            <label>
              {text.sodaPerPerson}
              <input type="number" min={0} step={0.5} value={sodaServingsPerPerson} onChange={(event) => setSodaServingsPerPerson(Number(event.target.value))} />
            </label>
            <label>
              {text.waterPerPerson}
              <input type="number" min={0} step={0.5} value={waterPerPerson} onChange={(event) => setWaterPerPerson(Number(event.target.value))} />
            </label>
            <label>
              {text.chipServings}
              <input type="number" min={1} value={chipServingsPerBag} onChange={(event) => setChipServingsPerBag(Number(event.target.value))} />
            </label>
            <label>
              {text.dessertServings}
              <input type="number" min={1} value={dessertServingsPerPackage} onChange={(event) => setDessertServingsPerPackage(Number(event.target.value))} />
            </label>
          </div>

          <div className="food-results">
            <article>
              <span>{text.planningCount}</span>
              <strong>{foodEstimate.peopleWithBuffer}</strong>
            </article>
            <article>
              <span>{text.pizzas}</span>
              <strong>{foodEstimate.pizzaCount}</strong>
            </article>
            <article>
              <span>{text.sodas}</span>
              <strong>{foodEstimate.twoLiterSodas}</strong>
            </article>
            <article>
              <span>{text.water}</span>
              <strong>{foodEstimate.waterBottles}</strong>
            </article>
            <article>
              <span>{text.chips}</span>
              <strong>{foodEstimate.chipBags}</strong>
            </article>
            <article>
              <span>{text.desserts}</span>
              <strong>{foodEstimate.dessertPackages}</strong>
            </article>
          </div>

          <div className="shopping-list">
            <h3>{text.shoppingList}</h3>
            <ul>
              <li>{foodEstimate.pizzaCount} {text.pizzaItem}</li>
              <li>{foodEstimate.twoLiterSodas} {text.sodaItem}</li>
              <li>{foodEstimate.waterBottles} {text.waterItem}</li>
              <li>{foodEstimate.chipBags} {text.chipItem}</li>
              <li>{foodEstimate.dessertPackages} {text.dessertItem}</li>
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
