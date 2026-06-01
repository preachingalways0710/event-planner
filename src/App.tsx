import { useMemo, useState } from "react";
import "./App.css";

type Game = {
  name: string;
  time: string;
  players: string;
  materials: string[];
  steps: string[];
  tips: string[];
};

const icebreakers: Game[] = [
  "Two Truths and a Lie","Speed Friending","Would You Rather","Human Bingo","Name That Tune",
  "Desert Island Pick","One Word Story","Memory Lane","Hot Seat","Categories Challenge",
  "Personal Trivia","Telephone Pictionary","Human Rock Paper Scissors","Signature Hunt","Rhythm Name Game",
  "Life Map","Mystery Box","If I Were","Silent Line-Up","Emoji Check-In",
  "This or That Corners","Common Ground Sprint","Compliment Circle","Rapid Fire Q&A","Show and Tell",
  "Pass the Clap","Story Cubes","Find Someone Who","Question Ball Toss","Four Corners"
].map((name) => ({
  name,
  time: "8-15 min",
  players: "6-30",
  materials: ["Open space", "Optional timer"],
  steps: [
    "Explain the goal in one sentence.",
    "Run one 2-minute practice round.",
    "Play 2-4 quick rounds.",
    "Debrief with one reflection question.",
  ],
  tips: ["Keep it moving.", "End while energy is still high."],
}));

const groupGames: Game[] = [
  {
    name: "Mafia/Werewolf",
    time: "25-40 min",
    players: "8-20",
    materials: ["Printable role cards", "Timer", "Moderator script"],
    steps: [
      "Assign a moderator and hand out roles secretly.",
      "Run night phase with eyes closed and role actions.",
      "Run day phase: discuss and vote one player out.",
      "Repeat until villagers or werewolves win.",
    ],
    tips: ["Use a 2-minute day timer.", "Start with simple role sets for new players."],
  },
  {
    name: "Escape Room Challenge",
    time: "35-50 min",
    players: "8-24 (teams of 4-6)",
    materials: ["4 clue stations", "Envelopes", "Code sheet", "Final puzzle"],
    steps: [
      "Split into teams and assign each a starting clue.",
      "Each solved clue gives one key for the final code.",
      "Allow one hint every 8 minutes.",
      "First team to solve final code wins.",
    ],
    tips: ["Dry-run clues once before meeting.", "Prepare one backup hint if teams stall."],
  },
  {
    name: "Minute to Win It",
    time: "20-35 min",
    players: "10-30",
    materials: ["Cups", "Ping pong balls", "Tape", "Timer"],
    steps: [
      "Set up 4 one-minute challenge stations.",
      "Players rotate by round as teams or individuals.",
      "Score each round and keep a visible leaderboard.",
      "Highest total points wins.",
    ],
    tips: ["Use easy reset stations.", "Play music between rounds."],
  },
  ...[
    "Capture the Flag Mini","Blindfold Obstacle Relay","Balloon Keep-Up","Mission Impossible Laser Maze",
    "Collaborative Drawing Relay","Trust Walk","Silent Speed Stacking","Human Knot","Puzzle Race",
    "Group Sculpture Build","Team Memory Palace","Scavenger Hunt",
  ].map((name) => ({
    name,
    time: "20-35 min",
    players: "8-30",
    materials: ["Open space", "Simple props"],
    steps: [
      "Brief objective and safety rules.",
      "Run one test round.",
      "Play multiple rounds with score tracking.",
      "Close with team reflection.",
    ],
    tips: ["Use clear boundaries.", "Keep transitions short."],
  })),
];

function pickOne<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function roleSet(playerCount: number) {
  if (playerCount <= 8) {
    return ["Werewolf", "Werewolf", "Seer", "Doctor", "Villager", "Villager", "Villager", "Villager"];
  }
  return [
    "Werewolf", "Werewolf", "Werewolf", "Seer", "Doctor", "Bodyguard",
    "Villager", "Villager", "Villager", "Villager", "Villager", "Villager",
  ];
}

function App() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [teenCount, setTeenCount] = useState(14);
  const [duration, setDuration] = useState(75);
  const [theme, setTheme] = useState("");
  const [icebreaker, setIcebreaker] = useState<Game>(() => pickOne(icebreakers));
  const [groupGame, setGroupGame] = useState<Game>(() => pickOne(groupGames));

  const meetingSummary = useMemo(
    () => `${date} | Teens: ${teenCount} | Total: ${duration} min | Theme: ${theme || "General"}`,
    [date, teenCount, duration, theme]
  );

  function getNewGames() {
    setIcebreaker(pickOne(icebreakers));
    setGroupGame(pickOne(groupGames));
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

  return (
    <main className="app">
      <section className="hero">
        <h1>Teen Meeting Planner</h1>
        <p>Plan each month with one icebreaker, one group game, and printable handouts.</p>
      </section>

      <section className="panel">
        <h2>Monthly Setup</h2>
        <div className="grid">
          <label>
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            Teen Count
            <input type="number" min={4} value={teenCount} onChange={(e) => setTeenCount(Number(e.target.value))} />
          </label>
          <label>
            Total Minutes
            <input type="number" min={30} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
          </label>
          <label className="wide">
            Theme
            <input placeholder="Friendship, service, trust..." value={theme} onChange={(e) => setTheme(e.target.value)} />
          </label>
        </div>
        <p className="summary">{meetingSummary}</p>
        <div className="row">
          <button onClick={getNewGames}>Get New Games</button>
          <button className="secondary" onClick={printPlan}>Print Plan Sheet</button>
        </div>
      </section>

      <section className="cards">
        <article className="panel">
          <h2>Icebreaker</h2>
          <h3>{icebreaker.name}</h3>
          <p className="meta">{icebreaker.time} | {icebreaker.players}</p>
          <p><strong>Materials:</strong> {icebreaker.materials.join(", ")}</p>
          <ol>{icebreaker.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </article>
        <article className="panel">
          <h2>Group Game</h2>
          <h3>{groupGame.name}</h3>
          <p className="meta">{groupGame.time} | {groupGame.players}</p>
          <p><strong>Materials:</strong> {groupGame.materials.join(", ")}</p>
          <ol>{groupGame.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </article>
      </section>

      <section className="panel">
        <h2>Printable Helpers</h2>
        <div className="row">
          <button onClick={() => printMafiaCards(8)}>Mafia Role Cards (8)</button>
          <button onClick={() => printMafiaCards(12)}>Mafia Role Cards (12)</button>
        </div>
      </section>
    </main>
  );
}

export default App;
