const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const maxBy = require('lodash/maxBy');
const findShortestPath = require('./findShortestPath');
const createGrid = require('./createGrid');
const db = require('./lowdb');

// Create server
const app = express();
app.use(bodyParser.json());
app.use(
  basicAuth({
    users: { admin: 'supersecret', test: 'test' },
  })
);
app.use((req, res, next) => {
  const user = req.headers.authorization.split(' ')[1];
  req.user = user;
  next(null, req, res);
});

// Create database instance and start server

// Set db default values
db.defaults({ labyrinth: [], nodes: [] }).write();

// POST /posts
app.post('/labyrinth', (req, res) => {
  const labyrinth = db
    .get('labyrinth')
    .push(req.body)
    .last()
    .assign({ id: Date.now().toString(), user: req.user })
    .write();

  res.send(labyrinth);
});

// GET /posts/:id
app.get('/labyrinth/:id', (req, res) => {
  // const user = req.headers.authorization.split(' ')[1];
  const labyrinth = db
    .get('labyrinth')
    .find({ id: req.params.id, user: req.user })
    .value();

  res.send(labyrinth || {});
});

app.put('/labyrinth/:id/playfield/:x/:y/:type', (req, res) => {
  const { params } = req;

  const node = createNode(params.x, params.y, params.type, params.id);
  res.send(node);
});

app.put('/labyrinth/:id/start/:x/:y', (req, res) => {
  const { params } = req;

  const node = createNode(params.x, params.y, 'start', params.id);
  res.send(node);
});

app.put('/labyrinth/:id/end/:x/:y', (req, res) => {
  const { params } = req;

  const node = createNode(params.x, params.y, 'end', params.id);
  res.send(node);
});

app.get('/labyrinth/:id/solution', (req, res) => {
  const nodes = db.get('nodes').filter({ labyrinth: req.params.id }).value();

  const rowCount = parseInt(maxBy(nodes, 'x').x, 10);
  const colCount = parseInt(maxBy(nodes, 'y').y, 10);

  const grid = createGrid(rowCount, colCount, nodes);
  res.send(findShortestPath([0, 0], grid));
});

app.listen(3000, () => console.log('listening on port 3000'));
