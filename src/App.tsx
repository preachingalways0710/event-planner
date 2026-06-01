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
  sourcePage?: number;
  detailLevel: "detailed" | "title-only";
  materials: string[];
  steps: string[];
  tips: string[];
};

type GameLocalePack = {
  materials?: string[];
  steps?: string[];
  tips?: string[];
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
    pageLabel: "p.",
    detailDetailed: "Detailed",
    detailTitleOnly: "Title-only",
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
    pageLabel: "p.",
    detailDetailed: "Detalhado",
    detailTitleOnly: "Apenas titulo",
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

const ptGameContent: Record<string, GameLocalePack> = {
  "Battle Ball With a Twist": {
    materials: ["Bolas tipo playground ou Nerf", "Cones laranja", "Sala ampla ou quadra"],
    steps: [
      "Divida as equipes em lados opostos com linha central de cones.",
      "Posicione as bolas no centro e inicie no sinal.",
      "Jogadores arremessam para eliminar; bolas pegas eliminam quem arremessou.",
      "Use rodadas curtas e variacoes seguras para seu contexto.",
    ],
    tips: ["Mantenha regras de contato claras.", "Use lideres extras para controlar ritmo e seguranca."],
  },
  "Black Light Hockey": {
    materials: ["Tacos plastico", "Luz negra", "Colares que brilham", "Bolas macias brancas", "Gols ou cones"],
    steps: [
      "Escureca o ambiente e prepare iluminacao com marcacoes visiveis.",
      "Defina goleiros e areas de protecao perto do gol.",
      "Jogue rodadas de 5 minutos com contagem de pontos.",
      "Reorganize equipes e materiais entre rodadas.",
    ],
    tips: ["Use varios lideres adultos para manter controle.", "Bolas macias e sinal de parada claro sao essenciais."],
  },
  Dash: {
    materials: ["Cadeiras", "Musica", "Marcadores de area"],
    steps: [
      "Crie um limite de circulacao e espalhe cadeiras dentro da area.",
      "Com musica tocando, todos se movimentam pelo limite.",
      "Quando a musica parar, todos correm para uma cadeira livre.",
      "Remova cadeiras e repita ate restarem finalistas.",
    ],
    tips: ["Rodadas curtas deixam o jogo mais divertido.", "Garanta espaco seguro para corrida curta."],
  },
  "Dive In": {
    materials: ["Marshmallows", "Baldes", "Piscina ou lago"],
    steps: [
      "Espalhe marshmallows pela agua.",
      "Equipes recolhem e levam para seus baldes.",
      "Continue ate acabar os marshmallows.",
      "Conte os baldes para definir vencedores.",
    ],
    tips: ["Tenha lideres vigiando os baldes.", "Use coletes se o local exigir seguranca extra."],
  },
  "Hula-Hoop Group Relay": {
    materials: ["2 hula-hoops resistentes", "Area com duas linhas de referencia"],
    steps: [
      "Monte duas linhas separadas por cerca de 10 jardas.",
      "Primeiro jogador atravessa com o aro e busca um colega por vez.",
      "A cada ida e volta, mais um integrante entra no aro.",
      "Vence a equipe que cruzar com todos os jogadores dentro do aro.",
    ],
  },
  "One-Pitch Softball": {
    materials: ["Material de softball", "Campo marcado para variacao de uma bola"],
    steps: [
      "Use regras de uma arremessada por rebatedor por rodada.",
      "Pontue por corridas, sem contagem tradicional de eliminacoes.",
      "Mantenha ritmo rapido entre jogadas e trocas.",
      "Feche em 5 innings ou no limite de tempo.",
    ],
  },
  Wethead: {
    materials: ["Baloes de agua em cores de equipe", "Area de jogo marcada", "Plataforma baixa para lancador"],
    steps: [
      "Cada equipe tenta capturar baloes da propria cor sem estourar.",
      "Baloes capturados intactos valem pontos.",
      "Intercepte e estoure baloes da equipe rival quando possivel.",
      "Equipe com mais baloes intactos vence.",
    ],
  },
  "Rain in the Face Relay": {
    materials: ["2 baldes plastico", "Ladeira proxima de agua (piscina ou lago)"],
    steps: [
      "Jogadores em fila descem para pegar agua no balde.",
      "Ao voltar, jogam agua no rosto do proximo e passam o balde.",
      "O primeiro jogador vai para o fim da fila.",
      "Vence quando o ultimo jogador entra na agua com o balde.",
    ],
  },
  "Birds of a Feather Flock Together": {
    materials: ["Espaco aberto"],
    steps: [
      "Associe cada estacao do ano a um som de passaro.",
      "No sinal, cada pessoa encontra seu grupo usando apenas o som.",
      "Forme os grupos e conte cada estacao.",
      "O maior grupo vence.",
    ],
    tips: ["Demonstre os sons antes de iniciar."],
  },
  "Emotional Communication": {
    materials: ["Cartoes de emocao", "Cadeiras"],
    steps: [
      "Escolha duplas e deixe uma pessoa sentada de costas para o publico.",
      "Mostre a palavra de emocao apenas para quem vai atuar.",
      "A pessoa atua sem falar ate o parceiro acertar.",
      "Troque papeis e some pontos.",
    ],
    tips: ["Escolha voluntarios dispostos a atuar com energia."],
  },
  "Frozen T-Shirts": {
    materials: ["Camisetas congeladas e dobradas", "Cronometro"],
    steps: [
      "Congele camisetas previamente.",
      "Explique que vence quem vestir primeiro.",
      "No sinal, todos tentam abrir e vestir a camiseta congelada.",
      "Anuncie os vencedores.",
    ],
    tips: ["Use camisetas grandes para facilitar e evitar desconforto."],
  },
  "Donkey Dodgeball": {
    materials: ["Bolas macias", "Cones de limite", "Cronometro"],
    steps: ["Divida equipes em lados opostos.", "Jogue rodadas curtas de eliminacao com regras claras.", "Valide eliminacoes com lideres nas laterais.", "Reinicie com rotacao rapida."],
  },
  "Double Trouble": {
    materials: ["Material conforme pagina de origem", "Espaco aberto"],
    steps: ["Explique o objetivo e as regras da variacao.", "Use duplas para cada equipe.", "Aplique pontuacao por rodada.", "Troque duplas entre rodadas."],
  },
  "Extreme Elimination": {
    materials: ["Bolas macias", "Area marcada"],
    steps: ["Defina area de jogo e zonas seguras.", "Jogue por eliminacao em rodadas de tempo.", "Reentrada controlada entre rodadas.", "Some pontos por equipe."],
  },
  "Fake Out": {
    materials: ["Bolas leves", "Cones"],
    steps: ["Monte dois lados e linha central.", "Use fintas e passes para confundir oponente.", "Pontue por alvos ou eliminacoes validas.", "Reinicie rapidamente cada rodada."],
  },
  "Hockey Encounter": {
    materials: ["Tacos plasticos", "Bola leve", "Gols/cones"],
    steps: ["Monte mini-area de hockey.", "Defina limite de contato e seguranca.", "Jogue rodadas curtas com goleiros.", "Pontue e troque linhas."],
  },
  "Hot Potato Tag": {
    materials: ["Objeto leve", "Musica opcional"],
    steps: ["Passe o objeto enquanto o grupo se move.", "Quem estiver com objeto no sinal entra no pega.", "Pega curto de 30-45s.", "Reinicie com novo lider."],
  },
  "Huddle Up": {
    materials: ["Cartoes de acao"],
    steps: ["Forme pequenos grupos.", "Cada grupo recebe desafio rapido.", "Cumpram juntos dentro do tempo.", "Apresente resultado para todos."],
  },
  "Marshmallow Drop": {
    materials: ["Marshmallows", "Recipientes de alvo"],
    steps: ["Defina ponto de arremesso.", "Jogadores tentam acertar alvos com marshmallows.", "Pontue por acerto limpo.", "Some por equipe no fim."],
  },
  "The Noodle Game": {
    materials: ["Espaguetes de piscina", "Cones"],
    steps: ["Entregue noodles por equipe.", "Cumpra desafio de transporte/controle.", "Penalize saídas da area.", "Vence maior pontuacao."],
  },
  "Pillow Fight": {
    materials: ["Travesseiros macios", "Area segura delimitada"],
    steps: ["Explique regras de contato seguro.", "Duelos curtos por tempo.", "Vence por equilibrio/controle.", "Rotacione participantes."],
  },
  "Silly String War": {
    materials: ["Latas de silly string", "Oculos de protecao"],
    steps: ["Defina area e limites.", "Rodada com alvo por equipe.", "Pare ao sinal e conte acertos.", "Reinicie com novas duplas/alvos."],
  },
  "Toilet Paper Chaos": {
    materials: ["Rolos de papel higienico"],
    steps: ["Distribua rolos por equipe.", "Cumpram desafio de montagem/envolvimento.", "Tempo curto e pontuacao visual.", "Limpeza rapida ao fim."],
  },
  "Tube Duel": {
    materials: ["Tubos de espuma", "Area de duelo"],
    steps: ["Duplas entram na area marcada.", "Objetivo: toque valido sem contato perigoso.", "Melhor de 3 para cada duelo.", "Pontuacao por equipe."],
  },
  "Tunnel Vision": {
    materials: ["Cones", "Objetos de alvo"],
    steps: ["Monte percurso em formato de tunel.", "Jogadores atravessam e completam alvo final.", "Cronometre por equipe.", "Menor tempo total vence."],
  },
  "Ultimate Dodgeball": {
    materials: ["Varias bolas macias", "Cones de limite"],
    steps: ["Configure formato classico de dodgeball.", "Eliminacao por acerto/captura validos.", "Rodadas de 3-5 minutos.", "Pontue vitorias por rodada."],
  },
  "Spider Relay": {
    materials: ["Marcadores de percurso", "Espaco aberto"],
    steps: ["Forme equipes em linha.", "Corredores fazem percurso em estilo 'aranha' definido pelo lider.", "Toque no proximo corredor ao voltar.", "Menor tempo total vence."],
  },
  "Frisbee Relay": {
    materials: ["Frisbees", "Cones"],
    steps: ["Defina percurso com estacoes.", "Jogador avanca apenas apos passe/alvo valido.", "Revezamento continua ate finalizar percurso.", "Equipe mais rapida vence."],
  },
  "Bible Scavenger Hunt": {
    materials: ["Biblias", "Lista de pistas", "Canetas"],
    steps: ["Entregue pistas com referencias biblicas.", "Equipes localizam respostas e registram.", "Tempo limitado para concluir lista.", "Pontue por acertos e velocidade."],
  },
  "Centipede Relay": {
    materials: ["Area marcada"],
    steps: ["Equipes formam 'centopeia' em fila conectada.", "Deslocam juntas no percurso sem quebrar formacao.", "Se quebrar, para e reorganiza.", "Vence quem concluir primeiro."],
  },
  "Team Dodgeball": {
    materials: ["Bolas macias", "Cones de limite"],
    steps: ["Divida em duas equipes com zonas definidas.", "Jogue por eliminacao/captura valida.", "Rodadas curtas com reinicio rapido.", "Pontue vitorias por rodada."],
  },
  "Blindfold Football": {
    materials: ["Vendas", "Bola macia", "Lideres guias"],
    steps: ["Jogadores vendados seguem comandos dos guias.", "Equipe tenta avancar bola com seguranca.", "Contato limitado e controlado.", "Pontuacao por progresso/objetivo."],
    tips: ["Use espaco amplo e supervisao alta."],
  },
  "Fireman's Fun Relay": {
    materials: ["Cones", "Itens de relay"],
    steps: ["Monte etapas de relay com desafios fisicos leves.", "Cada jogador completa etapa e retorna.", "Toque inicia proximo participante.", "Equipe com menor tempo vence."],
  },
  "Greedy Ball": {
    materials: ["Bolas", "Zonas de pontuacao"],
    steps: ["Bolas entram em jogo em area central.", "Equipes coletam e movem para sua zona.", "Acoes de defesa permitidas sem contato perigoso.", "Vence quem tiver mais bolas ao final."],
  },
};

const enGameContent: Record<string, GameLocalePack> = {
  "Donkey Dodgeball": {
    materials: ["Soft dodgeballs", "Boundary cones", "Timer"],
    steps: ["Split teams on opposite sides.", "Play elimination rounds with strict safety rules.", "Leaders validate eliminations.", "Reset quickly between rounds."],
    tips: ["Use low-impact throws only.", "Keep rounds short for high engagement."],
  },
  "Double Trouble": {
    materials: ["Source-specific props", "Open play area"],
    steps: ["Brief teams on the variation objective.", "Run in pairs.", "Score each round visibly.", "Rotate pairings often."],
  },
  "Extreme Elimination": {
    materials: ["Soft balls", "Marked field"],
    steps: ["Define lanes, boundaries, and safe zones.", "Run timed elimination rounds.", "Allow controlled re-entry each round.", "Total team points for final score."],
  },
  "Fake Out": {
    materials: ["Light balls", "Cones"],
    steps: ["Set opposing sides and center line.", "Use fakes and quick transitions to create openings.", "Score by target hits or valid tags.", "Restart immediately after each point."],
  },
  "Hockey Encounter": {
    materials: ["Plastic sticks", "Light ball", "Cone goals"],
    steps: ["Set mini-hockey area.", "Enforce no-contact rules.", "Play short scored rounds.", "Rotate lines between rounds."],
  },
  "Hot Potato Tag": {
    materials: ["Light object", "Optional music"],
    steps: ["Pass object while players move.", "Whoever has object on signal enters tag phase.", "Run 30-45 second tag phase.", "Reset with new starter."],
  },
  "Huddle Up": {
    materials: ["Prompt cards"],
    steps: ["Form small teams.", "Give each team a fast challenge prompt.", "Complete challenge under time cap.", "Share outcome with room."],
  },
  "Marshmallow Drop": {
    materials: ["Marshmallows", "Target containers"],
    steps: ["Set throw line and targets.", "Players attempt accurate drops.", "Score clean hits.", "Total team points."],
  },
  "The Noodle Game": {
    materials: ["Pool noodles", "Cones"],
    steps: ["Distribute noodles per team.", "Run balance/transport challenge.", "Apply boundary penalties.", "Highest score wins."],
  },
  "Pillow Fight": {
    materials: ["Soft pillows", "Safe duel area"],
    steps: ["Review safe-contact rules.", "Run short duel rounds.", "Win by control or valid touches.", "Rotate participants."],
  },
  "Silly String War": {
    materials: ["Silly string cans", "Eye protection"],
    steps: ["Mark battle zones.", "Run team-vs-team spray rounds.", "Stop on whistle and count valid hits.", "Rotate teams and restart."],
  },
  "Toilet Paper Chaos": {
    materials: ["Toilet paper rolls"],
    steps: ["Distribute rolls by team.", "Run wrap/build challenge variation.", "Score by completion and creativity.", "Reset and clean quickly."],
  },
  "Tube Duel": {
    materials: ["Foam tubes", "Marked duel lane"],
    steps: ["Pairs enter lane.", "Score safe legal touches.", "Play best-of-three bouts.", "Total points by team."],
  },
  "Tunnel Vision": {
    materials: ["Cones", "Target objects"],
    steps: ["Build tunnel-style course.", "Players complete course and final objective.", "Track times by team.", "Lowest total wins."],
  },
  "Ultimate Dodgeball": {
    materials: ["Multiple soft balls", "Boundary cones"],
    steps: ["Set standard dodgeball format.", "Eliminate by valid hits/catches.", "Play 3-5 minute rounds.", "Track round wins."],
    tips: ["Use multiple refs for larger groups."],
  },
  "Meet Your Colleagues": {
    materials: ["Prompt cards"],
    steps: ["Pair people who do not know each other well.", "Run timed introductions.", "Rotate pairs and repeat.", "Share quick highlights."],
  },
  "Name That Flower": {
    materials: ["Clue list"],
    steps: ["Read clues tied to flower names.", "Players guess individually or in teams.", "Score each correct answer.", "Review at the end."],
  },
  "Race for the Runts": {
    materials: ["Small candies", "Collection bowls"],
    steps: ["Teams relay to collect one candy each trip.", "Tag next teammate on return.", "Continue until timer ends.", "Most collected wins."],
  },
  "Simon Says": {
    materials: ["None"],
    steps: ["Leader calls commands with and without trigger phrase.", "Players follow only valid commands.", "Misses step out for round.", "Repeat quick rounds."],
  },
  "Splash Balls": {
    materials: ["Water balls or sponges", "Buckets"],
    steps: ["Teams relay wet objects to fill bucket.", "Run multiple timed rounds.", "Measure bucket level.", "Highest fill wins."],
  },
  "Spider Relay": {
    materials: ["Course markers", "Open field"],
    steps: ["Line teams for relay starts.", "Runners complete leader-defined spider movement pattern.", "Tag next runner on return.", "Lowest total time wins."],
  },
  "Frisbee Relay": {
    materials: ["Frisbees", "Cones"],
    steps: ["Build relay course with throwing stations.", "Advance only after valid pass/target hit.", "Continue until full team completes route.", "Fastest team wins."],
  },
  "Bible Scavenger Hunt": {
    materials: ["Bibles", "Clue sheets", "Pens"],
    steps: ["Distribute clue sheets with Bible references.", "Teams locate answers and record them.", "Run on a strict timer.", "Score by accuracy plus completion speed."],
  },
  "Centipede Relay": {
    materials: ["Marked lane"],
    steps: ["Teams form connected centipede lines.", "Move through route without breaking formation.", "If line breaks, stop and reconnect.", "First team through wins."],
  },
  "Team Dodgeball": {
    materials: ["Soft dodgeballs", "Boundary cones"],
    steps: ["Split two teams with clear boundaries.", "Play elimination/catch rules.", "Use short rounds with quick resets.", "Track round wins."],
  },
  "Blindfold Football": {
    materials: ["Blindfolds", "Soft football", "Guide leaders"],
    steps: ["Blindfold players and assign verbal guides.", "Move ball by guided teamwork.", "Maintain low-contact safety rules.", "Score by controlled progress/objective."],
    tips: ["Requires extra leaders and clear stop commands."],
  },
  "Fireman's Fun Relay": {
    materials: ["Cones", "Relay props"],
    steps: ["Set multi-stage relay tasks.", "Each runner completes stage and returns.", "Tag next participant.", "Lowest team time wins."],
  },
  "Greedy Ball": {
    materials: ["Balls", "Scoring zones"],
    steps: ["Release balls into center play zone.", "Teams collect and transfer to scoring zone.", "Allow safe defensive disruption.", "Most balls at end wins."],
  },
  "Broom Barrel Ball": {
    materials: ["Broom handles", "Barrels or targets", "Soft ball"],
    steps: ["Set lanes and target barrels.", "Players advance ball with broom control.", "Score by target hits or completions.", "Rotate players each round."],
  },
  "Crazy Croquet": {
    materials: ["Cones/chairs as wickets", "Variant movement props"],
    steps: ["Lay out croquet-style route.", "Run creative movement variations through wickets.", "Complete route and tag next player.", "Fastest completion wins."],
  },
  "Dodge 'em Pit": {
    materials: ["Soft dodgeballs", "Marked play pit"],
    steps: ["Create central pit zone.", "Players avoid and throw under controlled rules.", "Eliminate or score by valid hits.", "Reset frequently for pace."],
  },
  "Human Boggle": {
    materials: ["Letter cards", "Floor grid markers"],
    steps: ["Build human letter grid.", "Teams form words by moving players in sequence.", "Score by valid words and length.", "Rotate letters between rounds."],
  },
  "Large Group Battleship": {
    materials: ["Grid layout", "Call cards"],
    steps: ["Set giant coordinate grid.", "Teams place ships secretly.", "Call coordinates to locate hits.", "Last team with ships afloat wins."],
  },
  "Playdoughnary": {
    materials: ["Playdough", "Prompt cards", "Timer"],
    steps: ["Players sculpt prompt with no words.", "Team guesses within timer.", "Score for correct guesses.", "Rotate sculptors each round."],
  },
  "Tag-a-Lot": {
    materials: ["Open room", "Boundary markers"],
    steps: ["Choose taggers and boundaries.", "Run timed tag rounds.", "Tagged players follow rule variation.", "Rotate taggers often."],
  },
  "Tic-Tac-Challenge": {
    materials: ["Tic-tac-toe board markers", "Relay markers"],
    steps: ["Teams run relay to place marks on giant board.", "One mark per trip.", "First to complete line wins.", "Reset for rematch."],
  },
  "Tongue Twister Challenge": {
    materials: ["Tongue twister cards", "Timer"],
    steps: ["Players draw and perform twist phrase.", "Award points for clean delivery.", "Team totals decide winner.", "Use escalating difficulty rounds."],
  },
  "Video Concentration": {
    materials: ["Screen clips", "Answer sheets"],
    steps: ["Show short clips or visual prompts.", "Teams record details and answers.", "Score by recall accuracy.", "Review answers at end."],
  },
  "Fireman vs. Police": {
    materials: ["Team identifiers", "Mission cards", "Open space"],
    steps: ["Assign roles and objective zones.", "Teams complete role-based capture/recovery goals.", "Use timed rounds.", "Score each mission outcome."],
  },
  "Paper Plate Shuffle": {
    materials: ["Paper plates"],
    steps: ["Players use plates as stepping tools.", "Advance across area without touching floor.", "Relay format by team.", "Fastest complete team wins."],
  },
  "Line It Up": {
    materials: ["Prompt criteria"],
    steps: ["Call criteria (birthday, shoe size, etc.).", "Teams line up correctly as fast as possible.", "Check accuracy before scoring.", "Repeat with new prompts."],
  },
  "Spider Fight": {
    materials: ["Open space", "Boundary markers"],
    steps: ["Players use low movement stance for tag/duel objective.", "Short head-to-head rounds.", "Winners rotate forward.", "Track cumulative wins."],
  },
  Ninja: {
    materials: ["Open circle area"],
    steps: ["Players stand in circle and take turn strikes/blocks.", "One motion per turn.", "Hit hand = eliminated.", "Last player wins."],
  },
  "Lettuce Bowling": {
    materials: ["Head of lettuce", "Pins or bottles"],
    steps: ["Set bowling lane and pins.", "Roll lettuce to knock pins.", "Score by pin count.", "Multiple rounds per player."],
  },
  "Mine Field": {
    materials: ["Obstacles", "Blindfolds"],
    steps: ["Scatter safe obstacles as minefield.", "One partner blindfolded, one guide gives commands.", "Complete route with fewest penalties.", "Switch roles and repeat."],
  },
  "Longest Line": {
    materials: ["None"],
    steps: ["Teams create longest continuous line using available items.", "Set strict time limit.", "Measure final lines.", "Longest valid line wins."],
  },
  "Clothes Pin Tag": {
    materials: ["Clothespins"],
    steps: ["Each player starts with clothespins attached.", "Steal pins from others while protecting your own.", "Round ends on whistle.", "Most pins wins."],
  },
  "Triangle Tag": {
    materials: ["None"],
    steps: ["Groups of three hold triangle spacing.", "Tagger tries to reach designated target player.", "Team movement protects target.", "Rotate roles often."],
  },
  "Toe Fencing": {
    materials: ["Open flat floor"],
    steps: ["Pairs face each other and try toe taps.", "No pushing or unsafe contact.", "Best-of rounds scoring.", "Rotate opponents."],
  },
  "Human Battleship": {
    materials: ["Large coordinate grid"],
    steps: ["Teams hide ship positions on human grid.", "Opponents call coordinates.", "Mark hits and misses.", "Last fleet standing wins."],
  },
  "Quick Draw": {
    materials: ["Prompt cards", "Paper", "Markers", "Timer"],
    steps: ["Show prompt and start short draw timer.", "Reveal drawings simultaneously.", "Award points for recognizability/creativity.", "Repeat multiple rounds."],
  },
};

function getLocalizedGameContent(game: Game, language: Language): GameLocalePack {
  if (language === "en") {
    const translated = enGameContent[game.name];
    if (translated) {
      return {
        materials: translated.materials ?? game.materials,
        steps: translated.steps ?? game.steps,
        tips: translated.tips ?? game.tips,
      };
    }
    return {
      materials: game.materials,
      steps: game.steps,
      tips: game.tips,
    };
  }

  const translated = ptGameContent[game.name];
  if (translated) {
    return {
      materials: translated.materials ?? game.materials,
      steps: translated.steps ?? game.steps,
      tips: translated.tips ?? game.tips,
    };
  }

  return {
    materials: game.materials,
    steps: game.steps,
    tips: game.tips,
  };
}

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
  detailLevel: "detailed",
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
  {
    name: "Birds of a Feather Flock Together",
    kind: "Icebreaker",
    detailLevel: "detailed",
    source: "Warm ups, mixers, crowd breakers.pdf",
    sourcePage: 5,
    time: "8-12 min",
    players: "10-60",
    tags: ["Discussion", "Indoor", "Low prep", "High energy"],
    materials: ["Open room"],
    steps: [
      "Assign each birth season to a bird sound.",
      "On signal, players find others from their season using only that sound.",
      "Groups form and you count each season group.",
      "Largest season group wins.",
    ],
    tips: ["Demonstrate each sound first.", "Set a short time limit to keep energy up."],
  },
  {
    name: "Emotional Communication",
    kind: "Icebreaker",
    detailLevel: "detailed",
    source: "Warm ups, mixers, crowd breakers.pdf",
    sourcePage: 6,
    time: "10-15 min",
    players: "10-40",
    tags: ["Discussion", "Indoor", "Low prep", "Teamwork"],
    materials: ["Emotion cards", "Chairs"],
    steps: [
      "Pick pairs and seat one person from each pair facing away from the crowd.",
      "Show emotion word to standing partner only.",
      "Standing partner acts emotion silently until seated partner guesses.",
      "Rotate roles and keep score by pair.",
    ],
    tips: ["Choose expressive volunteers.", "Use words that are age-appropriate and clear."],
  },
  {
    name: "Frozen T-Shirts",
    kind: "Icebreaker",
    detailLevel: "detailed",
    source: "Warm ups, mixers, crowd breakers.pdf",
    sourcePage: 8,
    time: "8-12 min",
    players: "4-20",
    tags: ["High energy", "Indoor", "Teamwork"],
    materials: ["Frozen folded T-shirts", "Stopwatch"],
    steps: [
      "Freeze folded T-shirts ahead of time.",
      "Bring contestants up and explain first person to put shirt on wins.",
      "Start timer and let players unfold and wear frozen shirts.",
      "Award winners and debrief with crowd.",
    ],
    tips: ["Use oversized shirts for safety and speed.", "Keep towels nearby for melted water."],
  },
  {
    name: "Meet Your Colleagues",
    kind: "Icebreaker",
    detailLevel: "title-only",
    source: "Warm ups, mixers, crowd breakers.pdf",
    sourcePage: 11,
    time: "8-15 min",
    players: "8-30",
    tags: ["Discussion", "Indoor", "Low prep"],
    materials: ["Optional prompt cards"],
    steps: [
      "Pair people who do not know each other well.",
      "Give a short prompt and 2 minutes to share.",
      "Switch pairs and repeat with a new prompt.",
      "Invite 2-3 highlights to share with group.",
    ],
    tips: ["Use easy first prompts, then go a bit deeper."],
  },
  {
    name: "Name That Flower",
    kind: "Icebreaker",
    detailLevel: "title-only",
    source: "Warm ups, mixers, crowd breakers.pdf",
    sourcePage: 12,
    time: "8-12 min",
    players: "8-30",
    tags: ["Discussion", "Indoor", "Low prep"],
    materials: ["Flower names list"],
    steps: [
      "Read clues or descriptions tied to flower names.",
      "Players guess individually or in teams.",
      "Track points by round.",
      "Review answers quickly at the end.",
    ],
    tips: ["Use team mode for larger groups."],
  },
  {
    name: "Race for the Runts",
    kind: "Icebreaker",
    detailLevel: "title-only",
    source: "Warm ups, mixers, crowd breakers.pdf",
    sourcePage: 23,
    time: "8-12 min",
    players: "8-30",
    tags: ["High energy", "Indoor", "Teamwork"],
    materials: ["Small candy pieces", "Bowls"],
    steps: [
      "Place candy bowls at one end of room.",
      "Teams send one runner at a time to collect a piece.",
      "Runner returns and tags next teammate.",
      "Most collected pieces wins.",
    ],
    tips: ["Set clear no-running zones if floor is slick."],
  },
  {
    name: "Simon Says",
    kind: "Icebreaker",
    detailLevel: "title-only",
    source: "Warm ups, mixers, crowd breakers.pdf",
    sourcePage: 27,
    time: "6-10 min",
    players: "8-60",
    tags: ["High energy", "Indoor", "No supplies"],
    materials: ["None"],
    steps: [
      "Leader calls commands with and without phrase 'Simon says.'",
      "Players follow only valid commands.",
      "Anyone who misses command steps out for that round.",
      "Run multiple short rounds.",
    ],
    tips: ["Use fast pacing and keep commands simple."],
  },
  {
    name: "Splash Balls",
    kind: "Icebreaker",
    detailLevel: "title-only",
    source: "Warm ups, mixers, crowd breakers.pdf",
    sourcePage: 28,
    time: "8-12 min",
    players: "8-30",
    tags: ["High energy", "Outdoor", "Teamwork"],
    materials: ["Water balls or sponges", "Buckets"],
    steps: [
      "Split players into teams with a target bucket.",
      "Teams throw water balls/sponges relay-style to fill bucket.",
      "Reset and run multiple rounds.",
      "Measure water level to determine winner.",
    ],
    tips: ["Use this outside and define safe throw distance."],
  },
];

const icebreakers: Game[] = [...starterIcebreakers, ...sourcedIcebreakers];

const sourcedGroupGames: Game[] = [
  ["Battle Ball With a Twist", 2],
  ["Black Light Hockey", 3],
  ["Dash", 6],
  ["Dive In", 7],
  ["Donkey Dodgeball", 8],
  ["Double Trouble", 9],
  ["Extreme Elimination", 10],
  ["Fake Out", 11],
  ["Gotcha", 13],
  ["Hockey Encounter", 15],
  ["Hot Potato Tag", 17],
  ["Huddle Up", 18],
  ["Marshmallow Drop", 19],
  ["The Noodle Game", 20],
  ["Pillow Fight", 22],
  ["Shuffle Your Buns", 23],
  ["Silly String Elimination", 24],
  ["Silly String War", 25],
  ["Slime Dodgeball", 26],
  ["Stuff It", 28],
  ["Toilet Paper Chaos", 29],
  ["Toilet Paper Slam", 31],
  ["Total Elimination", 32],
  ["The Tower Competition", 33],
  ["Tube Duel", 35],
  ["Tunnel Vision", 36],
  ["Ultimate Dodgeball", 37],
  ["Whipped", 38],
].map((entry) => {
  const [name, sourcePage] = entry as [string, number];
  return ({
  name,
  kind: "Group Game",
  detailLevel: "title-only",
  source: "28-Just-for-Fun-Youth-Group-Games.pdf",
  sourcePage,
  time: "20-40 min",
  players: "10-35",
  tags: ["High energy", "Teamwork", "Indoor"],
  materials:
    name === "Battle Ball With a Twist"
      ? ["Playground or Nerf balls", "Orange cones", "Wide room or court"]
      : name === "Black Light Hockey"
        ? ["Plastic hockey sticks", "Black lights", "Glow necklaces", "Soft white balls", "Goals or cone goals"]
        : name === "Dash"
          ? ["Chairs", "Music", "Boundary markers"]
          : name === "Dive In"
            ? ["Marshmallows", "Buckets", "Pool or lake access"]
            : ["See source PDF", "Open play space", "Timer"],
  steps:
    name === "Battle Ball With a Twist"
      ? [
          "Split teams on opposite sides with a cone center line.",
          "Place balls across the center and start on GO.",
          "Players throw to eliminate opponents; catches eliminate throwers.",
          "Keep rounds short and rotate variation items only if safe for your setting.",
        ]
      : name === "Black Light Hockey"
        ? [
            "Darken room and prep black light setup plus glowing markers.",
            "Assign goalies and define no-go areas near goals.",
            "Play multiple 5-minute rounds with soft balls and scorekeepers.",
            "Reset teams and supplies between rounds.",
          ]
        : name === "Dash"
          ? [
              "Set a large walking boundary with chairs scattered randomly inside.",
              "Start music while players move around the outside boundary.",
              "When music stops, players dash for open chairs.",
              "Remove chairs and repeat until finalists remain.",
            ]
          : name === "Dive In"
            ? [
                "Scatter marshmallows across pool or shallow lake area.",
                "Teams collect and return marshmallows to team buckets.",
                "Run until all marshmallows are collected.",
                "Count each bucket and declare winner.",
              ]
            : [
                "Review the source PDF before the event for full setup and safety notes.",
                "Prepare the play area and supplies before students arrive.",
                "Explain boundaries, scoring, and stop signal before starting.",
                "Run short rounds and reset teams between rounds.",
              ],
  tips:
    name === "Black Light Hockey"
      ? ["Use many adult leaders to keep the chaos controlled and safe.", "Soft white balls and clear stop signals are essential."]
      : ["Use extra leaders for high-energy games.", "Choose a lower-contact game when space is tight."],
  });
});

const sourcedIndoorGames: Game[] = [
  ["Broom Barrel Ball", 90],
  ["Crazy Croquet", 92],
  ["Dodge 'em Pit", 95],
  ["Human Boggle", 97],
  ["Large Group Battleship", 98],
  ["Playdoughnary", 99],
  ["Tag-a-Lot", 106],
  ["Tic-Tac-Challenge", 109],
  ["Tongue Twister Challenge", 112],
  ["Video Concentration", 114],
].map((entry) => {
  const [name, sourcePage] = entry as [string, number];
  return ({
  name,
  kind: "Group Game",
  detailLevel: "title-only",
  source: "Indoor games and activities.pdf",
  sourcePage,
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
  });
});

const sourcedOutdoorGames: Game[] = [
  ["Hula-Hoop Group Relay", 63],
  ["One-Pitch Softball", 64],
  ["Wethead", 65],
  ["Rain in the Face Relay", 66],
  ["Spider Relay", 67],
  ["Frisbee Relay", 69],
  ["Bible Scavenger Hunt", 70],
  ["Tube Tug", 73],
  ["Centipede Relay", 76],
  ["Team Dodgeball", 78],
  ["Blindfold Football", 79],
  ["Fireman's Fun Relay", 80],
  ["Greedy Ball", 81],
  ["Human Croquet", 72],
  ["Three-Legged Soccer", 77],
].map((entry) => {
  const [name, sourcePage] = entry as [string, number];
  return ({
  name,
  kind: "Group Game",
  detailLevel: "title-only",
  source: "Outdoor games and activities.pdf",
  sourcePage,
  time: "20-40 min",
  players: "10-35",
  tags: ["Outdoor", "High energy", "Teamwork"],
  materials:
    name === "Hula-Hoop Group Relay"
      ? ["2 strong hula-hoops", "Two lines about 10 yards apart"]
      : name === "One-Pitch Softball"
        ? ["Softball setup", "Specially marked field", "Umpire with spare balls"]
        : name === "Wethead"
          ? ["Water balloons", "Marked square play zone", "Raised toss position"]
          : name === "Rain in the Face Relay"
            ? ["Two plastic buckets", "Hill next to pool/lake", "Team relay lanes"]
            : name === "Human Croquet"
              ? ["Large field", "9 wicket volunteers", "Boundary markers"]
              : name === "Three-Legged Soccer"
                ? ["Soccer goals", "Soccer balls", "Cloth ties for ankles"]
            : ["See source PDF", "Field setup", "Safety boundary markers"],
  steps:
    name === "Hula-Hoop Group Relay"
      ? [
          "Set lines roughly 10 yards apart with teams split across both lines.",
          "First player runs in hoop to far line and picks up one teammate.",
          "Pair returns and collects one more teammate each trip.",
          "First team crossing with all 5 members inside hoop wins.",
        ]
      : name === "One-Pitch Softball"
        ? [
            "Use one-pitch-per-batter rule and keep innings moving quickly.",
            "Count runs only; use modified foul/out rules from source page.",
            "Keep pitcher cadence tight with visible umpire timing.",
            "Finish by innings or time cap.",
          ]
        : name === "Wethead"
          ? [
              "Create teams in a marked area with toss leaders on platforms.",
              "Toss team-color balloons into the zone for catches.",
              "Intact catches score; interference rules apply.",
              "Count intact team-color balloons at end.",
            ]
          : name === "Rain in the Face Relay"
            ? [
                "Line teams on a hill near water source in relay order.",
                "Each player fills bucket, runs back, splashes next player, and passes bucket.",
                "First runner rotates to the end and runs final leg.",
                "Team whose final runner reaches the water first wins.",
              ]
            : name === "Human Croquet"
              ? [
                  "Mark croquet-style course and assign standing wicket volunteers.",
                  "Runners crawl through wicket legs in sequence and return.",
                  "Tag next teammate after full course completion.",
                  "Fastest team to cycle all runners wins.",
                ]
              : name === "Three-Legged Soccer"
                ? [
                    "Pair teammates and tie adjacent ankles for each pair.",
                    "Play soccer with modified movement and spacing rules.",
                    "Use one or two balls based on group size and control.",
                    "Short timed halves with rotating substitutions.",
                  ]
            : [
                "Read the source game page and prep all required equipment.",
                "Walk players through boundaries, safety, and win conditions.",
                "Run timed rounds and rotate teams.",
                "Record scores and announce results.",
              ],
  tips:
    name === "Rain in the Face Relay"
      ? ["Expect slippery ground and use strict safety spacing.", "This game works best with quick relay turns."]
      : ["Prioritize hydration and clear stop signals for outdoor rounds."],
  });
});

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
  detailLevel: "title-only",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    detailLevel: "detailed",
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
    const localized = getLocalizedGameContent(game, language);
    const isDetailed = game.detailLevel === "detailed" || Boolean(enGameContent[game.name]) || Boolean(ptGameContent[game.name]);

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
        <p className={isDetailed ? "detail-pill detailed" : "detail-pill title-only"}>
          {isDetailed ? text.detailDetailed : text.detailTitleOnly}
        </p>
        {game.source ? (
          <p className="source-meta">
            <strong>{text.sourceLabel}:</strong> {game.source}{game.sourcePage ? ` (${text.pageLabel} ${game.sourcePage})` : ""}
          </p>
        ) : null}
        <div className="tag-row compact">
          {game.tags.map((tag) => (
            <span className="tag-label" key={tag}>{tagLabels[language][tag]}</span>
          ))}
        </div>
        <p><strong>{text.materials}:</strong> {localized.materials?.join(", ")}</p>
        <ol>{localized.steps?.map((step) => <li key={step}>{step}</li>)}</ol>
        <p className="tip"><strong>{text.leaderTip}:</strong> {localized.tips?.[0]}</p>
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
