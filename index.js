const express = require('express');
const app = express();

app.use(express.json());

// Permite o front-end (arquivo local) acessar a API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ==================== BANCO DE DADOS (arrays) ====================

let games = [
  { id: 1, name: "League of Legends", genre: "MOBA" },
  { id: 2, name: "Rocket League", genre: "Esporte" },
  { id: 3, name: "Fortnite", genre: "Battle Royale" }
];

let teams = [
  { id: 1, name: "Cobras Elétricas", color: "#22c55e" },
  { id: 2, name: "Lobos de Aço", color: "#f97316" }
];

let competitors = [
  { id: 1, name: "Pedro Henrique", nickname: "PedroH", teamId: 1 },
  { id: 2, name: "Julia Ferreira", nickname: "JuFerr", teamId: 2 }
];

let matches = [
  { id: 1, gameId: 1, team1Id: 1, team2Id: 2, date: "2026-06-10T14:00", score1: 0, score2: 0, status: "scheduled" }
];

const getNextId = (arr) => arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1;

// ==================== ROTAS: GAMES ====================

app.get('/games', (req, res) => res.json(games));

app.post('/games', (req, res) => {
  const { name, genre } = req.body;
  const newGame = { id: getNextId(games), name, genre };
  games.push(newGame);
  res.status(201).json(newGame);
});

// ==================== ROTAS: TEAMS ====================

app.get('/teams', (req, res) => res.json(teams));

app.post('/teams', (req, res) => {
  const { name, color } = req.body;
  const newTeam = { id: getNextId(teams), name, color };
  teams.push(newTeam);
  res.status(201).json(newTeam);
});

// ==================== ROTAS: COMPETITORS ====================

app.get('/competitors', (req, res) => res.json(competitors));

app.post('/competitors', (req, res) => {
  const { name, nickname, teamId } = req.body;
  const newCompetitor = { id: getNextId(competitors), name, nickname, teamId: Number(teamId) };
  competitors.push(newCompetitor);
  res.status(201).json(newCompetitor);
});

// ==================== ROTAS: MATCHES ====================

app.get('/matches', (req, res) => res.json(matches));

app.post('/matches', (req, res) => {
  const { gameId, team1Id, team2Id, date, score1, score2, status } = req.body;
  const newMatch = {
    id: getNextId(matches),
    gameId: Number(gameId),
    team1Id: Number(team1Id),
    team2Id: Number(team2Id),
    date,
    score1: Number(score1) || 0,
    score2: Number(score2) || 0,
    status: status || 'scheduled'
  };
  matches.push(newMatch);
  res.status(201).json(newMatch);
});

app.put('/matches/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = matches.findIndex(m => m.id === id);
  const { score1, score2, status } = req.body;
  matches[index].score1 = Number(score1);
  matches[index].score2 = Number(score2);
  matches[index].status = status;
  res.json(matches[index]);
});

// ==================== ROTA RAIZ ====================

app.get('/', (req, res) => {
  res.send(`Bem-vindo à API E-Classes! Times: ${teams.length} | Jogos: ${games.length} | Competidores: ${competitors.length} | Confrontos: ${matches.length}`);
});

// ==================== SERVIDOR ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor E-Classes rodando em http://localhost:${PORT}`);
});