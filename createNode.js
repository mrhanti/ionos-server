const db = require('./lowdb');
// Routes
// POST /labyrinth
// GET /labyrinth/:id
// PUT /labyrinth/:id/playfield/:x/:y/:type (type is either 'empty' or 'filled'):
// PUT /labyrinth/:id/start/:x/:y
// PUT /labyrinth/:id/end/:x/:y
// GET /labyrinth/:id/solution

const createNode = (x, y, type, labyrinth) =>
  db
    .get('nodes')
    .push({
      x,
      y,
      type,
      labyrinth,
    })
    .last()
    .assign({ id: Date.now().toString() })
    .write();

module.exports = createNode;
