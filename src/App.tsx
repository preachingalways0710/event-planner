import { useMemo, useState } from "react";
import "./App.css";

type GameKind = "Icebreaker" | "Group Game";
type PlannerTab = "games" | "food";

type Game = {
  name: string;
  kind: GameKind;
  time: string;
  players: string;
  tags: string[];
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

const icebreakers: Game[] = [
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

const groupGames: Game[] = [
  {
    name: "Mafia/Werewolf",
    kind: "Group Game",
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
    time: "25-35 min",
    players: "8-30",
    tags: ["Discussion", "Strategy", "Teamwork", "Printable"],
    materials: ["Scenario sheets", "Pens"],
    steps: ["Give teams the same survival scenario.", "Rank items individually first.", "Rank again as a team.", "Compare how group decisions changed the answers."],
    tips: ["Choose age-appropriate scenarios.", "Debrief listening and compromise."],
  },
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

  const filteredIcebreakers = useMemo(() => filterByTag(icebreakers, selectedTag), [selectedTag]);
  const filteredGroupGames = useMemo(() => filterByTag(groupGames, selectedTag), [selectedTag]);

  const meetingSummary = useMemo(
    () => `${date} | People: ${attendeeCount} | Total: ${duration} min | Theme: ${theme || "General"}`,
    [date, attendeeCount, duration, theme],
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
    return (
      <>
        <div className="card-header">
          <div>
            <p className="eyebrow">{game.kind}</p>
            <h3>{game.name}</h3>
          </div>
          <span className="time-chip">{game.time}</span>
        </div>
        <p className="meta">{game.players}</p>
        <div className="tag-row compact">
          {game.tags.map((tag) => (
            <span className="tag-label" key={tag}>{tag}</span>
          ))}
        </div>
        <p><strong>Materials:</strong> {game.materials.join(", ")}</p>
        <ol>{game.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p className="tip"><strong>Leader tip:</strong> {game.tips[0]}</p>
      </>
    );
  }

  return (
    <main className="app">
      <div className="version-badge">v1</div>

      <section className="hero">
        <h1>Event Planner</h1>
        <p>Plan games, icebreakers, and practical details for youth events and church gatherings.</p>
      </section>

      <section className="panel">
        <h2>Event Setup</h2>
        <div className="grid">
          <label>
            Date
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label>
            People
            <input type="number" min={4} value={attendeeCount} onChange={(event) => setAttendeeCount(Number(event.target.value))} />
          </label>
          <label>
            Total Minutes
            <input type="number" min={30} value={duration} onChange={(event) => setDuration(Number(event.target.value))} />
          </label>
          <label className="wide">
            Theme
            <input placeholder="Friendship, service, trust..." value={theme} onChange={(event) => setTheme(event.target.value)} />
          </label>
        </div>
        <p className="summary">{meetingSummary}</p>
        <div className="row">
          <button onClick={() => getNewGames()}>Get New Games</button>
          <button className="secondary" onClick={printPlan}>Print Plan Sheet</button>
        </div>
      </section>

      <nav className="tabs" aria-label="Planner sections">
        <button className={activeTab === "games" ? "tab active" : "tab"} onClick={() => setActiveTab("games")} type="button">
          Games
        </button>
        <button className={activeTab === "food" ? "tab active" : "tab"} onClick={() => setActiveTab("food")} type="button">
          Food Setup
        </button>
      </nav>

      {activeTab === "games" ? (
        <>
          <section className="panel source-note">
            <strong>Game library note:</strong> These are starter activities, not sourced from your PDF books yet. Add your PDFs to the project and we can turn them into a tagged, sourced game library.
          </section>

          <section className="panel">
            <div className="filter-heading">
              <h2>Game Filters</h2>
              <p>{filteredIcebreakers.length} icebreakers | {filteredGroupGames.length} group games</p>
            </div>
            <div className="tag-row">
              {tags.map((tag) => (
                <button
                  className={tag === selectedTag ? "tag active" : "tag"}
                  key={tag}
                  onClick={() => selectTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section className="cards">
            <article className="panel game-card">{renderGame(icebreaker)}</article>
            <article className="panel game-card">{renderGame(groupGame)}</article>
          </section>

          <section className="panel">
            <h2>Printable Helpers</h2>
            <div className="row">
              <button onClick={() => printMafiaCards(8)}>Mafia Role Cards (8)</button>
              <button onClick={() => printMafiaCards(12)}>Mafia Role Cards (12)</button>
            </div>
          </section>
        </>
      ) : (
        <section className="panel">
          <div className="filter-heading">
            <h2>Food Setup</h2>
            <p>Includes a 10% buffer</p>
          </div>

          <div className="grid">
            <label>
              Slices Per Person
              <input type="number" min={1} step={0.5} value={slicesPerPerson} onChange={(event) => setSlicesPerPerson(Number(event.target.value))} />
            </label>
            <label>
              Slices Per Pizza
              <input type="number" min={4} value={slicesPerPizza} onChange={(event) => setSlicesPerPizza(Number(event.target.value))} />
            </label>
            <label>
              Soda Servings Per Person
              <input type="number" min={0} step={0.5} value={sodaServingsPerPerson} onChange={(event) => setSodaServingsPerPerson(Number(event.target.value))} />
            </label>
            <label>
              Water Bottles Per Person
              <input type="number" min={0} step={0.5} value={waterPerPerson} onChange={(event) => setWaterPerPerson(Number(event.target.value))} />
            </label>
            <label>
              Chip Servings Per Bag
              <input type="number" min={1} value={chipServingsPerBag} onChange={(event) => setChipServingsPerBag(Number(event.target.value))} />
            </label>
            <label>
              Dessert Servings Per Package
              <input type="number" min={1} value={dessertServingsPerPackage} onChange={(event) => setDessertServingsPerPackage(Number(event.target.value))} />
            </label>
          </div>

          <div className="food-results">
            <article>
              <span>Planning Count</span>
              <strong>{foodEstimate.peopleWithBuffer}</strong>
            </article>
            <article>
              <span>Pizzas</span>
              <strong>{foodEstimate.pizzaCount}</strong>
            </article>
            <article>
              <span>2-Liter Sodas</span>
              <strong>{foodEstimate.twoLiterSodas}</strong>
            </article>
            <article>
              <span>Water Bottles</span>
              <strong>{foodEstimate.waterBottles}</strong>
            </article>
            <article>
              <span>Chip Bags</span>
              <strong>{foodEstimate.chipBags}</strong>
            </article>
            <article>
              <span>Dessert Packs</span>
              <strong>{foodEstimate.dessertPackages}</strong>
            </article>
          </div>

          <div className="shopping-list">
            <h3>Shopping List</h3>
            <ul>
              <li>{foodEstimate.pizzaCount} pizzas</li>
              <li>{foodEstimate.twoLiterSodas} two-liter sodas</li>
              <li>{foodEstimate.waterBottles} water bottles</li>
              <li>{foodEstimate.chipBags} bags of chips</li>
              <li>{foodEstimate.dessertPackages} dessert packages</li>
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
